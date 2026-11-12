import * as React from "react"
import { useState } from "react"

const AVATAR_LIFT = -4
const AVATAR_FALLOFF = 0.45
const AVATAR_SCALE = 1.05
const EASE_IN = "cubic-bezier(0.22, 1, 0.36, 1)"
const EASE_OUT = "cubic-bezier(0.34, 3.85, 0.64, 1)"

const LABELS = ["AB", "CD", "EF", "GH", "IJ"]

export function AvatarGroupHoverTransition() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      <style>{`
        :root {
          --avatar-lift: -4px;
          --avatar-dur: 320ms;
          --avatar-scale: 1.05;
          --avatar-falloff: 0.45;
          --avatar-ease-in: cubic-bezier(0.22, 1, 0.36, 1);
          --avatar-ease-out: cubic-bezier(0.34, 3.85, 0.64, 1);
        }
        .t-avatar {
          transform-origin: center;
          transform:
            translateY(var(--shift, 0px))
            scale(var(--scale-active, 1));
          transition: transform var(--avatar-dur) var(--avatar-ease-in);
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .t-avatar { transition: none !important; transform: none !important; }
        }
      `}</style>

      <div
        className="t-avatar-group"
        onMouseLeave={() => setHoveredIndex(null)}
        style={{ display: "flex", paddingTop: 16, paddingBottom: 6 }}
      >
        {LABELS.map((label, i) => {
          const distance = hoveredIndex == null ? null : Math.abs(i - hoveredIndex)
          const shift = distance == null ? 0 : AVATAR_LIFT * Math.pow(AVATAR_FALLOFF, distance)
          const scaleActive = hoveredIndex === i ? AVATAR_SCALE : 1
          const timingFunction = hoveredIndex == null ? EASE_OUT : EASE_IN

          return (
            <div
              key={label}
              className="t-avatar"
              onMouseEnter={() => setHoveredIndex(i)}
              style={
                {
                  "--shift": `${shift.toFixed(3)}px`,
                  "--scale-active": scaleActive,
                  transitionTimingFunction: timingFunction,
                  width: 36,
                  height: 36,
                  marginLeft: i === 0 ? 0 : -10,
                  borderRadius: "50%",
                  border: "2px solid #fff",
                  background: "#d8d2c8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  color: "#3a362e",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                } as React.CSSProperties
              }
            >
              {label}
            </div>
          )
        })}
      </div>
      <span style={{ fontSize: 11, color: "#8a8372" }}>Hover an avatar</span>
    </div>
  )
}
