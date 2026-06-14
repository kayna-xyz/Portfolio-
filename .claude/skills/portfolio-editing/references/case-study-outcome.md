# Case-Study Outcome Cards

How the "outcome" section of a case study is built. This is the one place on the site
where bordered cards, rounded containers, and the accent color at rest are intentionally
allowed — Kayna signed off on this specifically. It is an **exception** to the "no
boxes/no borders/accent-on-hover-only" rules in `design-principles.md`; do not generalize
it to other sections.

## Section structure — no summary heading

An outcome section is **just the `CSLabel` ("The outcome") followed directly by the
`CSOutcome` cards — nothing else.** No `CSHeading` summary sentence ("Measurable impact
across the enterprise platform.", "Accepted, signed, and lifting revenue."), no `CSBody`
context paragraph, no "Special thanks to …" credit. The cards carry the whole story; all of
that was stripped from every case study. The cards variant sits `20px` below the label
(the `cards` branch of `CSOutcome` uses `marginTop: 20px`, tighter than the `plain` 40px,
because it now follows the small label directly rather than a heading + paragraph).

## Component

`CSOutcome` in `components/case-study-layout.tsx`. Two variants:

- `variant="plain"` (default) — the old typographic stat grid. Leave it for any outcome
  not yet upgraded.
- `variant="cards"` — the current design. Use this for new/updated outcome sections.

Each entry in `stats` is `{ label, stat, description, viz }`:

- **label** — short mono kicker, rendered uppercase as `01 · LABEL`. The number is auto.
- **stat** — the headline metric (TWK 18px, 0.75 black). One line ideally.
- **description** — supporting sentence (TWK 15px, 0.35 black).
- **viz** — which data visual sits on the right (see vocabulary below).

Layout per card: bordered container (`1px rgba(0,0,0,0.35)`, `border-radius: 20px`,
`24px` padding), two columns — text left, viz right. The viz lives in a fixed
`96×54px` right-aligned box so **every viz lines up across cards regardless of type**.
Cards stack one-per-row; on mobile the card itself stacks (text then viz).

## Viz vocabulary — match the visual to what the metric *is*

The animation must be semantically tied to the metric. A generic decorative chart was
explicitly rejected ("没有按照我的数据改"). Pick by meaning, not by variety:

| `viz` | Use it for | What it draws |
|---|---|---|
| `people` | a proportion of people (acceptance rate, selection, users) | 3×5 grid of 15 person glyphs, one accented — "N in 15" made literal |
| `coins` | money (ARR, ACV, revenue signed) | 3×5 grid of 15 coins, continuous per-coin brightness shimmer |
| `curve-up` | **any improvement / good news** — including "faster", "fewer steps", "less time". Up = the win. | upward accent line, draws in on scroll, end dot |
| `curve-down` | only when the audience reads *down itself* as the win and the drop is the headline (churn, cost, error rate) | downward accent line, draws in on scroll, end dot |

**Curve direction follows the good news, NOT the raw number.** "30%+ faster" and "fewer
steps" are wins → `curve-up`, even though the underlying quantity (time, steps) went down.
A downward line reads as decline/worse, so reserve `curve-down` for metrics the viewer
instantly understands as "lower is better" (churn ↓, cost ↓). When unsure, use `curve-up`.

`curve-up` is also the default if `viz` is omitted. All visuals are custom inline SVG —
**no icon libraries, no emoji** (still enforced here).

## Color rule for this section

The brand accent `#FF9100` is the only color used in the visuals, and it is the *darkest*
the accent ever gets — the coin shimmer brightens toward gold but never darkens below the
primary orange (a `brightness(<1)` filter turns it muddy brown and reads as black; don't).
Gray elements (unselected people) use `rgba(0,0,0,0.18–0.2)`.

## Motion

Entrance animations (curve draw-in, people fade-in, bar grow) fire once via
IntersectionObserver when the card scrolls into view. Continuous animations (coin shimmer,
any pulse) loop. All of it is disabled under `prefers-reduced-motion: reduce` — keep that
guard when adding new visuals. CSS lives under the `Outcome …` comments in
`app/globals.css`; the IO hook is `useInView` in `case-study-layout.tsx`.

## What was tried and rejected (don't re-propose)

- Plain typographic stat grid — "no design sense."
- Pitch-deck colored stat cards (orange/sage/cream) + two-column solution layouts — worse.
- Comparison **bars** (gray vs orange) for growth/reduction — replaced by curves because
  the two bars were narrower than the grids and didn't align; curves span the full grid
  width.
- A pulsing "live" status dot for shipped/"Live on iOS" — the whole card was removed
  instead. Non-metric milestones don't get a card.

## Process

When restyling outcomes: build/adjust **one** page, screenshot it, get Kayna's sign-off,
then roll the same `viz` mapping across the other case studies. Don't bundle a sweeping
multi-page restyle into one unreviewed change.
