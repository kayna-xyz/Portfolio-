import React from "react"

/** Split a string on 【…】 placeholders so they render as visible quiet pills. */
function splitPlaceholders(s: string): { text: string; fill: boolean }[] {
  const out: { text: string; fill: boolean }[] = []
  const re = /【[^】]*】/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) out.push({ text: s.slice(last, m.index), fill: false })
    out.push({ text: m[0], fill: true })
    last = m.index + m[0].length
  }
  if (last < s.length) out.push({ text: s.slice(last), fill: false })
  return out
}

/** Text that auto-styles any 【FILL: …】 placeholder inside it. */
export function Txt({ children }: { children: string }) {
  return (
    <>
      {splitPlaceholders(children).map((p, i) =>
        p.fill ? (
          <span key={i} className="pr-fill">
            {p.text}
          </span>
        ) : (
          <React.Fragment key={i}>{p.text}</React.Fragment>
        ),
      )}
    </>
  )
}

/** Styled frame for an 【ASSET: …】 placeholder, sized to its intended aspect. */
export function AssetFrame({
  src,
  aspect,
  style,
  className,
}: {
  src: string
  /** CSS aspect-ratio, e.g. "16 / 9". */
  aspect?: string
  style?: React.CSSProperties
  className?: string
}) {
  const desc = src.replace(/^【ASSET:\s*/, "").replace(/】\s*$/, "")
  return (
    <div
      className={`pr-asset${className ? " " + className : ""}`}
      style={{ aspectRatio: aspect, ...style }}
    >
      <div className="pr-asset-tag">▢ Asset</div>
      <div className="pr-asset-desc">{desc}</div>
    </div>
  )
}

/** The single annotation treatment (leader line + mono label + copy). */
export function Annotation({ label, body }: { label: string; body: string }) {
  return (
    <div className="pr-anno">
      <div className="pr-anno-rule" />
      <div className="pr-anno-label">{label}</div>
      <div className="pr-anno-body">
        <Txt>{body}</Txt>
      </div>
    </div>
  )
}

/** Consistent inner frame: 80px padding box + optional top eyebrow. */
export function SlideFrame({
  eyebrow,
  children,
  style,
}: {
  eyebrow?: string
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <div className="pr-slide-inner" style={style}>
      {eyebrow && (
        <div className="pr-eyebrow" style={{ marginBottom: "var(--s-40)", flex: "none" }}>
          {eyebrow}
        </div>
      )}
      {children}
    </div>
  )
}
