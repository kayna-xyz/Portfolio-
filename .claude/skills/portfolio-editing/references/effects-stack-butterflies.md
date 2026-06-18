# Effects Stack — Butterfly sprite processing

How to add, replace, or remove the butterflies in the 🎮 sticker-tray easter egg.
This doc is **only about turning a raw butterfly image into a usable sprite and
wiring it into the engine** — the flight behaviour (states, flap, cursor-flee)
lives in `components/effects/engine.ts` and is summarised at the bottom.

## Where things live

| Thing | Path |
|---|---|
| Sprite images | `public/effects/bfly-<name>.png` |
| The sprite list the engine picks from | `BFLY_SPRITES` in `components/effects/engine.ts` |
| Flap / motion CSS | `app/globals.css`, `.fx-bfly*` rules |
| The tray + cursor icon (dashed butterfly) | `public/effects/butterfly.webp` |

A butterfly on screen is **one** sprite image rendered top-down. Each click of
the butterfly tool spawns exactly one.

## The processing pipeline

Source images come from the user (usually in `~/Downloads/image NN.png`) as
**top-down butterfly photos on a transparent background**. Two requirements
before a sprite looks right in the engine:

1. **Trimmed** — no empty transparent margin (so the random render size maps to
   the actual butterfly, and the centring math is exact).
2. **Centred on the body axis** — the wings flap as a symmetric horizontal fold
   (`scaleX`) around the sprite's horizontal centre, so the body must sit dead
   centre. We don't trust the geometric bbox centre (wing patterns are often
   asymmetric); we use the **alpha-weighted centroid x** as the body axis, then
   crop symmetrically around it (padding the shorter side with transparency so
   neither wing is clipped).

### Reusable script

Run from the repo root. Edit `items` (source filename → sprite name) and go.

```python
from PIL import Image
import os
srcdir = "/Users/xiaohuanghuang/Downloads"
out = "public/effects"
items = [
    ("image 52.png", "swallowtail"),
    ("image 49.png", "orange"),
    # (source, sprite-name) ...
]
rep = []
for src, name in items:
    im = Image.open(os.path.join(srcdir, src)).convert("RGBA")
    px = im.load()
    l, t, r, b = im.getbbox()                 # tight content box
    sx = sw = 0.0                             # alpha-weighted centroid x = body axis
    for y in range(t, b):
        for x in range(l, r):
            a = px[x, y][3]
            if a:
                sx += x * a
                sw += a
    cx = round(sx / sw) if sw else (l + r) // 2
    pad = 1
    half = max(cx - l, r - cx) + pad          # symmetric crop, keeps both wings
    crop = im.crop((cx - half, t - pad, cx + half, b + pad))
    cw, ch = crop.size
    crop.save(os.path.join(out, f"bfly-{name}.png"))
    rep.append((name, cw, ch, round(cw / ch, 4)))
for x in rep:
    print(x)                                  # name, w, h, aspect — paste aspect into BFLY_SPRITES
```

It prints each sprite's `(name, width, height, aspect)`. **`aspect = width /
height`** is the number you put into `BFLY_SPRITES`; the engine renders the
butterfly at a random width and derives height from it, so the aspect must be
exact or the sprite stretches.

### Before processing — sanity checks

- **Transparent background?** Corners should have `alpha == 0`. If the image is
  on a white background instead, knock the white out first (it'll otherwise show
  as a white box on the cream page). Quick check:
  `[im.convert("RGBA").getpixel(c) for c in corners]`.
- **Top-down and roughly symmetric?** Side-view or 3/4-view photos don't read
  right under a symmetric flap — skip them.

## Wiring a sprite into the engine

In `components/effects/engine.ts`, add (or remove) a line in `BFLY_SPRITES`:

```ts
const BFLY_SPRITES: BflySprite[] = [
  { src: "/effects/bfly-monarch.png", aspect: 1.4 }, // monarch
  { src: "/effects/bfly-swallowtail.png", aspect: 1.0 }, // green swallowtail
  // ...one line per butterfly
]
```

- `src` — the processed PNG under `/public`.
- `aspect` — the `width/height` the script printed.
- The trailing comment is just the common name, for readability.

**To remove a butterfly:** delete its `BFLY_SPRITES` line **and** its
`public/effects/bfly-<name>.png` file. Run `tsc --noEmit` after.

**Naming:** `bfly-<descriptive-common-name>.png` (e.g. `monarch`, `swallowtail`,
`whitemorpho`). When two are similar, suffix with a number (`morpho`, `morpho2`,
`morpho3`). Names must be unique across the set.

## Current set (16)

morpho, tiger, morpho2, monarch, buckeye, morpho3, swallowtail, orange,
skyblue, sulphur, pale, white, pink, cabbage, whitemorpho, rose.

The database is **curated and changes often** — the user adds/removes butterflies
by sending new reference images. Treat `BFLY_SPRITES` as the source of truth.

## Verifying

The effect is desktop-only and interaction-driven, so verify by driving the page
in headless Chrome over CDP (Node 24 has a global `WebSocket`):

1. Click `.effect-controller` (🎮), then the tray button with
   `aria-label="butterflies"`.
2. Spawn with `Input.dispatchMouseEvent` clicks on the page.
3. Read back `.fx-bfly` count / `img src` / `style.transform` to confirm the new
   sprites appear, then screenshot + crop a cluster to eyeball them.

## Behaviour recap (not processing — see engine.ts for detail)

Each spawned butterfly picks a random behaviour and renders a single un-split
sprite with a smooth horizontal wing-fold:

- **States:** `rest` (静止在原地, kept short so the scene stays alive), `walk`
  (走路 — slow crawl to a nearby spot), `wander` (乱飞), `gather` (聚在一起),
  `flyaway` (直接飞走 / cursor-scared / old age).
- **Flap:** `scaleX: 1 → cos(angle)`, where each butterfly picks its own fold
  angle in `[FLAP_ANGLE_MIN_DEG, FLAP_ANGLE_MAX_DEG]` (currently `41°–90°`).
  Per-state speed via `FLAP_DUR`, times a per-butterfly random `flapScale` so
  every butterfly flaps at its own frequency too.
- **Travel:** per-butterfly `speedScale` so each flies/flees at its own pace.
- **Gather:** clusters of **≤10** (one colony is fine; bigger swarm → several), each homing on a
  **"stroke" spot** — an on-screen line/border or text-heavy run found by
  `pickStrokeSpot()` (butterflies perch on the portfolio's ink/text). A cluster
  **keeps milling** around the spot, never freezing.
- **Orientation:** random angle on spawn; turns to face its heading while moving.
- **Cursor:** moving the pointer over a butterfly makes it bolt off-screen.
