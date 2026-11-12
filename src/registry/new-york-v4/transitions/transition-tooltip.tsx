import { useRef, useState } from "react"

const TRIGGERS = [
  { label: "Copy", tooltip: "Copy link" },
  { label: "Share", tooltip: "Share" },
  { label: "More", tooltip: "More options" },
]

export function TooltipTransition() {
  const [show, setShow] = useState(false)
  const [text, setText] = useState("")
  const [x, setX] = useState(0)
  const [width, setWidth] = useState(0)
  const [snap, setSnap] = useState(false)
  const groupRef = useRef<HTMLSpanElement>(null)
  const tipRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  const place = (trigger: HTMLButtonElement, label: string) => {
    const group = groupRef.current
    const tip = tipRef.current
    if (!group || !tip) return

    setText(label)

    // Measure after the text updates in the DOM.
    requestAnimationFrame(() => {
      const textEl = textRef.current
      if (!textEl) return
      const cs = getComputedStyle(tip)
      const w = Math.ceil(
        textEl.scrollWidth + parseFloat(cs.paddingLeft || "0") + parseFloat(cs.paddingRight || "0")
      )
      const g = group.getBoundingClientRect()
      const r = trigger.getBoundingClientRect()
      const nx = r.left - g.left + r.width / 2 - w / 2

      if (!show) {
        setSnap(true)
        setWidth(w)
        setX(nx)
        requestAnimationFrame(() => setSnap(false))
      } else {
        setWidth(w)
        setX(nx)
      }
      setShow(true)
    })
  }

  const hide = () => setShow(false)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
      <style>{`
        :root {
          --tt-in-dur: 150ms;
          --tt-out-dur: 50ms;
          --tt-scale: 0.98;
          --tt-delay: 80ms;
          --tt-in-ease: ease-out;
          --tt-out-ease: ease-out;
          --tt-move-dur: 160ms;
          --tt-move-ease: cubic-bezier(0.22, 1, 0.36, 1);
          --tt-bg: #ffffff;
          --tt-fg: #2f2f2f;
        }
        .t-tt-group {
          position: relative;
          display: inline-flex;
        }
        .t-tt {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 0;
          box-sizing: border-box;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 0;
          overflow: hidden;
          translate: var(--tt-x, 0px) 0;
          scale: var(--tt-scale);
          transform-origin: 50% 100%;
          padding: 8px 12px;
          border-radius: 8px;
          background: var(--tt-bg);
          color: var(--tt-fg);
          white-space: nowrap;
          font-size: 11px;
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.06),
            0 2px 6px 0 rgba(0, 0, 0, 0.05),
            0 4px 42px 0 rgba(0, 0, 0, 0.06);
          opacity: 0;
          pointer-events: none;
          transition:
            opacity   var(--tt-out-dur) var(--tt-out-ease),
            scale     var(--tt-out-dur) var(--tt-out-ease),
            translate var(--tt-move-dur) var(--tt-move-ease),
            width     var(--tt-move-dur) var(--tt-move-ease);
        }
        .t-tt[data-show="true"] {
          opacity: 1;
          scale: 1;
          transition:
            opacity   var(--tt-in-dur) var(--tt-in-ease) var(--tt-delay),
            scale     var(--tt-in-dur) var(--tt-in-ease) var(--tt-delay),
            translate var(--tt-move-dur) var(--tt-move-ease),
            width     var(--tt-move-dur) var(--tt-move-ease);
        }
        .t-tt.is-snapping {
          transition: none !important;
        }
        .t-tt-text { white-space: nowrap; }
        @media (prefers-reduced-motion: reduce) {
          .t-tt { transition: none !important; }
        }
      `}</style>
      <span className="t-tt-group" ref={groupRef} onPointerLeave={hide}>
        {TRIGGERS.map((t) => (
          <button
            key={t.label}
            className="t-tt-trigger"
            aria-describedby="tt-1"
            onPointerEnter={(e) => place(e.currentTarget, t.tooltip)}
            onFocus={(e) => place(e.currentTarget, t.tooltip)}
            onBlur={hide}
            style={{
              fontSize: 12,
              padding: "6px 10px",
              border: "1px solid #d8d2c8",
              background: "#fff",
              borderRadius: 6,
              cursor: "pointer",
              marginRight: 6,
            }}
          >
            {t.label}
          </button>
        ))}
        <span
          ref={tipRef}
          className={`t-tt${snap ? " is-snapping" : ""}`}
          id="tt-1"
          role="tooltip"
          aria-hidden={!show}
          data-show={show}
          style={{ width, ["--tt-x" as string]: `${x}px` } as React.CSSProperties}
        >
          <span className="t-tt-text" ref={textRef}>
            {text}
          </span>
        </span>
      </span>
    </div>
  )
}
