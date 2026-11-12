import { useState } from "react"
import { Moon, Sun } from "lucide-react"

export function IconSwapTransition() {
  const [state, setState] = useState<"a" | "b">("a")

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      <style>{`
        :root {
          --icon-swap-dur: 250ms;
          --icon-swap-blur: 2px;
          --icon-swap-start-scale: 0.25;
          --icon-swap-ease: ease-in-out;
        }
        .t-icon-swap {
          position: relative;
          display: inline-grid;
        }
        .t-icon-swap .t-icon {
          grid-area: 1 / 1;
          transition:
            opacity   var(--icon-swap-dur) var(--icon-swap-ease),
            filter    var(--icon-swap-dur) var(--icon-swap-ease),
            transform var(--icon-swap-dur) var(--icon-swap-ease);
        }
        .t-icon-swap[data-state="a"] .t-icon[data-icon="a"],
        .t-icon-swap[data-state="b"] .t-icon[data-icon="b"] {
          opacity: 1;
          filter: blur(0);
          transform: scale(1);
        }
        .t-icon-swap[data-state="a"] .t-icon[data-icon="b"],
        .t-icon-swap[data-state="b"] .t-icon[data-icon="a"] {
          opacity: 0;
          filter: blur(var(--icon-swap-blur));
          transform: scale(var(--icon-swap-start-scale));
        }
        @media (prefers-reduced-motion: reduce) {
          .t-icon-swap .t-icon { transition: none !important; }
        }
      `}</style>

      <button
        type="button"
        onClick={() => setState((s) => (s === "a" ? "b" : "a"))}
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          border: "1px solid #e2dccf",
          background: "#f5f1ea",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="t-icon-swap" data-state={state}>
          <span className="t-icon" data-icon="a" style={{ color: "#3a362e" }}>
            <Sun size={20} />
          </span>
          <span className="t-icon" data-icon="b" style={{ color: "#3a362e" }}>
            <Moon size={20} />
          </span>
        </div>
      </button>
      <span style={{ fontSize: 11, color: "#8a8372" }}>Click to swap icons</span>
    </div>
  )
}
