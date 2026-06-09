"use client"

import { useIsMobile } from "@/hooks/use-mobile"

const PT = "var(--font-pt-serif), 'Georgia', serif"
const TWK = "var(--font-twk), system-ui, -apple-system, sans-serif"

const SOCIAL = [
  { label: "X",   href: "https://x.com/kayna_xyz" },
  { label: "LN",  href: "https://www.linkedin.com/in/kayna-h-77ab8a2a1/" },
  { label: "GIT", href: "https://github.com/kayna-xyz" },
]

export default function HeroSection() {
  const isMobile = useIsMobile()
  // Mobile: hero is omitted entirely — nav flows straight into the project list.
  if (isMobile) return null
  return (
    <section
      style={{
        padding: isMobile ? "64px 20px 24px 20px" : "160px 40px 0 40px",
        background: "#FDFBFA",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "24px" : "40px",
          alignItems: "start",
        }}
      >
        {/* Left: hero title */}
        <h1
          style={{
            fontFamily: PT,
            fontWeight: 400,
            fontSize: "48px",
            lineHeight: 1.2,
            color: "rgba(0,0,0,0.75)",
            margin: 0,
            marginTop: "-10px",
            maxWidth: "560px",
          }}
        >
          {"I’m Kayna, a "}
          <em style={{ fontStyle: "italic" }}>product designer who builds.</em>
        </h1>

        {/* Right: intro paragraph + social column — desktop only (hidden on mobile) */}
        {!isMobile && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "40px",
          }}
        >
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
            With <span style={{ color: "rgba(0,0,0,0.75)" }}>3 years of experience</span> of designing products from scratch and tinkering products that at-scale. Currently studying <span style={{ color: "rgba(0,0,0,0.75)" }}>Human-Computer Interaction</span> at Barnard / Columbia as a rising junior. Drawn to <span style={{ color: "rgba(0,0,0,0.75)" }}>explore the next frontier of human-AI interaction, and business-driven products.</span>
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-social"
                style={{
                  fontFamily: TWK,
                  fontWeight: 400,
                  fontSize: "16px",
                  color: "rgba(0,0,0,0.35)",
                  textDecoration: "none",
                  transition: "color 150ms ease",
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
        )}
      </div>

      <style jsx>{`
        .hero-social:hover { color: #FF9100 !important; }
      `}</style>
    </section>
  )
}
