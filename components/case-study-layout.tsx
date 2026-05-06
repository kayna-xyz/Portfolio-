"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"

const SF = "-apple-system, 'SF Pro Text', 'SF Pro Display', sans-serif"

export interface NavItem { id: string; label: string }

interface Props {
  navItems: NavItem[]
  children: React.ReactNode
}

export function CaseStudyLayout({ navItems, children }: Props) {
  const router = useRouter()
  const [active, setActive] = useState(navItems[0]?.id ?? "")
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  // expose ref setter to children via data attribute scanning
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
    <div className="min-h-screen bg-[#FDFBFA]">
      <Navbar />

      <div
        className="grid grid-cols-1 md:grid-cols-3 px-[30px] md:px-[80px]"
        style={{
          paddingTop: "120px",
          paddingBottom: "120px",
          gap: "0",
        }}
      >
        {/* ── Left nav — hidden on mobile ── */}
        <nav className="hidden md:block" style={{ paddingRight: "40px" }}>
          <div style={{ position: "sticky", top: "164px" }}>
            {/* ← Index */}
            <button
              onClick={() => router.push("/")}
              style={{
                fontFamily: SF,
                fontWeight: 500,
                fontSize: "14px",
                color: "#9A9A99",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
              className="hover:text-[#4B4948] transition-colors"
            >
              ← Index
            </button>

            {/* Section links */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {navItems.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  style={{
                    fontFamily: SF,
                    fontWeight: 500,
                    fontSize: "14px",
                    color: active === id ? "#4B4948" : "#9A9A99",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    textAlign: "left",
                    transition: "color 0.2s",
                  }}
                  className="hover:text-[#4B4948]"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* ── Middle content ── */}
        <div style={{ minWidth: 0 }}>
          {children}
        </div>

        {/* ── Right column (TBD) ── */}
        <div className="hidden md:block" />
      </div>
    </div>
  )
}

// ── Typography helpers ──────────────────────────────────────────────────────

export function CSTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 style={{ fontFamily: SF, fontWeight: 500, fontSize: "24px", color: "#000000", marginBottom: "12px", lineHeight: "1.3" }}>
      {children}
    </h1>
  )
}

export function CSHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: SF, fontWeight: 500, fontSize: "24px", color: "#000000", marginBottom: "12px", lineHeight: "1.3" }}>
      {children}
    </h2>
  )
}

export function CSSubheading({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontFamily: "var(--font-pt-serif), 'Georgia', serif", fontWeight: 400, fontSize: "16px", color: "#000000", marginBottom: "8px", lineHeight: "1.65" }}>
      {children}
    </h3>
  )
}

export function CSBody({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ fontFamily: "var(--font-pt-serif), 'Georgia', serif", fontWeight: 400, fontSize: "16px", color: "#000000", lineHeight: "1.65", marginBottom: "16px", ...style }}>
      {children}
    </p>
  )
}

export function CSLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: "var(--font-pt-serif), 'Georgia', serif", fontWeight: 400, fontSize: "16px", color: "#000000", marginBottom: "16px" }}>
      {children}
    </p>
  )
}

export function CSSection({ id, children, style }: { id: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <section id={id} style={{ marginBottom: "64px", scrollMarginTop: "164px", ...style }}>
      {children}
    </section>
  )
}

export function CSMeta({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div style={{ marginBottom: "48px" }}>
      {items.map(({ label, value }) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid #eae8e6" }}>
          <span style={{ fontFamily: SF, fontWeight: 500, fontSize: "16px", color: "#000000" }}>{label}</span>
          <span style={{ fontFamily: SF, fontWeight: 400, fontSize: "16px", color: "#000000", textAlign: "right" }}>{value}</span>
        </div>
      ))}
    </div>
  )
}
