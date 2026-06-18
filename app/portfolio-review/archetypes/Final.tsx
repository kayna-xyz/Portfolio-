import { SlideFrame, Txt, AssetFrame, Annotation } from "../primitives"
import type { FinalSlide } from "../types"

export default function Final({ slide }: { slide: FinalSlide }) {
  const callouts = slide.callouts.filter((c) => c.body && c.body.trim() !== "")

  return (
    <SlideFrame eyebrow={slide.eyebrow}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "var(--s-16)", marginBottom: "var(--s-40)" }}>
        <h2 className="pr-title">
          <Txt>{slide.headline}</Txt>
        </h2>
        <span className="pr-label">{slide.variant === "hero" ? "Shipped" : "Detail"}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: "var(--s-64)", flex: 1, minHeight: 0 }}>
        {/* annotated hero asset */}
        <AssetFrame src={slide.asset} style={{ width: "100%", height: "100%" }} />

        {/* callouts as the one annotation treatment */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "var(--s-40)" }}>
          {callouts.map((c, i) => (
            <Annotation key={i} label={c.label} body={c.body} />
          ))}
        </div>
      </div>
    </SlideFrame>
  )
}
