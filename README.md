# DM Dashboard

A full-featured Dungeon Master companion app for D&D 5e and other tabletop RPGs. Manage campaigns, locations, NPCs, session notes, and rules — all in one place with a polished Material Design 3 dark interface.

## Features

### Campaign Management
- **Multi-campaign support** — Create and switch between multiple campaigns, each with its own color theme, categories, and documents
- **Custom categories** — Organize content into categories like Locations, NPCs, Sessions, and Rules (or create your own)
- **Nested documents** — Create hierarchical notes with parent/child relationships and tree navigation
- **Markdown content** — Write and preview content using markdown with a built-in renderer
- **Document pinning** — Pin frequently-used documents for quick access in a dedicated panel
- **Hover previews** — Preview document content by hovering over entries in the sidebar
- **Full-text search** — Search across all documents in a campaign

### SRD 5e Reference
Built-in, searchable System Reference Document content:
- **Spellbook** — All SRD spells with filtering by level, school, and class
- **Bestiary** — Monster stat blocks with CR and type filters
- **Classes** — Class details with features, proficiencies, and progression tables
- **Races** — Race descriptions with traits and ability score modifiers
- **Rules** — Browsable 5e rules organized by section

### DM Tools
- **Dice Roller** — Roll any standard die (d4, d6, d8, d10, d12, d20, d100) with roll history, critical hit/fumble detection, and animated results
- **Initiative Tracker** — Track combat initiative order with HP, add monsters directly from the bestiary, and cycle through turns
- **Character Creator** — Step-by-step character creation with race, class, and background selection featuring illustrated cards

### Design
- **Material Design 3** dark theme with pastel olive/green color tokens
- **Per-campaign color theming** — Each campaign derives its own palette from a chosen accent color
- **Material Symbols Outlined** icon font (served locally)
- **Responsive layout** with collapsible sidebar and right panel

## Tech Stack

