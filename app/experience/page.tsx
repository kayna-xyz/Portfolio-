"use client"

import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { useIsMobile } from "@/hooks/use-mobile"

const TWK = "var(--font-twk), system-ui, -apple-system, sans-serif"
const MONO = "var(--font-reddit-mono), ui-monospace, monospace"

const MUTED = "rgba(0,0,0,0.35)"

const SOCIAL = [
  { label: "X", href: "https://x.com/kayna_xyz" },
  { label: "Linkedin", href: "https://www.linkedin.com/in/kayna-h-77ab8a2a1/" },
  { label: "Github", href: "https://github.com/kayna-xyz" },
  { label: "Email", href: "mailto:kaynahuang325@gmail.com" },
]

const labelStyle: React.CSSProperties = {
  fontFamily: MONO,
  fontWeight: 500,
  fontSize: "16px",
  lineHeight: 1,
  letterSpacing: "0.02em",
  color: "rgba(0,0,0,0.35)",
  margin: 0,
  transform: "translateY(-3px)",
}

const bodyStyle: React.CSSProperties = {
  fontFamily: TWK,
  fontWeight: 400,
  fontSize: "16px",
  lineHeight: 1.5,
  color: MUTED,
  margin: 0,
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  const isMobile = useIsMobile()
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "2fr 6fr",
        columnGap: "0",
        rowGap: isMobile ? "32px" : "0",
        marginTop: isMobile ? "64px" : "80px",
        alignItems: "start",
      }}
    >
      <p className="cap-trim" style={{ ...labelStyle, transform: isMobile ? "none" : "translateY(-3px)" }}>{label}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "24px" : "20px" }}>
        {children}
      </div>
    </section>
  )
}

export default function AboutPage() {
  const router = useRouter()
  const isMobile = useIsMobile()

  return (
    <div
      className="page-fade-in"
      style={{ minHeight: "100vh", background: "#FDFBFA", display: "flex", flexDirection: "column" }}
    >
      <Navbar />

      <main
        style={{
          flex: 1,
          paddingTop: isMobile ? "40px" : "58px",
          paddingBottom: isMobile ? "64px" : "80px",
          paddingLeft: isMobile ? "20px" : "40px",
          paddingRight: isMobile ? "20px" : "40px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(16, 1fr)",
            columnGap: "0",
          }}
        >
          {/* ── Sidebar: cols 1–2, sticky on desktop; back link at top on mobile ── */}
          <nav style={{ gridColumn: isMobile ? "auto" : "1 / span 2", marginBottom: isMobile ? "64px" : "0" }}>
            <div style={{ position: isMobile ? "static" : "sticky", top: "58px" }}>
              <button
                onClick={() => router.push("/")}
                className="about-back cap-trim"
                style={{
                  fontFamily: TWK,
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: 1,
                  color: MUTED,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  margin: 0,
                  display: "block",
                  textAlign: "left",
                  transition: "color 150ms ease",
                }}
              >
                ← Back
              </button>
            </div>
          </nav>

          {/* ── Content: cols 5–12 on desktop (centered), full width on mobile ── */}
          <div style={{ gridColumn: isMobile ? "auto" : "5 / span 8", minWidth: 0 }}>
            {/* First section uses marginTop 0 to align with the sticky Back link */}
            <section
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "2fr 6fr",
                rowGap: isMobile ? "32px" : "0",
                alignItems: "start",
              }}
            >
              <p className="cap-trim" style={{ ...labelStyle, transform: isMobile ? "none" : "translateY(-3px)" }}>PRODUCT DESIGN</p>
              <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "24px" : "20px" }}>
                <p className="cap-trim" style={bodyStyle}>
                  I&apos;m a generalist designer with a solid foundation in product design, product strategy, and frontend engineering.
                </p>
                <p className="cap-trim" style={bodyStyle}>
                  The reason drove me into product design is the original passion of tech and the arts.
                </p>
                <p className="cap-trim" style={bodyStyle}>
                  I&apos;m currently pursuing a degree in Cognitive Science (Human-Computer Interaction) with minors in Economics &amp; Political Science at Barnard College of Columbia University, and have worked at several AI unicorns focused on SaaS for prosumers.
                </p>
              </div>
            </section>

            <Section label="WHAT I THINK ABOUT">
              <ul className="about-list" style={{ ...bodyStyle, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: isMobile ? "24px" : "20px", listStyleType: "disc" }}>
                <li>What is the mode of thinking shared by the founders of great products (e.g., Notion, Figma)?</li>
                <li>Is there a binary (0/1) method, like Putnam&apos;s, that can evaluate product design?</li>
                <li>How will AI reshape institutional jobs and reprice the labor market?</li>
                <li>How can I make an impact on the world through my experience in product and design, and by building a sustainable, product-first startup?</li>
                <li>How do I show people the nuance behind product design — the drawing, the diagramming, the thinking — and that designers do far more than what most people see?</li>
                <li>etc</li>
              </ul>
            </Section>

            <Section label="INTERESTS">
              <p className="cap-trim" style={bodyStyle}>Besides of arts and tech, I&apos;m also interested in:</p>
              <ul style={{ ...bodyStyle, paddingLeft: "20px", listStyleType: "disc" }}>
                <li>Poker</li>
                <li>Beverage mixing &amp; making coffee</li>
                <li>Reading</li>
                <li>Fashion</li>
              </ul>
            </Section>

            {/* PHOTOGRAPHY section goes here when photos are added — see layout.md */}
          </div>
        </div>
      </main>

      {/* ── Simple footer (same as case study) ── */}
      <footer
        style={{
          padding: isMobile ? "20px 20px" : "20px 40px",
          background: "#FDFBFA",
          borderTop: "1px solid rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: isMobile ? "16px" : "0",
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
              className="about-social"
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
        .about-back:hover, .about-social:hover { color: #FF9100 !important; }
        /* Trim each list item's line box so the first bullet's cap-top aligns
           with the mono section label (text-box-trim doesn't reach nested <li>). */
        .about-list > li { text-box: trim-both cap alphabetic; }
      `}</style>
    </div>
  )
}
