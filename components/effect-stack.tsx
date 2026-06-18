"use client"

import { useEffect, useRef, useState } from "react"
import { EffectsEngine, type Tool } from "@/components/effects/engine"

/*
  Effect Stack — a playful, desktop-only easter egg.

  A 🎮 controller peeks (tilted 15°) from the right edge of every page. Clicking
  it pops a floating glass "sticker tray". The tray holds four stickers + a close
  ✕. Each sticker is a toy:

    gun   — click it to pick up the bubble gun (cursor becomes the gun, -30°);
            clicking anywhere fires random bubbles that drift off-screen, some pop
    pepe  — one-shot: rains frog stickers down the whole screen
    wand  — pick up the wand; press-and-hold grows a bubble (bigger the longer you
            hold), release floats it off in a random direction; hold too long → big pop
    bfly  — pick up the dashed butterfly; click spawns a small swarm of winged
            butterflies (segmented wings, real 3D flap) that perch, fly, gather
            in clusters, and scatter off-screen when the cursor passes near them

  All particle motion lives in the imperative EffectsEngine (no per-frame React).
*/

const TRAY_BOTTOM = 48 // gap from the viewport bottom; horizontally centred
const ITEM = 44 // sticker / close-icon box size
const GAP = 14 // spacing between the items

// a sticker is either a persistent "tool" or a one-shot burst
type StickerDef =
  | { kind: "tool"; tool: Tool; src: string; alt: string }
  | { kind: "burst"; burst: "pepe"; src: string; alt: string }

const STICKERS: StickerDef[] = [
  { kind: "tool", tool: "gun", src: "/effects/gun.webp", alt: "bubble gun" },
  { kind: "burst", burst: "pepe", src: "/effects/pepe.webp", alt: "pepe rain" },
  { kind: "tool", tool: "wand", src: "/effects/wand.webp", alt: "bubble wand" },
  { kind: "tool", tool: "butterfly", src: "/effects/butterfly.webp", alt: "butterflies" },
]

export default function EffectStack() {
  const [mounted, setMounted] = useState(false) // in the DOM (through fade-out)
  const [open, setOpen] = useState(false) // visible state for the transition
  const [active, setActive] = useState<Tool | null>(null) // picked-up tool
  const engineRef = useRef<EffectsEngine | null>(null)

  // create the engine once, on the client
  useEffect(() => {
    const engine = new EffectsEngine()
    engineRef.current = engine
    return () => {
      engine.destroy()
      engineRef.current = null
    }
  }, [])

  const setTool = (tool: Tool | null) => {
    engineRef.current?.setTool(tool)
    setActive(tool)
  }

  const handleOpen = () => {
    setMounted(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)))
  }

  const handleClose = () => {
    setTool(null)
    setOpen(false)
    window.setTimeout(() => setMounted(false), 240) // unmount after fade-out
  }

  const handleSticker = (st: StickerDef) => {
    if (st.kind === "burst") {
      engineRef.current?.burstPepe()
      return
    }
    // toggle the tool: clicking the active one puts it back down
    setTool(active === st.tool ? null : st.tool)
  }

  // Escape: drop the tool first, otherwise close the tray
  useEffect(() => {
    if (!mounted) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      if (engineRef.current?.getTool()) setTool(null)
      else handleClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [mounted])

  return (
    <>
      {/* peeking controller — desktop only (hidden < 768px via CSS) */}
      <button
        type="button"
        aria-label="Open sticker tray"
        className="effect-controller"
        onClick={handleOpen}
      >
        🎮
      </button>

      {/* floating glass tray — fixed: horizontally centred, anchored near the
          viewport bottom so it stays on-screen at any non-mobile height */}
      {mounted && (
        <div
          className="effect-tray"
          style={{
            left: "50%",
            bottom: TRAY_BOTTOM,
            opacity: open ? 1 : 0,
            transform: `translateX(-50%) scale(${open ? 1 : 0.92})`,
          }}
          role="dialog"
          aria-label="Sticker tray"
        >
          <div className="effect-tray-glass" style={{ gap: GAP }}>
          {STICKERS.map((st) => {
            const isActive = st.kind === "tool" && active === st.tool
            return (
              <button
                key={st.src}
                type="button"
                aria-label={st.alt}
                aria-pressed={isActive}
                className={`effect-sticker-btn${isActive ? " is-active" : ""}`}
                style={{ width: ITEM, height: ITEM }}
                onClick={() => handleSticker(st)}
              >
                <img
                  src={st.src}
                  alt={st.alt}
                  className="effect-sticker"
                  style={{ width: ITEM, height: ITEM }}
                  draggable={false}
                />
              </button>
            )
          })}
          <button
            type="button"
            aria-label="Close"
            className="effect-close"
            onClick={handleClose}
            style={{ width: ITEM, height: ITEM }}
          >
            ✕
          </button>
          </div>
        </div>
      )}
    </>
  )
}
