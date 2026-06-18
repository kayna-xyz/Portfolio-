# deck.md — Kayna · Product Design Portfolio

**What this file is.** The single source of truth for deck content + structure. Visual design
(type, color, spacing, grid, components) comes 100% from `design.md`. Each slide declares an
**archetype** (see §3) + its content fields. To edit the deck, edit this file **and** keep
`app/portfolio-review/deck.content.ts` in sync (the rendered deck reads from that typed mirror,
generated faithfully from this file). `【FILL: …】` = Kayna supplies real content. `【ASSET: …】` =
image/screenshot/figure to drop in. Anything not in brackets is drafted copy you can keep or edit.

**Audience.** Staff-/senior-level reviewers at top product companies, evaluating for a Product
Design Intern role. Target read: "this person already operates a level or two above intern."

**Format target.** 16:9 web deck, keyboard-navigable, exports cleanly to PDF. ~42 slides.

---

## 1. Narrative thesis (the spine)

One sentence the whole deck must earn:
> "I'm a designer who thinks in systems and ships like an operator — so I make better product calls, not just better screens."

Three proof axes, one per case:
- **Opus Clip → depth & scale.** Designing inside an AI-native product; judgment under ambiguity.
- **HeyGen → craft & velocity.** Holding design quality inside a fast-moving team.
- **Lluna → end-to-end ownership.** 0→1 build (design + code + GTM) and the judgment to wind it down.

Recurring callbacks: the 3 design principles in §Slide-4 (plant on P4, pay off in every case).

## 2. Page map (lock this)

| Pages | Section | Archetype(s) |
|---|---|---|
| 1 | Cover | Cover |
| 2 | Agenda (as thesis) | Agenda |
| 3 | About me | Bio |
| 4 | How I work (3 principles) | Principles |
| 5 | Opus Clip — product intro | CompanyIntro |
| 6 | Opus Clip — my role | Role |
| 7–11 | OC · Feature 1 (worked example) | Problem→Final→Final→Explorations→Results |
| 12–16 | OC · Feature 2 | same module |
| 17–21 | OC · Feature 3 | same module |
| 22–24 | OC · Feature 4 (lighter) OR design-system contribution | Problem→Final→Results |
| 25 | Opus Clip — case takeaway | CaseTakeaway |
| 26 | HeyGen — product intro | CompanyIntro |
| 27 | HeyGen — my role | Role |
| 28–31 | HG · Feature 1 | Problem→Final→Explorations→Results |
| 32–34 | HG · Feature 2 (lighter) | Problem→Final→Results |
| 35 | HeyGen — case takeaway | CaseTakeaway |
| 36 | Lluna — the bet | BuildIntro |
| 37 | Lluna — what I built | BuildArtifact |
| 38 | Lluna — a key build/design call | BuildDecision |
| 39 | Lluna — results + why I wound it down | BuildJudgment |
| 40 | Lluna — what building taught me | BuildSynthesis |
| 41 | Why [Company] (swappable) | Fit |
| 42 | Thank you | Closing |

**Presentation cut.** Slides marked `[CORE]` form the ~12-slide live path; the full deck is the
leave-behind PDF. The deck supports `?mode=core` to render only `[CORE]` slides.

## 3. Slide archetypes (component contract)

Each archetype = one reusable component, driven entirely by the fields below.

