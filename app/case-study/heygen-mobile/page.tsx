"use client"

import { useState } from "react"
import { CaseStudyLayout, CSTitle, CSHeading, CSSubheading, CSBody, CSLabel, CSSection, CSMeta, NavItem } from "@/components/case-study-layout"

const navItems: NavItem[] = [
  { id: "overview",    label: "Overview" },
  { id: "context",     label: "Context" },
  { id: "the-problem", label: "The problem" },
  { id: "solution",    label: "Solution" },
  { id: "the-outcome", label: "The outcome" },
]

const meta = [
  { label: "Timeline", value: "2 Months" },
  { label: "Role",     value: "Product Design Intern" },
  { label: "Team",     value: "Tiffany Huang (Product Designer + PM)" },
  { label: "Tools",    value: "Figma" },
]

export default function HeyGenMobileCaseStudy() {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  return (
    <>
      <CaseStudyLayout navItems={navItems}>
        <CSTitle>HeyGen Mobile</CSTitle>
        <CSBody>Crafting an on-the-go AI video editing experience for mobile users.</CSBody>
        <CSMeta items={meta} />

        <CSSection id="overview">
          <CSLabel>Overview</CSLabel>
          <CSHeading>From desktop powerhouse to pocket studio.</CSHeading>
          <CSBody>HeyGen Mobile is a consumer-focused AI video creation app that lets creators and small businesses turn scripts, photos, and short clips into publish-ready AI videos directly on their phones. I co-designed and optimized the core navigation, Video Studio color editor, and captions experience, aiming to shorten the time from "open the app" to "publishable video" while keeping the experience friendly to non-experts.</CSBody>
        </CSSection>

        <CSSection id="context">
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

        <CSSection id="the-problem">
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

        <CSSection id="solution">
          <CSLabel>Solution</CSLabel>
          <CSHeading>1. Navigation: from feature list to task-first hub.</CSHeading>
          <CSBody>I collaborated with senior designers to develop multiple navigation proposals, organize reviews, and drive the selection of the final direction. We reorganized the homepage hierarchy based on HEX data — creation and editing modules elevated to top priority, account and settings downgraded to secondary entry points.</CSBody>
          <video src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mobilenavi-flNVPbRymN8ldyYs0abpOO33xH7TkJ.mp4" autoPlay loop muted playsInline style={{ width: "100%", borderRadius: "8px", marginBottom: "32px" }} />
          <CSHeading>2. Video Studio — Color Editor</CSHeading>
          <CSBody>I redesigned the color picker referencing widely acclaimed mobile editors like Hypic, exploring multiple options from simple preset palettes to full HSB sliders, and tailored the final design to balance flexibility with HeyGen's non-expert user base.</CSBody>
          <video src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mobilecolor-55icN1MdXqdnZb92HbuZdPrqed80IV.mp4" autoPlay loop muted playsInline style={{ width: "100%", borderRadius: "8px" }} />
        </CSSection>

        <CSSection id="the-outcome">
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
