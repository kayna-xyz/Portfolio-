"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

const MONO = "var(--font-reddit-mono), ui-monospace, monospace"
const TWK = "var(--font-twk), system-ui, -apple-system, sans-serif"

const ACCESS_CODE = "88888888"
const GATE_KEY = "kayna-access-unlocked"

const MENU = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/experience" },
]

interface SocialLink {
  label: string
  href: string
  gated?: boolean
}

const SOCIAL: SocialLink[] = [
  { label: "X",                href: "https://x.com/kayna_xyz" },
  { label: "Linkedin",         href: "https://www.linkedin.com/in/kayna-h-77ab8a2a1/" },
  { label: "Github",           href: "https://github.com/kayna-xyz" },
  { label: "Resume",           href: "/resume.pdf",           gated: true },
  { label: "Portfolio Review", href: "/portfolio-review.pdf", gated: true },
]

const EMAIL = "kaynahuang325@gmail.com"

const linkStyle: React.CSSProperties = {
  fontFamily: TWK,
  fontWeight: 400,
  fontSize: "16px",
  color: "rgba(0,0,0,0.35)",
  textDecoration: "none",
  transition: "color 150ms ease",
}

// Buttons that read as links: strip the default chrome so they match the <a> styling exactly.
const linkButtonStyle: React.CSSProperties = {
  ...linkStyle,
  background: "none",
  border: "none",
  padding: 0,
  margin: 0,
  textAlign: "left",
  cursor: "pointer",
}

const headerStyle: React.CSSProperties = {
  fontFamily: TWK,
  fontWeight: 400,
  fontSize: "16px",
  color: "rgba(0,0,0,0.75)",
  margin: 0,
}

const monoStyle: React.CSSProperties = {
  fontFamily: MONO,
  fontWeight: 500,
  fontSize: "16px",
  letterSpacing: "0.02em",
  color: "rgba(0,0,0,0.35)",
}

export default function Footer() {
  const [gate, setGate] = useState<SocialLink | null>(null)
  const [code, setCode] = useState("")
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle")
  const inputRef = useRef<HTMLInputElement>(null)

  const openTarget = (href: string) => window.open(href, "_blank", "noopener,noreferrer")

  const handleGatedClick = (item: SocialLink) => {
    // Type the code once per session, then both gated docs open straight away.
    if (typeof window !== "undefined" && sessionStorage.getItem(GATE_KEY) === "1") {
      openTarget(item.href)
      return
    }
    setCode("")
    setStatus("idle")
    setGate(item)
  }

  const closeGate = () => { setGate(null); setStatus("idle") }

  const submitCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim() === ACCESS_CODE) {
      // Flash the green check, then unlock + open.
      setStatus("success")
      const target = gate
      try { sessionStorage.setItem(GATE_KEY, "1") } catch {}
      setTimeout(() => {
        setGate(null)
        setStatus("idle")
        if (target) openTarget(target.href)
      }, 650)
    } else {
      setStatus("error")
    }
  }

  // Esc closes the gate; focus the field when it opens.
  useEffect(() => {
    if (!gate) return
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeGate() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [gate])

  return (
    <footer
      className="site-footer"
      style={{
        background: "#FDFBFA",
        borderTop: "1px solid rgba(0,0,0,0.15)",
      }}
    >
      <div
        className="footer-grid"
        style={{
          display: "grid",
          gap: "40px",
          alignItems: "stretch",
        }}
      >
        {/* Left column: Menu + Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={headerStyle}>Menu</p>
            {MENU.map((m) => (
              <Link key={m.label} href={m.href} className="footer-link" style={linkStyle}>
                {m.label}
              </Link>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={headerStyle}>Links</p>
            {SOCIAL.map((s) =>
              s.gated ? (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => handleGatedClick(s)}
                  className="footer-link"
                  style={linkButtonStyle}
                >
                  {s.label}
                </button>
              ) : (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="footer-link"
                  style={linkStyle}
                >
                  {s.label}
                </a>
              )
            )}
          </div>
        </div>

        {/* Right column: contact + email at top, LAST PUSH mid, BUILT BY at bottom */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              fontFamily: TWK,
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: 1.5,
              color: "rgba(0,0,0,0.35)",
              margin: 0,
              maxWidth: "560px",
            }}
          >
            If you are also interested in{" "}
            <span style={{ color: "rgba(0,0,0,0.75)" }}>
              product, future of technology, and start-ups
            </span>
            , let{"’"}s connect!
          </p>
          <a
            href={`mailto:${EMAIL}`}
            className="footer-link"
            style={{ ...linkStyle, marginTop: "12px" }}
          >
            {EMAIL}
          </a>
          <span className="footer-lastpush" style={monoStyle}>LAST PUSH, MAY 2026</span>

          {/* Pushed to bottom of right column, baseline-aligned with Resume on left */}
          <span className="footer-builtby" style={monoStyle}>
            BUILT BY KAYNA HUANG
          </span>
        </div>
      </div>

      {gate && (
        <div
          onClick={closeGate}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(253,251,250,0.92)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: "40px",
          }}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submitCode}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "24px",
              width: "100%",
              maxWidth: "520px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{ fontFamily: TWK, fontWeight: 400, fontSize: "24px", lineHeight: 1.2, color: "rgba(0,0,0,0.75)", margin: 0 }}>
                {gate.label}
              </p>
              <p style={{ fontFamily: TWK, fontWeight: 400, fontSize: "16px", lineHeight: 1.5, color: "rgba(0,0,0,0.35)", margin: 0 }}>
                Enter the access code to continue.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", width: "100%" }}>
              <input
                ref={inputRef}
                type="password"
                value={code}
                onChange={(e) => { setCode(e.target.value); setStatus("idle") }}
                inputMode="numeric"
                autoComplete="off"
                aria-label="Access code"
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontFamily: MONO,
                  fontWeight: 500,
                  fontSize: "18px",
                  letterSpacing: "0.3em",
                  color: "rgba(0,0,0,0.75)",
                  background: "#FDFBFA",
                  border: "1px solid rgba(0,0,0,0.15)",
                  borderRadius: "12px",
                  outline: "none",
                  padding: "16px 20px",
                  boxSizing: "border-box",
                }}
              />
              {/* Status circle: reserves its slot so the row never shifts */}
              <span
                aria-hidden
                style={{
                  width: "28px",
                  height: "28px",
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: status === "success" ? "#34C759" : status === "error" ? "#FF3B30" : "transparent",
                  color: "#FFFFFF",
                  fontSize: "16px",
                  lineHeight: 1,
                  transition: "background 150ms ease",
                }}
              >
                {status === "success" ? "✓" : status === "error" ? "✕" : ""}
              </span>
            </div>
            {/* Hidden submit keeps Enter working without a visible button */}
            <button type="submit" aria-label="Unlock" style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0 0 0 0)", border: 0 }} />
          </form>
        </div>
      )}

      <style jsx global>{`
        .footer-link:hover { color: #FF9100 !important; }
      `}</style>
    </footer>
  )
}
