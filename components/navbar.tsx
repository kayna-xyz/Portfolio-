"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("")
  const pathname = usePathname()
  const router = useRouter()
  const isHomePage = pathname === "/"
  const isAboutPage = pathname === "/experience"

  useEffect(() => {
    if (!isHomePage) return

    const handleScroll = () => {
      const sections = ["about", "work"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.getBoundingClientRect().top + window.scrollY
          const offsetHeight = element.getBoundingClientRect().height
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isHomePage])

  const scrollToSection = (sectionId: string) => {
    if (!isHomePage) {
      router.push(`/#${sectionId}`)
      return
    }
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav className="fixed left-0 right-0 z-[200]" style={{ top: "0px" }}>
      {/* Progressive blur with blur-2 baseline: stacked layers */}
      <div className="absolute inset-x-0 top-0 h-[68px] pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-[56px]"
          style={{
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-[44px]"
          style={{
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-[32px]"
          style={{
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-[20px]"
          style={{
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          }}
        />
        {/* Subtle white tint - 80% opacity */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0.80) 0%, rgba(255,255,255,0.40) 50%, transparent 100%)",
          }}
        />
      </div>

      {/* Actual nav content - positioned from top */}
      <div
        className="relative flex items-center justify-between py-3 px-5 md:px-[70px]"
      >
        {/* Left: Name */}
        <button
          onClick={() => scrollToSection("about")}
          className="flex items-center justify-center h-11 rounded-[30px]"
        >
          <span className="text-[#474747] text-sm md:text-base font-mono leading-4">
            Kayna Huang
          </span>
        </button>

        {/* Right: Nav links */}
        <div className="flex items-center gap-3 sm:gap-6 md:gap-[54px]">
          {([
            { id: "about", label: "Home" },
            { id: "work", label: "Work" },
          ] as const).map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm md:text-base font-mono leading-4 transition-all duration-300 whitespace-nowrap ${
                isHomePage && activeSection === section.id
                  ? "text-[#b0aeab]"
                  : "text-[#474747] hover:text-[#b0aeab]"
              }`}
            >
              {section.label}
            </button>
          ))}
          <button
            onClick={() => router.push("/experience")}
            className={`px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm md:text-base font-mono leading-4 transition-all duration-300 whitespace-nowrap ${
              isAboutPage ? "text-[#b0aeab]" : "text-[#474747] hover:text-[#b0aeab]"
            }`}
          >
            About
          </button>
        </div>
      </div>
    </nav>
  )
}