- **Cover** — name, role line, one-line thesis, contact/url, date. One signature visual.
- **Agenda** — section title, 3 case cards: label, the question it answers, 1 metric/teaser.
- **Bio** — headline, 3–4 narrative beats, optional portrait/asset, identity line.
- **Principles** — section title, 3 principle blocks (name · one-liner · "how it shows up").
- **CompanyIntro** — product one-liner, who it's for, the strategic moment/tension, 1 context visual.
- **Role** — team shape, owned vs collaborated, timeline, scope honesty, 1 stat row.
- **Problem** — feature name, context line, the tension (user × business × constraint), the question, 1 "before"/data asset.
- **Final** — "What shipped" hero (annotated, 2–3 callouts). Two Final slides = hero + detail/system view.
- **Explorations** — 3 directions, each labeled by what it optimizes for; tradeoff matrix; the deciding principle. (Highest-signal slide.)
- **Results** — in-feature metrics (number + delta + window), qualitative signal, 1 line "what the metric misses / what I'd watch next."
- **CaseTakeaway** — what this case proves (1 line) + 2–3 transferable bullets, callback to a Principle.
- **BuildIntro** — the bet, the 0→1 context, why I started.
- **BuildArtifact** — the product + stack + GTM proof (design + code + users).
- **BuildDecision** — one sharp call under constraint (mini problem→solution).
- **BuildJudgment** — outcome + the decision to wind down (market ceiling); framed as impact-optimization.
- **BuildSynthesis** — what end-to-end ownership taught me; callback to Principles.
- **Fit** — "Why [Company]": map 3 proven strengths to their design problems/values. Swappable.
- **Closing** — thank you, contact, url (kayna.ai), one line echoing the Cover thesis.

Shared chrome: subtle slide counter, section tag (top corner), progress indicator. All from `design.md`.

---

## 4. Slides

### Slide 1 — Cover · `Cover` [CORE]
- name: Kayna 【FILL: full display name】
- role_line: Product Designer · Builder
- thesis: 【DRAFT】 I design in systems and ship like an operator.
- contact: kayna.ai · 【FILL: email】
- date: 【FILL: month year / "Portfolio 2026"】
- asset: 【ASSET: one signature mark — brand mark or a single calligraphy-derived stroke. One element only.】
- note: No word "Portfolio" as the headline. Let the thesis carry it.

### Slide 2 — Agenda · `Agenda` [CORE]
- section_title: Three products. Three questions.
- cards:
  - Opus Clip — Can I design for an AI-native product at scale? — teaser: 【FILL: 1 metric】
  - HeyGen — Can I hold craft inside a team moving this fast? — teaser: 【FILL】
  - Lluna — Can I build the whole thing myself? — teaser: 0→1, design→code→20+ clinics
- note: The question framing is the staff move. Questions recur as case takeaways.

### Slide 3 — About me · `Bio` [CORE]
- headline: 【DRAFT】 I learned product before I learned design.
- beats:
  - Grew up in a manufacturing family in Zhejiang — I think in supply chains, systems, and how things actually get made.
  - 15+ years of Chinese calligraphy & ink painting — where I learned restraint: every stroke is a decision you can't take back.
  - Came to the US alone at 18; UWC → Barnard/Columbia, Cognitive Science × Political Science, HCI. I read products as power structures and incentives.
  - First product design intern at HeyGen; since then I'd rather ship and learn than spec and wait.
- identity_line: Designer who builds. Operator who designs.
- asset: 【ASSET: optional — portrait, or a calligraphy/ink piece used small as texture】

### Slide 4 — How I work · `Principles` [CORE]
- section_title: Three principles, repeated in everything that follows.
- principles:
  - Systems before screens. — "I design the rule, then the surface. One good decision pays off across the product."
  - Build to learn. — "Shipping a real thing teaches me what a spec never will."
  - Restraint is a feature. — "From calligraphy: the strongest design is what I chose to leave out."
- note: 3 is the discipline. Don't add filler.

### Slide 5 — Opus Clip · product intro · `CompanyIntro` [CORE]
- product_oneliner: 【FILL: e.g. "AI that turns long video into short, viral-ready clips."】
- who_for: 【FILL: creators / marketers / agencies?】
- strategic_moment: 【FILL: the market tension, why now, the company's bet】 (show you understand the business, not just the UI)
- asset: 【ASSET: product screenshot or one-frame "what it does" visual】

