import { SlideFrame, Txt, AssetFrame } from "../primitives"
import type { CompanyIntroSlide } from "../types"

export default function CompanyIntro({ slide }: { slide: CompanyIntroSlide }) {
  return (
    <SlideFrame eyebrow={slide.eyebrow}>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "var(--s-64)", flex: 1, minHeight: 0 }}>
        {/* left: what it is → who → the strategic moment */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h2 className="pr-title" style={{ marginBottom: "var(--s-40)" }}>
            <Txt>{slide.productOneliner}</Txt>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-12)", marginBottom: "var(--s-40)" }}>
            <span className="pr-label">Who it's for</span>
            <p className="pr-body" style={{ color: "var(--ink-75)" }}>
              <Txt>{slide.whoFor}</Txt>
            </p>
          </div>

          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "var(--s-12)" }}>
            <div className="pr-anno-rule" />
            <span className="pr-label">The strategic moment</span>
            <p className="pr-lead">
              <Txt>{slide.strategicMoment}</Txt>
            </p>
          </div>
        </div>

        {/* right: context visual */}
        <div style={{ display: "flex", alignItems: "stretch" }}>
          <AssetFrame src={slide.asset} style={{ width: "100%" }} />
        </div>
      </div>
    </SlideFrame>
  )
}
