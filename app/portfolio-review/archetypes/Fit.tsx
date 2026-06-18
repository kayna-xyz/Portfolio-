import { SlideFrame, Txt } from "../primitives"
import type { FitSlide } from "../types"

export default function Fit({ slide }: { slide: FitSlide }) {
  return (
    <SlideFrame eyebrow={slide.eyebrow}>
      <h2 className="pr-title" style={{ marginBottom: "var(--s-64)" }}>
        Why <Txt>{slide.company}</Txt>.
      </h2>

      {/* their problem → what I bring */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", columnGap: "var(--s-40)", marginBottom: "var(--s-12)" }}>
        <span />
        <span className="pr-label">Their focus</span>
        <span className="pr-label">What I bring</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {slide.mapping.map((m, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr 1fr",
              columnGap: "var(--s-40)",
              alignItems: "baseline",
              padding: "var(--s-24) 0",
              borderTop: "1px solid var(--hairline)",
            }}
          >
            <span className="pr-label" style={{ paddingTop: "4px" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="pr-body" style={{ color: "var(--ink-75)" }}>
              <Txt>{m.their}</Txt>
            </p>
            <p className="pr-body">
              <span style={{ color: "var(--ink-35)", marginRight: "var(--s-12)" }}>→</span>
              <Txt>{m.mine}</Txt>
            </p>
          </div>
        ))}
      </div>
    </SlideFrame>
  )
}
