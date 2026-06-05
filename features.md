# Flicker — Complete Feature List

## 1. Tournament Management

### List View
- Empty state with hero CTA when no tournaments exist
- Tournament cards showing name and venue
- Click card to open detail view
- Delete tournament (hover-reveal X button on left side) with custom confirm dialog
- Tournament count displayed in list header
- "+ New" button to create tournaments

### Detail View
- Back navigation (arrow button + Escape key)
- Tournament name and venue header
- Tab bar navigation (Participants, Format, Schedule, Scoring, Rankings)

### Data Structure
```typescript
interface Tournament {
  name: string;
  venue: string;
  createdAt: number;
  categories: string[];
  teams: { name: string; category: string }[];
  formats: { [categoryName: string]: FormatConfig };
  schedule: { fields: Field[]; matches: Match[] };
}
```

## 2. Categories

- Create categories via inline input at top of Participants tab
- Rename/delete categories via edit button (pencil icon) on category tabs
- Tab-based navigation with active state highlighting
- 10-color palette cycled by index:
  - Gold (#D4A853), Coral (#E76F51), Teal (#2A9D8F), Purple (#9B5DE5), Pink (#F15BB5)
  - Blue (#00BBF9), Green (#06D6A0), Orange (#FB8500), Cyan (#00B4D8), Rose (#E63946)
- Teams filtered by selected category
- Deleting category removes all associated teams
- Renaming category updates all team assignments

## 3. Teams

### Add Teams
- Single add via modal with category dropdown
- Bulk add via textarea (one team per line)
- Teams automatically assigned to selected category

### Edit Teams
- Edit button (pencil icon) on hover
- Custom prompt modal with current team name
- Updates propagate to:
  - All matches (team1, team2 fields)
  - All format phase group entries
  - Team list

### Delete Teams
- Delete button (X icon) on hover
- Custom confirm dialog
- Removes from team list and all assignments

### Display
- Compact list layout with team icon
- Hover-reveal edit/delete buttons
- Color-coded by category

## 4. Format Configuration

### Group Stage
- Configurable number of groups (1-20, default 2)
- Configurable teams per group (1-50, default 5)
- Round-robin scheduling within groups
- Team assignment via dropdown selects
- Already-assigned teams filtered from other slots
- Delete individual groups
- Add multiple groups per phase

### Bracket/Knockout
- 2 or 4 team brackets
- Labeled matches (Final, Semifinal 1, Semifinal 2, etc.)
- Placeholder slots (e.g., "1st of Group A", "2nd of Group B")
- Dynamic placeholder options based on configured groups
- Bracket letter auto-increment (A, B, C...)
- Bracket matches displayed as cards with dropdown selects

### Combined Format
- Multiple phases supported (group + bracket)
- Add/delete phases
- Phase columns with horizontal scroll
- Each phase can contain groups or brackets
- Empty phases show "Add Group" and "Add Bracket" buttons

### Match Duration
- Per-category setting (default 10 minutes, range 1-120)
- Input field in Format tab
- Used in schedule time calculations
- Stored in `formats[category].matchDuration`

### Data Structure
```typescript
interface FormatConfig {
  matchDuration: number;
  phases: Phase[];
}

interface Phase {
  name: string;
  type: 'group' | 'bracket' | 'knockout';
  groups?: Group[];
  bracketTeams?: 2 | 4;
  bracketLetter?: string;
  matches?: BracketMatch[];
}

interface Group {
  name: string;
  entries: (string | null)[];
}

interface BracketMatch {
  id: string;
  name: string;
  label: string;
  slots: { placeholder: string | null }[];
}
```

## 5. Schedule Management

### Playing Fields
- Add fields with name and start time
- Edit field name and start time via prompts
- Delete field (removes all associated matches)
- Clear all matches from field
- Fields displayed as vertical columns
- Horizontal scroll for multiple fields

### Fixture Generation
- Select groups/brackets via checkboxes
- "Select All" checkbox for quick selection
- Select target field from dropdown
- Generate fixtures button
- Matches auto-assigned to selected field
- Round-robin algorithm avoids consecutive matches

### Match Management
- Drag-and-drop reordering within field
- Move matches between fields via drag
- Delete individual matches (X button on hover)
- Clear all matches from field
- Matches sorted by time within field

### Breaks
- Add break at end of field
- Editable duration (minutes, default 10)
- Visual distinction (purple dashed border, "BREAK" label)
- Auto-time recalculation when duration changes
- Delete breaks like regular matches

### Time Calculation
- Auto-calculate based on match duration per category
- Account for breaks between matches
- "Recalculate All Times" button for manual trigger
- Update on break duration change
- Time format: HH:MM (24-hour)

### Data Structure
```typescript
interface Field {
  id: string;
  name: string;
  startTime: string;
}

interface Match {
  id: string;
  fieldId: string;
  time: string;
  team1: string;
  team2: string;
  category: string;
  group: string;
  score1?: number;
  score2?: number;
  status?: 'pending' | 'ongoing' | 'done';
  isBreak?: false;
}

interface BreakMatch {
  id: string;
  fieldId: string;
  time: string;
  isBreak: true;
  duration: number;
}
```

## 6. Live Scoring

### Match Cards
- Grouped by field (each field is a section)
- Field header with colored name (cycles through palette)
- 4-column grid layout
- Team names with score inputs
- +/- buttons visible only when match is ongoing
- Category + group info chip
- Status button (Start/Ongoing/Done)
- Reset button

### Score Tracking
- Number inputs with custom +/- controls
- Browser default spinners hidden
- Score validation (non-negative integers)
- Winner highlighting (gold background + left border)
- Ongoing match glow animation (green pulsing edges)

### Status Flow
- **Start** → **Ongoing**: Card gets green pulsing glow, +/- buttons appear
- **Ongoing** → **Done**: Static gold border, winner highlighted, buttons hidden
- **Reset**: Clears scores and status, returns to pending state

### Break Cards
- Show duration with editable input
- Purple dashed border theme
- Cannot be marked as ongoing/done
- Displayed between match cards

### Visual Feedback
- `glow-pulse` animation for ongoing matches
- `beat` animation for ongoing button
- Smooth transitions on status changes
- Winner highlight with gold accent

## 7. Rankings & Standings

### Calculation
- Auto-calculated per category
- Groups completed matches by category
- Points system: 2 points for win, 1 point for loss
- Sort by points (descending), then games won (descending)

### Display
- Each category is a separate section
- Category header with colored name
- Table columns: #, Team, P (Played), W (Wins), L (Losses), Games (W-L), Pts (Points)
- Responsive design for mobile
- Gold color for rank numbers and points

### Data Displayed
- **P**: Total matches played
- **W**: Matches won
- **L**: Matches lost
- **Games**: Score difference (e.g., "5-3")
- **Pts**: Total points (2*W + 1*L)

## 8. Cloud Sync

### Architecture
- Cloudflare Worker backend (`flicker-sync.ryanace-ruiz.workers.dev`)
- GitHub as storage (data.json in repository)
- localStorage as browser cache
- GitHub Personal Access Token stored as Cloudflare secret

### Sync Behavior
- Auto-sync on changes (2-second debounce)
- Fetch on app startup (cloud data wins if available)
- Push after every `saveTournaments()` call
- Offline fallback to localStorage
- Last-write-wins conflict resolution

### Sync Indicator
- Fixed position top-right corner
- Status states:
  - **Syncing**: Gold dot, pulsing animation, "Syncing..." text
  - **Synced**: Green dot, "Synced" text
  - **Error**: Red dot, "Sync Error" text
  - **Offline**: Gray dot, "Offline" or "Local Only" text
- Smooth transitions between states

### Security
- GitHub token never exposed in browser code
- Token stored securely in Cloudflare secrets
- Only worker can access token
- All requests over HTTPS
- Worker validates requests

### Cost
- Cloudflare Workers free tier: 100,000 requests/day
- Sufficient for personal use

## 9. UI/UX

### Custom Modal System
- Replace browser native `prompt()` and `confirm()`
- Smooth scale + fade animations
- Keyboard support (Enter to confirm, Escape to cancel)
- Styled with dark theme colors
- Two variants: prompt (with input) and confirm (with message)

### Visual Design
- Dark theme with gold and purple accents
- Noise texture overlay (SVG filter)
- Fonts: Archivo Black (headings) + DM Sans (body)
- CSS custom properties for all colors, radii, spacing
- Hover effects and transitions throughout
- Category color coding with 10-color palette

### Responsive Design
- Mobile-first approach
- Desktop: 1500px max-width
- Horizontal scroll for phases and fields
- Grid layouts adapt to screen size:
  - Scoring: 4 columns (desktop) → 3 → 2 → 1 (mobile)
  - Format phases: horizontal scroll on mobile
  - Fields: horizontal scroll on mobile

### Interactions
- Hover-reveal buttons (delete, edit)
- Drag-and-drop for matches
- Smooth transitions (0.25s ease)
- Visual feedback on all actions
- Card hover effects (lift + border color change)
- Button hover states

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Focus indicators on inputs
- Aria labels on icon buttons
- High contrast text

## 10. Smart Scheduling Algorithm

### Round-Robin Ordering
**Problem**: Sequential match generation (1v2, 1v3, 1v4...) causes teams to play consecutively.

**Solution**: Greedy algorithm to maximize rest between matches.

**Algorithm**:
```javascript
function generateRoundRobinSchedule(teams) {
  // 1. Generate all possible matches
  const allMatches = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      allMatches.push({ team1: teams[i], team2: teams[j] });
    }
  }
  
  // 2. Greedy ordering: pick matches where neither team played last
  const scheduled = [];
  const remaining = [...allMatches];
  let lastTeams = new Set();
  
  while (remaining.length > 0) {
    // Find match where neither team played in last match
    let bestMatchIndex = remaining.findIndex(m => 
      !lastTeams.has(m.team1) && !lastTeams.has(m.team2)
    );
    
    // If no such match, pick first available
    if (bestMatchIndex === -1) bestMatchIndex = 0;
    
    const match = remaining.splice(bestMatchIndex, 1)[0];
    scheduled.push(match);
    lastTeams = new Set([match.team1, match.team2]);
  }
  
  return scheduled;
}
```

**Result**: Teams get adequate rest. Example with 5 teams:
1. A vs B
2. C vs D (A,B rest)
3. A vs E (C,D rest)
4. B vs C (A,E rest)
5. A vs D (B,C rest)

## 11. Data Migration

### ensureTournamentData()
Handles migration from old data formats:
- Adds missing `categories` array
- Adds missing `teams` array
- Converts string teams to object format: `{ name: string, category: string }`
- Adds missing `formats` object
- Adds missing `schedule` object with `fields` and `matches` arrays

### Backward Compatibility
- Old tournaments (pre v2) automatically migrated on access
- No data loss during migration
- Seamless upgrade path

## 12. Technical Implementation

### Architecture
- Single-file app: `index.html` (~4700 lines)
- HTML structure + inline CSS `<style>` + inline JS `<script>`
- No build step, no dependencies, no frameworks
- Vanilla JavaScript only

### Storage
- Primary: localStorage (`flicker_tournaments` key)
- Secondary: Cloud sync via Cloudflare Worker
- Cache strategy: Cloud wins on load, local changes push to cloud

### Performance
- Debounced sync (2 seconds)
- Efficient DOM updates (innerHTML replacement)
- CSS animations (GPU-accelerated)
- Minimal reflows

### Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with localStorage and fetch support

### External Dependencies
- Google Fonts: Archivo Black + DM Sans (requires internet on first load)
- Cloudflare Worker for sync (requires internet)

### Deployment
- Cloudflare Pages: https://flicker-tournament-manager.pages.dev/
- Auto-deploys from GitHub on push
- No server-side rendering
- Static HTML file

## 13. File Structure

```
Flicker-tournament-manager/
├── index.html              # Complete application (HTML + CSS + JS)
├── worker.js               # Cloudflare Worker for sync
├── wrangler.toml           # Worker configuration
├── README.md               # Project documentation
├── AGENTS.md               # AI agent guidelines
├── SKILL.md                # Design system documentation
├── SYNC_SETUP.md           # Cloud sync setup guide
├── features.md             # This file
├── .gitignore              # Git ignore rules
└── backup/                 # Manual backups (gitignored)
```

## 14. Known Limitations

- No multi-user support (single shared dataset)
- No data export/import (yet)
- Bracket placeholders require manual selection (no auto-resolution from standings)
- Last-write-wins sync (no conflict resolution)
- No match history tracking
- No player statistics
- No tournament templates
- No print-friendly views
- No PWA/offline support
- Browser-dependent storage (clearing localStorage loses data)

## 15. Future Enhancements

- [ ] Data export/import (JSON)
- [ ] Auto-resolve bracket placeholders from group standings
- [ ] Conflict resolution (timestamp-based merging)
- [ ] Multi-user support with authentication
- [ ] Match history tracking
- [ ] Player/team statistics
- [ ] Tournament templates
- [ ] Print-friendly views
- [ ] PWA support for offline use
- [ ] Real-time collaboration (WebSocket)
- [ ] Mobile app version

---

**Version**: 0.1.0  
**Last Updated**: 2026-06-05  
**Live URL**: https://flicker-tournament-manager.pages.dev/
