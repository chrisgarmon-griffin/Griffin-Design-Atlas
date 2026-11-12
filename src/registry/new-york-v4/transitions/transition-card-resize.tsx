import { useState } from "react"

export function CardResizeTransition() {
  const [small, setSmall] = useState(false)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      <style>{`
        :root {
          --resize-dur: 300ms;
          --resize-ease: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .t-resize {
          transition:
            width  var(--resize-dur) var(--resize-ease),
            height var(--resize-dur) var(--resize-ease);
          will-change: width, height;
        }
        @media (prefers-reduced-motion: reduce) {
          .t-resize { transition: none !important; }
        }
      `}</style>
      <button
        type="button"
        onClick={() => setSmall((v) => !v)}
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
        {small ? "Expand" : "Collapse"}
      </button>
      <div
        className="t-resize"
        style={{
          width: small ? 120 : 220,
          height: small ? 60 : 110,
          borderRadius: 12,
          background: "#f5f1ea",
          border: "1px solid #e2dccf",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          color: "#6b6558",
        }}
      >
        Resizable card
      </div>
    </div>
  )
}
