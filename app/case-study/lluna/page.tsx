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
  { label: "Role",     value: "Founder · Product Designer · Engineer" },
  { label: "Timeline", value: "1 month" },
  { label: "Stack",    value: "Next.js · AI SDK · Figma" },
]

const PT = "var(--font-pt-serif), 'Georgia', serif"
const TWK = "var(--font-twk), system-ui, -apple-system, sans-serif"
const MONO = "var(--font-reddit-mono), ui-monospace, monospace"
const MUTED = "rgba(0,0,0,0.35)"
const HAND = "'IntrudingCat', cursive"
const INK = "rgba(0,0,0,0.55)"

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

// ── Hand-drawn storyboards ───────────────────────────────────────────────────
// Loose line sketches (the "简笔画" feel) that narrate the waiting-room moment
// next to each shrunken phone clip. One ink weight, rounded joints, handwriting
// captions in the same IntrudingCat font as the margin notes.

function SketchFrame({ label, children, vb = "0 0 120 96" }: { label: string; children: React.ReactNode; vb?: string }) {
  return (
    <figure className="lluna-sketch" style={{ margin: 0 }}>
      <svg
        viewBox={vb}
        role="img"
        aria-label={label}
        style={{ width: "100%", height: "auto", display: "block", stroke: INK, strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }}
      >
        {children}
      </svg>
      <figcaption style={{ fontFamily: HAND, fontSize: "16px", lineHeight: 1.3, color: MUTED, textAlign: "center", transform: "rotate(-1.5deg)" }}>
        {label}
      </figcaption>
    </figure>
  )
}

