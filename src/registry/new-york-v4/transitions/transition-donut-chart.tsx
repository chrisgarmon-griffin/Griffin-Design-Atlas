import { useEffect, useRef, useState } from "react"

const COLORS = ["#c8102e", "#8a4fd8", "#1f9e62", "#d89a1f"]
const DATASETS: number[][] = [
  [640, 480, 300, 720],
  [168, 142, 96, 80],
  [300, 300, 300, 300],
]

function bezier(x1: number, y1: number, x2: number, y2: number) {
  return (t: number) => {
    let lo = 0
    let hi = 1
    let u = t
    for (let i = 0; i < 24; i++) {
      u = (lo + hi) / 2
      const x = 3 * u * (1 - u) * (1 - u) * x1 + 3 * u * u * (1 - u) * x2 + u * u * u
      if (x < t) lo = u
      else hi = u
    }
    return 3 * u * (1 - u) * (1 - u) * y1 + 3 * u * u * (1 - u) * y2 + u * u * u
  }
}
const EASE = bezier(0.22, 1, 0.36, 1)

// One ring sector from angle a0 to a1, inset by the corner radius (the
// round-joined stroke adds it back) and by half the gap measured straight
// across, so both gap edges stay parallel.
function ringPath(cx: number, cy: number, ro: number, ri: number, a0: number, a1: number, gap: number, cr: number) {
  const Ro = ro - cr
  const Ri = ri + cr
  const h = gap / 2 + cr
  if (Ro <= Ri) return ""
  const dO = Math.asin(Math.min(1, h / Ro))
  const dI = Math.asin(Math.min(1, h / Ri))
  const o0 = a0 + dO
  const o1 = a1 - dO
  const i0 = a0 + dI
  const i1 = a1 - dI
  if (i1 - i0 <= 0 || o1 - o0 <= 0) return ""
  const pt = (r: number, a: number) => `${(cx + r * Math.sin(a)).toFixed(3)} ${(cy - r * Math.cos(a)).toFixed(3)}`
  const lo = o1 - o0 > Math.PI ? 1 : 0
  const li = i1 - i0 > Math.PI ? 1 : 0
  return `M${pt(Ro, o0)}A${Ro} ${Ro} 0 ${lo} 1 ${pt(Ro, o1)}L${pt(Ri, i1)}A${Ri} ${Ri} 0 ${li} 0 ${pt(Ri, i0)}Z`
}

const CX = 70
const CY = 70
const RO = 70
const THICKNESS = 14
const RI = RO - THICKNESS
const GAP = 3
const CORNER = 2

function segmentsFor(values: number[]) {
  const total = values.reduce((a, b) => a + b, 0) || 1
  let a = 0
  return values.map((v) => {
    const span = (v / total) * Math.PI * 2
    const d = ringPath(CX, CY, RO, RI, a, a + span, GAP, CORNER)
    a += span
    return d
  })
}

export function DonutChartTransition() {
  const [index, setIndex] = useState(0)
  const [drawn, setDrawn] = useState<number[]>(DATASETS[0])
  const fromRef = useRef<number[]>(DATASETS[0])
  const rafRef = useRef(0)
  const mountedRef = useRef(false)

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true
      return
    }
    const from = fromRef.current
    const to = DATASETS[index]
    fromRef.current = to
    cancelAnimationFrame(rafRef.current)
    const reduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      setDrawn(to)
      return
    }
    const t0 = performance.now()
    const dur = 400
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur)
      const e = EASE(t)
      setDrawn(from.map((f, k) => f + (to[k] - f) * e))
      if (t < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [index])

  const paths = segmentsFor(drawn)
  const total = DATASETS[index].reduce((a, b) => a + b, 0)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
      <style>{`
        :root {
          --chart-morph-dur: 400ms;
          --chart-morph-ease: cubic-bezier(0.22, 1, 0.36, 1);
          --chart-gap: 3px;
          --chart-corner: 2px;
        }
        .t-donut {
          position: relative;
          width: 140px;
          height: 140px;
        }
        .t-donut svg {
          display: block;
          width: 100%;
          height: 100%;
          overflow: visible;
        }
        .t-donut-seg {
          stroke-linejoin: round;
          transition: opacity 150ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .t-donut-seg.is-dim { opacity: 0.2; }
        .t-donut-center {
          position: absolute;
          inset: 0;
          display: grid;
          place-content: center;
          text-align: center;
        }
        @media (prefers-reduced-motion: reduce) {
          .t-donut-seg { transition: none !important; }
        }
      `}</style>
      <button
        type="button"
        onClick={() => setIndex((i) => (i + 1) % DATASETS.length)}
        style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid #d8d2c8", background: "#fff", cursor: "pointer" }}
      >
        Switch period
      </button>
      <div className="t-donut" data-thickness={THICKNESS}>
        <svg viewBox="0 0 140 140" aria-hidden="true">
          {paths.map((d, i) =>
            d ? <path key={i} className="t-donut-seg" d={d} fill={COLORS[i]} stroke={COLORS[i]} strokeWidth={CORNER * 2} /> : null
          )}
        </svg>
        <div className="t-donut-center">
          <div style={{ fontWeight: 600, fontSize: 16, color: "#2f2a22" }}>${total.toLocaleString("en-US")}</div>
          <div style={{ fontSize: 11, color: "#8d8577" }}>Total</div>
        </div>
      </div>
    </div>
  )
}
