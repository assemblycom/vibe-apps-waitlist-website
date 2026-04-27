"use client";

import { useEffect } from "react";

// Scroll-driven body tint.
//
// Watches the [data-tinted-section="light"] sentinel and interpolates
// the document's `--color-bg` variable between dark (#101010) and
// cream (#F5F5F0) based on the section's position relative to the
// viewport. Inverse interpolation runs on the way out, so the page
// eases back to dark as the chapter exits. No hard color seams at
// the chapter's top or bottom — the bg flows continuously with scroll.
//
// Why a CSS variable rather than a fixed-position tint layer:
// `--color-bg` already drives the body background via globals.css, so
// changing it propagates everywhere with zero extra DOM and no z-index
// fight with the existing nav / hero / GradientReveal layers.
//
// Why this still pairs with `data-nav-theme="light"`: the Header
// already smooths its own dark↔light flip (pill, border, logo) with
// a 300ms ease, so a hard-flip *flag* on the wrapper is fine for the
// nav. This component handles the *page background* exclusively.
export function ScrollTintedChapter({
  selector = '[data-tinted-section="light"]',
  dark = [16, 16, 16],
  light = [245, 245, 240],
  // Width of the fade-in/fade-out band, in pixels. Page is fully
  // tinted while the chapter is in view and only interpolates inside
  // this short band at each edge — long lerps read as muddy.
  fadePx = 140,
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = document.querySelector(selector);
    if (!el) return;

    const root = document.documentElement;
    const setBg = (rgb) => {
      root.style.setProperty(
        "--color-bg",
        `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
      );
    };

    const clamp01 = (n) => Math.max(0, Math.min(1, n));
    // ease-in-out on the tint progress so the inflection feels gentle
    // at both ends instead of a linear slide. Subtle; users won't see
    // the math but the curve looks more "designed."
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const lerp = (a, b, t) => a + (b - a) * t;
    const lerpColor = (a, b, t) => [
      Math.round(lerp(a[0], b[0], t)),
      Math.round(lerp(a[1], b[1], t)),
      Math.round(lerp(a[2], b[2], t)),
    ];

    let raf = null;
    const update = () => {
      raf = null;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;

      // Fade-in: short band as the chapter crosses into the viewport.
      //   top = vh         → 0 (just touching bottom edge)
      //   top = vh - fadePx → 1 (band fully crossed)
      const fadeIn = clamp01((vh - r.top) / fadePx);

      // Fade-out: finishes the moment the wrapper's bottom edge
      // reaches the BOTTOM of the viewport — i.e. before any pixel
      // of the next section enters view. The next section sits on
      // a dark page bg (white text on dark, fully readable) from
      // the moment it appears, with no cream-coloured frame around
      // it and no hard cream/dark seam at the boundary.
      //   bottom = vh + fadePx → 1 (wrapper extends well below the
      //                             viewport, only chapter content
      //                             is on screen, bg fully cream)
      //   bottom = vh          → 0 (wrapper bottom touches viewport
      //                             bottom, page bg now dark — any
      //                             further scroll reveals next
      //                             section on dark bg)
      const fadeOut = clamp01((r.bottom - vh) / fadePx);

      const t = ease(Math.min(fadeIn, fadeOut));
      setBg(lerpColor(dark, light, t));
    };

    const onScroll = () => {
      if (raf != null) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf != null) cancelAnimationFrame(raf);
      // Restore the resting dark on unmount so the page doesn't get
      // stuck on the last interpolated frame.
      root.style.removeProperty("--color-bg");
    };
  }, [selector, dark, light, fadePx]);

  return null;
}
