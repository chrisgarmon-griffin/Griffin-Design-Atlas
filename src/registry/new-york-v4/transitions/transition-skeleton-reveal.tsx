import { useEffect, useRef, useState } from "react"

type State = "loading" | "revealed" | "resetting"

const PULSE_DUR = 1000
const PULSE_COUNT = 1

export function SkeletonRevealTransition() {
  const [state, setState] = useState<State>("revealed")
  const [pulsing, setPulsing] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const replay = () => {
    if (timer.current) clearTimeout(timer.current)

    setState("resetting")
    setPulsing(false)

    requestAnimationFrame(() => {
      setState("loading")
      setPulsing(true)
      const total = PULSE_DUR * PULSE_COUNT
      timer.current = setTimeout(() => setState("revealed"), total)
    })
  }

  const isRevealed = state === "revealed"
  const isResetting = state === "resetting"

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start", width: "100%" }}>
      <style>{`
        :root {
          --pulse-dur: 1000ms;
          --pulse-count: 1;
          --pulse-min: 0.5;
          --reveal-dur: 400ms;
          --reveal-blur: 2px;
          --reveal-ease: ease-in-out;
        }
        .t-skel { position: relative; }
        .t-skel-skeleton,
        .t-skel-content {
          position: absolute;
          inset: 0;
        }
        .t-skel-skeleton {
          z-index: 1;
          opacity: 1;
          filter: blur(0);
          transition:
            opacity var(--reveal-dur) var(--reveal-ease),
            filter  var(--reveal-dur) var(--reveal-ease);
        }
        .t-skel-content {
          z-index: 2;
          opacity: 0;
          filter: blur(var(--reveal-blur));
          transition:
            opacity var(--reveal-dur) var(--reveal-ease),
            filter  var(--reveal-dur) var(--reveal-ease);
        }
        .t-skel.is-revealed .t-skel-skeleton {
          opacity: 0;
          filter: blur(var(--reveal-blur));
        }
        .t-skel.is-revealed .t-skel-content {
          opacity: 1;
          filter: blur(0);
        }
        .t-skel.is-resetting .t-skel-skeleton,
        .t-skel.is-resetting .t-skel-content {
          transition: none !important;
        }
        .t-skel-skeleton.is-pulsing > * {
          animation: t-skel-pulse var(--pulse-dur) ease-in-out var(--pulse-count);
        }
        @keyframes t-skel-pulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: var(--pulse-min); }
        }
        @media (prefers-reduced-motion: reduce) {
          .t-skel-skeleton, .t-skel-content {
            transition: none !important;
          }
          .t-skel-skeleton.is-pulsing > * { animation: none !important; }
        }
      `}</style>
      <div
        className={`t-skel${isRevealed ? " is-revealed" : ""}${isResetting ? " is-resetting" : ""}`}
        data-state={state}
        style={{ width: "100%", height: 54 }}
      >
        <div className={`t-skel-skeleton${pulsing ? " is-pulsing" : ""}`}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", height: "100%" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e2dccf" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              <div style={{ width: "70%", height: 10, borderRadius: 4, background: "#e2dccf" }} />
              <div style={{ width: "45%", height: 10, borderRadius: 4, background: "#e2dccf" }} />
            </div>
          </div>
        </div>
        <div className="t-skel-content">
          <div style={{ display: "flex", gap: 8, alignItems: "center", height: "100%" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#cfa876",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
              }}
            >
              AR
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 12, color: "#2f2a22" }}>Alex Rivera</span>
              <span style={{ fontSize: 11, color: "#8a8275" }}>Loan Officer</span>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={replay}
        style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid #d8d2c8", background: "#f5f1ea", cursor: "pointer" }}
      >
        Reload
      </button>
    </div>
  )
}