// One curved arrow (quadratic Bézier) with an arrowhead aimed along the curve's
// end tangent, drawn in the cycle's 0–100 space.
function CycArrow({ x1, y1, cx, cy, x2, y2 }: { x1: number; y1: number; cx: number; cy: number; x2: number; y2: number }) {
  const ang = Math.atan2(y2 - cy, x2 - cx)
  const len = 5, spread = 0.42
  const hx1 = x2 - len * Math.cos(ang - spread)
  const hy1 = y2 - len * Math.sin(ang - spread)
  const hx2 = x2 - len * Math.cos(ang + spread)
  const hy2 = y2 - len * Math.sin(ang + spread)
  return (
    <>
      <path d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`} vectorEffect="non-scaling-stroke" />
      <path d={`M${hx1} ${hy1} L${x2} ${y2} L${hx2} ${hy2}`} vectorEffect="non-scaling-stroke" />
    </>
  )
}

// Side profile: a figure settled into a lounge sofa, holding up a phone. Drawn
// in profile so the body never overlaps the seat — back against the backrest,
// thigh along the cushion, shin to the floor. `screen` swaps the phone content.
function SofaScene({ screen }: { screen: "qr" | "menu" | "report" }) {
  return (
    <>
      {/* sofa — backrest, seat, base, front armrest */}
      <rect x="32" y="40" width="12" height="40" rx="6" />
      <path d="M44 74 H100" />
      <path d="M100 74 L104 94 L40 94 L40 80" />
      <path d="M46 94 V101 M98 94 V101" />
      <rect x="38" y="62" width="9" height="18" rx="4" />
      {/* seated figure, facing right */}
      <circle cx="54" cy="30" r="9" />
      <path d="M53 39 L62 71" />
      <path d="M62 71 H84" />
      <path d="M84 71 L88 92" />
      <path d="M88 92 H95" />
      <path d="M56 48 L73 57" />
      {/* phone in hand */}
      <rect x="69" y="50" width="15" height="12" rx="2" />
      {screen === "qr" && [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => (
        <rect key={`q${r}${c}`} x={72 + c * 3.4} y={52 + r * 2.8} width="2" height="2" fill={INK} stroke="none" />
      )))}
      {screen === "menu" && (
        <>
          <path d="M72 54 H81" />
          <path d="M72 57.5 H81" />
          <path d="M72 60 H78" />
        </>
      )}
      {screen === "report" && (
        <>
          <path d="M72 54 H81" />
          <path d="M72 57 H79" />
          <rect x="72" y="59.5" width="7" height="2" fill={INK} stroke="none" />
        </>
      )}
    </>
  )
}

// A phone holding the live menu — list rows each tagged with a price pill.
function MenuScene() {
  return (
    <>
      <rect x="42" y="18" width="36" height="64" rx="6" />
      {[30, 42, 54, 66].map((y) => (
        <g key={y}>
          <path d={`M48 ${y} H58`} />
          <rect x="62" y={y - 2.5} width="10" height="5" rx="2.5" />
        </g>
      ))}
    </>
  )
}

// A figure with a thought bubble — the client sizing up the options.
function ThinkScene() {
  return (
    <>
      <circle cx="40" cy="52" r="11" />
      <path d="M40 63 L40 82" />
      <path d="M40 70 L30 79" />
      <path d="M40 70 L50 79" />
      <circle cx="60" cy="44" r="2.5" fill={INK} stroke="none" />
      <circle cx="69" cy="38" r="3.5" fill={INK} stroke="none" />
      <ellipse cx="88" cy="28" rx="18" ry="14" />
      <text x="88" y="34" textAnchor="middle" fontFamily={HAND} fontSize="20" fill={INK} stroke="none">?</text>
    </>
  )
}

// A client walking in through an open door, where a consultant already waits
// seated inside (vb 0 0 150 100).
function WalkInScene() {
  return (
    <>
      {/* doorway + open door */}
      <rect x="58" y="22" width="30" height="72" />
      <path d="M58 22 L46 29 L46 94 L58 94" />
      <circle cx="52" cy="60" r="1.8" fill={INK} stroke="none" />
      {/* client entering, mid-stride */}
      <circle cx="24" cy="34" r="8" />
      <path d="M24 42 L26 64" />
      <path d="M26 64 L18 84" />
      <path d="M26 64 L36 82" />
      <path d="M24 48 L16 56" />
      <path d="M24 48 L34 54" />
      {/* consultant seated inside, facing the door */}
      <path d="M132 50 V80" />
      <path d="M120 80 H134" />
      <circle cx="120" cy="40" r="8" />
      <path d="M120 48 L120 72" />
      <path d="M120 72 L108 72" />
      <path d="M108 72 L110 88" />
      <path d="M120 54 L110 60" />
    </>
  )
}

// The consultation itself: consultant reading the client's report, with an AI
// spark beside it for the drafted plan (vb 0 0 160 100).
function ConsultScene() {
  return (
    <>
      <path d="M30 74 H130" />
      <path d="M40 74 L40 92" />
      <path d="M120 74 L120 92" />
      {/* client, gesturing */}
      <circle cx="48" cy="40" r="9" />
      <path d="M48 49 L48 74" />
      <path d="M48 56 L38 66" />
      <path d="M48 56 L60 62" />
      {/* consultant, holding the report */}
      <circle cx="116" cy="38" r="9" />
      <path d="M116 47 L116 74" />
      <path d="M116 52 L104 60" />
      <rect x="84" y="48" width="20" height="24" rx="1.5" />
      <path d="M88 54 H100" />
      <path d="M88 58 H100" />
      <path d="M88 62 H96" />
      {/* AI spark */}
      <path d="M74 40 V48 M70 44 H78 M71.5 41.5 L76.5 46.5 M76.5 41.5 L71.5 46.5" />
    </>
  )
}

// Three numbered steps arranged as a closed loop: step 1 sits at the top, then
// curved arrows run clockwise — top (1) → bottom-right (2) → bottom-left (3) →
// back to the top. Collapses to a plain numbered vertical stack on mobile.
function CycleStoryboard({ panels }: { panels: { label: string; scene: React.ReactNode }[] }) {
  // panel order: [0] top, [1] bottom-right, [2] bottom-left
  const slot = ["lluna-cyc-b", "lluna-cyc-c", "lluna-cyc-a"]
  return (
    <div className="lluna-cycle">
      {panels.map((p, i) => (
        <div key={i} className={`lluna-cyc-panel ${slot[i]}`}>
          <SketchFrame label={`${i + 1}. ${p.label}`}>{p.scene}</SketchFrame>
        </div>
      ))}
      <svg
        className="lluna-cyc-arrows"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
        style={{ stroke: INK, strokeWidth: 1.5, fill: "none", strokeLinecap: "round", strokeLinejoin: "round", opacity: 0.55 }}
      >
        {/* 1 → 2 : down the right side */}
        <CycArrow x1={64} y1={40} cx={88} cy={48} x2={75} y2={57} />
        {/* 2 → 3 : along the bottom */}
        <CycArrow x1={61} y1={89} cx={50} cy={99} x2={39} y2={87} />
        {/* 3 → 1 : up the left side */}
        <CycArrow x1={25} y1={57} cx={12} cy={47} x2={36} y2={40} />
      </svg>
    </div>
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
        width: "100%",
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
        <CSBody>Lluna is an AI aesthetic consultant built for the one window everyone overlooks: the ten-odd minutes a client spends waiting before the consultation.</CSBody>
        <div style={{ position: "relative" }}>
          <CSBody>Watch any medspa and the same scene repeats. A client checks in, sinks into the lounge sofa, and waits twelve, fifteen minutes before a consultant calls them in. That dead time is pure anxiety, they know almost nothing, and they&apos;re about to sit across from someone who knows everything and is paid to close.</CSBody>
          <span className="cs-margin-note" aria-hidden>the waiting-room window</span>
        </div>
        <CSBody>Lluna lives in those minutes. A client scans a QR code on the table, and by the time they&apos;re called in they&apos;ve browsed the clinic&apos;s real menu, read a personalized plan, and walked in with questions instead of guesses, one product built for both sides of the chair.</CSBody>
      </CSSection>

      <CSSection id="problem">
        <CSLabel>The problem</CSLabel>
        <div style={{ position: "relative" }}>
          <CSHeading>Both sides of the chair are guessing.</CSHeading>
          <span className="cs-margin-note" aria-hidden>so… what actually works best for me?</span>
        </div>

        <CSSubheading>Consumers</CSSubheading>
        <ProblemList items={[
          "Clients rarely know what a therapy actually does, its effects, downtime, or how it compares to the alternatives on the menu.",
          "The biggest fear walking in is being over-sold; the trust between client and consultant is ambiguous at best.",
          "Everyone wants the cost-effective plan: real results, no money wasted on treatments that won't work for them.",
        ]} />

        <CSSubheading>Medical-spa consultants</CSSubheading>
        <ProblemList items={[
          "There's too much to uncover in twenty minutes, history, budget, real goals, so the consultant spends the whole slot digging and still never quite lands on what the client actually needs.",
          "Every recommendation can read as a pitch, the harder you sell, the less credible you sound.",
          "Consultants are measured on revenue, but an unprepared, skeptical client buys a single treatment at best.",
        ]} />
      </CSSection>

      <CSSection id="solution-1">
        <CSLabel>Solution 01</CSLabel>
        <CSHeading>Menu, the whole price list, before anyone has to ask.</CSHeading>
        <div className="lluna-figure-row">
          <div className="lluna-figure-video">
            <CSVideo src="/cs/lluna-mobile-2.mp4" poster="/cs/lluna-mobile-2-poster.webp" width={886} height={1920} style={{ borderRadius: "8px" }} />
            <Caption style={{ marginTop: "12px", marginBottom: 0 }}>The Menu tab: the clinic&apos;s live treatment menu, sorted by most popular.</Caption>
          </div>
          <CycleStoryboard
            panels={[
              { label: "consumers scan from the sofa", scene: <SofaScene screen="qr" /> },
              { label: "browse the live menu", scene: <MenuScene /> },
              { label: "start sizing up the options", scene: <ThinkScene /> },
            ]}
          />
        </div>
      </CSSection>

      <CSSection id="solution-2">
        <CSLabel>Solution 02</CSLabel>
        <CSHeading>The report, a personalized plan in about a minute.</CSHeading>
        <div className="lluna-figure-row">
          <div className="lluna-figure-video">
            <CSVideo src="/cs/lluna-mobile-1.mp4" poster="/cs/lluna-mobile-1-poster.webp" width={886} height={1920} style={{ borderRadius: "8px" }} />
            <Caption style={{ marginTop: "12px", marginBottom: 0 }}>The Best for You tab: tiered plans, each with a synergy callout and a price breakdown.</Caption>
          </div>
          <CycleStoryboard
            panels={[
              { label: "read the plan on the sofa", scene: <SofaScene screen="report" /> },
              { label: "weigh the three tiers", scene: <ThinkScene /> },
              { label: "walk in with questions", scene: <WalkInScene /> },
            ]}
          />
        </div>
        <CSBody style={{ marginTop: "40px" }}>The recommendation logic behind every plan is deliberately opinionated:</CSBody>
        <CodeBlock filename="recommendation_policy.ts" code={RECOMMENDATION_POLICY} />
      </CSSection>

      <CSSection id="solution-3">
        <CSLabel>Solution 03</CSLabel>
        <CSHeading>Clinic console, the consultant&apos;s side of the loop.</CSHeading>
        <div className="lluna-console-group" style={{ position: "relative", marginTop: "24px" }}>
          <CSVideo src="/cs/lluna-navi-bar.mp4" poster="/cs/lluna-navi-bar-poster.webp" width={1700} height={1080} style={{ width: "100%", borderRadius: "8px", marginBottom: "8px" }} />
          <Caption>One console for the clinic: notifications, client plans, and revenue data behind a single navigation bar.</Caption>
          <CSVideo src="/cs/lluna-ai-sales.mp4" poster="/cs/lluna-ai-sales-poster.webp" width={1700} height={1080} style={{ width: "100%", borderRadius: "8px", marginTop: "24px", marginBottom: "8px" }} />
          <Caption>Pull up any treatment on the fly, its efficacy window, downtime, and recovery, without leaving the plan.</Caption>

          {/* Right-margin annotation: a brace grouping both console scenes, with a
              sketch of the consultation they power. Desktop (≥1024px) only. */}
          <div className="lluna-console-aside" aria-hidden>
            <svg className="lluna-brace" viewBox="0 0 16 400" preserveAspectRatio="xMidYMid meet" style={{ stroke: INK, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }}>
              <path d="M3 4 C8 4 8 20 8 40 L8 180 C8 195 9 200 15 200 C9 200 8 205 8 220 L8 360 C8 380 8 396 3 396" vectorEffect="non-scaling-stroke" strokeWidth="2" />
            </svg>
            <div className="lluna-brace-note">
              <SketchFrame label="the consultant pulls up your report, AI drafts the plan" vb="0 0 160 100"><ConsultScene /></SketchFrame>
            </div>
          </div>
        </div>
      </CSSection>

      <CSSection id="outcome">
        <CSLabel>The outcome</CSLabel>
        <div style={{ position: "relative" }}>
          <CSOutcome
            variant="cards"
            stats={[
              { label: "YC AI School", stat: "<5% acceptance", description: "Selected for Y Combinator's AI Startup School 2026, 2,000+ accepted from 30,000+ applicants.", viz: "people" },
              { label: "Revenue lift", stat: "8%+ per clinic", description: "Per-clinic revenue increased for pilot clinics on the B2B2C model.", viz: "curve-up" },
              { label: "First contracts", stat: "$1.6K ACV signed", description: "3 clinics signed onto the pilot program out of 40+ pitched, including partner clinic Viqi Medical Spa in Los Angeles.", viz: "coins" },
            ]}
          />
          <span className="cs-margin-note" aria-hidden>40+ pitches, 3 signatures</span>
        </div>
      </CSSection>
    </CaseStudyLayout>
  )
}
