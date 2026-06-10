## Case study / about layout

Pages use a 16-column grid that lives inside the standard 40px page padding (left/right). Columns are equal width with no inner gutter (gaps come from leaving columns empty).

Column assignment for case study and about pages:

|Cols|Use|
|---|---|
|1–2|Left sidebar — `← Index` back link + section index list (sticky)|
|3–4|Empty (gap)|
|5–12|**Main content area — centered on the page.** Title, subtitle, cover image, meta table, all section bodies.|
|13–16|Empty (negative space — see `design-principles.md` § 1)|

**Content is horizontally centered on the page.** 8 columns of content (cols 5–12) with 4 cols of empty space on each side (cols 1–4 on the left, which the sticky sidebar floats over; cols 13–16 on the right). The sidebar does **not** push the content right — it floats over the left empty space, leaving the content visually centered.

**Vertical rhythm from the top:**

- The top nav has 20px vertical padding (internal). Its own height is ~58px including text and the hairline.
- The content area starts **58px below the nav's hairline border** (this equals the nav's own height — it's a deliberate match, not a coincidence).
- The simple footer sits at the bottom of the page, full width, separated from content by its 1px hairline. See `navigation-and-footer.md`.

**Sidebar behavior:**

- The `← Index` back link lives at the top of the sidebar in `text-muted` (35%).
- The index list below uses TWK Lausanne 16px, `text-muted` (35%) for inactive items and `text-medium` (50%) for the currently-active section. Spacing between items is `space-12`.
- The sidebar is **sticky** — it floats on the left and stays visible as the content scrolls. It sticks at `top: 58px` (matching the gap below the nav). The whole sidebar block (← Index + section list) sticks together.

**Content rhythm:**

- Title (24px TWK Lausanne, `text-strong`) → 12px → subtitle (16px TWK, `text-muted`)
- Subtitle → cover image: `space-40`
- Cover image → meta table: `space-40`
- Meta table → first section: `space-80`
- Within a section: `space-12` between label and heading, `space-12` between heading and body
- Between sections: `space-80`

Cover image: full width of the content area, `border-radius: 12px`, 1px hairline (`rgba(0,0,0,0.15)`) outline. See `design-system.md` § Stroke / hairline.

Meta table: 4 rows (TIMELINE, ROLE, TEAM, TOOLS). Label on the left in Reddit Mono Medium 16px `text-strong`; value on the right in TWK Lausanne 16px `text-strong`. Rows are separated by spacing only — **no horizontal rules**.

## About page layout

The about page uses the same outer shell as case study pages (16-col grid, sticky sidebar, content cols 5–12, simple footer). Differences:

- **Sidebar:** contains only the `↶ Back` link (TWK Lausanne 16px, `text-muted`, → `/`). No index list.
- **Content area:** organized as a 2-column sub-grid inside cols 5–12 — `gridTemplateColumns: "2fr 6fr"`. The left sub-column holds the section label (Reddit Mono Medium 16px UPPERCASE, `text-muted`). The right sub-column holds the body content (TWK Lausanne 16px, `text-muted`).
- **Section rhythm:** `space-80` between sections. The first section sits at the top of the content area (no top margin) so its label aligns horizontally with the `↶ Back` link.
- **Paragraph rhythm within a section:** `space-20` between paragraphs (per § Vertical spacing rules).
- **Lists:** standard `<ul>` with disc bullets, 20px left padding, items in TWK Lausanne 16px `text-muted`.

### Photography section (add when photos are provided)

A `PHOTOGRAPHY` section uses the same 2-col sub-grid (label left, content right). The content side is a 2-column masonry of photos:

- Container: `display: grid; gridTemplateColumns: 1fr 1fr; columnGap: 20px;` with two flex-column children. Distribute photos between the two columns to balance height (taller photos in one column, shorter in the other) — this gives the staggered/masonry feel from the prototype.
- Each photo: 12px border-radius, 1px hairline border (`rgba(0,0,0,0.15)`), full column width, `height: auto`.
- Caption (optional): UPPERCASE Reddit Mono Medium 16px in `text-muted`, sits 12px below the photo. Examples from the prototype: `CENTRAL PARK`, `TOKYO!`, `MY CAT & DOG`, `MATCHA`.
- Gap between photos in a single column: `space-20`.
- The PHOTOGRAPHY section itself follows the standard `space-80` rule above (80px from the section above).

## Homepage layout

The homepage breaks the 4/4 pattern because it is a project grid, not a content-reading page:

- **Hero** — left half holds the 48px PT Serif title; right half holds a 16px intro paragraph plus the X / LN / GIT links stacked on the far right.
- **Project grid** — a 2-column grid of project cards. Each card is:
    - Image cover (12px radius), full card width
    - 16px Reddit Mono Medium category line in `text-muted` (e.g. "PRODUCT DESIGNER · INTERNSHIP · SUMMER 2025")
    - 24px TWK name in `text-strong`, with an optional small TWK tag on the right in 16px (e.g. "Forbes AI 50", "AI SaaS", "SeriesB")
    - 16px TWK Lausanne description in `text-muted`
