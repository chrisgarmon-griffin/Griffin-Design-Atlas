import { useState } from "react"

export function ShimmerTextTransition() {
  const [active, setActive] = useState(true)
  const text = "Planning next moves"

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
      <style>{`
        :root {
          --shimmer-dur: 2000ms;
          --shimmer-base: #7c7c7c;
          --shimmer-highlight: #0d0d0d;
          --shimmer-band: 400%;
          --shimmer-ease: linear;
        }
        .t-shimmer {
          position: relative;
          display: inline-block;
          color: var(--shimmer-base);
        }
        .t-shimmer::before {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: linear-gradient(
            90deg,
            transparent          0%,
            transparent         40%,
            var(--shimmer-highlight) 50%,
            transparent         60%,
            transparent        100%
          );
          background-size: var(--shimmer-band) 100%;
          background-repeat: no-repeat;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          animation: t-shimmer var(--shimmer-dur) var(--shimmer-ease) infinite;
        }
        .t-shimmer.is-paused::before {
          animation-play-state: paused;
        }
        @keyframes t-shimmer {
          0%   { background-position: 100% 0; }
          100% { background-position: 0% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .t-shimmer::before { animation: none !important; }
        }
      `}</style>
      <span
        className={`t-shimmer${active ? "" : " is-paused"}`}
        data-text={text}
        style={{ fontSize: 13 }}
      >
        {text}
      </span>
      <button
        type="button"
        onClick={() => setActive((v) => !v)}
        style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid #d8d2c8", background: "#f5f1ea", cursor: "pointer" }}
      >
        {active ? "Pause" : "Resume"}
      </button>
    </div>
  )
}
