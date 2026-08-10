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

  // Layout (desktop 3-column row / mobile stacked grid) lives in globals.css
  // under `.hero-inner` and friends, so the breakpoint is pure CSS.
  return (
    <div className="hero-inner">
      {/* ── Nameplate (desktop: left; mobile: above the window, no city name) */}
      <div className="hero-nameplate">
        <p className="hero-city" style={strongLine}>{city.name}</p>
        {location.address && (
          // Mobile shows the address without the trailing state code
          // ("Battery Spencer, Sausalito, CA" → "Battery Spencer, Sausalito");
          // both variants render and CSS picks one, keeping the breakpoint
          // pure CSS like the rest of the hero.
          <p style={mutedLine}>
            <span className="hero-addr-full">{location.address}</span>
            <span className="hero-addr-short">
              {location.address.replace(/,\s*[A-Z]{2}$/, "")}
            </span>
          </p>
        )}
        <LocalTime timezone={location.timezone} />
      </div>

      {/* ── The window (cross-faded when it changes; sized by `.hero-window`) */}
      <div className="hero-window">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <WindowScene scene={scene} width="100%" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Swap to another window (desktop: right; mobile: below, right-aligned) */}
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
