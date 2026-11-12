import { useEffect, useRef, useState } from "react"

const PARTICLE_COUNT = 8

type Particle = {
  px: number
  py: number
  pdur: number
  pdelay: number
  pEndScale: number
  psize: number
}

function makeParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.3
    const dist = 16 + Math.random() * 10
    return {
      px: Math.cos(angle) * dist,
      py: Math.sin(angle) * dist,
      pdur: 500 + Math.random() * 200,
      pdelay: Math.random() * 60,
      pEndScale: 0.5 + Math.random() * 0.3,
      psize: 0.8 + Math.random() * 0.8,
    }
  })
}

export function LikeButtonTransition() {
  const [liked, setLiked] = useState(false)
  const [bursting, setBursting] = useState(false)
  const [particles, setParticles] = useState<Particle[]>(() => makeParticles())
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const toggle = () => {
    const next = !liked
    setLiked(next)
    if (next) {
      setParticles(makeParticles())
      setBursting(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setBursting(false), 700)
    } else {
      setBursting(false)
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
      <style>{`
        :root {
          --like-color: #f40051;
          --like-fill: 150ms;
          --like-pop: 350ms;
          --like-pop-ease: cubic-bezier(0.34, 1.96, 0.64, 1);
          --like-particle-dur: 600ms;
          --like-particle-dist: 20px;
          --like-particle-size: 2.5px;
          --like-ease: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .t-like-heart { color: currentColor; transition: color var(--like-fill) var(--like-ease); }
        .t-like-heart path {
          fill: transparent; stroke: currentColor;
          transition: fill var(--like-fill) var(--like-ease), stroke var(--like-fill) var(--like-ease);
        }
        .t-like[data-liked="true"] .t-like-heart { color: var(--like-color); }
        .t-like[data-liked="true"] .t-like-heart path { fill: currentColor; }
        .t-like[data-liked="true"] .t-like-icon { animation: t-like-pop var(--like-pop) var(--like-pop-ease); }
        @keyframes t-like-pop { 0% { transform: scale(1); } 30% { transform: scale(0.82); } 100% { transform: scale(1); } }

        .t-like-particles { position: absolute; left: 50%; top: 50%; width: 0; height: 0; pointer-events: none; color: var(--like-color); }
        .t-like-particles i {
          position: absolute;
          left: calc(var(--like-particle-size) * var(--psize, 1) / -2);
          top: calc(var(--like-particle-size) * var(--psize, 1) / -2);
          width: calc(var(--like-particle-size) * var(--psize, 1));
          height: calc(var(--like-particle-size) * var(--psize, 1));
          border-radius: 50%; background: currentColor; opacity: 0;
        }
        @keyframes t-like-burst {
          0%   { opacity: 0; transform: translate(0, 0) scale(0.4); }
          20%  { opacity: 1; transform: translate(calc(var(--px) * 0.25), calc(var(--py) * 0.25)) scale(1); }
          100% { opacity: 0; transform: translate(var(--px), var(--py)) scale(var(--p-end-scale, 0.6)); }
        }
        .t-like.is-bursting .t-like-particles i {
          animation: t-like-burst var(--pdur, var(--like-particle-dur)) ease-out var(--pdelay, 0ms) forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .t-like-icon, .t-like-particles i { animation: none !important; }
        }
      `}</style>
      <button
        type="button"
        className={`t-like${bursting ? " is-bursting" : ""}`}
        data-liked={liked}
        onClick={toggle}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          padding: "6px 12px",
          borderRadius: 999,
          border: "1px solid #d8d2c8",
          background: "#fff",
          color: "#4a463f",
          cursor: "pointer",
        }}
      >
        <span className="t-like-icon" style={{ display: "inline-flex" }}>
          <svg className="t-like-heart" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M12 21s-7.5-4.6-10-9.1C.5 8.4 2.3 5 5.8 5c2 0 3.4 1 4.2 2.3C10.8 6 12.2 5 14.2 5c3.5 0 5.3 3.4 3.8 6.9C19.5 16.4 12 21 12 21z" />
          </svg>
        </span>
        <span className="t-like-particles" aria-hidden="true">
          {particles.map((p, i) => (
            <i
              key={i}
              style={
                {
                  "--px": `${p.px}px`,
                  "--py": `${p.py}px`,
                  "--pdur": `${p.pdur}ms`,
                  "--pdelay": `${p.pdelay}ms`,
                  "--p-end-scale": p.pEndScale,
                  "--psize": p.psize,
                } as React.CSSProperties
              }
            />
          ))}
        </span>
        Like
      </button>
    </div>
  )
}
