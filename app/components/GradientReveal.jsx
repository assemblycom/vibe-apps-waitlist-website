"use client";

import { useEffect, useRef } from "react";

// Dia-browser-style overshoot reveal.
//
// Wraps the page. When the user tries to scroll past the end (wheel or
// touch overshoot), the wrapped content is translated UP and a gradient
// curtain grows from the bottom underneath it. Because the content moves,
// the footer and any logos stay visible — the gradient is revealed
// beneath them, not painted over them. As soon as the user stops
// overshooting (or scrolls up), the content springs back down and the
// curtain retracts to zero.

const REVEAL_GRADIENT =
  "linear-gradient(180deg, #101010 0%, rgb(139,153,200) 55%, rgb(217,237,146) 100%)";

// Fade the curtain's top edge so there's never a hard line between the
// dark page content and the gradient.
const TOP_FADE_MASK =
  "linear-gradient(to bottom, transparent 0%, black 10%, black 100%)";

// Max overshoot, as a fraction of viewport height. 0.5 = the gradient can
// push the content up by at most half a screen.
const MAX_OVERSHOOT_FRAC = 0.5;

// Pixels of overshoot contributed per unit of wheel deltaY / touch delta.
// Lower numbers = smoother, less jumpy response to individual wheel ticks.
const WHEEL_GAIN = 0.22;
const TOUCH_GAIN = 0.65;

// Inactivity before the retract kicks in, in ms. Slightly longer so the
// peak is held briefly before springing back — reads as intentional.
const RETRACT_DELAY_MS = 220;

// Ease factors for the per-frame lerp. Smaller = smoother. Reveal is
// quicker than retract so the reveal still feels responsive, while the
// retract has a gentle glide back.
const REVEAL_EASE = 0.16;
const RETRACT_EASE = 0.09;

// Slack used to decide whether the scroll position is "at the bottom".
const BOTTOM_SLACK_PX = 2;

export function GradientReveal({ children }) {
  const frameRef = useRef(null);
  const curtainRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const frame = frameRef.current;
    const curtain = curtainRef.current;
    if (!frame || !curtain) return;

    const maxPx = () => window.innerHeight * MAX_OVERSHOOT_FRAC;

    let current = 0; // currently rendered overshoot in pixels
    let target = 0; // target overshoot in pixels
    let rafId = null;
    let retractTimer = null;

    const apply = () => {
      // Translate content up by `current` px; curtain height matches so it
      // fills exactly the newly-revealed space beneath the content.
      frame.style.transform = `translate3d(0, ${-current}px, 0)`;
      curtain.style.height = `${current}px`;
    };

    const render = () => {
      rafId = null;
      const diff = target - current;
      if (Math.abs(diff) < 0.15) {
        current = target;
      } else {
        // Asymmetric easing — quicker on reveal, gentler on retract so
        // the snap-back reads as intentional, not abrupt.
        current += diff * (diff > 0 ? REVEAL_EASE : RETRACT_EASE);
        rafId = requestAnimationFrame(render);
      }
      apply();
    };

    const schedule = () => {
      if (rafId == null) rafId = requestAnimationFrame(render);
    };

    const retract = () => {
      target = 0;
      schedule();
    };

    const isAtBottom = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return window.scrollY >= max - BOTTOM_SLACK_PX;
    };

    const onWheel = (e) => {
      if (!isAtBottom() || e.deltaY <= 0) return;
      target = Math.min(maxPx(), target + e.deltaY * WHEEL_GAIN);
      schedule();
      if (retractTimer) clearTimeout(retractTimer);
      retractTimer = setTimeout(retract, RETRACT_DELAY_MS);
    };

    const onScroll = () => {
      // Any upward scroll at all cancels the overshoot immediately.
      if (target > 0 && !isAtBottom()) retract();
    };

    // Touch overshoot — track finger Y and treat continued upward drags
    // (page moves down in reading terms) at the bottom as overshoot.
    let lastTouchY = null;
    const onTouchStart = (e) => {
      lastTouchY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e) => {
      if (lastTouchY == null) return;
      const y = e.touches[0]?.clientY ?? lastTouchY;
      if (!isAtBottom()) {
        lastTouchY = y;
        return;
      }
      const delta = lastTouchY - y;
      lastTouchY = y;
      if (delta > 0) {
        target = Math.min(maxPx(), target + delta * TOUCH_GAIN);
        schedule();
        if (retractTimer) clearTimeout(retractTimer);
        retractTimer = setTimeout(retract, RETRACT_DELAY_MS);
      }
    };
    const onTouchEnd = () => {
      lastTouchY = null;
      if (retractTimer) clearTimeout(retractTimer);
      retractTimer = setTimeout(retract, RETRACT_DELAY_MS);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      if (rafId) cancelAnimationFrame(rafId);
      if (retractTimer) clearTimeout(retractTimer);
    };
  }, []);

  return (
    <>
      {/* Curtain — sits behind the page content, grows upward from the
          bottom edge of the viewport as the content frame translates up. */}
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-0"
        style={{
          backgroundImage: REVEAL_GRADIENT,
          WebkitMaskImage: TOP_FADE_MASK,
          maskImage: TOP_FADE_MASK,
          willChange: "height",
        }}
      />

      {/* Content frame — everything else on the page lives in here. Has
          its own solid page-color background so the curtain underneath is
          perfectly hidden when the frame is at rest (translateY 0). */}
      <div
        ref={frameRef}
        className="relative z-10 bg-[var(--color-bg)]"
        style={{ willChange: "transform" }}
      >
        {children}
      </div>
    </>
  );
}
