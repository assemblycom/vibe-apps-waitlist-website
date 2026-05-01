"use client";

import { SITE } from "../config/site";

export function Footer() {
  // Native `behavior: "smooth"` is distance-proportional and caps around
  // ~500ms, so on a long page it flies to the top in a blink. A fixed
  // 800ms RAF tween with easeInOutCubic matches the typical marketing-
  // site cadence — the motion reads as intentional no matter how far
  // down the user is.
  const scrollToTop = () => {
    if (typeof window === "undefined") return;
    const start = window.scrollY;
    if (start === 0) return;
    const duration = 800;
    const startTime = performance.now();
    // easeInOutCubic — gentle acceleration, gentle settle.
    const ease = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const step = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      window.scrollTo(0, start * (1 - ease(t)));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  return (
    <footer className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 md:py-8">
      <a
        href="/"
        aria-label={SITE.brand}
        className="inline-flex items-center transition-opacity duration-200 hover:opacity-80"
      >
        <img
          src="/logos/mobile-logo.svg"
          alt={SITE.brand}
          className="h-6 w-auto"
        />
      </a>

      <button
        type="button"
        onClick={scrollToTop}
        className="inline-flex items-center gap-1.5 text-[13px] text-white/55 transition-colors duration-200 hover:text-white"
      >
        Back to the top
        <span aria-hidden="true">↑</span>
      </button>
    </footer>
  );
}
