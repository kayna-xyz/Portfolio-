import { SlideFrame, Txt, AssetFrame } from "../primitives"
import type { BuildArtifactSlide } from "../types"

export default function BuildArtifact({ slide }: { slide: BuildArtifactSlide }) {
  // Stack renders as pills (the one sanctioned fill), split on the · separator.
  const stackParts = slide.stack.split("·").map((s) => s.trim()).filter(Boolean)

  return (
    <SlideFrame eyebrow={slide.eyebrow}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--s-64)", flex: 1, minHeight: 0 }}>
        {/* left: design + code + users, on one slide */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-40)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-12)" }}>
            <span className="pr-label">Product</span>
            <p className="pr-body" style={{ color: "var(--ink-75)" }}>
              <Txt>{slide.product}</Txt>
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-12)" }}>
            <span className="pr-label">Stack</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s-12)" }}>
              {stackParts.map((p, i) => (
                <span key={i} className="pr-pill">
                  <Txt>{p}</Txt>
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-12)" }}>
            <span className="pr-label">Go-to-market</span>
            <p className="pr-body" style={{ color: "var(--ink-75)" }}>
              <Txt>{slide.gtmProof}</Txt>
            </p>
          </div>
        </div>

        {/* right: it was real and shipped */}
        <div style={{ display: "flex", alignItems: "stretch" }}>
          <AssetFrame src={slide.asset} style={{ width: "100%" }} />
        </div>
      </div>
    </SlideFrame>
  )
}
