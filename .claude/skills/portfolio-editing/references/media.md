# Media: images & video (mandatory pipeline)

**Every image or video added to the site MUST be optimized and served from `/public` before it ships. Never reference a raw multi-MB asset (or a remote Vercel-blob URL) directly in a page — that is what made the case studies "not load" and stutter.** A cover that takes seconds to appear is a bug, not a content problem.

The goal: a case-study page with many clips must feel instant and never janks — the slot paints a poster immediately, reserves its exact space (no layout shift), and the video streams in only when it nears the viewport.

## Why raw uploads break the site

- Source clips are huge (screen recordings ran **4–18 MB each**; one page pulled ~28 MB of video).
- They are usually **not faststart** (the `moov` atom sits at the end), so the browser must download the *entire* file before it can show one frame.
- No poster ⇒ the card is blank until it buffers.
- Vercel blob storage is slow (~30 s for 7 MB), so on a real connection they effectively never load.

## The pipeline (run for every new asset)

ffmpeg is required. There is no `brew` / `ffmpeg` on this machine — get an arm64 binary once via `npm i ffmpeg-static` (then use `node_modules/ffmpeg-static/ffmpeg`).

**Video** → `/public/cs/<slug>.mp4` (+ poster). Strip audio, scale down, compress, faststart:
```
ffmpeg -i raw.mp4 -an -vf "scale='min(1280,iw)':-2,fps=30" \
  -c:v libx264 -profile:v high -preset slow -crf 27 -pix_fmt yuv420p \
  -movflags +faststart  public/cs/<slug>.mp4
# poster (first content frame ~1s in):
ffmpeg -ss 1 -i raw.mp4 -vf "scale='min(1280,iw)':-2" -frames:v 1 -c:v libwebp -quality 78 public/cs/<slug>-poster.webp
```
Target: **well under ~1.5 MB** per clip (18 MB → typically 0.3–1.2 MB). `-movflags +faststart` is non-negotiable — verify with `head -c 200 file.mp4 | strings | grep -iE 'moov|mdat'` (moov must come first). Confirm the poster frame shows real UI, not a loading spinner — if blank, bump `-ss` (e.g. `-ss 4`).

**Image** → `/public/cs/<slug>.webp`. Resize and convert (big PNG/JPG → tens-to-low-hundreds of KB):
```
ffmpeg -i raw.png -vf "scale='min(1600,iw)':-2" -c:v libwebp -quality 82 public/cs/<slug>.webp
```

Record each asset's final pixel `WxH` — you need it for the markup below to reserve space.

## How to reference assets in pages

Videos go through `CSVideo` (or `CSCover` with `isVideo`) in `components/case-study-layout.tsx`. **Always pass `poster`, `width`, `height`** — the width/height set the aspect-ratio so the slot never shifts, the poster paints instantly, and the player fades the video in over it on `onPlaying`:
```tsx
<CSVideo src="/cs/onboarding.mp4" poster="/cs/onboarding-poster.webp" width={1280} height={720} />
```
Images: serve the local `.webp` and **always include `width`/`height`** so there is no layout shift:
```tsx
<img src="/cs/columbia-web-1.webp" width={1600} height={1040} loading="lazy" style={{ width: "100%", borderRadius: "12px" }} />
```
Keep `border-radius: 12px` on covers (the only rounded corners on the site — see `design-principles.md`). The case-study hero cover keeps `priority`; everything below the fold stays lazy (`<img loading="lazy">`, and `CSVideo`'s built-in IntersectionObserver).

## Checklist before committing media

- [ ] No `hebbkx1anhila5yf` / remote-blob URLs left in `app/case-study/**` (`grep -r hebbkx app/case-study`).
- [ ] Every `.mp4` in `/public/cs` is faststart and < ~1.5 MB.
- [ ] Every video reference passes `poster` + `width` + `height`.
- [ ] Every image is a local `.webp` with `width` + `height`.
- [ ] Build passes and the page paints instantly with no blank slots or layout jump.
