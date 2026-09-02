"use client"

import { useEffect } from "react"

// iOS-system-alert shell shared by the resume password gate (footer) and the
// "still building" notice on locked KyNotes entries. Renders backdrop + card;
// the caller supplies the message, optional input, and buttons.
const SF =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif'

export type IosAlertButton = {
  label: string
  onClick: () => void
  bold?: boolean
}

export default function IosAlert({
  title,
  message,
  buttons,
  onDismiss,
  shake = false,
  ariaLabel,
  children,
}: {
  title: string
  message: string
  buttons: IosAlertButton[]
  onDismiss: () => void
  shake?: boolean
  ariaLabel?: string
  children?: React.ReactNode
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onDismiss])

  return (
    <>
      <div
        className="rg-backdrop"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? title}
        onClick={onDismiss}
      >
        <div
          className={`rg-alert${shake ? " rg-shake" : ""}${children ? "" : " rg-alert--plain"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="rg-title">{title}</p>
          <p className="rg-msg">{message}</p>
          {children}
          <div className="rg-buttons">
            {buttons.map((b) => (
              <button
                key={b.label}
                className={`rg-btn${b.bold ? " rg-btn--ok" : ""}`}
                onClick={b.onClick}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

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
        .rg-alert--plain .rg-msg {
          margin-bottom: 18px;
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
          0%,
          100% {
            transform: translateX(0);
          }
          20%,
          60% {
            transform: translateX(-9px);
          }
          40%,
          80% {
            transform: translateX(9px);
          }
        }
      `}</style>
    </>
  )
}
