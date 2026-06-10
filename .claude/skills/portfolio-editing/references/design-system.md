# Design System

The complete visual token reference for kayna.ai. **Every value here is exact — do not round, approximate, or "improve" these numbers.**

## Color

### Background

- `#FDFBFA` — warm off-white. The only background color on the site. Never use pure white (`#FFFFFF`).

### Text (all text is black at an opacity)

All text on the site is `#000000` with one of these alpha values. **Never use pure `#000000` at full opacity.**

|Token|Value|Used for|
|---|---|---|
|`text-strong`|`#000000` at 75%|Titles. Highlights inside body text (bolded words like **friends** in the about page). Active/current item in the case study side index. Case-study meta-table labels (TIMELINE / ROLE / TEAM / TOOLS) and their values. The **"DESIGNED AND DEVELOPED BY KAYNA HUANG"** footer credit (about + case-study footers).|
|`text-medium`|`#000000` at 50%|The currently-active section indicator in the case study side index.|
|`text-muted`|`#000000` at 35%|Top navigation bar items (KAYNA HUANG wordmark, Blog / About). Body copy (all paragraph text in about and case studies). Mono labels (DESIGN, BEYOND DESIGN, TIMELINE, ROLE, TEAM, TOOLS, BUILDING PRODUCTS USED BY MILLIONS, the about-page section labels PRODUCT DESIGN / WHAT I THINK ABOUT / INTERESTS, project category lines like "PRODUCT DESIGNER · INTERNSHIP · SUMMER 2025"). Index items in the case study sidebar (non-active). Homepage footer system lines ("LAST PUSH — MAY 2026", "BUILT BY KAYNA HUANG"). The ↶ Back link. (Exception: the "DESIGNED AND DEVELOPED BY KAYNA HUANG" credit is 75% `text-strong`, not muted.)|

### Accent

- `#FF9100` — orange. **Only used on hover** for interactive elements. Never appears in a resting state.

Hover targets that turn `#FF9100`:

- Top navigation links (Home, Playground, Blog, About)
- Footer social links (X, Linkedin, Github, Email)
- Homepage right-side links (X, LN, GIT)
- The ↶ Back button on case study and about pages
- Index items in the case study sidebar

## Typography

### Font families

Exactly three. Never add a fourth.

|Family|Weight|Used for|
|---|---|---|
|**PT Serif**|Regular (400)|Homepage hero only — 48px size, with italic emphasis (e.g. "a _product designer who builds._").|
|**TWK Lausanne**|400|All body copy. All running prose. All 24px titles (project names on the homepage, case-study titles and section headings). The KAYNA HUANG wordmark in the top-left nav (uppercase exception — sole wordmark use).|
|**Reddit Mono**|Medium (500)|All other UPPERCASE labels, metadata, mono tags. Sidebar labels (DESIGN, BEYOND DESIGN, TIMELINE, etc.). Project category strings. Footer credit lines (LAST PUSH — MAY 2026, BUILT BY KAYNA HUANG). The ↶ Back glyph context.|

### Size scale

Exactly three sizes. Never add a fourth. (**One documented exception:** mobile project cards use a 20px title with 14px metadata (category line + tag pill) for density. This is the only place font drops below 16px; everywhere else keeps the 16px floor. See `layout.md` § "Mobile compact scale". Do not generalize it beyond that pattern.)

| Size     | Family                                            | Used for                                                                                                                                       |
| -------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **48px** | PT Serif                                          | Homepage hero only ("I'm Kayna, a _product designer who builds._")                                                                             |
| **24px** | TWK Lausanne                                      | Project names on the homepage (e.g. "HeyGen, AI Avatar SaaS"). Case study titles and subtitles.                                                |
| **16px** | TWK Lausanne (body) / Reddit Mono Medium (labels) | Everything else: body paragraphs, mono labels, nav items, footer items, index, intro copy on the homepage, project descriptions, all metadata. |

### Line height

- Body paragraphs: 1.5 (24px line height on 16px body)
- Titles: 1.2

