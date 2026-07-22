"use client"

// "Window" — an interactive daydream by the window.
// Layered PNG composition with spring-eased 2.5D mouse parallax.
// The scene is a pure function of SceneState; everything is read from the
// manifest (see ./manifest.ts) — no hardcoded cities, windows, or paths.

import { useEffect, useId, useRef, useState } from "react"
import {
  motion,
  useAnimationControls,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion"
import type { MotionValue } from "framer-motion"
import {
  manifest,
  defaultScene,
  COMPOSITION_ASPECT,
  PANEL_BOX,
  PANEL_RADIUS,
  type Box,
  type ContentBox,
  type Layer,
  type RoomObject,
  type SceneState,
  type WindowDef,
} from "./manifest"

// Soft spring — this is where the "leaning to peer out" emotion lives.
const SPRING = { stiffness: 50, damping: 20, mass: 1 }
// Max parallax shift of the nearest view layer, % of the aperture width.
const MAX_SHIFT_X_PCT = 11
const MAX_SHIFT_Y_PCT = 5.5
// Max tilt of the outside group, degrees.
const MAX_TILT_DEG = 2.5
// Counter-shift of the near plane (wall + frame), % of composition width.
const WALL_COUNTER_PCT = 0.6
// Cross-fade for day ⇄ night and window open ⇄ closed.
const LIGHT_FADE = { duration: 1.2, ease: "easeInOut" as const }
const FRAME_FADE = { duration: 0.5, ease: "easeInOut" as const }

const FULL_CONTENT: ContentBox = { x0: 0, y0: 0, x1: 1, y1: 1 }

const boxStyle = (b: Box): React.CSSProperties => ({
  position: "absolute",
  left: `${b.left}%`,
  top: `${b.top}%`,
  width: `${b.width}%`,
  height: `${b.height}%`,
})

// Scale/position an asset so its content bbox lands exactly on `box`
// (compensates the transparent shadow margins baked into the PNGs).
const placeBox = (box: Box, cb: ContentBox = FULL_CONTENT): Box => {
  const w = box.width / (cb.x1 - cb.x0)
  const h = box.height / (cb.y1 - cb.y0)
  return {
    left: box.left - cb.x0 * w,
    top: box.top - cb.y0 * h,
    width: w,
    height: h,
  }
}

// Convert a canvas-% box into wall-panel-% coordinates (objects live inside
// the panel so the panel's rounded overflow clips them).
const canvasToPanel = (b: Box): Box => ({
  left: ((b.left - PANEL_BOX.left) / PANEL_BOX.width) * 100,
  top: ((b.top - PANEL_BOX.top) / PANEL_BOX.height) * 100,
  width: (b.width / PANEL_BOX.width) * 100,
  height: (b.height / PANEL_BOX.height) * 100,
})

export default function WindowScene({
  scene = defaultScene,
  width = "min(660px, 70vw)",
}: {
  scene?: SceneState
  width?: string
}) {
  const [light, setLight] = useState<"day" | "night">(scene.light)
  // Toggleable windows start closed — clicking them swings the sashes open.
  const [windowOpen, setWindowOpen] = useState(false)
  const reducedMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  // Normalized mouse offset from scene center, in [-1, 1].
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, SPRING)
  const sy = useSpring(my, SPRING)

  // Outside view group: tilts slightly (layers shift individually by depth).
  const tiltX = useTransform(sy, (v) => v * -MAX_TILT_DEG)
  const tiltY = useTransform(sx, (v) => v * MAX_TILT_DEG)
  // Near plane (wall + frame): very slight counter-shift.
  const wallX = useTransform(sx, (v) => `${v * -WALL_COUNTER_PCT}%`)
  const wallY = useTransform(sy, (v) => `${v * -WALL_COUNTER_PCT * 0.6}%`)

  const onMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1)
    my.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }
  const onMouseLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const location = manifest.cities[scene.cityId]?.locations[scene.locationId]
  const windowDef = manifest.windows[scene.windowId]
  const wallpaper = manifest.wallpapers[scene.wallpaperId]
  if (!location || !windowDef || !wallpaper) return null

  const night = light === "night" && location.hasNight
  const toggleLight = () => setLight((l) => (l === "day" ? "night" : "day"))
  const frameImgBox = placeBox(windowDef.frameBox, windowDef.contentBox)
  const openImgBox = windowDef.openSrc
    ? placeBox(windowDef.openBox ?? windowDef.frameBox, windowDef.openContentBox)
    : null

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      role="img"
      aria-label={`${location.label} — a window daydream.`}
      style={{
        position: "relative",
        width,
        aspectRatio: `${COMPOSITION_ASPECT}`,
        overflow: "hidden",
        perspective: "900px",
        userSelect: "none",
      }}
    >
      {/* ── Near plane: wall panel + room objects (counter-shifts slightly) */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          x: reducedMotion ? 0 : wallX,
          y: reducedMotion ? 0 : wallY,
          willChange: "transform",
        }}
      >
        {/* Wallpaper + objects fill the rounded wall panel; the white feather
            of the effect overlays blends its edges into the page. */}
        <div
          style={{
            ...boxStyle(PANEL_BOX),
            borderRadius: PANEL_RADIUS,
            overflow: "hidden",
          }}
        >
          <img
            src={wallpaper.src}
            alt=""
            draggable={false}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {wallpaper.objects
            .filter((o) => o.layer !== "canvas")
            .map((o) => (
              <RoomObjectView key={o.id} obj={o} frozen={!!reducedMotion} />
            ))}
        </div>
        {/* Canvas-layer objects escape the panel clip (e.g. furniture running
            off the composition edge); the vignette still feathers them. */}
        {wallpaper.objects
          .filter((o) => o.layer === "canvas")
          .map((o) => (
            <RoomObjectView key={o.id} obj={o} frozen={!!reducedMotion} />
          ))}
      </motion.div>

      {/* ── Outside view, clipped to the window aperture */}
      <div
        style={{
          ...boxStyle(windowDef.aperture),
          overflow: "hidden",
          borderRadius: windowDef.apertureRadius,
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            rotateX: reducedMotion ? 0 : tiltX,
            rotateY: reducedMotion ? 0 : tiltY,
            transformPerspective: 900,
            willChange: "transform",
          }}
        >
          {location.layers.map((layer) => (
            <ViewLayer
              key={layer.id}
              layer={layer}
              sx={sx}
              sy={sy}
              night={night}
              frozen={!!reducedMotion}
            />
          ))}
        </motion.div>
      </div>

      {/* ── Window frame (near plane, counter-shifts with the wall) */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          x: reducedMotion ? 0 : wallX,
          y: reducedMotion ? 0 : wallY,
          pointerEvents: "none",
          willChange: "transform",
        }}
      >
        {openImgBox && windowDef.sashes && !reducedMotion ? (
          <SashWindow
            windowDef={windowDef}
            frameImgBox={frameImgBox}
            openImgBox={openImgBox}
            open={windowOpen}
          />
        ) : openImgBox ? (
          <>
            <motion.img
              src={windowDef.frameSrc}
              alt=""
              draggable={false}
              initial={false}
              animate={{ opacity: windowOpen ? 0 : 1 }}
              transition={FRAME_FADE}
              style={{ ...boxStyle(frameImgBox), objectFit: "contain" }}
            />
            <motion.img
              src={windowDef.openSrc}
              alt=""
              draggable={false}
              initial={false}
              animate={{ opacity: windowOpen ? 1 : 0 }}
              transition={FRAME_FADE}
              style={{ ...boxStyle(openImgBox), objectFit: "contain" }}
            />
          </>
        ) : (
          <img
            src={windowDef.frameSrc}
            alt=""
            draggable={false}
            style={{ ...boxStyle(frameImgBox), objectFit: "contain" }}
          />
        )}
      </motion.div>

      {/* ── Light effects: soft white edge feather (always on) + night
             darkness/glow overlay (fades in above it). */}
      {manifest.effects.daySrc && (
        <img
          src={manifest.effects.daySrc}
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />
      )}
      {location.hasNight && manifest.effects.nightSrc && (
        <motion.img
          src={manifest.effects.nightSrc}
          alt=""
          draggable={false}
          initial={false}
          animate={{ opacity: night ? 1 : 0 }}
          transition={LIGHT_FADE}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />
      )}

      {/* ── Invisible hotspots (above the overlays) */}
      {wallpaper.objects
        .filter((o) => o.role === "light-switch")
        .map((o) => (
          <motion.button
            key={`${o.id}-hotspot`}
            onClick={toggleLight}
            whileTap={{ scale: 0.9 }}
            aria-label={night ? "Turn on the day" : "Turn off the light"}
            title={night ? "Day" : "Night"}
            style={{
              ...boxStyle(o.box),
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          />
        ))}
      {windowDef.openSrc && (
        <button
          onClick={() => setWindowOpen((v) => !v)}
          aria-label={windowOpen ? "Close the window" : "Open the window"}
          title={windowOpen ? "Close" : "Open"}
          style={{
            ...boxStyle(windowDef.frameBox),
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        />
      )}
    </div>
  )
}

// One depth plane of the outside view. Shifts WITH the mouse, scaled by its
// depth (far layers barely move, near layers move most). Slightly zoomed so
// panning never reveals the aperture edge.
function ViewLayer({
  layer,
  sx,
  sy,
  night,
  frozen,
}: {
  layer: Layer
  sx: MotionValue<number>
  sy: MotionValue<number>
  night: boolean
  frozen: boolean
}) {
  const x = useTransform(sx, (v) => `${v * MAX_SHIFT_X_PCT * layer.depth * 2}%`)
  const y = useTransform(sy, (v) => `${v * MAX_SHIFT_Y_PCT * layer.depth * 2}%`)

  // Default zoom leaves ≥7.5% margin so the ±7% parallax pan never reveals
  // the aperture edge.
  const common: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: layer.position ?? "50% 60%",
    // Zoom leaves margin so the ±11% parallax pan never reveals the edge.
    scale: layer.scale ?? 1.24,
  }

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        x: frozen ? 0 : x,
        y: frozen ? 0 : y,
        willChange: "transform",
      }}
    >
      <img src={layer.src} alt="" draggable={false} style={common} />
      {layer.nightSrc && (
        <motion.img
          src={layer.nightSrc}
          alt=""
          draggable={false}
          initial={false}
          animate={{ opacity: night ? 1 : 0 }}
          transition={LIGHT_FADE}
          style={common}
        />
      )}
    </motion.div>
  )
}

