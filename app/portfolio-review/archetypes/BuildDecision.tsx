import { SlideFrame, Txt, AssetFrame } from "../primitives"
import type { BuildDecisionSlide } from "../types"

export default function BuildDecision({ slide }: { slide: BuildDecisionSlide }) {
  return (
    <SlideFrame eyebrow={slide.eyebrow}>
      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "var(--s-64)", flex: 1, minHeight: 0 }}>
        {/* left: the call → the reasoning */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className="pr-label" style={{ marginBottom: "var(--s-16)" }}>
            The call
          </span>
          <p className="pr-lead" style={{ marginBottom: "var(--s-40)" }}>
            <Txt>{slide.theCall}</Txt>
          </p>

          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "var(--s-12)" }}>
            <div className="pr-anno-rule" />
            <span className="pr-label">Reasoning</span>
            <p className="pr-body" style={{ color: "var(--ink-75)" }}>
              <Txt>{slide.reasoning}</Txt>
            </p>
          </div>
        </div>

        {/* right: before/after or architecture */}
        <div style={{ display: "flex", alignItems: "stretch" }}>
          <AssetFrame src={slide.asset} style={{ width: "100%" }} />
        </div>
      </div>
    </SlideFrame>
  )
}
