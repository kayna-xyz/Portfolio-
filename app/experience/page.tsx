"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"

const SF = "-apple-system, 'SF Pro Text', 'SF Pro Display', sans-serif"
const PT = "var(--font-pt-serif), 'Georgia', serif"

const title = (text: string) => (
  <h2 style={{ fontFamily: SF, fontWeight: 500, fontSize: "24px", color: "#000000", marginBottom: "12px" }}>
    {text}
  </h2>
)

const body = (text: string | React.ReactNode, extraStyle?: React.CSSProperties) => (
  <p style={{ fontFamily: PT, fontWeight: 400, fontSize: "16px", color: "#000000", lineHeight: "1.65", marginBottom: "16px", ...extraStyle }}>
    {text}
  </p>
)

export default function AboutPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="relative min-h-screen bg-[#fdfbfa]">
      <Navbar />

      {/* 3-column grid — content lives in the middle column */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 px-[30px] md:px-[80px]"
        style={{
          paddingTop: "120px",
          paddingBottom: "120px",
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
        }}
      >
        {/* Left column — empty, hidden on mobile */}
        <div className="hidden md:block" />

        {/* Middle column — all content */}
        <div>

          {/* ── Design ── */}
          <section style={{ marginBottom: "40px" }}>
            {title("Design")}
            {body("I'm a generalist designer with a solid foundation in craft, product thinking, and design engineering. What I pursue in my work is solving ambiguous product problems through a quantitative, human-centered approach, and pushing the frontier of what AI-native products can feel like.")}
            {body("My intuition comes from somewhere older than school's design class. From the moment I could hold a pen, 8 years old, I started making art, oil painting, sketching, and 6 years of ink wash painting and calligraphy. I think that's where my aesthetic sensibility comes from, and maybe it's also what lets me sit with a design for 10 hours.")}
            {body("I'm pursuing a dual degree in Cognitive Science (HCI) and Political Science at Columbia University. I worked at an AI unicorn, contributing to the design of their enterprise and consumer AI products. At the same time, I started building my own agentic products.")}
            {body("Even though Claude can design, it still doesn't change the core work of a designer. Iykyk.")}
          </section>

          {/* ── Beyond Design ── */}
          <section style={{ marginBottom: "40px" }}>
            {title("Beyond Design")}
            {body("I was born into a manufacturer family in China and educated in the U.S. I'm a builder and my long-term interests is in sustainable tech business, including agentic applications, infra, and AI/robotics upstream supply chain. Outside of work, I like playing poker, arts, trading, and talking to interesting people.")}
            {body(
              <>
                Thanks to my friends, Bo Le
                <sup style={{ fontSize: "11px", verticalAlign: "super" }}>1</sup>
                , and my parents for believing in me.
              </>
            )}
          </section>

          {/* ── Footnote ── */}
          <div style={{ marginTop: "180px" }}>
            <p style={{ fontFamily: PT, fontWeight: 400, fontSize: "14px", color: "#000000", lineHeight: "1.6" }}>
              <sup style={{ fontSize: "11px" }}>1</sup>
              {" Bo Le: In Chinese, 伯乐 (Bó Lè) refers to someone who recognizes another person's potential and gives them the opportunity to flourish."}
            </p>
          </div>

        </div>

        {/* Right column — empty, hidden on mobile */}
        <div className="hidden md:block" />
      </div>
    </main>
  )
}
