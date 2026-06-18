import { SlideFrame, Txt, AssetFrame } from "../primitives"
import type { ExplorationsSlide } from "../types"

export default function Explorations({ slide }: { slide: ExplorationsSlide }) {
  const { matrix } = slide
  const gridCols = `132px repeat(${matrix.cols.length}, 1fr)`

  return (
    <SlideFrame eyebrow={slide.eyebrow}>
      <h2 className="pr-title" style={{ marginBottom: "var(--s-24)" }}>
        <Txt>{slide.headline}</Txt>
      </h2>

      {/* 3 directions, each labeled by what it optimizes for */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--s-40)", marginBottom: "var(--s-24)" }}>
        {slide.directions.map((d) => (
          <div key={d.key} style={{ display: "flex", flexDirection: "column", gap: "var(--s-12)" }}>
            <span className="pr-label">
              {d.key} · <Txt>{d.optimizesFor}</Txt>
            </span>
            <AssetFrame src={d.asset} style={{ width: "100%", height: "92px" }} />
            <p className="pr-body" style={{ fontSize: "var(--t-caption)", lineHeight: 1.4 }}>
              <Txt>{d.body}</Txt>
            </p>
          </div>
        ))}
      </div>

      {/* tradeoff matrix */}
      <div style={{ marginBottom: "var(--s-20)" }}>
        <div style={{ display: "grid", gridTemplateColumns: gridCols, alignItems: "center", padding: "0 0 var(--s-12)", borderBottom: "1px solid var(--hairline)" }}>
          <span />
          {matrix.cols.map((c) => (
            <span key={c} className="pr-label" style={{ fontSize: "var(--t-caption)" }}>
              {c}
            </span>
          ))}
        </div>
        {matrix.rows.map((r) => (
          <div key={r.dir} style={{ display: "grid", gridTemplateColumns: gridCols, alignItems: "center", padding: "var(--s-12) 0", borderBottom: "1px solid var(--hairline)" }}>
            <span className="pr-label" style={{ color: "var(--ink-75)" }}>
              {r.dir}
            </span>
            {r.cells.map((cell, i) => (
              <span key={i} style={{ fontFamily: "var(--sans)", fontSize: "var(--t-caption)", color: "var(--ink-50)" }}>
                <Txt>{cell}</Txt>
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* the deciding principle — annotation treatment */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "var(--s-16)" }}>
        <span className="pr-label" style={{ whiteSpace: "nowrap" }}>
          Deciding principle
        </span>
        <p className="pr-body" style={{ color: "var(--ink-75)" }}>
          <Txt>{slide.decidingPrinciple}</Txt>
        </p>
      </div>
    </SlideFrame>
  )
}
