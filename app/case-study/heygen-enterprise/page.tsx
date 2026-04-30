"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowUp } from "lucide-react"
import Navbar from "@/components/navbar"

const navGroups = [
  {
    label: "ENTERPRISE",
    sections: [
      { id: "overview", label: "OVERVIEW" },
      { id: "context", label: "CONTEXT" },
      { id: "the-problem", label: "THE PROBLEM" },
      { id: "solution-1", label: "SOLUTION 1" },
      { id: "solution-2", label: "SOLUTION 2" },
      { id: "solution-3", label: "SOLUTION 3" },
      { id: "the-outcome", label: "THE OUTCOME" },
    ],
  },
  {
    label: "MOBILE",
    sections: [
      { id: "mobile-overview", label: "OVERVIEW" },
      { id: "mobile-context", label: "CONTEXT" },
      { id: "mobile-the-problem", label: "THE PROBLEM" },
      { id: "mobile-solution", label: "SOLUTION" },
      { id: "mobile-the-outcome", label: "THE OUTCOME" },
    ],
  },
]

const allSections = navGroups.flatMap((g) => g.sections)

const enterpriseMetadata = [
  { label: "TIMELINE", value: "4 Months" },
  { label: "ROLE", value: "Product Design Intern" },
  { label: "TEAM", value: "Nick Allen (Design Head)\nManuela Odell (Product Designer)\nAlex Flores (Product Designer)\nMolly Knight (Product Designer)\nWayne Liang (Co-founder)" },
  { label: "TOOLS", value: "Figma" },
]

const mobileMetadata = [
  { label: "TIMELINE", value: "2 Months" },
  { label: "ROLE", value: "Product Design Intern" },
  { label: "TEAM", value: "Tiffany Huang (Product Designer + PM)" },
  { label: "TOOLS", value: "Figma" },
]

