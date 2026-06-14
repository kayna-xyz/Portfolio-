"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"

const TWK = "var(--font-twk), system-ui, -apple-system, sans-serif"
const MONO = "var(--font-reddit-mono), ui-monospace, monospace"

const STRONG = "rgba(0,0,0,0.75)"
const MEDIUM = "rgba(0,0,0,0.5)"
const MUTED = "rgba(0,0,0,0.35)"
const ACCENT = "#FF9100"

export interface NavItem { id: string; label: string }

interface Props {
  navItems: NavItem[]
  children: React.ReactNode
}

const SOCIAL = [
  { label: "X", href: "https://x.com/kayna_xyz" },
  { label: "Linkedin", href: "https://www.linkedin.com/in/kayna-h-77ab8a2a1/" },
  { label: "Github", href: "https://github.com/kayna-xyz" },
  { label: "Email", href: "mailto:kaynahuang325@gmail.com" },
]

export function CaseStudyLayout({ navItems, children }: Props) {
  const router = useRouter()
  const [active, setActive] = useState(navItems[0]?.id ?? "")
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { rootMargin: "-20% 0px -60% 0px" }
    )
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) { sectionRefs.current[id] = el; observer.observe(el) }
    })
    return () => observer.disconnect()
  }, [navItems])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="page-fade-in" style={{ minHeight: "100vh", background: "#FDFBFA", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main className="cs-main" style={{ flex: 1 }}>
        <div
          className="cs-grid"
          style={{
            display: "grid",
            columnGap: "0",
          }}
        >
          {/* ── Sidebar: cols 1–2, sticky on desktop. On mobile: back link only, at top ── */}
          <nav className="cs-sidebar">
            <div className="cs-sidebar-inner">
            <button
              onClick={() => router.push("/")}
              style={{
                fontFamily: TWK,
                fontWeight: 400,
                fontSize: "16px",
                color: MUTED,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "block",
                textAlign: "left",
              }}
              className="cs-back cs-back-btn"
            >
              ← Index
            </button>

            <div className="cs-index" style={{ flexDirection: "column", gap: "12px" }}>
              {navItems.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  style={{
                    fontFamily: TWK,
                    fontWeight: 400,
                    fontSize: "16px",
                    color: active === id ? MEDIUM : MUTED,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    textAlign: "left",
                    transition: "color 150ms ease",
                  }}
                  className="cs-index-item"
                >
                  {label}
                </button>
              ))}
            </div>
            </div>
          </nav>

          {/* ── Content: cols 5–12 on desktop (centered), full width on mobile ── */}
          <div className="cs-content" style={{ minWidth: 0 }}>
            {children}
          </div>
        </div>
      </main>

      {/* ── Simple footer ── */}
      <footer
        className="cs-footer"
        style={{
          background: "#FDFBFA",
          borderTop: "1px solid rgba(0,0,0,0.15)",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontWeight: 500,
            fontSize: "16px",
            letterSpacing: "0.02em",
            color: "rgba(0,0,0,0.75)",
          }}
        >
          DESIGNED AND DEVELOPED BY KAYNA HUANG
        </span>
        <div style={{ display: "flex", gap: "24px" }}>
          {SOCIAL.map((s) => (
            <a
              key={s.label}
              href={s.href}
              {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="cs-social"
              style={{
                fontFamily: TWK,
                fontWeight: 400,
                fontSize: "16px",
                color: MUTED,
                textDecoration: "none",
                transition: "color 150ms ease",
              }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </footer>

      <style jsx global>{`
        .cs-back:hover, .cs-index-item:hover, .cs-social:hover { color: #FF9100 !important; }
      `}</style>
    </div>
  )
}

// ── Typography helpers ──────────────────────────────────────────────────────

export function CSTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 style={{
      fontFamily: TWK,
      fontWeight: 400,
      fontSize: "24px",
      lineHeight: 1.2,
      color: STRONG,
      margin: 0,
    }}>
      {children}
    </h1>
  )
}

export function CSSubtitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: TWK,
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: 1.5,
      color: MUTED,
      margin: "12px 0 0 0",
    }}>
      {children}
    </p>
  )
}

