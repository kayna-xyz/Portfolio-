"use client"

import { CaseStudyLayout, CSVideo, CSTitle, CSSubtitle, CSHeading, CSBody, CSLabel, CSSection, CSMeta, NavItem } from "@/components/case-study-layout"

const navItems: NavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "context",  label: "Context" },
  { id: "more",     label: "More" },
]

const meta = [
  { label: "Timeline", value: "Jan 2026 – Present" },
  { label: "Role",     value: "Founding Designer" },
  { label: "Team",     value: "Dev & Design: Just me · Club Members: 20+ Students" },
  { label: "Tools",    value: "Claude Code · Figma · V0" },
]

const PT = "var(--font-pt-serif), 'Georgia', serif"

export default function ColumbiaHCIReviewCaseStudy() {
  return (
    <CaseStudyLayout navItems={navItems}>
      <CSTitle>Building the Visual Identity for Columbia HCI Review</CSTitle>
      <CSSubtitle>Crafting a cohesive visual voice for Columbia's first student-led HCI publication.</CSSubtitle>
      <CSMeta items={meta} />

      <CSSection id="overview">
        <CSLabel>Overview</CSLabel>
        <CSHeading>Columbia's first student-led Human-Computer Interaction publication.</CSHeading>
        <CSBody>The HCI Review is a biannual independent review journal focused on human-computer interaction and emerging technology. Rooted in Columbia University's global perspective, we conduct in-depth analyses of HCI evolution and product design. The HCI Review is committed to providing readers with an outlier mode of thinking that allows us to navigate the post-AI era.</CSBody>
      </CSSection>

      <CSSection id="context">
        <CSLabel>Context</CSLabel>
        <CSHeading>A new publication needs a strong visual voice.</CSHeading>
        <CSBody>As a brand-new publication, Columbia HCI Review needed a cohesive visual identity that communicates academic rigor while remaining approachable. As the sole designer and developer, I created everything from the magazine cover and website to social media templates and promotional posters.</CSBody>
        <img loading="lazy" src="/cs/columbia-cover.webp" width={1600} height={1034} alt="Columbia HCI Review - Inaugural Issue Magazine Cover" style={{ width: "100%", borderRadius: "8px" }} />
      </CSSection>

      <CSSection id="more">
        <CSLabel>More</CSLabel>
        <CSHeading>The website.</CSHeading>
        <CSBody>I vibe-coded the CHR website using Claude Code and V0, iterating on layout and typography entirely through prompts. The site includes a working submission form so contributors can pitch article ideas directly, plus issue archives, contributor guidelines, and an about page.</CSBody>
        <a href="https://ctpreview.com" target="_blank" rel="noopener noreferrer" style={{ fontFamily: PT, fontSize: "16px", color: "#000000", display: "block", marginBottom: "16px" }}>ctpreview.com</a>
        <CSVideo src="/cs/cti-website.mp4" poster="/cs/cti-website-poster.webp" width={1280} height={870} style={{ width: "100%", borderRadius: "8px", marginBottom: "40px" }} />

        <CSHeading>Social media & promotional materials.</CSHeading>
        <CSBody>A series of Instagram cards for "5 Industries Defining the Future" and the "Call For Submissions" poster for the inaugural issue, used across campus and online to recruit contributors for Spring 2026.</CSBody>
        <img loading="lazy" src="/cs/columbia-web-1.webp" width={1600} height={590} alt="Instagram Social Media Cards" style={{ width: "100%", borderRadius: "8px", marginBottom: "24px" }} />
        <img loading="lazy" src="/cs/columbia-web-2.webp" width={1600} height={1078} alt="Call For Submissions Poster" style={{ width: "100%", borderRadius: "8px" }} />
      </CSSection>
    </CaseStudyLayout>
  )
}
