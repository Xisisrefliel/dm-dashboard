# DM Dashboard

**Your tabletop campaign, all in one place.**

DM Dashboard is a modern companion app for D&D 5e and tabletop RPGs — built for Dungeon Masters who want to run better sessions and players who want to bring characters to life. Manage worlds, build characters, invite your party, and keep everything at your fingertips with a beautiful dark interface that feels as immersive as the game itself.

---

## For Dungeon Masters

### Run Your World

Create and manage multiple campaigns, each with its own color theme and organizational structure. Write location descriptions, NPC backstories, session recaps, and house rules — all in rich markdown with support for callouts, tables, and auto-linked references between documents.

- **Nested documents** with parent-child hierarchy and tree navigation
- **Custom categories** to organize content the way your world works
- **Full-text search** to find anything across your entire campaign
- **Pin documents** for instant access to the notes you reach for mid-session
- **Hover previews** to peek at content without losing your place

### Built-In SRD Reference

No more tab-switching. The complete 5e System Reference Document is searchable and browsable right inside your dashboard:

- **Spellbook** — Every SRD spell, filterable by level, school, and class
- **Bestiary** — 300+ monster stat blocks with CR and type filters, one click to add to initiative
- **Classes & Races** — Full details with features, proficiencies, traits, and progression tables
- **Rules** — The complete 5e ruleset organized by chapter and section

### DM Tools That Just Work

- **Dice Roller** — Roll any die with animated results, crit/fumble detection, and roll history
- **Initiative Tracker** — Track turn order and HP, add monsters straight from the bestiary, cycle through rounds effortlessly

---

## For Players

### Build Your Character

A guided, step-by-step character creator walks you through every choice with illustrated cards and detailed descriptions:

1. **Race** — Choose from 9 playable races, each with hand-picked artwork
2. **Class** — Pick from all 12 classes with class-specific visuals
3. **Background** — 12 backgrounds with thematic art and story hooks
4. **Ability Scores** — Point Buy, Standard Array, or manual entry with racial modifiers auto-applied
5. **Alignment** — Answer a personality questionnaire or pick directly from the alignment grid
6. **Equipment** — Class-specific gear selections with sensible defaults
7. **Spells** — Choose cantrips and leveled spells for spellcasting classes

### AI-Generated Portraits

Bring your character to life with AI-generated portrait art. Describe your vision and get a unique illustration styled after classic fantasy art — automatically tailored to your race, class, and background.

### Your Character Library

Save and manage multiple characters. Edit them anytime, and bring any character with you when you join a campaign.

---

## Play Together

### Invite Your Party

DMs generate shareable invite links to bring players into their campaigns. Control access with optional expiration times and usage limits — or revoke links anytime.

### Share Campaign Materials

When players join, they bring a character from their library. DMs see the full party roster with character details, ability scores, HP, and AC — everything needed to run the table. Flag documents as shared to make lore, maps, and session recaps visible to your players.

### Stay in Sync

Character updates propagate across campaigns automatically. When a player levels up or swaps gear, every campaign they're part of reflects the change.

---

## Designed for the Table

DM Dashboard is built with **Material Design 3** and a dark theme that keeps the focus on your content — not on bright UI glare at 11 PM.

- **Per-campaign color theming** — each campaign gets its own derived color palette
- **Responsive layout** — collapsible sidebar and panels adapt to any screen
- **Haptic feedback** — tactile responses on supported devices for a polished feel
- **Smooth animations** — ripple effects, roll animations, and transitions throughout

---

## Tech Stack

| Layer    | Technology                                             |
| -------- | ------------------------------------------------------ |
| Runtime  | [Bun](https://bun.sh)                                 |
| Frontend | React 19 (JSX, CSS-in-JS)                             |
| Backend  | `Bun.serve()` with route-based API handlers            |
| Database | PostgreSQL via [postgres.js](https://github.com/porsager/postgres) |
| Bundler  | Bun HTML imports (no Vite/Webpack)                     |
| Auth     | Cookie-based sessions with bcrypt hashing              |
| AI Art   | Replicate API (Seedream model)                         |

---

## Getting Started

### Prerequisites

- **[Bun](https://bun.sh)** v1.1+ — `curl -fsSL https://bun.sh/install | bash`
- **PostgreSQL** — Local or hosted ([Neon](https://neon.tech), [Supabase](https://supabase.com), or any provider)

### Setup

```bash
# Clone and install
git clone https://github.com/YOUR_USERNAME/dm-dashboard.git
cd dm-dashboard
bun install

# Configure database
echo 'DATABASE_URL=postgres://user:password@localhost:5432/dm_dashboard' > .env

# Start the dev server
bun dev
```

Open `http://localhost:3000`, create an account, and start building your first campaign.

### Scripts

| Command       | Description                              |
| ------------- | ---------------------------------------- |
| `bun dev`     | Dev server with hot reload               |
| `bun start`   | Production server                        |
| `bun build`   | Bundle frontend to `dist/`               |
| `bun migrate` | Run database migrations                  |
| `bun test`    | Run tests                                |

---

## Deployment

```bash
bun build && bun start
```

Set `DATABASE_URL` in your environment and deploy anywhere that runs Bun — Railway, Render, Fly.io, or any VPS. Migrations run automatically on startup.

---

## License

SRD 5e content provided under the [Open Gaming License (OGL)](https://dnd.wizards.com/resources/systems-reference-document).
