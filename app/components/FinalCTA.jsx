"use client";

import { useEffect, useRef } from "react";
import { EmailCTA } from "./EmailCTA";

// Final-CTA scroll reveal, fiasco.design-style — but applied to the
// original dark section design, not a lime card. The content (heading,
// subheading, CTA button) starts slightly below rest with a small
// scale-down + fade, and settles into place as the user scrolls the
// section into view. Motion is scroll-driven (not a one-shot
// transition) so the arrival feels like a continuation of the scroll
// rather than a canned animation. easeOutCubic — smooth, anchored,
// never bouncy. Once the reveal zone finishes, the content is stable.

// Scroll distance over which the reveal plays, as a fraction of the
// viewport height. 0.55 = content settles when the section's top
// reaches 45% of the viewport.
const REVEAL_ZONE = 0.55;

// Initial translateY offset as a fraction of the content block's
// own height. Small — this is a "settle in" cue, not a dramatic slide.
const TRANSLATE_FROM_FRAC = 0.16;

// Starting scale — "0.98 → 1" sweet spot. Imperceptibly small, just
// enough to register as a settle.
const SCALE_FROM = 0.98;

export function FinalCTA({ heading, subheading }) {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    // Respect users who prefer reduced motion.
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      content.style.transform = "none";
      content.style.opacity = "1";
      return;
    }

    let raf = null;

    const apply = () => {
      raf = null;
      const vh = window.innerHeight || 1;
      const r = section.getBoundingClientRect();

      // Progress: 0 when section.top === vh (just touching the bottom),
      // 1 when section.top === vh * (1 - REVEAL_ZONE). Clamped.
      const start = vh;
      const end = vh * (1 - REVEAL_ZONE);
      const raw = (start - r.top) / (start - end);
      const progress = Math.max(0, Math.min(1, raw));
      // easeOutCubic — fast at start, settles at the end.
      const eased = 1 - Math.pow(1 - progress, 3);

      const translatePx =
        (1 - eased) * content.offsetHeight * TRANSLATE_FROM_FRAC;
      const scale = SCALE_FROM + eased * (1 - SCALE_FROM);
      const opacity = eased;

      content.style.transform = `translate3d(0, ${translatePx}px, 0) scale(${scale})`;
      content.style.opacity = String(opacity);
    };

    const onScroll = () => {
      if (raf != null) return;
      raf = requestAnimationFrame(apply);
    };

    // Initial paint so the content starts in its "just below" state on
    // a hard refresh partway down the page.
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="gradient-divider py-24 md:py-32">
      <div
        ref={contentRef}
        style={{
          // Initial (pre-scroll-listener) paint — matches the first
          // frame the scroll listener will produce so there's no jump
          // on mount.
          transform: `translate3d(0, 80px, 0) scale(${SCALE_FROM})`,
          opacity: 0,
          willChange: "transform, opacity",
          transformOrigin: "center bottom",
        }}
        className="mx-auto max-w-3xl px-6 text-center"
      >
        <h3 className="mb-5 text-[1.875rem] font-normal leading-[1.05] tracking-[-0.025em] text-white [text-wrap:balance] md:text-[2.625rem] md:tracking-[-0.03em]">
          {heading}
        </h3>
        {subheading && (
          <p className="mx-auto mb-8 max-w-xl text-[1.0625rem] leading-[1.55] text-white/55">
            {subheading}
          </p>
        )}
        <div className="flex justify-center">
          <EmailCTA />
        </div>
      </div>
    </section>
  );
}
