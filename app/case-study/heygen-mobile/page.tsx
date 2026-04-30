"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowUp } from "lucide-react"
import Navbar from "@/components/navbar"

const sections = [
  { id: "overview", label: "OVERVIEW" },
  { id: "context", label: "CONTEXT" },
  { id: "the-problem", label: "THE PROBLEM" },
  { id: "solution", label: "SOLUTION" },
  { id: "the-outcome", label: "THE OUTCOME" },
]

const metadata = [
  { label: "TIMELINE", value: "2 Months" },
  { label: "ROLE", value: "Product Design Intern" },
  { label: "TEAM", value: "Tiffany Huang (Product Designer + PM)" },
  { label: "TOOLS", value: "Figma" },
]

export default function HeyGenMobileCaseStudy() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("overview")
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
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
        {/* Left sidebar navigation */}
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

        {/* Main content - no cover for this page */}
        <main className="flex-1 md:ml-[180px] px-5 md:px-[200px] pb-24 pt-12">

          {/* Project title */}
          <h1
            className="text-[#474747] text-[28px] md:text-[36px] leading-[1.3] mb-8"
            style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
          >
            Crafting an On-the-Go AI Video Editing Experience for{" "}
            <a
              href="https://apps.apple.com/us/app/heygen-ai-video-generator/id6711356409"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF8EAE] no-underline hover:opacity-70 transition-opacity"
            >
              HeyGen Mobile
            </a>
          </h1>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {metadata.map(({ label, value }) => (
              <div key={label}>
                <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.1em] mb-2">
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
            <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.15em] mb-4">
              OVERVIEW
            </p>
            <h2
              className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4"
              style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
            >
              From desktop powerhouse to pocket studio.
            </h2>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed">
              {"HeyGen Mobile is a consumer-focused AI video creation app that lets creators and small businesses turn scripts, photos, and short clips into publish-ready AI videos directly on their phones. I co-designed and optimized the core navigation, Video Studio color editor, and captions experience, aiming to shorten the time from \u201Copen the app\u201D to \u201Cpublishable video\u201D while keeping the experience friendly to non-experts."}
            </p>
          </section>

          {/* CONTEXT */}
          <section
            id="context"
            ref={(el) => { sectionRefs.current["context"] = el }}
            className="mb-20 scroll-mt-24"
          >
            <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.15em] mb-4">
              CONTEXT
            </p>
            <h2
              className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4"
              style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
            >
              Consumer user research & competitive landscape.
            </h2>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-4">
              {"I worked with 1 product designer, Tiffany Huang, who also served as the product manager, to review past user interviews -- feedback from creators at companies of various sizes, freelancers, and everyday consumers. Simultaneously, we benchmarked navigation structures, color grading workflows, and captioning tool models of leading mobile media editors like CapCut, Captions, and Hypic."}
            </p>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-4">
              {"Key findings:"}
            </p>
            <ul className="text-[15px] text-[#9e9b98] leading-relaxed list-disc pl-6 mb-4 flex flex-col gap-2">
              <li>{"HeyGen\u2019s clear strengths lie in AI digital avatars, video translation, and text-to-video -- but these are desktop-first features."}</li>
              <li>{"Competitors are rapidly extending advanced features to mobile (professional color grading, systematic subtitle templates), making \u201Ccreating finished videos solely on mobile\u201D the norm."}</li>
              <li>{"Even HeyGen\u2019s consumer product prioritizes small business owners -- the goal is enabling PC users to complete the workflow from draft to finished video on mobile, anytime."}</li>
            </ul>

            {/* Competitive audit -- half pic / half summary */}
            <div className="flex flex-col md:flex-row gap-6 mt-8 items-start">
              <div
                className="md:w-1/2 shrink-0 relative group overflow-hidden cursor-pointer"
                style={{ maxHeight: "220px" }}
                onClick={() => setLightboxSrc("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20145-LuONtjwHeLBDCKlU2QS5VFKflTMbAq.png")}
                role="button"
                tabIndex={0}
                aria-label="View full competitive audit table"
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20145-LuONtjwHeLBDCKlU2QS5VFKflTMbAq.png"
                  alt="Competitive audit table: HeyGen vs CapCut vs Captions vs Hypic"
                  className="w-full"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                  <span className="font-mono text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 tracking-wider">View</span>
                </div>
              </div>
              <div className="md:w-1/2 flex flex-col gap-3">
                <p className="text-[11px] font-mono text-[#FF8EAE] tracking-wider uppercase">Competitive Audit</p>
                <p className="text-[15px] text-[#9e9b98] leading-relaxed">
                  {"Benchmarked HeyGen against CapCut, Captions, and Hypic across navigation, color grading, captioning, AI features, and end-to-end mobile workflow."}
                </p>
                <p className="text-[15px] text-[#9e9b98] leading-relaxed">
                  {"HeyGen\u2019s moat: lip-sync video translation, streaming-grade avatars, and 40+ language subtitle export -- unmatched by any competitor."}
                </p>
                <p className="text-[15px] text-[#9e9b98] leading-relaxed">
                  {"Gaps to close: 3\u20134 taps to core features (vs 1\u20132), limited color grading, thin subtitle templates, and desktop-dependent publish workflow."}
                </p>
              </div>
            </div>
          </section>

          {/* THE PROBLEM */}
          <section
            id="the-problem"
            ref={(el) => { sectionRefs.current["the-problem"] = el }}
            className="mb-20 scroll-mt-24"
          >
            <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.15em] mb-4">
              THE PROBLEM
            </p>
            <h2
              className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4"
              style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
            >
              Two core UX friction points.
            </h2>

            <div className="flex flex-col gap-8">
              {/* Problem 1 */}
              <div className="flex gap-4">
                <span className="text-[28px] md:text-[36px] text-[#FF8EAE] font-mono leading-none shrink-0" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>1</span>
                <div>
                  <h3 className="text-[#474747] text-[18px] mb-2" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
                    Navigation bar lacks clear functional modules
                  </h3>
                  <p className="text-[15px] text-[#9e9b98] leading-relaxed">
                    {"The homepage navigation features a complex UX with no clear hierarchy, causing users to experience fatigue from repetitive steps and potentially abandon the process midway. High-frequency functions need to be rearranged based on data so users can quickly access their tasks."}
                  </p>
                </div>
              </div>

              {/* Problem 2 */}
              <div className="flex gap-4">
                <span className="text-[28px] md:text-[36px] text-[#FF8EAE] font-mono leading-none shrink-0" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>2</span>
                <div>
                  <h3 className="text-[#474747] text-[18px] mb-2" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
                    Color selection lacks flexibility
                  </h3>
                  <p className="text-[15px] text-[#9e9b98] leading-relaxed">
                    {"The Video Studio color editor provides limited selection options, forcing users into workarounds. Editing video backgrounds requires too many steps and decisions compared to industry-standard tools."}
                  </p>
                </div>
              </div>
            </div>

          </section>

          {/* SOLUTION */}
          <section
            id="solution"
            ref={(el) => { sectionRefs.current["solution"] = el }}
            className="mb-20 scroll-mt-24"
          >
            <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.15em] mb-4">
              SOLUTION
            </p>

            {/* Solution 1: Navigation Bar */}
            <div className="mb-16">
              <h2
                className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4"
                style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
              >
                {"1. Navigation Bar: From feature list to task-first hub"}
              </h2>
              <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-4">
                {"I collaborated with senior designers to develop multiple navigation proposals, organize reviews, and drive the selection of the final direction. We reorganized the homepage hierarchy based on HEX data."}
              </p>
              <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-2 font-medium" style={{ color: "#6b6966" }}>
                Process:
              </p>
              <ul className="text-[15px] text-[#9e9b98] leading-relaxed list-disc pl-6 mb-6 flex flex-col gap-2">
                <li>{"Used a mind map to organize the current UX, calculating required steps and decision points separately."}</li>
                <li>{"Collaborated with the PM to cluster existing features based on \u201CARR potential \u00D7 usage frequency.\u201D"}</li>
                <li>{"Designated creation and editing-related modules as top-priority, while downgrading account and settings modules to secondary entry points."}</li>
              </ul>

              {/* Navigation bar video - fixed width, natural height */}
              <div className="w-full overflow-hidden mt-4 mx-auto" style={{ maxWidth: "900px" }}>
                <video
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mobilenavi-flNVPbRymN8ldyYs0abpOO33xH7TkJ.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full"
                />
              </div>
            </div>

            {/* Solution 2: Color Editor */}
            <div className="mb-8">
              <h2
                className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4"
                style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
              >
                {"2. Video Studio \u2013 Color Editor"}
              </h2>
              <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-4">
                {"I redesigned the color picker, referencing the design from widely acclaimed mobile editors like Hypic. I considered multiple design options and modified the picker to align with HeyGen\u2019s unique product features."}
              </p>
              <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-2 font-medium" style={{ color: "#6b6966" }}>
                Process:
              </p>
              <ul className="text-[15px] text-[#9e9b98] leading-relaxed list-disc pl-6 mb-6 flex flex-col gap-2">
                <li>{"Benchmarked color picker patterns across Hypic, CapCut, and native iOS tools."}</li>
                <li>{"Explored multiple design directions, from simple preset palettes to full HSB sliders."}</li>
                <li>{"Tailored the final design to balance flexibility with HeyGen\u2019s non-expert user base."}</li>
              </ul>

              {/* Color picker video - fixed width, natural height */}
              <div className="w-full overflow-hidden mt-4 mx-auto" style={{ maxWidth: "900px" }}>
                <video
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mobilecolor-55icN1MdXqdnZb92HbuZdPrqed80IV.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full"
                />
              </div>

            </div>
          </section>

          {/* THE OUTCOME */}
          <section
            id="the-outcome"
            ref={(el) => { sectionRefs.current["the-outcome"] = el }}
            className="mb-20 scroll-mt-24"
          >
            <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.15em] mb-4">
              THE OUTCOME
            </p>
            <h2
              className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4"
              style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
            >
              Measurable impact on the mobile product with the team.
            </h2>

            <div className="flex flex-col gap-6 mb-8">
              <div className="flex items-baseline gap-4">
                <span className="text-[28px] md:text-[36px] text-[#FF8EAE] font-mono leading-none shrink-0" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>{"\u2191"}</span>
                <div>
                  <p className="text-[#474747] text-[18px] mb-1" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
                    Navigation: Fewer steps, clearer feature visibility
                  </p>
                  <p className="text-[15px] text-[#9e9b98] leading-relaxed">
                    {"The number of steps required for users to make decisions has significantly decreased. Core features are now clearly visible, driving conversions for ARR."}
                  </p>
                </div>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-[28px] md:text-[36px] text-[#FF8EAE] font-mono leading-none shrink-0" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>{"\u2193"}</span>
                <div>
                  <p className="text-[#474747] text-[18px] mb-1" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
                    Faster editing decisions in color picker
                  </p>
                  <p className="text-[15px] text-[#9e9b98] leading-relaxed">
                    {"When editing video backgrounds, users experience at least a 30% reduction in the time required to make editing decisions."}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-6">
              {"The HeyGen Mobile app launched on the "}
              <a
                href="https://apps.apple.com/us/app/heygen-ai-video-generator/id6711356409"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF8EAE] no-underline hover:opacity-70 transition-opacity"
              >
                iOS App Store
              </a>
              {", bringing AI video creation to mobile users worldwide."}
            </p>

            <div className="border-t border-[#eae8e6] pt-8 mt-8">
              <p className="text-[15px] text-[#9e9b98] leading-relaxed">
                {"Special thanks to Tiffany Huang -- PD & PM -- for driving this project forward. Your clarity on product direction and user priorities made this collaboration a rewarding one."}
              </p>
            </div>
          </section>
        </main>
      </div>

      {/* Lightbox overlay */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-zoom-out"
          onClick={() => setLightboxSrc(null)}
          role="dialog"
          aria-label="Image preview"
        >
          <img
            src={lightboxSrc}
            alt="Full-size preview"
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="absolute top-6 right-6 text-white/70 hover:text-white text-2xl font-mono bg-transparent border-0 cursor-pointer"
            onClick={() => setLightboxSrc(null)}
            aria-label="Close preview"
          >
            {"x"}
          </button>
        </div>
      )}
    </div>
  )
}