// Lazy-loaded autoplay video with an instant poster.
//
// - The `poster` (a tiny webp first-frame) paints immediately, so the slot is
//   never blank and never shifts layout (the wrapper reserves the exact aspect
//   ratio from width/height).
// - The video itself is faststart-encoded and only fetched ~600px before it
//   scrolls into view; once decoded it fades in over the poster — no jank.
export function CSVideo({ src, poster, width, height, style }: { src: string; poster?: string; width?: number; height?: number; style?: React.CSSProperties }) {
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (ready) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) { setReady(true); io.disconnect() } },
      { rootMargin: "600px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ready])

  const aspectRatio = width && height ? `${width} / ${height}` : undefined
  const fill: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", aspectRatio, overflow: "hidden", ...style }}>
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" aria-hidden style={{ ...fill, opacity: playing ? 0 : 1, transition: "opacity 250ms ease" }} />
      )}
      {ready && (
        <video
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onPlaying={() => setPlaying(true)}
          style={fill}
        />
      )}
    </div>
  )
}

export function CSCover({ src, alt, isVideo, poster, width, height }: { src: string; alt?: string; isVideo?: boolean; poster?: string; width?: number; height?: number }) {
  const frame: React.CSSProperties = {
    borderRadius: "12px",
    border: "1px solid rgba(0,0,0,0.15)",
    boxSizing: "border-box",
    marginTop: "40px",
  }
  if (isVideo) return <CSVideo src={src} poster={poster} width={width} height={height} style={frame} />
  return (
    <Image
      src={src}
      alt={alt ?? ""}
      width={width ?? 1600}
      height={height ?? 1000}
      sizes="(max-width: 768px) 100vw, 50vw"
      priority
      style={{ width: "100%", height: "auto", display: "block", ...frame }}
    />
  )
}

export function CSMeta({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "12px" }}>
      {items.map(({ label, value }) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
          <span style={{
            fontFamily: MONO,
            fontWeight: 500,
            fontSize: "16px",
            letterSpacing: "0.02em",
            color: STRONG,
          }}>
            {label.toUpperCase()}
          </span>
          <span style={{
            fontFamily: TWK,
            fontWeight: 400,
            fontSize: "16px",
            color: STRONG,
            textAlign: "right",
          }}>
            {value}
          </span>
        </div>
      ))}
    </div>
  )
}

export function CSSection({ id, children, style }: { id: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <section id={id} style={{ marginTop: "80px", scrollMarginTop: "80px", ...style }}>
      {children}
    </section>
  )
}

export function CSLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: TWK,
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: 1.5,
      color: MUTED,
      margin: 0,
    }}>
      {children}
    </p>
  )
}

export function CSHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontFamily: TWK,
      fontWeight: 400,
      fontSize: "24px",
      lineHeight: 1.2,
      color: STRONG,
      margin: "12px 0 0 0",
    }}>
      {children}
    </h2>
  )
}

export function CSSubheading({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{
      fontFamily: TWK,
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: 1.5,
      color: STRONG,
      margin: "20px 0 0 0",
    }}>
      {children}
    </h3>
  )
}

// ── Outcome stats ───────────────────────────────────────────────────────────
//
// Typographic stat grid: mono kicker + stat headline + muted description.
// 2-up on desktop (`.cs-outcome-grid` in globals.css), stacked on mobile.
export interface CSOutcomeStat {
  label: React.ReactNode
  stat: React.ReactNode
  description: React.ReactNode
  /** Data-driven visual shown in the card variant. Defaults to an upward curve. */
  viz?: "people" | "coins" | "curve-up" | "curve-down"
}

// Trend curve in the brand accent that draws itself in on scroll. Full grid-width
// (94px) so it lines up with the people/coin grids. `up` = a metric grew
// (revenue, engagement); down = a metric shrank, which is the win (steps, time).
function Curve({ direction = "up" }: { direction?: "up" | "down" }) {
  const ref = useRef<SVGSVGElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const up = "M0 30 L19 25 L38 27 L57 16 L76 13 L94 3"
  const down = "M0 4 L19 9 L38 7 L57 18 L76 21 L94 31"
  const isDown = direction === "down"
  return (
    <svg
      ref={ref}
      width="94"
      height="34"
      viewBox="0 0 94 34"
      fill="none"
      aria-hidden
      style={{ overflow: "visible" }}
    >
      <path
        d={isDown ? down : up}
        stroke={ACCENT}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`cs-spark-path${shown ? " cs-spark-path--in" : ""}`}
      />
      <circle
        cx="94"
        cy={isDown ? 31 : 3}
        r="2.5"
        fill={ACCENT}
        className={`cs-spark-dot${shown ? " cs-spark-dot--in" : ""}`}
      />
    </svg>
  )
}

