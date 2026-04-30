"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowUp } from "lucide-react"
import Navbar from "@/components/navbar"

const sections = [
  { id: "overview", label: "OVERVIEW" },
  { id: "context", label: "CONTEXT" },
  { id: "more", label: "MORE" },
]

const metadata = [
  { label: "TIMELINE", value: "Jan 2026 - Present" },
  { label: "ROLE", value: "Founding Designer" },
  { label: "TEAM", value: "Dev & Design: Just Me\nClub Members: 20+ Students" },
  { label: "TOOLS", value: "Claude Code\nFigma\nV0" },
]

export default function ColumbiaHCIReviewCaseStudy() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("overview")
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: "-20% 0px -60% 0px" }
    )

    sections.forEach(({ id }) => {
      const el = sectionRefs.current[id]
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-[#FDFBFA]">
      <Navbar />

      <div className="flex pt-[60px]">
        <aside className="hidden md:flex fixed left-0 top-[60px] bottom-0 w-[180px] flex-col justify-between py-8 pl-[30px] pr-4 z-40">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5 font-mono text-[13px] text-[#474747] hover:text-[#000000] transition-colors mb-6 tracking-[0.05em]"
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
              HOME
            </button>

            {sections.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`font-mono text-[13px] text-left py-1.5 transition-colors tracking-[0.05em] ${
                  activeSection === id
                    ? "text-[#474747]"
                    : "text-[#b0aeab] hover:text-[#808080]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 font-mono text-[13px] text-[#b0aeab] hover:text-[#474747] transition-colors tracking-[0.05em]"
          >
            <ArrowUp size={14} strokeWidth={1.5} />
            BACK TO TOP
          </button>
        </aside>

        <main className="flex-1 md:ml-[180px] px-5 md:px-[200px] pb-24">
          {/* Hero cover image - breaks out of padding */}
          <div className="overflow-hidden mt-4 mb-12 -mx-5 md:-mx-[200px]">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%2011%20%281%29-w47aUzGMwXkxfzVBCpJH92TtNnk0La.png"
              alt="Columbia HCI Review"
              className="w-full"
            />
          </div>

          <h1
            className="text-[#474747] text-[28px] md:text-[36px] leading-[1.3] mb-8"
            style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
          >
            Building the Visual Identity for{" "}
            <a
              href="https://ctpreview.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#38BDF8] no-underline hover:opacity-70 transition-opacity"
            >
              Columbia HCI Review
            </a>
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {metadata.map(({ label, value }) => (
              <div key={label}>
                <p className="font-mono text-[13px] text-[#38BDF8] tracking-[0.1em] mb-2">
                  {label}
                </p>
                <p className="text-[15px] text-[#6b6966] leading-relaxed whitespace-pre-line" style={{ fontFamily: "'SF Pro', -apple-system, system-ui, sans-serif" }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* OVERVIEW */}
          <section
            id="overview"
            ref={(el) => { sectionRefs.current["overview"] = el }}
            className="mb-20 scroll-mt-24"
          >
            <p className="font-mono text-[13px] text-[#38BDF8] tracking-[0.15em] mb-4">
              OVERVIEW
            </p>
            <h2
              className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4"
              style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
            >
              {"Columbia's first student-led Human-Computer Interaction publication."}
            </h2>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed">
              {"The HCI Review is a biannual independent review journal focused on human-computer interaction and emerging technology. Rooted in Columbia University's global perspective, we conduct in-depth analyses of HCI evolution and product analysis. The HCI Review is committed to providing readers with an outlier mode of thinking that allows us to navigate the post-AI era."}
            </p>
          </section>

          {/* CONTEXT */}
          <section
            id="context"
            ref={(el) => { sectionRefs.current["context"] = el }}
            className="mb-20 scroll-mt-24"
          >
            <p className="font-mono text-[13px] text-[#38BDF8] tracking-[0.15em] mb-4">
              CONTEXT
            </p>
            <h2
              className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4"
              style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
            >
              A new publication needs a strong visual voice.
            </h2>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed">
              {"As a brand-new publication, Columbia HCI Review needed a cohesive visual identity that communicates academic rigor while remaining approachable. As the sole designer and developer, I created everything from the magazine cover and website to social media templates and promotional posters."}
            </p>

            {/* Magazine cover */}
            <div className="w-full overflow-hidden mt-8 mx-auto" style={{ maxWidth: "900px" }}>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%2011%20%283%29.png-vn4K5GR43Q2uFtIRZqGMEOnh6DeAal.jpeg"
                alt="Columbia HCI Review - Inaugural Issue Magazine Cover"
                className="w-full"
              />
            </div>

          </section>

          {/* MORE */}
          <section
            id="more"
            ref={(el) => { sectionRefs.current["more"] = el }}
            className="mb-20 scroll-mt-24"
          >
            <p className="font-mono text-[13px] text-[#38BDF8] tracking-[0.15em] mb-4">
              MORE
            </p>

            {/* Website first */}
            <h2
              className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4"
              style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
            >
              The website.
            </h2>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-2">
              {"I vibe-coded the CHR website using Claude Code and V0 -- iterating on layout and typography entirely through prompts. The site includes a working submission form so contributors can pitch article ideas directly, plus issue archives, contributor guidelines, and an about page."}
            </p>
            <a
              href="https://ctpreview.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#38BDF8] no-underline hover:opacity-70 transition-opacity text-[14px] font-mono tracking-wider"
            >
              ctpreview.com
            </a>
            <div className="w-full overflow-hidden mt-6 mx-auto" style={{ maxWidth: "900px" }}>
              <video
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CTI%20website-lKntpdtm9I6JMKAZNh032op6ThH8zU.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full"
              />
            </div>

            {/* Social media */}
            <h2
              className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4 mt-16"
              style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
            >
              Social media & promotional materials.
            </h2>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed">
              {"A series of Instagram cards for \"5 Industries Defining the Future\" and the \"Call For Submissions\" poster for the inaugural issue, used across campus and online to recruit contributors for Spring 2026."}
            </p>

            {/* Social media cards */}
            <div className="w-full overflow-hidden mt-8 mx-auto" style={{ maxWidth: "900px" }}>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%2012%20%282%29-3NV7wg7NM1BghpBBQcEmZFq68seaNC.png"
                alt="Columbia HCI Review - Instagram Social Media Cards"
                className="w-full"
              />
            </div>

            {/* Poster */}
            <div className="w-full overflow-hidden mt-8 mx-auto" style={{ maxWidth: "900px" }}>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%2013%20%284%29-evxTqjZOL5y6RFX0dxXH7dAIPkbt15.png"
                alt="Columbia HCI Review - Call For Submissions Poster"
                className="w-full"
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
