"use client";

import { useEffect, useRef } from "react";
import { SITE } from "../config/site";

// Scroll to the hero email input and focus it. Single-source email entry
// stays in the hero — the nav CTA just delivers the user there. Lenis
// intercepts window.scrollTo by default, so this rides the site's
// smooth-scroll; the focus fires after the scroll mostly settles so the
// cursor doesn't "race" the animation.
function scrollToHeroEmail() {
  if (typeof window === "undefined") return;
  const input = document.querySelector("[data-waitlist-email]");
  // Prefer Lenis (if SmoothScroll mounted it on window) so the motion
  // matches the rest of the page. Fall back to native smooth scroll if
  // reduced-motion is on and Lenis isn't running.
  if (window.__lenis) {
    window.__lenis.scrollTo(0, { duration: 1.1 });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  if (!input) return;
  // `preventScroll` — the scroll animation handles positioning; focus just
  // lands the cursor in the input without a second jump. Delay roughly
  // matches Lenis's 1.1s duration from a mid-page start.
  window.setTimeout(() => {
    input.focus({ preventScroll: true });
  }, 900);
}

// Sticky nav — seam-safe.
//
// Position: `fixed` at the viewport top, as a sibling of ZoomHero
// (and OUTSIDE GradientReveal — see note below). That makes the nav
// genuinely persistent across the whole page, unlike the earlier
// absolute-inside-ZoomHero layout which scrolled away with the hero.
//
// Why this doesn't reintroduce the old criss-cross/seam bug:
// The original seam came from two conditions at once — the pill's
// rounded corners and the hero's *rounded top corners* almost-meeting
// along the hero's top edge and producing a visible curve mismatch.
// ZoomHero now explicitly keeps the hero's top corners SQUARE (only
// the bottom pair is rounded), so the pill's curves never have a
// second curve to mis-align against. The pill can safely fade in
// over the hero without recreating the criss-cross condition.
//
// The pill fades in smoothly starting at scrollY=0 so the motion
// feels continuous with the scroll gesture — if we delayed the fade
// until the hero was offscreen, the pill would "pop in" and read as
// a stark, separate chrome layer arriving out of nowhere. This way
// the pill is always in sympathy with the scroll.
//
// GradientReveal note: the Header MUST render outside GradientReveal
// because GradientReveal applies a `translate3d` to its content frame
// for the bottom-overshoot effect. That transform creates a new
// containing block, which would trap any `position: fixed`
// descendant inside it (the nav would then scroll with the page).

// Scroll distance (px) over which the navbar transitions from the
// integrated "top" state to the docked state. Kept deliberately short
// so the pill tracks the scroll gesture closely — if the range is
// wide, the first few dozen pixels of scroll leave the pill looking
// unchanged and the materialization reads as "too late" / out of
// sync with the user's input. A short range + nearly-linear easing
// makes the transform feel like it's responding to every tick of
// the wheel.
const SCROLL_RANGE = 60;

export function Header() {
  const headerRef = useRef(null);
  const pillRef = useRef(null);
  const ctaRef = useRef(null);
  const logoRef = useRef(null);

  // Single rAF-driven update that computes BOTH the dock progress
  // (scrollY / SCROLL_RANGE — drives the pill materializing in) AND
  // the chapter tint progress (sentinel position vs. viewport — drives
  // the dark→light theme cross-fade). Pill bg/border + logo invert are
  // interpolated continuously between the two themes by the chapter
  // progress, so the nav eases through the transition along with the
  // page background tint instead of hard-flipping at a threshold.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const header = headerRef.current;
    const pill = pillRef.current;
    const cta = ctaRef.current;
    const logo = logoRef.current;
    if (!header || !pill) return;

    // Light-chapter sentinels (same selector ScrollTintedChapter watches).
    // Re-queried on each resize via the resize handler so dynamically
    // injected sections still register if they ever appear later.
    let lightSections = Array.from(
      document.querySelectorAll('[data-nav-theme="light"]'),
    );

    // Dark / light pill+border tokens — the same values used in the
    // hard-flip version, just split into rgb arrays so we can lerp.
    const DARK_PILL_RGB = [48, 48, 48];
    const LIGHT_PILL_RGB = [255, 255, 255];
    const DARK_BORDER_RGB = [255, 255, 255];
    const LIGHT_BORDER_RGB = [0, 0, 0];
    const DARK_BORDER_ALPHA_MAX = 0.12;
    const LIGHT_BORDER_ALPHA_MAX = 0.08;

    const clamp01 = (n) => Math.max(0, Math.min(1, n));
    const lerp = (a, b, t) => a + (b - a) * t;
    const lerpRgb = (a, b, t) => [
      Math.round(lerp(a[0], b[0], t)),
      Math.round(lerp(a[1], b[1], t)),
      Math.round(lerp(a[2], b[2], t)),
    ];
    const ease = (t) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    // Tint formula tied to the NAV's own y-position, not the viewport
    // bottom. The nav should read whatever section sits directly behind
    // the pill — so we measure each light section's edges relative to
    // the pill's bottom (NAV_BOTTOM_PX). Fades complete just as the
    // section enters/exits the nav strip, which keeps the pill in light
    // mode for the entire time cream content is visibly below it,
    // instead of flipping back to dark while the cream section is still
    // on screen below the fold.
    const FADE_PX = 60;
    const NAV_BOTTOM_PX = 56;
    const computeChapterTint = () => {
      // Re-query each frame: the page may hydrate a section with
      // `data-nav-theme="light"` AFTER the Header mounts (e.g. the
      // Hero version state flips to v9 from a URL param). A one-shot
      // query on mount would miss that and leave the logo white on a
      // light background.
      lightSections = Array.from(
        document.querySelectorAll('[data-nav-theme="light"]'),
      );
      if (lightSections.length === 0) return 0;
      let max = 0;
      for (const s of lightSections) {
        const r = s.getBoundingClientRect();
        const fadeIn = clamp01((NAV_BOTTOM_PX - r.top) / FADE_PX);
        const fadeOut = clamp01((r.bottom - NAV_BOTTOM_PX) / FADE_PX);
        const t = Math.min(fadeIn, fadeOut);
        if (t > max) max = t;
      }
      return ease(max);
    };

    let raf = null;
    const apply = () => {
      raf = null;

      // Dock progress (pill materializing as the user scrolls past
      // the hero). Same easing curve as before.
      const p = clamp01(window.scrollY / SCROLL_RANGE);
      const e = 1 - Math.pow(1 - p, 2);

      // Chapter tint progress (0 = fully dark theme, 1 = fully light).
      const tint = computeChapterTint();

      // Interpolated pill + border tokens. RGB lerps between the two
      // themes; alpha multipliers also lerp so the light theme can use
      // its quieter border alpha.
      const pillRgb = lerpRgb(DARK_PILL_RGB, LIGHT_PILL_RGB, tint);
      const borderRgb = lerpRgb(DARK_BORDER_RGB, LIGHT_BORDER_RGB, tint);
      const borderAlphaMax = lerp(
        DARK_BORDER_ALPHA_MAX,
        LIGHT_BORDER_ALPHA_MAX,
        tint,
      );

      pill.style.backgroundColor = `rgba(${pillRgb[0]}, ${pillRgb[1]}, ${pillRgb[2]}, ${e * 0.7})`;
      pill.style.borderColor = `rgba(${borderRgb[0]}, ${borderRgb[1]}, ${borderRgb[2]}, ${e * borderAlphaMax})`;

      const blur = e * 10;
      const blurValue = blur > 0.1 ? `blur(${blur}px)` : "none";
      pill.style.backdropFilter = blurValue;
      pill.style.webkitBackdropFilter = blurValue;

      pill.style.boxShadow = `0 ${4 * e}px ${16 * e}px -${10 * e}px rgba(0, 0, 0, ${0.2 * e})`;

      const scale = 1 - e * 0.02;
      pill.style.transform = `scale(${scale})`;
      header.style.top = `${12 - e * 2}px`;

      if (cta) {
        cta.style.opacity = String(e);
        cta.style.pointerEvents = e > 0.5 ? "auto" : "none";
        cta.style.transform = `translate3d(${(1 - e) * 8}px, 0, 0)`;
      }

      // Logo invert filter eases continuously from 0 → 1 with the
      // tint. Filter values transition smoothly when set frame by
      // frame, so the wordmark crossfades from white to black in
      // step with the bg fade.
      if (logo) {
        logo.style.filter = `invert(${tint})`;
      }
    };

    const onScroll = () => {
      if (raf != null) return;
      raf = requestAnimationFrame(apply);
    };

    const onResize = () => {
      // Re-collect sentinels on resize in case the layout shifted.
      lightSections = Array.from(
        document.querySelectorAll('[data-nav-theme="light"]'),
      );
      onScroll();
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    // Watch for `data-nav-theme` attribute changes anywhere in the
    // tree — the Hero hydrates its theme attribute AFTER mount when
    // the version comes from a URL param, so a one-shot query on
    // mount would miss it.
    const observer = new MutationObserver(onScroll);
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-nav-theme"],
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      // Viewport-fixed so the nav persists across every section —
      // genuinely sticky. Must be rendered OUTSIDE GradientReveal
      // (see file comment above). The pill materializes continuously
      // from scrollY=0 so its appearance tracks the scroll gesture;
      // the seam bug is avoided structurally by ZoomHero keeping the
      // hero's TOP corners square (no rounded-edge mismatch between
      // the pill and the hero to produce a criss-cross).
      className="fixed inset-x-0 z-50 px-3 md:px-4"
      style={{ top: "12px" }}
    >
      <div
        ref={pillRef}
        className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border px-4 py-2.5 md:py-2 md:pl-5 md:pr-2"
        style={{
          // Initial state matches what the scroll listener will produce
          // at scrollY=0 so there's no paint flash on mount.
          backgroundColor: "rgba(48, 48, 48, 0)",
          borderColor: "rgba(255, 255, 255, 0)",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          transformOrigin: "center center",
          // No CSS transition on bg/border — the rAF loop sets them
          // every frame as the user scrolls, so a CSS transition would
          // add a lag/echo behind the live interpolation. The scroll-
          // tied math IS the smoothing.
          willChange:
            "transform, background-color, border-color, backdrop-filter, box-shadow",
        }}
      >
        <a
          href="/"
          aria-label={SITE.brand}
          className="inline-flex items-center transition-opacity duration-200 hover:opacity-80"
        >
          {/* Wordmark changes by breakpoint: "Studio" only on mobile,
              full "Assembly Studio" lockup from md: up. Logo color
              flips via CSS filter (invert(1)) when the nav sits over
              a light-tagged section — both SVGs are pure white, so
              inverting them yields pure black. */}
          <img
            ref={logoRef}
            src="/logos/web-logo.svg"
            alt={SITE.brand}
            className="h-6 w-auto"
            style={{
              filter: "invert(0)",
            }}
          />
        </a>
        <span
          ref={ctaRef}
          className="hidden md:inline-flex"
          style={{
            opacity: 0,
            pointerEvents: "none",
            transform: "translate3d(8px, 0, 0)",
            willChange: "opacity, transform",
          }}
        >
          <button
            type="button"
            onClick={scrollToHeroEmail}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#D9ED92] px-4 py-2 text-[13px] font-medium text-[#101010] transition-all duration-200 hover:bg-[#C7DA86]"
          >
            {SITE.cta}
          </button>
        </span>
      </div>
    </header>
  );
}
