"use client"

import { CaseStudyLayout, CSVideo, CSTitle, CSSubtitle, CSCover, CSHeading, CSSubheading, CSBody, CSLabel, CSSection, CSMeta, CSOutcome, NavItem } from "@/components/case-study-layout"

const navItems: NavItem[] = [
  { id: "overview",   label: "Overview" },
  { id: "problem",    label: "The problem" },
  { id: "solution-1", label: "01 Menu" },
  { id: "solution-2", label: "02 The report" },
  { id: "solution-3", label: "03 Clinic console" },
  { id: "outcome",    label: "The outcome" },
]

const meta = [
  { label: "Role",     value: "Builder · Product Designer · Engineer" },
  { label: "Timeline", value: "1 month" },
  { label: "Team",     value: "Just me" },
  { label: "Stack",    value: "Next.js · AI SDK · Figma" },
]

const PT = "var(--font-pt-serif), 'Georgia', serif"
const TWK = "var(--font-twk), system-ui, -apple-system, sans-serif"
const MONO = "var(--font-reddit-mono), ui-monospace, monospace"
const MUTED = "rgba(0,0,0,0.35)"

function Caption({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ fontFamily: PT, fontSize: "14px", color: "#9A9A99", textAlign: "center", marginBottom: "16px", ...style }}>
      {children}
    </p>
  )
}

function ProblemList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: "12px 0 0 0", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontFamily: TWK, fontWeight: 400, fontSize: "16px", lineHeight: 1.5, color: MUTED }}>
          {item}
        </li>
      ))}
    </ul>
  )
}

// Code presented as a designed object: a dark editor card (warm near-black to
// sit on #FDFBFA) with chrome — three dots + filename — and one syntax accent:
// property keys pick up the outcome-card burnt orange. 14px mono is within
// the sanctioned tag/caption range. Max-width 640px so it reads as an object,
// not a band.
const CODE_INK = "rgba(253,251,250,0.72)"
const CODE_COMMENT = "rgba(253,251,250,0.35)"
const CODE_KEY = "#E07A4F"

function CodeLine({ line }: { line: string }) {
  const commentIdx = line.indexOf("//")
  const code = commentIdx === -1 ? line : line.slice(0, commentIdx)
  const comment = commentIdx === -1 ? "" : line.slice(commentIdx)
  const keyMatch = code.match(/^(\s*)([a-z_0-9]+)(:)(.*)$/)
  return (
    <span>
      {keyMatch ? (
        <>
          <span style={{ color: CODE_INK }}>{keyMatch[1]}</span>
          <span style={{ color: CODE_KEY }}>{keyMatch[2]}</span>
          <span style={{ color: CODE_INK }}>{keyMatch[3] + keyMatch[4]}</span>
        </>
      ) : (
        <span style={{ color: CODE_INK }}>{code}</span>
      )}
      {comment && <span style={{ color: CODE_COMMENT }}>{comment}</span>}
      {"\n"}
    </span>
  )
}

function CodeBlock({ filename, code }: { filename: string; code: string }) {
  return (
    <div
      style={{
        maxWidth: "640px",
        margin: "24px 0 0 0",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#211E1B",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 20px", background: "rgba(253,251,250,0.07)" }}>
        <span aria-hidden style={{ display: "flex", gap: "6px" }}>
          {[0, 1, 2].map((d) => (
            <span key={d} style={{ width: "9px", height: "9px", borderRadius: "999px", background: "rgba(253,251,250,0.22)" }} />
          ))}
        </span>
        <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: "12px", letterSpacing: "0.02em", color: "rgba(253,251,250,0.45)" }}>
          {filename}
        </span>
      </div>
      <pre
        style={{
          fontFamily: MONO,
          fontWeight: 500,
          fontSize: "14px",
          lineHeight: 1.6,
          margin: 0,
          padding: "20px",
          overflowX: "auto",
          whiteSpace: "pre",
        }}
      >
        {code.split("\n").map((line, i) => <CodeLine key={i} line={line} />)}
      </pre>
    </div>
  )
}

