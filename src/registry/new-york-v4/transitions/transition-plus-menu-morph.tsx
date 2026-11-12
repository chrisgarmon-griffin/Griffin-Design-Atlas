import { useEffect, useRef, useState } from "react"

export function PlusMenuMorphTransition() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("click", onDocClick)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("click", onDocClick)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
      <style>{`
        :root {
          --morph-open-dur: 350ms;
          --morph-close-dur: 250ms;
          --morph-ease: cubic-bezier(0.34, 1.25, 0.64, 1);
          --morph-close-ease: cubic-bezier(0.22, 1, 0.36, 1);
          --morph-r-closed: 40px;
          --morph-r-open: 20px;
          --morph-fade-dur: 200ms;
          --morph-slide: 40px;
          --morph-rotate: 45deg;
          --morph-scale: 0.97;
          --morph-blur: 2px;
        }
        .t-morph {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: var(--morph-r-closed);
          overflow: hidden;
          background: #2f2a22;
          transition:
            width var(--morph-close-dur) var(--morph-close-ease),
            height var(--morph-close-dur) var(--morph-close-ease),
            border-radius var(--morph-close-dur) var(--morph-close-ease);
        }
        .t-morph[data-open="true"] {
          width: 183px;
          height: 140px;
          border-radius: var(--morph-r-open);
          transition:
            width var(--morph-open-dur) var(--morph-ease),
            height var(--morph-open-dur) var(--morph-ease),
            border-radius var(--morph-open-dur) var(--morph-ease);
        }
        .t-morph-plus {
          position: absolute;
          inset: auto 0 0 auto;
          width: 40px; height: 40px;
          display: grid; place-items: center;
          border: 0; background: transparent; cursor: pointer;
          color: #f5f1ea;
          transition:
            opacity var(--morph-fade-dur) var(--morph-close-ease),
            transform var(--morph-open-dur) var(--morph-close-ease),
            filter var(--morph-fade-dur) var(--morph-close-ease);
        }
        .t-morph-plus svg {
          transition: transform var(--morph-open-dur) var(--morph-close-ease);
        }
        .t-morph[data-open="true"] .t-morph-plus {
          opacity: 0;
          transform: translateX(calc(-1 * var(--morph-slide)));
          filter: blur(var(--morph-blur));
          pointer-events: none;
        }
        .t-morph[data-open="true"] .t-morph-plus svg {
          transform: scale(var(--morph-scale)) rotate(var(--morph-rotate));
        }
        .t-morph-menu {
          position: absolute;
          inset: 0;
          opacity: 0;
          transform: translateX(var(--morph-slide)) scale(var(--morph-scale));
          filter: blur(var(--morph-blur));
          pointer-events: none;
          transition:
            opacity var(--morph-fade-dur) var(--morph-close-ease),
            transform var(--morph-open-dur) var(--morph-close-ease),
            filter var(--morph-fade-dur) var(--morph-close-ease);
        }
        .t-morph[data-open="true"] .t-morph-menu {
          opacity: 1;
          transform: translateX(0) scale(1);
          filter: blur(0);
          pointer-events: auto;
        }
        @media (prefers-reduced-motion: reduce) {
          .t-morph, .t-morph-plus, .t-morph-menu { transition: none !important; }
        }
      `}</style>
      <div ref={rootRef} className="t-morph" data-open={open}>
        <div className="t-morph-menu">
          <div style={{ display: "flex", flexDirection: "column", padding: 10, gap: 4, color: "#f5f1ea", fontSize: 12 }}>
            <button type="button" style={menuItemStyle}>New file</button>
            <button type="button" style={menuItemStyle}>New folder</button>
            <button type="button" style={menuItemStyle}>Upload</button>
          </div>
        </div>
        <button
          className="t-morph-plus"
          aria-expanded={open}
          onClick={(e) => {
            e.stopPropagation()
            setOpen((v) => !v)
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M8 2v12M2 8h12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

const menuItemStyle: React.CSSProperties = {
  textAlign: "left",
  background: "transparent",
  border: "none",
  color: "inherit",
  padding: "4px 2px",
  cursor: "pointer",
  borderRadius: 4,
}
