import { useEffect, useRef, useState } from "react"

// Ported from the transitions.dev spinning-counter recipe. The recipe reads
// its em-based tokens (offset, blur, lift) from the live font size on the
// drum; this demo fixes the drum at a 24px font instead of measuring it,
// since the tile always renders at one size.
// ponytail: fixed 24px font assumption, 4-digit non-separator values only;
// upgrade with live em measurement + variable digit-count support if this
// demo ever needs to show arbitrary numbers.

const STEP = (50 * Math.PI) / 180
const ENTER_MS = 120
const FADE_END = 1.8
const LAND_AT = 0.6
const ARRIVE_AT = 0.29
const CLEAR_MS = 200

function bezier(x1: number, y1: number, x2: number, y2: number) {
  const at = (a: number, b: number, t: number) =>
    3 * a * t * (1 - t) * (1 - t) + 3 * b * t * t * (1 - t) + t * t * t
  return (x: number) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let lo = 0
    let hi = 1
    let t = x
    for (let i = 0; i < 20; i++) {
      if (at(x1, x2, t) < x) lo = t
      else hi = t
      t = (lo + hi) / 2
    }
    return at(y1, y2, t)
  }
}
const EASE = bezier(0.35, -0.02, 0.43, 1)

function smooth(x: number) {
  x = Math.max(0, Math.min(1, x))
  return x * x * (3 - 2 * x)
}
// Damped wave: starts at 1, crosses 0, swings negative (the bounce), ends at 0.
function wave(s: number) {
  return s >= 1 ? 0 : Math.exp(-3 * s) * Math.cos(3 * Math.PI * s) * (1 - s)
}
let waveTrough = 0
for (let i = 1; i < 400; i++) waveTrough = Math.min(waveTrough, wave(i / 400))
const WAVE_TROUGH = -waveTrough

const O = {
  stepDur: 130,
  stagger: 90,
  offset: 0.52 * 24,
  sideScale: 0.7,
  sideBlur: 0.083 * 24,
  sideOpacity: 0.17,
  centerScale: 0.9,
  centerBlur: 0.042 * 24,
  anticDur: 100,
  anticScale: 0.94,
  anticLift: 0.125 * 24,
  landDur: 740,
  landPeak: 1.03,
}

function look(dist: number, middle: number) {
  const angle = Math.min(dist * STEP, Math.PI / 2)
  const face = (Math.cos(angle) - Math.cos(STEP)) / (1 - Math.cos(STEP))
  return {
    angle,
    scale: O.sideScale + (middle - O.sideScale) * face,
    back: dist <= 1 ? 1 + (O.sideOpacity - 1) * dist : O.sideOpacity * (1 - (dist - 1) / (FADE_END - 1)),
  }
}

type Land = { scale: number; lift: number; opacity: number; arrive: number }

function place(
  cells: (HTMLSpanElement | null)[],
  targetDigit: number,
  pos: number,
  spread: number,
  middle: number,
  land: Land | null
) {
  const radius = O.offset / Math.sin(STEP)
  cells.forEach((cell, d) => {
    if (!cell) return
    let p = (((d - pos) % 10) + 10) % 10
    if (p > 5) p -= 10
    const dist = Math.abs(p)
    if (dist >= FADE_END) {
      cell.style.opacity = "0"
      return
    }
    const l = look(dist, middle)
    let y = (p < 0 ? 1 : -1) * radius * Math.sin(l.angle)
    const blur = (O.centerBlur + (O.sideBlur - O.centerBlur) * Math.min(dist, 1)) * spread
    const away = Math.max(0, Math.min(1, (dist - 0.3) / 0.5))
    let opacity = l.back * (1 - (1 - spread) * away)
    let scale = l.scale
    let z = 100 - Math.round(dist * 10)
    if (land && d === targetDigit) {
      y = y * land.arrive + land.lift
      scale = land.scale
      opacity = land.opacity
      z = 200
    }
    cell.style.transform = `translateY(${y.toFixed(2)}px) scale(${scale.toFixed(4)})`
    cell.style.filter = blur > 0.01 ? `blur(${blur.toFixed(2)}px)` : "none"
    cell.style.opacity = opacity.toFixed(3)
    cell.style.zIndex = String(z)
  })
}

