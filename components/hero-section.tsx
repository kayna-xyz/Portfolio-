"use client"

import { useState, useEffect } from "react"
import { Instagram, Linkedin, Mail } from "lucide-react"

const SF = "-apple-system, 'SF Pro Text', 'SF Pro Display', sans-serif"

function XIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16H20L8.267 4H4z" />
      <path d="M4 20l6.768-6.768" />
      <path d="M20 4l-6.768 6.768" />
    </svg>
  )
}

const SOCIAL = [
  { href: "https://x.com/kayna_xyz",                          label: "X",         icon: <XIcon size={24} /> },
  { href: "https://www.instagram.com/kaynahuang/",            label: "Instagram",  icon: <Instagram size={24} strokeWidth={1.5} /> },
  { href: "https://www.linkedin.com/in/kayna-h-77ab8a2a1/",  label: "LinkedIn",   icon: <Linkedin  size={24} strokeWidth={1.5} /> },
  { href: "mailto:kh3443@barnard.edu",                        label: "Email",      icon: <Mail      size={24} strokeWidth={1.5} /> },
]

export default function HeroSection() {
  const [nyTime, setNyTime] = useState("")
  const ROLES = ["Product Designer", "Design Engineer", "Builder"]
  const [roleIdx, setRoleIdx]       = useState(0)
  const [roleVisible, setRoleVisible] = useState(true)

  // Role cycling — snap out then snap in every 2s
  useEffect(() => {
    const id = setInterval(() => {
      setRoleVisible(false)
      setTimeout(() => {
        setRoleIdx((i) => (i + 1) % ROLES.length)
        setRoleVisible(true)
      }, 150)
    }, 2000)
    return () => clearInterval(id)
  }, [])

  // Live Manhattan clock — updates every second with H:M:S
  useEffect(() => {
    const update = () => {
      setNyTime(
        new Date().toLocaleString("en-US", {
          timeZone: "America/New_York",
          weekday: "short",
          month:   "short",
          day:     "numeric",
          hour:    "2-digit",
          minute:  "2-digit",
          second:  "2-digit",
          hour12:  false,
        })
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      id="about"
      className="relative w-full bg-[#FDFBFA] px-[30px] md:px-[80px]"
      style={{ paddingTop: "140px", paddingBottom: "48px" }}
    >
      {/* Description */}
      <div className="animate-fog-clear relative">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "12px" }}>
          <p style={{ fontFamily: SF, fontWeight: 500, fontSize: "24px", lineHeight: "1.3", color: "#000000" }}>
            Kayna Huang
          </p>
          <p style={{ fontFamily: "var(--font-pt-serif), 'Georgia', serif", fontWeight: 400, fontSize: "24px", lineHeight: "1.4", color: "#000000" }}>
            {"I'm a "}
            <span
              style={{
                fontStyle: "italic",
                display: "inline-block",
                opacity: roleVisible ? 1 : 0,
                transition: "opacity 0.1s",
              }}
            >
              {ROLES[roleIdx]}
            </span>
            {" currently studying Human-Computer Interaction & Political Science at Columbia."}
            <br />
            {"Craft with and beyond intelligence, to renew what already exists."}
          </p>
        </div>
      </div>

      {/* Social media icon bar */}
      <div className="animate-fog-clear-delay flex items-center gap-4" style={{ marginTop: "24px" }}>
        {SOCIAL.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.href.startsWith("mailto") ? undefined : "_blank"}
            rel={item.href.startsWith("mailto")  ? undefined : "noopener noreferrer"}
            className="relative text-[#b0aeab] hover:text-[#474747] transition-colors group"
            aria-label={item.label}
          >
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

      {/* Hero video — 40px below description, full width within padding */}
      <div style={{ marginTop: "40px" }}>
        <video
          src="/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{ width: "100%", display: "block" }}
        />
      </div>

      {/* What is design? — centered */}
      <p style={{ marginTop: "6px", fontFamily: SF, fontWeight: 400, fontSize: "16px", color: "#000000", textAlign: "center", width: "100%" }}>
        What is design?
      </p>

      {/* Info bar — labels Medium, values Regular */}
      <div style={{ marginTop: "24px" }}>
        {[
          { label: "FOCUS",        value: "Design/Build, 0-1 AI-native scalable product" },
          { label: "IN MANHATTAN", value: nyTime },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px", padding: "12px 0", flexWrap: "wrap" }}>
            <span style={{ fontFamily: SF, fontWeight: 500, fontSize: "16px", color: "#4B4948" }}>{label}</span>
            <span style={{ fontFamily: SF, fontWeight: 400, fontSize: "16px", color: "#000000" }}>{value}</span>
          </div>
        ))}
      </div>

    </section>
  )
}
