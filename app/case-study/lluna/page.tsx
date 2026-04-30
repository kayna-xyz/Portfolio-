"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowUp } from "lucide-react"
import Navbar from "@/components/navbar"

const sections = [
  { id: "overview", label: "OVERVIEW" },
  { id: "problem", label: "THE PROBLEM" },
  { id: "audience", label: "AUDIENCE" },
  { id: "features", label: "SOLUTIONS" },
  { id: "business", label: "BUSINESS MODEL" },
  { id: "learnings", label: "TAKEAWAY" },
]

const metadata = [
  { label: "ROLE", value: "Builder \u00b7 Product Designer \u00b7 Engineer" },
  { label: "TIMELINE", value: "1 month" },
  { label: "TEAM", value: "Just me" },
  { label: "STACK", value: "Next.js \u00b7 AI SDK \u00b7 Figma" },
]

export default function LlunaAICaseStudy() {
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
          {/* Hero cover image */}
          <div className="overflow-hidden mt-4 mb-12 -mx-5 md:-mx-[200px]">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-02-26%20at%2000.16.41-Af7Iiwyu9RwSqFaB686OVgl5YFfBaF.png"
              alt="Lluna"
              className="w-full object-cover"
              style={{ aspectRatio: "1500/460" }}
            />
          </div>

          <h1
            className="text-[#474747] text-[28px] md:text-[36px] leading-[1.3] mb-3"
            style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
          >
            <a
              href="https://lluna.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF8EAE] no-underline hover:opacity-70 transition-opacity"
            >
              Lluna
            </a>
            {" , AI Aesthetic Consultant"}
          </h1>
          <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-8">
            {"Know before you sit in the chair."}
          </p>

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
              Know before you sit on the chair at treatment room.
            </h2>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed">
              {"Lluna is an AI aesthetic consultant built for the treatment room."}
            </p>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed mt-4">
              {"The clinic industry runs on information asymmetry. Consultants know everything. Clients know nothing, until they're already in the chair with someone who has 20 minutes and a sales quota. Even worse, the consultant's job is to make the sale, so they may not be as knowledgeable as AI."}
            </p>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed mt-4">
              {"This project is personal. I grew up sneaking my mom\u2019s skincare products, got obsessed with the medspa world at 16, and spent years visiting clinics across China, Korea, and the US trying to understand how the industry actually works. My long-term dream is to open my own clinic one day, Lluna is me building toward that, one product decision at a time."}
            </p>
          </section>

          {/* THE PROBLEM */}
          <section
            id="problem"
            ref={(el) => { sectionRefs.current["problem"] = el }}
            className="mb-20 scroll-mt-24"
          >
            <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.15em] mb-4">
              THE PROBLEM
            </p>
            <h2
              className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4"
              style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
            >
              Clinics make money on confusion.
            </h2>
            <div className="flex flex-col gap-6 mb-8">
              <div className="flex gap-4 items-start">
                <span className="font-mono text-[13px] text-[#FF8EAE] shrink-0">01</span>
                <div>
                  <p className="text-[15px] text-[#474747] font-medium mb-1">Client</p>
                  <p className="text-[15px] text-[#9e9b98] leading-relaxed">{"Clients arrive unprepared, face a 20-minute consultation with a quota-driven consultant, and either overbuy out of pressure or leave without booking. Both outcomes accelerate churn."}</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="font-mono text-[13px] text-[#FF8EAE] shrink-0">02</span>
                <div>
                  <p className="text-[15px] text-[#474747] font-medium mb-1">Clinic</p>
                  <p className="text-[15px] text-[#9e9b98] leading-relaxed">{"Clinics spend heavily to acquire each client but rushed consultations sell single treatments, not plans. Basket price stays low. If CAC can't come down, revenue per visit must go up."}</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="font-mono text-[13px] text-[#FF8EAE] shrink-0">03</span>
                <div>
                  <p className="text-[15px] text-[#474747] font-medium mb-1">Both</p>
                  <p className="text-[15px] text-[#9e9b98] leading-relaxed">{"Neither side thinks beyond the current visit. Every consultation starts from scratch. LTV stays permanently flat."}</p>
                </div>
              </div>
            </div>

            <blockquote className="border-l-2 border-[#FF8EAE] pl-5">
              <p className="text-[15px] text-[#474747] leading-relaxed italic" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
                {"The insight: clients who arrived educated had higher satisfaction, higher spend, and lower churn. The consultation wasn't the problem. The lack of preparation was."}
              </p>
            </blockquote>
          </section>

          {/* WHO I DESIGNED FOR */}
          <section
            id="audience"
            ref={(el) => { sectionRefs.current["audience"] = el }}
            className="mb-20 scroll-mt-24"
          >
            <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.15em] mb-4">
              AUDIENCE
            </p>
            <h2
              className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-8"
              style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
            >
              Who I designed for.
            </h2>

            <div className="w-full overflow-hidden mx-auto" style={{ maxWidth: "900px" }}>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-02-27%20at%2000.16.02-Bt9rvDLMU2VoQeAy3UtBTWrjb0RmE4.png"
                alt="Audience mapping: user side (clients) and business side (clinics)"
                className="w-full"
              />
            </div>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed mt-6">
              {"Two audiences, one product. On the user side, three client archetypes, the anxious first-timer, the informed repeater, and the optimizer, each with distinct anxieties Lluna resolves through transparency, memory, and evidence-backed advice. On the business side, clinics dealing with high acquisition cost, rampant churn, rushed consultations, and suboptimal selling, Lluna answers with basket price lift, dynamic pricing inside the AI flow, and structured client briefs sent before every appointment."}
            </p>
          </section>

          {/* SOLUTIONS */}
          <section
            id="features"
            ref={(el) => { sectionRefs.current["features"] = el }}
            className="mb-20 scroll-mt-24"
          >
            <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.15em] mb-4">
              SOLUTIONS
            </p>

            {/* Solution 01: AI Consultant — solves Problem 01 (Client) */}
            <div className="mb-16">
              <p className="font-mono text-[11px] text-[#FF8EAE] tracking-wider mb-3">SOLUTION 01</p>
              <h3 className="text-[#474747] text-[20px] mb-3" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
                AI Consultant
              </h3>

              <div className="w-full overflow-hidden mb-6 mx-auto" style={{ maxWidth: "900px" }}>
                <video
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/process-demand-Vf7Fh3dqH88YVvIGIcP3GewwyP74L7.mp4"
                  autoPlay loop muted playsInline
                  className="w-full"
                />
                <p className="text-[12px] text-[#b0aeab] mt-2 font-mono text-center">
                  {"Users first describe their needs to the AI, then select individual or clinic path."}
                </p>
              </div>

              <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-4">
                {"Not a chatbot. A multi-turn advisor with memory and clinical reasoning."}
              </p>
              <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-4">
                {"Before recommending anything, it confirms: past treatments, allergies, budget, pain tolerance. Every response follows, acknowledge, context, recommendation, next step."}
              </p>
            </div>

            {/* Feature 02: Clinic Code */}
            <div className="mb-16">
              <p className="font-mono text-[11px] text-[#FF8EAE] tracking-wider mb-3">SOLUTION 02</p>
              <h3 className="text-[#474747] text-[20px] mb-3" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
                Clinic Code
              </h3>

              <div className="w-full overflow-hidden mb-6 mx-auto" style={{ maxWidth: "450px" }}>
                <video
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/codestate-DfpjXNFa4IzzwcSnzyJ31GU3m2wR0u.mp4"
                  autoPlay loop muted playsInline
                  className="w-full"
                />
                <p className="text-[12px] text-[#b0aeab] mt-2 font-mono text-center">
                  {"Error state handling: wrong clinic code entry and re-entry flow."}
                </p>
              </div>

              <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-4">
                {"Each clinic has a code. Client enters the code, Lluna connects to their menu."}
              </p>
              <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-4">
                {"Recommendations pull from what the clinic actually stocks, at real prices. Combo suggestions are built around their inventory. Dynamic pricing and promotions surface naturally inside the recommendation flow, not on a separate deals page."}
              </p>
              <p className="text-[15px] text-[#9e9b98] leading-relaxed">
                {"Consumer trust becomes charge for clinics, a good product does not reduce the benefits but enrich the ecosystem."}
              </p>
            </div>

            {/* Feature 03: The Report */}
            <div className="mb-8">
              <p className="font-mono text-[11px] text-[#FF8EAE] tracking-wider mb-3">SOLUTION 03</p>
              <h3 className="text-[#474747] text-[20px] mb-3" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
                The Report
              </h3>

              <div className="w-full overflow-hidden mb-6 mx-auto" style={{ maxWidth: "900px" }}>
                <video
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/onboarding-QnmYhMJkGEL6XVPUad0rmGNsxJuGGJ.mp4"
                  autoPlay loop muted playsInline
                  className="w-full"
                />
                <p className="text-[12px] text-[#b0aeab] mt-2 font-mono text-center">
                  {"AI onboarding guidance: walking users through the report for the first time."}
                </p>
              </div>

              <div className="w-full overflow-hidden mb-6 mx-auto" style={{ maxWidth: "900px" }}>
                <video
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ask%20ai%20in%20report-ZPjpbHZbT9PP8nMuLTK6PvmdZnY8TD.mp4"
                  autoPlay loop muted playsInline
                  className="w-full"
                />
                <p className="text-[12px] text-[#b0aeab] mt-2 font-mono text-center">
                  {"Underline any keyword in the report to ask AI, e.g. \"When was Kybella published?\""}
                </p>
              </div>

              <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-4">
                {"The report is a conversion surface, not just a deliverable."}
              </p>
              <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-4">
                {"Full face assessment. Basic plan vs. AI-optimized plan. Synergy callouts throughout, each one grounded in clinical rationale, not bundling logic."}
              </p>
              <blockquote className="border-l-2 border-[#FF8EAE] pl-5 mb-4">
                <p className="text-[14px] text-[#474747] leading-relaxed italic" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
                  {"\"Thermage + Juvederm Volite: collagen remodeling from Thermage creates an optimal HA retention window. Results last 30\u201340% longer than either treatment alone.\""}
                </p>
              </blockquote>
              <blockquote className="border-l-2 border-[#FF8EAE] pl-5 mb-6">
                <p className="text-[14px] text-[#474747] leading-relaxed italic" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}>
                  {"\"Profhilo first. Every subsequent treatment performs better with a hydration base.\""}
                </p>
              </blockquote>
              <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-4">
                {"The save prompt fires at the highest-engagement moment, right after the user sees their full face assessment for the first time. Framed as protecting their plan, not opting into marketing."}
              </p>
              <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-4">
                {"PDF download with QR code."}
              </p>

              {/* Growth Design: Customer Reviews */}
              <p className="font-mono text-[11px] text-[#FF8EAE] tracking-wider mb-3 mt-12">REPORT CONTENTS</p>
              <div className="flex flex-col md:flex-row gap-6 mt-4 items-start">
                <div className="md:w-1/2 shrink-0 overflow-hidden">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-02-26%20at%2023.34.18-6xWPL83njkwMA3a4hd5OJWmhMVxvWD.png"
                    alt="Customer reviews tagged by treatment"
                    className="w-full"
                  />
                </div>
                <div className="md:w-1/2">
                  <h4 className="text-[#474747] text-[17px] mb-2 font-medium">Customer Reviews</h4>
                  <p className="text-[15px] text-[#9e9b98] leading-relaxed">
                    {"Reviews are tagged by treatment, not just rated by experience. When users are evaluating a specific procedure, they see feedback from people who had exactly that treatment, reducing anxiety at the highest drop-off moment in the funnel."}
                  </p>
                </div>
              </div>

              {/* Growth Design: Clinic Campaigns & Offers */}
              <div className="flex flex-col md:flex-row gap-6 mt-10 items-start">
                <div className="md:w-1/2 shrink-0 overflow-hidden">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-02-26%20at%2023.34.08-GqOW9e6Gu98pVmY8CCRo6WsyJFtRtE.png"
                    alt="Clinic campaigns and offers surfaced in recommendation flow"
                    className="w-full"
                  />
                </div>
                <div className="md:w-1/2">
                  <h4 className="text-[#474747] text-[17px] mb-2 font-medium">Clinic Campaigns & Offers</h4>
                  <p className="text-[15px] text-[#9e9b98] leading-relaxed">
                    {"Promotions surface inside the AI recommendation flow, not on a separate deals page. Users encounter savings at the moment of clinical decision, not after. This lifts basket price and conversion simultaneously without feeling like a sales push."}
                  </p>
                </div>
              </div>

              {/* Growth Design: Combo Recommendation + Long-term Plan */}
              <div className="flex flex-col md:flex-row gap-6 mt-10 items-start">
                <div className="md:w-1/2 shrink-0 overflow-hidden">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-02-26%20at%2023.34.03-ZUHmGyuuYI5nYMf3EAAcYjgPjhz1Vo.png"
                    alt="Combo recommendation with synergy science and long-term maintenance plan"
                    className="w-full"
                  />
                </div>
                <div className="md:w-1/2">
                  <h4 className="text-[#474747] text-[17px] mb-2 font-medium">Combo Recommendation + Long-term Plan</h4>
                  <p className="text-[15px] text-[#9e9b98] leading-relaxed">
                    {"Combo recommendations are backed by synergy science, not bundling logic. The long-term maintenance plan shifts the user\u2019s decision frame from \"should I do this?\" to \"when should I schedule this?\", time-anchoring is one of the most effective LTV mechanisms in subscription and service products."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* BUSINESS MODEL */}
          <section
            id="business"
            ref={(el) => { sectionRefs.current["business"] = el }}
            className="mb-20 scroll-mt-24"
          >
            <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.15em] mb-4">
              BUSINESS MODEL
            </p>
            <h2
              className="text-[#474747] text-[22px] md:text-[28px] leading-[1.4] mb-4"
              style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
            >
              B2B2C. Consumer trust becomes clinic distribution.
            </h2>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-4">
              {"Clinics are not the primary user, they're the distribution channel. Consumer acquisition happens through organic content and community. Clinics adopt because clients arrive asking for Lluna by name."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="border border-[#eae8e6] p-5">
                <p className="font-mono text-[11px] text-[#FF8EAE] tracking-wider mb-2">REVENUE</p>
                <p className="text-[15px] text-[#9e9b98] leading-relaxed">Clinic SaaS subscription, booking transaction fee, premium consumer tier.</p>
              </div>
              <div className="border border-[#eae8e6] p-5">
                <p className="font-mono text-[11px] text-[#FF8EAE] tracking-wider mb-2">UNIT ECONOMICS</p>
                <p className="text-[15px] text-[#9e9b98] leading-relaxed">One combo conversion = $200-$800 incremental clinic revenue. SaaS pays for itself at 5-10% conversion lift.</p>
              </div>
              <div className="border border-[#eae8e6] p-5">
                <p className="font-mono text-[11px] text-[#FF8EAE] tracking-wider mb-2">KEY METRICS</p>
                <p className="text-[15px] text-[#9e9b98] leading-relaxed">Pre-consultation completion rate, plan acceptance rate (basic vs. optimized), avg treatments/plan, 3/6-month return rate, clinic NPS.</p>
              </div>
            </div>
          </section>

          {/* TAKEAWAY */}
          <section
            id="learnings"
            ref={(el) => { sectionRefs.current["learnings"] = el }}
            className="mb-20 scroll-mt-24"
          >
            <p className="font-mono text-[13px] text-[#FF8EAE] tracking-[0.15em] mb-4">
              TAKEAWAY
            </p>

            <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-4">
              {"The real challenge of Lluna wasn't designing the AI, it was embedding growth design into a B2B2C product where clinic revenue goals and client trust are in constant tension. Every feature had to serve both sides without either feeling manipulated."}
            </p>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed mb-4">
              {"The combo recommendations had to be clinically grounded enough that clients trusted them, and commercially structured enough that clinics actually adopted them. That balance is harder than it sounds."}
            </p>
            <p className="text-[15px] text-[#9e9b98] leading-relaxed">
              {"The second thing: AI-native products create the most value when they bridge a gap that only exists offline. The medspa consultation is a physical, high-stakes, time-compressed moment. Lluna's job isn't to replace that, it's to change who walks through the door and how prepared they are."}
            </p>
          </section>
        </main>
      </div>
    </div>
  )
}