- **Footer area** — Menu links on the left, "Find Me On" + social links below it, contact prompt on the right, "LAST PUSH — MAY 2026" timestamp, "BUILT BY KAYNA HUANG" bottom-right.

## Vertical spacing rules

Within a single body block (e.g. the three paragraphs under DESIGN), use `space-20` between paragraphs.

Between major sections on the same page (e.g. DESIGN → BEYOND DESIGN), use `space-80`.

Between a sidebar label and the first paragraph of its content, the label sits at the top of the content's bounding box — they share a horizontal baseline at the top.

## Vertical scroll behavior

Pages scroll naturally. The top navigation does **not** appear to be sticky in the current site — when adding new pages, follow the existing non-sticky behavior unless explicitly told otherwise.

The case study sidebar index is **sticky** — it floats on the left and remains visible as the content scrolls (`position: sticky; top: 58px`).

## Responsive notes

Mobile is driven by the `useIsMobile()` hook (`hooks/use-mobile.tsx`, breakpoint **768px** — below this is mobile). Components branch inline style values on `isMobile`. The root layout sets `viewport: { width: 'device-width', initialScale: 1 }` in `app/layout.tsx` — this is required for the breakpoint to work on real devices; never remove it.

**Mobile rules (≤768px):**

- **Page padding:** horizontal drops from 40px to **20px** site-wide. Vertical is reduced per surface but stays on the scale (nav `16px`, hero top `64px`, case-study/about main top `40px` / bottom `64px`).
- **Navbar:** show only **Blog** and **About** (Home + Playground are hidden; the KAYNA HUANG wordmark still links home). Padding `16px 20px`, link gap `20px`.
- **Homepage hero:** the hero is **omitted entirely on mobile** (`HeroSection` returns `null` when `isMobile`). The nav flows straight into the project list. (Intro paragraph, X / LN / GIT, and the 48px title are all desktop-only; the links live in the footer.)
- **Homepage projects:** the **BUILDING PRODUCTS USED BY MILLIONS** label is hidden. Projects are a single source-ordered column (not the even/odd two-column masonry), with **descriptions hidden**. The list starts `24px` below the nav. The title/tag row stays a **single row** (same as desktop): `flex-direction: row`, `align-items: center`, `justify-content: space-between` so the tag pill is pushed to the right edge. The title has `min-width: 0` so it shrinks/wraps to keep the tag on the row (pill uses no negative margins on mobile). Note: cards with a very long tag string force the title to wrap to several lines — keep tag strings short on mobile.
- **Case study / about:** the 16-col grid collapses to one full-width column. The sticky sidebar **section index is hidden** — only the `← Index` / `← Back` link is kept, at the top of the content (non-sticky). Do **not** add a hamburger menu.
- **About label/content:** the `2fr 6fr` sub-grid stacks — mono label sits on its own line above its body/list, with a `32px` row gap (**half** the 64px section spacing — deliberately *larger* than the 24px paragraph gap so the label reads as a section header with breathing room, not cramped against the first line; the desktop `translateY(-3px)` label nudge is dropped on mobile so the gap renders exactly). Paragraphs within a section are `24px` apart on mobile (`20px` desktop) — mobile needs `24px` because the body line-height is `1.5` (= 24px); a smaller gap makes paragraphs read tighter than the lines inside them. Section-to-section spacing is `64px` on mobile (vs `80px` desktop), and the `← Back` link sits `64px` above the first section so the back→content gap equals the section gap.

### Mobile compact scale (project cards) — documented exception

On mobile, project cards use a **two-size scale** — **20px** title, **14px** for the metadata (category line + tag pill) — instead of the desktop 16/24 tokens (the sanctioned departure from the 16/24/48 type scale, scoped to `≤768px` project cards, requested by Kayna for density). This is the **only** place font goes below 16px; everywhere else on the site keeps the 16px floor. Spacing stays on the normal scale. Desktop is unchanged.

| Element | Desktop | Mobile |
|---|---|---|
| Category line (mono) | 16px | **14px** (matches the tag) |
| Project title | 24px | **20px** |
| Tag pill text | 16px | **14px** (pill height 24px, padding `0 10px`) |
| Cover → category | 20px | 12px |
| Category → title | 20px | **16px** |
| Title ↔ tag | space-between (auto), min 16px | space-between (auto), min 12px |

If you add new mobile surfaces, prefer the standard scale; only reuse this 20px-title / 14px-metadata pair for the project-card density pattern.
- **Footers:** all footers stack to a single column on mobile (`flex-direction: column`, left-aligned, `16px` gap for the simple footer).

When verifying mobile, use Chrome DevTools Protocol with `Emulation.setDeviceMetricsOverride` (`mobile: true`) — plain headless `--window-size` does not set a true mobile layout viewport and will show false clipping.