### Slide 6 — Opus Clip · my role · `Role` [CORE]
- team_shape: 【FILL: PM, eng, # designers, manager level】
- owned: 【FILL: features/surfaces owned end-to-end】
- collaborated: 【FILL: where you contributed but didn't own】
- timeline: 【FILL: duration】
- scope_honesty: 【FILL: 1 honest line on intern scope, framed by impact】
- stat_row: 【FILL: 2–3 stats — features shipped / surfaces touched / users reached】

### Slides 7–11 — Opus Clip · Feature 1 · WORKED EXAMPLE MODULE
The template every feature follows. Match this depth; vary the content.

#### Slide 7 — `Problem` [CORE]
- feature_name: 【FILL】
- context: 【FILL: where in the product / what the user was doing】
- tension (three forces in conflict):
  - user need: 【…】
  - business goal: 【…】
  - constraint: 【tech/time/model limitation】
- the_question: 【FILL: the one-sentence design question】
- asset: 【ASSET: a "before" state or a data point that proves the problem】

#### Slide 8 — `Final` (hero) [CORE]
- headline: What shipped.
- asset: 【ASSET: hero shot of final design, high fidelity】
- callouts: 【FILL: 2–3 annotations, each tied to a decision. "Chose X over Y because Z."】

#### Slide 9 — `Final` (detail / system)
- headline: 【FILL: e.g. "…and how it behaves" / "…inside the system"】
- asset: 【ASSET: interaction states, edge cases, or how it fits the design system】
- callouts: 【FILL】

#### Slide 10 — `Explorations` [CORE] ← highest-signal slide
- headline: Three directions, one principle.
- directions (label by what it OPTIMIZES FOR):
  - A — 【FILL: e.g. "Speed-first"】: 【what it does · wins · costs】 + 【ASSET: thumbnail】
  - B — 【FILL: "Control-first"】: 【…】 + 【ASSET】
  - C — 【FILL: "Trust-first"】: 【…】 + 【ASSET】
- tradeoff_matrix: rows = directions, cols = the 3–4 things weighed (e.g. effort, learnability, flexibility, risk)
- deciding_principle: 【FILL: the rule that broke the tie — tie back to a Slide-4 principle.】

#### Slide 11 — `Results` [CORE]
- metrics: 【FILL: 1–3, each = number + delta + window. e.g. "+18% completion, 30 days post-launch."】
- qualitative: 【FILL: a user quote / support-ticket shift / team adoption signal】
- honest_line: 【FILL: "What this doesn't capture / what I'd watch next."】

### Slides 12–16 — Opus Clip · Feature 2 · (Problem→Final→Final→Explorations→Results)
【FILL: all fields, same shape as 7–11】 · note: show a different muscle than F1.

### Slides 17–21 — Opus Clip · Feature 3 · (Problem→Final→Final→Explorations→Results)
【FILL】 · note: the most ambitious/ambiguous feature — strongest judgment story.

### Slides 22–24 — Opus Clip · Feature 4 (lighter) OR design-system contribution
- Option A (4th feature, condensed): Problem(22) → Final(23) → Results(24)
- Option B (recommended): a design-system / pattern contribution —
  - 22 Problem: an inconsistency or scaling problem across the product
  - 23 Final: the component/pattern/guideline introduced + adoption
  - 24 Results: where it propagated, time saved, consistency gained
【FILL】 · note: Option B proves "systems before screens" better than a 4th screen.

### Slide 25 — Opus Clip · case takeaway · `CaseTakeaway` [CORE]
- proves: Yes — I can design for an AI-native product at scale.
- bullets: 【FILL: 2–3 transferable strengths this case demonstrated】
- callback: 【FILL: name which Slide-4 principle this case embodied most】

### Slide 26 — HeyGen · product intro · `CompanyIntro`
- product_oneliner: 【FILL: HeyGen in one line】 (AI avatar / video generation)
- who_for: 【FILL】
- strategic_moment: 【FILL】
- asset: 【ASSET】
- note: You were HeyGen's first product design intern — surface here or in Role.

