export function LearnMoreHoverTransition() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
      <style>{`
        :root {
          --learn-shift: 2px;
          --learn-spread: 8deg;
          --learn-in: 350ms;
          --learn-out: 350ms;
          --learn-ease: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .t-learn-chevron {
          display: inline-flex;
          transform: translateX(0);
          transition: transform var(--learn-out) var(--learn-ease);
        }
        .t-learn-arm {
          transform-box: view-box;
          transform-origin: 10px 8px;
          vector-effect: non-scaling-stroke;
          transition: transform var(--learn-out) var(--learn-ease);
        }
        .t-learn:hover .t-learn-chevron { transform: translateX(var(--learn-shift)); transition-duration: var(--learn-in); }
        .t-learn:hover .t-learn-arm { transition-duration: var(--learn-in); }
        .t-learn:hover .t-learn-arm-top { transform: rotate(var(--learn-spread)); }
        .t-learn:hover .t-learn-arm-bot { transform: rotate(calc(var(--learn-spread) * -1)); }

        @media (prefers-reduced-motion: reduce) {
          .t-learn-chevron, .t-learn-arm { transition: none !important; }
        }
      `}</style>
      <span style={{ fontSize: 12, color: "#8a8478" }}>Hover the button</span>
      <button
        type="button"
        className="t-learn"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          fontSize: 13,
          padding: "6px 12px",
          borderRadius: 8,
          border: "1px solid #d8d2c8",
          background: "#fff",
          color: "#262320",
          cursor: "pointer",
        }}
      >
        Learn more
        <span className="t-learn-chevron">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path className="t-learn-arm t-learn-arm-top" d="M6 4L10 8" />
            <path className="t-learn-arm t-learn-arm-bot" d="M10 8L6 12" />
          </svg>
        </span>
      </button>
    </div>
  )
}
