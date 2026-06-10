"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

const MONO = "var(--font-reddit-mono), ui-monospace, monospace"
const TWK = "var(--font-twk), system-ui, -apple-system, sans-serif"

function getHoverLabel(href?: string): string {
  if (!href) return "Coming soon"
  if (href.startsWith("/case-study/")) return "View case study"
  return "Try!"
}

interface Project {
  cover: string
  isVideo?: boolean
  poster?: string
  coverW?: number
  coverH?: number
  category: string
  title: string
  tag?: string
  description?: string
  href?: string
}

const PROJECTS: Project[] = [
  {
    cover: "/heygen-cover.png",
    coverW: 1476,
    coverH: 880,
    category: "PRODUCT DESIGNER · INTERNSHIP · SUMMER 2025",
    title: "HeyGen, AI Avatar SaaS",
    tag: "Forbes AI 50",
    description: "Architecting a seamless experience of AI avatar products for prosumers.",
    href: "/case-study/heygen-enterprise",
  },
  {
    cover: "/lluna-cover.png",
    coverW: 1750,
    coverH: 1312,
    category: "FULL STACK ENG · MAR 2026 – MAY 2026",
    title: "Lluna, Skincare Consultant’s Capilot",
    tag: "AI SaaS",
    description: "Building an AI Capilot for uplifting skincare consultant’s revenue",
    href: "/case-study/lluna",
  },
  {
    cover: "/perplexity-cover.png",
    coverW: 914,
    coverH: 632,
    category: "PRODUCT DESIGNER · PERSONAL PROJECT",
    title: "Perplexity Travel Redesign",
    description: "Redesigning Perplexity Travel experience.",
  },
  {
    cover: "/opusclip-cover.png",
    coverW: 1642,
    coverH: 1138,
    category: "PRODUCT DESIGNER · CONTRACT · JUNE 2026 – PRESENT",
    title: "OpusClip, Agent Opus",
    tag: "SeriesB",
    description: "Designing an agent powered editor inside of OpusClip, a video clipping SaaS",
  },
  {
    cover: "/claude-cover.mp4",
    poster: "/claude-cover-poster.webp",
    isVideo: true,
    coverW: 1280,
    coverH: 870,
    category: "PRODUCT DESIGNER / ENGINEERING · PERSONAL PROJECT",
    title: "Claude Mini App, VC Internal Tool",
    tag: "Top 25 AI Unicorns Benchmarked",
    description: "Building an internal tool for VC to benchmark early-stage startups",
    href: "/case-study/signal-32",
  },
  {
    cover: "/filler-cover.mp4",
    poster: "/filler-cover-poster.webp",
    isVideo: true,
    coverW: 1280,
    coverH: 870,
    category: "PRODUCT DESIGNER / ENGINEERING · PERSONAL PROJECTS",
    title: "FDA Filler Selector",
    tag: "Included 63+ Types of Fillers",
    href: "https://v0-filler-search-tool.vercel.app/",
  },
]

function Cover({ src, isVideo, poster, alt, label, width, height, priority }: { src: string; isVideo?: boolean; poster?: string; alt: string; label: string; width?: number; height?: number; priority?: boolean }) {
  const [hovered, setHovered] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const lastClient = useRef({ x: 0, y: 0 })

  // Defer loading the video until it's near the viewport (rootMargin loads it
  // ~400px early so it's ready before it scrolls into view — no eager download).
  useEffect(() => {
    if (!isVideo || videoReady) return
    const el = wrapperRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) { setVideoReady(true); io.disconnect() } },
      { rootMargin: "400px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [isVideo, videoReady])

  const updateLabelPosition = () => {
    if (!wrapperRef.current || !labelRef.current) return
    const rect = wrapperRef.current.getBoundingClientRect()
    const x = lastClient.current.x - rect.left
    const y = lastClient.current.y - rect.top
    labelRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    lastClient.current = { x: e.clientX, y: e.clientY }
    updateLabelPosition()
  }

  useEffect(() => {
    if (!hovered) return
    const onScroll = () => updateLabelPosition()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [hovered])

  const mediaStyle: React.CSSProperties = {
    width: "100%",
    height: "auto",
    display: "block",
    filter: hovered ? "blur(4px)" : "none",
    transform: hovered ? "scale(1.02)" : "scale(1)",
    transition: "filter 200ms ease, transform 200ms ease",
  }

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        position: "relative",
        width: "100%",
        borderRadius: "12px",
        border: "1px solid rgba(0,0,0,0.15)",
        overflow: "hidden",
        boxSizing: "border-box",
        cursor: hovered ? "none" : undefined,
      }}
    >
      {isVideo ? (
        videoReady ? (
          // poster paints the first frame instantly; faststart-encoded src streams in
          <video src={src} poster={poster} autoPlay loop muted playsInline preload="auto" style={mediaStyle} />
        ) : poster ? (
          // Show the lightweight poster until the video is near the viewport — the
          // card never appears blank, and it reserves the exact layout space.
          <Image src={poster} alt={alt} width={width ?? 1280} height={height ?? 870} sizes="(max-width: 768px) 100vw, 50vw" priority={priority} style={mediaStyle} />
        ) : (
          // Reserve approximate space so loading the video doesn't shift the layout
          <div style={{ width: "100%", aspectRatio: "16 / 10" }} />
        )
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width ?? 1200}
          height={height ?? 800}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority}
          style={mediaStyle}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.05)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 200ms ease",
          pointerEvents: "none",
        }}
      />
      <span
        ref={labelRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          fontFamily: TWK,
          fontWeight: 400,
          fontSize: "16px",
          color: "#FFFFFF",
          whiteSpace: "nowrap",
          opacity: hovered ? 1 : 0,
          transition: "opacity 150ms ease",
          pointerEvents: "none",
          willChange: "transform",
        }}
      >
        {label}
      </span>
    </div>
  )
}

