"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { usePathname } from "next/navigation"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"


type Position = "bottom-right" | "bottom-left"

// Persist across re-mounts (Next.js client navigation)
let hasAnimated = false
let persistedIsPacked: boolean | null = null
let hasAutoGreeted = false

function getMessageText(msg: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!msg.parts || !Array.isArray(msg.parts)) return ""
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

export default function ChatBot() {
  const [isPacked, _setIsPacked] = useState(persistedIsPacked ?? false)
  const setIsPacked = useCallback((v: boolean) => {
    persistedIsPacked = v
    _setIsPacked(v)
  }, [])
  const [input, setInput] = useState("")
  const [position, setPosition] = useState<Position>("bottom-right")
  const pathname = usePathname()

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isStreaming = status === "streaming" || status === "submitted"

  // Drag state
  const [translateX, setTranslateX] = useState(0)
  const isDraggingRef = useRef(false)
  const dragDataRef = useRef({ startX: 0, startTranslateX: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return
      const delta = e.clientX - dragDataRef.current.startX
      setTranslateX(dragDataRef.current.startTranslateX + delta)
    }
    const onUp = () => {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      forceUpdate((n) => n + 1)
      const el = containerRef.current
      if (!el) { setTranslateX(0); return }
      const rect = el.getBoundingClientRect()
      const center = rect.left + rect.width / 2
      if (center < window.innerWidth / 2) {
        setPosition("bottom-left")
      } else {
        setPosition("bottom-right")
      }
      setTranslateX(0)
    }
    document.addEventListener("pointermove", onMove)
    document.addEventListener("pointerup", onUp)
    return () => {
      document.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerup", onUp)
    }
  }, [])

  const onHeaderPointerDown = useCallback((e: React.PointerEvent) => {
    const target = e.target as HTMLElement
    if (target.closest("button")) return
    isDraggingRef.current = true
    dragDataRef.current = { startX: e.clientX, startTranslateX: translateX }
    forceUpdate((n) => n + 1)
  }, [translateX])

  const handleSend = () => {
    if (!input.trim() || isStreaming) return
    const text = input.trim()
    setInput("")
    sendMessage({ text })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Auto-greeting: if user doesn't send a message within 15 seconds, show a greeting
  const [autoGreeting, setAutoGreeting] = useState<string | null>(null)

  useEffect(() => {
    if (hasAutoGreeted || messages.length > 0) return
    const timer = setTimeout(() => {
      if (hasAutoGreeted) return
      hasAutoGreeted = true
      setAutoGreeting(
        "hey~ I'm kayna.bot, I live on this site lol\nI can help you navigate, answer questions about kayna, or just chat!\n\nSome things you could ask me:\n- What does kayna do?\n- Show me her work\n- What's her vibe outside of work?"
      )
    }, 15000)
    return () => clearTimeout(timer)
  }, [messages.length])

  // Context-aware: detect when user scrolls to the Room section
  const roomTipSentRef = useRef(false)
  const [contextMessages, setContextMessages] = useState<Array<{ id: string; text: string }>>([])

  useEffect(() => {
    const roomEl = document.getElementById("room")
    if (!roomEl) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !roomTipSentRef.current) {
          roomTipSentRef.current = true
          const isMobile = window.innerWidth < 768
          const tip = isMobile
            ? "Use two fingers to drag and explore Kayna's Room!"
            : "Use your cursor to drag and explore Kayna's Room!"
          setContextMessages((prev) => [...prev, { id: "room-tip", text: tip }])
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(roomEl)
    return () => observer.disconnect()
  }, [])

  // Case study proactive greeting
  const caseStudyTipSentRef = useRef<string | null>(null)
  useEffect(() => {
    if (!pathname?.startsWith("/case-study/")) return
    const slug = pathname.replace("/case-study/", "")
    if (caseStudyTipSentRef.current === slug) return
    caseStudyTipSentRef.current = slug

    const nameMap: Record<string, string> = {
      "heygen-enterprise": "HeyGen Enterprise",
      "heygen-mobile": "HeyGen Mobile",
      "signal-32": "Signal-32",
      "goglow-ai": "GoGlow",
      "columbia-hci-review": "Columbia HCI Review",
    }
    const name = nameMap[slug] || slug
    const tip = `You're reading the ${name} case study! Feel free to ask me anything about it -- the design decisions, process, tools used, or anything else you're curious about.`
    setContextMessages((prev) => {
      if (prev.some((m) => m.id === "case-study-tip")) return prev
      return [...prev, { id: "case-study-tip", text: tip }]
    })
  }, [pathname])

  const handleQuickAction = (action: string) => {
    if (action === "works") {
      document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleEmailQuick = () => {
    sendMessage({ text: "What is Kayna's email?" })
  }

  const isDragging = isDraggingRef.current

  const positionStyles: React.CSSProperties = position === "bottom-right"
    ? { bottom: 16, right: 16, left: "auto" }
    : { bottom: 16, left: 16, right: "auto" }

  const containerStyle: React.CSSProperties = {
    ...positionStyles,
    transform: `translateX(${translateX}px)`,
    transition: isDragging ? "none" : "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), left 0.4s ease, right 0.4s ease",
  }

  const InputBox = (
    <div className="px-[16px] pb-[10px] pt-2 shrink-0">
      <div className="flex items-center rounded-full border border-[#d8d5d2] bg-[#edeae7] overflow-hidden" style={{ height: "42px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Say Anything..."
          className="flex-1 px-[18px] py-2 bg-transparent text-[#474747] placeholder-[#b0aeab] focus:outline-none"
          style={{ fontSize: "16px", fontFamily: "'SF Pro', -apple-system, system-ui, sans-serif" }}
        />

      </div>
    </div>
  )

  const FooterEl = (
    <div className="pb-[14px] pt-[4px] text-center shrink-0">
      <span className="text-[#c8c5c2]" style={{ fontSize: "12px", fontFamily: "'SF Pro', -apple-system, system-ui, sans-serif" }}>Made by K.</span>
    </div>
  )

  const HeaderEl = ({ onAction, label }: { onAction: () => void; label: string }) => (
    <div
      className="flex items-center justify-between px-[20px] pt-[18px] pb-2 shrink-0"
      style={{ touchAction: "none", cursor: isDragging ? "grabbing" : "grab" }}
      onPointerDown={onHeaderPointerDown}
    >
      <span className="text-[#474747] font-medium font-mono leading-tight select-none" style={{ fontSize: "16px" }}>Kayna.bot</span>
      <button onClick={onAction} className="text-[#b0b0b0] hover:text-[#474747] transition-colors" aria-label={label}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 8L10 4L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 12L10 16L14 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )

  /* ===== Intro animation (hook must be before any conditional return) ===== */
  const showIntroAnim = !hasAnimated
  useEffect(() => {
    if (!hasAnimated) hasAnimated = true
  }, [])

  /* ===== Packed mode (collapsed) ===== */
  if (isPacked) {
    return (
      <div ref={containerRef} className="fixed z-[100]" style={containerStyle}>
        <div
          className={`w-[280px] sm:w-[320px] rounded-2xl flex flex-col ${isDragging ? "select-none" : ""}`}
          style={{ boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.1)", border: "0.8px solid #e7e5e3", backgroundColor: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(80px)", WebkitBackdropFilter: "blur(80px)" }}
        >
          <div className="overflow-hidden rounded-2xl flex flex-col">
            <HeaderEl onAction={() => setIsPacked(false)} label="Expand chatbot" />
            {InputBox}
            {FooterEl}
          </div>
        </div>
      </div>
    )
  }

  /* ===== Expanded mode ===== */
  const hasMessages = messages.length > 0

  return (
    <div ref={containerRef} className={`fixed z-[100] ${showIntroAnim ? "animate-bot-intro" : ""}`} style={containerStyle}>
      <div
        className={`w-[280px] sm:w-[320px] rounded-2xl flex flex-col ${isDragging ? "select-none" : ""}`}
        style={{ boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.1)", border: "0.8px solid #e7e5e3", height: "min(520px, calc(100vh - 60px))", backgroundColor: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(80px)", WebkitBackdropFilter: "blur(80px)" }}
      >
        <div className="overflow-hidden rounded-2xl flex flex-col flex-1 min-h-0">
        <HeaderEl onAction={() => setIsPacked(true)} label="Pack chatbot" />

        <div className="flex-1 overflow-y-auto px-[20px] py-3 space-y-3 min-h-0">
          {/* Default greeting - always show at top */}
          <div className="text-[#989898] leading-relaxed whitespace-pre-line" style={{ fontFamily: "'SF Pro', -apple-system, system-ui, sans-serif", fontSize: "16px" }}>
            {"Hey! I\u2019m Kayna.bot. I live on this site and know everything about her (maybe more than she\u2019d like).Ask me anything!"}
          </div>

          {/* Context-aware tips (e.g. Room drag tip) */}
          {contextMessages.map((tip) => (
            <div key={tip.id} className="flex justify-start">
              <div
                className="max-w-[85%] leading-relaxed whitespace-pre-line text-[#989898]"
                style={{ fontFamily: "'SF Pro', -apple-system, system-ui, sans-serif", fontSize: "16px" }}
              >
                {tip.text}
              </div>
            </div>
          ))}

          {/* Chat messages */}
          {messages.map((msg) => {
            const text = getMessageText(msg)
            if (!text) return null
            return (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] leading-relaxed whitespace-pre-line ${
                    msg.role === "user" ? "px-3 py-2 rounded-lg bg-[#474747] text-[#ffffff]" : "text-[#989898]"
                  }`}
                  style={{ fontFamily: "'SF Pro', -apple-system, system-ui, sans-serif", fontSize: "16px" }}
                >
                  {text}
                </div>
              </div>
            )
          })}
          {isStreaming && messages.length > 0 && !getMessageText(messages[messages.length - 1]) && (
            <div className="flex justify-start">
              <div className="text-[#c0bebb] text-sm font-mono animate-pulse">thinking...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {InputBox}
        {FooterEl}
        </div>
      </div>
    </div>
  )
}
