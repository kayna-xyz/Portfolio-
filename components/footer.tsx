"use client"

const SF = "-apple-system, 'SF Pro Text', 'SF Pro Display', sans-serif"

export default function Footer() {
  return (
    <footer className="px-[30px] md:px-[80px] py-[40px]" style={{ background: "transparent" }}>
      <div className="flex flex-col md:flex-row md:items-stretch gap-6 md:gap-0">
        {/* Left: video */}
        <div className="w-full md:w-auto md:flex-shrink-0">
          <video
            src="/lake.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full md:w-[766px] md:h-[212px] object-cover block"
          />
        </div>

        {/* Right: text pinned top-right and bottom-right */}
        <div className="flex md:flex-col md:justify-between md:items-end md:flex-1 md:pl-10 flex-row justify-between items-end">
          <p style={{ fontFamily: SF, fontWeight: 400, fontSize: "16px", color: "#4B4948", margin: 0 }}>
            THE LAKE
          </p>
          <p style={{ fontFamily: SF, fontWeight: 400, fontSize: "16px", color: "#4B4948", margin: 0, textAlign: "right" }}>
            ALL RIGHTS RESERVED<br />@KAYNA HUANG
          </p>
        </div>
      </div>
    </footer>
  )
}
