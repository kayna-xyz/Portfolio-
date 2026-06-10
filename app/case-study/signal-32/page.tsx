"use client"

import { CaseStudyLayout, CSVideo, CSTitle, CSSubtitle, CSCover, CSHeading, CSSubheading, CSBody, CSLabel, CSSection, CSMeta, NavItem } from "@/components/case-study-layout"

const navItems: NavItem[] = [
  { id: "overview",    label: "Overview" },
  { id: "context",     label: "Context" },
  { id: "the-problem", label: "The problem" },
  { id: "solution",    label: "Solution" },
  { id: "the-outcome", label: "The outcome" },
]

const meta = [
  { label: "Timeline", value: "36 Hours" },
  { label: "Role",     value: "Designer & Engineer" },
  { label: "Team",     value: "Just me" },
  { label: "Tools",    value: "Claude Code" },
]

const PT = "var(--font-pt-serif), 'Georgia', serif"

export default function Signal32CaseStudy() {
  return (
    <CaseStudyLayout navItems={navItems}>
      <CSTitle>Signal-32: Assess Your Next Investment in 32 Questions</CSTitle>
      <CSSubtitle>An internal tool to quickly evaluate early-stage AI startups in 32 questions.</CSSubtitle>
      <CSCover src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Google%20Chrome-PR77RBIdDfEs1zKLgn0EuDKBOrgdgO.mp4" alt="Signal-32 cover" isVideo />
      <CSMeta items={meta} />

      <CSSection id="overview">
        <CSLabel>Overview</CSLabel>
        <CSHeading>Prove your gut feeling.</CSHeading>
        <CSBody>Signal-32 helps angel investors quickly assess the potential of AI startups through a 32-question quantitative framework, benchmarked against early-stage data from 24 successful AI companies. The tool adheres to the philosophy of "investing in people" — the questions draw from the experience of Sequoia Capital, Benchmark, and other firms, focusing on the founding team itself. For reference only, not investment advice.</CSBody>
      </CSSection>

      <CSSection id="context">
        <CSLabel>Context</CSLabel>
        <CSHeading>Do you need an internal tool to quickly validate your intuition?</CSHeading>
        <CSBody>I developed Signal-32, which compiles mainstream VC evaluation criteria for AI startups — team background, research depth, product execution, data and distribution, and AI competitive advantages — enabling anyone to swiftly assess whether the person in front of you is worth investing in.</CSBody>
        <img loading="lazy" src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-02-25%20at%2021.42.15-f97GOJiNgZSjQh8b7REfuEWt22IdRp.png" alt="Investment Decision Mind Map" style={{ width: "100%", borderRadius: "8px", marginBottom: "8px" }} />
        <p style={{ fontFamily: PT, fontSize: "14px", color: "#9A9A99", textAlign: "center", marginBottom: "0" }}>Mind map: brainstorming the 32 factors that shape an investment decision across four dimensions.</p>
      </CSSection>

      <CSSection id="the-problem">
        <CSLabel>The problem</CSLabel>
        <CSHeading>Strong intuition, weak calibration.</CSHeading>
        <CSBody>The issue isn't that investors can't make judgments — anyone engaging in AI-native primary market investments needs a tool to validate their intuition:</CSBody>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            "Each evaluation starts from scratch, resulting in high cognitive load and difficulty maintaining consistent standards.",
            "It's challenging to place a specific team within a larger sample space for assessment, leading to strong intuition but weak calibration.",
          ].map((text, i) => (
            <div key={i} style={{ display: "flex", gap: "16px" }}>
              <span style={{ fontFamily: PT, fontSize: "16px", color: "#9A9A99", flexShrink: 0 }}>0{i + 1}</span>
              <CSBody style={{ marginBottom: 0 }}>{text}</CSBody>
            </div>
          ))}
        </div>
      </CSSection>

      <CSSection id="solution">
        <CSLabel>Solution</CSLabel>
        <CSHeading>Step 1. A 32-question assessment framework.</CSHeading>
        <CSBody>I extracted investment insights from VC literature and blogs, then condensed them into four major dimensions. Each dimension contains eight questions, totaling 32 quantitative questions scored on a 1–5 point scale — minimizing vague adjectives. Each question maps to a specific piece of publicly available information (founder's thesis, GitHub commits, early customer case studies), reducing purely subjective scoring.</CSBody>
        <CSVideo src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/questionssignal-32-o36zN85INFxhe8l4sQs1dpmyiN8VgM.mp4" style={{ width: "100%", borderRadius: "8px", marginBottom: "8px" }} />
        <p style={{ fontFamily: PT, fontSize: "14px", color: "#9A9A99", textAlign: "center", marginBottom: "32px" }}>Sample questions from the Team Background section of the assessment framework.</p>

        <CSHeading>Step 2. Excellence comes from comparison.</CSHeading>
        <CSBody>I selected 24 AI-native companies that demonstrated outstanding early performance — spanning model layers, application layers, and infrastructure. Using only publicly available information from their early stages, I applied the same 32-question assessment to each founding team and product. This yielded a distribution of "success samples": identifying which dimensions consistently scored high, where significant variations occurred, and which combinations showed strong correlations.</CSBody>
        <CSBody style={{ fontStyle: "italic" }}>A raw score in isolation is meaningless. A team scoring 4.2 tells you nothing — but a team scoring 4.2 when the benchmark median is 4.6 tells you everything. The value of the benchmark table lies not in the numbers themselves, but in the context they create for comparison.</CSBody>
        <img loading="lazy" src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-02-25%20at%2021.44.28-lWe8IzsNmXkGrfw1bQZ4gQQd1u4wnh.png" alt="24 Sample Company Scores" style={{ width: "100%", borderRadius: "8px", marginBottom: "8px" }} />
        <p style={{ fontFamily: PT, fontSize: "14px", color: "#9A9A99", textAlign: "center", marginBottom: "32px" }}>Scores derived from publicly available early-stage data, analyzed through deep search by trusted AI agents.</p>

        <CSVideo src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Google%20Chrome-PR77RBIdDfEs1zKLgn0EuDKBOrgdgO.mp4" style={{ width: "100%", borderRadius: "8px", marginBottom: "8px" }} />
        <p style={{ fontFamily: PT, fontSize: "14px", color: "#9A9A99", textAlign: "center" }}>Signal-32 live demo: entering a startup and receiving a scored breakdown with benchmark comparison.</p>
      </CSSection>

      <CSSection id="the-outcome">
        <CSLabel>The outcome</CSLabel>
        <CSHeading>Validating intuitions, not replacing them.</CSHeading>
        <CSBody>In a small-scale pilot, several decision-makers noted that the tool's greatest value lies not in "scoring," but in validating certain intuitions.</CSBody>
        <blockquote style={{ borderLeft: "2px solid #000000", paddingLeft: "20px", marginBottom: "24px" }}>
          <CSBody style={{ fontStyle: "italic", marginBottom: 0 }}>"The teams often have different perspectives after an hour-long chat with founders, yet share common insights in certain areas — this tool effectively distills those key questions."</CSBody>
        </blockquote>
        <CSBody>For me personally, this project provided practice in combining VC qualitative experience, public data, and simple statistical tools into a reusable decision-support product. It also helped me avoid a bad investment — in a short-term perspective, the assessment was correct, with that team scoring only 3.1. But this tool can't be used for evaluating long-term deals, because everything is dynamic.</CSBody>
      </CSSection>
    </CaseStudyLayout>
  )
}
