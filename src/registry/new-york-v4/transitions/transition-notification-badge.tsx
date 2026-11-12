import { useState } from "react"

export function NotificationBadgeTransition() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
      <style>{`
        :root {
          --badge-slide-dur: 260ms;
          --badge-pop-dur: 500ms;
          --badge-pop-close-dur: 180ms;
          --badge-fade-dur: 400ms;
          --badge-fade-close-dur: 180ms;
          --badge-blur: 2px;
          --badge-offset-x: -8.2px;
          --badge-offset-y: 12.4px;
          --badge-slide-ease: cubic-bezier(0.22, 1, 0.36, 1);
          --badge-pop-ease: cubic-bezier(0.34, 1.36, 0.64, 1);
          --badge-close-ease: cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes t-badge-slide-in {
          from { transform: translate(var(--badge-offset-x), var(--badge-offset-y)); }
          to   { transform: translate(0, 0); }
        }

        .t-badge {
          position: absolute;
          top: -6px;
          right: -8px;
          pointer-events: none;
          will-change: transform;
        }
        .t-badge[data-open="true"] {
          animation: t-badge-slide-in var(--badge-slide-dur) var(--badge-slide-ease);
        }

        .t-badge-dot {
          display: block;
          transform-origin: center;
          transform: scale(1);
          opacity: 1;
          filter: blur(0);
          transition:
            transform var(--badge-pop-dur)  var(--badge-pop-ease),
            opacity   var(--badge-fade-dur) var(--badge-pop-ease),
            filter    var(--badge-pop-dur)  var(--badge-pop-ease);
          will-change: transform, opacity, filter;
        }
        .t-badge[data-open="false"] .t-badge-dot {
          transform: scale(0);
          opacity: 0;
          filter: blur(var(--badge-blur));
          transition:
            transform var(--badge-pop-close-dur)  var(--badge-close-ease),
            opacity   var(--badge-fade-close-dur) var(--badge-close-ease),
            filter    var(--badge-pop-close-dur)  var(--badge-close-ease);
        }

        @media (prefers-reduced-motion: reduce) {
          .t-badge, .t-badge-dot { animation: none !important; transition: none !important; }
        }
      `}</style>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "relative",
          width: 44,
          height: 44,
          borderRadius: 10,
          border: "1px solid #e2dccf",
          background: "#f5f1ea",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          color: "#3a362e",
        }}
      >
        🔔
        <span className="t-badge" data-open={open ? "true" : "false"}>
          <span
            className="t-badge-dot"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 16,
              height: 16,
              padding: "0 4px",
              borderRadius: 999,
              background: "#c0392b",
              color: "#fff",
              fontSize: 10,
              lineHeight: 1,
            }}
          >
            1
          </span>
        </span>
      </button>
      <span style={{ fontSize: 11, color: "#8a8372" }}>Click the bell to toggle the badge</span>
    </div>
  )
}
