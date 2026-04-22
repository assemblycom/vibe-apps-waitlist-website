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

  // Headline words cascade in one after another — each word rises from
  // slightly below its resting line and fades in. Stagger is large enough
  // (180ms) that the eye registers each word individually. The callout
  // words continue the same cascade but render in a dimmer color, so the
  // whole heading reads as one motion even though the visual weight
  // shifts mid-sentence.
  const headingWords = heading.split(" ");
  const calloutWords = callout ? callout.split(" ") : [];
  const allWordCount = headingWords.length + calloutWords.length;
  const WORD_STAGGER_MS = 180;
  const WORD_DURATION_MS = 800;
  // Body starts right as the last word finishes settling.
  const bodyDelayMs =
    (allWordCount - 1) * WORD_STAGGER_MS + WORD_DURATION_MS * 0.6;

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
      data-nav-theme="light"
      className="relative bg-[#F5F5F0] pt-20 pb-32 md:pt-24 md:pb-40"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Display-scale headline with a word-by-word cascade. Each word
            falls from ~0.35em above its resting line and fades in, offset
            by `WORD_STAGGER_MS`. The optional `callout` continues the
            cascade but renders at reduced opacity, echoing the V7 pattern
            of a bold statement followed by a quieter restatement. */}
        <h2 className="mb-12 max-w-[1000px] text-left text-[2rem] font-normal leading-[1.05] tracking-[-0.025em] text-[#1A1A1A] [text-wrap:balance] md:mb-16 md:text-[2.875rem] md:tracking-[-0.03em]">
          {headingWords.map((word, i) => (
            <span key={`h-${i}`} style={wordStyle(i)}>
              {word}
              {i < headingWords.length - 1 && "\u00A0"}
            </span>
          ))}
          {callout && (
            <>
              {"\u00A0"}
              {calloutWords.map((word, i) => {
                const wordIndex = headingWords.length + i;
                return (
                  <span
                    key={`c-${i}`}
                    className="text-[#1A1A1A]/40"
                    style={wordStyle(wordIndex)}
                  >
                    {word}
                    {i < calloutWords.length - 1 && "\u00A0"}
                  </span>
                );
              })}
            </>
          )}
        </h2>
        {/* Two-column body below the headline, offset to the right so the
            columns sit under the dimmed callout rather than spanning the
            full heading width. Paragraphs flow across columns via CSS
            columns — `break-inside-avoid` keeps each paragraph intact. */}
        <div
          className="md:ml-auto md:max-w-[780px] md:columns-2 md:gap-10"
          style={stageStyle(bodyDelayMs)}
        >
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="mb-5 break-inside-avoid text-[1rem] leading-[1.6] text-[#1A1A1A]/55 last:mb-0"
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
