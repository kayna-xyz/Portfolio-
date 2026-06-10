# Design Principles

These are the taste rules that distinguish kayna.ai from a generic AI-generated portfolio. Every visual decision should pass these principles. **When the design system tokens permit something but these principles reject it, the principles win.**

## 1. Negative space is content

The site is built on the ink-painting principle of 计白当黑 — counting white as black. The 40px page padding, the empty outer columns of the 16-column grid, the long vertical drop below short content blocks (see the about page: most of the viewport is empty) — none of this is "unused space." It's load-bearing.

**Violations to refuse:**

- Filling empty side columns with decorative elements, illustrations, or background patterns
- Centering short content vertically to "balance" the page
- Adding a hero image or visual filler just because the top of a page feels sparse
- Stretching content to fill available width when 4 columns is the prescribed width

## 2. Hierarchy through typography, not chrome

The site has no boxes, no cards, no shadows, no borders, no dividers (except the single hairline under the nav). Visual hierarchy is achieved entirely through:

- Font family (PT Serif vs TWK Lausanne vs Reddit Mono)
- Size (16 / 24 / 48)
- Opacity (75% / 50% / 35%)
- Position and spacing

**Violations to refuse:**

- Adding a card with a background fill to "group" related content
- Adding a subtle border to separate sections
- Adding a drop shadow for "depth"
- Using a background tint to indicate a section change

## 3. One accent, hover only

Orange (`#FF9100`) is the only accent color on the site, and it only appears on hover. Resting state is monochromatic (black at varying opacities on the warm off-white background).

**Violations to refuse:**

- Using orange as a default state for "primary" buttons or CTAs
- Adding a second accent color for variety
- Using color to indicate categories or tags
- Tinting backgrounds with the accent

## 4. No icon libraries

The site uses unicode glyphs only (`↶` for back). Do not import lucide-react, heroicons, phosphor, or any other icon library.

**Violations to refuse:**

- Adding icons next to nav links
- Adding emoji to headings or body
- Replacing the unicode back arrow with an SVG icon
- Adding loading spinners — if loading state is needed, use text ("Loading…")

## 5. Mono labels, serif titles, sans body

This three-way typographic split is the personality of the site. Each font has a fixed role:

- **Reddit Mono Medium** = metadata, labels, system voice (DESIGN, TIMELINE, LAST PUSH — MAY 2026, BUILT BY KAYNA HUANG, project category lines)
- **PT Serif** = only the title( that the 48 size one at the top of homepage, the opening of the webiste)
- **TWK Lausanne** = the working voice (everything you actually read)

**Violations to refuse:**

- Using TWK Lausanne for an UPPERCASE label
- Using Reddit Mono for a title
- Introducing a fourth font for "variety"

## 6. UPPERCASE is reserved for mono labels

All-caps text only appears in Reddit Mono Medium contexts: KAYNA HUANG wordmark, sidebar labels (DESIGN, TIMELINE), project category lines (PRODUCT DESIGNER · INTERNSHIP · SUMMER 2025), footer credit line. Body copy and titles are always sentence case.

**Violations to refuse:**

- An UPPERCASE H1 title
- ALL-CAPS body for emphasis (use opacity 75% instead — see how "friends" is emphasized on the about page)

## 7. The portfolio's voice is operator/builder, not designer-as-artist

Copy and positioning should reflect Kayna's actual identity: a product designer who builds, with a long-term operator/PM/investor trajectory. The site is a credibility artifact, not a moodboard.

**Violations to refuse:**

- Hero taglines like "I make beautiful things" or "Crafting digital experiences"
- "I'm a designer who codes" framing (the existing positioning is the _opposite_ — "product designer who builds")
- Treating case studies as visual showcases at the expense of describing what was actually built and shipped
- Adding aesthetic decoration that doesn't serve the content (animated cursors, scroll-triggered confetti, hero gradients)

## 8. Calligraphy/ink-painting sensibility, never literal

Kayna's 15-year background in Chinese calligraphy and ink painting shapes the _sensibility_ of the site (restraint, asymmetry, negative space, monochrome with a single warm accent) but is **not** referenced literally.

**Violations to refuse:**

- Adding brush-stroke graphics, ink-splash backgrounds, or "asian-inspired" decoration
- Using a serif that mimics brush calligraphy
- Adding 中文 text as decoration where the site is otherwise English

The influence is in _how things are arranged_, not in surface motifs.

## 9. Defaults that ship as "AI-generated-looking" are forbidden

If a generated layout reaches for any of the following, reject it:

- `rounded-2xl shadow-lg` button combinations
- Centered hero with a single CTA button and a subtle gradient behind it
- Three-column "feature" grids with icons and short headlines
- "Trusted by" logo strips
- Glassmorphism, neumorphism, or any other named visual trend
- Generic stock illustrations or 3D blob graphics
- `bg-gradient-to-br from-purple-500 to-pink-500` and friends
- Floating chat bubbles or "AI assistant" widgets

This portfolio's job is to look like Kayna made it on purpose, not like a template did.

## 10. When proposing visual changes, propose restraint first

If a request is ambiguous ("make this section pop more"), the default answer is to reduce, not add. Tighten the spacing. Drop an unnecessary element. Increase opacity contrast. Resist the urge to add a color, a border, or a graphic.

If reduction won't solve it, ask Kayna what specifically isn't working before adding anything new.
