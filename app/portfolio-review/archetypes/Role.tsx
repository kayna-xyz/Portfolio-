import { SlideFrame, Txt } from "../primitives"
import type { RoleSlide } from "../types"

export default function Role({ slide }: { slide: RoleSlide }) {
  const defs: { label: string; value: string }[] = [
    { label: "Owned", value: slide.owned },
    { label: "Collaborated", value: slide.collaborated },
    { label: "Team", value: slide.teamShape },
    { label: "Timeline", value: slide.timeline },
  ]

  return (
    <SlideFrame eyebrow={slide.eyebrow}>
      {slide.anchor && (
        <p className="pr-lead" style={{ marginBottom: "var(--s-40)" }}>
          <Txt>{slide.anchor}</Txt>
        </p>
      )}

      {/* stat row */}
      <div style={{ display: "flex", gap: "var(--s-80)", marginBottom: "var(--s-40)" }}>
        {slide.stats.map((s, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "var(--s-12)" }}>
            <span style={{ fontFamily: "var(--sans)", fontSize: "var(--t-headline)", lineHeight: 1, color: "var(--ink-75)", letterSpacing: "-0.02em" }}>
              <Txt>{s.value}</Txt>
            </span>
            <span className="pr-label">{s.label}</span>
          </div>
        ))}
      </div>

      <hr className="pr-rule" style={{ marginBottom: "var(--s-40)" }} />

      {/* owned vs collaborated + team + timeline */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "var(--s-64)", rowGap: "var(--s-24)", marginBottom: "var(--s-40)" }}>
        {defs.map((d, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "var(--s-12)" }}>
            <span className="pr-label">{d.label}</span>
            <p className="pr-body" style={{ color: "var(--ink-75)" }}>
              <Txt>{d.value}</Txt>
            </p>
          </div>
        ))}
      </div>

      {/* scope honesty — calibration line */}
      <div className="pr-anno" style={{ marginTop: "auto" }}>
        <div className="pr-anno-rule" />
        <div className="pr-anno-label">Scope, honestly</div>
        <div className="pr-anno-body">
          <Txt>{slide.scopeHonesty}</Txt>
        </div>
      </div>
    </SlideFrame>
  )
}
