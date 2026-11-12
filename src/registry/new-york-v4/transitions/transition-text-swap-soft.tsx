import { useLayoutEffect, useRef, useState } from "react"

const VALUES: Record<string, string> = { Week: "$640", Month: "$2,140", Year: "$18,920" }
const PERIODS = Object.keys(VALUES)

export function TextSwapSoftTransition() {
  const [period, setPeriod] = useState(PERIODS[0])
  const [prevText, setPrevText] = useState(VALUES[PERIODS[0]])
  const [showSwap, setShowSwap] = useState(false)
  const [swapping, setSwapping] = useState(false)
  const [width, setWidth] = useState<number | undefined>(undefined)
  const oldRef = useRef<HTMLSpanElement>(null)
  const newRef = useRef<HTMLSpanElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const text = VALUES[period]

  function choose(next: string) {
    if (next === period) return
    clearTimeout(timerRef.current)
    setPrevText(VALUES[period])
    setPeriod(next)
    setShowSwap(true)
    setSwapping(false)
    setWidth(undefined)
  }

  useLayoutEffect(() => {
    if (!showSwap) return
    if (width === undefined) {
      setWidth(oldRef.current?.getBoundingClientRect().width ?? 0)
      return
    }
    if (!swapping) {
      const nw = newRef.current?.getBoundingClientRect().width ?? 0
      const frame = requestAnimationFrame(() => {
        setSwapping(true)
        setWidth(nw)
      })
      return () => cancelAnimationFrame(frame)
    }
    timerRef.current = setTimeout(() => {
      setShowSwap(false)
      setSwapping(false)
      setWidth(undefined)
    }, 280)
    return () => clearTimeout(timerRef.current)
  }, [showSwap, width, swapping])

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
      <style>{`
        :root {
          --text-soft-dur: 200ms;
          --text-soft-blur: 2px;
          --text-soft-ease: ease-in-out;
          --text-soft-resize-dur: 240ms;
          --text-soft-resize-ease: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .t-text-soft {
          display: inline-grid;
          justify-items: var(--text-soft-align, start);
          transition: width var(--text-soft-resize-dur) var(--text-soft-resize-ease);
        }
        .t-text-soft > span {
          grid-area: 1 / 1;
          white-space: pre;
          transition:
            filter  var(--text-soft-dur) var(--text-soft-ease),
            opacity var(--text-soft-dur) var(--text-soft-ease);
        }
        .t-text-soft-new {
          opacity: 0;
          filter: blur(var(--text-soft-blur));
        }
        .t-text-soft.is-swapping .t-text-soft-old {
          opacity: 0;
          filter: blur(var(--text-soft-blur));
        }
        .t-text-soft.is-swapping .t-text-soft-new {
          opacity: 1;
          filter: blur(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .t-text-soft,
          .t-text-soft > span { transition: none !important; }
        }
      `}</style>
      <div style={{ display: "flex", gap: 6 }}>
        {PERIODS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => choose(p)}
            style={{
              fontSize: 12,
              padding: "4px 10px",
              borderRadius: 999,
              border: "1px solid " + (p === period ? "#2f2a22" : "#d8d2c8"),
              background: p === period ? "#2f2a22" : "#fff",
              color: p === period ? "#fff" : "#2f2a22",
              cursor: "pointer",
            }}
          >
            {p}
          </button>
        ))}
      </div>
      <span
        className={"t-text-soft" + (swapping ? " is-swapping" : "")}
        style={{ width, fontSize: 22, fontWeight: 600, color: "#2f2a22" }}
      >
        {showSwap ? (
          <>
            <span className="t-text-soft-old" ref={oldRef} aria-hidden="true">
              {prevText}
            </span>
            <span className="t-text-soft-new" ref={newRef}>
              {text}
            </span>
          </>
        ) : (
          <span className="t-text-soft-new" style={{ opacity: 1, filter: "none" }}>
            {text}
          </span>
        )}
      </span>
    </div>
  )
}
