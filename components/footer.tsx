"use client"

import Link from "next/link"

const MONO = "var(--font-reddit-mono), ui-monospace, monospace"
const TWK = "var(--font-twk), system-ui, -apple-system, sans-serif"

const MENU = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/experience" },
]

const SOCIAL = [
  { label: "X",        href: "https://x.com/kayna_xyz" },
  { label: "Linkedin", href: "https://www.linkedin.com/in/kayna-h-77ab8a2a1/" },
  { label: "Github",   href: "https://github.com/kayna-xyz" },
  { label: "Resume",   href: "/resume.pdf" },
  { label: "Portfolio Review", href: "/portfolio-review" },
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
        {/* Left column: Menu + Find Me On */}
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
            <p style={headerStyle}>Find Me On</p>
            {SOCIAL.map((s) => (
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
            ))}
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

      <style jsx global>{`
        .footer-link:hover { color: #FF9100 !important; }
      `}</style>
    </footer>
  )
}
