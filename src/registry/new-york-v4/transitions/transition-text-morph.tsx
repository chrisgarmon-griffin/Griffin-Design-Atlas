import { useLayoutEffect, useRef, useState } from "react"

type Swap = {
  prefix: string
  oldMid: string
  newMid: string
  suffix: string
  morphing: boolean
}

function splitShared(a: string, b: string) {
  let start = 0
  while (start < a.length && start < b.length && a[start] === b[start]) start++
  let end = 0
  while (
    end < a.length - start &&
    end < b.length - start &&
    a[a.length - 1 - end] === b[b.length - 1 - end]
  )
    end++
  return { start, end }
}

const PAIR: [string, string] = ["Follow", "Following"]

export function TextMorphTransition() {
  const [label, setLabel] = useState<string>(PAIR[0])
  const [swap, setSwap] = useState<Swap | null>(null)
  const [width, setWidth] = useState<number | undefined>(undefined)
  const oldRef = useRef<HTMLSpanElement>(null)
  const newRef = useRef<HTMLSpanElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  function toggle() {
    const next = label === PAIR[0] ? PAIR[1] : PAIR[0]
    clearTimeout(timerRef.current)
    const { start, end } = splitShared(label, next)
    setSwap({
      prefix: next.slice(0, start),
      oldMid: label.slice(start, label.length - end),
      newMid: next.slice(start, next.length - end),
      suffix: next.slice(next.length - end),
      morphing: false,
    })
    setWidth(undefined)
    setLabel(next)
  }

  useLayoutEffect(() => {
    if (!swap) return
    if (width === undefined) {
      setWidth(oldRef.current?.getBoundingClientRect().width ?? 0)
      return
    }
    if (!swap.morphing) {
      const nw = newRef.current?.getBoundingClientRect().width ?? 0
      const frame = requestAnimationFrame(() => {
        setSwap((s) => (s ? { ...s, morphing: true } : s))
        setWidth(nw)
      })
      return () => cancelAnimationFrame(frame)
    }
    timerRef.current = setTimeout(() => {
      setSwap(null)
      setWidth(undefined)
    }, 260)
    return () => clearTimeout(timerRef.current)
  }, [swap, width])

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
      <style>{`
        :root {
          --text-morph-dur: 180ms;
          --text-morph-resize-dur: 240ms;
          --text-morph-blur: 2px;
          --text-morph-ease: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .t-morph { white-space: nowrap; }
        .t-morph-swap {
          display: inline-grid;
          vertical-align: bottom;
          justify-items: start;
          transition: width var(--text-morph-resize-dur) var(--text-morph-ease);
        }
        .t-morph-swap > span {
          grid-area: 1 / 1;
          white-space: pre;
          transition:
            opacity var(--text-morph-dur) var(--text-morph-ease),
            filter  var(--text-morph-dur) var(--text-morph-ease);
        }
        .t-morph-new {
          opacity: 0;
          filter: blur(var(--text-morph-blur));
        }
        .t-morph-swap.is-morphing .t-morph-old {
          opacity: 0;
          filter: blur(var(--text-morph-blur));
        }
        .t-morph-swap.is-morphing .t-morph-new {
          opacity: 1;
          filter: blur(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .t-morph-swap,
          .t-morph-swap > span { transition: none !important; }
        }
      `}</style>
      <p style={{ fontSize: 11, color: "#938a7e", margin: 0 }}>Click to follow / unfollow</p>
      <button
        type="button"
        onClick={toggle}
        style={{
          fontSize: 13,
          padding: "7px 16px",
          borderRadius: 8,
          border: "1px solid #d8d2c8",
          background: "#fff",
          cursor: "pointer",
          minWidth: 112,
          textAlign: "left",
        }}
      >
        <span className="t-morph">
          {swap ? (
            <>
              {swap.prefix}
              <span className={"t-morph-swap" + (swap.morphing ? " is-morphing" : "")} style={{ width }}>
                <span className="t-morph-old" ref={oldRef} aria-hidden="true">
                  {swap.oldMid}
                </span>
                <span className="t-morph-new" ref={newRef}>
                  {swap.newMid}
                </span>
              </span>
              {swap.suffix}
            </>
          ) : (
            label
          )}
        </span>
      </button>
    </div>
  )
}
