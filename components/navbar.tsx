"use client"

import Link from "next/link"
import { useIsMobile } from "@/hooks/use-mobile"

const TWK = "var(--font-twk), system-ui, -apple-system, sans-serif"

const LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/experience" },
]

export default function Navbar() {
  const isMobile = useIsMobile()
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "16px 20px" : "20px 40px",
        background: "#FDFBFA",
        borderBottom: "1px solid rgba(0,0,0,0.15)",
      }}
    >
      <Link
        href="/"
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

      <div style={{ display: "flex", gap: isMobile ? "20px" : "24px" }}>
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