// ─── Sash-swing window ───────────────────────────────────────────────────────
// A real hinge animation built from the two static frame assets: the closed
// asset is split into "chrome" (frame + arch, sash areas cut out with an
// even-odd SVG clip) and two sash panels, each of which pivots on its hinge
// edge in 3D. Once the swing lands, it crossfades into the painted open asset.

const SWING_DEG = 76 // how far the sashes swing toward the viewer
const SWING_EASE = [0.55, 0.06, 0.25, 1] as const

function SashWindow({
  windowDef,
  frameImgBox,
  openImgBox,
  open,
}: {
  windowDef: WindowDef
  frameImgBox: Box
  openImgBox: Box
  open: boolean
}) {
  const clipId = useId()
  const cb = windowDef.contentBox
  const fb = windowDef.frameBox
  const sashes = windowDef.sashes!

  // Content fraction → fraction of the closed-frame IMG canvas (for the clip).
  const ix = (f: number) => cb.x0 + f * (cb.x1 - cb.x0)
  const iy = (f: number) => cb.y0 + f * (cb.y1 - cb.y0)
  const hole = (s: ContentBox) =>
    `M${ix(s.x0)} ${iy(s.y0)}H${ix(s.x1)}V${iy(s.y1)}H${ix(s.x0)}Z`
  const chromeClip = `M0 0H1V1H0Z ${hole(sashes.left)} ${hole(sashes.right)}`

  // Content fraction → canvas-% box (sash rects live on the frameBox).
  const sashCanvasBox = (s: ContentBox): Box => ({
    left: fb.left + s.x0 * fb.width,
    top: fb.top + s.y0 * fb.height,
    width: (s.x1 - s.x0) * fb.width,
    height: (s.y1 - s.y0) * fb.height,
  })

  const renderSash = (side: "left" | "right") => {
    const s = sashes[side]
    const b = sashCanvasBox(s)
    // The full closed-frame img, positioned relative to this sash's crop.
    const inner: React.CSSProperties = {
      position: "absolute",
      left: `${((frameImgBox.left - b.left) / b.width) * 100}%`,
      top: `${((frameImgBox.top - b.top) / b.height) * 100}%`,
      width: `${(frameImgBox.width / b.width) * 100}%`,
      height: `${(frameImgBox.height / b.height) * 100}%`,
    }
    const target = side === "left" ? -SWING_DEG : SWING_DEG
    return (
      <motion.div
        key={side}
        initial={false}
        animate={{ rotateY: open ? target : 0, opacity: open ? 0 : 1 }}
        transition={{
          rotateY: {
            duration: open ? 0.95 : 0.85,
            ease: SWING_EASE,
            delay: open ? (side === "right" ? 0.1 : 0) : side === "left" ? 0.08 : 0,
          },
          opacity: open ? { delay: 0.72, duration: 0.25 } : { duration: 0.1 },
        }}
        style={{
          ...boxStyle(b),
          overflow: "hidden",
          transformOrigin: side === "left" ? "left center" : "right center",
          transformPerspective: 900,
          willChange: "transform",
        }}
      >
        <img src={windowDef.frameSrc} alt="" draggable={false} style={inner} />
      </motion.div>
    )
  }

  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path fillRule="evenodd" clipRule="evenodd" d={chromeClip} />
          </clipPath>
        </defs>
      </svg>
      {/* Frame + arch, sash areas cut out */}
      <motion.img
        src={windowDef.frameSrc}
        alt=""
        draggable={false}
        initial={false}
        animate={{ opacity: open ? 0 : 1 }}
        transition={open ? { delay: 0.75, duration: 0.25 } : { duration: 0.1 }}
        style={{
          ...boxStyle(frameImgBox),
          objectFit: "contain",
          clipPath: `url(#${clipId})`,
        }}
      />
      {/* Painted open state, fading in as the swing lands */}
      <motion.img
        src={windowDef.openSrc}
        alt=""
        draggable={false}
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={open ? { delay: 0.68, duration: 0.3 } : { duration: 0.18 }}
        style={{ ...boxStyle(openImgBox), objectFit: "contain" }}
      />
      {renderSash("left")}
      {renderSash("right")}
    </>
  )
}

