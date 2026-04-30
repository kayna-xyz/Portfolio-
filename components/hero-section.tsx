"use client"

import { useState, useEffect, useRef } from "react"
import { Instagram, Linkedin, Mail } from "lucide-react"

/* Custom X (formerly Twitter) icon */
function XIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4l11.733 16H20L8.267 4H4z" />
      <path d="M4 20l6.768-6.768" />
      <path d="M20 4l-6.768 6.768" />
    </svg>
  )
}

const TRAIL_LENGTH = 6

export default function HeroSection() {
  const introRef = useRef<HTMLDivElement>(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([])
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const el = introRef.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const pos = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      setCursorPos(pos)
      setTrail((prev) => [pos, ...prev].slice(0, TRAIL_LENGTH))
    }
    const onEnter = () => {
      setIsHovering(true)
      document.body.classList.add("hide-custom-cursor")
    }
    const onLeave = () => {
      setIsHovering(false)
      setTrail([])
      document.body.classList.remove("hide-custom-cursor")
    }

    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseenter", onEnter)
    el.addEventListener("mouseleave", onLeave)
    return () => {
      el.removeEventListener("mousemove", onMove)
      el.removeEventListener("mouseenter", onEnter)
      el.removeEventListener("mouseleave", onLeave)
      document.body.classList.remove("hide-custom-cursor")
    }
  }, [])

  return (
    <section
      id="about"
      className="relative w-full bg-[#FDFBFA] pt-[100px] md:pt-[140px] px-5 md:px-[70px]"
      style={{ paddingBottom: "48px" }}
    >
      {/* Intro text with fog-clearing animation + cursor blur */}
      <div
        ref={introRef}
        className="animate-fog-clear relative"
        data-cursor-label="Who am I"
        style={{ cursor: isHovering ? "none" : undefined }}
      >
        <h1
          className="text-[#5F5F5F] leading-[1.3] tracking-[-0.01em] relative text-[28px] md:text-[40px]"
          style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
        >
          {"Hi! I'm Kayna, a product designer "}
          <em style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif", fontStyle: "italic", fontWeight: "inherit" }}>{"who vibe codes"}</em>
          {", AI-native, business-driven, and build things from scratch. Based in Manhattan & SF, studying Cog Sci & Poli Sci at Columbia."}
        </h1>

        {/* Trailing glow ghosts */}
        {isHovering && trail.map((pos, i) => (
          <div
            key={i}
            className="pointer-events-none absolute z-10"
            style={{
              left: pos.x - 80,
              top: pos.y - 80,
              width: 160,
              height: 160,
              borderRadius: "50%",
              background: `rgba(245, 245, 245, ${0.3 - i * 0.04})`,
              filter: `blur(${50 + i * 10}px)`,
              transition: "left 0.15s ease-out, top 0.15s ease-out, opacity 0.3s ease-out",
            }}
          />
        ))}

        {/* Main cursor glow blob - in front of text */}
        {isHovering && (
          <div
            className="pointer-events-none absolute z-10"
            style={{
              left: cursorPos.x - 100,
              top: cursorPos.y - 100,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "#F5F5F5",
              filter: "blur(50px)",
            }}
          />
        )}
      </div>

      {/* Social media icons - grey, minimal, 24x24, tooltip on hover */}
      <div className="animate-fog-clear-delay flex items-center gap-4" style={{ marginTop: "30px" }}>
        {[
          { href: "https://x.com/kayna_xyz", label: "X", icon: <XIcon size={24} /> },
          { href: "https://www.instagram.com/kaynahuang/", label: "Instagram", icon: <Instagram size={24} strokeWidth={1.5} /> },
          { href: "https://www.linkedin.com/in/kayna-h-77ab8a2a1/", label: "LinkedIn", icon: <Linkedin size={24} strokeWidth={1.5} /> },
          { href: "mailto:kh3443@barnard.edu", label: "Email", icon: <Mail size={24} strokeWidth={1.5} /> },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.label === "Email" ? undefined : "_blank"}
            rel={item.label === "Email" ? undefined : "noopener noreferrer"}
            className="relative text-[#b0aeab] hover:text-[#474747] transition-colors group"
            aria-label={item.label}
          >
            {/* Tooltip */}
            <span
              className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1 rounded-full text-xs font-mono text-[#5F5F5F] bg-[#ffffff] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #eae8e6" }}
            >
              {item.label}
            </span>
            {item.icon}
          </a>
        ))}
      </div>
    </section>
  )
}
