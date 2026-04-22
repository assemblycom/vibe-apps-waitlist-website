"use client";

import { useEffect, useRef, useState } from "react";

// Subtle, unhurried ease — matches the rest of the site's motion curves.
const EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";

// V7-style editorial moment: a left-aligned display headline where the
// last phrase fades into a quieter "coda", followed by a two-column
// body block underneath. Staged reveal keeps the motion minimal — the
// headline words cascade in one by one, then the body settles in after
// the last word lands.
export function NarrativeBlock({ heading, callout, body }) {
  const paragraphs = Array.isArray(body) ? body : [body];
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (typeof window === "undefined" || !window.IntersectionObserver) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Two rAFs so the browser has definitely painted the initial
          // opacity:0 / translateY state before we flip to visible. Without
          // this, React can batch the initial render and the setState so
          // closely that the transition never has a "from" state to
          // animate from, and the cascade looks instantaneous.
          requestAnimationFrame(() => {
            requestAnimationFrame(() => setVisible(true));
          });
          observer.disconnect();
        }
      },
      // Fire as soon as any portion of the section enters the viewport.
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const stageStyle = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(12px)",
    transition: [
      `opacity 800ms ${EASE} ${delay}ms`,
      `transform 800ms ${EASE} ${delay}ms`,
    ].join(", "),
    willChange: "opacity, transform",
  });

  // The heading fades in as a single block (quiet, editorial tone) and
  // the body follows a beat later. No per-word cascade — that read as
  // too playful for this section.
  const HEADING_DURATION_MS = 800;
  const bodyDelayMs = 260;

  return (
    // NarrativeBlock closes the off-white chapter and hands off to the
    // dark storytelling sections below. No gradient fade at the seam —
    // the light section ends on its own color with generous bottom
    // padding, and the dark chapter-opener that follows (in page.js)
    // introduces its eyebrow early so the dark section declares itself
    // by content cadence rather than color blending.
    <section
      ref={ref}
      data-nav-theme="light"
      className="relative bg-[#F5F5F0] pt-20 pb-32 md:pt-24 md:pb-40"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Display-scale headline — the optional `callout` renders inline
            at reduced opacity, echoing the V7 pattern of a bold statement
            followed by a quieter restatement. The whole line fades in as
            one block rather than cascading word-by-word. */}
        <h2
          className="mx-auto mb-12 max-w-[900px] text-center text-[2rem] font-normal leading-[1.05] tracking-[-0.025em] text-[#1A1A1A] [text-wrap:balance] md:mb-16 md:text-[2.875rem] md:tracking-[-0.03em]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
            transition: [
              `opacity ${HEADING_DURATION_MS}ms ${EASE}`,
              `transform ${HEADING_DURATION_MS}ms ${EASE}`,
            ].join(", "),
            willChange: "opacity, transform",
          }}
        >
          {heading}
          {callout && (
            <>
              <br />
              <span className="text-[#1A1A1A]/40">{callout}</span>
            </>
          )}
        </h2>
        {/* Two-column body below the headline, offset to the right so the
            columns sit under the dimmed callout rather than spanning the
            full heading width. Paragraphs flow across columns via CSS
            columns — `break-inside-avoid` keeps each paragraph intact. */}
        <div
          className="mx-auto max-w-[640px] text-left"
          style={stageStyle(bodyDelayMs)}
        >
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="mb-5 text-[1rem] leading-[1.6] text-[#1A1A1A]/55 last:mb-0"
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