| Layer     | Technology                                                  |
| --------- | ----------------------------------------------------------- |
| Runtime   | [Bun](https://bun.sh)                                      |
| Frontend  | React 19 (JSX, CSS-in-JS inline styles)                    |
| Backend   | `Bun.serve()` with route-based API handlers                |
| Database  | PostgreSQL via [`postgres`](https://github.com/porsager/postgres) (JS driver) |
| Bundler   | Bun's built-in HTML imports (no Vite/Webpack)              |
| Auth      | Cookie-based sessions with `Bun.password` bcrypt hashing   |

## Prerequisites

- **[Bun](https://bun.sh)** v1.1+ — Install with `curl -fsSL https://bun.sh/install | bash`
- **PostgreSQL** — A running PostgreSQL instance (local or hosted). [Neon](https://neon.tech), [Supabase](https://supabase.com), or any Postgres provider works.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/dm-dashboard.git
cd dm-dashboard
```

### 2. Install dependencies

```bash
bun install
```

### 3. Configure environment

Create a `.env` file in the project root (Bun auto-loads it — no dotenv needed):

```env
DATABASE_URL=postgres://user:password@host:5432/dbname?sslmode=require
```

Replace the connection string with your PostgreSQL credentials. If running Postgres locally without SSL:

```env
DATABASE_URL=postgres://user:password@localhost:5432/dm_dashboard
```

### 4. Run database migrations

Migrations run automatically on server startup, but you can also run them manually:

```bash
bun src/db/migrate.ts
```

This creates the following tables:
- `users` — User accounts with hashed passwords
- `sessions` — Auth session tokens (30-day TTL)
- `campaigns` — Campaigns with name, slug, description, and color
- `categories` — Custom document categories per campaign
- `docs` — Documents with markdown content, icons, and parent-child nesting

### 5. Start the development server

```bash
bun dev
```

The app will be available at `http://localhost:3000` (default Bun port) with hot module reloading enabled.

### 6. Create an account

Open the app in your browser. You'll see the auth screen — register with an email, password, and display name to get started. Then create your first campaign.

## Scripts

| Command        | Description                                           |
| -------------- | ----------------------------------------------------- |
| `bun dev`      | Start dev server with HMR (`bun --hot src/index.ts`)  |
| `bun start`    | Start production server                               |
| `bun build`    | Bundle frontend to `dist/` for production              |
| `bun migrate`  | Run database migrations manually                       |
| `bun test`     | Run tests                                              |

## Project Structure

```
src/
├── index.ts                 # Server entry point (Bun.serve)
├── index.html               # HTML shell (loads frontend.tsx)
├── frontend.tsx              # React DOM root
├── App.jsx                  # App shell — auth, routing, campaign selection
├── index.css                # Global styles
│
├── api/
│   ├── auth.ts              # Register, login, logout, session endpoints
│   ├── campaigns.ts         # CRUD for campaigns
│   ├── docs.ts              # CRUD for documents
│   └── categories.ts        # Manage campaign categories
│
├── db/
│   ├── index.ts             # PostgreSQL connection (postgres.js)
│   └── migrate.ts           # Schema migrations (auto-run on startup)
│
├── components/
│   ├── DMDashboard.jsx      # Main dashboard — sidebar, content viewer, panels
│   ├── AuthScreen.jsx       # Login / register form
│   ├── CampaignHome.jsx     # Campaign list and creation
│   ├── CharacterCreator.jsx # Step-by-step character builder
│   ├── DiceRoller.jsx       # Dice rolling tool
│   ├── InitTracker.jsx      # Initiative tracker
│   ├── SpellList.jsx        # SRD spell browser
│   ├── SpellCard.jsx        # Individual spell display
│   ├── MonsterList.jsx      # SRD monster browser
│   ├── MonsterStatBlock.jsx # Monster stat block display
│   ├── ClassList.jsx        # SRD class browser
│   ├── ClassDetail.jsx      # Class details view
│   ├── RaceList.jsx         # SRD race browser
│   ├── RaceDetail.jsx       # Race details view
│   ├── SRDRulesViewer.jsx   # 5e rules browser
│   ├── DocPreviewCard.jsx   # Hover preview tooltip
│   ├── PinnedPanel.jsx      # Pinned documents panel
│   └── ui/
│       ├── Icon.jsx         # Material Symbols icon component
│       ├── Ripple.jsx       # Material ripple effect
│       ├── Chip.jsx         # Filter chip component
│       └── ContextMenu.jsx  # Right-click context menu
│
├── data/
│   ├── sampleCampaign.js    # Default categories, icon options, colors
│   ├── srd-spells.json      # SRD 5e spell data
│   ├── srd-monsters.json    # SRD 5e monster data
│   ├── srd-rules.json       # SRD 5e rules
│   ├── srd-classes.json     # SRD 5e class data
│   └── srd-races.json       # SRD 5e race data
│
├── utils/
│   ├── renderMarkdown.js    # Markdown-to-HTML renderer
│   └── colorUtils.js        # Palette derivation from hex colors
│
└── assets/
    ├── classes/             # Class artwork (12 images)
    ├── races/               # Race artwork (9 images)
    └── backgrounds/         # Background artwork (12 images)
```

## API Endpoints

### Authentication
| Method | Endpoint             | Description                  |
| ------ | -------------------- | ---------------------------- |
| POST   | `/api/auth/register` | Create account               |
| POST   | `/api/auth/login`    | Log in (sets session cookie) |
| POST   | `/api/auth/logout`   | Log out (clears session)     |
| GET    | `/api/auth/me`       | Get current user             |

### Campaigns
| Method | Endpoint              | Description            |
| ------ | --------------------- | ---------------------- |
| GET    | `/api/campaigns`      | List user's campaigns  |
| POST   | `/api/campaigns`      | Create a campaign      |
| GET    | `/api/campaigns/:id`  | Get campaign (by UUID or slug) |
| PUT    | `/api/campaigns/:id`  | Update campaign        |
| DELETE | `/api/campaigns/:id`  | Delete campaign        |

### Documents
| Method | Endpoint                             | Description       |
| ------ | ------------------------------------ | ----------------- |
| POST   | `/api/campaigns/:campaignId/docs`    | Create a document |
| PUT    | `/api/docs/:id`                      | Update a document |
| DELETE | `/api/docs/:id`                      | Delete a document |

### Categories
| Method | Endpoint                                   | Description             |
| ------ | ------------------------------------------ | ----------------------- |
| PUT    | `/api/campaigns/:campaignId/categories`    | Replace all categories  |
| POST   | `/api/campaigns/:campaignId/categories`    | Add a category          |

## Deployment

### Production build

```bash
bun build
```

This bundles the frontend into `dist/` with minification and sourcemaps.

### Running in production

```bash
bun start
```

This runs the server with `NODE_ENV=production`, which:
- Disables HMR and dev console
- Enables `Secure` flag on session cookies

### Environment variables

| Variable       | Required | Description                          |
| -------------- | -------- | ------------------------------------ |
| `DATABASE_URL` | Yes      | PostgreSQL connection string         |
| `NODE_ENV`     | No       | Set to `production` for prod mode    |

### Deploy to a VPS / Cloud

1. Ensure Bun is installed on the server
2. Clone the repo and run `bun install`
3. Set `DATABASE_URL` in your environment
4. Run `bun start` (use a process manager like `pm2` or `systemd` to keep it running)

### Deploy to Railway / Render / Fly.io

Most platforms that support Node.js can run Bun. Set the build command to `bun install` and the start command to `bun start`. Ensure `DATABASE_URL` is configured as an environment variable pointing to your Postgres instance.

## License

This project uses SRD 5e content provided under the [Open Gaming License (OGL)](https://dnd.wizards.com/resources/systems-reference-document).
