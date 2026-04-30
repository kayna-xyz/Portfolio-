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
  { label: "TIMELINE", value: "36 Hours" },
  { label: "ROLE", value: "Designer & Engineer" },
  { label: "TEAM", value: "just me" },
  { label: "TOOLS", value: "Claude Code" },
]

export default function Signal32CaseStudy() {
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
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20144-p8bsVoGWZeNA5zhS7MrEnHWJGRLE0T.png"
              alt="Signal-32"
              className="w-full object-cover"
              style={{ aspectRatio: "1500/460" }}
            />
          </div>

          <h1
            className="text-[#474747] text-[28px] md:text-[36px] leading-[1.3] mb-8"
            style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
          >
            <a
              href="https://claude.ai/public/artifacts/6fc90c85-daf1-40fa-ac29-2a33b5b1939b"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F97316] no-underline hover:opacity-70 transition-opacity"
            >
              Signal-32
            </a>
            {": Assess Your Next Investment in 32 Questions"}
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {metadata.map(({ label, value }) => (
              <div key={label}>
                <p className="font-mono text-[13px] text-[#F97316] tracking-[0.1em] mb-2">
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
            <p className="font-mono text-[13px] text-[#F97316] tracking-[0.15em] mb-4">
              OVERVIEW
            </p>
            <h2
              className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4"
              style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
            >
              Prove your gut feeling.
            </h2>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed">
              {"Signal-32 helps angel investors quickly assess the potential of AI startups through a 32-question quantitative framework, benchmarked against early-stage data from 24 successful AI companies. The tool adheres to the philosophy of \"investing in people\" -- the questions are designed drawing from the experience of Sequoia Capital, Benchmark, and other firms, focusing on the founding team itself. For reference only, not investment advice."}
            </p>
          </section>

          {/* CONTEXT */}
          <section
            id="context"
            ref={(el) => { sectionRefs.current["context"] = el }}
            className="mb-20 scroll-mt-24"
          >
            <p className="font-mono text-[13px] text-[#F97316] tracking-[0.15em] mb-4">
              CONTEXT
            </p>
            <h2
              className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4"
              style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
            >
              {"Do you need an internal tool to quickly validate your intuition?"}
            </h2>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed">
              {"I developed Signal-32, which compiles mainstream VC evaluation criteria for AI startups -- team background, research depth, product execution, data and distribution, and AI competitive advantages -- enabling anyone to swiftly assess whether the person in front of you is worth investing in."}
            </p>
            {/* Investment Decision Mind Map */}
            <div className="w-full overflow-hidden mt-8 mx-auto" style={{ maxWidth: "900px" }}>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-02-25%20at%2021.42.15-f97GOJiNgZSjQh8b7REfuEWt22IdRp.png"
                alt="Investment Decision Mind Map - 4 branches: Team Background, Founder Profile, Product, Operations with 32 total factors"
                className="w-full"
              />
            </div>
            <p className="text-[13px] text-[#b0aeab] mt-3 italic" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
              Mind map: brainstorming the 32 factors that shape an investment decision across four dimensions.
            </p>
          </section>

          {/* THE PROBLEM */}
          <section
            id="the-problem"
            ref={(el) => { sectionRefs.current["the-problem"] = el }}
            className="mb-20 scroll-mt-24"
          >
            <p className="font-mono text-[13px] text-[#F97316] tracking-[0.15em] mb-4">
              THE PROBLEM
            </p>
            <h2
              className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4"
              style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
            >
              {"Strong intuition, weak calibration."}
            </h2>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-6">
              {"The issue isn't that investors can't make judgments -- anyone engaging in AI-native primary market investments needs a tool to validate their intuition:"}
            </p>
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex gap-3">
                <span className="text-[#F97316] font-mono text-[14px] shrink-0">01</span>
                <p className="text-[15px] text-[#6b6966] leading-relaxed">
                  {"Each evaluation starts from scratch, resulting in high cognitive load and difficulty maintaining consistent standards."}
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-[#F97316] font-mono text-[14px] shrink-0">02</span>
                <p className="text-[15px] text-[#6b6966] leading-relaxed">
                  {"It's challenging to place a specific team within a \"larger sample space\" for assessment, leading to strong intuition but weak calibration."}
                </p>
              </div>
            </div>
          </section>

          {/* SOLUTION */}
          <section
            id="solution"
            ref={(el) => { sectionRefs.current["solution"] = el }}
            className="mb-20 scroll-mt-24"
          >
            <p className="font-mono text-[13px] text-[#F97316] tracking-[0.15em] mb-4">
              SOLUTION
            </p>

            {/* Step 1 */}
            <h2
              className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4"
              style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
            >
              {"Step 1. A 32-question assessment framework"}
            </h2>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-4">
              {"I extracted investment insights from VC literature and blogs, then condensed them into four major dimensions. Each dimension contains eight questions, totaling 32 quantitative questions scored on a 1-5 point scale -- minimizing vague adjectives. Each question maps to a specific piece of publicly available information (founder's thesis, GitHub commits, early customer case studies), reducing purely subjective scoring."}
            </p>
            {/* Example questions video */}
            <div className="w-full overflow-hidden mt-6 mx-auto" style={{ maxWidth: "900px" }}>
              <video
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/questionssignal-32-o36zN85INFxhe8l4sQs1dpmyiN8VgM.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full object-cover"
                style={{ aspectRatio: "900/600" }}
              />
            </div>
            <p className="text-[13px] text-[#b0aeab] mt-3 italic" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
              Sample questions from the Team Background section of the assessment framework.
            </p>

            {/* Step 2 */}
            <h2
              className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4 mt-16"
              style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
            >
              {"Step 2. Excellence comes from comparison"}
            </h2>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-4">
              {"I selected 24 AI-native companies that demonstrated outstanding early performance -- spanning model layers, application layers, and infrastructure. Using only publicly available information from their early stages, I applied the same 32-question assessment to each founding team and product. This yielded a distribution of \"success samples\": identifying which dimensions consistently scored high, where significant variations occurred, and which combinations showed strong correlations."}
            </p>
            <p className="text-[15px] text-[#6b6966] leading-relaxed mb-4" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
              {"A raw score in isolation is meaningless. A team scoring 4.2 tells you nothing -- but a team scoring 4.2 when the benchmark median is 4.6 tells you everything. The value of the benchmark table lies not in the numbers themselves, but in the context they create for comparison."}
            </p>
            {/* Benchmark scores table */}
            <div className="w-full overflow-hidden mt-6 mx-auto" style={{ maxWidth: "900px" }}>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-02-25%20at%2021.44.28-lWe8IzsNmXkGrfw1bQZ4gQQd1u4wnh.png"
                alt="24 Sample Company Scores - benchmark table showing Team, Founder, Product, Ops, and Total scores for companies including Anthropic, Cursor, HeyGen, Scale AI, Vercel, and others"
                className="w-full"
              />
            </div>
            <p className="text-[13px] text-[#b0aeab] mt-3 italic" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
              {"Scores derived from publicly available early-stage data, analyzed through deep search by trusted AI agents."}
            </p>

            {/* Full tool demo video */}
            <div className="w-full overflow-hidden mt-12 mx-auto" style={{ maxWidth: "900px" }}>
              <video
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Google%20Chrome-PR77RBIdDfEs1zKLgn0EuDKBOrgdgO.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full object-cover"
                style={{ aspectRatio: "900/600" }}
              />
            </div>
            <p className="text-[13px] text-[#b0aeab] mt-3 italic" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
              Signal-32 live demo: entering a startup and receiving a scored breakdown with benchmark comparison.
            </p>
          </section>

          {/* THE OUTCOME */}
          <section
            id="the-outcome"
            ref={(el) => { sectionRefs.current["the-outcome"] = el }}
            className="mb-20 scroll-mt-24"
          >
            <p className="font-mono text-[13px] text-[#F97316] tracking-[0.15em] mb-4">
              THE OUTCOME
            </p>
            <h2
              className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4"
              style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
            >
              {"Validating intuitions, not replacing them."}
            </h2>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-6">
              {"In a small-scale pilot, several decision-makers noted that the tool's greatest value lies not in \"scoring,\" but in validating certain intuitions."}
            </p>
            <blockquote className="border-l-2 border-[#F97316] pl-5 mb-8">
              <p className="text-[16px] text-[#6b6966] leading-relaxed italic" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
                {"\"The teams often have different perspectives after an hour-long chat with founders, yet share common insights in certain areas -- this tool effectively distills those key questions.\""}
              </p>
            </blockquote>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-6">
              {"For me personally, this project provided practice in combining VC qualitative experience, public data, and simple statistical tools into a reusable decision-support product. It also helped me avoid a bad investment -- in a short-term perspective, the assessment was correct, with that team scoring only 3.1 via the survey. But this tool can't be used for evaluating long-term deals, because everything is dynamic."}
            </p>

          </section>
        </main>
      </div>
    </div>
  )
}
