import { SlideFrame, Txt } from "../primitives"
import type { BuildIntroSlide } from "../types"

export default function BuildIntro({ slide }: { slide: BuildIntroSlide }) {
  return (
    <SlideFrame eyebrow={slide.eyebrow}>
      <span className="pr-label" style={{ marginBottom: "var(--s-16)" }}>
        The bet
      </span>
      <h2 className="pr-headline" style={{ maxWidth: "15em", marginBottom: "var(--s-64)" }}>
        <Txt>{slide.theBet}</Txt>
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-64)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-12)" }}>
          <span className="pr-label">0 → 1 context</span>
          <p className="pr-body" style={{ color: "var(--ink-75)" }}>
            <Txt>{slide.context}</Txt>
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-12)" }}>
          <span className="pr-label">Why I started</span>
          <p className="pr-body" style={{ color: "var(--ink-75)" }}>
            <Txt>{slide.whyIStarted}</Txt>
          </p>
        </div>
      </div>
    </SlideFrame>
  )
}