export default function HeyGenCaseStudy() {
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

    allSections.forEach(({ id }) => {
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
        {/* Left sidebar */}
        <aside className="hidden md:flex fixed left-0 top-[60px] bottom-0 w-[180px] flex-col justify-between py-8 pl-[30px] pr-4 z-40">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1.5 font-mono text-[13px] text-[#474747] hover:text-[#000000] transition-colors mb-6 tracking-[0.05em]"
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
              HOME
            </button>

            {navGroups.map((group, gi) => (
              <div key={group.label} className={gi > 0 ? "mt-5" : ""}>
                <p className="font-mono text-[11px] text-[#b0aeab] tracking-[0.1em] mb-2 uppercase">
                  {group.label}
                </p>
                {group.sections.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className={`font-mono text-[13px] text-left py-1.5 w-full transition-colors tracking-[0.05em] pl-2 ${
                      activeSection === id
                        ? "text-[#474747]"
                        : "text-[#b0aeab] hover:text-[#808080]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
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

          {/* ── ENTERPRISE ─────────────────────────────── */}

          <div className="overflow-hidden mt-4 mb-12 -mx-5 md:-mx-[200px]">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20143-r5ZNyycuofe6hrpdSHJULr0XMyokjh.png"
              alt="HeyGen Enterprise"
              className="w-full"
            />
          </div>

          <h1
            className="text-[#474747] text-[28px] md:text-[36px] leading-[1.3] mb-8"
            style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
          >
            Building AI enterprise product at{" "}
            <a
              href="https://www.heygen.com/about"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF8EAE] no-underline hover:opacity-70 transition-opacity"
            >
              HeyGen
            </a>
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {enterpriseMetadata.map(({ label, value }) => (
              <div key={label}>
                <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.1em] mb-2">{label}</p>
                <p className="text-[15px] text-[#6b6966] leading-relaxed whitespace-pre-line" style={{ fontFamily: "'SF Pro', -apple-system, system-ui, sans-serif" }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          <section id="overview" ref={(el) => { sectionRefs.current["overview"] = el }} className="mb-20 scroll-mt-24">
            <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.15em] mb-4">OVERVIEW</p>
            <h2 className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
              An AI video creation platform designed for enterprise-scale communication.
            </h2>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed">
              HeyGen Enterprise enables medium to large teams across marketing, L&D, sales, and other departments to translate videos into over 100 languages and produce AI digital human videos within hours. I participated in the user experience redesign of the Enterprise Core Workspace, encompassing the AI Video Agent, real-time LiveAvatar experience, navigation and notification systems, as well as CRM/Apps pages.
            </p>
          </section>

          <section id="context" ref={(el) => { sectionRefs.current["context"] = el }} className="mb-20 scroll-mt-24">
            <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.15em] mb-4">CONTEXT</p>
            <h2 className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
              User & Market Research
            </h2>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-4">
              Together with Sales and CSM, we conducted over 10 enterprise customer interviews (45-60 minutes each). At the market level, we also compared the user experience of similar enterprise AI video products like Synthesia and Captions. Combining community feedback and usage data, we identified several key issues.
            </p>
            <div className="mt-8 mx-auto" style={{ maxWidth: "640px" }}>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-02-26%20at%2012.53.29-fPEUHYYIWkDBQZwx0RUVVqPAUsgPBL.png"
                alt="User and market research mapping for HeyGen Enterprise"
                className="w-full"
              />
              <p className="text-[12px] text-[#b0aeab] mt-2 font-mono text-center">
                {"Research synthesis: interviews, competitive benchmarking, and usage data mapped across 4 enterprise tiers."}
              </p>
            </div>
          </section>

          <section id="the-problem" ref={(el) => { sectionRefs.current["the-problem"] = el }} className="mb-20 scroll-mt-24">
            <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.15em] mb-4">THE PROBLEM</p>
            <h2 className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-6" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
              Three core UX challenges stood in the way of enterprise adoption.
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="text-[15px] text-[#FF8EAE] font-mono shrink-0">01</span>
                <p className="text-[15px] text-[#9e9b98] leading-relaxed">The path from "sign-up" to "producing a usable video" is too lengthy for new users, requiring an average of 8-10 steps.</p>
              </div>
              <div className="flex gap-4">
                <span className="text-[15px] text-[#FF8EAE] font-mono shrink-0">02</span>
                <p className="text-[15px] text-[#9e9b98] leading-relaxed">{"While LiveAvatar's real-time experience is technically advanced, fragmented entry points and insufficient status feedback have resulted in lower-than-expected daily active users."}</p>
              </div>
              <div className="flex gap-4">
                <span className="text-[15px] text-[#FF8EAE] font-mono shrink-0">03</span>
                <p className="text-[15px] text-[#9e9b98] leading-relaxed">{"Frontline users lack clarity on where the Enterprise edition's additional governance and integration capabilities reside, such as SSO, approval workflows, and CRM/LMS integrations."}</p>
              </div>
            </div>
          </section>

          <section id="solution-1" ref={(el) => { sectionRefs.current["solution-1"] = el }} className="mb-20 scroll-mt-24">
            <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.15em] mb-4">SOLUTION 1</p>
            <h2 className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
              UX Optimization: Real-Time AI Avatar
            </h2>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-3">
              {"The API is highly capable, enabling real-time AI avatar conversations, but the product-level multimodal interaction flow (e.g., loading states, error states, input/output boundaries) required refinement."}
            </p>
            <p className="text-[15px] text-[#6b6966] leading-relaxed mb-4">
              {"I was responsible for defining various UX states (Connecting, Listening, Processing, Speaking) and multimodal inputs (text, voice, potential future video formats)."}
            </p>
            <h3 className="text-[#474747] text-[18px] mb-3 mt-8" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>Process</h3>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-4">
              {"Mapped the LiveAvatar backend AI state machine (Idle → Connecting → Listening → Generating → Speaking → Error/Disconnected), reviewed state designs, and supplemented missing states."}
            </p>
            <div className="w-full overflow-hidden mt-4 mx-auto" style={{ maxWidth: "900px" }}>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-02-26%20at%2013.26.11-p5AMFJrNlPMgDyUf0bFNvxRX1ffvQR.png"
                alt="Live Avatar state machine diagram"
                className="w-full"
              />
              <p className="text-[12px] text-[#b0aeab] mt-2 font-mono text-center">
                {"Live Avatar state map: 5 state categories covering auth, session setup, input modes, AI response cycle, and error handling."}
              </p>
            </div>
            <div className="w-full overflow-hidden mt-8 mx-auto" style={{ maxWidth: "900px" }}>
              <video src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-zViGi3ImAFYxukQjFloFIargpUWyjy.mp4" autoPlay loop muted playsInline className="w-full object-cover" style={{ aspectRatio: "900/600" }} />
            </div>
            <h3 className="text-[#474747] text-[18px] mb-3 mt-8" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>Impact</h3>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed">
              Average session duration and revisit rate for real-time conversations increased, with session length rising by 15-25%. User experience satisfaction improved noticeably.
            </p>
          </section>

          <section id="solution-2" ref={(el) => { sectionRefs.current["solution-2"] = el }} className="mb-20 scroll-mt-24">
            <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.15em] mb-4">SOLUTION 2</p>
            <h2 className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
              {"Growth Design: Navigation Bar & Pop-Ups"}
            </h2>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-3">
              The navigation structure remained stacked by functional modules rather than organized around high-frequency user tasks. Users could not intuitively see the progress of AI video generation. Product advertisements were placed in a secondary tab, not directly embedded within essential interaction flows.
            </p>
            <p className="text-[15px] text-[#6b6966] leading-relaxed mb-4">
              I was responsible for producing multiple interactive design proposals for the design team to discuss and finalize. I directly designed pop-ups and ad interstitial banners to boost ARR and conversion rates.
            </p>
            <h3 className="text-[#474747] text-[18px] mb-3 mt-8" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>Process</h3>
            <ul className="text-[15px] text-[#9e9b98] leading-relaxed space-y-2 ml-5 list-disc mb-4">
              <li>Navigation Bar: Function modules clustered and arranged based on ARR and usage frequency.</li>
              <li>{"Dual-tab Notification Center: \"Notifications\" displays only content directly related to the user's AI video generation progress. \"What's New\" is reserved for product promotions, marketing campaigns, and similar content."}</li>
            </ul>
            <div className="w-full overflow-hidden mt-4 mx-auto" style={{ maxWidth: "900px" }}>
              <video src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HeyGen_Navi%20Bar-4jZ9ORTWxokc3OM5fKa12BoFVWKDTP.mp4" autoPlay loop muted playsInline className="w-full object-cover" style={{ aspectRatio: "900/600" }} />
            </div>
            <h3 className="text-[#474747] text-[18px] mb-3 mt-8" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>Impact</h3>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed">
              Improved Notice Click-Through Rate and Conversion Rate from new feature guidance.
            </p>
          </section>

          <section id="solution-3" ref={(el) => { sectionRefs.current["solution-3"] = el }} className="mb-20 scroll-mt-24">
            <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.15em] mb-4">SOLUTION 3</p>
            <h2 className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
              {"Growth Design: Enterprise CRM Page"}
            </h2>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-3">
              {"Integration with systems like CRM/HubSpot was already achievable through Apps, but the Apps page lacked a prominent entry point, and its layout failed to highlight \"Key Integrations\" and \"Recommended Workflows.\""}
            </p>
            <p className="text-[15px] text-[#6b6966] leading-relaxed mb-4">
              I designed the categories and components for the CRM page.
            </p>
            <div className="w-full overflow-hidden mt-4 mx-auto" style={{ maxWidth: "900px" }}>
              <video src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/heygen_crm%20page-ois3xAUTRDaoAy6QOE8tN5Bl2cA0L7.mp4" autoPlay loop muted playsInline className="w-full object-cover" style={{ aspectRatio: "900/600" }} />
            </div>
            <h3 className="text-[#474747] text-[18px] mb-3 mt-8" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>Impact</h3>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed">
              Enhanced the user experience for enterprise-end users, increasing traffic to the Apps page and third-party integrations.
            </p>
          </section>

          <section id="the-outcome" ref={(el) => { sectionRefs.current["the-outcome"] = el }} className="mb-20 scroll-mt-24">
            <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.15em] mb-4">THE OUTCOME</p>
            <h2 className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-6" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
              Measurable impact across the enterprise platform with the team.
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="text-[28px] md:text-[36px] text-[#FF8EAE] font-mono leading-none shrink-0" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>$80M</span>
                <div>
                  <p className="text-[15px] text-[#474747] leading-relaxed font-medium">to over $100M ARR</p>
                  <p className="text-[15px] text-[#9e9b98] leading-relaxed">Significant ARR growth with reduced churn rates.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-[28px] md:text-[36px] text-[#FF8EAE] font-mono leading-none shrink-0" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>15-25%</span>
                <div>
                  <p className="text-[15px] text-[#474747] leading-relaxed font-medium">session duration increase</p>
                  <p className="text-[15px] text-[#9e9b98] leading-relaxed">Noticeably higher usage frequency and session duration of LiveAvatar among pilot clients.</p>
                </div>
              </div>
            </div>
            <div className="border-t border-[#eae8e6] pt-8 mt-8">
              <p className="text-[15px] text-[#9e9b98] leading-relaxed">
                {"Thanks to the excellent product design team for making this work possible. This internship sharpened how I think about enterprise UX at scale."}
              </p>
            </div>
          </section>

          {/* ── MOBILE DIVIDER ──────────────────────────── */}
          <div className="border-t border-[#eae8e6] my-24" />

          {/* ── MOBILE ──────────────────────────────────── */}

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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {mobileMetadata.map(({ label, value }) => (
              <div key={label}>
                <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.1em] mb-2">{label}</p>
                <p className="text-[15px] text-[#6b6966] leading-relaxed whitespace-pre-line" style={{ fontFamily: "'SF Pro', -apple-system, system-ui, sans-serif" }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          <section id="mobile-overview" ref={(el) => { sectionRefs.current["mobile-overview"] = el }} className="mb-20 scroll-mt-24">
            <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.15em] mb-4">OVERVIEW</p>
            <h2 className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
              From desktop powerhouse to pocket studio.
            </h2>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed">
              {"HeyGen Mobile is a consumer-focused AI video creation app that lets creators and small businesses turn scripts, photos, and short clips into publish-ready AI videos directly on their phones. I co-designed and optimized the core navigation, Video Studio color editor, and captions experience, aiming to shorten the time from “open the app” to “publishable video” while keeping the experience friendly to non-experts."}
            </p>
          </section>

          <section id="mobile-context" ref={(el) => { sectionRefs.current["mobile-context"] = el }} className="mb-20 scroll-mt-24">
            <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.15em] mb-4">CONTEXT</p>
            <h2 className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
              Consumer user research & competitive landscape.
            </h2>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-4">
              {"I worked with 1 product designer, Tiffany Huang, who also served as the product manager, to review past user interviews -- feedback from creators at companies of various sizes, freelancers, and everyday consumers. Simultaneously, we benchmarked navigation structures, color grading workflows, and captioning tool models of leading mobile media editors like CapCut, Captions, and Hypic."}
            </p>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-4">Key findings:</p>
            <ul className="text-[15px] text-[#9e9b98] leading-relaxed list-disc pl-6 mb-4 flex flex-col gap-2">
              <li>{"HeyGen’s clear strengths lie in AI digital avatars, video translation, and text-to-video -- but these are desktop-first features."}</li>
              <li>{"Competitors are rapidly extending advanced features to mobile (professional color grading, systematic subtitle templates), making “creating finished videos solely on mobile” the norm."}</li>
              <li>{"Even HeyGen’s consumer product prioritizes small business owners -- the goal is enabling PC users to complete the workflow from draft to finished video on mobile, anytime."}</li>
            </ul>
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
                  alt="Competitive audit table"
                  className="w-full"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                  <span className="font-mono text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 tracking-wider">View</span>
                </div>
              </div>
              <div className="md:w-1/2 flex flex-col gap-3">
                <p className="text-[11px] font-mono text-[#FF8EAE] tracking-wider uppercase">Competitive Audit</p>
                <p className="text-[15px] text-[#9e9b98] leading-relaxed">{"Benchmarked HeyGen against CapCut, Captions, and Hypic across navigation, color grading, captioning, AI features, and end-to-end mobile workflow."}</p>
                <p className="text-[15px] text-[#9e9b98] leading-relaxed">{"HeyGen’s moat: lip-sync video translation, streaming-grade avatars, and 40+ language subtitle export -- unmatched by any competitor."}</p>
                <p className="text-[15px] text-[#9e9b98] leading-relaxed">{"Gaps to close: 3–4 taps to core features (vs 1–2), limited color grading, thin subtitle templates, and desktop-dependent publish workflow."}</p>
              </div>
            </div>
          </section>

          <section id="mobile-the-problem" ref={(el) => { sectionRefs.current["mobile-the-problem"] = el }} className="mb-20 scroll-mt-24">
            <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.15em] mb-4">THE PROBLEM</p>
            <h2 className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
              Two core UX friction points.
            </h2>
            <div className="flex flex-col gap-8">
              <div className="flex gap-4">
                <span className="text-[28px] md:text-[36px] text-[#FF8EAE] font-mono leading-none shrink-0" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>1</span>
                <div>
                  <h3 className="text-[#474747] text-[18px] mb-2" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>Navigation bar lacks clear functional modules</h3>
                  <p className="text-[15px] text-[#9e9b98] leading-relaxed">{"The homepage navigation features a complex UX with no clear hierarchy, causing users to experience fatigue from repetitive steps and potentially abandon the process midway. High-frequency functions need to be rearranged based on data so users can quickly access their tasks."}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-[28px] md:text-[36px] text-[#FF8EAE] font-mono leading-none shrink-0" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>2</span>
                <div>
                  <h3 className="text-[#474747] text-[18px] mb-2" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>Color selection lacks flexibility</h3>
                  <p className="text-[15px] text-[#9e9b98] leading-relaxed">{"The Video Studio color editor provides limited selection options, forcing users into workarounds. Editing video backgrounds requires too many steps and decisions compared to industry-standard tools."}</p>
                </div>
              </div>
            </div>
          </section>

          <section id="mobile-solution" ref={(el) => { sectionRefs.current["mobile-solution"] = el }} className="mb-20 scroll-mt-24">
            <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.15em] mb-4">SOLUTION</p>
            <div className="mb-16">
              <h2 className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
                {"1. Navigation Bar: From feature list to task-first hub"}
              </h2>
              <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-4">{"I collaborated with senior designers to develop multiple navigation proposals, organize reviews, and drive the selection of the final direction. We reorganized the homepage hierarchy based on HEX data."}</p>
              <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-2 font-medium" style={{ color: "#6b6966" }}>Process:</p>
              <ul className="text-[15px] text-[#9e9b98] leading-relaxed list-disc pl-6 mb-6 flex flex-col gap-2">
                <li>{"Used a mind map to organize the current UX, calculating required steps and decision points separately."}</li>
                <li>{"Collaborated with the PM to cluster existing features based on “ARR potential × usage frequency.”"}</li>
                <li>{"Designated creation and editing-related modules as top-priority, while downgrading account and settings modules to secondary entry points."}</li>
              </ul>
              <div className="w-full overflow-hidden mt-4 mx-auto" style={{ maxWidth: "900px" }}>
                <video src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mobilenavi-flNVPbRymN8ldyYs0abpOO33xH7TkJ.mp4" autoPlay loop muted playsInline className="w-full" />
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
                {"2. Video Studio – Color Editor"}
              </h2>
              <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-4">{"I redesigned the color picker, referencing the design from widely acclaimed mobile editors like Hypic. I considered multiple design options and modified the picker to align with HeyGen’s unique product features."}</p>
              <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-2 font-medium" style={{ color: "#6b6966" }}>Process:</p>
              <ul className="text-[15px] text-[#9e9b98] leading-relaxed list-disc pl-6 mb-6 flex flex-col gap-2">
                <li>{"Benchmarked color picker patterns across Hypic, CapCut, and native iOS tools."}</li>
                <li>{"Explored multiple design directions, from simple preset palettes to full HSB sliders."}</li>
                <li>{"Tailored the final design to balance flexibility with HeyGen’s non-expert user base."}</li>
              </ul>
              <div className="w-full overflow-hidden mt-4 mx-auto" style={{ maxWidth: "900px" }}>
                <video src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mobilecolor-55icN1MdXqdnZb92HbuZdPrqed80IV.mp4" autoPlay loop muted playsInline className="w-full" />
              </div>
            </div>
          </section>

          <section id="mobile-the-outcome" ref={(el) => { sectionRefs.current["mobile-the-outcome"] = el }} className="mb-20 scroll-mt-24">
            <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.15em] mb-4">THE OUTCOME</p>
            <h2 className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
              Measurable impact on the mobile product with the team.
            </h2>
            <div className="flex flex-col gap-6 mb-8">
              <div className="flex items-baseline gap-4">
                <span className="text-[28px] md:text-[36px] text-[#FF8EAE] font-mono leading-none shrink-0" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>{"↑"}</span>
                <div>
                  <p className="text-[#474747] text-[18px] mb-1" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>Navigation: Fewer steps, clearer feature visibility</p>
                  <p className="text-[15px] text-[#9e9b98] leading-relaxed">{"The number of steps required for users to make decisions has significantly decreased. Core features are now clearly visible, driving conversions for ARR."}</p>
                </div>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-[28px] md:text-[36px] text-[#FF8EAE] font-mono leading-none shrink-0" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>{"↓"}</span>
                <div>
                  <p className="text-[#474747] text-[18px] mb-1" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>Faster editing decisions in color picker</p>
                  <p className="text-[15px] text-[#9e9b98] leading-relaxed">{"When editing video backgrounds, users experience at least a 30% reduction in the time required to make editing decisions."}</p>
                </div>
              </div>
            </div>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-6">
              {"The HeyGen Mobile app launched on the "}
              <a href="https://apps.apple.com/us/app/heygen-ai-video-generator/id6711356409" target="_blank" rel="noopener noreferrer" className="text-[#FF8EAE] no-underline hover:opacity-70 transition-opacity">
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

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-zoom-out"
          onClick={() => setLightboxSrc(null)}
          role="dialog"
          aria-label="Image preview"
        >
          <img src={lightboxSrc} alt="Full-size preview" className="max-w-[90vw] max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
          <button type="button" className="absolute top-6 right-6 text-white/70 hover:text-white text-2xl font-mono bg-transparent border-0 cursor-pointer" onClick={() => setLightboxSrc(null)} aria-label="Close preview">
            {"x"}
          </button>
        </div>
      )}
    </div>
  )
}
