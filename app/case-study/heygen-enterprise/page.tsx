"use client"

import { useState } from "react"
import { CaseStudyLayout, CSTitle, CSHeading, CSSubheading, CSBody, CSLabel, CSSection, CSMeta, NavItem } from "@/components/case-study-layout"

const navItems: NavItem[] = [
  { id: "overview",      label: "Overview" },
  { id: "context",       label: "Context" },
  { id: "the-problem",   label: "The problem" },
  { id: "solution-1",    label: "Solution 1" },
  { id: "solution-2",    label: "Solution 2" },
  { id: "solution-3",    label: "Solution 3" },
  { id: "the-outcome",   label: "The outcome" },
  { id: "mobile",        label: "— Mobile" },
  { id: "mobile-overview",     label: "Overview" },
  { id: "mobile-context",      label: "Context" },
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

const mobileMeta = [
  { label: "Timeline", value: "2 Months" },
  { label: "Role",     value: "Product Design Intern" },
  { label: "Team",     value: "Tiffany Huang (Product Designer + PM)" },
  { label: "Tools",    value: "Figma" },
]

export default function HeyGenCaseStudy() {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  return (
    <>
      <CaseStudyLayout navItems={navItems}>

        {/* ── ENTERPRISE ─────────────────────────────── */}

        <CSTitle>HeyGen, Forbes AI 50, App Design</CSTitle>
        <CSBody>Architecting a seamless AI video experience for enterprise-scale and consumer communication.</CSBody>
        <CSMeta items={enterpriseMeta} />

        <CSSection id="overview">
          <CSLabel>Overview</CSLabel>
          <CSHeading>An AI video creation platform designed for enterprise-scale communication.</CSHeading>
          <CSBody>HeyGen Enterprise enables medium to large teams across marketing, L&D, sales, and other departments to translate videos into over 100 languages and produce AI digital human videos within hours. I participated in the user experience redesign of the Enterprise Core Workspace, encompassing the AI Video Agent, real-time LiveAvatar experience, navigation and notification systems, as well as CRM/Apps pages.</CSBody>
        </CSSection>

        <CSSection id="context">
          <CSLabel>Context</CSLabel>
          <CSHeading>User & Market Research</CSHeading>
          <CSBody>Together with Sales and CSM, we conducted over 10 enterprise customer interviews (45–60 minutes each). At the market level, we also compared the user experience of similar enterprise AI video products like Synthesia and Captions. Combining community feedback and usage data, we identified several key issues.</CSBody>
          <div style={{ marginTop: "24px" }}>
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-02-26%20at%2012.53.29-fPEUHYYIWkDBQZwx0RUVVqPAUsgPBL.png" alt="Research synthesis" style={{ width: "100%", borderRadius: "8px" }} />
            <p style={{ fontFamily: "var(--font-pt-serif), 'Georgia', serif", fontSize: "14px", color: "#9A9A99", marginTop: "8px", textAlign: "center" }}>Research synthesis: interviews, competitive benchmarking, and usage data mapped across 4 enterprise tiers.</p>
          </div>
        </CSSection>

        <CSSection id="the-problem">
          <CSLabel>The problem</CSLabel>
          <CSHeading>Three core UX challenges stood in the way of enterprise adoption.</CSHeading>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "8px" }}>
            {[
              "The path from sign-up to producing a usable video is too lengthy for new users, requiring an average of 8–10 steps.",
              "While LiveAvatar's real-time experience is technically advanced, fragmented entry points and insufficient status feedback have resulted in lower-than-expected daily active users.",
              "Frontline users lack clarity on where enterprise governance and integration capabilities reside — SSO, approval workflows, and CRM/LMS integrations.",
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", gap: "16px" }}>
                <span style={{ fontFamily: "var(--font-pt-serif), 'Georgia', serif", fontSize: "16px", color: "#9A9A99", flexShrink: 0 }}>0{i + 1}</span>
                <CSBody style={{ marginBottom: 0 }}>{text}</CSBody>
              </div>
            ))}
          </div>
        </CSSection>

        <CSSection id="solution-1">
          <CSLabel>Solution 1</CSLabel>
          <CSHeading>UX Optimization: Real-Time AI Avatar</CSHeading>
          <CSBody>The API is highly capable, enabling real-time AI avatar conversations, but the product-level multimodal interaction flow — loading states, error states, input/output boundaries — required refinement.</CSBody>
          <CSBody>I was responsible for defining various UX states (Connecting, Listening, Processing, Speaking) and multimodal inputs (text, voice, potential future video formats).</CSBody>
          <CSSubheading>Process</CSSubheading>
          <CSBody>Mapped the LiveAvatar backend AI state machine (Idle → Connecting → Listening → Generating → Speaking → Error/Disconnected), reviewed state designs, and supplemented missing states.</CSBody>
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-02-26%20at%2013.26.11-p5AMFJrNlPMgDyUf0bFNvxRX1ffvQR.png" alt="Live Avatar state map" style={{ width: "100%", borderRadius: "8px", marginBottom: "8px" }} />
          <p style={{ fontFamily: "var(--font-pt-serif), 'Georgia', serif", fontSize: "14px", color: "#9A9A99", marginBottom: "24px", textAlign: "center" }}>Live Avatar state map: 5 state categories covering auth, session setup, input modes, AI response cycle, and error handling.</p>
          <video src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-zViGi3ImAFYxukQjFloFIargpUWyjy.mp4" autoPlay loop muted playsInline style={{ width: "100%", borderRadius: "8px", marginBottom: "24px" }} />
          <CSSubheading>Impact</CSSubheading>
          <CSBody>Average session duration and revisit rate for real-time conversations increased, with session length rising by 15–25%. User experience satisfaction improved noticeably.</CSBody>
        </CSSection>

        <CSSection id="solution-2">
          <CSLabel>Solution 2</CSLabel>
          <CSHeading>Growth Design: Navigation Bar & Pop-Ups</CSHeading>
          <CSBody>The navigation structure remained stacked by functional modules rather than organized around high-frequency user tasks. Users could not intuitively see the progress of AI video generation. Product advertisements were placed in a secondary tab, not directly embedded within essential interaction flows.</CSBody>
          <CSBody>I was responsible for producing multiple interactive design proposals for the design team to discuss and finalize. I directly designed pop-ups and ad interstitial banners to boost ARR and conversion rates.</CSBody>
          <CSSubheading>Process</CSSubheading>
          <CSBody>Navigation Bar: function modules clustered and arranged based on ARR and usage frequency. Dual-tab Notification Center: "Notifications" displays only content directly related to the user's AI video generation progress; "What's New" is reserved for product promotions and marketing campaigns.</CSBody>
          <video src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HeyGen_Navi%20Bar-4jZ9ORTWxokc3OM5fKa12BoFVWKDTP.mp4" autoPlay loop muted playsInline style={{ width: "100%", borderRadius: "8px", marginBottom: "24px" }} />
          <CSSubheading>Impact</CSSubheading>
          <CSBody>Improved notice click-through rate and conversion rate from new feature guidance.</CSBody>
        </CSSection>

        <CSSection id="solution-3">
          <CSLabel>Solution 3</CSLabel>
          <CSHeading>Growth Design: Enterprise CRM Page</CSHeading>
          <CSBody>Integration with systems like CRM/HubSpot was already achievable through Apps, but the Apps page lacked a prominent entry point, and its layout failed to highlight key integrations and recommended workflows.</CSBody>
          <CSBody>I designed the categories and components for the CRM page.</CSBody>
          <video src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/heygen_crm%20page-ois3xAUTRDaoAy6QOE8tN5Bl2cA0L7.mp4" autoPlay loop muted playsInline style={{ width: "100%", borderRadius: "8px", marginBottom: "24px" }} />
          <CSSubheading>Impact</CSSubheading>
          <CSBody>Enhanced the user experience for enterprise-end users, increasing traffic to the Apps page and third-party integrations.</CSBody>
        </CSSection>

        <CSSection id="the-outcome">
          <CSLabel>The outcome</CSLabel>
          <CSHeading>Measurable impact across the enterprise platform.</CSHeading>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "32px" }}>
            <div>
              <CSSubheading>$80M → $100M+ ARR</CSSubheading>
              <CSBody>Significant ARR growth with reduced churn rates.</CSBody>
            </div>
            <div>
              <CSSubheading>15–25% session duration increase</CSSubheading>
              <CSBody>Noticeably higher usage frequency and session duration of LiveAvatar among pilot clients.</CSBody>
            </div>
          </div>
          <CSBody style={{ color: "#9A9A99" }}>Thanks to the excellent product design team for making this work possible. This internship sharpened how I think about enterprise UX at scale.</CSBody>
        </CSSection>

        {/* ── MOBILE DIVIDER ── */}
        <div id="mobile" style={{ borderTop: "1px solid #eae8e6", margin: "40px 0 64px" }} />

        <CSTitle>HeyGen Mobile</CSTitle>
        <CSBody>Crafting an on-the-go AI video editing experience for mobile users.</CSBody>
        <CSMeta items={mobileMeta} />

        <CSSection id="mobile-overview">
          <CSLabel>Overview</CSLabel>
          <CSHeading>From desktop powerhouse to pocket studio.</CSHeading>
          <CSBody>HeyGen Mobile is a consumer-focused AI video creation app that lets creators and small businesses turn scripts, photos, and short clips into publish-ready AI videos directly on their phones. I co-designed and optimized the core navigation, Video Studio color editor, and captions experience, aiming to shorten the time from "open the app" to "publishable video" while keeping the experience friendly to non-experts.</CSBody>
        </CSSection>

        <CSSection id="mobile-context">
          <CSLabel>Context</CSLabel>
          <CSHeading>Consumer user research & competitive landscape.</CSHeading>
          <CSBody>I worked with Tiffany Huang (also PM) to review past user interviews from creators at companies of various sizes, freelancers, and everyday consumers. Simultaneously, we benchmarked navigation structures, color grading workflows, and captioning tool models of leading mobile media editors like CapCut, Captions, and Hypic.</CSBody>
          <CSSubheading>Key findings</CSSubheading>
          <ul style={{ fontFamily: "var(--font-pt-serif), 'Georgia', serif", fontSize: "16px", color: "#000000", lineHeight: "1.65", paddingLeft: "20px", marginBottom: "16px" }}>
            <li style={{ marginBottom: "8px" }}>HeyGen's strengths — lip-sync video translation, streaming-grade avatars, 40+ language subtitle export — are unmatched, but desktop-first.</li>
            <li style={{ marginBottom: "8px" }}>Competitors are rapidly extending advanced features to mobile, making "creating finished videos solely on mobile" the norm.</li>
            <li>The goal: enable PC users to complete the workflow from draft to finished video on mobile, anytime.</li>
          </ul>
          <div
            style={{ position: "relative", cursor: "pointer", marginTop: "16px" }}
            onClick={() => setLightboxSrc("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20145-LuONtjwHeLBDCKlU2QS5VFKflTMbAq.png")}
          >
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20145-LuONtjwHeLBDCKlU2QS5VFKflTMbAq.png" alt="Competitive audit" style={{ width: "100%", borderRadius: "8px" }} />
          </div>
          <p style={{ fontFamily: "var(--font-pt-serif), 'Georgia', serif", fontSize: "14px", color: "#9A9A99", marginTop: "8px", textAlign: "center", marginBottom: "0" }}>Competitive audit: HeyGen benchmarked against CapCut, Captions, and Hypic.</p>
        </CSSection>

        <CSSection id="mobile-the-problem">
          <CSLabel>The problem</CSLabel>
          <CSHeading>Two core UX friction points.</CSHeading>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <CSSubheading>1. Navigation lacks clear functional modules</CSSubheading>
              <CSBody>The homepage features a complex UX with no clear hierarchy, causing users to experience fatigue from repetitive steps. High-frequency functions need rearranging based on data so users can quickly access their tasks.</CSBody>
            </div>
            <div>
              <CSSubheading>2. Color selection lacks flexibility</CSSubheading>
              <CSBody>The Video Studio color editor provides limited options, forcing workarounds. Editing video backgrounds requires too many steps compared to industry-standard tools.</CSBody>
            </div>
          </div>
        </CSSection>

        <CSSection id="mobile-solution">
          <CSLabel>Solution</CSLabel>
          <CSHeading>1. Navigation: from feature list to task-first hub.</CSHeading>
          <CSBody>I collaborated with senior designers to develop multiple navigation proposals, organize reviews, and drive the selection of the final direction. We reorganized the homepage hierarchy based on HEX data — creation and editing modules elevated to top priority, account and settings downgraded to secondary entry points.</CSBody>
          <video src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mobilenavi-flNVPbRymN8ldyYs0abpOO33xH7TkJ.mp4" autoPlay loop muted playsInline style={{ width: "100%", borderRadius: "8px", marginBottom: "32px" }} />
          <CSHeading>2. Video Studio — Color Editor</CSHeading>
          <CSBody>I redesigned the color picker referencing widely acclaimed mobile editors like Hypic, exploring multiple options from simple preset palettes to full HSB sliders, and tailored the final design to balance flexibility with HeyGen's non-expert user base.</CSBody>
          <video src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mobilecolor-55icN1MdXqdnZb92HbuZdPrqed80IV.mp4" autoPlay loop muted playsInline style={{ width: "100%", borderRadius: "8px" }} />
        </CSSection>

        <CSSection id="mobile-the-outcome">
          <CSLabel>The outcome</CSLabel>
          <CSHeading>Measurable impact on the mobile product.</CSHeading>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", marginBottom: "32px" }}>
            <div>
              <CSSubheading>Fewer steps, clearer feature visibility</CSSubheading>
              <CSBody>Core features are now clearly visible, driving conversions for ARR. Decision-making steps significantly reduced.</CSBody>
            </div>
            <div>
              <CSSubheading>30%+ reduction in color editing decisions time</CSSubheading>
              <CSBody>Users experience at least a 30% reduction in the time required to make editing decisions when working with video backgrounds.</CSBody>
            </div>
          </div>
          <CSBody>The HeyGen Mobile app launched on the <a href="https://apps.apple.com/us/app/heygen-ai-video-generator/id6711356409" target="_blank" rel="noopener noreferrer" style={{ color: "#000000" }}>iOS App Store</a>, bringing AI video creation to mobile users worldwide.</CSBody>
          <CSBody style={{ color: "#9A9A99" }}>Special thanks to Tiffany Huang — PD & PM — for driving this project forward.</CSBody>
        </CSSection>

      </CaseStudyLayout>

      {lightboxSrc && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.8)", cursor: "zoom-out" }} onClick={() => setLightboxSrc(null)}>
          <img src={lightboxSrc} alt="Full-size preview" style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain" }} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  )
}