### Slide 27 — HeyGen · my role · `Role`
- team_shape: 【FILL】 · owned: 【FILL】 · collaborated: 【FILL】
- timeline: 【FILL】 · scope_honesty: 【FILL】 · stat_row: 【FILL】
- anchor: First product design intern — built the design muscle as the team scaled.

### Slides 28–31 — HeyGen · Feature 1 · (Problem→Final→Explorations→Results)
28 Problem · 29 Final · 30 Explorations · 31 Results
【FILL all】 · theme: craft under velocity.

### Slides 32–34 — HeyGen · Feature 2 (lighter) · (Problem→Final→Results)
32 Problem · 33 Final · 34 Results · 【FILL all】

### Slide 35 — HeyGen · case takeaway · `CaseTakeaway`
- proves: I can hold craft inside a team moving fast.
- bullets: 【FILL】 · callback: 【FILL: likely "Restraint is a feature"】

### Slide 36 — Lluna · the bet · `BuildIntro` [CORE]
- the_bet: 【DRAFT】 A B2B SaaS for medspa/aesthetics clinics — software to run the parts of the business no tool covered well.
- 0to1_context: 【FILL: what existed before, the gap you saw】
- why_i_started: 【FILL: the conviction — connect to aesthetics/GoGlow interest if relevant】

### Slide 37 — Lluna · what I built · `BuildArtifact` [CORE]
- product: 【FILL: the actual product — what it did, to white-label launch stage】
- stack: Next.js · Supabase · Azure OpenAI 【FILL: confirm/extend】
- gtm_proof: In-person cold outreach to 20+ clinics. 【FILL: any conversion/learning】
- asset: 【ASSET: product screens — show it was real and shipped】
- note: The "designer who builds" proof. Design + code + customer contact on one slide.

### Slide 38 — Lluna · a key build/design call · `BuildDecision`
- the_call: 【FILL: one sharp decision under constraint — build/buy, a scope cut, a model-cost tradeoff】
- reasoning: 【FILL】
- asset: 【ASSET: before/after or architecture sketch】

### Slide 39 — Lluna · results + why I wound it down · `BuildJudgment` [CORE]
- what_happened: 【FILL: traction, learnings】
- the_decision: I wound it down — the market ceiling was too low to justify continued investment.
- framing: I optimize for impact, not for sunk cost. Knowing when to stop is a product skill.

### Slide 40 — Lluna · what building taught me · `BuildSynthesis` [CORE]
- synthesis: 【FILL: 2–3 things end-to-end ownership taught you that pure design wouldn't】
- callback: Build to learn. — name it explicitly.

### Slide 41 — Why [Company] · `Fit` [CORE] · SWAPPABLE PER APPLICATION
- company: 【FILL: Google / Meta / etc. — keep variable】
- mapping (tie 3 proven strengths to their specific design problems):
  - 【FILL: their problem / value 1】 → I bring 【your strength from a case】
  - 【FILL: 2】 → 【…】
  - 【FILL: 3】 → 【…】
- note: Name a real surface/challenge of theirs and what you'd do.

### Slide 42 — Thank you · `Closing` [CORE]
- headline: Thank you.
- contact: kayna.ai · 【FILL: email / LinkedIn】
- closing_line: 【echo the Cover thesis — e.g. "Systems. Shipped."】

---

## 5. Fill checklist
- [ ] Cover: name, contact, signature asset
- [ ] Agenda: 3 teaser metrics
- [ ] Bio: confirm/edit the 4 beats
- [ ] Opus Clip: product intro + role (5–6)
- [ ] Opus Clip: Features 1–3 full modules
- [ ] Opus Clip: Feature 4 / design-system slide (pick Option A or B)
- [ ] HeyGen: intro + role + 2 feature modules
- [ ] Lluna: 5 slides of content + assets
- [ ] Fit: one block per target company
- [ ] All 【ASSET】 screenshots/figures exported and placed

Tip: fill Opus Clip Feature 1 first at staff quality, then clone the pattern. Depth beats coverage.
