// deck.content.ts — the rendered deck's content layer.
// Faithful typed mirror of .claude/skills/portfolio-editing/deck/deck.md.
// EDIT RULE: when you change content here, change deck.md too (and vice-versa).
// Placeholders 【FILL: …】 / 【ASSET: …】 are intentional — they render as visible
// styled placeholders so Kayna can spot exactly what's left to fill.

import type {
  Slide,
  SectionTag,
  ProblemSlide,
  FinalSlide,
  ExplorationsSlide,
  ResultsSlide,
} from "./types"

// ── Factories for the repeated feature modules (all-placeholder by design) ──

function problem(id: number, section: SectionTag, eyebrow: string, core = false): ProblemSlide {
  return {
    id,
    section,
    eyebrow,
    core,
    archetype: "Problem",
    featureName: "【FILL: feature name】",
    context: "【FILL: where in the product / what the user was trying to do】",
    tension: {
      user: "【FILL: the user need】",
      business: "【FILL: the business goal】",
      constraint: "【FILL: the tech / time / model constraint】",
    },
    question: "【FILL: the one-sentence design question this feature had to answer】",
    asset: "【ASSET: a “before” state, or a data point that proves the problem was real】",
  }
}

function finalHero(id: number, section: SectionTag, eyebrow: string, core = false): FinalSlide {
  return {
    id,
    section,
    eyebrow,
    core,
    archetype: "Final",
    variant: "hero",
    headline: "What shipped.",
    asset: "【ASSET: hero shot of the final design, high fidelity】",
    callouts: [
      { label: "Decision 1", body: "【FILL: chose X over Y because Z】" },
      { label: "Decision 2", body: "【FILL: chose X over Y because Z】" },
      { label: "Decision 3", body: "【FILL: optional third callout】" },
    ],
  }
}

function finalDetail(id: number, section: SectionTag, eyebrow: string): FinalSlide {
  return {
    id,
    section,
    eyebrow,
    archetype: "Final",
    variant: "detail",
    headline: "【FILL: e.g. “…and how it behaves” / “…inside the system”】",
    asset: "【ASSET: interaction states, edge cases, or how it fits the design system】",
    callouts: [
      { label: "Behavior", body: "【FILL: what this state / edge case handles】" },
      { label: "System fit", body: "【FILL: how it generalizes across the product】" },
    ],
  }
}

function explorations(id: number, section: SectionTag, eyebrow: string, core = false): ExplorationsSlide {
  return {
    id,
    section,
    eyebrow,
    core,
    archetype: "Explorations",
    headline: "Three directions, one principle.",
    directions: [
      { key: "A", optimizesFor: "【FILL: e.g. Speed-first】", body: "【FILL: what it does · what it wins · what it costs】", asset: "【ASSET: thumbnail A】" },
      { key: "B", optimizesFor: "【FILL: e.g. Control-first】", body: "【FILL: what it does · what it wins · what it costs】", asset: "【ASSET: thumbnail B】" },
      { key: "C", optimizesFor: "【FILL: e.g. Trust-first】", body: "【FILL: what it does · what it wins · what it costs】", asset: "【ASSET: thumbnail C】" },
    ],
    matrix: {
      cols: ["EFFORT", "LEARNABILITY", "FLEXIBILITY", "RISK"],
      rows: [
        { dir: "A", cells: ["【FILL】", "【FILL】", "【FILL】", "【FILL】"] },
        { dir: "B", cells: ["【FILL】", "【FILL】", "【FILL】", "【FILL】"] },
        { dir: "C", cells: ["【FILL】", "【FILL】", "【FILL】", "【FILL】"] },
      ],
    },
    decidingPrinciple: "【FILL: the rule that broke the tie, tie it back to a Slide-4 principle】",
  }
}

function results(id: number, section: SectionTag, eyebrow: string, core = false): ResultsSlide {
  return {
    id,
    section,
    eyebrow,
    core,
    archetype: "Results",
    metrics: [
      { value: "【FILL】", delta: "【FILL: ↑/↓ delta】", window: "【FILL: window】" },
      { value: "【FILL】", delta: "【FILL】", window: "【FILL】" },
    ],
    qualitative: "【FILL: a user quote / support-ticket shift / team adoption signal】",
    honestLine: "【FILL: what this metric doesn’t capture / what I’d watch next】",
  }
}

