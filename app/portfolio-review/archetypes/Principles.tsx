import { SlideFrame, Txt } from "../primitives"
import type { PrinciplesSlide } from "../types"

export default function Principles({ slide }: { slide: PrinciplesSlide }) {
  return (
    <SlideFrame>
      <h2 className="pr-title" style={{ maxWidth: "18em", marginBottom: "var(--s-64)" }}>
        <Txt>{slide.sectionTitle}</Txt>
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "var(--s-40)",
          flex: 1,
        }}
      >
        {slide.principles.map((p, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "var(--s-24)" }}>
            <span className="pr-label">{String(i + 1).padStart(2, "0")}</span>
            <h3 style={{ fontFamily: "var(--serif)", fontSize: "var(--t-lead)", color: "var(--ink-75)", lineHeight: 1.15, margin: 0 }}>
              <Txt>{p.name}</Txt>
            </h3>
            <p className="pr-body">
              <Txt>{p.body}</Txt>
            </p>
          </div>
        ))}
      </div>
    </SlideFrame>
  )
}
