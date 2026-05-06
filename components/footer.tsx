"use client"

const SF = "-apple-system, 'SF Pro Text', 'SF Pro Display', sans-serif"

export default function Footer() {
  return (
    <footer className="px-[30px] md:px-[80px] py-[40px]" style={{ background: "transparent" }}>
      <p style={{ fontFamily: SF, fontWeight: 400, fontSize: "16px", color: "#4B4948", textAlign: "right" }}>
        ALL RIGHTS RESERVED<br />@KAYNA HUANG
      </p>
    </footer>
  )
}
