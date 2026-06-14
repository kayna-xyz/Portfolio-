"use client"

import { CaseStudyLayout, CSVideo, CSTitle, CSSubtitle, CSCover, CSHeading, CSBody, CSLabel, CSSection, CSMeta, CSOutcome, NavItem } from "@/components/case-study-layout"

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

export default function HeyGenCaseStudy() {
  return (
    <CaseStudyLayout navItems={navItems}>

      {/* ── ENTERPRISE ─────────────────────────────── */}

      <CSTitle>HeyGen, Forbes AI 50, App Design</CSTitle>
      <CSSubtitle>Architecting a seamless AI video experience for enterprise-scale and consumer communication.</CSSubtitle>
      <CSCover src="/heygen-cover.png" alt="HeyGen cover" width={1476} height={880} />
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
        <CSVideo src="/cs/heygen-navi-bar.mp4" poster="/cs/heygen-navi-bar-poster.webp" width={1280} height={870} style={{ width: "100%", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.15)", boxSizing: "border-box", marginTop: "40px" }} />
      </CSSection>

      <CSSection id="solution-2">
        <CSLabel>Solution 2</CSLabel>
        <CSHeading>Growth Design: Enterprise CRM Page</CSHeading>
        <CSBody>Redesigned the Apps page with clearer categories and components to surface key CRM integrations and recommended workflows.</CSBody>
        <CSVideo src="/cs/heygen-crm-page.mp4" poster="/cs/heygen-crm-page-poster.webp" width={1280} height={870} style={{ width: "100%", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.15)", boxSizing: "border-box", marginTop: "40px" }} />
      </CSSection>

      <CSSection id="solution-3">
        <CSLabel>Solution 3</CSLabel>
        <CSHeading>UX Optimization: Real-Time AI Avatar</CSHeading>
        <CSBody>Audited, optimized and redefined LiveAvatar's UX states — Connecting, Listening, Processing, Speaking — and multimodal inputs across text, voice, and future video formats.</CSBody>
        <CSVideo src="/cs/heygen-enterprise-iter.mp4" poster="/cs/heygen-enterprise-iter-poster.webp" width={1056} height={720} style={{ width: "100%", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.15)", boxSizing: "border-box", marginTop: "40px" }} />
      </CSSection>

      <CSSection id="the-outcome">
        <CSLabel>The outcome</CSLabel>
        <CSHeading>Measurable impact across the enterprise platform.</CSHeading>
        <CSOutcome
          stats={[
            { label: "Annual revenue", stat: "$80M → $100M+ ARR", description: "Significant ARR growth with reduced churn rates." },
            { label: "LiveAvatar engagement", stat: "15–25% session duration ↑", description: "Higher LiveAvatar usage frequency and session length among pilot clients." },
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
        <CSVideo src="/cs/mobilecolor.mp4" poster="/cs/mobilecolor-poster.webp" width={1280} height={960} style={{ width: "100%", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.15)", boxSizing: "border-box", marginTop: "40px" }} />
      </CSSection>

      <CSSection id="mobile-the-outcome">
        <CSLabel>The outcome</CSLabel>
        <CSHeading>Measurable impact on the mobile product.</CSHeading>
        <CSOutcome
          stats={[
            { label: "Color editor", stat: "30%+ faster color decisions", description: "Time to make editing decisions on video backgrounds dropped by at least 30%." },
            { label: "Shipped", stat: "Live on iOS", description: <>HeyGen Mobile is now <a href="https://apps.apple.com/us/app/heygen-ai-video-generator/id6711356409" target="_blank" rel="noopener noreferrer" style={{ color: STRONG, textDecoration: "underline" }}>live on iOS</a>, bringing AI video creation to mobile users worldwide.</> },
          ]}
        />
      </CSSection>

    </CaseStudyLayout>
  )
}
