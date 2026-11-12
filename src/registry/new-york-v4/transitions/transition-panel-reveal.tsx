import { useState } from "react"

export function PanelRevealTransition() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start", width: "100%" }}>
      <style>{`
        :root {
          --panel-open-dur: 400ms;
          --panel-close-dur: 350ms;
          --panel-translate-y: 100px;
          --panel-blur: 2px;
          --panel-ease: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .t-panel-slide {
          transform: translateY(var(--panel-translate-y));
          opacity: 0;
          filter: blur(var(--panel-blur));
          pointer-events: none;
          transition:
            transform var(--panel-close-dur) var(--panel-ease),
            opacity   var(--panel-close-dur) var(--panel-ease),
            filter    var(--panel-close-dur) var(--panel-ease);
          will-change: transform, opacity, filter;
        }
        .t-panel-slide[data-open="true"] {
          transform: translateY(0);
          opacity: 1;
          filter: blur(0);
          pointer-events: auto;
          transition:
            transform var(--panel-open-dur) var(--panel-ease),
            opacity   var(--panel-open-dur) var(--panel-ease),
            filter    var(--panel-open-dur) var(--panel-ease);
        }
        @media (prefers-reduced-motion: reduce) {
          .t-panel-slide { transition: none !important; }
        }
      `}</style>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
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
        {open ? "Close panel" : "Open panel"}
      </button>

      <div
        style={{
          width: "100%",
          height: 70,
          borderRadius: 10,
          border: "1px solid #e2dccf",
          background: "#f5f1ea",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          className="t-panel-slide"
          data-open={open ? "true" : "false"}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            color: "#6b6558",
          }}
        >
          Revealed panel content
        </div>
      </div>
    </div>
  )
}
