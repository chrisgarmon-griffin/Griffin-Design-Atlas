import { useEffect, useRef, useState } from "react"

const TABS = ["Plan", "Debug", "Ask"]

export function TabsSlidingTransition() {
  const [active, setActive] = useState(0)
  const [pillStyle, setPillStyle] = useState<React.CSSProperties>({ transform: "translateX(0px)", width: 0 })
  const [snap, setSnap] = useState(true)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const measure = (index: number, animate: boolean) => {
    const el = tabRefs.current[index]
    if (!el) return
    if (!animate) {
      setSnap(true)
      setPillStyle({ transform: `translateX(${el.offsetLeft}px)`, width: el.offsetWidth })
      requestAnimationFrame(() => setSnap(false))
    } else {
      setPillStyle({ transform: `translateX(${el.offsetLeft}px)`, width: el.offsetWidth })
    }
  }

  useEffect(() => {
    measure(active, false)
    const onResize = () => measure(active, false)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectTab = (index: number) => {
    setActive(index)
    measure(index, true)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
      <style>{`
        :root {
          --tabs-dur: 250ms;
          --tabs-ease: cubic-bezier(0.22, 1, 0.36, 1);
          --tabs-text-muted: rgba(15, 15, 15, 0.8);
          --tabs-text-active: #0f0f0f;
          --tabs-bar-bg: #f1f1f1;
          --tabs-pill-bg: #ffffff;
        }
        .t-tabs {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 3px;
          border-radius: 48px;
          background: var(--tabs-bar-bg);
        }
        .t-tab {
          position: relative;
          appearance: none;
          border: 0;
          background: transparent;
          height: 30px;
          padding: 4px 12px;
          color: var(--tabs-text-muted);
          cursor: pointer;
          border-radius: 48px;
          z-index: 1;
          font-size: 12px;
          transition: color var(--tabs-dur) var(--tabs-ease);
        }
        .t-tab:not([aria-selected="true"]):hover,
        .t-tab[aria-selected="true"] {
          color: var(--tabs-text-active);
        }
        .t-tabs-pill {
          position: absolute;
          top: 3px;
          left: 0;
          height: 30px;
          width: 0;
          background: var(--tabs-pill-bg);
          border-radius: 48px;
          transform: translateX(0);
          transition:
            transform var(--tabs-dur) var(--tabs-ease),
            width     var(--tabs-dur) var(--tabs-ease);
          will-change: transform, width;
          z-index: 0;
          pointer-events: none;
          box-shadow: 0 1px 2px rgba(0,0,0,0.08);
        }
        .t-tabs-pill.is-snapping {
          transition: none !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .t-tabs-pill, .t-tab { transition: none !important; }
        }
      `}</style>
      <div className="t-tabs" role="tablist">
        <span className={`t-tabs-pill${snap ? " is-snapping" : ""}`} aria-hidden="true" style={pillStyle} />
        {TABS.map((label, index) => (
          <button
            key={label}
            ref={(el) => {
              tabRefs.current[index] = el
            }}
            className="t-tab"
            role="tab"
            aria-selected={active === index}
            onClick={() => selectTab(index)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
