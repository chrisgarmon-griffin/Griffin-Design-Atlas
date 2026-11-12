import { useEffect, useRef, useState } from "react"

type Phase = "hidden" | "shown" | "hiding"

export function TextsRevealTransition() {
  const [phase, setPhase] = useState<Phase>("shown")
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [])

  const showText = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    setPhase("hidden")
    requestAnimationFrame(() => setPhase("shown"))
  }

  const hideText = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    setPhase("hiding")
    hideTimer.current = setTimeout(() => setPhase("hidden"), 200)
  }

  const toggle = () => {
    if (phase === "shown") hideText()
    else showText()
  }

  const isShown = phase === "shown"
  const isHiding = phase === "hiding"

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start", width: "100%" }}>
      <style>{`
        :root {
          --stagger-dur: 500ms;
          --stagger-distance: 12px;
          --stagger-stagger: 40ms;
          --stagger-blur: 3px;
          --stagger-ease: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .t-stagger-line {
          display: block;
          opacity: 0;
          transform: translateY(var(--stagger-distance));
          filter: blur(var(--stagger-blur));
          transition:
            opacity   var(--stagger-dur) var(--stagger-ease),
            transform var(--stagger-dur) var(--stagger-ease),
            filter    var(--stagger-dur) var(--stagger-ease);
          will-change: transform, opacity, filter;
        }
        .t-stagger-line--2 { transition-delay: var(--stagger-stagger); }
        .t-stagger.is-shown .t-stagger-line {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }
        .t-stagger.is-hiding .t-stagger-line {
          opacity: 0;
          transform: translateY(0);
          filter: blur(0);
          transition:
            opacity 200ms ease,
            transform 0s linear,
            filter 0s linear;
          transition-delay: 0s;
        }
        @media (prefers-reduced-motion: reduce) {
          .t-stagger-line { transition: none !important; }
        }
      `}</style>
      <div className={`t-stagger${isShown ? " is-shown" : ""}${isHiding ? " is-hiding" : ""}`}>
        <strong className="t-stagger-line t-stagger-line--1" style={{ fontSize: 16, color: "#2f2a22" }}>
          Welcome back
        </strong>
        <span className="t-stagger-line t-stagger-line--2" style={{ fontSize: 12, color: "#8a8275" }}>
          Pick up where you left off
        </span>
      </div>
      <button
        type="button"
        onClick={toggle}
        style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid #d8d2c8", background: "#f5f1ea", cursor: "pointer" }}
      >
        {isShown ? "Hide" : "Show"}
      </button>
    </div>
  )
}