// ─── Room objects ────────────────────────────────────────────────────────────

function RoomObjectView({ obj, frozen }: { obj: RoomObject; frozen: boolean }) {
  // Panel-layer objects live in wall-panel coordinates (so the panel's
  // rounded overflow clips falls/crawls); canvas-layer ones use raw canvas %.
  const onCanvas = obj.layer === "canvas"
  const placed = placeBox(obj.box, obj.contentBox)
  const b = onCanvas ? placed : canvasToPanel(placed)
  // The "ground": bottom of the panel, in each coordinate space.
  const floorPct = onCanvas ? PANEL_BOX.top + PANEL_BOX.height : 100

  switch (obj.role) {
    case "fall":
      return <FallingObject obj={obj} b={b} floorPct={floorPct} canvasWidthPct={onCanvas ? 100 : PANEL_BOX.width} />
    case "wobble":
      return <WobblingObject obj={obj} b={b} />
    case "lamp":
      return <LampObject obj={obj} b={b} />
    case "spider":
      return <SpiderObject obj={obj} b={b} frozen={frozen} />
    case "light-switch": // rendered here for looks; its hotspot lives on top
    default:
      return (
        <img
          src={obj.src}
          alt=""
          draggable={false}
          style={{ ...boxStyle(b), objectFit: "contain" }}
        />
      )
  }
}

