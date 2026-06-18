import { SlideFrame, Txt } from "../primitives"
import type { BuildJudgmentSlide } from "../types"

export default function BuildJudgment({ slide }: { slide: BuildJudgmentSlide }) {
  return (
    <SlideFrame eyebrow={slide.eyebrow}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-12)", marginBottom: "var(--s-64)" }}>
        <span className="pr-label">What happened</span>
        <p className="pr-body" style={{ color: "var(--ink-75)", maxWidth: "26em" }}>
          <Txt>{slide.whatHappened}</Txt>
        </p>
      </div>

      {/* the decision — the maturity move, stated plainly */}
      <h2 className="pr-headline" style={{ maxWidth: "15em", marginBottom: "var(--s-40)" }}>
        <Txt>{slide.theDecision}</Txt>
      </h2>

      {/* framing — impact, not sunk cost */}
      <div className="pr-anno" style={{ marginTop: "auto" }}>
        <div className="pr-anno-rule" />
        <div className="pr-anno-label">The framing</div>
        <div className="pr-anno-body">
          <Txt>{slide.framing}</Txt>
        </div>
      </div>
    </SlideFrame>
  )
}
