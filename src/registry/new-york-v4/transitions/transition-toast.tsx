import { useState } from "react"

export function ToastTransition() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start", width: "100%" }}>
      <style>{`
        :root {
          --toast-open: 350ms;
          --toast-close: 250ms;
          --toast-distance: 16px;
          --toast-blur: 2px;
          --toast-scale: 0.97;
          --toast-ease: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .t-toast {
          opacity: 0;
          transform: translateY(var(--toast-distance)) scale(var(--toast-scale));
          filter: blur(var(--toast-blur));
          will-change: transform, opacity, filter;
          transition:
            opacity var(--toast-close) var(--toast-ease),
            transform var(--toast-close) var(--toast-ease),
            filter var(--toast-close) var(--toast-ease);
        }
        .t-toast.is-open {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
          transition:
            opacity var(--toast-open) var(--toast-ease),
            transform var(--toast-open) var(--toast-ease),
            filter var(--toast-open) var(--toast-ease);
        }
        @media (prefers-reduced-motion: reduce) {
          .t-toast { transition: none !important; }
        }
      `}</style>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid #d8d2c8", background: "#fff", cursor: "pointer" }}
      >
        {open ? "Dismiss" : "Show toast"}
      </button>
      <div style={{ position: "relative", width: "100%", height: 56 }}>
        <div
          className={`t-toast${open ? " is-open" : ""}`}
          data-open={open}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            borderRadius: 10,
            background: "#262320",
            color: "#f5f1ea",
            fontSize: 13,
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
          }}
        >
          Saved successfully
        </div>
      </div>
    </div>
  )
}
