import { SlideFrame, Txt } from "../primitives"
import type { Slide } from "../types"

const BASE_KEYS = new Set(["id", "section", "eyebrow", "core", "archetype"])

function humanize(k: string) {
  return k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())
}

function Value({ v }: { v: unknown }) {
  if (typeof v === "string") return <Txt>{v}</Txt>
  if (Array.isArray(v)) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-12)" }}>
        {v.map((item, i) =>
          typeof item === "string" ? (
            <span key={i}>
              <Txt>{item}</Txt>
            </span>
          ) : (
            <span key={i} style={{ color: "var(--ink-50)" }}>
              <Txt>{Object.values(item as Record<string, string>).join("  ·  ")}</Txt>
            </span>
          ),
        )}
      </div>
    )
  }
  if (v && typeof v === "object") {
    return (
      <span style={{ color: "var(--ink-50)" }}>
        <Txt>{Object.values(v as Record<string, string>).join("  ·  ")}</Txt>
      </span>
    )
  }
  return null
}

/** Quiet content-visible placeholder for archetypes not yet laid out.
   Renders all content fields so nothing is lost before the component lands. */
export default function Fallback({ slide }: { slide: Slide }) {
  const entries = Object.entries(slide).filter(([k]) => !BASE_KEYS.has(k))

  return (
    <SlideFrame eyebrow={slide.eyebrow ?? slide.section}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "var(--s-16)", marginBottom: "var(--s-40)" }}>
        <h2 className="pr-title">{slide.archetype}</h2>
        <span className="pr-label">Layout pending craft sign-off</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", columnGap: "var(--s-40)", rowGap: "var(--s-24)", overflow: "hidden" }}>
        {entries.map(([k, v]) => (
          <div key={k} style={{ display: "contents" }}>
            <span className="pr-label" style={{ paddingTop: "4px" }}>
              {humanize(k)}
            </span>
            <div className="pr-body" style={{ color: "var(--ink-75)" }}>
              <Value v={v} />
            </div>
          </div>
        ))}
      </div>
    </SlideFrame>
  )
}
