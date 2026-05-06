"use client"

import { CaseStudyLayout, CSTitle, CSHeading, CSSubheading, CSBody, CSLabel, CSSection, CSMeta, NavItem } from "@/components/case-study-layout"

const navItems: NavItem[] = [
  { id: "overview",  label: "Overview" },
  { id: "problem",   label: "The problem" },
  { id: "audience",  label: "Audience" },
  { id: "features",  label: "Solutions" },
  { id: "business",  label: "Business model" },
  { id: "learnings", label: "Takeaway" },
]

const meta = [
  { label: "Role",     value: "Builder · Product Designer · Engineer" },
  { label: "Timeline", value: "1 month" },
  { label: "Team",     value: "Just me" },
  { label: "Stack",    value: "Next.js · AI SDK · Figma" },
]

const PT = "var(--font-pt-serif), 'Georgia', serif"
const SF = "-apple-system, 'SF Pro Text', 'SF Pro Display', sans-serif"

export default function LlunaAICaseStudy() {
  return (
    <CaseStudyLayout navItems={navItems}>
      <CSTitle>Lluna, AI Aesthetic Consultant</CSTitle>
      <CSBody>Know before you sit in the chair.</CSBody>
      <CSMeta items={meta} />

      <CSSection id="overview">
        <CSLabel>Overview</CSLabel>
        <CSHeading>Know before you sit in the chair at the treatment room.</CSHeading>
        <CSBody>Lluna is an AI aesthetic consultant built for the treatment room.</CSBody>
        <CSBody>The clinic industry runs on information asymmetry. Consultants know everything. Clients know nothing — until they're already in the chair with someone who has 20 minutes and a sales quota. Even worse, the consultant's job is to make the sale, so they may not be as knowledgeable as AI.</CSBody>
        <CSBody>This project is personal. I grew up sneaking my mom's skincare products, got obsessed with the medspa world at 16, and spent years visiting clinics across China, Korea, and the US trying to understand how the industry actually works. My long-term dream is to open my own clinic one day. Lluna is me building toward that, one product decision at a time.</CSBody>
      </CSSection>

      <CSSection id="problem">
        <CSLabel>The problem</CSLabel>
        <CSHeading>Clinics make money on confusion.</CSHeading>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" }}>
          {[
            { who: "Client", text: "Clients arrive unprepared, face a 20-minute consultation with a quota-driven consultant, and either overbuy out of pressure or leave without booking. Both outcomes accelerate churn." },
            { who: "Clinic", text: "Clinics spend heavily to acquire each client but rushed consultations sell single treatments, not plans. Basket price stays low. If CAC can't come down, revenue per visit must go up." },
            { who: "Both",   text: "Neither side thinks beyond the current visit. Every consultation starts from scratch. LTV stays permanently flat." },
          ].map(({ who, text }, i) => (
            <div key={i} style={{ display: "flex", gap: "16px" }}>
              <span style={{ fontFamily: PT, fontSize: "16px", color: "#9A9A99", flexShrink: 0 }}>0{i + 1}</span>
              <div>
                <CSSubheading>{who}</CSSubheading>
                <CSBody style={{ marginBottom: 0 }}>{text}</CSBody>
              </div>
            </div>
          ))}
        </div>
        <blockquote style={{ borderLeft: "2px solid #000000", paddingLeft: "20px" }}>
          <CSBody style={{ fontStyle: "italic", marginBottom: 0 }}>The insight: clients who arrived educated had higher satisfaction, higher spend, and lower churn. The consultation wasn't the problem. The lack of preparation was.</CSBody>
        </blockquote>
      </CSSection>

      <CSSection id="audience">
        <CSLabel>Audience</CSLabel>
        <CSHeading>Who I designed for.</CSHeading>
        <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-02-27%20at%2000.16.02-Bt9rvDLMU2VoQeAy3UtBTWrjb0RmE4.png" alt="Audience mapping" style={{ width: "100%", borderRadius: "8px", marginBottom: "16px" }} />
        <CSBody>Two audiences, one product. On the user side: three client archetypes — the anxious first-timer, the informed repeater, and the optimizer — each with distinct anxieties Lluna resolves through transparency, memory, and evidence-backed advice. On the business side: clinics dealing with high acquisition cost, rampant churn, rushed consultations, and suboptimal selling — Lluna answers with basket price lift, dynamic pricing inside the AI flow, and structured client briefs sent before every appointment.</CSBody>
      </CSSection>

      <CSSection id="features">
        <CSLabel>Solutions</CSLabel>

        <CSHeading>Solution 01 — AI Consultant</CSHeading>
        <video src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/process-demand-Vf7Fh3dqH88YVvIGIcP3GewwyP74L7.mp4" autoPlay loop muted playsInline style={{ width: "100%", borderRadius: "8px", marginBottom: "8px" }} />
        <p style={{ fontFamily: PT, fontSize: "14px", color: "#9A9A99", textAlign: "center", marginBottom: "16px" }}>Users first describe their needs to the AI, then select individual or clinic path.</p>
        <CSBody>Not a chatbot. A multi-turn advisor with memory and clinical reasoning. Before recommending anything, it confirms: past treatments, allergies, budget, pain tolerance. Every response follows: acknowledge, context, recommendation, next step.</CSBody>

        <CSHeading>Solution 02 — Clinic Code</CSHeading>
        <video src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/codestate-DfpjXNFa4IzzwcSnzyJ31GU3m2wR0u.mp4" autoPlay loop muted playsInline style={{ width: "100%", maxWidth: "450px", borderRadius: "8px", marginBottom: "8px" }} />
        <p style={{ fontFamily: PT, fontSize: "14px", color: "#9A9A99", marginBottom: "16px" }}>Error state handling: wrong clinic code entry and re-entry flow.</p>
        <CSBody>Each clinic has a code. Client enters the code, Lluna connects to their menu. Recommendations pull from what the clinic actually stocks, at real prices. Combo suggestions are built around their inventory. Dynamic pricing and promotions surface naturally inside the recommendation flow — not on a separate deals page.</CSBody>

        <CSHeading>Solution 03 — The Report</CSHeading>
        <video src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/onboarding-QnmYhMJkGEL6XVPUad0rmGNsxJuGGJ.mp4" autoPlay loop muted playsInline style={{ width: "100%", borderRadius: "8px", marginBottom: "8px" }} />
        <p style={{ fontFamily: PT, fontSize: "14px", color: "#9A9A99", textAlign: "center", marginBottom: "16px" }}>AI onboarding guidance: walking users through the report for the first time.</p>
        <video src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ask%20ai%20in%20report-ZPjpbHZbT9PP8nMuLTK6PvmdZnY8TD.mp4" autoPlay loop muted playsInline style={{ width: "100%", borderRadius: "8px", marginBottom: "8px" }} />
        <p style={{ fontFamily: PT, fontSize: "14px", color: "#9A9A99", textAlign: "center", marginBottom: "16px" }}>Underline any keyword in the report to ask AI, e.g. "When was Kybella published?"</p>
        <CSBody>The report is a conversion surface, not just a deliverable. Full face assessment. Basic plan vs. AI-optimized plan. Synergy callouts throughout, each one grounded in clinical rationale, not bundling logic.</CSBody>
        <blockquote style={{ borderLeft: "2px solid #000000", paddingLeft: "20px", marginBottom: "12px" }}>
          <CSBody style={{ fontStyle: "italic", marginBottom: 0 }}>"Thermage + Juvederm Volite: collagen remodeling from Thermage creates an optimal HA retention window. Results last 30–40% longer than either treatment alone."</CSBody>
        </blockquote>
        <blockquote style={{ borderLeft: "2px solid #000000", paddingLeft: "20px", marginBottom: "16px" }}>
          <CSBody style={{ fontStyle: "italic", marginBottom: 0 }}>"Profhilo first. Every subsequent treatment performs better with a hydration base."</CSBody>
        </blockquote>

        <div style={{ display: "flex", flexDirection: "column", gap: "40px", marginTop: "32px" }}>
          {[
            { img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-02-26%20at%2023.34.18-6xWPL83njkwMA3a4hd5OJWmhMVxvWD.png", alt: "Customer reviews", label: "Customer Reviews", desc: "Reviews are tagged by treatment, not just rated by experience. When users evaluate a specific procedure, they see feedback from people who had exactly that treatment, reducing anxiety at the highest drop-off moment in the funnel." },
            { img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-02-26%20at%2023.34.08-GqOW9e6Gu98pVmY8CCRo6WsyJFtRtE.png", alt: "Clinic campaigns", label: "Clinic Campaigns & Offers", desc: "Promotions surface inside the AI recommendation flow, not on a separate deals page. Users encounter savings at the moment of clinical decision, lifting basket price and conversion simultaneously." },
            { img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-02-26%20at%2023.34.03-ZUHmGyuuYI5nYMf3EAAcYjgPjhz1Vo.png", alt: "Combo recommendation", label: "Combo Recommendation + Long-term Plan", desc: "Combo recommendations are backed by synergy science, not bundling logic. The long-term maintenance plan shifts the user's decision frame from 'should I do this?' to 'when should I schedule this?' — time-anchoring is one of the most effective LTV mechanisms in service products." },
          ].map(({ img, alt, label, desc }) => (
            <div key={label} style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
              <img src={img} alt={alt} style={{ width: "50%", flexShrink: 0, borderRadius: "8px" }} />
              <div>
                <CSSubheading>{label}</CSSubheading>
                <CSBody style={{ marginBottom: 0 }}>{desc}</CSBody>
              </div>
            </div>
          ))}
        </div>
      </CSSection>

      <CSSection id="business">
        <CSLabel>Business model</CSLabel>
        <CSHeading>B2B2C. Consumer trust becomes clinic distribution.</CSHeading>
        <CSBody>Clinics are not the primary user — they're the distribution channel. Consumer acquisition happens through organic content and community. Clinics adopt because clients arrive asking for Lluna by name.</CSBody>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", margin: "24px 0" }}>
          {[
            { label: "Revenue",       text: "Clinic SaaS subscription, booking transaction fee, premium consumer tier." },
            { label: "Unit Economics", text: "One combo conversion = $200–$800 incremental clinic revenue. SaaS pays for itself at 5–10% conversion lift." },
            { label: "Key Metrics",   text: "Pre-consultation completion rate, plan acceptance rate, avg treatments/plan, 3/6-month return rate, clinic NPS." },
          ].map(({ label, text }) => (
            <div key={label} style={{ border: "1px solid #eae8e6", padding: "20px" }}>
              <p style={{ fontFamily: SF, fontWeight: 500, fontSize: "14px", color: "#000000", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
              <CSBody style={{ marginBottom: 0, fontSize: "15px" }}>{text}</CSBody>
            </div>
          ))}
        </div>
      </CSSection>

      <CSSection id="learnings">
        <CSLabel>Takeaway</CSLabel>
        <CSBody>The real challenge of Lluna wasn't designing the AI — it was embedding growth design into a B2B2C product where clinic revenue goals and client trust are in constant tension. Every feature had to serve both sides without either feeling manipulated.</CSBody>
        <CSBody>The combo recommendations had to be clinically grounded enough that clients trusted them, and commercially structured enough that clinics actually adopted them. That balance is harder than it sounds.</CSBody>
        <CSBody>The second thing: AI-native products create the most value when they bridge a gap that only exists offline. The medspa consultation is a physical, high-stakes, time-compressed moment. Lluna's job isn't to replace that — it's to change who walks through the door and how prepared they are.</CSBody>
      </CSSection>
    </CaseStudyLayout>
  )
}
