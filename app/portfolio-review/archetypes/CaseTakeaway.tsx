import { SlideFrame, Txt } from "../primitives"
import type { CaseTakeawaySlide } from "../types"

export default function CaseTakeaway({ slide }: { slide: CaseTakeawaySlide }) {
  return (
    <SlideFrame eyebrow={slide.eyebrow}>
      <span className="pr-label" style={{ marginBottom: "var(--s-16)" }}>
        What this case proves
      </span>
      <h2 className="pr-headline" style={{ maxWidth: "14em", marginBottom: "var(--s-64)" }}>
        <Txt>{slide.proves}</Txt>
      </h2>

      {/* transferable strengths */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-20)" }}>
        {slide.bullets.map((b, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: "var(--s-20)", alignItems: "baseline" }}>
            <span className="pr-label">{String(i + 1).padStart(2, "0")}</span>
            <p className="pr-body" style={{ color: "var(--ink-75)" }}>
              <Txt>{b}</Txt>
            </p>
          </div>
        ))}
      </div>

      {/* callback to a Slide-4 principle */}
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
