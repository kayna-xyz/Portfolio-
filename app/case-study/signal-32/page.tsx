"use client"

import { CaseStudyLayout, CSVideo, CSTitle, CSSubtitle, CSHeading, CSBody, CSLabel, CSSection, CSMeta, NavItem } from "@/components/case-study-layout"

const PT = "var(--font-pt-serif), 'Georgia', serif"

const navItems: NavItem[] = [
  { id: "overview", label: "Overview" },
  { id: "step-1",   label: "Step 1" },
  { id: "step-2",   label: "Step 2" },
  { id: "step-3",   label: "Step 3" },
]

const meta = [
  { label: "Timeline", value: "36 Hours, 2025" },
  { label: "Role",     value: "Designer & Engineer" },
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
      <CSMeta items={meta} />

      <CSSection id="overview">
        <CSLabel>Overview</CSLabel>
        <CSHeading>Built for your next venture bet.</CSHeading>
        <CSBody>Signal-32 is a 32-question quantitative framework for assessing early-stage AI startups, calibrated against the early-stage profiles of 24 successful AI companies. The idea is simple: build a scoring framework, benchmark the winners against it, then read the variance between a target company and that benchmark as the real signal. The questions draw on the &quot;investing in people&quot; philosophy of Sequoia Capital, Benchmark, and other firms. For reference only, not investment advice.</CSBody>
      </CSSection>

      <CSSection id="step-1">
        <CSLabel>Step 1</CSLabel>
        <CSHeading>How I derived the framework: four dimensions, 32 questions.</CSHeading>
        <div style={{ position: "relative" }}>
          <CSBody>I started by condensing mainstream VC evaluation criteria, team background, research depth, product execution, data and distribution, AI competitive advantage, into four major dimensions of eight questions each, scored 1–5. Every section can be scored entirely from publicly available information.</CSBody>
          <span className="cs-margin-note" aria-hidden>Most of the time there&apos;s no finished product yet, but the strongest founding teams still rhyme: grounded and steady, tempered by hardship, smart, stubborn, not always loud, yet they overdeliver every time. Driven by a vision that isn&apos;t money or fame, and they still understand finance cold.</span>
        </div>
        <img loading="lazy" src="/cs/signal-shot-1.webp" width={1600} height={764} alt="Investment Decision Mind Map" style={{ width: "100%", borderRadius: "8px", marginTop: "24px", marginBottom: "8px" }} />
        <Caption>Mind map: brainstorming the 32 factors that shape an investment decision across four dimensions.</Caption>
      </CSSection>

      <CSSection id="step-2">
        <CSLabel>Step 2</CSLabel>
        <CSHeading>Picking 24 winners and scoring them at day one.</CSHeading>
        <div style={{ position: "relative" }}>
          <CSBody>With this framework in hand, I selected 24 AI-native companies with outstanding early performance, spanning the model, application, and infrastructure layers, and scored each one on the same 32-question rubric using only publicly available information. That produced a distribution of &quot;success samples.&quot;</CSBody>
          <span className="cs-margin-note" aria-hidden>Just one slice of the 2024–2025 AI startup world.</span>
        </div>
        <img loading="lazy" src="/cs/signal-shot-2.webp" width={1600} height={1282} alt="The 24-company benchmark table" style={{ width: "100%", borderRadius: "8px", marginTop: "24px", marginBottom: "8px" }} />
        <Caption>The 24-company benchmark table: scores derived from publicly available early-stage data, analyzed through deep search by trusted AI agents.</Caption>
      </CSSection>

      <CSSection id="step-3">
        <CSLabel>Step 3</CSLabel>
        <CSHeading>How to use it.</CSHeading>
        <CSBody>Before trying to buy options in these companies on the primary market or making an angel investment, I score the target on the same 32 questions and compare it against the 24-company benchmark, reading the variance dimension by dimension. The variance is what actually drives the decision: if a team scores 2.6 under the same objective and subjective criteria, that&apos;s my cue to think hard about whether the investment is worth making.</CSBody>
        <CSVideo src="/cs/questionssignal-32.mp4" poster="/cs/questionssignal-32-poster.webp" width={1112} height={720} style={{ width: "100%", borderRadius: "8px", marginTop: "24px", marginBottom: "8px" }} />
        <Caption>Sample questions from the Team Background section of the assessment framework.</Caption>
      </CSSection>
    </CaseStudyLayout>
  )
}
