import { useState } from "react"

type Digit = {
  ch: string
  isSame: boolean
  stagger?: number
  oldCh?: string
}

function diffDigits(prev: string, next: string): Digit[] {
  let same = 0
  while (same < prev.length && same < next.length && prev[same] === next[same]) same++
  return [...next].map((ch, i) => {
    const fromEnd = next.length - 1 - i
    const isDigit = /\d/.test(ch)
    const isSame = i < same || !isDigit
    const rawOld = prev[prev.length - (next.length - i)]
    const oldCh = rawOld && /\d/.test(rawOld) ? rawOld : undefined
    return {
      ch,
      isSame,
      stagger: fromEnd === 1 ? 1 : fromEnd === 0 ? 2 : undefined,
      oldCh: isSame ? undefined : oldCh,
    }
  })
}

const VALUES = [1284, 1305, 942, 15230]

export function NumberPopInTransition() {
  const [index, setIndex] = useState(0)
  const [prevStr, setPrevStr] = useState(VALUES[0].toLocaleString("en-US"))
  const value = VALUES[index]
  const str = value.toLocaleString("en-US")
  const digits = diffDigits(prevStr, str)

  function roll() {
    setPrevStr(str)
    setIndex((i) => (i + 1) % VALUES.length)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
      <style>{`
        :root {
          --digit-dur: 600ms;
          --digit-exit-dur: 155ms;
          --digit-enter-delay: 50ms;
          --digit-stagger: 40ms;
          --digit-distance: 0.52em;
          --digit-exit-distance: 0.52em;
          --digit-blur: max(0.067em, 0.171em - 2.1px);
          --digit-lift: 0.125em;
          --digit-start-scale: 0.7;
          --digit-peak: 1.03;
        }
        .t-digit-group { display: inline-flex; align-items: baseline; }
        .t-digit-slot { position: relative; display: inline-block; }
        .t-digit-old { position: absolute; inset: 0; text-align: center; pointer-events: none; }
        .t-digit { display: inline-block; will-change: transform, opacity, filter; }
        .t-digit-group.is-animating .t-digit {
          animation: t-digit-in var(--digit-dur) linear both;
          animation-delay: calc(var(--digit-stagger) * var(--digit-i, 0) + var(--digit-enter-delay));
        }
        .t-digit-group.is-animating .t-digit-old {
          animation: t-digit-out var(--digit-exit-dur) linear both;
          animation-delay: calc(var(--digit-stagger) * var(--digit-i, 0));
        }
        .t-digit-group.is-animating [data-stagger="1"] { --digit-i: 1; }
        .t-digit-group.is-animating [data-stagger="2"] { --digit-i: 2; }
        .t-digit-group.is-animating .t-digit[data-same] { animation: none; }

        @keyframes t-digit-in {
          0% { transform: translateY(calc(var(--digit-distance) * 1 + var(--digit-lift) * 0)) scale(var(--digit-start-scale)); opacity: 0; filter: blur(calc(var(--digit-blur) * 1)); }
          5% { transform: translateY(calc(var(--digit-distance) * 0.941 + var(--digit-lift) * 0.216)) scale(var(--digit-start-scale)); opacity: 0.059; filter: blur(calc(var(--digit-blur) * 1)); }
          10% { transform: translateY(calc(var(--digit-distance) * 0.755 + var(--digit-lift) * 0.648)) scale(var(--digit-start-scale)); opacity: 0.245; filter: blur(calc(var(--digit-blur) * 1)); }
          15% { transform: translateY(calc(var(--digit-distance) * 0.475 + var(--digit-lift) * 0.972)) scale(var(--digit-start-scale)); opacity: 0.525; filter: blur(calc(var(--digit-blur) * 1)); }
          20% { transform: translateY(calc(var(--digit-distance) * 0.206 + var(--digit-lift) * 0.792)) scale(calc(1 + (var(--digit-start-scale) - 1) * 0.792)); opacity: 0.794; filter: blur(calc(var(--digit-blur) * 0.9)); }
          25% { transform: translateY(calc(var(--digit-distance) * 0.041 + var(--digit-lift) * 0.392)) scale(calc(1 + (var(--digit-start-scale) - 1) * 0.392)); opacity: 0.959; filter: blur(calc(var(--digit-blur) * 0.75)); }
          30% { transform: translateY(calc(var(--digit-distance) * 0 + var(--digit-lift) * 0.033)) scale(calc(1 + (var(--digit-start-scale) - 1) * 0.033)); opacity: 1; filter: blur(calc(var(--digit-blur) * 0.6)); }
          35% { transform: translateY(calc(var(--digit-distance) * 0 + var(--digit-lift) * -0.194)) scale(calc(1 + (var(--digit-peak) - 1) * 0.711)); opacity: 1; filter: blur(calc(var(--digit-blur) * 0.45)); }
          40% { transform: translateY(calc(var(--digit-distance) * 0 + var(--digit-lift) * -0.272)) scale(calc(1 + (var(--digit-peak) - 1) * 0.997)); opacity: 1; filter: blur(calc(var(--digit-blur) * 0.3)); }
          45% { transform: translateY(calc(var(--digit-distance) * 0 + var(--digit-lift) * -0.238)) scale(calc(1 + (var(--digit-peak) - 1) * 0.87)); opacity: 1; filter: blur(calc(var(--digit-blur) * 0.15)); }
          50% { transform: translateY(calc(var(--digit-distance) * 0 + var(--digit-lift) * -0.146)) scale(calc(1 + (var(--digit-peak) - 1) * 0.535)); opacity: 1; filter: blur(calc(var(--digit-blur) * 0)); }
          55% { transform: translateY(calc(var(--digit-distance) * 0 + var(--digit-lift) * -0.05)) scale(calc(1 + (var(--digit-peak) - 1) * 0.183)); opacity: 1; filter: blur(calc(var(--digit-blur) * 0)); }
          60% { transform: translateY(calc(var(--digit-distance) * 0 + var(--digit-lift) * 0.019)) scale(calc(1 + (var(--digit-peak) - 1) * -0.069)); opacity: 1; filter: blur(calc(var(--digit-blur) * 0)); }
          65% { transform: translateY(calc(var(--digit-distance) * 0 + var(--digit-lift) * 0.05)) scale(calc(1 + (var(--digit-peak) - 1) * -0.185)); opacity: 1; filter: blur(calc(var(--digit-blur) * 0)); }
          70% { transform: translateY(calc(var(--digit-distance) * 0 + var(--digit-lift) * 0.051)) scale(calc(1 + (var(--digit-peak) - 1) * -0.187)); opacity: 1; filter: blur(calc(var(--digit-blur) * 0)); }
          75% { transform: translateY(calc(var(--digit-distance) * 0 + var(--digit-lift) * 0.035)) scale(calc(1 + (var(--digit-peak) - 1) * -0.128)); opacity: 1; filter: blur(calc(var(--digit-blur) * 0)); }
          80% { transform: translateY(calc(var(--digit-distance) * 0 + var(--digit-lift) * 0.016)) scale(calc(1 + (var(--digit-peak) - 1) * -0.057)); opacity: 1; filter: blur(calc(var(--digit-blur) * 0)); }
          85% { transform: translateY(calc(var(--digit-distance) * 0 + var(--digit-lift) * 0.002)) scale(calc(1 + (var(--digit-peak) - 1) * -0.007)); opacity: 1; filter: blur(calc(var(--digit-blur) * 0)); }
          90% { transform: translateY(calc(var(--digit-distance) * 0 + var(--digit-lift) * -0.004)) scale(calc(1 + (var(--digit-peak) - 1) * 0.013)); opacity: 1; filter: blur(calc(var(--digit-blur) * 0)); }
          95% { transform: translateY(calc(var(--digit-distance) * 0 + var(--digit-lift) * -0.003)) scale(calc(1 + (var(--digit-peak) - 1) * 0.011)); opacity: 1; filter: blur(calc(var(--digit-blur) * 0)); }
          100% { transform: translateY(calc(var(--digit-distance) * 0 + var(--digit-lift) * 0)) scale(1); opacity: 1; filter: blur(calc(var(--digit-blur) * 0)); }
        }
        @keyframes t-digit-out {
          0% { transform: translateY(calc(var(--digit-exit-distance) * 0)) scale(calc(1 + (var(--digit-start-scale) - 1) * 0)); opacity: 1; filter: blur(calc(var(--digit-blur) * 0)); }
          10% { transform: translateY(calc(var(--digit-exit-distance) * -0.009)) scale(calc(1 + (var(--digit-start-scale) - 1) * 0.009)); opacity: 1; filter: blur(calc(var(--digit-blur) * 0.009)); }
          20% { transform: translateY(calc(var(--digit-exit-distance) * -0.042)) scale(calc(1 + (var(--digit-start-scale) - 1) * 0.042)); opacity: 1; filter: blur(calc(var(--digit-blur) * 0.042)); }
          30% { transform: translateY(calc(var(--digit-exit-distance) * -0.112)) scale(calc(1 + (var(--digit-start-scale) - 1) * 0.112)); opacity: 1; filter: blur(calc(var(--digit-blur) * 0.112)); }
          40% { transform: translateY(calc(var(--digit-exit-distance) * -0.252)) scale(calc(1 + (var(--digit-start-scale) - 1) * 0.252)); opacity: 1; filter: blur(calc(var(--digit-blur) * 0.252)); }
          50% { transform: translateY(calc(var(--digit-exit-distance) * -0.5)) scale(calc(1 + (var(--digit-start-scale) - 1) * 0.5)); opacity: 0.833; filter: blur(calc(var(--digit-blur) * 0.5)); }
          60% { transform: translateY(calc(var(--digit-exit-distance) * -0.748)) scale(calc(1 + (var(--digit-start-scale) - 1) * 0.748)); opacity: 0.42; filter: blur(calc(var(--digit-blur) * 0.748)); }
          70% { transform: translateY(calc(var(--digit-exit-distance) * -0.888)) scale(calc(1 + (var(--digit-start-scale) - 1) * 0.888)); opacity: 0.187; filter: blur(calc(var(--digit-blur) * 0.888)); }
          80% { transform: translateY(calc(var(--digit-exit-distance) * -0.958)) scale(calc(1 + (var(--digit-start-scale) - 1) * 0.958)); opacity: 0.069; filter: blur(calc(var(--digit-blur) * 0.958)); }
          90% { transform: translateY(calc(var(--digit-exit-distance) * -0.991)) scale(calc(1 + (var(--digit-start-scale) - 1) * 0.991)); opacity: 0.015; filter: blur(calc(var(--digit-blur) * 0.991)); }
          100% { transform: translateY(calc(var(--digit-exit-distance) * -1)) scale(calc(1 + (var(--digit-start-scale) - 1) * 1)); opacity: 0; filter: blur(calc(var(--digit-blur) * 1)); }
        }

        @media (prefers-reduced-motion: reduce) {
          .t-digit-group .t-digit { animation: none !important; }
          .t-digit-group .t-digit-old { display: none; }
        }
      `}</style>
      <button
        type="button"
        onClick={roll}
        style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid #d8d2c8", background: "#fff", cursor: "pointer" }}
      >
        Pop in next number
      </button>
      <span
        key={str}
        className="t-digit-group is-animating"
        aria-label={str}
        style={{ fontSize: 26, fontWeight: 600, color: "#2f2a22" }}
      >
        {digits.map((d, i) =>
          d.isSame ? (
            <span key={i} className="t-digit" data-same="">
              {d.ch}
            </span>
          ) : (
            <span key={i} className="t-digit-slot" data-stagger={d.stagger}>
              {d.oldCh !== undefined && (
                <span className="t-digit-old" aria-hidden="true">
                  {d.oldCh}
                </span>
              )}
              <span className="t-digit">{d.ch}</span>
            </span>
          )
        )}
      </span>
    </div>
  )
}
