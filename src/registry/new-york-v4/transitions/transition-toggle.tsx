import { useState } from "react"

export function ToggleTransition() {
  const [on, setOn] = useState(false)
  const [init, setInit] = useState(false)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
      <style>{`
        :root {
          --toggle-dur: 350ms;
          --toggle-travel: 14.66px;
          --toggle-ov1: 1px;
          --toggle-ov2: 0px;
          --toggle-track: 0ms;
          --toggle-ease: cubic-bezier(0.34, 1.35, 0.64, 1);
        }
        .t-toggle { transition: background var(--toggle-track) var(--toggle-ease); }
        .t-toggle-thumb { translate: 0 0; will-change: translate; }
        .t-toggle[data-on="true"] .t-toggle-thumb { translate: var(--toggle-travel) 0; }
        .t-toggle.is-init[data-on="true"] .t-toggle-thumb { animation: t-toggle-on var(--toggle-dur) var(--toggle-ease) both; }
        .t-toggle.is-init[data-on="false"] .t-toggle-thumb { animation: t-toggle-off var(--toggle-dur) var(--toggle-ease) both; }
        @keyframes t-toggle-on {
          0% { translate: 0 0; }
          55% { translate: calc(var(--toggle-travel) + var(--toggle-ov1)) 0; }
          80% { translate: calc(var(--toggle-travel) - var(--toggle-ov2)) 0; }
          100% { translate: var(--toggle-travel) 0; }
        }
        @keyframes t-toggle-off {
          0% { translate: var(--toggle-travel) 0; }
          55% { translate: calc(0px - var(--toggle-ov1)) 0; }
          80% { translate: var(--toggle-ov2) 0; }
          100% { translate: 0 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .t-toggle-thumb { animation: none !important; }
        }
      `}</style>
      <button
        type="button"
        className={`t-toggle${init ? " is-init" : ""}`}
        role="switch"
        aria-checked={on}
        data-on={on}
        onClick={() => {
          setInit(true)
          setOn((v) => !v)
        }}
        style={{
          position: "relative",
          width: 36,
          height: 20,
          borderRadius: 999,
          border: "none",
          padding: 2,
          background: on ? "#262320" : "#d8d2c8",
          cursor: "pointer",
        }}
      >
        <span
          className="t-toggle-thumb"
          style={{
            display: "block",
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#fff",
            boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
          }}
        />
      </button>
    </div>
  )
}