// Click: drops to the "ground" (panel bottom) with a small bounce.
// Click again: hangs it back up.
function FallingObject({
  obj,
  b,
  floorPct,
  canvasWidthPct,
}: {
  obj: RoomObject
  b: Box
  floorPct: number
  canvasWidthPct: number
}) {
  const [fallen, setFallen] = useState(false)
  // Distance to the floor / sideways drift, in % of the element's own size.
  const fallPct = Math.max(0, ((floorPct - b.top - b.height) / b.height) * 100)
  const driftPct = (((obj.fallShiftX ?? 0) * 100) / canvasWidthPct / b.width) * 100
  const rot = obj.fallRotate ?? 80

  return (
    <motion.img
      src={obj.src}
      alt=""
      draggable={false}
      onClick={() => setFallen((v) => !v)}
      initial={false}
      animate={
        fallen
          ? {
              y: [`0%`, `${fallPct}%`, `${fallPct * 0.985}%`, `${fallPct}%`],
              x: [`0%`, `${driftPct * 0.7}%`, `${driftPct}%`, `${driftPct}%`],
              rotate: [0, rot * 0.7, rot, rot],
            }
          : { y: "0%", x: "0%", rotate: 0 }
      }
      transition={
        fallen
          ? { duration: 1.1, times: [0, 0.62, 0.8, 1], ease: ["easeIn", "easeOut", "easeIn"] }
          : { type: "spring", stiffness: 60, damping: 14 }
      }
      style={{ ...boxStyle(b), objectFit: "contain", cursor: "pointer" }}
    />
  )
}

