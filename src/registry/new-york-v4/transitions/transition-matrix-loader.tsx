import { useState } from "react"

type Variant = "scan" | "twinkle" | "orbit" | "pulse"

const VARIANTS: Variant[] = ["scan", "twinkle", "orbit", "pulse"]
const CYCLE = 1200
const RING = [1, 2, 7, 11, 14, 13, 8, 4]
const INNER = [5, 6, 9, 10]
const TWINKLE = [7, 2, 11, 5, 14, 9, 0, 12, 3, 15, 6, 10, 13, 1, 8, 4]

function dotStyle(idx: number, variant: Variant): React.CSSProperties {
  const col = idx % 4
  if (variant === "scan") {
    return { "--d": Math.round(col * (CYCLE / 10)) } as React.CSSProperties
  }
  if (variant === "twinkle") {
    return { "--d": Math.round(TWINKLE[idx] * (CYCLE / 16)) } as React.CSSProperties
  }
  if (variant === "orbit") {
    const k = RING.indexOf(idx)
    if (k !== -1) return { "--d": Math.round(k * (CYCLE / 8)) } as React.CSSProperties
    return { animation: "none" }
  }
  // pulse
  const ring = INNER.includes(idx) ? 0 : 1
  return { "--d": Math.round(ring * (CYCLE * 0.16)) } as React.CSSProperties
}

export function MatrixLoaderTransition() {
  const [variant, setVariant] = useState<Variant>("scan")
  const [playing, setPlaying] = useState(true)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
      <style>{`
        :root {
          --matrix-cycle: 1200ms;
          --matrix-base: #d9d9d9;
          --matrix-active: #85858f;
          --matrix-ease: ease-in-out;
        }
        .t-matrix {
          display: grid;
          grid-template-columns: repeat(4, 2px);
          grid-auto-rows: 2px;
          gap: 2px;
        }
        .t-matrix i {
          display: block;
          background: var(--matrix-base);
          animation: t-matrix-pulse var(--matrix-cycle) var(--matrix-ease) infinite;
          animation-delay: calc(var(--d, 0) * 1ms);
        }
        .t-matrix.is-paused i { animation-play-state: paused; }
        .t-matrix i.is-gap { visibility: hidden; animation: none; }
        @keyframes t-matrix-pulse {
          0%, 45%, 100% { background-color: var(--matrix-base); }
          15%           { background-color: var(--matrix-active); }
        }

        @media (prefers-reduced-motion: reduce) {
          .t-matrix i { animation: none !important; }
        }
      `}</style>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={() => setVariant((v) => VARIANTS[(VARIANTS.indexOf(v) + 1) % VARIANTS.length])}
          style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid #d8d2c8", background: "#fff", cursor: "pointer" }}
        >
          {variant}
        </button>
        <button
          type="button"
          onClick={() => setPlaying((v) => !v)}
          style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid #d8d2c8", background: "#fff", cursor: "pointer" }}
        >
          {playing ? "Pause" : "Play"}
        </button>
      </div>
      <div
        className={`t-matrix${playing ? "" : " is-paused"}`}
        data-variant={variant}
        style={{ padding: 10, borderRadius: 8, background: "#f5f1ea", border: "1px solid #e2dccf" }}
      >
        {Array.from({ length: 16 }, (_, idx) => (
          <i key={idx} style={dotStyle(idx, variant)} />
        ))}
      </div>
    </div>
  )
}
