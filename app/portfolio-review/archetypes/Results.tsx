import { SlideFrame, Txt } from "../primitives"
import type { ResultsSlide } from "../types"

export default function Results({ slide }: { slide: ResultsSlide }) {
  return (
    <SlideFrame eyebrow={slide.eyebrow}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "var(--s-16)", marginBottom: "var(--s-40)" }}>
        <h2 className="pr-title">Results.</h2>
        <span className="pr-label">In-feature impact</span>
      </div>

      {/* metric row */}
      <div style={{ display: "flex", gap: "var(--s-80)", flexWrap: "wrap", marginBottom: "var(--s-40)" }}>
        {slide.metrics.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "var(--s-12)" }}>
            <span className="pr-display">
              <Txt>{m.value}</Txt>
            </span>
            <span style={{ fontFamily: "var(--sans)", fontSize: "var(--t-body)", color: "var(--ink-50)" }}>
              <Txt>{m.delta}</Txt>
            </span>
            <span className="pr-label">
              <Txt>{m.window}</Txt>
            </span>
          </div>
        ))}
      </div>

      <hr className="pr-rule" style={{ marginBottom: "var(--s-24)" }} />

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "var(--s-64)", flex: 1 }}>
        {/* qualitative signal */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-12)" }}>
          <span className="pr-label">Qualitative signal</span>
          <p className="pr-lead">
            <Txt>{slide.qualitative}</Txt>
          </p>
        </div>

        {/* honest line — what the metric misses */}
        <div className="pr-anno" style={{ alignSelf: "flex-start" }}>
          <div className="pr-anno-rule" />
          <div className="pr-anno-label">What I'd watch next</div>
          <div className="pr-anno-body">
            <Txt>{slide.honestLine}</Txt>
          </div>
        </div>
      </div>
    </SlideFrame>
  )
}