// ── The deck, in page order (deck.md §2) ──

export const DECK: Slide[] = [
  // 1 — Cover
  {
    id: 1,
    section: "INTRO",
    core: true,
    archetype: "Cover",
    name: "Kayna 【FILL: full display name】",
    roleLine: "Product Designer · Builder",
    thesis: "I design in systems and ship like an operator.",
    thesisEmphasis: "ship like an operator",
    contact: "kayna.ai · 【FILL: email】",
    date: "【FILL: month year / “Portfolio 2026”】",
    asset: "【ASSET: one signature mark, brand mark or a single calligraphy-derived stroke. One element only.】",
  },

  // 2 — Agenda
  {
    id: 2,
    section: "INTRO",
    core: true,
    archetype: "Agenda",
    sectionTitle: "Three products. Three questions.",
    cards: [
      { label: "Opus Clip", question: "Can I design for an AI-native product at scale?", teaser: "【FILL: 1 metric, e.g. “X features shipped to N users”】" },
      { label: "HeyGen", question: "Can I hold craft inside a team moving this fast?", teaser: "【FILL: 1 metric】" },
      { label: "Lluna", question: "Can I build the whole thing myself?", teaser: "0→1, design→code→20+ clinics" },
    ],
  },

  // 3 — Bio
  {
    id: 3,
    section: "INTRO",
    core: true,
    archetype: "Bio",
    headline: "I learned product before I learned design.",
    beats: [
      "Grew up in a manufacturing family in Zhejiang. I think in supply chains, systems, and how things actually get made.",
      "15+ years of Chinese calligraphy and ink painting, where I learned restraint: every stroke is a decision you can't take back.",
      "Came to the US alone at 18; UWC → Barnard / Columbia, Cognitive Science × Political Science, HCI. I read products as power structures and incentives.",
      "First product design intern at HeyGen; since then I'd rather ship and learn than spec and wait.",
    ],
    identityLine: "Designer who builds. Operator who designs.",
    asset: "【ASSET: optional, portrait, or a calligraphy / ink piece used small as texture】",
  },

  // 4 — Principles
  {
    id: 4,
    section: "INTRO",
    core: true,
    archetype: "Principles",
    sectionTitle: "Three principles, repeated in everything that follows.",
    principles: [
      { name: "Systems before screens.", body: "I design the rule, then the surface. One good decision pays off across the product." },
      { name: "Build to learn.", body: "Shipping a real thing teaches me what a spec never will." },
      { name: "Restraint is a feature.", body: "From calligraphy: the strongest design is what I chose to leave out." },
    ],
  },

  // 5 — Opus Clip · CompanyIntro
  {
    id: 5,
    section: "OPUS CLIP",
    eyebrow: "OPUS CLIP · PRODUCT",
    core: true,
    archetype: "CompanyIntro",
    productOneliner: "【FILL: Opus Clip in one line】",
    whoFor: "【FILL: primary user】",
    strategicMoment: "【FILL: the market tension, why now, the company's bet】",
    asset: "【ASSET: product screenshot or one-frame “what it does” visual】",
  },

  // 6 — Opus Clip · Role
  {
    id: 6,
    section: "OPUS CLIP",
    eyebrow: "OPUS CLIP · ROLE",
    core: true,
    archetype: "Role",
    teamShape: "【FILL: who you worked with, PM, eng, # designers, manager level】",
    owned: "【FILL: features / surfaces you owned end-to-end】",
    collaborated: "【FILL: where you contributed but didn't own】",
    timeline: "【FILL: duration】",
    scopeHonesty: "【FILL: 1 honest line on intern scope, framed by impact】",
    stats: [
      { value: "【FILL】", label: "FEATURES SHIPPED" },
      { value: "【FILL】", label: "SURFACES TOUCHED" },
      { value: "【FILL】", label: "USERS REACHED" },
    ],
  },

  // 7–11 — Opus Clip · Feature 1 (worked example)
  problem(7, "OPUS CLIP", "OPUS CLIP · FEATURE 1", true),
  finalHero(8, "OPUS CLIP", "OPUS CLIP · FEATURE 1", true),
  finalDetail(9, "OPUS CLIP", "OPUS CLIP · FEATURE 1"),
  explorations(10, "OPUS CLIP", "OPUS CLIP · FEATURE 1", true),
  results(11, "OPUS CLIP", "OPUS CLIP · FEATURE 1", true),

  // 12–16 — Opus Clip · Feature 2
  problem(12, "OPUS CLIP", "OPUS CLIP · FEATURE 2"),
  finalHero(13, "OPUS CLIP", "OPUS CLIP · FEATURE 2"),
  finalDetail(14, "OPUS CLIP", "OPUS CLIP · FEATURE 2"),
  explorations(15, "OPUS CLIP", "OPUS CLIP · FEATURE 2"),
  results(16, "OPUS CLIP", "OPUS CLIP · FEATURE 2"),

  // 17–21 — Opus Clip · Feature 3
  problem(17, "OPUS CLIP", "OPUS CLIP · FEATURE 3"),
  finalHero(18, "OPUS CLIP", "OPUS CLIP · FEATURE 3"),
  finalDetail(19, "OPUS CLIP", "OPUS CLIP · FEATURE 3"),
  explorations(20, "OPUS CLIP", "OPUS CLIP · FEATURE 3"),
  results(21, "OPUS CLIP", "OPUS CLIP · FEATURE 3"),

  // 22–24 — Opus Clip · Feature 4 (lighter) OR design-system contribution
  problem(22, "OPUS CLIP", "OPUS CLIP · FEATURE 4 / DESIGN SYSTEM"),
  finalHero(23, "OPUS CLIP", "OPUS CLIP · FEATURE 4 / DESIGN SYSTEM"),
  results(24, "OPUS CLIP", "OPUS CLIP · FEATURE 4 / DESIGN SYSTEM"),

  // 25 — Opus Clip · CaseTakeaway
  {
    id: 25,
    section: "OPUS CLIP",
    eyebrow: "OPUS CLIP · TAKEAWAY",
    core: true,
    archetype: "CaseTakeaway",
    proves: "Yes, I can design for an AI-native product at scale.",
    bullets: [
      "【FILL: transferable strength #1 this case demonstrated】",
      "【FILL: transferable strength #2】",
      "【FILL: transferable strength #3 (optional)】",
    ],
    callback: "【FILL: name which Slide-4 principle this case embodied most】",
  },

  // 26 — HeyGen · CompanyIntro
  {
    id: 26,
    section: "HEYGEN",
    eyebrow: "HEYGEN · PRODUCT",
    archetype: "CompanyIntro",
    productOneliner: "【FILL: HeyGen in one line】",
    whoFor: "【FILL: primary user】",
    strategicMoment: "【FILL: the market tension, the strategic moment】",
    asset: "【ASSET: product screenshot or one-frame visual】",
  },

  // 27 — HeyGen · Role
  {
    id: 27,
    section: "HEYGEN",
    eyebrow: "HEYGEN · ROLE",
    archetype: "Role",
    teamShape: "【FILL: who you worked with】",
    owned: "【FILL: features / surfaces owned】",
    collaborated: "【FILL: where you contributed】",
    timeline: "【FILL: duration】",
    scopeHonesty: "【FILL: 1 honest line on scope, framed by impact】",
    stats: [
      { value: "【FILL】", label: "FEATURES SHIPPED" },
      { value: "【FILL】", label: "SURFACES TOUCHED" },
    ],
    anchor: "First product design intern, built the design muscle as the team scaled.",
  },

  // 28–31 — HeyGen · Feature 1
  problem(28, "HEYGEN", "HEYGEN · FEATURE 1"),
  finalHero(29, "HEYGEN", "HEYGEN · FEATURE 1"),
  explorations(30, "HEYGEN", "HEYGEN · FEATURE 1"),
  results(31, "HEYGEN", "HEYGEN · FEATURE 1"),

  // 32–34 — HeyGen · Feature 2 (lighter)
  problem(32, "HEYGEN", "HEYGEN · FEATURE 2"),
  finalHero(33, "HEYGEN", "HEYGEN · FEATURE 2"),
  results(34, "HEYGEN", "HEYGEN · FEATURE 2"),

  // 35 — HeyGen · CaseTakeaway
  {
    id: 35,
    section: "HEYGEN",
    eyebrow: "HEYGEN · TAKEAWAY",
    archetype: "CaseTakeaway",
    proves: "I can hold craft inside a team moving fast.",
    bullets: [
      "【FILL: transferable strength #1】",
      "【FILL: transferable strength #2】",
    ],
    callback: "【FILL: likely “Restraint is a feature”】",
  },

  // 36 — Lluna · BuildIntro
  {
    id: 36,
    section: "LLUNA",
    eyebrow: "LLUNA · THE BET",
    core: true,
    archetype: "BuildIntro",
    theBet: "A B2B SaaS for medspa / aesthetics clinics, software to run the parts of the business no tool covered well.",
    context: "【FILL: what existed before, the gap you saw】",
    whyIStarted: "【FILL: the conviction, connect to your aesthetics / GoGlow interest if relevant】",
  },

  // 37 — Lluna · BuildArtifact
  {
    id: 37,
    section: "LLUNA",
    eyebrow: "LLUNA · WHAT I BUILT",
    core: true,
    archetype: "BuildArtifact",
    product: "【FILL: the actual product, what it did, to white-label launch stage】",
    stack: "Next.js · Supabase · Azure OpenAI 【FILL: confirm / extend】",
    gtmProof: "In-person cold outreach to 20+ clinics. 【FILL: any conversion / learning】",
    asset: "【ASSET: product screens, show it was real and shipped】",
  },

  // 38 — Lluna · BuildDecision
  {
    id: 38,
    section: "LLUNA",
    eyebrow: "LLUNA · A KEY CALL",
    archetype: "BuildDecision",
    theCall: "【FILL: one sharp decision under constraint, a build/buy, a scope cut, a model-cost tradeoff】",
    reasoning: "【FILL: the reasoning behind the call】",
    asset: "【ASSET: before / after or architecture sketch】",
  },

  // 39 — Lluna · BuildJudgment
  {
    id: 39,
    section: "LLUNA",
    eyebrow: "LLUNA · JUDGMENT",
    core: true,
    archetype: "BuildJudgment",
    whatHappened: "【FILL: traction, learnings】",
    theDecision: "I wound it down. The market ceiling was too low to justify continued investment.",
    framing: "I optimize for impact, not for sunk cost. Knowing when to stop is a product skill.",
  },

  // 40 — Lluna · BuildSynthesis
  {
    id: 40,
    section: "LLUNA",
    eyebrow: "LLUNA · WHAT IT TAUGHT ME",
    core: true,
    archetype: "BuildSynthesis",
    synthesis: [
      "【FILL: thing #1 end-to-end ownership taught you that pure design wouldn't】",
      "【FILL: thing #2】",
      "【FILL: thing #3 (optional)】",
    ],
    callback: "Build to learn.",
  },

  // 41 — Fit (swappable)
  {
    id: 41,
    section: "CLOSE",
    eyebrow: "FIT · SWAPPABLE PER APPLICATION",
    core: true,
    archetype: "Fit",
    company: "【FILL: Google / Meta / etc.】",
    mapping: [
      { their: "【FILL: their design problem / value 1】", mine: "【FILL: your strength from a case】" },
      { their: "【FILL: their design problem / value 2】", mine: "【FILL: your strength】" },
      { their: "【FILL: their design problem / value 3】", mine: "【FILL: your strength】" },
    ],
  },

  // 42 — Closing
  {
    id: 42,
    section: "CLOSE",
    core: true,
    archetype: "Closing",
    headline: "Thank you.",
    contact: "kayna.ai · 【FILL: email / LinkedIn】",
    closingLine: "Systems. Shipped.",
  },
]

export const TOTAL = DECK.length
