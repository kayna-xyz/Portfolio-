"use client"

import { CaseStudyLayout, CSTitle, CSSubtitle, CSCover, CSHeading, CSBody, CSLabel, CSSection, CSMeta, NavItem } from "@/components/case-study-layout"

const TWK = "var(--font-twk), system-ui, -apple-system, sans-serif"
const MONO = "var(--font-reddit-mono), ui-monospace, monospace"

const STRONG = "rgba(0,0,0,0.75)"
const MUTED = "rgba(0,0,0,0.35)"

const navItems: NavItem[] = [
  { id: "overview",      label: "Overview" },
  { id: "the-problem",   label: "The problem" },
  { id: "solution-1",    label: "Solution 1" },
  { id: "solution-2",    label: "Solution 2" },
  { id: "solution-3",    label: "Solution 3" },
  { id: "the-outcome",   label: "The outcome" },
  { id: "mobile",        label: "Mobile" },
  { id: "mobile-overview",     label: "Overview" },
  { id: "mobile-the-problem",  label: "The problem" },
  { id: "mobile-solution",     label: "Solution" },
  { id: "mobile-the-outcome",  label: "The outcome" },
]

const enterpriseMeta = [
  { label: "Timeline", value: "4 Months" },
  { label: "Role",     value: "Product Design Intern" },
  { label: "Team",     value: "Nick Allen, Manuela Odell, Tiffany Huang, Wayne L." },
  { label: "Tools",    value: "Figma" },
]

interface Stat {
  metric: string
  description: React.ReactNode
}

function OutcomeGrid({ stats }: { stats: Stat[] }) {
  return (
    <div
      style={{
        marginTop: "40px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        columnGap: "40px",
        rowGap: "40px",
      }}
    >
      {stats.map(({ metric, description }, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column" }}>
          <p
            className="cap-trim"
            style={{
              fontFamily: TWK,
              fontWeight: 400,
              fontSize: "24px",
              lineHeight: 1.2,
              color: STRONG,
              margin: 0,
            }}
          >
            {metric}
          </p>
          <p
            className="cap-trim"
            style={{
              fontFamily: TWK,
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: 1.5,
              color: MUTED,
              margin: "20px 0 0 0",
            }}
          >
            {description}
          </p>
        </div>
      ))}
    </div>
  )
}

