# ReadList — Design Style Guide

Extracted from the "Conceptual Design Document" PowerPoint deck. Use this as the shared visual language for related documents, decks, and UI mockups.

---

## 1. Color Palette

| Swatch | Name | Hex | Usage |
|---|---|---|---|
| 🟪 | Deep Wine (Primary) | `#6D2E46` | Dark section backgrounds, primary headings, filled shapes/pills |
| 🟤 | Dusty Rose (Accent) | `#A26769` | Eyebrow/kicker labels, accent text on dark backgrounds, secondary shapes |
| 🟨 | Cream (Surface) | `#ECE2D0` | Light card backgrounds, content blocks |
| ⬛ | Near-Black Plum | `#2B1C22` | Primary body text on light backgrounds |
| ⬛ | Dark Plum (Secondary) | `#3A2A30` | Secondary text, subheadings on light backgrounds |
| ⬜ | White | `#FFFFFF` | Text on dark/wine backgrounds, page background |

**Pairing rules:**
- Wine (`#6D2E46`) backgrounds always use white or dusty rose text — never dark plum.
- Cream (`#ECE2D0`) card backgrounds use near-black plum (`#2B1C22`) body text and wine (`#6D2E46`) headings.
- Dusty rose (`#A26769`) is reserved for small accents — eyebrow labels, numbered badges, connector arrows — not large fills or body copy.

## 2. Typography

| Role | Typeface | Notes |
|---|---|---|
| Headings / Titles | **Cambria** (serif) | Bold, used for slide titles, section headers, card headings |
| Body / UI text | **Calibri** (sans-serif) | Regular weight for paragraphs, labels, and captions; bold for emphasis |

**Hierarchy:**
- Eyebrow/kicker label: Calibri, small size, bold, letter-spaced (tracked out), uppercase — dusty rose or white
- Title: Cambria, bold, large — wine or white
- Subtitle / lead-in: Calibri, italic, medium — muted tone
- Body text: Calibri, regular
- Labels (e.g. "Name:", "Status:"): Calibri, bold, dusty rose

## 3. Layout & Structure

- **Title slides:** full-bleed wine background, oversized soft circular shapes (dusty rose, low-opacity) as decorative background elements in a corner, content left-aligned with generous top/side margins.
- **Content slides:** white background with a thin wine-colored vertical accent bar on the far left edge.
- **Eyebrow + Title pattern:** every section slide opens with a small uppercase eyebrow label directly above a bold Cambria title.
- **Two-column contrast blocks:** paired content cards — one cream, one wine-filled — placed side by side to visually contrast two related groupings (e.g. "The Idea" vs. "Target Users").
- **Numbered step cards:** rounded rectangle cards on a cream fill, each with a small filled wine circle containing a white number, followed by a bold heading and supporting bullet points.
- **Process/flow bars:** a full-width wine banner containing a horizontal sequence of pill-shaped (fully rounded) steps in dusty rose, connected by simple arrow glyphs (→).
- **Diagrams:** rounded rectangle nodes alternating cream and wine fills, connected by thin wine arrows with small italic Calibri labels describing the connection (e.g. "HTTP / JSON (fetch)").

## 4. Shape Language

- **Corners:** consistently rounded — cards, pills, and diagram nodes all use soft rounded corners; no sharp rectangles.
- **Circles:** used for decorative background elements (large, low-opacity) and for numbered badges (small, solid fill).
- **Borders:** cards on white backgrounds have a thin wine-colored outline; cards on wine backgrounds have no border (rely on fill contrast).
- **Dividers:** simple thin horizontal rules in dusty rose to separate a title block from supporting metadata.

## 5. Iconography & Decoration

- No literal icon set is used — emphasis is carried through color, numbered badges, and typographic weight rather than iconography.
- Decorative elements are limited to large, soft, overlapping circles at low opacity — used sparingly, only on full-bleed wine backgrounds.
- Avoid gradients, drop shadows, or textures — the style is flat and color-block based.

## 6. Voice & Tone (Content Style)

- Short, direct labels ("The Idea", "Target Users", "User Flow") rather than full sentences for headings.
- Bold lead-in terms within bullet points (e.g. **Casual readers** who juggle recommendations…) to let users scan quickly.
- Supporting body copy stays concise — one to three sentences per block.

## 7. Quick Reference (CSS Variables)

```css
:root {
  --color-primary: #6D2E46;   /* Deep Wine */
  --color-accent: #A26769;    /* Dusty Rose */
  --color-surface: #ECE2D0;   /* Cream */
  --color-text: #2B1C22;      /* Near-Black Plum */
  --color-text-secondary: #3A2A30; /* Dark Plum */
  --color-white: #FFFFFF;

  --font-heading: "Cambria", serif;
  --font-body: "Calibri", sans-serif;

  --radius: 12px; /* consistent rounded-corner scale */
}
```