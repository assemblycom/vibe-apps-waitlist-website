"use client";

import { useEffect, useRef } from "react";

// Hero-zoom interaction.
//
// As the user scrolls away from the top, the hero shrinks slightly and
// gains rounded corners — becoming a "card" that sits inside an off-white
// page backdrop. The backdrop is the bg of the wrapper itself, so as the
// hero's visual edges pull inward on scale, the off-white reveals around
// it. No scroll hijacking: we just read `window.scrollY` on scroll and
// apply a transform. Natural scroll continues to move the hero off-screen
// as normal; the zoom is purely additive.
//
// Motion is deliberately small (90% final scale, 28px radius at peak) so
// the page still feels like a page, not a demo reel.

const MIN_SCALE = 0.9; // final scale at full progress
const MAX_RADIUS_PX = 28; // corner radius at full progress
// Scroll distance over which the animation plays, as a fraction of the
// viewport height. 1 = one full screen of scroll to reach MIN_SCALE.
const ACTIVE_VH_FRAC = 1;
// Off-white backdrop — showing through around the scaled hero and
// carrying into the section below for a continuous color band.
const BACKDROP = "#F5F5F0";

export function ZoomHero({ children }) {
  const innerRef = useRef(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    let raf = null;

    const apply = () => {
      raf = null;
      const vh = window.innerHeight || 1;
      const scrollY = window.scrollY;
      const progress = Math.max(
        0,
        Math.min(1, scrollY / (vh * ACTIVE_VH_FRAC)),
      );
      const scale = 1 - progress * (1 - MIN_SCALE);
      const radius = progress * MAX_RADIUS_PX;
      el.style.transform = `scale(${scale})`;
      // Only round the BOTTOM corners — the top edge sits right under the
      // floating Header pill, and rounding the hero's top corners produces
      // a "criss-cross" of near-but-not-matching curves next to the pill's
      // own rounded edges. Keeping the top square lets the header read as
      // a clean, uninterrupted element.
      el.style.borderRadius = `0 0 ${radius}px ${radius}px`;
    };

    const onScroll = () => {
      if (raf != null) return;
      raf = requestAnimationFrame(apply);
    };

    // Initial paint so the hero starts in its unscaled, square-cornered
    // state even on a hard refresh partway down the page.
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    // Outer wrapper carries the off-white backdrop edge-to-edge so the
    // side/bottom margins around the scaling hero are one continuous
    // color — avoids the "two overlapping rectangles" look a partial
    // backdrop creates. The Header pill has its own solid dark bg +
    // backdrop-blur so it stays legible on top of the off-white.
    <div style={{ backgroundColor: BACKDROP }}>
      <div
        ref={innerRef}
        // `origin-top` keeps the hero anchored at its top edge while it
        // shrinks, so it reads as "pulling away from the page" rather
        // than floating down. `overflow-hidden` lets the border-radius
        // actually clip the hero contents (CTA button, eyebrow, etc.).
        className="relative origin-top overflow-hidden bg-[var(--color-bg)]"
        style={{ willChange: "transform, border-radius" }}
      >
        {children}
      </div>
    </div>
  );
}
