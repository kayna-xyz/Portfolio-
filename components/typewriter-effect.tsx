"use client"

import { useEffect, useRef, useState } from "react"

interface TypewriterEffectProps {
  words: { word: string }[]
  typingSpeed?: number
  backspaceSpeed?: number
  pauseDuration?: number
  loop?: boolean
  showCaret?: boolean
  caretStyle?: "bar" | "underscore"
  caretColor?: string
  className?: string
  style?: React.CSSProperties
}

export default function TypewriterEffect({
  words = [{ word: "Hello" }],
  typingSpeed = 80,
  backspaceSpeed = 40,
  pauseDuration = 1000,
  loop = false,
  showCaret = true,
  caretStyle = "bar",
  caretColor = "#ffffff",
  className,
  style,
}: TypewriterEffectProps) {
  const [displayed, setDisplayed] = useState("")
  const [phase, setPhase] = useState<"typing" | "pausing" | "backspacing">("typing")
  const [wordIndex, setWordIndex] = useState(0)
  const [caretVisible, setCaretVisible] = useState(true)
  const caretInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentWord = words[wordIndex]?.word || ""

  // Caret blinking
  useEffect(() => {
    if (!showCaret) return
    caretInterval.current = setInterval(() => {
      setCaretVisible((v) => !v)
    }, 500)
    return () => {
      if (caretInterval.current) clearInterval(caretInterval.current)
    }
  }, [showCaret])

  // Typewriter logic
  useEffect(() => {
    if (phase === "typing") {
      if (displayed.length < currentWord.length) {
        typingTimeout.current = setTimeout(() => {
          setDisplayed(currentWord.slice(0, displayed.length + 1))
        }, typingSpeed)
      } else {
        typingTimeout.current = setTimeout(() => {
          setPhase("pausing")
        }, pauseDuration)
      }
    } else if (phase === "pausing") {
      if (wordIndex < words.length - 1 || loop) {
        typingTimeout.current = setTimeout(() => {
          setPhase("backspacing")
        }, pauseDuration)
      }
    } else if (phase === "backspacing") {
      if (displayed.length > 0) {
        typingTimeout.current = setTimeout(() => {
          setDisplayed(currentWord.slice(0, displayed.length - 1))
        }, backspaceSpeed)
      } else {
        if (wordIndex < words.length - 1) {
          setWordIndex(wordIndex + 1)
          setPhase("typing")
        } else if (loop) {
          setWordIndex(0)
          setPhase("typing")
        }
      }
    }
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current)
    }
  }, [phase, displayed, wordIndex, currentWord, typingSpeed, backspaceSpeed, pauseDuration, loop, words])

  // Reset when words change
  useEffect(() => {
    setDisplayed("")
    setPhase("typing")
    setWordIndex(0)
  }, [words])

  return (
    <span
      className={className}
      style={{
        ...style,
        display: "inline-flex",
        alignItems: "center",
        minWidth: 5,
      }}
      aria-live="polite"
    >
      {displayed}
      {showCaret && (
        caretStyle === "bar" ? (
          <span
            style={{
              display: "inline-block",
              width: 3,
              height: "0.9em",
              background: caretColor,
              marginLeft: 2,
              opacity: caretVisible ? 1 : 0,
              transition: "opacity 0.2s",
              borderRadius: 1,
            }}
            aria-hidden="true"
          />
        ) : (
          <span
            style={{
              color: caretColor,
              marginLeft: 2,
              opacity: caretVisible ? 1 : 0,
              transition: "opacity 0.2s",
              lineHeight: "1",
            }}
            aria-hidden="true"
          >
            _
          </span>
        )
      )}
    </span>
  )
}
