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
