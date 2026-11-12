import { useEffect, useRef, useState } from "react"

const TEXT_SWAP_DUR = 150

const STATES = ["Processing…", "Done"]

type Phase = "idle" | "exit" | "enterStart" | "settled"

export function TextStatesSwapTransition() {
  const [labelIndex, setLabelIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>("idle")
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    return () => {
      timeouts.current.forEach(clearTimeout)
      timeouts.current = []
    }
  }, [])

  const swapText = () => {
    timeouts.current.forEach(clearTimeout)
    timeouts.current = []

    setPhase("exit")

    const t1 = setTimeout(() => {
      setLabelIndex((i) => (i + 1) % STATES.length)
      setPhase("enterStart")

      const t2 = setTimeout(() => {
        setPhase("settled")
      }, 0)
      timeouts.current.push(t2)
    }, TEXT_SWAP_DUR)
    timeouts.current.push(t1)
  }

  const className =
    "t-text-swap" + (phase === "exit" ? " is-exit" : phase === "enterStart" ? " is-enter-start" : "")

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      <style>{`
        :root {
          --text-swap-dur: 150ms;
          --text-swap-translate-y: 4px;
          --text-swap-blur: 2px;
          --text-swap-ease: ease-in-out;
        }
        .t-text-swap {
          display: inline-block;
          transform: translateY(0);
          filter: blur(0);
          opacity: 1;
          transition:
            transform var(--text-swap-dur) var(--text-swap-ease),
            filter    var(--text-swap-dur) var(--text-swap-ease),
            opacity   var(--text-swap-dur) var(--text-swap-ease);
          will-change: transform, filter, opacity;
        }
        .t-text-swap.is-exit {
          transform: translateY(calc(var(--text-swap-translate-y) * -1));
          filter: blur(var(--text-swap-blur));
          opacity: 0;
        }
        .t-text-swap.is-enter-start {
          transform: translateY(var(--text-swap-translate-y));
          filter: blur(var(--text-swap-blur));
          opacity: 0;
          transition: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .t-text-swap { transition: none !important; }
        }
      `}</style>

      <button
        type="button"
        onClick={swapText}
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
        Trigger
      </button>
      <div
        style={{
          minWidth: 120,
          height: 32,
          display: "flex",
          alignItems: "center",
          paddingLeft: 4,
          fontSize: 13,
          color: "#3a362e",
        }}
      >
        <span className={className}>{STATES[labelIndex]}</span>
      </div>
    </div>
  )
}
