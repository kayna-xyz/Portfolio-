"use client"

import Image from "next/image"

interface ProjectCardProps {
  image?: string
  video?: string
  category: string
  icon?: string
  iconImage?: string
  title: string
  description: string
  tags: string[]
  link?: string
  caseStudyLink?: string
  cursorLabel?: string
  comingSoon?: boolean
}

function ProjectCard({ image, video, category, title, description, link, caseStudyLink, cursorLabel, comingSoon }: ProjectCardProps) {
  const media = (
    <div className="w-full overflow-hidden mb-4 bg-[#e7e5e3]" style={{ borderRadius: 0 }}>
      {video ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image || ""}
          alt={title}
          className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
        />
      )}
    </div>
  )

  const content = (
    <div
      className={`group ${comingSoon ? "cursor-none" : "cursor-pointer"}`}
      data-cursor-label={comingSoon ? "Coming soon!" : (cursorLabel || "")}
    >
      {media}
      <p
        className="font-mono text-[#7b7a72] uppercase tracking-wider mb-2"
        style={{ fontSize: "14px" }}
      >
        {category}
      </p>
      <h3 className="font-normal text-[#474747] mb-2" style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif", fontSize: "24px" }}>
        {title}
      </h3>
      <p
        className="text-[#898989] leading-relaxed mb-3"
        style={{ fontFamily: '-apple-system, "SF Pro Text", "SF Pro Display", system-ui, sans-serif', fontSize: "16px" }}
      >
        {description}
      </p>
    </div>
  )

  if (comingSoon) return <div>{content}</div>

  const href = caseStudyLink || link
  return (
    <div>
      {href ? (
        <a
          href={href}
          {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="no-underline"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  )
}

const allProjects: ProjectCardProps[] = [
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%20143%20%281%29-26hDGXGiA9uYnC7tecymnhnK53Lmw4.png",
    category: "Product Design · Summer 2025",
    title: "HeyGen",
    description:
      "Architecting a seamless AI video translation and digital avatar experience for enterprise-scale communication.",
    tags: ["PC", "UI/UX"],
    link: "https://www.heygen.com/",
    caseStudyLink: "/case-study/heygen-enterprise",
    cursorLabel: "Unicorn era",
  },
  {
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/goglowcover-xBi7iHjGeFHJ6C5ZkK8Lkh1wV7wJH1.mp4",
    category: "DESIGN ENGINEERING · AI SaaS · 2026",
    title: "Lluna",
    description:
      "Lluna lives in your medspa, an AI consultant that prepares every client before they sit in the chair.",
    tags: [],
    link: "https://lluna.ai",
    caseStudyLink: "/case-study/lluna",
    cursorLabel: "Glow up!",
  },
  {
    image: "/flowr-cover.png",
    category: "DESIGN ENGINEERING · BCI APP · 2026",
    title: "Flowr",
    description: "A BCI game where your mind is the controller, built on Emotiv, Flowr transforms brain signals into real-time gameplay.",
    tags: [],
    comingSoon: true,
  },
  {
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screen-studio-7A2NmU2Zac-2kRohHsEeLTG1d4A17ZCN3uaLeyUNr.mp4",
    category: "Product Design · Summer 2025",
    title: "HeyGen Mobile",
    description:
      "Crafting an on-the-go AI video editing experience that empowers mobile users to capture and realize creative inspiration anywhere.",
    tags: ["iOS", "UI/UX"],
    link: "https://apps.apple.com/us/app/heygen-ai-video-generator/id6711356409",
    caseStudyLink: "/case-study/heygen-mobile",
    cursorLabel: "It was a good summer",
  },
  {
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fillercover-zeW22rOZkdtjGHesbavcfiMpuPpPpX.mp4",
    category: "PERSONAL PROJECT · 2026",
    title: "Fillr",
    description:
      "The fastest filler reference tool for consumers: search any area, get ranked recommendations for FDA authorized fillers in seconds.",
    tags: [],
    link: "https://v0-filler-search-tool.vercel.app/",
    cursorLabel: "Fill it up",
  },
  {
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Google%20Chrome-PR77RBIdDfEs1zKLgn0EuDKBOrgdgO.mp4",
    category: "PERSONAL PROJECT · 2026",
    title: "Signal-32",
    description:
      "A statistical tool running with LLM API designed to help angel investors rapidly analyze and benchmark early-stage startups.",
    tags: ["UI/UX", "Engineering"],
    link: "https://claude.ai/public/artifacts/6fc90c85-daf1-40fa-ac29-2a33b5b1939b",
    caseStudyLink: "/case-study/signal-32",
    cursorLabel: "Assess your next invest",
  },
  {
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Frame%2011%20%281%29-w47aUzGMwXkxfzVBCpJH92TtNnk0La.png",
    category: "SCHOOL MAGAZINE · 2026",
    title: "Columbia HCI Review",
    description:
      "Leading the visual identity and social media design strategy for Columbia's first student-led Human-Computer Interaction publication.",
    tags: ["Brand Design", "UI/UX", "Engineering"],
    link: "https://ctpreview.com",
    caseStudyLink: "/case-study/columbia-hci-review",
    cursorLabel: "First of its kind",
  },
]

const sections = [
  {
    index: "01",
    title: "Crafting Products Used by Millions",
    projectTitles: ["HeyGen", "Lluna", "Flowr", "HeyGen Mobile"],
  },
  {
    index: "02",
    title: "Building Interesting Tools",
    projectTitles: ["Fillr", "Signal-32"],
  },
  {
    index: "03",
    title: "Exploring Zen Aesthetics & Brand Design",
    projectTitles: ["Columbia HCI Review"],
  },
]

function SectionHeader({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-10">
      <p
        className="font-mono text-[#b0aeab] uppercase tracking-wider mb-2"
        style={{ fontSize: "11px" }}
      >
        {index}
      </p>
      <h2
        className="font-mono text-[#7b7a72] uppercase tracking-wider"
        style={{ fontSize: "14px" }}
      >
        {title}
      </h2>
    </div>
  )
}

export default function WorkSection() {
  return (
    <section
      id="work"
      className="w-full bg-[#FDFBFA] pb-16 md:pb-32 px-5 md:px-[70px]"
    >
      <div className="flex flex-col gap-16 md:gap-20">
        {sections.map((section) => {
          const projects = section.projectTitles.map(
            (t) => allProjects.find((p) => p.title === t)!
          )
          return (
            <div key={section.index}>
              <SectionHeader index={section.index} title={section.title} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                {projects.map((project) => (
                  <ProjectCard key={project.title} {...project} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
