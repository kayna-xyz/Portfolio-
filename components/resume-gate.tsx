"use client"

import { useEffect, useRef, useState } from "react"
import IosAlert from "@/components/ios-alert"

// iOS-system-alert-style password prompt for the resume link. The check is
// client-side only (the PDF itself stays publicly reachable at its URL).
const PASSWORD = "88888888"
const RESUME_URL = "/resume.pdf"

export default function ResumeGate({
  className,
  style,
  children,
}: {
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [pw, setPw] = useState("")
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const close = () => {
    setOpen(false)
    setPw("")
    setShake(false)
  }

  const submit = () => {
    if (pw === PASSWORD) {
      close()
      window.open(RESUME_URL, "_blank", "noopener")
    } else {
      setPw("")
      setShake(false)
      requestAnimationFrame(() => setShake(true))
      inputRef.current?.focus()
    }
  }

  return (
    <>
      <a
        href={RESUME_URL}
        className={className}
        style={style}
        onClick={(e) => {
          e.preventDefault()
          setOpen(true)
        }}
      >
        {children}
      </a>

      {open && (
        <IosAlert
          title="Resume Locked"
          message="enter the password to open it."
          ariaLabel="Resume password"
          shake={shake}
          onDismiss={close}
          buttons={[
            { label: "Cancel", onClick: close },
            { label: "OK", onClick: submit, bold: true },
          ]}
        >
          <input
            ref={inputRef}
            className="rg-input"
            type="password"
            inputMode="numeric"
            placeholder="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit()
              if (e.key === "Escape") close()
            }}
          />
        </IosAlert>
      )}
    </>
  )
}
