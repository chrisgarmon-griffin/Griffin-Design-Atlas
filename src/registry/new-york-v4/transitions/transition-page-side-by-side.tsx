import { useState } from "react"

export function PageSideBySideTransition() {
  const [page, setPage] = useState<1 | 2>(1)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start", width: "100%" }}>
      <style>{`
        :root {
          --page-slide-dur: 250ms;
          --page-fade-dur: 250ms;
          --page-slide-distance: 8px;
          --page-blur: 3px;
          --page-stagger: 0ms;
          --page-exit-enabled: 1;
          --page-slide-ease: cubic-bezier(0.22, 1, 0.36, 1);
          --page-fade-ease: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .t-page-slide {
          position: relative;
        }
        .t-page-slide .t-page[data-page-id="1"] {
          --t-page-from-x: calc(var(--page-slide-distance) * -1);
        }
        .t-page-slide .t-page[data-page-id="2"] {
          --t-page-from-x: var(--page-slide-distance);
        }
        .t-page-slide .t-page {
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
          transform: translateX(calc(var(--t-page-from-x, 0px) * var(--page-exit-enabled)));
          filter: blur(calc(var(--page-blur) * var(--page-exit-enabled)));
          transition:
            opacity   var(--page-fade-dur)  var(--page-fade-ease),
            transform var(--page-slide-dur) var(--page-slide-ease),
            filter    var(--page-slide-dur) var(--page-slide-ease);
          will-change: opacity, transform, filter;
        }
        .t-page-slide[data-page="1"] .t-page[data-page-id="1"],
        .t-page-slide[data-page="2"] .t-page[data-page-id="2"] {
          opacity: 1;
          pointer-events: auto;
          transform: translateX(0);
          filter: blur(0);
          transition-delay: var(--page-stagger);
        }
        @media (prefers-reduced-motion: reduce) {
          .t-page-slide .t-page { transition: none !important; }
        }
      `}</style>

      <button
        type="button"
        onClick={() => setPage((p) => (p === 1 ? 2 : 1))}
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
        Go to page {page === 1 ? 2 : 1}
      </button>

      <div
        className="t-page-slide"
        data-page={page}
        style={{
          width: "100%",
          height: 90,
          borderRadius: 10,
          border: "1px solid #e2dccf",
          background: "#f5f1ea",
          overflow: "hidden",
        }}
      >
        <section
          className="t-page"
          data-page-id="1"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#6b6558" }}
        >
          Page one
        </section>
        <section
          className="t-page"
          data-page-id="2"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#6b6558" }}
        >
          Page two
        </section>
      </div>
    </div>
  )
}
