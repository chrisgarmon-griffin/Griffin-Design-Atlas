import { useEffect, useRef, useState } from "react"

const LINES = [
  "Checking inputs against the schema...",
  "Cross-referencing records in the index...",
  "Weighing two candidate approaches...",
  "Discarding the slower path...",
  "Drafting a response outline...",
  "Verifying the numbers add up...",
  "Reading back the constraints once more...",
  "Settling on a final answer...",
]

const HOLD_MS = 840
const STEP_MS = 500
const STEP_LINES = 2

export function ReasoningStreamTransition() {
  const textRef = useRef<HTMLDivElement | null>(null)
  const [offset, setOffset] = useState(0)
  const [transitioning, setTransitioning] = useState(true)
  const offsetRef = useRef(0)

  useEffect(() => {
    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout>

    function step() {
      timeoutId = setTimeout(() => {
        if (cancelled || !textRef.current) return
        const lineHeight = parseFloat(getComputedStyle(textRef.current).lineHeight) || 18
        const stepPx = lineHeight * STEP_LINES
        offsetRef.current += stepPx
        setTransitioning(true)
        setOffset(offsetRef.current)

        timeoutId = setTimeout(() => {
          if (cancelled || !textRef.current) return
          const copyHeight = textRef.current.offsetHeight
          if (offsetRef.current >= copyHeight) {
            offsetRef.current -= copyHeight
            setTransitioning(false)
            setOffset(offsetRef.current)
          }
          step()
        }, STEP_MS + 30)
      }, HOLD_MS)
    }

    step()
    return () => {
      cancelled = true
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div style={{ width: "100%" }}>
      <style>{`
        :root {
          --reason-hold: 840ms;
          --reason-step: 500ms;
          --reason-lines: 2;
          --reason-fade: 28px;
          --reason-ease: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .t-reason { position: relative; overflow: hidden; }
        .t-reason-viewport {
          position: absolute;
          inset: 0;
          overflow: hidden;
          -webkit-mask-image: linear-gradient(
            transparent 0,
            black var(--reason-fade),
            black calc(100% - var(--reason-fade)),
            transparent 100%);
          mask-image: linear-gradient(
            transparent 0,
            black var(--reason-fade),
            black calc(100% - var(--reason-fade)),
            transparent 100%);
        }
        .t-reason-scroll {
          position: absolute;
          left: 0;
          right: 0;
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce) {
          .t-reason-scroll { transition: none !important; transform: none !important; }
        }
      `}</style>
      <div className="t-reason" style={{ height: 90, borderRadius: 10, border: "1px solid #e2dccf", background: "#f5f1ea" }}>
        <div className="t-reason-viewport">
          <div
            className="t-reason-scroll"
            style={{
              transform: `translateY(-${offset}px)`,
              transition: transitioning ? `transform var(--reason-step) var(--reason-ease)` : "none",
            }}
          >
            <div className="t-reason-text" ref={textRef} style={{ padding: "8px 12px", fontSize: 12.5, lineHeight: "20px", color: "#4a463f" }}>
              {LINES.map((line, i) => (
                <p key={i} style={{ margin: 0 }}>
                  {line}
                </p>
              ))}
            </div>
            <div className="t-reason-text" aria-hidden="true" style={{ padding: "8px 12px", fontSize: 12.5, lineHeight: "20px", color: "#4a463f" }}>
              {LINES.map((line, i) => (
                <p key={i} style={{ margin: 0 }}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
