"use client"

import { useState } from "react"

const SF = "-apple-system, 'SF Pro Text', 'SF Pro Display', sans-serif"
const PT = "var(--font-pt-serif), 'Georgia', serif"

interface ProjectCardProps {
  image?: string
  video?: string
  category: string
  title: string
  description: string
  link?: string
  caseStudyLink?: string
  comingSoon?: boolean
}

function ProjectCard({ image, video, category, title, description, link, caseStudyLink, comingSoon }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false)

  const media = (
    <div
      className="w-full overflow-hidden mb-4 bg-[#e7e5e3] relative"
      onMouseEnter={() => comingSoon && setHovered(true)}
      onMouseLeave={() => comingSoon && setHovered(false)}
    >
      {video ? (
        <video autoPlay loop muted playsInline className="w-full h-auto group-hover:scale-105 transition-transform duration-300">
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image || ""} alt={title} className="w-full h-auto group-hover:scale-105 transition-transform duration-300" />
      )}
      {comingSoon && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(253, 251, 250, 0.72)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
          }}
        >
          <span style={{
            fontFamily: SF,
            fontWeight: 400,
            fontSize: "14px",
            letterSpacing: "0.12em",
            color: "#4B4948",
            textTransform: "uppercase",
          }}>
            Coming Soon
          </span>
        </div>
      )}
    </div>
  )

  const content = (
    <div className="group">
      {media}
      <p style={{ fontFamily: SF, fontWeight: 400, fontSize: "16px", color: "#8E8E93", marginBottom: "8px" }}>
        {category}
      </p>
      <h3 style={{ fontFamily: SF, fontWeight: 500, fontSize: "24px", color: "#000000", marginBottom: "8px" }}>
        {title}
      </h3>
      <p style={{ fontFamily: PT, fontWeight: 400, fontSize: "16px", color: "#000000", lineHeight: "1.6" }}>
        {description}
      </p>
    </div>
  )

  if (comingSoon) return <div>{content}</div>
  const href = caseStudyLink || link
  return (
    <div>
      {href ? (
        <a href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="no-underline">
          {content}
        </a>
      ) : content}
    </div>
  )
}

const allProjects: ProjectCardProps[] = [
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20143%20%281%29-26hDGXGiA9uYnC7tecymnhnK53Lmw4.png",
    category: "Product Design · Summer 2025",
    title: "HeyGen, Forbes AI 50",
    description: "Architecting a seamless AI video translation and digital avatar experience for enterprise-scale communication.",
    link: "https://www.heygen.com/",
    caseStudyLink: "/case-study/heygen-enterprise",
  },
  {
    image: "/lluna-cover.png",
    category: "Full Stack · AI SaaS · 2026",
    title: "Lluna, AI SaaS",
    description: "An AI vertical SaaS for medical spas — turning every client touchpoint into higher spend, stronger retention, and measurable revenue growth.",
    link: "https://lluna.ai",
    caseStudyLink: "/case-study/lluna",
  },
  {
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screen-studio-7A2NmU2Zac-2kRohHsEeLTG1d4A17ZCN3uaLeyUNr.mp4",
    category: "Product Design · Summer 2025",
    title: "HeyGen, Design Engineering",
    description: "Crafting an on-the-go AI video editing experience that empowers mobile users to capture and realize creative inspiration anywhere.",
    link: "https://apps.apple.com/us/app/heygen-ai-video-generator/id6711356409",
    caseStudyLink: "/case-study/heygen-enterprise#mobile-overview",
  },
  {
    image: "/perplexity-cover.png",
    category: "Concept Project · 2026",
    title: "Perplexity Travel",
    description: "Exploring how AI expands the boundary of traditional travel agent interfaces to assist user's travel plan making.",
    comingSoon: true,
  },
  {
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fillercover-zeW22rOZkdtjGHesbavcfiMpuPpPpX.mp4",
    category: "Personal Project · 2026",
    title: "FDA Fillers Selector",
    description: "The fastest filler reference tool for consumers: search any area, get ranked recommendations for FDA authorized fillers in seconds.",
    link: "https://v0-filler-search-tool.vercel.app/",
  },
  {
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Google%20Chrome-PR77RBIdDfEs1zKLgn0EuDKBOrgdgO.mp4",
    category: "Personal Project · 2026",
    title: "Claude / MiniApp",
    description: "A statistical tool running with LLM API designed to help angel investors rapidly analyze and benchmark early-stage startups.",
    link: "https://claude.ai/public/artifacts/6fc90c85-daf1-40fa-ac29-2a33b5b1939b",
    caseStudyLink: "/case-study/signal-32",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%2011%20%281%29-w47aUzGMwXkxfzVBCpJH92TtNnk0La.png",
    category: "School Magazine · 2026",
    title: "Columbia HCI Review",
    description: "Leading the visual identity and social media design strategy for Columbia's first student-led Human-Computer Interaction publication.",
    link: "https://ctpreview.com",
    caseStudyLink: "/case-study/columbia-hci-review",
  },
]

export default function WorkSection() {
  return (
    <section
      id="work"
      className="w-full bg-[#FDFBFA] pb-16 md:pb-32 px-[30px] md:px-[80px]"
    >
      <p style={{ fontFamily: PT, fontWeight: 400, fontSize: "16px", color: "#000000", marginBottom: "40px" }}>
        Crafting Products Used by Millions
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 md:gap-y-16">
        {allProjects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </section>
  )
}
