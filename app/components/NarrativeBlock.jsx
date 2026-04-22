"use client";

import { useEffect, useRef, useState } from "react";

// Subtle, unhurried ease — matches the rest of the site's motion curves.
const EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";

// Sunday.ai-style editorial moment: a display-scale headline that dwarfs
// the Hero, wide breathing room, and a small, narrow supporting paragraph
// column underneath. Staged reveal keeps the motion minimal — the headline
// rises and fades in first, then the body settles in after a short pause.
export function NarrativeBlock({ eyebrow, heading, body }) {
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

  // Headline words cascade in one after another — each word rises from
  // slightly below its resting line and fades in. Stagger is large enough
  // (180ms) that the eye registers each word individually.
  const words = heading.split(" ");
  const WORD_STAGGER_MS = 180;
  const WORD_DURATION_MS = 800;
  // Body starts right as the last word finishes settling.
  const bodyDelayMs =
    (words.length - 1) * WORD_STAGGER_MS + WORD_DURATION_MS * 0.6;

  const wordStyle = (index) => {
    const delay = index * WORD_STAGGER_MS;
    return {
      display: "inline-block",
      opacity: visible ? 1 : 0,
      // Rise from below (positive translateY) — matches the sunday.ai
      // pattern of words "coming up into" their line.
      transform: visible ? "translateY(0)" : "translateY(0.6em)",
      transition: [
        `opacity ${WORD_DURATION_MS}ms ${EASE} ${delay}ms`,
        `transform ${WORD_DURATION_MS}ms ${EASE} ${delay}ms`,
      ].join(", "),
      willChange: "opacity, transform",
    };
  };

  return (
    // NarrativeBlock closes the off-white chapter and hands off to the
    // dark storytelling sections below. No gradient fade at the seam —
    // the light section ends on its own color with generous bottom
    // padding, and the dark chapter-opener that follows (in page.js)
    // introduces its eyebrow early so the dark section declares itself
    // by content cadence rather than color blending.
    <section
      ref={ref}
      className="relative bg-[#F5F5F0] pt-20 pb-32 md:pt-24 md:pb-40"
    >
      <div className="mx-auto max-w-5xl px-6">
        {/* Eyebrow styled to match the Hero eyebrow exactly —
            `mono text-xs uppercase tracking-[0.08em] text-white/40` —
            just centered instead of left-aligned. */}
        {eyebrow && (
          <div
            className="mb-5 flex justify-start md:mb-6 md:justify-center"
            style={stageStyle(0)}
          >
            <span className="mono text-xs uppercase tracking-[0.08em] text-[#101010]/45">
              {eyebrow}
            </span>
          </div>
        )}
        {/* Display-scale headline with a word-by-word cascade. Each word
            falls from ~0.35em above its resting line and fades in, offset
            by `WORD_STAGGER_MS`. Using `inline-block` on each word lets us
            transform it; `&nbsp;` after each word (except the last)
            preserves the visual space without joining the spans. */}
        {/* Capped at the same size as the Hero h1 so this heading has
            presence without out-shouting the page's primary headline.
            The cascade + centering + breathing room carry the emphasis. */}
        <h2 className="mb-8 text-left text-[2.25rem] font-semibold leading-[1.1] tracking-[-0.03em] text-[#101010] [text-wrap:balance] md:mb-10 md:text-center md:text-[3rem]">
          {words.map((word, i) => (
            <span key={i} style={wordStyle(i)}>
              {word}
              {i < words.length - 1 && "\u00A0"}
            </span>
          ))}
        </h2>
        {/* Narrow centered column for the body — the text itself stays
            left-aligned so the multiple paragraphs read naturally, but
            the column sits centered on the page below the headline. */}
        <div
          className="mx-auto max-w-[580px] space-y-5 text-[1.05rem] leading-[1.7] text-[#101010]/75"
          style={stageStyle(bodyDelayMs)}
        >
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
