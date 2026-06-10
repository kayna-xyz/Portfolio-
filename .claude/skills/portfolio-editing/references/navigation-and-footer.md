# Navigation and Footer

## Top navigation bar

Spans the full page width with `20px` vertical padding (top + bottom) and `40px` horizontal padding (left + right). A 1px hairline border (`rgba(0,0,0,0.15)`) sits at the bottom of the nav, separating it from page content. See `design-system.md` § Stroke / hairline.

**Left side:** `KAYNA HUANG` wordmark

- Font: TWK Lausanne, 16px
- Weight 400
- Color: `text-muted` (`#000000` at 35%)
- Links to: Home (`/`)

**Right side:** Nav links, arranged in this exact order from left to right:

1. `Blog`
2. `About`

(`Home` and `Playground` were removed from the nav on **both desktop and mobile** — the `KAYNA HUANG` wordmark covers Home.)

- Font: TWK Lausanne 400, 16px
- Color: `text-muted` (`#000000` at 35%) in resting state
- Hover: color becomes `#FF9100`
- Spacing between links: `space-24`

The nav is not sticky in the current implementation.

## ↶ Back link (case study and about pages)

Appears in the top-left area of the content viewport, below the nav bar, aligned to the page's left padding.

- Glyph: `↶` (unicode), followed by space, followed by the word `Back`
- Font: TWK Lausanne 400, 16px (the word "Back")
- Color: `text-muted` (`#000000` at 35%) in resting state
- Hover: color becomes `#FF9100`
- Links to: previous page (browser back, or the index page)

## Footer (case study + about pages — simple footer)

Spans the full page width with `20px` vertical padding (top + bottom) and `40px` horizontal padding (left + right). A 1px hairline border (`rgba(0,0,0,0.15)`) sits at the top of the footer, separating it from the page content above. See `design-system.md` § Stroke / hairline.

The footer is a single horizontal line:

**Left:** `DESIGNED AND DEVELOPED BY KAYNA HUANG`

- Font: Reddit Mono Medium, 16px
- Color: `text-strong` (`#000000` at 75%)
- Not a link

**Right:** Social links, arranged in this exact order from left to right:

1. `X`
2. `Linkedin`
3. `Github`
4. `Email`

- Font: TWK Lausanne 400, 16px
- Color: `text-muted` (`#000000` at 35%) in resting state
- Hover: color becomes `#FF9100`
- Spacing between links: `space-24`

**Homepage footer variant:** the homepage has an expanded footer area above the standard footer line, containing:

- `Menu` section on the left with: Home, Blog, About (each on its own line, 16px TWK Lausanne, `text-muted`)
- `Find Me On` section below Menu with: X, Linkedin, Github, Resume (each on its own line, same styling)
- `LAST PUSH — MAY 2026` timestamp (Reddit Mono Medium, 16px, `text-muted`)
- Contact prompt on the right: "If you are also interested in **product, future of technology, and start-ups**, let's connect!" with email below (16px TWK Lausanne, body in `text-muted`, bolded phrase in `text-strong`)
- `BUILT BY KAYNA HUANG` in the bottom-right (Reddit Mono Medium, 16px, `text-muted`)

## Homepage X / LN / GIT links

Appearing in the top-right of the homepage hero (not in the nav bar). Stacked vertically.

- Font: TWK Lausanne, 16px
- Weight 400
- Color: `text-strong` (`#000000` at 35%) in resting state
- Hover: color becomes `#FF9100`

These are abbreviations (X, LN for LinkedIn, GIT for Github) — intentionally terse, not spelled out.

## Adding new nav or footer items

- Keep the existing ordering; new items go at the end of their respective lists unless there's a strong reason.
- Match the font, size, color, and hover behavior of existing items exactly.
- Do not add icons next to text links.
- Do not group items with separators (`|`, `·`, etc.) unless that pattern already exists in the same component (e.g. project category lines use `·` separators, but nav/footer do not).
