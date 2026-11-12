import { useEffect, useRef, useState } from "react"

type Phase = "idle" | "error"

export function ErrorStateShakeTransition() {
  const [phase, setPhase] = useState<Phase>("idle")
  const [shaking, setShaking] = useState(false)
  const revertTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const shakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const SHAKE_MS = 80 * 2 + 60 * 2
  // Demo pacing: shorter than the spec's 3000ms default so the revert is visible quickly in a bento tile.
  const REVERT_HOLD_MS = 1800

  useEffect(() => {
    return () => {
      if (revertTimer.current) clearTimeout(revertTimer.current)
      if (shakeTimer.current) clearTimeout(shakeTimer.current)
    }
  }, [])

  const triggerError = () => {
    if (revertTimer.current) clearTimeout(revertTimer.current)
    if (shakeTimer.current) clearTimeout(shakeTimer.current)

    setPhase("error")
    setShaking(false)
    // Force a reflow-equivalent restart of the shake animation via a microtask state flip.
    requestAnimationFrame(() => {
      setShaking(true)
      shakeTimer.current = setTimeout(() => setShaking(false), SHAKE_MS + 20)
    })

    revertTimer.current = setTimeout(() => {
      setPhase("idle")
      revertTimer.current = null
    }, SHAKE_MS + REVERT_HOLD_MS)
  }

  const onTyping = () => {
    if (revertTimer.current) {
      clearTimeout(revertTimer.current)
      revertTimer.current = null
    }
    setPhase("idle")
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start", width: "100%" }}>
      <style>{`
        :root {
          --shake-distance: 6px;
          --shake-overshoot: 4px;
          --shake-dur-a: 80ms;
          --shake-dur-b: 60ms;
          --shake-ease: cubic-bezier(0.22, 1, 0.36, 1);
          --revert-hold: 3000ms;
          --revert-dur: 280ms;
        }
        .t-input {
          transition: border-color 150ms ease-out;
          will-change: transform;
        }
        .t-input.is-error {
          transition: border-color var(--revert-dur, 280ms) ease-out;
        }
        .t-error-msg {
          opacity: 0;
          visibility: hidden;
          transition:
            opacity    var(--revert-dur, 280ms) ease-out,
            visibility 0s linear var(--revert-dur, 280ms);
        }
        .t-input-wrap.is-error .t-error-msg {
          opacity: 1;
          visibility: visible;
          transition:
            opacity    var(--revert-dur, 280ms) ease-out,
            visibility 0s linear 0s;
        }
        .t-input.is-shaking {
          animation: t-input-shake calc(
              var(--shake-dur-a) * 2 + var(--shake-dur-b) * 2
            ) linear;
        }
        @keyframes t-input-shake {
          0%      { transform: translateX(0);                                 animation-timing-function: var(--shake-ease); }
          28.57%  { transform: translateX(var(--shake-distance));             animation-timing-function: var(--shake-ease); }
          57.14%  { transform: translateX(calc(var(--shake-distance) * -1)); animation-timing-function: var(--shake-ease); }
          78.57%  { transform: translateX(var(--shake-overshoot));            animation-timing-function: var(--shake-ease); }
          100%    { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .t-input { animation: none !important; transform: none !important; }
        }
      `}</style>
      <div
        className={`t-input-wrap${phase === "error" ? " is-error" : ""}`}
        data-state={phase}
        style={{ width: "100%" }}
      >
        <div
          className={`t-input${phase === "error" ? " is-error" : ""}${shaking ? " is-shaking" : ""}`}
          style={{
            border: `1px solid ${phase === "error" ? "#c0392b" : "#d8d2c8"}`,
            borderRadius: 8,
            background: "#fff",
            padding: "6px 10px",
          }}
        >
          <input
            type="text"
            placeholder="Email address"
            onChange={onTyping}
            style={{ border: "none", outline: "none", fontSize: 12, width: "100%", background: "transparent" }}
          />
        </div>
        <p
          className="t-error-msg"
          style={{ fontSize: 11, color: "#c0392b", margin: "4px 0 0" }}
        >
          Please enter a valid email.
        </p>
      </div>
      <button
        type="button"
        onClick={triggerError}
        style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid #d8d2c8", background: "#f5f1ea", cursor: "pointer" }}
      >
        Trigger error
      </button>
    </div>
  )
}
