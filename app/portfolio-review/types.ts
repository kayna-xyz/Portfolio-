// Typed content contract for the deck. Generated faithfully from
// .claude/skills/portfolio-editing/deck/deck.md — keep both in sync.
// Any string may contain a 【FILL: …】 or 【ASSET: …】 placeholder; the
// renderer detects the brackets and styles them as visible placeholders.

export type SectionTag = "INTRO" | "OPUS CLIP" | "HEYGEN" | "LLUNA" | "CLOSE"

export interface SlideBase {
  /** 1-based page number, matches deck.md §2 page map. */
  id: number
  /** Corner section tag (chrome). */
  section: SectionTag
  /** Small uppercase eyebrow shown on the slide (e.g. "OPUS CLIP · FEATURE 1"). */
  eyebrow?: string
  /** Part of the ~12-slide live cut (?mode=core). Mirrors [CORE] in deck.md. */
  core?: boolean
}

export interface CoverSlide extends SlideBase {
  archetype: "Cover"
  name: string
  roleLine: string
  thesis: string
  /** Optional PT-Serif-italic phrase inside the thesis, emphasized. */
  thesisEmphasis?: string
  contact: string
  date: string
  asset: string
}

export interface AgendaSlide extends SlideBase {
  archetype: "Agenda"
  sectionTitle: string
  cards: { label: string; question: string; teaser: string }[]
}

export interface BioSlide extends SlideBase {
  archetype: "Bio"
  headline: string
  beats: string[]
  identityLine: string
  asset?: string
}

export interface PrinciplesSlide extends SlideBase {
  archetype: "Principles"
  sectionTitle: string
  principles: { name: string; body: string }[]
}

export interface CompanyIntroSlide extends SlideBase {
  archetype: "CompanyIntro"
  productOneliner: string
  whoFor: string
  strategicMoment: string
  asset: string
}

export interface RoleSlide extends SlideBase {
  archetype: "Role"
  teamShape: string
  owned: string
  collaborated: string
  timeline: string
  scopeHonesty: string
  stats: { value: string; label: string }[]
  anchor?: string
}

export interface ProblemSlide extends SlideBase {
  archetype: "Problem"
  featureName: string
  context: string
  tension: { user: string; business: string; constraint: string }
  question: string
  asset: string
}

export interface FinalSlide extends SlideBase {
  archetype: "Final"
  headline: string
  asset: string
  callouts: { label: string; body: string }[]
  /** "hero" = primary shipped shot; "detail" = system/edge-case view. */
  variant: "hero" | "detail"
}

export interface ExplorationsSlide extends SlideBase {
  archetype: "Explorations"
  headline: string
  directions: { key: string; optimizesFor: string; body: string; asset: string }[]
  matrix: { cols: string[]; rows: { dir: string; cells: string[] }[] }
  decidingPrinciple: string
}

export interface ResultsSlide extends SlideBase {
  archetype: "Results"
  metrics: { value: string; delta: string; window: string }[]
  qualitative: string
  honestLine: string
}

export interface CaseTakeawaySlide extends SlideBase {
  archetype: "CaseTakeaway"
  proves: string
  bullets: string[]
  callback: string
}

export interface BuildIntroSlide extends SlideBase {
  archetype: "BuildIntro"
  theBet: string
  context: string
  whyIStarted: string
}

export interface BuildArtifactSlide extends SlideBase {
  archetype: "BuildArtifact"
  product: string
  stack: string
  gtmProof: string
  asset: string
}

export interface BuildDecisionSlide extends SlideBase {
  archetype: "BuildDecision"
  theCall: string
  reasoning: string
  asset: string
}

export interface BuildJudgmentSlide extends SlideBase {
  archetype: "BuildJudgment"
  whatHappened: string
  theDecision: string
  framing: string
}

export interface BuildSynthesisSlide extends SlideBase {
  archetype: "BuildSynthesis"
  synthesis: string[]
  callback: string
}

export interface FitSlide extends SlideBase {
  archetype: "Fit"
  company: string
  mapping: { their: string; mine: string }[]
}

export interface ClosingSlide extends SlideBase {
  archetype: "Closing"
  headline: string
  contact: string
  closingLine: string
}

export type Slide =
  | CoverSlide
  | AgendaSlide
  | BioSlide
  | PrinciplesSlide
  | CompanyIntroSlide
  | RoleSlide
  | ProblemSlide
  | FinalSlide
  | ExplorationsSlide
  | ResultsSlide
  | CaseTakeawaySlide
  | BuildIntroSlide
  | BuildArtifactSlide
  | BuildDecisionSlide
  | BuildJudgmentSlide
  | BuildSynthesisSlide
  | FitSlide
  | ClosingSlide

export type Archetype = Slide["archetype"]
