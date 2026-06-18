---
name: portfolio-editing
description: Use this skill whenever editing, adding to, restyling, or extending kayna.ai or any file in Kayna's portfolio repo. Covers the design system (color, typography, spacing, radius), 16-column layout grid, navigation bar and footer, and the design principles that keep this portfolio distinct from generic AI-generated sites. Trigger on any request like "update my portfolio", "add a new case study", "change the styling", "tweak the about page", "fix the nav", or any edit touching portfolio components, pages, or styles — even if the user does not explicitly say "portfolio".
---

# Portfolio Editing

This skill governs all edits to Kayna Huang's portfolio site (kayna.ai). It is the single source of truth for how the site looks, lays out, and feels. **Do not introduce styles, spacing, fonts, or colors that are not defined in this skill.** If something seems missing, ask before inventing.

## Before any edit

Read the reference file(s) relevant to the change:

|If the change involves...|Read this first|
|---|---|
|Colors, fonts, font sizes, opacities, radius, spacing values|`references/design-system.md`|
|Page structure, the 16-column grid, where things sit on the page|`references/layout.md`|
|The top nav or the footer (links, ordering, hover states)|`references/navigation-and-footer.md`|
|A case-study "outcome" section (the stat cards + data visuals)|`references/case-study-outcome.md`|
|Handwriting margin notes, hand-drawn sketches (简笔画), storyboard cycles, or grouping braces|`references/illustrations-and-notes.md`|
|Adding/replacing any image or video (covers, clips, screenshots)|`references/media.md`|
|The 🎮 effects-stack butterflies — adding/removing/processing sprites|`references/effects-stack-butterflies.md`|
|Any visual decision at all (you should always read this)|`references/design-principles.md`|

`design-principles.md` is non-optional for any visual change — it encodes the taste rules that make this portfolio different from a generic Vercel/shadcn template. Skipping it is how the site gets ruined.

## Non-negotiables (apply to every edit)

- **Never introduce a new font.** Only three are used: PT Serif (titles only), TWK Lausanne 400 (body), Reddit Mono Medium (labels/metadata). See `design-system.md`.
- **Never use pure black `#000000` as a fill.** All text is `#000000` at a defined opacity (75% / 50% / 35%). See `design-system.md` for which opacity goes where.
- **Never add shadows, borders on containers, background cards, or gradient backgrounds.** Hierarchy comes from typography and spacing only. The only rounded corners on the site are on image covers (`border-radius: 12px`).
- **Never add icon libraries** (lucide, heroicons, etc.). The site uses unicode glyphs only (e.g. `↶` for back).
- **Never use an em-dash (`—`) in rendered copy — use a comma.** Applies to all visitor-facing text (headings, body, SEO description, footer lines, tags). Keep en-dashes (`–`) for ranges and arrows (`→`) for before/after; code comments are exempt. See `design-system.md` § "Punctuation & copy".
- **Never use the orange `#FF9100` as a default state.** It only appears on hover for interactive elements (nav links, footer social links, back button, homepage X/LN/GIT links).
- **Padding is always 40px on all four sides of the page**, including the nav bar and the footer. Note: the current deployed footer still has the old horizontal padding — when editing footer code, update it to 40px left/right to match the rest of the site.
- **Spacing values come from a fixed scale only**: 12, 16, 20, 24, 40, 64, 80. Do not use values outside this scale.
- **The grid is 16 columns.** Content pages (case studies, about) follow a 4 / gap / 4 pattern — see `references/layout.md`.
- **Never reference a raw multi-MB video or a remote Vercel-blob URL in a page.** Every image/video must be optimized (faststart + compressed video, webp images) and served from `/public/cs/`, with a poster + width/height on video and width/height on images. This is what keeps pages from stuttering or failing to load — see `references/media.md`. Applies to any new material you upload, too.
- **Responsive layout is CSS-only (media queries), never JS viewport detection.** The site dropped `useIsMobile`-style hooks because rendering desktop on the server then swapping to mobile on the client caused a hydration flash. Use the `@media (max-width: 767px)` classes in `app/globals.css` (the 768px breakpoint); don't branch layout on a JS `isMobile` value.

## Stack

Next.js (App Router, Next 16) + React 19, TypeScript, Tailwind v3 (mostly inline styles + plain CSS in `app/globals.css`). Components in `components/`, pages in `app/`. Fonts via `next/font` (PT Serif, Reddit Mono) + a local TWK Lausanne woff2. Images via `next/image`; case-study video/cover helpers (`CSVideo`, `CSCover`) live in `components/case-study-layout.tsx`. Optimized media lives in `public/` (`public/cs/` for case-study assets).

## When in doubt

Ask Kayna before guessing. A failed edit that follows the rules is recoverable; a "creative" edit that violates the rules contaminates the site's voice and is hard to undo.
