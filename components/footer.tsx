"use client"

import { ChevronUp } from "lucide-react"

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer
      className="w-full bg-[#FDFBFA] px-5 md:px-[70px]"
      style={{ borderTop: "1px solid #eae8e6" }}
    >
      <div className="pt-10 pb-6">
        <h2
          className="text-[#5F5F5F] leading-[1.2] text-[28px] md:text-[40px]"
          style={{ fontFamily: "var(--font-ibm-plex-serif), 'Georgia', serif" }}
        >
          {"Let\u2019s chat!"}
        </h2>

        <div className="flex items-center gap-1 mt-3 font-mono" style={{ fontSize: "16px" }}>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-[#5F5F5F] hover:text-[#000000] transition-colors"
          >
            <ChevronUp size={16} strokeWidth={1.5} />
            <span>Back to the top</span>
          </button>
          <span className="text-[#b0aeab] mx-2">or</span>
          <a
            href="https://x.com/kayna_xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5F5F5F] hover:text-[#000000] transition-colors no-underline"
          >
            Say hi
          </a>
        </div>
      </div>

      <div className="pb-8 pt-20">
        <p className="text-[#9e9b98]" style={{ fontSize: "16px", fontFamily: "'SF Pro', -apple-system, system-ui, sans-serif" }}>
          Made by Kayna @2026
        </p>
      </div>
    </footer>
  )
}
