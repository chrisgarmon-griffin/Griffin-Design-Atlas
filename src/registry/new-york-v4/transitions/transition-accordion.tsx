import { useState } from "react"

export function AccordionTransition() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start", width: "100%" }}>
      <style>{`
        :root {
          --acc-expand: 250ms;
          --acc-collapse: 250ms;
          --acc-chevron: 250ms;
          --acc-ease: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .t-acc-panel {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows var(--acc-collapse) var(--acc-ease);
        }
        .t-acc[data-open="true"] .t-acc-panel {
          grid-template-rows: 1fr;
          transition: grid-template-rows var(--acc-expand) var(--acc-ease);
        }
        .t-acc-panel-inner {
          overflow: hidden;
          opacity: 0;
          filter: blur(2px);
          transition:
            opacity var(--acc-collapse) var(--acc-ease),
            filter var(--acc-collapse) var(--acc-ease);
        }
        .t-acc[data-open="true"] .t-acc-panel-inner {
          opacity: 1;
          filter: blur(0);
          transition:
            opacity var(--acc-expand) var(--acc-ease),
            filter var(--acc-expand) var(--acc-ease);
        }
        .t-acc-chevron {
          display: inline-flex;
          transform: scaleY(1);
          transform-origin: center;
          transition: transform var(--acc-chevron) var(--acc-ease);
        }
        .t-acc-chevron path { vector-effect: non-scaling-stroke; }
        .t-acc[data-open="true"] .t-acc-chevron {
          transform: scaleY(-1);
        }
        @media (prefers-reduced-motion: reduce) {
          .t-acc-panel, .t-acc-panel-inner, .t-acc-chevron {
            transition: none !important;
          }
        }
      `}</style>
      <div className="t-acc" data-open={open} style={{ width: "100%" }}>
        <button
          className="t-acc-head"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            background: "#f5f1ea",
            border: "1px solid #e2dccf",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 12,
            color: "#2f2a22",
            cursor: "pointer",
          }}
        >
          What's included
          <span className="t-acc-chevron">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6.5L8 10.5L12 6.5" />
            </svg>
          </span>
        </button>
        <div className="t-acc-panel">
          <div className="t-acc-panel-inner">
            <p style={{ fontSize: 12, color: "#6b6558", padding: "10px 12px 0", margin: 0 }}>
              Underwriting review, document collection, and closing coordination for every file.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
