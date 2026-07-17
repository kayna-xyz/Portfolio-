"use client"

import Link from "next/link"

const TWK = "var(--font-twk), system-ui, -apple-system, sans-serif"

const LINKS = [
  { label: "Notes", href: "/" },
]

export default function Navbar() {
  return (
    <nav
      className="site-nav"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        // iOS-toolbar frosted glass: translucent bg + backdrop blur (standard
        // property only — Lightning CSS drops the -webkit- prefixed pair).
        // No hairline — the blur itself separates the bar from content.
        background: "rgba(253,251,250,0.72)",
        backdropFilter: "blur(20px) saturate(180%)",
      }}
    >
      <Link
        href="/portfolio"
        style={{
          fontFamily: TWK,
          fontWeight: 400,
          fontSize: "16px",
          color: "rgba(0,0,0,0.35)",
          textDecoration: "none",
        }}
      >
        KAYNA HUANG
      </Link>

      <div className="site-nav-links" style={{ display: "flex" }}>
        {LINKS.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="nav-link"
            style={{
              fontFamily: TWK,
              fontWeight: 400,
              fontSize: "16px",
              color: "rgba(0,0,0,0.35)",
              textDecoration: "none",
              transition: "color 150ms ease",
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <style jsx>{`
        .nav-link:hover { color: #FF9100 !important; }
      `}</style>
    </nav>
  )
}
