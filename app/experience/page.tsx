"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"

const albumItems = [
  { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Books%21-IS1M0BznV7FKhknhzu8cO6D0MKbqE6.jpg", label: "Books!" },
  { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WechatIMG2522-DXrJGIiISGkYIwkzx3znashXBdeS20.jpg", label: "Me" },
  { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WechatIMG2533-Ps2kzoy2lKLBrbnryRaRcTaM15r6J4.jpg", label: "Matcha!" },
  { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/My%20artworks-USeJevVCgBi4Dt7gKNCxsqtuGvHFMl.png", label: "My artworks" },
  { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WechatIMG2531-Xy08U1GbdV5mj7ayyL46EaiVXr1srU.jpg", label: "Central Park in summer" },
  { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WechatIMG2530-DaBKsE9T5YZL2fWsjwnk3DJiTbJFsA.jpg", label: "Kyoto!" },
  { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WechatIMG2529-ByLSh3XWts62uVN4QwkYaALB4gFlRy.jpg", label: "Butler Library" },
  { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-02-13%20at%2019.08.30-hajJSsJtlma7McNUyPhpwOrVBRwhA7.png", label: "Calligraphy - \u884c\u4e66" },
  { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WechatIMG2525-uDRAzLQQ2Vx4oDOMdQoJ5kPqAD2R8C.jpg", label: "my cat..." },
  { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sketching-94ydED0g3uj6w0SrEUrJgswDuunrMD.jpg", label: "Sketching" },
  { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cairo%21-KzZD4TO4Z7AFSJR4rHf8gidiQ380kl.jpg", label: "Cairo!" },
  { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/My%20artworks%20again.-9BnrOdshy8aoWDnI70S5oTwKRP0QZg.png", label: "My artworks again." },
]

export default function ExperiencePage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const col1 = albumItems.filter((_, i) => i % 2 === 0)
  const col2 = albumItems.filter((_, i) => i % 2 === 1)

  return (
    <main className="relative min-h-screen bg-[#fdfbfa]">
      <Navbar />
      <div
        className="max-w-[900px] mx-auto px-6 md:px-12 pt-[140px] pb-[80px] transition-all duration-700 ease-out"
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? "translateY(0)" : "translateY(30px)",
        }}
      >
        {/* ===== Intro ===== */}
        <section className="mb-16">
          <h1
            className="font-serif text-[28px] md:text-[36px] text-[#474747] mb-6"
            style={{ fontStyle: "italic" }}
          >
            About me
          </h1>
          <p className="text-[15px] text-[#6b6966] leading-relaxed mb-4">
            {"Hi, I'm Kayna! I'm currently a sophomore studying Cognitive Science & Political Science at Barnard College of Columbia University."}
          </p>
          <p className="text-[15px] text-[#6b6966] leading-relaxed mb-4">
            {"My favorite restaurant in NYC is Samwoojung, and you can check out my 2025–26 reading list "}
            <a
              href="https://www.notion.so/Reading-List-308dd3c14a8e808dbff4db060e76c2ea"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#21A5D5] hover:text-[#1a8ab0] transition-colors underline"
            >
              here
            </a>
            .
          </p>
          <p className="text-[15px] text-[#6b6966] leading-relaxed mb-2">
            Outside of design I{"'"}m:
          </p>
          <ul className="text-[15px] text-[#6b6966] leading-relaxed space-y-1 ml-5 list-disc mb-4">
            <li>Starting most weekday mornings with a matcha from Joe{"'"}s Coffee</li>
            <li>Drawing & Chinese Calligraphy, skiing, poker nights with friends</li>
          </ul>
          <p className="text-[15px] text-[#6b6966] leading-relaxed">
            Feel free to reach out via{" "}
            <a
              href="mailto:kh3443@barnard.edu"
              className="text-[#21A5D5] hover:text-[#1a8ab0] transition-colors underline"
            >
              kh3443@barnard.edu
            </a>
            {" or "}
            <a
              href="mailto:kh3443@columbia.edu"
              className="text-[#21A5D5] hover:text-[#1a8ab0] transition-colors underline"
            >
              kh3443@columbia.edu
            </a>
          </p>
        </section>

        {/* ===== Writing ===== */}
        <section className="mb-16">
          <h2
            className="font-serif text-[22px] text-[#474747] mb-6"
            style={{ fontStyle: "italic" }}
          >
            Writing
          </h2>
        </section>

        {/* ===== Album ===== */}
        <section>
          <h2
            className="font-serif text-[22px] text-[#474747] mb-6"
            style={{ fontStyle: "italic" }}
          >
            Album
          </h2>

          {/* Masonry two-column layout */}
          <div className="flex gap-3">
            {[col1, col2].map((col, colIdx) => (
              <div key={colIdx} className="flex-1 flex flex-col gap-3">
                {col.map((item, idx) => (
                  <div
                    key={idx}
                    className="group relative overflow-hidden transition-all hover:shadow-xl duration-300"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.src}
                      alt={item.label}
                      className="w-full h-auto object-cover"
                    />
                    {/* Hover overlay with label */}
                    <div
                      className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <span className="text-white text-[13px] font-medium drop-shadow-sm">
                        {item.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
