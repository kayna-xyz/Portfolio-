## Hand-drawn annotations: margin notes + sketches

Two related devices give case studies their human, hand-made voice. Both use the
**IntrudingCat** handwriting font (already shipped in `/public/fonts`, declared
in `globals.css`). The canonical, working implementation of everything below is
the **Lluna case study** (`app/case-study/lluna/page.tsx`) — copy from there
rather than reinventing.

These are *desktop annotations*. The right empty columns (cols 13–16) are where
they live, so they only render at `≥1024px`. Below that they hide (the margin is
too narrow and they'd overflow). Inline sketches/storyboards are the exception —
those are responsive and collapse to a stack on mobile (see below).

---

### 1. Margin notes (handwriting annotations)

A short, lowercase aside in the right margin that comments on the content next to
it — like a margin scribble in a notebook. Examples from Lluna: `the
waiting-room window`, `so… what actually works best for me?`.

**Rules**

- Use the existing `.cs-margin-note` class — never restyle it inline.
- It is **absolutely positioned**, so the element it annotates must be wrapped in
  a `position: relative` container, with the note as the last child:
  ```tsx
  <div style={{ position: "relative" }}>
    <CSHeading>Both sides of the chair are guessing.</CSHeading>
    <span className="cs-margin-note" aria-hidden>so… what actually works best for me?</span>
  </div>
  ```
- It is **vertically centered against its anchor**: the class uses
  `top: 50%; transform: translateY(-50%) rotate(-2deg)`. The slight `-2deg` tilt
  is intentional (handwritten feel) — keep it. Do not change to top-aligned.
- Always `aria-hidden` (decorative) and `pointer-events: none`.
- Keep it **short** (fits a 160px column, ~3–6 words). Lowercase, conversational.
- Color is the muted ink (`rgba(0,0,0,0.35)`), 16px, line-height 1.4. Don't
  override.
- One note per idea. Don't stack several down one section — they're accents, not
  a second column of copy.

---

### 2. Sketches (简笔画) — the look

Loose single-line drawings (stick figures, a sofa, a phone, a door) that
illustrate a moment. The bar is: **pretty, natural, looks genuinely
hand-drawn** — not a crisp icon-library glyph.

**How to get that feel**

- **Inline SVG only** (no icon libraries — that's a non-negotiable). One drawing
  = one small component returning `<path>`/`<circle>`/`<rect>` primitives.
- **One ink weight, one color.** Set on the `<svg>`: `stroke: INK` where
  `INK = "rgba(0,0,0,0.55)"`, `strokeWidth: 2`, `fill: "none"`,
  `strokeLinecap: "round"`, `strokeLinejoin: "round"`. Round caps/joins are what
  make lines feel drawn, not engineered.
- Typical viewBox is `0 0 120 96` (wider scenes like a consultation use
  `0 0 160 100`). Keep strokeWidth ~2 in that space.
- **Filled accents** (dots, QR squares, a thought-bubble pip): override per-shape
  with `fill={INK} stroke="none"`. (Presentation attributes beat the inherited
  `fill: none` from the svg.)
- Wrap each drawing in the shared **`SketchFrame`** (in the Lluna page): it draws
  the SVG full-width and adds a handwriting caption below it (IntrudingCat 16px,
  muted, centered, `rotate(-1.5deg)`). The tiny rotation sells the hand-made
  feel — keep it.
- Keep scenes **minimal and readable** — a few lines that read at a glance. Draw
  figures in **side profile** when a body interacts with an object (e.g. sitting
  in a chair) so limbs never overlap/clip the object. If a drawing reads as
  ambiguous or "clips through" itself, redraw it; don't ship it.
- Reusable scene components in Lluna to copy/adapt: `SofaScene` (profile figure
  on a couch holding a phone, `screen` prop swaps the content), `MenuScene`,
  `ThinkScene` (figure + thought bubble), `WalkInScene`, `ConsultScene`.

---

### 3. Storyboards — a sketch *cycle* with logic

When several sketches form a sequence, present them as a **loop**, not a flat
row. This is the `CycleStoryboard` pattern in Lluna (Solutions 01 & 02): a
shrunk, left-aligned phone clip on the left, and on the right three numbered
steps arranged at the points of a triangle with **curved arrows running
clockwise** all the way around and back.

**Rules**

- **Number the steps** and **always put step 1 at the top.** Flow clockwise:
  top (1) → bottom-right (2) → bottom-left (3) → back to top. `CycleStoryboard`
  takes `panels` in order and renders slot order `[top, bottom-right,
  bottom-left]`, auto-prefixing each caption with `${i + 1}. `.
- **Arrows must be curved and natural** ("弯弯的"), not straight diagonals. Use
  the `CycArrow` helper: a quadratic Bézier (`M x1 y1 Q cx cy x2 y2`) with the
  arrowhead computed from the **end tangent** (`atan2(y2-cy, x2-cx)`) so the head
  points correctly along the bend. Endpoints sit in the *gaps* between panels, not
  on top of the drawings.
- The arrow overlay is one `<svg viewBox="0 0 100 100">` over a **square**
  container (`.lluna-cycle { aspect-ratio: 1/1 }`), so the 0–100 arrow coords map
  1:1 to the panel `%` positions with no distortion. Arrows use
  `vectorEffect="non-scaling-stroke"` (~1.5px), `opacity ~0.55` (subtle).
- **Responsive:** on mobile (`≤768px`) the cycle collapses to a **numbered
  vertical stack** (1 at the top) and the arrows hide. Layout classes live in
  `globals.css` (`.lluna-cycle`, `.lluna-cyc-a/b/c`, `.lluna-cyc-arrows`).

---

### 4. Grouping brace (curly `}` in the margin)

To bracket two stacked elements (e.g. two console clips) and tie them to a single
margin sketch — Lluna Solution 03, `.lluna-console-aside`:

- Draw the brace as a **tall SVG curly** (`viewBox="0 0 16 400"`) with
  `preserveAspectRatio="xMidYMid meet"` + `vectorEffect="non-scaling-stroke"`. The
  uniform-scale `meet` is essential: it scales the brace to any height **without
  distorting the curves**.
- **Never use `preserveAspectRatio="none"` on a brace** — non-uniform stretching
  turns it into an ugly near-straight line with a bump (this was a real bug). The
  `none` trick is only acceptable for the square arrow overlay above, where the
  box is square so scaling stays uniform.
- The aside (brace + sketch + caption) is desktop-only (`≥1024px`), like margin
  notes.
