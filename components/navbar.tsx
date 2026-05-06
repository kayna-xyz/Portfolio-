"use client"

import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const isAboutPage = pathname === "/experience"

  return (
    <nav
      className="fixed left-0 right-0 z-[200]"
      style={{ top: 0 }}
    >
      <div
        className="flex w-full items-center justify-between"
        style={{
          maxWidth: "1728px",
          padding: "clamp(16px, 2.3vw, 40px) clamp(20px, 4.6vw, 80px)",
        }}
      >
        {/* Left: logo image */}
        <button onClick={() => router.push("/")} className="flex items-center cursor-pointer">
          <Image
            src="/logo.png"
            alt="Logo"
            width={65}
            height={68}
            style={{ objectFit: "contain" }}
            priority
          />
        </button>

        {/* Right: About link only */}
        <button
          onClick={() => router.push("/experience")}
          style={{
            fontFamily: "-apple-system, 'SF Pro Text', 'SF Pro Display', sans-serif",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "1",
            color: isAboutPage ? "#b0aeab" : "#474747",
          }}
          className="transition-colors duration-300 hover:text-[#b0aeab]"
        >
          About
        </button>
      </div>
    </nav>
  )
}
