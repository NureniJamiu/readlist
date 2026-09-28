# ReadList

A lightweight, distraction-free web application for tracking books to read. Built with Node.js, Express, SQLite, and React with Tailwind CSS.

## Architecture

ReadList is structured following the services-first architecture specified in `AGENTS.md`:

```
├── contracts/          # Shared contracts, TypeScript interfaces, and validation schemas
├── services/
│   ├── api/            # Express REST API + SQLite file-based database
│   └── web/            # React + Vite + Tailwind CSS frontend application
└── package.json        # Monorepo workspaces and orchestration
```

## Visual Design

The UI is styled strictly according to `STYLE_GUIDE.md`:
- **Palette**: Deep Wine (`#6D2E46`), Dusty Rose (`#A26769`), Cream (`#ECE2D0`), Near-Black Plum (`#2B1C22`)
- **Typography**: Cambria (Headings) and Calibri (Body UI)
- **Layout**: Rounded corners (`12px`), two-column contrast blocks, process flow banners, and zero-reload dynamic interactions.

## Quickstart

### Prerequisites
- Node.js 22+ (v25+ tested)
- npm 10+

### Installation
```bash
npm install
```

### Running Locally
To run both backend and frontend concurrently:
```bash
# Terminal 1: API (http://localhost:3001)
npm run dev --workspace=services/api

# Terminal 2: Web UI (http://localhost:3000)
npm run dev --workspace=services/web
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing & Quality Assurance

In accordance with `AGENTS.md`, every service includes fast deterministic gate tests and periodic eval suites:

```bash
# Run all gate test suites (<2s, zero cost)
npm test

# Run all eval suites
npm run eval
```
