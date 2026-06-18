import { SlideFrame, Txt, AssetFrame } from "../primitives"
import type { ProblemSlide } from "../types"

export default function Problem({ slide }: { slide: ProblemSlide }) {
  const forces: { label: string; body: string }[] = [
    { label: "User need", body: slide.tension.user },
    { label: "Business goal", body: slide.tension.business },
    { label: "Constraint", body: slide.tension.constraint },
  ]

  return (
    <SlideFrame eyebrow={slide.eyebrow}>
      <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: "var(--s-64)", flex: 1, minHeight: 0 }}>
        {/* left: the framing */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h2 className="pr-title" style={{ marginBottom: "var(--s-16)" }}>
            <Txt>{slide.featureName}</Txt>
          </h2>
          <p className="pr-body" style={{ marginBottom: "var(--s-24)" }}>
            <Txt>{slide.context}</Txt>
          </p>

          <span className="pr-label" style={{ marginBottom: "var(--s-16)" }}>
            The tension
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", columnGap: "var(--s-24)", rowGap: "var(--s-12)" }}>
            {forces.map((f, i) => (
              <div key={i} style={{ display: "contents" }}>
                <span className="pr-label" style={{ whiteSpace: "nowrap", paddingTop: "4px" }}>
                  {f.label}
                </span>
                <p className="pr-body" style={{ color: "var(--ink-75)" }}>
                  <Txt>{f.body}</Txt>
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "var(--s-24)", display: "flex", flexDirection: "column", gap: "var(--s-12)" }}>
            <div className="pr-anno-rule" />
            <span className="pr-label">The question</span>
            <p className="pr-lead">
              <Txt>{slide.question}</Txt>
            </p>
          </div>
        </div>

        {/* right: before / data asset */}
        <div style={{ display: "flex", alignItems: "stretch" }}>
          <AssetFrame src={slide.asset} style={{ width: "100%" }} />
        </div>
      </div>
    </SlideFrame>
  )
}
