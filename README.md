# 🏸 Flicker - Tournament Manager

A lightweight, single-file badminton tournament management application. No build step, no server, no dependencies - just open and play!

## ✨ Features

### Tournament Management
- Create and manage multiple tournaments
- Organize teams by categories (Singles, Doubles, Mixed, etc.)
- Add teams individually or in bulk (one per line)
- Edit and delete teams with automatic updates across all matches

### Format Configuration
- **Group Stage**: Round-robin format with customizable number of groups and teams per group
- **Knockout Bracket**: Single elimination with 2 or 4 team brackets
- **Combined Format**: Group stage followed by knockout rounds
- **Match Duration**: Set custom match duration per category (default: 10 minutes)
- **Smart Scheduling**: Automatic match ordering to avoid consecutive games for the same team

### Schedule Management
- Multiple playing fields/courts support
- Drag-and-drop match reordering
- Break management with customizable duration
- Automatic time calculation based on match duration and breaks
- Generate fixtures for selected groups/brackets

### Live Scoring
- Real-time score tracking with +/- controls
- Match status: Start → Ongoing → Done
- Visual indicators for ongoing matches (glowing edges)
- Winner highlighting in completed matches
- Reset functionality for matches

### Rankings & Standings
- Automatic standings calculation per category
- Points system: 2 points for win, 1 point for loss
- Sorted by points, then games won
- Displays: Played, Wins, Losses, Games (won-lost), Points

## 🚀 Getting Started

### Quick Start
1. Download `index.html`
2. Open it in any modern web browser
3. Start creating tournaments!

That's it. No installation, no setup, no server required.

### Browser Compatibility
- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with localStorage support

## 📖 How to Use

### 1. Create a Tournament
- Click "+ New" button
- Enter tournament name and venue
- Click "Create Tournament"

### 2. Add Teams
- Go to **Participants** tab
- Create categories (e.g., "Men's Singles", "Women's Doubles")
- Click "+ Add Teams" to add teams to a category
- Use bulk add for multiple teams (one per line)

### 3. Set Up Format
- Go to **Format** tab
- Select a category
- Choose format: Group Stage, Knockout, or Group + Knockout
- Configure groups and brackets
- Set match duration for the category

### 4. Create Schedule
- Go to **Schedule** tab
- Add playing fields (courts) with start times
- Select groups/brackets to generate fixtures
- Choose a field and click "Generate Fixtures"
- Drag matches to reorder or move between fields
- Add breaks between matches as needed

### 5. Score Matches
- Go to **Scoring** tab
- Click "Start" on a match to begin
- Use +/- buttons to adjust scores
- Click "Ongoing" to mark as complete
- Reset matches if needed

### 6. View Rankings
- Go to **Rankings** tab
- View standings for each category
- See wins, losses, games, and points

## 💾 Data Storage

All data is stored locally in your browser using `localStorage`. 

- **Storage Key**: `flicker_tournaments`
- **Persistence**: Data persists across browser sessions
- **Backup**: Use browser export or copy `index.html` with data
- **Clear Data**: Clear browser localStorage to reset

⚠️ **Note**: Data is stored per browser/per device. Clearing browser data will delete all tournaments.

## 🎨 Design

- **Theme**: Dark mode with gold and purple accents
- **Font**: Archivo Black (headings) + DM Sans (body)
- **Layout**: Responsive, works on desktop and mobile
- **Animations**: Smooth transitions and visual feedback

## 🛠️ Tech Stack

- **HTML5** - Single file application
- **CSS3** - Custom properties, flexbox, grid
- **Vanilla JavaScript** - No frameworks or libraries
- **localStorage** - Client-side data persistence
- **Google Fonts** - Archivo Black + DM Sans

## 📝 Development

The entire application is contained in a single `index.html` file (~4500 lines). This includes:
- HTML structure
- CSS styles (inline `<style>`)
- JavaScript logic (inline `<script>`)

### File Structure
```
Flicker-tournament-manager/
├── index.html          # Complete application
├── README.md           # This file
├── AGENTS.md           # AI agent guidelines
├── SKILL.md            # Design system documentation
└── .gitignore          # Git ignore rules
```

## 🐛 Known Limitations

- No cloud sync (local storage only)
- No multi-user support
- No data export/import (yet)
- Browser-dependent storage

## 🔮 Future Enhancements

- [ ] Data export/import (JSON)
- [ ] Cloud sync option
- [ ] Match history tracking
- [ ] Player statistics
- [ ] Tournament templates
- [ ] Print-friendly views
- [ ] PWA support for offline use

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Credits

Created with ❤️ for badminton tournament organizers.

---

**Made with vanilla JavaScript - no frameworks were harmed in the making of this app** 🏸
