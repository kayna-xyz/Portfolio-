"use client"

import WindowHero from "@/components/window/window-hero"

export default function HeroSection() {
  // Mobile: hero is omitted entirely (via the `.hero-section` CSS media query)
  // — nav flows straight into the project list. No JS detection, so no flash.
  return (
    <section
      className="hero-section"
      style={{
        // The hero owns the first viewport: min-height fills the screen below
        // the 64px nav, art vertically centered. The art's canvas carries a
        // transparent feather margin (~7.4% of canvas height) top and bottom,
        // so visible gaps read larger than the padding values.
        padding: "80px 40px 64px 40px",
        minHeight: "calc(100vh - 64px)",
        alignItems: "center",
        background: "#FDFBFA",
      }}
    >
      <WindowHero />
    </section>
  )
}
