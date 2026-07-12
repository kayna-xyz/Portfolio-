"use client"

import { useEffect, useRef, useState } from "react"

// iOS-system-alert-style password prompt for the resume link. The check is
// client-side only (the PDF itself stays publicly reachable at its URL).
const PASSWORD = "88888888"
const RESUME_URL = "/resume.pdf"
const SF =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif'

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
        <div className="rg-backdrop" role="dialog" aria-modal="true" aria-label="Resume password" onClick={close}>
          <div className={`rg-alert${shake ? " rg-shake" : ""}`} onClick={(e) => e.stopPropagation()}>
            <p className="rg-title">Resume Locked</p>
            <p className="rg-msg">enter the password to open it.</p>
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
            <div className="rg-buttons">
              <button className="rg-btn" onClick={close}>
                Cancel
              </button>
              <button className="rg-btn rg-btn--ok" onClick={submit}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .rg-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9500;
          background: rgba(0, 0, 0, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: rg-fade 0.18s ease-out;
        }
        .rg-alert {
          width: 270px;
          background: rgba(248, 248, 248, 0.94);
          backdrop-filter: blur(20px);
          border-radius: 14px;
          overflow: hidden;
          font-family: ${SF};
          text-align: center;
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.3);
          animation: rg-pop 0.22s cubic-bezier(0.2, 0.9, 0.3, 1.2);
        }
        .rg-shake {
          animation: rg-shake-kf 0.4s ease;
        }
        .rg-alert .rg-title {
          font-size: 17px;
          font-weight: 600;
          color: #1d1d1f;
          margin: 19px 16px 0;
        }
        .rg-alert .rg-msg {
          font-size: 13px;
          line-height: 1.35;
          color: #1d1d1f;
          margin: 4px 16px 0;
        }
        .rg-alert .rg-input {
          display: block;
          width: calc(100% - 32px);
          margin: 14px 16px 18px;
          padding: 6px 8px;
          font-family: inherit;
          font-size: 13px;
          color: #1d1d1f;
          background: #ffffff;
          border: 1px solid #d1d1d6;
          border-radius: 7px;
          outline: none;
          text-align: center;
        }
        .rg-alert .rg-input::placeholder {
          color: #aeaeb2;
        }
        .rg-buttons {
          display: flex;
          border-top: 0.5px solid rgba(0, 0, 0, 0.18);
        }
        .rg-btn {
          flex: 1 1 0;
          padding: 11px 0;
          font-family: inherit;
          font-size: 17px;
          color: #007aff;
          background: none;
          border: none;
          cursor: pointer;
        }
        .rg-btn + .rg-btn {
          border-left: 0.5px solid rgba(0, 0, 0, 0.18);
        }
        .rg-btn--ok {
          font-weight: 600;
        }
        .rg-btn:active {
          background: rgba(0, 0, 0, 0.06);
        }
        @keyframes rg-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes rg-pop {
          from {
            opacity: 0;
            transform: scale(1.1);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes rg-shake-kf {
          0%, 100% {
            transform: translateX(0);
          }
          20%, 60% {
            transform: translateX(-9px);
          }
          40%, 80% {
            transform: translateX(9px);
          }
        }
      `}</style>
    </>
  )
}
