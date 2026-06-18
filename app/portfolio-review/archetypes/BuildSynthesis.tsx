import { SlideFrame, Txt } from "../primitives"
import type { BuildSynthesisSlide } from "../types"

export default function BuildSynthesis({ slide }: { slide: BuildSynthesisSlide }) {
  return (
    <SlideFrame eyebrow={slide.eyebrow}>
      <h2 className="pr-title" style={{ marginBottom: "var(--s-64)" }}>
        What building taught me.
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-24)" }}>
        {slide.synthesis.map((s, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: "var(--s-24)", alignItems: "baseline" }}>
            <span className="pr-label">{String(i + 1).padStart(2, "0")}</span>
            <p className="pr-lead">
              <Txt>{s}</Txt>
            </p>
          </div>
        ))}
      </div>

      <div className="pr-anno" style={{ marginTop: "auto" }}>
        <div className="pr-anno-rule" />
        <div className="pr-anno-label">Principle</div>
        <div className="pr-anno-body">
          <Txt>{slide.callback}</Txt>
        </div>
      </div>
    </SlideFrame>
  )
}
