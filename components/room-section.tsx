"use client"

import { useEffect, useRef, useState } from "react"

// Pre-compute star positions to avoid hydration mismatch from Math.random()
const STARS = [
  { w: 2.1, h: 2.4, l: 84, t: 57, o: 0.56, dur: 2.4, delay: 1.9 },
  { w: 2.3, h: 2.4, l: 28, t: 12, o: 0.38, dur: 3.1, delay: 0.5 },
  { w: 1.2, h: 1.1, l: 65, t: 33, o: 0.72, dur: 4.2, delay: 0.3 },
  { w: 1.8, h: 1.6, l: 12, t: 78, o: 0.44, dur: 2.9, delay: 1.2 },
  { w: 2.5, h: 2.2, l: 91, t: 22, o: 0.33, dur: 3.5, delay: 0.8 },
  { w: 1.4, h: 1.3, l: 45, t: 67, o: 0.61, dur: 2.7, delay: 1.5 },
  { w: 1.9, h: 2.0, l: 73, t: 45, o: 0.49, dur: 3.8, delay: 0.1 },
  { w: 2.2, h: 2.1, l: 8, t: 35, o: 0.55, dur: 4.0, delay: 1.7 },
  { w: 1.1, h: 1.5, l: 52, t: 88, o: 0.42, dur: 2.2, delay: 0.6 },
  { w: 1.7, h: 1.8, l: 37, t: 15, o: 0.67, dur: 3.3, delay: 1.0 },
  { w: 2.0, h: 1.9, l: 19, t: 52, o: 0.35, dur: 4.5, delay: 0.4 },
  { w: 1.3, h: 1.4, l: 82, t: 73, o: 0.58, dur: 2.6, delay: 1.3 },
  { w: 2.4, h: 2.3, l: 56, t: 8, o: 0.41, dur: 3.7, delay: 0.9 },
  { w: 1.6, h: 1.2, l: 3, t: 92, o: 0.53, dur: 2.1, delay: 1.8 },
  { w: 1.0, h: 1.1, l: 68, t: 61, o: 0.69, dur: 3.0, delay: 0.2 },
  { w: 2.3, h: 2.5, l: 41, t: 29, o: 0.37, dur: 4.3, delay: 1.1 },
  { w: 1.5, h: 1.7, l: 95, t: 48, o: 0.46, dur: 2.8, delay: 0.7 },
  { w: 1.8, h: 1.6, l: 23, t: 83, o: 0.63, dur: 3.4, delay: 1.4 },
  { w: 2.1, h: 2.0, l: 77, t: 19, o: 0.51, dur: 4.1, delay: 0.0 },
  { w: 1.4, h: 1.3, l: 49, t: 71, o: 0.39, dur: 2.5, delay: 1.6 },
]

export default function RoomSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [shouldRender, setShouldRender] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Preload Spline script early
  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "modulepreload"
    link.href = "https://unpkg.com/@splinetool/viewer@1.12.55/build/spline-viewer.js"
    document.head.appendChild(link)

    return () => { if (link.parentNode) link.parentNode.removeChild(link) }
  }, [])

  // Start rendering Spline when section is near viewport (500px threshold)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true)
          observer.disconnect()
        }
      },
      { rootMargin: "500px 0px" }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // Load the script only when we should render
  useEffect(() => {
    if (!shouldRender) return

    const script = document.createElement("script")
    script.type = "module"
    script.src = "https://unpkg.com/@splinetool/viewer@1.12.55/build/spline-viewer.js"
    document.head.appendChild(script)

    // Mark loaded after a reasonable time for the scene to parse
    const timer = setTimeout(() => setIsLoaded(true), 3000)

    return () => {
      clearTimeout(timer)
      if (script.parentNode) script.parentNode.removeChild(script)
    }
  }, [shouldRender])

  return (
    <section
      id="room"
      ref={sectionRef}
      className="w-full bg-[#0a0a0f] overflow-hidden relative"
      style={{ height: "860px" }}
    >
      {/* Loading overlay - deterministic stars, no hydration mismatch */}
      <div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center transition-opacity duration-1000"
        style={{
          opacity: isLoaded ? 0 : 1,
          pointerEvents: isLoaded ? "none" : "auto",
          background: "radial-gradient(ellipse at center, #12121f 0%, #0a0a0f 70%)",
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          {STARS.map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-[#ffffff]"
              style={{
                width: `${s.w}px`,
                height: `${s.h}px`,
                left: `${s.l}%`,
                top: `${s.t}%`,
                opacity: s.o,
                animation: `roomPulse ${s.dur}s ease-in-out infinite`,
                animationDelay: `${s.delay}s`,
              }}
            />
          ))}
        </div>

        <div className="relative mb-6">
          <div
            className="w-12 h-12 rounded-full border-2 border-[#ffffff10] border-t-[#ffffff40]"
            style={{ animation: "roomSpin 1.5s linear infinite" }}
          />
        </div>

        <p
          className="text-[#ffffff50] text-sm font-mono tracking-[0.3em] uppercase"
          style={{ animation: "roomPulse 2s ease-in-out infinite" }}
        >
          Entering Room...
        </p>
      </div>

      {/* Spline viewer - only mount when near viewport */}
      <div className="w-full h-full transition-opacity duration-1000" style={{ opacity: shouldRender ? 1 : 0 }}>
        {shouldRender && (
          // @ts-ignore
          <spline-viewer
            url="https://prod.spline.design/1OZJYDsbsH722tFs/scene.splinecode"
            style={{ width: "100%", height: "100%", display: "block" }}
          />
        )}
      </div>

      {/* Mobile hint: two-finger drag */}
      <p
        className="absolute bottom-4 left-0 right-0 text-center text-[#ffffff50] font-mono md:hidden z-20 pointer-events-none"
        style={{ fontSize: "12px", animation: "roomPulse 3s ease-in-out infinite" }}
      >
        Use two fingers to drag the room
      </p>

      <style jsx>{`
        @keyframes roomSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes roomPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  )
}
