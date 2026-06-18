import { SlideFrame, Txt, AssetFrame } from "../primitives"
import type { CoverSlide } from "../types"

export default function Cover({ slide }: { slide: CoverSlide }) {
  // Split the thesis so the emphasized phrase renders in PT Serif italic.
  const { thesis, thesisEmphasis } = slide
  let head: React.ReactNode = <Txt>{thesis}</Txt>
  if (thesisEmphasis && thesis.includes(thesisEmphasis)) {
    const [a, b] = thesis.split(thesisEmphasis)
    head = (
      <>
        {a}
        <em>{thesisEmphasis}</em>
        {b}
      </>
    )
  }

  return (
    <SlideFrame>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
        {/* wordmark + role */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "var(--s-16)" }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: "var(--t-body)", color: "var(--ink-75)" }}>
            <Txt>{slide.name}</Txt>
          </span>
          <span className="pr-eyebrow">{slide.roleLine}</span>
        </div>

        {/* thesis carries the cover */}
        <h1 className="pr-headline" style={{ maxWidth: "13.5em" }}>
          {head}
        </h1>

        {/* contact + date */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span className="pr-eyebrow" style={{ textTransform: "none" }}>
            <Txt>{slide.contact}</Txt>
          </span>
          <span className="pr-eyebrow">
            <Txt>{slide.date}</Txt>
          </span>
        </div>
      </div>

      {/* one signature mark, upper-right */}
      <AssetFrame
        src={slide.asset}
        aspect="1 / 1"
        style={{ position: "absolute", top: "var(--s-80)", right: "var(--s-80)", width: "240px" }}
      />
    </SlideFrame>
  )
}