### Italic

PT Serif italic is used for emphasis inside the 48px hero only ("a _product designer who builds._"). Do not use italic on body copy.

## Spacing scale

Use **only** these values for padding, margin, and gap. Do not introduce new spacing values.

|Token|Value|Typical use|
|---|---|---|
|`space-12`|12px|Tight grouping. Space between a label and its directly-related content when they belong as one unit.|
|`space-16`|16px|Default paragraph-to-paragraph spacing inside a single body block.|
|`space-20`|20px|Space between paragraphs in a content section (e.g. between the three paragraphs under DESIGN on the about page).|
|`space-24`|24px|Mid-density grouping. Space between related but distinct items.|
|`space-40`|40px|**Page padding.** All four sides of every page (top, right, bottom, left) get exactly 40px. The footer's left and right padding is also 40px. (Nav bar uses `space-20` vertical / `space-40` horizontal. Footer uses `space-20` vertical / `space-40` horizontal.)|
|`space-64`|64px|Spacing between mid-level sections.|
|`space-80`|80px|Spacing between major sections (e.g. between the DESIGN block and the BEYOND DESIGN block on the about page).|

## Border radius

Two values, used in specific places only:

- **`12px`** — image covers (homepage project covers, case study cover image)
- **`999px`** (full pill) — project tag pills only (e.g. "Forbes AI 50", "SeriesB", "AI SaaS")

Nothing else on the site has rounded corners — no buttons, no other containers, no cards, no input fields.

## Project tag pill

A small pill-shaped label that sits to the right of a project title on the homepage.

- Background: `#000000` at 5% opacity
- Text color: `text-medium` (`#000000` at 50%)
- Font: TWK Lausanne 400, 16px
- Padding: `4px 12px`
- Border radius: `999px` (full pill)
- This is the **only** background fill allowed on the site. The "no chrome" principle in `design-principles.md` has this single documented exception.

## Stroke / hairline

A single hairline divider used in three specific places only.

- Weight: `1px`
- Color: `#000000` at 15% opacity (`rgba(0, 0, 0, 0.15)`)
- Style: solid

Used for:

- **Nav bar bottom border** — separates the top navigation from page content
- **Footer top border** — separates the project grid from the footer
- **Project cover image border** — a 1px outline around every project cover on the homepage (and the case study cover image)

The principle in `design-principles.md` "no borders on containers" still applies elsewhere — these three uses are the documented exceptions.

## Media / performance

To keep pages fast (no eager multi-MB downloads, no layout shift), always add media through the optimized paths — **never raw `<img>` or eager `<video autoPlay>`** for new content:

- **Images** → `next/image` (`<Image>`) with `width`/`height` (intrinsic pixel size), `sizes`, and `style={{ width: "100%", height: "auto" }}`. It serves WebP/AVIF at the right size, lazy-loads below-the-fold, and reserves space. Mark the single above-the-fold image (homepage first card, case-study cover) `priority`.
- **Videos** → the `CSVideo` component (`components/case-study-layout.tsx`) or the homepage `Cover` lazy path: an `IntersectionObserver` defers the download until ~400–600px before the element scrolls into view, so a page with many videos doesn't fetch them all at once.
- The homepage covers carry their real dimensions in the `PROJECTS` array (`coverW`/`coverH`); case-study covers pass `width`/`height` to `CSCover`.
- Remote (`vercel-storage`) images that lack known dimensions stay as `<img loading="lazy">` (deferred, just not re-encoded).

## What is NOT in this system

If you reach for any of the following, stop:

- Box shadows (any kind)
- Borders on containers
- Background fills on cards or sections (the only background is `#FDFBFA`)
- Gradients (except those that appear inside a project's own screenshot)
- Multiple accent colors (orange is the only accent, and only on hover)
- Bold weights other than what's already on the site (highlights in body are done via opacity 75%, not via `font-weight: bold`)
- Font sizes between or outside 16 / 24 / 48
- Spacing values outside the scale above
- Pure white or pure black
