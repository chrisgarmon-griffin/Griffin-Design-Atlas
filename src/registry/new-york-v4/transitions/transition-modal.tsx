import { useEffect, useRef, useState } from "react"

const MODAL_CLOSE_DUR = 150

type OpenState = "open" | "closing" | "closed"

export function ModalTransition() {
  const [state, setState] = useState<OpenState>("closed")
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const openModal = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setState("open")
  }

  const closeModal = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setState("closing")
    timeoutRef.current = setTimeout(() => {
      setState("closed")
    }, MODAL_CLOSE_DUR)
  }

  const modalClass = "t-modal" + (state === "open" ? " is-open" : state === "closing" ? " is-closing" : "")

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "flex-start",
        minHeight: 130,
        width: "100%",
      }}
    >
      <style>{`
        :root {
          --modal-open-dur: 250ms;
          --modal-close-dur: 150ms;
          --modal-scale: 0.96;
          --modal-scale-close: 0.96;
          --modal-ease: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .t-modal {
          transform-origin: center;
          transform: scale(var(--modal-scale));
          opacity: 0;
          pointer-events: none;
          transition:
            transform var(--modal-open-dur) var(--modal-ease),
            opacity   var(--modal-open-dur) var(--modal-ease);
          will-change: transform, opacity;
        }
        .t-modal.is-open {
          transform: scale(1);
          opacity: 1;
          pointer-events: auto;
        }
        .t-modal.is-closing {
          transform: scale(var(--modal-scale-close));
          opacity: 0;
          pointer-events: none;
          transition:
            transform var(--modal-close-dur) var(--modal-ease),
            opacity   var(--modal-close-dur) var(--modal-ease);
        }
        @media (prefers-reduced-motion: reduce) {
          .t-modal { transition: none !important; }
        }
      `}</style>

      <button
        type="button"
        onClick={state === "closed" ? openModal : closeModal}
        style={{
          fontSize: 12,
          padding: "4px 10px",
          borderRadius: 6,
          border: "1px solid #d8d2c8",
          background: "#fff",
          color: "#3a362e",
          cursor: "pointer",
        }}
      >
        {state === "closed" ? "Open modal" : "Close modal"}
      </button>

      <div
        style={{
          position: "absolute",
          inset: 0,
          top: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: state === "closed" ? "transparent" : "rgba(58,54,46,0.08)",
          borderRadius: 10,
          transition: "background 150ms linear",
          pointerEvents: state === "closed" ? "none" : "auto",
        }}
      >
        <div
          className={modalClass}
          role="dialog"
          style={{
            width: 160,
            padding: 14,
            borderRadius: 10,
            background: "#fff",
            border: "1px solid #e2dccf",
            boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
            fontSize: 12,
            color: "#3a362e",
          }}
        >
          Modal content
        </div>
      </div>
    </div>
  )
}
