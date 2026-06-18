import { SlideFrame, Txt } from "../primitives"
import type { ClosingSlide } from "../types"

export default function Closing({ slide }: { slide: ClosingSlide }) {
  return (
    <SlideFrame>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
        <span className="pr-eyebrow">kayna.ai</span>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-24)" }}>
          <h1 className="pr-headline">
            <Txt>{slide.headline}</Txt>
          </h1>
          <p className="pr-lead" style={{ color: "var(--ink-50)" }}>
            <Txt>{slide.closingLine}</Txt>
          </p>
        </div>

        <span className="pr-eyebrow" style={{ textTransform: "none" }}>
          <Txt>{slide.contact}</Txt>
        </span>
      </div>
    </SlideFrame>
  )
}
