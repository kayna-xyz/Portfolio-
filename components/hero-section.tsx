"use client"

import WindowHero from "@/components/window/window-hero"

export default function HeroSection() {
  // Mobile: hero is omitted entirely (via the `.hero-section` CSS media query)
  // — nav flows straight into the project list. No JS detection, so no flash.
  return (
    <section
      className="hero-section"
      style={{
        // The art's canvas carries ~43px of transparent feather margin on top
        // and bottom (wall panel starts at 7.4% of canvas height), so the
        // *visible* gaps are padding + 43px: 64+43 above ≈ 24+40 (work-section
        // top padding) + 43 below — optically equal spacing.
        padding: "64px 40px 24px 40px",
        background: "#FDFBFA",
      }}
    >
      <WindowHero />
    </section>
  )
}
