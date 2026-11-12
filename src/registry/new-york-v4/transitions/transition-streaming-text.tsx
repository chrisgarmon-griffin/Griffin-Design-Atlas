import { useEffect, useRef, useState } from "react"

const TEXT = "The model composes its answer one resolved word at a time, condensing into place rather than typing it out."
const WORDS = TEXT.split(" ")
const GAP_MS = 60

export function StreamingTextTransition() {
  const [visible, setVisible] = useState<boolean[]>(() => WORDS.map(() => true))
  const [noTransition, setNoTransition] = useState(false)
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    return () => {
      timeouts.current.forEach(clearTimeout)
      timeouts.current = []
    }
  }, [])

  useEffect(() => {
    if (!noTransition) return
    const frame = requestAnimationFrame(() => setNoTransition(false))
    return () => cancelAnimationFrame(frame)
  }, [noTransition])

  const replay = () => {
    timeouts.current.forEach(clearTimeout)
    timeouts.current = []
    setNoTransition(true)
    setVisible(WORDS.map(() => false))
    WORDS.forEach((_, i) => {
      const t = setTimeout(() => {
        setVisible((prev) => {
          const next = [...prev]
          next[i] = true
          return next
        })
      }, i * GAP_MS)
      timeouts.current.push(t)
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
      <style>{`
        :root {
          --stream-gap: 60ms;
          --stream-fade: 350ms;
          --stream-blur: 1px;
          --stream-ease: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .t-stream-w {
          opacity: 0;
          filter: blur(var(--stream-blur));
          transition:
            opacity var(--stream-fade) var(--stream-ease),
            filter var(--stream-fade) var(--stream-ease);
        }
        .t-stream-w.is-in {
          opacity: 1;
          filter: blur(0);
        }
        .t-stream-w.no-transition { transition: none; }

        @media (prefers-reduced-motion: reduce) {
          .t-stream-w { transition: none !important; filter: none !important; opacity: 1 !important; }
        }
      `}</style>
      <button
        type="button"
        onClick={replay}
        style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid #d8d2c8", background: "#fff", cursor: "pointer" }}
      >
        Replay stream
      </button>
      <div className="t-stream" style={{ fontSize: 13, lineHeight: "20px", color: "#262320" }}>
        {WORDS.map((word, i) => (
          <span key={i}>
            <span className={`t-stream-w${visible[i] ? " is-in" : ""}${noTransition ? " no-transition" : ""}`}>
              {word}
            </span>{" "}
          </span>
        ))}
      </div>
    </div>
  )
}