function rest(cells: (HTMLSpanElement | null)[], digit: number) {
  cells.forEach((cell, d) => {
    if (!cell) return
    cell.style.transform = "none"
    cell.style.filter = "none"
    cell.style.zIndex = ""
    cell.style.opacity = d === digit ? "1" : "0"
  })
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const VALUES = [1248, 9052, 3178, 6895]

export function SpinningCounterTransition() {
  const [index, setIndex] = useState(0)
  const value = VALUES[index]
  const str = String(value).padStart(4, "0")
  const cellRefs = useRef<(HTMLSpanElement | null)[][]>([[], [], [], []])
  const fromRef = useRef(str)
  const rafRef = useRef(0)
  const reducedMotionRef = useRef(false)
  const mountedRef = useRef(false)

  useEffect(() => {
    reducedMotionRef.current =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    str.split("").forEach((ch, i) => rest(cellRefs.current[i] ?? [], Number(ch)))
    mountedRef.current = true
    // Draw the initial resting state only; the roll effect below handles updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!mountedRef.current) return
    const from = fromRef.current
    fromRef.current = str
    cancelAnimationFrame(rafRef.current)
    if (reducedMotionRef.current) {
      str.split("").forEach((ch, i) => rest(cellRefs.current[i] ?? [], Number(ch)))
      return
    }
    const cols = str.split("").map((ch, i) => ({
      cells: cellRefs.current[i] ?? [],
      digit: Number(ch),
      from: Number(from[i] ?? ch),
      done: false,
      landAt: undefined as number | undefined,
      landFrom: null as ReturnType<typeof look> | null,
    }))
    cols.forEach((c) => {
      rest(c.cells, c.from)
      if (c.from === c.digit) c.done = true
    })
    const t0 = performance.now()
    const tick = () => {
      const t = performance.now() - t0
      let running = false
      cols.forEach((c, i) => {
        if (c.done) return
        const local = t - i * O.stagger
        if (local <= 0) {
          running = true
          return
        }
        const total = (c.digit - c.from + 10) % 10
        const pos = c.from + total * EASE(local / (total * O.stepDur))
        const enter = Math.min(1, local / ENTER_MS)
        if (c.landAt === undefined && c.from + total - pos < LAND_AT) c.landAt = t
        const since = c.landAt === undefined ? -1 : t - c.landAt
        if (since >= O.anticDur + O.landDur) {
          rest(c.cells, c.digit)
          c.done = true
          return
        }
        running = true
        const middle = 1 + (O.centerScale - 1) * enter
        let spread = enter
        let land: Land | null = null
        if (since >= 0) {
          if (!c.landFrom) c.landFrom = look(c.from + total - pos, middle)
          const arrive = 1 - smooth(since / (O.anticDur + O.landDur * ARRIVE_AT))
          if (since < O.anticDur) {
            const a = smooth(since / O.anticDur)
            land = {
              scale: c.landFrom.scale + (O.anticScale - c.landFrom.scale) * a,
              lift: -O.anticLift * a,
              opacity: c.landFrom.back + (1 - c.landFrom.back) * a,
              arrive,
            }
          } else {
            const sp = since - O.anticDur
            const sn = sp / O.landDur
            const w = wave(sn)
            land = {
              scale: sn < 1 / 6 ? 1 + (O.anticScale - 1) * w : 1 - ((O.landPeak - 1) * w) / WAVE_TROUGH,
              lift: -O.anticLift * w,
              opacity: 1,
              arrive,
            }
            spread = 1 - Math.min(1, sp / CLEAR_MS)
          }
        }
        place(c.cells, c.digit, pos, spread, middle, land)
      })
      if (running) rafRef.current = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(rafRef.current)
  }, [str])

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
      <style>{`
        :root {
          --reel-step-dur: 130ms;
          --reel-stagger: 90ms;
          --reel-ease: cubic-bezier(0.35, -0.02, 0.43, 1);
          --reel-cell: 1.2em;
          --reel-side-scale: 0.7;
          --reel-side-offset: 0.52em;
          --reel-side-blur: max(0.067em, 0.171em - 2.1px);
          --reel-side-opacity: 0.17;
          --reel-center-scale: 0.9;
          --reel-center-blur: 0.042em;
          --reel-antic-dur: 100ms;
          --reel-antic-scale: 0.94;
          --reel-antic-lift: 0.125em;
          --reel-land-dur: 740ms;
          --reel-land-peak: 1.03;
        }
        .t-reel {
          display: inline-flex;
          align-items: center;
          height: var(--reel-cell);
          font-variant-numeric: tabular-nums;
          font-size: 24px;
          font-weight: 600;
          color: #2f2a22;
        }
        .t-reel-col {
          position: relative;
          display: inline-block;
          height: var(--reel-cell);
          line-height: var(--reel-cell);
          width: 0.62em;
        }
        .t-reel-sizer { visibility: hidden; }
        .t-reel-digit {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          will-change: transform, filter, opacity;
        }
        .t-reel-sep {
          display: inline-block;
          height: var(--reel-cell);
          line-height: var(--reel-cell);
        }
        @media (prefers-reduced-motion: reduce) {
          .t-reel-digit { filter: none !important; }
        }
      `}</style>
      <button
        type="button"
        onClick={() => setIndex((i) => (i + 1) % VALUES.length)}
        style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid #d8d2c8", background: "#fff", cursor: "pointer" }}
      >
        Roll to next value
      </button>
      <div className="t-reel" aria-label={str}>
        {str.split("").map((_, i) => (
          <span className="t-reel-col" key={i}>
            <span className="t-reel-sizer">0</span>
            {DIGITS.map((d) => (
              <span
                className="t-reel-digit"
                key={d}
                ref={(el) => {
                  if (!cellRefs.current[i]) cellRefs.current[i] = []
                  cellRefs.current[i][d] = el
                }}
              >
                {d}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}
