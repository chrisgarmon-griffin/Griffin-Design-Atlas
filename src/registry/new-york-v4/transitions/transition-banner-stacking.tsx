import { useEffect, useRef, useState } from "react"

type Banner = {
  id: number
  text: string
}

const CLOSE_MS = 250
const SAMPLE_TEXTS = ["New message received", "File uploaded", "Payment confirmed", "Build finished", "Invite accepted"]

export function BannerStackingTransition() {
  const [banners, setBanners] = useState<Banner[]>([{ id: 1, text: SAMPLE_TEXTS[0] }])
  const [enteringId, setEnteringId] = useState<number | null>(null)
  const [leavingIds, setLeavingIds] = useState<number[]>([])
  const [spread, setSpread] = useState(false)
  const nextId = useRef(2)
  const stackRef = useRef<HTMLDivElement | null>(null)
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    return () => {
      timeouts.current.forEach(clearTimeout)
      timeouts.current = []
    }
  }, [])

  useEffect(() => {
    if (enteringId === null) return
    const frame = requestAnimationFrame(() => setEnteringId(null))
    return () => cancelAnimationFrame(frame)
  }, [enteringId])

  const addBanner = () => {
    const id = nextId.current++
    const text = SAMPLE_TEXTS[id % SAMPLE_TEXTS.length]
    setBanners((prev) => {
      const next = [{ id, text }, ...prev]
      const overflow = next.slice(3).map((b) => b.id)
      if (overflow.length > 0) {
        setLeavingIds((prevLeaving) => [...prevLeaving, ...overflow])
        overflow.forEach((leavingId) => {
          const t = setTimeout(() => {
            setBanners((current) => current.filter((b) => b.id !== leavingId))
            setLeavingIds((current) => current.filter((l) => l !== leavingId))
          }, CLOSE_MS + 60)
          timeouts.current.push(t)
        })
      }
      return next
    })
    setEnteringId(id)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!stackRef.current) return
    const r = stackRef.current.getBoundingClientRect()
    const gap = 8
    const above = spread ? (r.height + gap) * 2 : 0
    const within =
      e.clientX >= r.left && e.clientX <= r.right && e.clientY <= r.bottom && e.clientY >= r.top - above
    if (spread && !within) setSpread(false)
    else if (!spread && within) setSpread(true)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start", width: "100%" }}>
      <style>{`
        :root {
          --stack-open: 350ms;
          --stack-close: 250ms;
          --stack-rise: 60px;
          --stack-blur: 2px;
          --stack-scale: 0.97;
          --stack-peek: 12px;
          --stack-spread-gap: 8px;
          --stack-depth-scale: 0.06;
          --stack-depth-fade: 0.4;
          --stack-depth1-blur: 1px;
          --stack-depth2-blur: 2px;
          --stack-ease: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .t-stack { position: relative; }
        .t-stack-banner {
          position: absolute;
          left: 0;
          bottom: 0;
          transform-origin: 50% 50%;
          filter: blur(0);
          will-change: transform, opacity, filter;
          transition:
            transform var(--stack-open) var(--stack-ease),
            opacity var(--stack-open) var(--stack-ease),
            filter var(--stack-open) var(--stack-ease);
        }
        .t-stack-banner[data-depth="0"] {
          z-index: 3;
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        .t-stack-banner[data-depth="1"] {
          z-index: 2;
          transform-origin: 50% 100%;
          transform: translateY(calc(var(--stack-peek) * -1))
                     scale(calc(1 - var(--stack-depth-scale)));
          opacity: calc(1 - var(--stack-depth-fade));
          filter: blur(var(--stack-depth1-blur));
        }
        .t-stack-banner[data-depth="2"] {
          z-index: 1;
          transform-origin: 50% 100%;
          transform: translateY(calc(var(--stack-peek) * -2))
                     scale(calc(1 - var(--stack-depth-scale) * 2));
          opacity: calc(1 - var(--stack-depth-fade) * 1.6);
          filter: blur(var(--stack-depth2-blur));
        }
        .t-stack.is-spread .t-stack-banner[data-depth="1"],
        .t-stack.is-spread .t-stack-banner[data-depth="2"] { opacity: 1; filter: blur(0); }
        .t-stack.is-spread .t-stack-banner[data-depth="1"] {
          transform: translateY(calc((100% + var(--stack-spread-gap)) * -1)) scale(1);
        }
        .t-stack.is-spread .t-stack-banner[data-depth="2"] {
          transform: translateY(calc((100% + var(--stack-spread-gap)) * -2)) scale(1);
        }
        .t-stack-banner.is-enter {
          transition: none;
          transform: translateY(var(--stack-rise)) scale(var(--stack-scale));
          opacity: 0;
          filter: blur(var(--stack-blur));
        }
        .t-stack-banner.is-leaving {
          z-index: 0;
          transform-origin: 50% 100%;
          transform: translateY(calc(var(--stack-peek) * -3))
                     scale(calc(1 - var(--stack-depth-scale) * 3));
          opacity: 0;
          filter: blur(var(--stack-blur));
          transition:
            transform var(--stack-close) var(--stack-ease),
            opacity var(--stack-close) var(--stack-ease),
            filter var(--stack-close) var(--stack-ease);
        }

        @media (prefers-reduced-motion: reduce) {
          .t-stack-banner { transition: none !important; transform: none !important; filter: none !important; }
        }
      `}</style>
      <button
        type="button"
        onClick={addBanner}
        style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid #d8d2c8", background: "#fff", cursor: "pointer" }}
      >
        Add banner
      </button>
      <div
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setSpread(false)}
        style={{ width: "100%", height: 110, display: "flex", alignItems: "flex-end", paddingTop: 70 }}
      >
        <div
          ref={stackRef}
          className={`t-stack${spread ? " is-spread" : ""}`}
          style={{ position: "relative", width: "100%", height: 36 }}
        >
          {banners.map((b, i) => {
            const isLeaving = leavingIds.includes(b.id)
            const depth = isLeaving ? 3 : i
            return (
              <div
                key={b.id}
                className={`t-stack-banner${b.id === enteringId ? " is-enter" : ""}${isLeaving ? " is-leaving" : ""}`}
                data-depth={depth}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "#262320",
                  color: "#f5f1ea",
                  fontSize: 13,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                }}
              >
                {b.text}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