export default function HeyGenCaseStudy() {
  return (
    <CaseStudyLayout navItems={navItems}>

      {/* ── ENTERPRISE ─────────────────────────────── */}

      <CSTitle>HeyGen, Forbes AI 50, App Design</CSTitle>
      <CSSubtitle>Architecting a seamless AI video experience for enterprise-scale and consumer communication.</CSSubtitle>
      <CSCover src="/heygen-cover.png" alt="HeyGen cover" />
      <CSMeta items={enterpriseMeta} />

      <CSSection id="overview">
        <CSLabel>Overview</CSLabel>
        <CSHeading>An AI video creation platform designed for enterprise-scale communication.</CSHeading>
        <CSBody>HeyGen Enterprise enables medium to large teams across marketing, L&amp;D, sales, and other departments to translate videos into over 100 languages and produce AI digital human videos within hours. I participated in the user experience redesign of the Enterprise Core Workspace, encompassing the AI Video Agent, real-time LiveAvatar experience, navigation and notification systems, as well as CRM/Apps pages.</CSBody>
      </CSSection>

      <CSSection id="the-problem">
        <CSLabel>The problem</CSLabel>
        <CSHeading>Three core UX challenges stood in the way of enterprise adoption.</CSHeading>
        <ul
          className="cap-trim"
          style={{
            fontFamily: TWK,
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: 1.5,
            color: MUTED,
            margin: "20px 0 0 0",
            paddingLeft: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            listStyleType: "disc",
          }}
        >
          <li>The sign-up-to-video path averages 8–10 steps for new users.</li>
          <li>LiveAvatar&apos;s fragmented entry points and weak status feedback hold down daily active users.</li>
          <li>Enterprise governance — SSO, approval workflows, CRM/LMS integrations — is unclear to frontline users.</li>
        </ul>
      </CSSection>

      <CSSection id="solution-1">
        <CSLabel>Solution 1</CSLabel>
        <CSHeading>Growth Design: Navigation Bar &amp; Pop-Ups</CSHeading>
        <CSBody>Reorganized the navigation around high-frequency tasks and surfaced AI video progress and promotions directly inside the interaction flow.</CSBody>
        <video src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HeyGen_Navi%20Bar-4jZ9ORTWxokc3OM5fKa12BoFVWKDTP.mp4" autoPlay loop muted playsInline style={{ width: "100%", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.15)", boxSizing: "border-box", marginTop: "40px" }} />
      </CSSection>

      <CSSection id="solution-2">
        <CSLabel>Solution 2</CSLabel>
        <CSHeading>Growth Design: Enterprise CRM Page</CSHeading>
        <CSBody>Redesigned the Apps page with clearer categories and components to surface key CRM integrations and recommended workflows.</CSBody>
        <video src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/heygen_crm%20page-ois3xAUTRDaoAy6QOE8tN5Bl2cA0L7.mp4" autoPlay loop muted playsInline style={{ width: "100%", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.15)", boxSizing: "border-box", marginTop: "40px" }} />
      </CSSection>

      <CSSection id="solution-3">
        <CSLabel>Solution 3</CSLabel>
        <CSHeading>UX Optimization: Real-Time AI Avatar</CSHeading>
        <CSBody>Audited, optimized and redefined LiveAvatar's UX states — Connecting, Listening, Processing, Speaking — and multimodal inputs across text, voice, and future video formats.</CSBody>
        <video src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-zViGi3ImAFYxukQjFloFIargpUWyjy.mp4" autoPlay loop muted playsInline style={{ width: "100%", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.15)", boxSizing: "border-box", marginTop: "40px" }} />
      </CSSection>

      <CSSection id="the-outcome">
        <CSLabel>The outcome</CSLabel>
        <CSHeading>Measurable impact across the enterprise platform.</CSHeading>
        <OutcomeGrid
          stats={[
            { metric: "$80M → $100M+ ARR", description: "Significant ARR growth with reduced churn rates." },
            { metric: "15–25% session duration ↑", description: "Higher LiveAvatar usage frequency and session length among pilot clients." },
          ]}
        />
      </CSSection>

      {/* ── MOBILE DIVIDER ── */}
      <section id="mobile" style={{ marginTop: "80px" }}>
        <p
          className="cap-trim"
          style={{
            fontFamily: MONO,
            fontWeight: 500,
            fontSize: "16px",
            letterSpacing: "0.02em",
            color: MUTED,
            margin: 0,
          }}
        >
          MOBILE
        </p>
      </section>

      <CSSection id="mobile-overview">
        <CSLabel>Overview</CSLabel>
        <CSHeading>From desktop powerhouse to pocket studio.</CSHeading>
        <CSBody>HeyGen Mobile is a consumer-focused AI video creation app that lets creators and small businesses turn scripts, photos, and short clips into publish-ready AI videos directly on their phones. I co-designed and optimized the core navigation, Video Studio color editor, and captions experience, aiming to shorten the time from &quot;open the app&quot; to &quot;publishable video&quot; while keeping the experience friendly to non-experts.</CSBody>
      </CSSection>

      <CSSection id="mobile-the-problem">
        <CSLabel>The problem</CSLabel>
        <CSHeading>The Video Studio color editor lacks flexibility.</CSHeading>
        <CSBody>Limited preset options force workarounds and editing video backgrounds requires too many steps compared to industry-standard mobile editors.</CSBody>
      </CSSection>

      <CSSection id="mobile-solution">
        <CSLabel>Solution</CSLabel>
        <CSHeading>Video Studio — Color Editor</CSHeading>
        <CSBody>Redesigned the color picker, balancing full HSB flexibility with preset simplicity for HeyGen&apos;s non-expert mobile users.</CSBody>
        <video src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mobilecolor-55icN1MdXqdnZb92HbuZdPrqed80IV.mp4" autoPlay loop muted playsInline style={{ width: "100%", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.15)", boxSizing: "border-box", marginTop: "40px" }} />
      </CSSection>

      <CSSection id="mobile-the-outcome">
        <CSLabel>The outcome</CSLabel>
        <CSHeading>Measurable impact on the mobile product.</CSHeading>
        <OutcomeGrid
          stats={[
            { metric: "30%+ faster color decisions", description: "Time to make editing decisions on video backgrounds dropped by at least 30%." },
            { metric: "Launched on iOS App Store", description: <>HeyGen Mobile is now <a href="https://apps.apple.com/us/app/heygen-ai-video-generator/id6711356409" target="_blank" rel="noopener noreferrer" style={{ color: STRONG, textDecoration: "underline" }}>live on iOS</a>, bringing AI video creation to mobile users worldwide.</> },
          ]}
        />
      </CSSection>

    </CaseStudyLayout>
  )
}
