"use client"

import { CaseStudyLayout, CSVideo, CSTitle, CSSubtitle, CSCover, CSHeading, CSBody, CSLabel, CSSection, CSMeta, NavItem } from "@/components/case-study-layout"

const TWK = "var(--font-twk), system-ui, -apple-system, sans-serif"
const MUTED = "rgba(0,0,0,0.35)"
const PT = "var(--font-pt-serif), 'Georgia', serif"

const navItems: NavItem[] = [
  { id: "overview",    label: "Overview" },
  { id: "the-problem", label: "The problem" },
  { id: "solution-1",  label: "Solution 1" },
  { id: "solution-2",  label: "Solution 2" },
  { id: "solution-3",  label: "Solution 3" },
  { id: "the-outcome", label: "The outcome" },
]

const meta = [
  { label: "Timeline", value: "36 Hours, 2025" },
  { label: "Role",     value: "Designer & Engineer" },
  { label: "Team",     value: "Just me" },
  { label: "Tools",    value: "Claude Code" },
]

function Caption({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ fontFamily: PT, fontSize: "14px", color: "#9A9A99", textAlign: "center", marginBottom: "0", ...style }}>
      {children}
    </p>
  )
}

export default function Signal32CaseStudy() {
  return (
    <CaseStudyLayout navItems={navItems}>
      <CSTitle>Signal-32: Assess Your Next Investment in 32 Questions</CSTitle>
      <CSSubtitle>An internal tool to quickly evaluate early-stage AI startups in 32 questions.</CSSubtitle>
      <CSCover src="/cs/google-chrome.mp4" poster="/cs/google-chrome-poster.webp" width={1280} height={870} alt="Signal-32 cover" isVideo />
      <CSMeta items={meta} />

      <CSSection id="overview">
        <CSLabel>Overview</CSLabel>
        <CSHeading>Prove your gut feeling.</CSHeading>
        <CSBody>Signal-32 helps angel investors assess early-stage AI startups through a 32-question quantitative framework, calibrated against the early-stage profiles of 24 successful AI companies. The project started with that benchmark — studying what winners actually looked like before they won — and the questions draw on the &quot;investing in people&quot; philosophy of Sequoia Capital, Benchmark, and other firms. For reference only, not investment advice.</CSBody>
      </CSSection>

      <CSSection id="the-problem">
        <CSLabel>The problem</CSLabel>
        <CSHeading>Strong intuition, weak calibration.</CSHeading>
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
          <li>Every evaluation starts from scratch — high cognitive load and inconsistent standards across deals.</li>
          <li>A single team can&apos;t be placed within a larger sample space, so judgments rest on intuition alone.</li>
          <li>Early-stage notes run on vague adjectives instead of evidence that can be compared across teams.</li>
        </ul>
      </CSSection>

      <CSSection id="solution-1">
        <CSLabel>Solution 1</CSLabel>
        <CSHeading>The starting point: benchmarking 24 successful AI companies at day one.</CSHeading>
        <CSBody>Before designing any product, I selected 24 AI-native companies with outstanding early performance — spanning the model, application, and infrastructure layers — and reconstructed how each looked at its earliest stage using only publicly available information: founders&apos; theses, GitHub activity, early customer case studies. Deep-search AI agents gathered the data, and each company was scored on the same 32-question rubric.</CSBody>
        <CSBody>This produced a distribution of &quot;success samples&quot;: which dimensions consistently score high, where the variance lives, and which combinations correlate.</CSBody>
        <CSBody style={{ fontStyle: "italic" }}>A raw score in isolation is meaningless. A team scoring 4.2 tells you nothing — but a team scoring 4.2 when the benchmark median is 4.6 tells you everything.</CSBody>
        <img loading="lazy" src="/cs/signal-shot-2.webp" width={1600} height={1282} alt="24 Sample Company Scores" style={{ width: "100%", borderRadius: "8px", marginTop: "24px", marginBottom: "8px" }} />
        <Caption>The 24-company benchmark table: scores derived from publicly available early-stage data, analyzed through deep search by trusted AI agents.</Caption>
      </CSSection>

      <CSSection id="solution-2">
        <CSLabel>Solution 2</CSLabel>
        <CSHeading>Four dimensions, 32 questions, scored 1–5.</CSHeading>
        <CSBody>I condensed mainstream VC evaluation criteria — team background, research depth, product execution, data and distribution, AI competitive advantage — into four major dimensions of eight questions each. Every question maps to a specific piece of public evidence (a founder&apos;s thesis, GitHub commits, early customer case studies), minimizing vague adjectives and purely subjective scoring.</CSBody>
        <img loading="lazy" src="/cs/signal-shot-1.webp" width={1600} height={764} alt="Investment Decision Mind Map" style={{ width: "100%", borderRadius: "8px", marginTop: "24px", marginBottom: "8px" }} />
        <Caption style={{ marginBottom: "32px" }}>Mind map: brainstorming the 32 factors that shape an investment decision across four dimensions.</Caption>
        <CSVideo src="/cs/questionssignal-32.mp4" poster="/cs/questionssignal-32-poster.webp" width={1112} height={720} style={{ width: "100%", borderRadius: "8px", marginBottom: "8px" }} />
        <Caption>Sample questions from the Team Background section of the assessment framework.</Caption>
      </CSSection>

      <CSSection id="solution-3">
        <CSLabel>Solution 3</CSLabel>
        <CSHeading>A mini app where every score lands in context.</CSHeading>
        <CSBody>Built in 36 hours with Claude Code: enter a startup, answer the 32 questions, and get a dimension-by-dimension breakdown compared against the 24-company benchmark.</CSBody>
        <CSVideo src="/cs/google-chrome.mp4" poster="/cs/google-chrome-poster.webp" width={1280} height={870} style={{ width: "100%", borderRadius: "8px", marginTop: "24px", marginBottom: "8px" }} />
        <Caption>Signal-32 live demo: entering a startup and receiving a scored breakdown with benchmark comparison.</Caption>
      </CSSection>

      <CSSection id="the-outcome">
        <CSLabel>The outcome</CSLabel>
        <CSHeading>Validating intuitions, not replacing them.</CSHeading>
        <CSBody>In a small-scale pilot, decision-makers found the tool&apos;s greatest value wasn&apos;t the score itself — it was confirming or challenging intuitions they already held.</CSBody>
        <blockquote style={{ borderLeft: "2px solid #000000", paddingLeft: "20px", margin: "24px 0 0 0" }}>
          <CSBody style={{ fontStyle: "italic", margin: 0 }}>&quot;The teams often have different perspectives after an hour-long chat with founders, yet share common insights in certain areas — this tool effectively distills those key questions.&quot;</CSBody>
        </blockquote>
        <CSBody>It also helped me avoid one bad investment — that team scored only 3.1 against the benchmark. The framework got the short-term call right, though it can&apos;t price long-term deals: everything about an early team is dynamic.</CSBody>
      </CSSection>
    </CaseStudyLayout>
  )
}
