"use client"

import { useEffect, useRef, useState } from "react"

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState("")

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`

      // Check if hovering an element with data-cursor-label
      const target = e.target as HTMLElement
      const labelEl = target.closest("[data-cursor-label]") as HTMLElement | null
      const newLabel = labelEl?.getAttribute("data-cursor-label") || ""
      setLabel(newLabel)
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor${label ? " has-label" : ""}`}
    >
      <span className="cursor-label">{label}</span>
    </div>
  )
}