// Click: swings on its nail.
function WobblingObject({ obj, b }: { obj: RoomObject; b: Box }) {
  const controls = useAnimationControls()
  const wobble = () =>
    controls.start({
      rotate: [0, -6, 4.5, -3, 1.8, 0],
      transition: { duration: 1.3, ease: "easeInOut" },
    })

  return (
    <motion.img
      src={obj.src}
      alt=""
      draggable={false}
      onClick={wobble}
      animate={controls}
      style={{
        ...boxStyle(b),
        objectFit: "contain",
        cursor: "pointer",
        transformOrigin: "50% -15%",
      }}
    />
  )
}

// Click: warm glow on / off. Starts off — clicking turns the light on.
function LampObject({ obj, b }: { obj: RoomObject; b: Box }) {
  const [lit, setLit] = useState(false)
  return (
    <div style={{ ...boxStyle(b), cursor: "pointer" }} onClick={() => setLit((v) => !v)}>
      <motion.div
        initial={false}
        animate={{ opacity: lit ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        style={{
          position: "absolute",
          left: "50%",
          top: "70%",
          width: "420%",
          aspectRatio: "1",
          transform: "translate(-50%, -35%)",
          background:
            "radial-gradient(circle, rgba(255,196,110,0.5) 0%, rgba(255,196,110,0.16) 42%, rgba(255,196,110,0) 68%)",
          pointerEvents: "none",
        }}
      />
      <motion.img
        src={obj.src}
        alt=""
        draggable={false}
        initial={false}
        animate={{ filter: lit ? "brightness(1.1)" : "brightness(0.98)" }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  )
}

// Ambient: real-spider movement — a quick turn, a short fast scurry, an
// abrupt stop, a long still pause. Never a slow steady glide.
function SpiderObject({ obj, b, frozen }: { obj: RoomObject; b: Box; frozen: boolean }) {
  const [pose, setPose] = useState({ left: b.left, top: b.top, rotate: 0, dur: 0 })

  // Derived from the object id so each spider walks its own path (no
  // Math.random during render — keeps SSR/client output identical).
  const seed = useRef(obj.id.split("").reduce((a, c) => a + c.charCodeAt(0), 7919))
  const rand = () => {
    let s = seed.current
    s ^= s << 13
    s ^= s >> 7
    s ^= s << 5
    seed.current = s & 0x7fffffff
    return (seed.current % 1000) / 1000
  }

  useEffect(() => {
    if (frozen) return
    let cancelled = false
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
    // Shortest way round so it never pirouettes the long way.
    const turnTo = (from: number, to: number) => from + ((((to - from) % 360) + 540) % 360) - 180

    const cur = { left: b.left, top: b.top, rotate: 0 }
    const run = async () => {
      await sleep(900 + rand() * 2600)
      while (!cancelled) {
        // Pick a short hop; occasionally a longer dash across the wall.
        const ang = rand() * Math.PI * 2
        const dist = rand() < 0.18 ? 16 + rand() * 22 : 3.5 + rand() * 8
        const tx = clamp(cur.left + Math.cos(ang) * dist, 4, 92 - b.width)
        const ty = clamp(cur.top + Math.sin(ang) * dist, 5, 90 - b.height)
        const dx = tx - cur.left
        const dy = ty - cur.top
        const d = Math.hypot(dx, dy)
        if (d < 2) continue
        const heading = turnTo(cur.rotate, (Math.atan2(dy, dx) * 180) / Math.PI + 90)
        // 1. snap-turn on the spot
        cur.rotate = heading
        setPose({ left: cur.left, top: cur.top, rotate: heading, dur: 0.15 })
        await sleep(170 + rand() * 250)
        if (cancelled) return
        // 2. fast scurry burst, stopping abruptly
        const dur = d / (20 + rand() * 16)
        cur.left = tx
        cur.top = ty
        setPose({ left: tx, top: ty, rotate: heading, dur })
        await sleep(dur * 1000 + 60)
        // 3. sometimes chain another burst, usually freeze for a while
        if (rand() < 0.3) continue
        await sleep(600 + rand() * 4200)
      }
    }
    run()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frozen])

  return (
    <motion.img
      src={obj.src}
      alt=""
      draggable={false}
      initial={false}
      animate={{ left: `${pose.left}%`, top: `${pose.top}%`, rotate: pose.rotate }}
      transition={{ duration: pose.dur, ease: pose.dur < 0.2 ? "easeInOut" : "easeOut" }}
      style={{
        position: "absolute",
        left: `${b.left}%`,
        top: `${b.top}%`,
        width: `${b.width}%`,
        height: `${b.height}%`,
        objectFit: "contain",
      }}
    />
  )
}
