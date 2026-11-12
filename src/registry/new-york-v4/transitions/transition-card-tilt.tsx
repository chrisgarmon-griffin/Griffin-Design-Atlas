import { useRef, useState } from "react"

const MAX = 14 // peak tilt in degrees at the card edges

export function CardTiltTransition() {
  const tiltRef = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState(false)
  const [tilting, setTilting] = useState(false)
  const [vars, setVars] = useState<Record<string, string>>({
    "--tilt-rx": "0deg",
    "--tilt-ry": "0deg",
    "--tilt-gx": "50%",
    "--tilt-gy": "50%",
  })

  const reset = () => {
    setHover(false)
    setTilting(false)
    setVars((v) => ({ ...v, "--tilt-rx": "0deg", "--tilt-ry": "0deg" }))
  }

  const track = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = tiltRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
    const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
    setHover(true)
    setTilting(true)
    setVars({
      "--tilt-ry": `${((px - 0.5) * MAX).toFixed(2)}deg`,
      "--tilt-rx": `${((0.5 - py) * MAX).toFixed(2)}deg`,
      "--tilt-gx": `${(px * 100).toFixed(1)}%`,
      "--tilt-gy": `${(py * 100).toFixed(1)}%`,
    })
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") {
      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {
        // ignore capture failures
      }
    }
  }

  const onPointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") reset()
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
      <style>{`
        :root {
          --tilt-perspective: 1000px;
          --tilt-return: 1000ms;
          --tilt-return-ease: cubic-bezier(0.22, 1, 0.36, 1);
          --tilt-follow: 400ms;
          --tilt-follow-ease: cubic-bezier(0.22, 1, 0.36, 1);
          --tilt-glare-opacity: 0.32;
          --tilt-glare-fade: 300ms;
          --tilt-glare-ease: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .t-tilt { touch-action: none; }
        .t-tilt-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          transform:
            perspective(var(--tilt-perspective))
            rotateX(var(--tilt-rx, 0deg))
            rotateY(var(--tilt-ry, 0deg));
          transform-style: preserve-3d;
          transition: transform var(--tilt-return) var(--tilt-return-ease);
          will-change: transform;
        }
        .t-tilt-card.is-tilting {
          transition: transform var(--tilt-follow) var(--tilt-follow-ease);
        }
        .t-tilt-glare {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          mix-blend-mode: screen;
          background:
            radial-gradient(circle 95px at var(--tilt-gx, 50%) var(--tilt-gy, 50%),
              rgba(255,255,255,0.48), rgba(255,255,255,0.06) 52%, rgba(255,255,255,0) 84%),
            radial-gradient(circle 200px at var(--tilt-gx, 50%) var(--tilt-gy, 50%),
              rgba(255,255,255,0.22), rgba(255,255,255,0.04) 58%, rgba(255,255,255,0) 78%),
            radial-gradient(circle 360px at var(--tilt-gx, 50%) var(--tilt-gy, 50%),
              rgba(255,255,255,0.10), rgba(255,255,255,0) 88%);
          transition: opacity var(--tilt-glare-fade) var(--tilt-glare-ease);
        }
        .t-tilt.is-hover .t-tilt-glare { opacity: var(--tilt-glare-opacity); }
        @media (prefers-reduced-motion: reduce) {
          .t-tilt-card { transform: none !important; transition: none !important; }
        }
      `}</style>
      <div
        ref={tiltRef}
        className={`t-tilt${hover ? " is-hover" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={track}
        onPointerUp={reset}
        onPointerCancel={reset}
        onPointerLeave={onPointerLeave}
        style={{ width: 160, height: 110, ...(vars as React.CSSProperties) }}
      >
        <div className={`t-tilt-card${tilting ? " is-tilting" : ""}`} style={{ width: "100%", height: "100%" }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #2f2a22, #574c37)",
              color: "#f5f1ea",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
            }}
          >
            Hover / drag
          </div>
          <div className="t-tilt-glare" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
