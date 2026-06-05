# Flicker — Agent Guide

## Architecture

- **Single-file app**: everything in `index.html` — HTML, CSS (inline `<style>`), JS (inline `<script>`).
- **No build step, no server, no dependencies**. Open `index.html` in a browser to run.
- **No router, no framework** — vanilla JS only.
- **Design aesthetics** in `SKILL.md` — read before making UI changes.

## Storage

- Data persisted in `localStorage` under key `flicker_tournaments`.
- Clearing localStorage resets the app. No backend.

## Data model

```ts
interface Tournament {
  name: string;
  venue: string;
  createdAt: number; // Date.now()
  categories: string[]; // category names
  teams: { name: string; category: string }[]; // team objects
  formats: {
    [categoryName: string]: {
      phases: Phase[];
    };
  };
}

interface Phase {
  name: string; // e.g. "Group Stage", "Knockout"
  type: 'group' | 'knockout';
  groups: Group[];
}

interface Group {
  name: string; // e.g. "Group A"
  entries: (string | null)[]; // team names or null (empty slot)
}
```

Old tournaments (pre v2) may lack `categories`/`teams`/`formats` — the `ensureTournamentData()` helper fills them in on access.

## External dependencies

- Google Fonts: Archivo Black + DM Sans. Requires internet on first load.

## Conventions

- CSS custom properties in `:root` for all colors, radii, spacing. Use them — don't hardcode values.
- Keep all code in `index.html` unless the file grows unwieldy. If splitting, move JS to a separate file first, then CSS.
