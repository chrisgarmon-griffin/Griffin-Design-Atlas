import { useEffect, useRef, useState } from "react"

const STATES = ["Setting up a workplace", "Running a command", "Browsing files"]
const HOLD_MS = 2000
const SWAP_MS = 150
const GAP_MS = 50

const longest = STATES.reduce((a, b) => (b.length > a.length ? b : a), STATES[0])

export function ThinkingStatesTransition() {
  const [index, setIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState<number | null>(null)
  const [entering, setEntering] = useState(false)
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const schedule = (fn: () => void, ms: number) => {
      const t = setTimeout(fn, ms)
      timeouts.current.push(t)
      return t
    }

    function cycle() {
      schedule(() => {
        setIndex((current) => {
          const next = (current + 1) % STATES.length
          setPrevIndex(current)
          setEntering(true)
          schedule(() => setEntering(false), GAP_MS)
          schedule(() => {
            setPrevIndex(null)
            cycle()
          }, SWAP_MS + GAP_MS)
          return next
        })
      }, HOLD_MS)
    }

    cycle()
    return () => {
      timeouts.current.forEach(clearTimeout)
      timeouts.current = []
    }
  }, [])

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
      <style>{`
        :root {
          --think-hold: 2000ms;
          --think-swap: 150ms;
          --think-gap: 50ms;
          --think-distance: 8px;
          --think-blur: 2px;
          --think-shimmer: 2000ms;
          --think-base: #7c7c7c;
          --think-highlight: #0d0d0d;
          --think-ease: ease-in-out;
        }
        .t-think { position: relative; display: inline-block; text-align: center; font-size: 13px; }
        .t-think-sizer { display: block; visibility: hidden; white-space: nowrap; }
        .t-think-text {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          display: block;
          color: var(--think-base);
          white-space: nowrap;
          transform: translateY(0);
          filter: blur(0);
          opacity: 1;
          transition:
            transform var(--think-swap) var(--think-ease),
            filter var(--think-swap) var(--think-ease),
            opacity var(--think-swap) var(--think-ease);
          will-change: transform, filter, opacity;
        }
        .t-think-text::before {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: linear-gradient(90deg,
            transparent 0%, transparent 40%,
            var(--think-highlight) 50%,
            transparent 60%, transparent 100%);
          background-size: 400% 100%;
          background-repeat: no-repeat;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          animation: t-think-shimmer var(--think-shimmer) linear infinite;
        }
        @keyframes t-think-shimmer {
          0%   { background-position: 100% 0; }
          100% { background-position: 0% 0; }
        }
        .t-think-text.is-exit {
          transform: translateY(calc(var(--think-distance) * -1));
          filter: blur(var(--think-blur));
          opacity: 0;
        }
        .t-think-text.is-enter-start {
          transition: none;
          transform: translateY(var(--think-distance));
          filter: blur(var(--think-blur));
          opacity: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .t-think-text { transition: none !important; transform: none !important; filter: none !important; }
          .t-think-text::before { display: none !important; }
        }
      `}</style>
      <span className="t-think" role="status">
        <span className="t-think-sizer" aria-hidden="true">{longest}</span>
        {prevIndex !== null && (
          <span className="t-think-text is-exit" data-text={STATES[prevIndex]}>
            {STATES[prevIndex]}
          </span>
        )}
        <span
          className={`t-think-text${entering ? " is-enter-start" : ""}`}
          data-text={STATES[index]}
        >
          {STATES[index]}
        </span>
      </span>
    </div>
  )
}
