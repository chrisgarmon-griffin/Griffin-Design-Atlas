import { useState, type CSSProperties } from "react"

type Digit = { ch: string; same: boolean; old?: string }

function diffDigits(prev: string, next: string): Digit[] {
  const sameLength = prev.length === next.length
  return [...next].map((ch, i) => ({
    ch,
    same: sameLength && prev[i] === ch,
    old: sameLength && prev[i] !== ch ? prev[i] : undefined,
  }))
}

const VALUES = [1284, 1296, 1240, 1284]

export function NumberSubtleChangeTransition() {
  const [index, setIndex] = useState(0)
  const [prev, setPrev] = useState(VALUES[0])
  const value = VALUES[index]
  const str = value.toLocaleString("en-US")
  const prevStr = prev.toLocaleString("en-US")
  const dir = value >= prev ? 1 : -1
  const digits = diffDigits(prevStr, str)

  function tick() {
    setPrev(value)
    setIndex((i) => (i + 1) % VALUES.length)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
      <style>{`
        :root {
          --subtle-dur: 455ms;
          --subtle-distance: 0.14em;
          --subtle-blur: 0.042em;
          --subtle-ease: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .t-subtle-number {
          display: inline-flex;
          align-items: baseline;
          font-variant-numeric: tabular-nums;
        }
        .t-subtle-slot { position: relative; display: inline-block; }
        .t-subtle-new { display: inline-block; }
        .t-subtle-old { position: absolute; inset: 0; text-align: center; pointer-events: none; }
        .t-subtle-number.is-animating .t-subtle-new {
          animation: t-subtle-in var(--subtle-dur) var(--subtle-ease) both;
        }
        .t-subtle-number.is-animating .t-subtle-old {
          animation: t-subtle-out var(--subtle-dur) var(--subtle-ease) both;
        }
        @keyframes t-subtle-in {
          from {
            transform: translateY(calc(var(--subtle-distance) * var(--subtle-dir, 1)));
            opacity: 0;
            filter: blur(var(--subtle-blur));
          }
        }
        @keyframes t-subtle-out {
          to {
            transform: translateY(calc(var(--subtle-distance) * var(--subtle-dir, 1) * -1));
            opacity: 0;
            filter: blur(var(--subtle-blur));
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .t-subtle-number .t-subtle-new { animation: none !important; }
          .t-subtle-number .t-subtle-old { display: none; }
        }
      `}</style>
      <button
        type="button"
        onClick={tick}
        style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid #d8d2c8", background: "#fff", cursor: "pointer" }}
      >
        Tick live value
      </button>
      <span
        key={str}
        className="t-subtle-number is-animating"
        aria-label={str}
        style={{ "--subtle-dir": dir, fontSize: 22, fontWeight: 600, color: "#2f2a22" } as CSSProperties}
      >
        {digits.map((d, i) =>
          d.same ? (
            <span key={i}>{d.ch}</span>
          ) : (
            <span key={i} className="t-subtle-slot">
              {d.old !== undefined && (
                <span className="t-subtle-old" aria-hidden="true">
                  {d.old}
                </span>
              )}
              <span className="t-subtle-new">{d.ch}</span>
            </span>
          )
        )}
      </span>
    </div>
  )
}