// Fires once when the element scrolls into view — used to trigger entrance animations.
function useInView(threshold = 0.5) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return { ref, inView }
}

const GRID = { display: "grid", gridTemplateColumns: "repeat(5, 14px)", gap: "6px" } as const

// 01 — acceptance rate: 15 people, one accented. "One in fifteen" made literal.
function PersonGrid({ highlight = 7 }: { highlight?: number }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} style={GRID} aria-hidden>
      {Array.from({ length: 15 }).map((_, i) => {
        const isHl = i === highlight
        return (
          <span
            key={i}
            className={isHl ? "cs-oviz-person-hl" : undefined}
            style={{
              lineHeight: 0,
              opacity: isHl ? 1 : inView ? 1 : 0,
              transition: isHl ? undefined : `opacity 260ms ease ${i * 28}ms`,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill={isHl ? ACCENT : "rgba(0,0,0,0.2)"}>
              <circle cx="8" cy="5" r="3" />
              <path d="M2 15 C2 11 4.7 9 8 9 C11.3 9 14 11 14 15 Z" />
            </svg>
          </span>
        )
      })}
    </div>
  )
}

// 02 — money signed: 15 coins with a continuous left-to-right shimmer sweep.
function CoinGrid() {
  const { ref } = useInView()
  return (
    <div ref={ref} style={GRID} aria-hidden>
      {Array.from({ length: 15 }).map((_, i) => (
        <span key={i} className="cs-oviz-coin" style={{ lineHeight: 0, animationDelay: `${(i % 5) * 170}ms` }}>
          <svg width="14" height="14" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="7" fill={ACCENT} />
            <circle cx="8" cy="8" r="4.2" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
          </svg>
        </span>
      ))}
    </div>
  )
}

function renderOutcomeViz(viz: CSOutcomeStat["viz"]) {
  switch (viz) {
    case "people":
      return <PersonGrid />
    case "coins":
      return <CoinGrid />
    case "curve-down":
      return <Curve direction="down" />
    default:
      return <Curve direction="up" />
  }
}

export function CSOutcome({
  stats,
  variant = "plain",
  style,
}: {
  stats: CSOutcomeStat[]
  variant?: "plain" | "cards"
  style?: React.CSSProperties
}) {
  if (variant === "cards") {
    return (
      <div className="cs-outcome-grid cs-outcome-grid--cards" style={{ marginTop: "20px", ...style }}>
        {stats.map(({ label, stat, description, viz }, i) => (
          <div
            key={i}
            className="cs-outcome-card"
            style={{
              border: "1px solid rgba(0,0,0,0.35)",
              borderRadius: "20px",
              padding: "24px",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  display: "block",
                  fontFamily: MONO,
                  fontWeight: 500,
                  fontSize: "13px",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: MEDIUM,
                }}
              >
                {String(i + 1).padStart(2, "0")} · {label}
              </span>
              <p
                style={{
                  fontFamily: TWK,
                  fontWeight: 400,
                  fontSize: "18px",
                  lineHeight: 1.3,
                  color: STRONG,
                  margin: "12px 0 0 0",
                }}
              >
                {stat}
              </p>
              <p
                style={{
                  fontFamily: TWK,
                  fontWeight: 400,
                  fontSize: "15px",
                  lineHeight: 1.5,
                  color: MUTED,
                  margin: "6px 0 0 0",
                }}
              >
                {description}
              </p>
            </div>
            <div
              style={{
                flexShrink: 0,
                width: "96px",
                height: "54px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {renderOutcomeViz(viz)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="cs-outcome-grid" style={{ marginTop: "40px", ...style }}>
      {stats.map(({ label, stat, description }, i) => (
        <div key={i}>
          <p
            style={{
              fontFamily: MONO,
              fontWeight: 500,
              fontSize: "14px",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: MEDIUM,
              margin: 0,
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontFamily: TWK,
              fontWeight: 400,
              fontSize: "24px",
              lineHeight: 1.2,
              color: STRONG,
              margin: "4px 0 0 0",
            }}
          >
            {stat}
          </p>
          <p
            style={{
              fontFamily: TWK,
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: 1.5,
              color: MUTED,
              margin: "8px 0 0 0",
            }}
          >
            {description}
          </p>
        </div>
      ))}
    </div>
  )
}

export function CSBody({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{
      fontFamily: TWK,
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: 1.5,
      color: MUTED,
      margin: "12px 0 0 0",
      ...style,
    }}>
      {children}
    </p>
  )
}
