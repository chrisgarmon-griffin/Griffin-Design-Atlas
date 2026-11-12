import { useEffect, useRef, useState } from "react"

const DROPDOWN_CLOSE_DUR = 150

type OpenState = "open" | "closing" | "closed"

export function MenuDropdownTransition() {
  const [state, setState] = useState<OpenState>("closed")
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const open = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setState("open")
  }

  const close = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setState("closing")
    timeoutRef.current = setTimeout(() => {
      setState("closed")
    }, DROPDOWN_CLOSE_DUR)
  }

  const toggle = () => {
    if (state === "open") close()
    else open()
  }

  const dropdownClass =
    "t-dropdown" + (state === "open" ? " is-open" : state === "closing" ? " is-closing" : "")

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start", position: "relative" }}>
      <style>{`
        :root {
          --dropdown-open-dur: 250ms;
          --dropdown-close-dur: 150ms;
          --dropdown-pre-scale: 0.97;
          --dropdown-closing-scale: 0.99;
          --dropdown-ease: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .t-dropdown {
          transform-origin: top left;
          transform: scale(var(--dropdown-pre-scale));
          opacity: 0;
          pointer-events: none;
          transition:
            transform var(--dropdown-open-dur) var(--dropdown-ease),
            opacity   var(--dropdown-open-dur) var(--dropdown-ease);
          will-change: transform, opacity;
        }
        .t-dropdown[data-origin="top-right"]     { transform-origin: top right; }
        .t-dropdown[data-origin="top-center"]    { transform-origin: top center; }
        .t-dropdown[data-origin="bottom-left"]   { transform-origin: bottom left; }
        .t-dropdown[data-origin="bottom-center"] { transform-origin: bottom center; }
        .t-dropdown[data-origin="bottom-right"]  { transform-origin: bottom right; }

        .t-dropdown.is-open {
          transform: scale(1);
          opacity: 1;
          pointer-events: auto;
        }
        .t-dropdown.is-closing {
          transform: scale(var(--dropdown-closing-scale));
          opacity: 0;
          pointer-events: none;
          transition:
            transform var(--dropdown-close-dur) var(--dropdown-ease),
            opacity   var(--dropdown-close-dur) var(--dropdown-ease);
        }
        @media (prefers-reduced-motion: reduce) {
          .t-dropdown { transition: none !important; }
        }
      `}</style>

      <button
        type="button"
        onClick={toggle}
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
        {state === "closed" ? "Open menu" : "Close menu"}
      </button>

      <div
        className={dropdownClass}
        data-origin="top-left"
        style={{
          minWidth: 140,
          borderRadius: 8,
          border: "1px solid #e2dccf",
          background: "#fff",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          padding: 6,
        }}
      >
        {["Edit", "Duplicate", "Delete"].map((item) => (
          <div
            key={item}
            style={{ padding: "6px 8px", fontSize: 12, color: "#3a362e", borderRadius: 4 }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
