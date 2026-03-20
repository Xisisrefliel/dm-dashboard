# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

DM Dashboard — a D&D/TTRPG dungeon master tool built with React 19 and Bun. Single-page app with Material Design 3 dark theme (pastel olive/green). Manages campaign locations, NPCs, sessions, and rules with a markdown-based content viewer, dice roller, and initiative tracker.

## Commands

- `bun dev` — start dev server with HMR (runs `bun --hot src/index.ts`)
- `bun start` — production mode
- `bun build` — browser bundle to `dist/`
- `bun test` — run tests

## Architecture

**Bun fullstack app** — `src/index.ts` is the server entry point using `Bun.serve()` with route-based API handlers and HTML imports. The HTML file (`src/index.html`) loads `src/frontend.tsx`, which renders the React app.

**Single-component frontend** — Nearly all UI lives in `src/App.jsx` as one large component (`DMDashboard`) with inline styles (Material Design 3 tokens). Helper components (`Icon`, `Ripple`, `Chip`, `DiceRoller`, `InitTracker`, `ContextMenu`, `PinnedPanel`) and a `renderMarkdown()` function are defined in the same file. `src/APITester.tsx` is a standalone utility component.

**State is local** — All state lives in React `useState` hooks inside `DMDashboard`. No external state library. Sample campaign data (`SAMPLE`) is hardcoded at the top of `App.jsx`. Items have `{id, title, icon, content, category}` shape and content is markdown.

**No routing library** — The server serves `index.html` for all unmatched routes (`"/*": index`). Navigation is handled via React state (categories, selected doc, panels).

**Styling** — All CSS-in-JS via inline style objects using M3 dark-theme color tokens defined as constants in `App.jsx`. Global styles in `src/index.css`. Material Symbols Outlined icon font loaded from a local woff2 file.

## Bun Conventions

Default to Bun over Node.js for everything:

- `bun <file>` not `node`/`ts-node`; `bun install` not `npm`/`yarn`/`pnpm`; `bunx` not `npx`
- `Bun.serve()` for HTTP/WebSocket — not express
- `bun:sqlite` for SQLite, `Bun.file` over `node:fs`, `Bun.$` over execa
- Bun auto-loads `.env` — don't use dotenv
- HTML imports with `Bun.serve()` for frontend bundling — not vite/webpack
- `bun test` with `import { test, expect } from "bun:test"` — not jest/vitest

## TypeScript

- Path alias `@/*` maps to `./src/*`
- Strict mode enabled with `noUncheckedIndexedAccess`
- JSX mode: `react-jsx` (no manual React imports needed)
