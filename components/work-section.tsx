"use client"

import { useEffect, useRef, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

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
  category: string
  title: string
  tag?: string
  description?: string
  href?: string
}

const PROJECTS: Project[] = [
  {
    cover: "/heygen-cover.png",
    category: "PRODUCT DESIGNER · INTERNSHIP · SUMMER 2025",
    title: "HeyGen, AI Avatar SaaS",
    tag: "Forbes AI 50",
    description: "Architecting a seamless experience of AI avatar products for prosumers.",
    href: "/case-study/heygen-enterprise",
  },
  {
    cover: "/lluna-cover.png",
    category: "FULL STACK ENG · MAR 2026 – MAY 2026",
    title: "Lluna, Skincare Consultant’s Capilot",
    tag: "AI SaaS",
    description: "Building an AI Capilot for uplifting skincare consultant’s revenue",
    href: "/case-study/lluna",
  },
  {
    cover: "/perplexity-cover.png",
    category: "PRODUCT DESIGNER · PERSONAL PROJECT",
    title: "Perplexity Travel Redesign",
    description: "Redesigning Perplexity Travel experience.",
  },
  {
    cover: "/opusclip-cover.png",
    category: "PRODUCT DESIGNER · CONTRACT · JUNE 2026 – PRESENT",
    title: "OpusClip, Agent Opus",
    tag: "SeriesB",
    description: "Designing an agent powered editor inside of OpusClip, a video clipping SaaS",
  },
  {
    cover: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Google%20Chrome-PR77RBIdDfEs1zKLgn0EuDKBOrgdgO.mp4",
    isVideo: true,
    category: "PRODUCT DESIGNER / ENGINEERING · PERSONAL PROJECT",
    title: "Claude Mini App, VC Internal Tool",
    tag: "Top 25 AI Unicorns Benchmarked",
    description: "Building an internal tool for VC to benchmark early-stage startups",
    href: "/case-study/signal-32",
  },
  {
    cover: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fillercover-zeW22rOZkdtjGHesbavcfiMpuPpPpX.mp4",
    isVideo: true,
    category: "PRODUCT DESIGNER / ENGINEERING · PERSONAL PROJECTS",
    title: "FDA Filler Selector",
    tag: "Included 63+ Types of Fillers",
    href: "https://v0-filler-search-tool.vercel.app/",
  },
]

function Cover({ src, isVideo, alt, label }: { src: string; isVideo?: boolean; alt: string; label: string }) {
  const [hovered, setHovered] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const lastClient = useRef({ x: 0, y: 0 })

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
        <video src={src} autoPlay loop muted playsInline style={mediaStyle} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} style={mediaStyle} />
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

function Card({ p, showDescription = true, isMobile = false }: { p: Project; showDescription?: boolean; isMobile?: boolean }) {
  const inner = (
    <>
      <Cover src={p.cover} isVideo={p.isVideo} alt={p.title} label={getHoverLabel(p.href)} />

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
  const isMobile = useIsMobile()
  return (
    <section style={{ padding: isMobile ? "24px 20px 40px 20px" : "40px 40px 40px 40px", background: "#FDFBFA" }}>
      {!isMobile && (
        <p
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
      )}

      {isMobile ? (
        // Mobile: single source-ordered column, no descriptions
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {PROJECTS.map((p) => (
            <Card key={p.title} p={p} showDescription={false} isMobile />
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: "40px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {PROJECTS.filter((_, i) => i % 2 === 0).map((p) => (
              <Card key={p.title} p={p} />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            {PROJECTS.filter((_, i) => i % 2 === 1).map((p) => (
              <Card key={p.title} p={p} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
