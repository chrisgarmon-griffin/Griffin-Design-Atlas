import { useState } from "react"

export function SuccessCheckTransition() {
  const [playKey, setPlayKey] = useState(0)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
      <style>{`
        :root {
          --check-opacity-dur: 500ms;
          --check-rotate-dur: 500ms;
          --check-rotate-from: 80deg;
          --check-bob-dur: 500ms;
          --check-y-amount: 40px;
          --check-blur-dur: 500ms;
          --check-blur-from: 10px;
          --check-path-dur: 500ms;
          --check-path-delay: 80ms;
          --check-ease-out: cubic-bezier(0.22, 1, 0.36, 1);
          --check-ease-opacity: cubic-bezier(0.22, 1, 0.36, 1);
          --check-ease-rotate: cubic-bezier(0.22, 1, 0.36, 1);
          --check-ease-bob: cubic-bezier(0.34, 1.35, 0.64, 1);
          --check-ease-path: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .t-success-check {
          display: inline-block;
          transform-origin: center;
          opacity: 0;
          will-change: transform, opacity, filter;
        }
        .t-success-check svg { display: block; overflow: visible; }
        .t-success-check svg path {
          stroke-dasharray: 29;
          stroke-dashoffset: 29;
        }
        .t-success-check[data-state="in"] {
          animation:
            t-check-fade   var(--check-opacity-dur) var(--check-ease-opacity) forwards,
            t-check-rotate var(--check-rotate-dur)  var(--check-ease-rotate)  forwards,
            t-check-blur   var(--check-blur-dur)    var(--check-ease-out)     forwards,
            t-check-bob    var(--check-bob-dur)     var(--check-ease-bob)     forwards;
        }
        .t-success-check[data-state="in"] svg path {
          animation: t-check-draw var(--check-path-dur) var(--check-ease-path) var(--check-path-delay, 0ms) forwards;
        }

        @keyframes t-check-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes t-check-rotate {
          from { transform: rotate(var(--check-rotate-from)); }
          to   { transform: rotate(0deg); }
        }
        @keyframes t-check-blur {
          from { filter: blur(var(--check-blur-from)); }
          to   { filter: blur(0); }
        }
        @keyframes t-check-bob {
          from { translate: 0 var(--check-y-amount); }
          to   { translate: 0 0; }
        }
        @keyframes t-check-draw { to { stroke-dashoffset: 0; } }

        @media (prefers-reduced-motion: reduce) {
          .t-success-check { animation: none !important; opacity: 1; }
          .t-success-check svg path { animation: none !important; stroke-dashoffset: 0 !important; }
        }
      `}</style>

      <button
        type="button"
        onClick={() => setPlayKey((k) => k + 1)}
        style={{
          fontSize: 12,
          padding: "4px 10px",
          borderRadius: 6,
          border: "1px solid #d8d2c8",
          background: "#fff",
          color: "#3a362e",
          cursor: "pointer",
        }}
      >
        Replay
      </button>

      <span
        key={playKey}
        className="t-success-check"
        data-state="in"
        aria-hidden="true"
        style={{ color: "#2e7d4f" }}
      >
        <svg viewBox="0 0 48 48" fill="none" width={40} height={40}>
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" opacity="0.25" />
          <path
            d="M14 24.5L20.5 31L34 17"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  )
}
