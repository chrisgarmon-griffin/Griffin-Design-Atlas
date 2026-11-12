import { useId, useState } from "react"

export function CheckboxCheckTransition() {
  const [checked, setChecked] = useState(false)
  const id = useId()

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
      <style>{`
        :root {
          --check-box: 150ms;
          --check-draw: 350ms;
          --check-delay: 0ms;
          --check-uncheck: 150ms;
          --check-ease: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .t-check {
          transition:
            background var(--check-box) var(--check-ease),
            box-shadow var(--check-box) var(--check-ease);
        }
        .t-check svg path {
          stroke-dasharray: var(--check-len, 15);
          stroke-dashoffset: var(--check-len, 15);
          transition: stroke-dashoffset var(--check-uncheck) var(--check-ease);
        }
        .t-check[aria-checked="true"] svg path {
          stroke-dashoffset: 0;
          transition: stroke-dashoffset var(--check-draw) var(--check-ease) var(--check-delay);
        }

        @media (prefers-reduced-motion: reduce) {
          .t-check, .t-check svg path { transition: none !important; }
        }
      `}</style>
      <label htmlFor={id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#262320", cursor: "pointer" }}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={() => setChecked((v) => !v)}
          style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}
        />
        <span
          className="t-check"
          role="checkbox"
          aria-checked={checked}
          onClick={() => setChecked((v) => !v)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 20,
            height: 20,
            borderRadius: 5,
            border: "1px solid #c9c2b4",
            background: checked ? "#262320" : "#fff",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 10.1668 10.1668" fill="none" stroke="#f5f1ea" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 5.52L3.92 9.17L9.17 1" />
          </svg>
        </span>
        Keep me signed in
      </label>
    </div>
  )
}
