# @readlist/web

React 18 + Vite + Tailwind CSS frontend application for ReadList.

## Design System
Styled strictly according to `STYLE_GUIDE.md`:
- Colors: Deep Wine (`#6D2E46`), Dusty Rose (`#A26769`), Cream (`#ECE2D0`), Near-Black Plum (`#2B1C22`)
- Typography: Cambria (headings) and Calibri (body)
- Components: Two-column contrast stat cards, process flow banners, and responsive book cards with instant zero-reload updates.

## Testing & Quality Assurance
- **Gate tests**: `npm test` (<2s deterministic, Vitest + React Testing Library)
- **Evals**: `npm run eval` (Design system tokens, accessibility, error boundary verification)