function Card({ p, showDescription = true, isMobile = false, priority = false }: { p: Project; showDescription?: boolean; isMobile?: boolean; priority?: boolean }) {
  const inner = (
    <>
      <Cover src={p.cover} isVideo={p.isVideo} poster={p.poster} alt={p.title} label={getHoverLabel(p.href)} width={p.coverW} height={p.coverH} priority={priority} />

      <p
        className="cap-trim"
        style={{
          fontFamily: MONO,
          fontWeight: 500,
          fontSize: isMobile ? "14px" : "16px",
          letterSpacing: "0.02em",
          color: "rgba(0,0,0,0.35)",
          margin: isMobile ? "12px 0 0 0" : "20px 0 0 0",
        }}
      >
        {p.category}
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: isMobile ? "12px" : "16px",
          marginTop: isMobile ? "16px" : "20px",
        }}
      >
        <h3
          className="cap-trim"
          style={{
            fontFamily: TWK,
            fontWeight: 400,
            fontSize: isMobile ? "20px" : "24px",
            lineHeight: 1.2,
            color: "rgba(0,0,0,0.75)",
            margin: 0,
            minWidth: 0,
          }}
        >
          {p.title}
        </h3>
        {p.tag && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: isMobile ? "24px" : "28px",
              padding: isMobile ? "0 10px" : "0 12px",
              fontFamily: TWK,
              fontWeight: 400,
              fontSize: isMobile ? "14px" : "16px",
              color: "rgba(0,0,0,0.5)",
              background: "rgba(0,0,0,0.05)",
              borderRadius: "999px",
              whiteSpace: "nowrap",
              marginTop: isMobile ? "0" : "-10px",
              marginBottom: isMobile ? "0" : "-10px",
            }}
          >
            {p.tag}
          </span>
        )}
      </div>

      {showDescription && p.description && (
        <p
          className="cap-trim"
          style={{
            fontFamily: TWK,
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: 1.5,
            color: "rgba(0,0,0,0.35)",
            margin: "20px 0 0 0",
          }}
        >
          {p.description}
        </p>
      )}
    </>
  )

  if (!p.href) return <div>{inner}</div>
  const isExternal = p.href.startsWith("http")
  return (
    <a
      href={p.href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      style={{ display: "block", textDecoration: "none", color: "inherit" }}
    >
      {inner}
    </a>
  )
}

export default function WorkSection() {
  // Both layouts are rendered; CSS (`.work-grid-desktop` / `.work-grid-mobile`)
  // shows the right one per viewport with no JS detection, so there's no flash.
  // Shared image URLs dedupe to a single network fetch; the hidden variant's
  // videos never fire their IntersectionObserver, so nothing double-loads.
  return (
    <section className="work-section" style={{ background: "#FDFBFA" }}>
      <p
        className="work-tagline"
        style={{
          fontFamily: MONO,
          fontWeight: 500,
          fontSize: "16px",
          letterSpacing: "0.02em",
          color: "rgba(0,0,0,0.35)",
          margin: "0 0 24px 0",
        }}
      >
        BUILDING PRODUCTS USED BY MILLIONS
      </p>

      {/* Desktop: two-column masonry (even indices left, odd right) */}
      <div className="work-grid-desktop">
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {PROJECTS.filter((_, i) => i % 2 === 0).map((p) => (
            <Card key={p.title} p={p} priority={p === PROJECTS[0]} />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {PROJECTS.filter((_, i) => i % 2 === 1).map((p) => (
            <Card key={p.title} p={p} />
          ))}
        </div>
      </div>

      {/* Mobile: single source-ordered column, no descriptions */}
      <div className="work-grid-mobile">
        {PROJECTS.map((p) => (
          <Card key={p.title} p={p} showDescription={false} isMobile priority={p === PROJECTS[0]} />
        ))}
      </div>
    </section>
  )
}
