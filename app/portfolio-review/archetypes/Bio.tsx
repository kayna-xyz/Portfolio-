import { SlideFrame, Txt, AssetFrame } from "../primitives"
import type { BioSlide } from "../types"

export default function Bio({ slide }: { slide: BioSlide }) {
  return (
    <SlideFrame>
      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: "var(--s-64)", height: "100%" }}>
        {/* left: headline + beats + identity line */}
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <h2 className="pr-title" style={{ marginBottom: "var(--s-40)" }}>
            <Txt>{slide.headline}</Txt>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-20)" }}>
            {slide.beats.map((b, i) => (
              <p key={i} className="pr-body">
                <Txt>{b}</Txt>
              </p>
            ))}
          </div>

          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "var(--s-12)" }}>
            <div className="pr-anno-rule" />
            <p className="pr-lead">
              <Txt>{slide.identityLine}</Txt>
            </p>
          </div>
        </div>

        {/* right: optional portrait / texture */}
        {slide.asset && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <AssetFrame src={slide.asset} aspect="3 / 4" style={{ width: "100%" }} />
          </div>
        )}
      </div>
    </SlideFrame>
  )
}
