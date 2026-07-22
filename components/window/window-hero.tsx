"use client"

// Homepage hero: the "Window" daydream art centered, nameplate (city /
// address / local time) on the left, "another window" action on the right.
// Scene cycling + per-scene local clock live here.

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import WindowScene from "./window-scene"
import { manifest, scenePresets } from "./manifest"

const TWK = "var(--font-twk), system-ui, -apple-system, sans-serif"

const strongLine: React.CSSProperties = {
  fontFamily: TWK,
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: 1.5,
  color: "rgba(0,0,0,0.75)",
  margin: 0,
}

const mutedLine: React.CSSProperties = {
  ...strongLine,
  color: "rgba(0,0,0,0.35)",
}

// Ticking local time (to the second) for the scene's timezone. Rendered only
// after mount to avoid a server/client hydration mismatch.
function LocalTime({ timezone }: { timezone: string }) {
  const [time, setTime] = useState<string | null>(null)
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [timezone])
  return (
    <p style={{ ...mutedLine, fontVariantNumeric: "tabular-nums" }}>{time ?? " "}</p>
  )
}

export default function WindowHero() {
  const [index, setIndex] = useState(0)
  const scene = scenePresets[index]

  const city = manifest.cities[scene.cityId]
  const location = city.locations[scene.locationId]

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: "40px",
        width: "100%",
      }}
    >
      {/* ── Left: nameplate */}
      <div style={{ justifySelf: "start" }}>
        <p style={strongLine}>{city.name}</p>
        {location.address && <p style={mutedLine}>{location.address}</p>}
        <LocalTime timezone={location.timezone} />
      </div>

      {/* ── Center: the window (cross-faded when it changes) */}
      <div style={{ position: "relative" }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <WindowScene scene={scene} width="min(700px, 48vw)" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Right: swap to another window */}
      <button
        className="hero-refresh"
        onClick={() => setIndex((i) => (i + 1) % scenePresets.length)}
        style={{
          justifySelf: "end",
          fontFamily: TWK,
          fontWeight: 400,
          fontSize: "16px",
          color: "rgba(0,0,0,0.35)",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          transition: "color 150ms ease",
        }}
      >
        ↻ Change the view
      </button>

      <style jsx>{`
        .hero-refresh:hover { color: #ff9100 !important; }
      `}</style>
    </div>
  )
}
