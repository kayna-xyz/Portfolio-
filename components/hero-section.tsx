"use client"

import WindowHero from "@/components/window/window-hero"

export default function HeroSection() {
  // All layout (full-viewport centering, nav slide-under, mobile stacking)
  // lives in globals.css under `.hero-section` / `.hero-inner` — CSS-driven,
  // no JS viewport detection, so there is no flash.
  return (
    <section className="hero-section">
      <WindowHero />
    </section>
  )
}
