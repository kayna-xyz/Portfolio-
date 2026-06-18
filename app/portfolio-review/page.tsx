"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import "./deck.css"
import { DECK } from "./deck.content"
import { renderSlide } from "./archetypes"

export default function PortfolioReviewDeck() {
  const [mounted, setMounted] = useState(false)
  const [index, setIndex] = useState(0)
  const [scale, setScale] = useState(1)
  const [core, setCore] = useState(false)

  // Read ?mode=core after mount (URL is not browser storage). Gate render on
  // mount so SSR/CSR agree and scale is measured against the real viewport.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setCore(params.get("mode") === "core")
    const s = parseInt(params.get("slide") ?? "", 10)
    if (!Number.isNaN(s)) setIndex(Math.max(0, s - 1))
    setMounted(true)
  }, [])

  const slides = useMemo(() => (core ? DECK.filter((s) => s.core) : DECK), [core])
  const total = slides.length
  const clamped = Math.min(index, total - 1)
  const current = slides[clamped]

  // Fit the fixed 1280×720 canvas into the viewport (letterboxed).
  useEffect(() => {
    if (!mounted) return
    const fit = () => setScale(Math.min(window.innerWidth / 1280, window.innerHeight / 720))
    fit()
    window.addEventListener("resize", fit)
    return () => window.removeEventListener("resize", fit)
  }, [mounted])

  const go = useCallback(
    (dir: number) => setIndex((i) => Math.max(0, Math.min(total - 1, i + dir))),
    [total],
  )

  useEffect(() => {
    if (!mounted) return
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault()
          go(1)
          break
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault()
          go(-1)
          break
        case "Home":
          e.preventDefault()
          setIndex(0)
          break
        case "End":
          e.preventDefault()
          setIndex(total - 1)
          break
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [mounted, go, total])

  // Click-to-advance (presenter convenience): left third = back, else forward.
  const onClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a")) return
    go(e.clientX < window.innerWidth / 3 ? -1 : 1)
  }

  if (!mounted) return <div className="pr-deck" style={{ position: "fixed", inset: 0, background: "#fdfbfa" }} />

  return (
    <div className="pr-deck">
      <div className="pr-root" onClick={onClick}>
        <div className="pr-stage" style={{ transform: `scale(${scale})` }}>
          {slides.map((s, i) => (
            <div key={s.id} className={`pr-slide${i === clamped ? " is-active" : ""}`} aria-hidden={i !== clamped}>
              {renderSlide(s)}
            </div>
          ))}

          {/* chrome — scales with the stage, hidden in print */}
          <div className="pr-chrome pr-chrome--section">
            {current.section}
            {core ? " · CORE" : ""}
          </div>
          <div className="pr-chrome pr-chrome--counter">
            {String(clamped + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
          <div className="pr-progress">
            <div className="pr-progress-fill" style={{ width: `${((clamped + 1) / total) * 100}%` }} />
          </div>
          <div className="pr-help">← / → · space · ⌘P to export</div>
        </div>
      </div>
    </div>
  )
}