const RECOMMENDATION_POLICY = `const recommendation_policy = {
  input: ["survey", "clinic_menu", "user_budget"],

  // Essential · Optimal · Premium
  tiers: 3,
  budget_ceiling: 2 * user_budget,

  // every plan is a 3-therapy combo
  combo: {
    therapy_1: most_effective(primary_concern),
    therapy_2: add_on(["botox", "filler", "facial_cleaning"]),
    // makes 1 + 2 last longer
    therapy_3: synergy_pick(therapy_1, therapy_2),
  },

  always_show: ["synergy_benefit", "price_breakdown"],
}`

export default function LlunaAICaseStudy() {
  return (
    <CaseStudyLayout navItems={navItems}>
      <CSTitle>Lluna, AI Aesthetic Consultant</CSTitle>
      <CSSubtitle>Know before you sit in the chair.</CSSubtitle>
      <CSCover src="/lluna-cover.png" alt="Lluna cover" width={1750} height={1312} />
      <CSMeta items={meta} />

      <CSSection id="overview">
        <CSLabel>Overview</CSLabel>
        <CSHeading>The consultation, before the consultation.</CSHeading>
        <CSBody>Lluna is an AI aesthetic consultant that prepares clients before they ever sit in the chair — and gives clinics clients who walk in ready to say yes.</CSBody>
        <div style={{ position: "relative" }}>
          <CSBody>It started long before the product. I&apos;ve been obsessed with the medspa world since I was 16 — sneaking my mom&apos;s skincare, then years of visiting clinics across China, Korea, and the US; my long-term dream is to open one of my own. And in every clinic I watched the same scene: a client who knows almost nothing, across from a consultant who knows everything and is paid to close.</CSBody>
          <span className="cs-margin-note" aria-hidden>field research since I was 16</span>
        </div>
        <CSBody>The advice you get in that chair isn&apos;t always the advice you need. I decided the fix wasn&apos;t a better pitch — it was a prepared client. So I spent a month building one product for both sides of the chair.</CSBody>
      </CSSection>

      <CSSection id="problem">
        <CSLabel>The problem</CSLabel>
        <CSHeading>Both sides of the chair are guessing.</CSHeading>

        <CSSubheading>Consumers</CSSubheading>
        <ProblemList items={[
          "Clients rarely know what a therapy actually does — its effects, downtime, or how it compares to the alternatives on the menu.",
          "The biggest fear walking in is being over-sold; the trust between client and consultant is ambiguous at best.",
          "Everyone wants the cost-effective plan: real results, no money wasted on treatments that won't work for them.",
        ]} />

        <CSSubheading>Medical-spa consultants</CSSubheading>
        <ProblemList items={[
          "Educating a first-time client from zero eats most of a twenty-minute consultation.",
          "Every recommendation can read as a pitch — the harder you sell, the less credible you sound.",
          "Consultants are measured on revenue, but an unprepared, skeptical client buys a single treatment at best.",
        ]} />

        <div style={{ position: "relative", marginTop: "24px" }}>
          <blockquote style={{ borderLeft: "2px solid #000000", paddingLeft: "20px", margin: 0 }}>
            <CSBody style={{ fontStyle: "italic", margin: 0 }}>Clients who arrived educated had higher satisfaction, higher spend, and lower churn. The consultation was never the problem — the lack of preparation was.</CSBody>
          </blockquote>
          <span className="cs-margin-note" aria-hidden>preparation, not persuasion</span>
        </div>
      </CSSection>

      <CSSection id="solution-1">
        <CSLabel>Solution 01</CSLabel>
        <CSHeading>Menu — the whole price list, before anyone has to ask.</CSHeading>
        <CSVideo src="/cs/lluna-mobile-2.mp4" poster="/cs/lluna-mobile-2-poster.webp" width={886} height={1920} style={{ maxWidth: "560px", margin: "24px auto 8px", borderRadius: "8px" }} />
        <Caption>The Menu tab on lluna.ai: the clinic&apos;s live treatment menu, sorted by most popular.</Caption>
        <CSBody>A client&apos;s first real question is rarely &quot;what should I do?&quot; — it&apos;s &quot;what does this cost?&quot; The Menu tab answers it upfront: every treatment the clinic actually stocks, at the clinic&apos;s real prices — Botox at $13 a unit, Coolsculpting by session — sortable by most popular, filterable by concern, searchable by name.</CSBody>
        <CSBody>It&apos;s deliberately the clinic&apos;s own menu, not a generic catalog. Browsing it is already the beginning of the consultation.</CSBody>
      </CSSection>

      <CSSection id="solution-2">
        <CSLabel>Solution 02</CSLabel>
        <CSHeading>The report — a personalized plan in about a minute.</CSHeading>
        <div style={{ position: "relative" }}>
          <CSVideo src="/cs/lluna-mobile-1.mp4" poster="/cs/lluna-mobile-1-poster.webp" width={886} height={1920} style={{ maxWidth: "560px", margin: "24px auto 8px", borderRadius: "8px" }} />
          <span className="cs-margin-note" aria-hidden style={{ top: "40px" }}>after a 1-minute survey, users get this</span>
        </div>
        <Caption>The Best for You tab: tiered plans, each with a synergy callout and a line-by-line price breakdown.</Caption>
        <CSBody>Answer a one-minute survey — concerns, budget, treatment history — and Lluna writes the plan. Three tiers, each a three-treatment combo: the Premium plan at $1,099 pairs Vi Peel, Hydrafacial, and Restylane Fillers, with a synergy callout explaining why the combination outperforms its parts, and an included-treatments breakdown priced line by line.</CSBody>
        <CSBody style={{ marginTop: "40px" }}>The recommendation logic behind it is deliberately opinionated:</CSBody>
        <CodeBlock filename="recommendation_policy.ts" code={RECOMMENDATION_POLICY} />
      </CSSection>

      <CSSection id="solution-3">
        <CSLabel>Solution 03</CSLabel>
        <CSHeading>Clinic console — the consultant&apos;s side of the loop.</CSHeading>
        <CSVideo src="/cs/lluna-navi-bar.mp4" poster="/cs/lluna-navi-bar-poster.webp" width={1700} height={1080} style={{ width: "100%", borderRadius: "8px", marginTop: "24px", marginBottom: "8px" }} />
        <Caption>One console for the clinic: notifications, client plans, and revenue data behind a single navigation bar.</Caption>
        <CSVideo src="/cs/lluna-ai-sales.mp4" poster="/cs/lluna-ai-sales-poster.webp" width={1700} height={1080} style={{ width: "100%", borderRadius: "8px", marginBottom: "8px" }} />
        <Caption>AI sales in the plan view: a drafted client brief and tiered treatment plans, ready for the consultant to edit before the visit.</Caption>
        <CSBody>Consultants get their own surface. For each incoming client, Lluna drafts a brief — goals, budget, preferences — plus tiered treatment plans the consultant can review, adjust, and price before the visit. The data view tracks what the product is actually moving: average basket price, revenue against budget, and referral performance.</CSBody>
      </CSSection>

      <CSSection id="outcome">
        <CSLabel>The outcome</CSLabel>
        <CSHeading>Accepted, signed, and lifting revenue.</CSHeading>
        <CSBody>Lluna runs B2B2C: consumers adopt the advisor, and clinics adopt because clients walk in asking for it. The pilot put that loop in front of real clinics.</CSBody>
        <div style={{ position: "relative" }}>
          <CSOutcome
            stats={[
              { label: "Y Combinator", stat: "<5% acceptance", description: "Selected for Y Combinator's AI Startup School 2026 — 2,000+ accepted from 30,000+ applicants." },
              { label: "First contracts", stat: "$1.6K ACV signed", description: "3 clinics signed onto the pilot program out of 40+ pitched, including partner clinic Viqi Medical Spa in Los Angeles." },
              { label: "Revenue lift", stat: "8%+ per clinic", description: "Per-clinic revenue increased for pilot clinics on the B2B2C model." },
            ]}
          />
          <span className="cs-margin-note" aria-hidden>40+ pitches, 3 signatures</span>
        </div>
      </CSSection>
    </CaseStudyLayout>
  )
}
