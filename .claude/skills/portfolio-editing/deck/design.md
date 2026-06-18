# design.md — Deck Design System (single source of truth for visuals)

This file is the visual source of truth for the Portfolio Review deck. It is **distilled
verbatim** from kayna.ai's live design system (`.claude/skills/portfolio-editing/references/`)
so the deck and the site stay one voice. **Never hardcode a color, font, or spacing value in a
slide component — read it from the CSS variables below (defined once in `app/portfolio-review/deck.css`).**

The only thing here that the *site* doesn't already specify is the **deck display type tier**
(§ Type). It was approved explicitly because a 16:9 slide viewed at presentation distance needs
sizes above the site's 48px cap. Families and colors are unchanged.

---

## Color tokens

| CSS var | Value | Use |
|---|---|---|
| `--bg` | `#FDFBFA` | Slide background. The only bg. Never pure white. |
| `--ink-75` | `rgba(0,0,0,0.75)` | Titles, headlines, strong copy, stat numbers, callout labels. |
| `--ink-50` | `rgba(0,0,0,0.50)` | Secondary emphasis, active index, matrix values. |
| `--ink-35` | `rgba(0,0,0,0.35)` | Body copy, mono labels, captions, eyebrows, chrome. |
| `--hairline` | `rgba(0,0,0,0.15)` | 1px dividers, asset-frame outlines, matrix rules, annotation leader lines. |
| `--fill-5` | `rgba(0,0,0,0.05)` | The ONE sanctioned fill (pills, asset-frame interior tint). Nothing else gets a fill. |
| `--accent` | `#FF9100` | Orange. **Not used at rest in the deck** (decision: deck stays monochrome — print has no hover). Reserved; do not apply. |

Never use pure `#000000` or `#FFFFFF`. No shadows, no gradients, no card fills (except `--fill-5`).

## Type — families (exactly three, never a fourth)

| CSS var | Family | Weight | Role |
|---|---|---|---|
| `--serif` | PT Serif | 400 (+italic for emphasis) | Headlines + slide titles only. |
| `--sans` | TWK Lausanne | 400 | Body, lead copy, big stat numbers, the wordmark. |
| `--mono` | Reddit Mono | 500 | UPPERCASE labels, eyebrows, metadata, chrome, matrix headers. |

Fonts come from the site's `next/font` vars (`--font-pt-serif`, `--font-twk`, `--font-reddit-mono`)
already loaded in `app/layout.tsx`. The deck aliases them to `--serif`/`--sans`/`--mono`.

## Type — size tier (deck display scale)

Site scale is 16/24/48. The deck **extends** it (approved) for presentation distance. Ratio-derived.

| CSS var | px | Family | Line-height | Use |
|---|---|---|---|---|
| `--t-caption` | 16 | mono / sans | 1.3 | Eyebrows, labels, annotations, captions, chrome, counter. (16px floor — never go below.) |
| `--t-body` | 24 | sans | 1.45 | Slide body copy, list items, card body. |
| `--t-lead` | 32 | sans | 1.35 | Lead sentences, card titles, the question line. |
| `--t-title` | 48 | serif | 1.1 | Section sub-headlines, secondary slide titles, Agenda card labels. |
| `--t-headline` | 72 | serif | 1.05 | Primary slide headline, Cover thesis. |
| `--t-display` | 110 | sans | 1.0 | Hero stat numbers (Results), Cover name. |

Mono labels use `letter-spacing: 0.02em` and UPPERCASE. Serif/sans are always sentence case.
Italic only on PT Serif for emphasis (e.g. a single emphasized phrase in the Cover thesis).

## Spacing scale (only these)

`--s-12: 12px` · `--s-16: 16px` · `--s-20: 20px` · `--s-24: 24px` · `--s-40: 40px` ·
`--s-64: 64px` · `--s-80: 80px`. No value off this scale.

- **Slide canvas:** 1280 × 720 (16:9), fixed. Inner padding **80px** all sides → 1120 × 560 content box.
- Tight grouping (label↔content): 12 / 16. Item-to-item: 24. Block-to-block: 40. Major: 64 / 80.

## Radius

- `--r-frame: 12px` — asset frames, image covers (matches site cover radius).
- `--r-pill: 999px` — pills only.
Nothing else is rounded.

## Lines / chrome

- Hairline divider/leader: `1px solid var(--hairline)`.
- **Annotation style (defined once, reused):** a 1px hairline leader line + a `--mono` `--t-caption`
  UPPERCASE label in `--ink-35`, with the annotation copy in `--ink-75`. Used for every Final-slide
  callout and the Explorations deciding-principle. No orange, no arrowheads beyond the unicode `→`.
- **Asset placeholder (`【ASSET】`):** a `--r-frame` rectangle, 1px `--hairline` outline, `--fill-5`
  interior, holding a centered `ASSET` mono label + the description in `--ink-35`, sized to the
  intended aspect ratio so layout holds before screenshots land.
- Unicode glyphs only (`→ ↶ ·`). No icon libraries, no emoji.

## Motion

Minimal. Slide changes may use a single short opacity/translate token; nothing decorative.
`--motion: 180ms cubic-bezier(0.4,0,0.2,1)`. Respect `prefers-reduced-motion`. No motion in print.

## Chrome (shell overlay, from tokens)

- Section tag — top-left, `--mono` `--t-caption` `--ink-35`.
- Slide counter — top-right, `--mono` `--t-caption` `--ink-35` (e.g. `07 / 42`).
- Progress — 1px `--hairline` track along the bottom edge, filled portion `--ink-35`.
- All chrome is hidden in `@media print`.

## Hard rules (inherited from the site)

Negative space is content. Hierarchy from type + space only — no chrome. One idea per slide.
No em-dashes in rendered copy (use a comma); keep en-dashes `–` and arrows `→`. Operator/builder
voice, never designer-as-artist. Calligraphy sensibility (restraint, asymmetry, negative space),
never literal brush motifs.
