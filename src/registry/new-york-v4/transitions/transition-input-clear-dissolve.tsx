import { useEffect, useRef, useState } from "react"

const CLEAR_DUR = 1000
const OUT_DUR = 400
const IN_DUR = 400
const OUT_FLY = 12
const IN_FLY = 12
const BLUR = 2
const GLOW_DELAY = 50
const GLOW_PEAK_AT = 0.15
const GLOW_OPACITY = 0.42
const GLOW_SPREAD = 1.5

function easeOutCubicBezier(t: number) {
  // Approximates cubic-bezier(0.22, 1, 0.36, 1), the spec's out/in ease.
  const x1 = 0.22
  const y1 = 1
  const x2 = 0.36
  const y2 = 1
  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx
  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by
  if (t <= 0) return 0
  if (t >= 1) return 1
  let s = t
  for (let i = 0; i < 8; i++) {
    const dx = ((ax * s + bx) * s + cx) * s - t
    const d = (3 * ax * s + 2 * bx) * s + cx
    if (Math.abs(dx) < 1e-6 || d === 0) break
    s -= dx / d
  }
  return ((ay * s + by) * s + cy) * s
}

export function InputClearDissolveTransition() {
  const [value, setValue] = useState("Search query")
  const [clearing, setClearing] = useState(false)
  const [mirrorText, setMirrorText] = useState("")
  const [mirrorStyle, setMirrorStyle] = useState<React.CSSProperties>({})
  const [placeholderStyle, setPlaceholderStyle] = useState<React.CSSProperties>({})
  const [glowStyle, setGlowStyle] = useState<React.CSSProperties>({ opacity: 0, background: "" })
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const buildGlow = (text: string) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const wrap = wrapRef.current
    const input = inputRef.current
    if (!ctx || !wrap || !input) return ""
    ctx.font = getComputedStyle(input).font
    const w = wrap.clientWidth || 280
    const padLeft = parseFloat(getComputedStyle(input).paddingLeft) || 12
    const layers: string[] = []
    let x = 0
    text.split(/(\s+)/).forEach((seg) => {
      const segW = ctx.measureText(seg).width
      if (seg.trim()) {
        const cx = padLeft + x + segW / 2
        const hw = Math.max(segW * 0.45, 8) * GLOW_SPREAD
        ;[
          [0, 0.8, 7, 0.22],
          [hw * 0.45, 0.55, 8, 0.18],
          [-hw * 0.4, 0.65, 6, 0.16],
          [hw * 0.15, 0.9, 5, 0.14],
        ].forEach(([dx, rwm, rh, a]) => {
          const lx = (((cx + dx) / w) * 100).toFixed(2)
          layers.push(
            `radial-gradient(ellipse ${Math.max(hw * rwm, 2).toFixed(1)}px ${rh}px at ${lx}% 100%, rgba(0,0,0,${a}), transparent)`
          )
        })
      }
      x += segW
    })
    return layers.join(", ")
  }

  const clearWithAnimation = () => {
    if (clearing || !value) return
    setClearing(true)
    const text = value
    setMirrorText(text)
    setValue("")
    setGlowStyle({ opacity: 0, background: buildGlow(text) })
    setPlaceholderStyle({ transform: `translateY(-${IN_FLY}px)`, opacity: 0.9, filter: `blur(${BLUR}px)` })

    const t0 = performance.now()
    const tick = (now: number) => {
      const el = now - t0
      const eo = easeOutCubicBezier(Math.min(1, el / OUT_DUR))
      setMirrorStyle({
        transform: `translateY(${(eo * OUT_FLY).toFixed(1)}px)`,
        opacity: Number((1 - eo).toFixed(3)),
        filter: `blur(${(eo * BLUR).toFixed(1)}px)`,
      })

      const ei = easeOutCubicBezier(Math.min(1, el / IN_DUR))
      setPlaceholderStyle({
        transform: `translateY(${(-IN_FLY + ei * IN_FLY).toFixed(1)}px)`,
        opacity: Number((0.9 + ei * 0.1).toFixed(3)),
        filter: `blur(${(BLUR - ei * BLUR).toFixed(1)}px)`,
      })

      let g = 0
      if (el > GLOW_DELAY) {
        const gp = Math.min(1, (el - GLOW_DELAY) / Math.max(1, CLEAR_DUR - GLOW_DELAY))
        g = gp < GLOW_PEAK_AT ? gp / GLOW_PEAK_AT : 1 - (gp - GLOW_PEAK_AT) / (1 - GLOW_PEAK_AT)
      }
      setGlowStyle((prev) => ({ ...prev, opacity: Number((g * GLOW_OPACITY).toFixed(3)) }))

      if (el < CLEAR_DUR) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setClearing(false)
        setMirrorStyle({})
        setPlaceholderStyle({})
        setMirrorText("")
        setGlowStyle({ opacity: 0, background: "" })
        inputRef.current?.focus({ preventScroll: true })
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  const hasValue = value.length > 0

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start", width: "100%" }}>
      <style>{`
        :root {
          --clear-dur: 1000ms;
          --clear-out-dur: 400ms;
          --clear-in-dur: 400ms;
          --clear-out-fly: 12px;
          --clear-in-fly: 12px;
          --clear-out-ease: cubic-bezier(0.22, 1, 0.36, 1);
          --clear-in-ease: cubic-bezier(0.22, 1, 0.36, 1);
          --clear-blur: 2px;
          --glow-delay: 50ms;
          --glow-peak-at: 0.15;
          --glow-opacity: 0.42;
          --glow-spread: 1.5;
        }
        .t-clear {
          position: relative;
          overflow: hidden;
        }
        .t-clear-mirror,
        .t-clear-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          pointer-events: none;
          white-space: nowrap;
          overflow: hidden;
          z-index: 2;
        }
        .t-clear-mirror { opacity: 0; }
        .t-clear.has-value .t-clear-mirror,
        .t-clear.is-clearing .t-clear-mirror { opacity: 1; }
        .t-clear.has-value > input,
        .t-clear.is-clearing > input {
          -webkit-text-fill-color: transparent;
        }
        .t-clear.has-value .t-clear-placeholder { opacity: 0; }
        .t-clear-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          z-index: 3;
          mix-blend-mode: multiply;
        }
        @media (prefers-reduced-motion: reduce) {
          .t-clear-glow { opacity: 0 !important; }
        }
      `}</style>
      <div
        ref={wrapRef}
        className={`t-clear${hasValue ? " has-value" : ""}${clearing ? " is-clearing" : ""}`}
        style={{
          width: "100%",
          height: 32,
          border: "1px solid #d8d2c8",
          borderRadius: 8,
          background: "#fff",
          boxSizing: "border-box",
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            padding: "0 12px",
            fontSize: 12,
            boxSizing: "border-box",
          }}
        />
        <div className="t-clear-mirror" aria-hidden="true" style={{ padding: "0 12px", fontSize: 12, ...mirrorStyle }}>
          {mirrorText}
        </div>
        <div className="t-clear-placeholder" aria-hidden="true" style={{ padding: "0 12px", fontSize: 12, color: "#9a9284", ...placeholderStyle }}>
          Search
        </div>
        <div className="t-clear-glow" aria-hidden="true" style={glowStyle} />
      </div>
      <button
        type="button"
        onClick={clearWithAnimation}
        disabled={!value || clearing}
        style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid #d8d2c8", background: "#f5f1ea", cursor: "pointer" }}
      >
        Clear
      </button>
    </div>
  )
}
