"use client"

import WindowHero from "@/components/window/window-hero"

export default function HeroSection() {
  // Mobile: hero is omitted entirely (via the `.hero-section` CSS media query)
  // — nav flows straight into the project list. No JS detection, so no flash.
  return (
    <section
      className="hero-section"
      style={{
        // The hero owns the first viewport, centered against the FULL screen
        // (not the area below the nav): it slides under the translucent
        // sticky nav via the negative margin, so the 64px bar counts as part
        // of the top spacing. Padding floors are symmetric (nav 64 + 24) so
        // flex centering lands on the true viewport center. The art's canvas
        // adds its own ~7.4% transparent feather above and below.
        padding: "calc(64px + 24px) 40px calc(64px + 24px) 40px",
        marginTop: "-64px",
        minHeight: "100vh",
        alignItems: "center",
        background: "#FDFBFA",
      }}
    >
      <WindowHero />
    </section>
  )
}
