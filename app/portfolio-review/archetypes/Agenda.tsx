import { SlideFrame, Txt } from "../primitives"
import type { AgendaSlide } from "../types"

export default function Agenda({ slide }: { slide: AgendaSlide }) {
  return (
    <SlideFrame>
      <h2 className="pr-title" style={{ maxWidth: "16em", marginBottom: "var(--s-64)" }}>
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
        {slide.cards.map((c, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "var(--s-20)" }}>
            <hr className="pr-rule" />
            <span className="pr-label">{String(i + 1).padStart(2, "0")}</span>
            <span style={{ fontFamily: "var(--serif)", fontSize: "var(--t-lead)", color: "var(--ink-75)", lineHeight: 1.1 }}>
              <Txt>{c.label}</Txt>
            </span>
            <p className="pr-body" style={{ color: "var(--ink-75)" }}>
              <Txt>{c.question}</Txt>
            </p>
            <span className="pr-label" style={{ marginTop: "auto" }}>
              <Txt>{c.teaser}</Txt>
            </span>
          </div>
        ))}
      </div>
    </SlideFrame>
  )
}
