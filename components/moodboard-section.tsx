"use client"

import Image from "next/image"
import { useRef } from "react"
import { useScroll, useTransform, motion } from "framer-motion"

export default function MoodboardSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const scale = useTransform(scrollYProgress, [0, 0.3], [0.85, 1])
  const borderRadius = useTransform(scrollYProgress, [0, 0.3], [32, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.15], [0.6, 1])

  return (
    <motion.section
      id="moodboard"
      ref={sectionRef}
      style={{
        scale,
        opacity,
      }}
      className="relative w-full origin-center"
    >
      {/* Moodboard container matching Figma CSS */}
      <div
        className="relative mx-auto w-full max-w-[1528px]"
        style={{
          aspectRatio: "1528 / 960",
          boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.5)",
          borderRadius: "clamp(16px, 3vw, 40px)",
          overflow: "hidden",
        }}
      >
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/shutterstock-1041249343-2GWEpSowp73NNHnJAwJkvA4gKPK4Hl.webp"
          alt="Mars surface from space"
          fill
          className="object-cover object-top"
        />

        {/* Blurred top edge */}
        <div
          className="absolute top-0 left-0 right-0 z-10 h-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 40%, transparent 100%)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, transparent 100%)",
          }}
        />

        {/* Scattered moodboard items - positioned to match Figma layout (scaled to fit ~1440px design into responsive container) */}
        <div className="absolute inset-0 z-10">
          {/* Polaroid 1 - top left */}
          <div
            className="absolute"
            style={{
              top: "107px",
              left: "9.4%",
              width: "22%",
              maxWidth: "317.6px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Polaroid%20Frame-vGz4sSBqMvclXMnp3JIYpLKXjWr9dG.png"
              alt="The first Human-Computer Interaction club at Columbia founded"
              className="w-full h-auto"
              style={{
                boxShadow:
                  "0px 9.75px 10.19px rgba(0, 0, 0, 0.6)",
                borderRadius: "5.1px",
              }}
            />
          </div>

          {/* Polaroid 2 - top right area */}
          <div
            className="absolute"
            style={{
              top: "99px",
              left: "58%",
              width: "18.4%",
              maxWidth: "265.4px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Polaroid%20Frame%20%281%29-5sJJheUydicpmFSgdKEi9iZgE1HoS7.png"
              alt="Co-hosted the largest hackathon in China after high school"
              className="w-full h-auto"
              style={{
                boxShadow:
                  "0px 9.75px 10.19px rgba(0, 0, 0, 0.6)",
                borderRadius: "5.1px",
              }}
            />
          </div>

          {/* Polaroid 3 - middle */}
          <div
            className="absolute"
            style={{
              top: "185px",
              left: "33.3%",
              width: "18.4%",
              maxWidth: "265.4px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Polaroid%20Frame%20%281%29-5sJJheUydicpmFSgdKEi9iZgE1HoS7.png"
              alt="Co-hosted the largest hackathon in China"
              className="w-full h-auto"
              style={{
                boxShadow:
                  "0px 9.75px 10.19px rgba(0, 0, 0, 0.6)",
                borderRadius: "5.1px",
              }}
            />
          </div>

          {/* Polaroid 4 - bottom right */}
          <div
            className="absolute"
            style={{
              top: "461px",
              left: "80.3%",
              width: "22%",
              maxWidth: "317.6px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Polaroid%20Frame-vGz4sSBqMvclXMnp3JIYpLKXjWr9dG.png"
              alt="The first Human-Computer Interaction club at Columbia"
              className="w-full h-auto"
              style={{
                boxShadow:
                  "0px 9.75px 10.19px rgba(0, 0, 0, 0.6)",
                borderRadius: "5.1px",
              }}
            />
          </div>

          {/* Sticky note 1 - center */}
          <div
            className="absolute"
            style={{
              top: "398px",
              left: "45.5%",
              width: "23.3%",
              maxWidth: "336px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sticky%20note%20%281%29-X7QdpNntTcMQme7GBLFDLkp2v7Ues4.png"
              alt="Currently studying Cog Sci, Econ & Poli Sci"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Sticky note 2 - center right */}
          <div
            className="absolute"
            style={{
              top: "598px",
              left: "59.7%",
              width: "20.6%",
              maxWidth: "296.4px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sticky%20note%20%284%29-mGsMjExbfztBl4FqWJtBmwuOvJocKT.png"
              alt="A UX designer who codes and a product manager who designs"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Sticky note 3 - top far right */}
          <div
            className="absolute"
            style={{
              top: "89px",
              left: "77%",
              width: "23.3%",
              maxWidth: "336px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sticky%20note%20%281%29-X7QdpNntTcMQme7GBLFDLkp2v7Ues4.png"
              alt="Currently studying at Barnard College"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Sticky note 4 - bottom center left */}
          <div
            className="absolute"
            style={{
              top: "514px",
              left: "27.9%",
              width: "23.3%",
              maxWidth: "336px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sticky%20note%20%284%29-mGsMjExbfztBl4FqWJtBmwuOvJocKT.png"
              alt="A UX designer who codes and a product manager who designs"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Sticky note 5 - bottom left */}
          <div
            className="absolute"
            style={{
              top: "541px",
              left: "6.7%",
              width: "24.4%",
              maxWidth: "351px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sticky%20note%20%281%29-X7QdpNntTcMQme7GBLFDLkp2v7Ues4.png"
              alt="Barnard College of Columbia University"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Books! - top center */}
          <div
            className="absolute"
            style={{
              top: "105px",
              left: "39%",
              width: "15%",
              maxWidth: "216px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Books%21-IS1M0BznV7FKhknhzu8cO6D0MKbqE6.jpg"
              alt="Books!"
              className="w-full h-auto rounded-lg"
              style={{
                boxShadow: "0px 9.75px 10.19px rgba(0, 0, 0, 0.6)",
              }}
            />
          </div>

          {/* Sketching - middle left */}
          <div
            className="absolute"
            style={{
              top: "320px",
              left: "13%",
              width: "14%",
              maxWidth: "202px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sketching-94ydED0g3uj6w0SrEUrJgswDuunrMD.jpg"
              alt="Sketching"
              className="w-full h-auto rounded-lg"
              style={{
                boxShadow: "0px 9.75px 10.19px rgba(0, 0, 0, 0.6)",
              }}
            />
          </div>

          {/* Cairo! - bottom center */}
          <div
            className="absolute"
            style={{
              top: "625px",
              left: "36%",
              width: "16%",
              maxWidth: "231px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cairo%21-KzZD4TO4Z7AFSJR4rHf8gidiQ380kl.jpg"
              alt="Cairo!"
              className="w-full h-auto rounded-lg"
              style={{
                boxShadow: "0px 9.75px 10.19px rgba(0, 0, 0, 0.6)",
              }}
            />
          </div>

          {/* My artworks again. - top right corner */}
          <div
            className="absolute"
            style={{
              top: "315px",
              left: "81%",
              width: "13%",
              maxWidth: "187px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/My%20artworks%20again.-9BnrOdshy8aoWDnI70S5oTwKRP0QZg.png"
              alt="My artworks again."
              className="w-full h-auto rounded-lg"
              style={{
                boxShadow: "0px 9.75px 10.19px rgba(0, 0, 0, 0.6)",
              }}
            />
          </div>

          {/* My artworks - far right */}
          <div
            className="absolute"
            style={{
              top: "545px",
              left: "88%",
              width: "11.5%",
              maxWidth: "165px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/My%20artworks-USeJevVCgBi4Dt7gKNCxsqtuGvHFMl.png"
              alt="My artworks"
              className="w-full h-auto rounded-lg"
              style={{
                boxShadow: "0px 9.75px 10.19px rgba(0, 0, 0, 0.6)",
              }}
            />
          </div>

        </div>
      </div>

      {/* @2026 footer text - positioned below the moodboard container */}
      <div
        className="w-full flex justify-center font-mono text-sm md:text-[16px] text-[#ffffff] leading-none mt-12 md:mt-[105px]"
      >
        @2026
      </div>
    </motion.section>
  )
}
