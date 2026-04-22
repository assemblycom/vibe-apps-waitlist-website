"use client";

import { useEffect, useRef, useState } from "react";
import { CTAButton } from "./CTAButton";
import { SITE } from "../config/site";

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
  // Which surface is currently behind the nav pill. Drives color inversion
  // — Voiceflow-style: dark pill / white logo on dark sections, light
  // pill / black logo on off-white sections (NarrativeBlock + light
  // LogoStrip). Default to "dark" since the hero is dark and sits at the
  // top of the page.
  const [theme, setTheme] = useState("dark");

  // Watch any section tagged with `data-nav-theme="light"`. When such a
  // section crosses the nav's horizontal strip (top ~0-60px of the
  // viewport), flip the theme to "light". Anything else → "dark".
  // Detection is position-based (rect.top vs. a threshold) rather than
  // a pure IntersectionObserver ratio, because the nav only cares about
  // what sits directly behind it, not how much of the section is in view.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const lightSections = Array.from(
      document.querySelectorAll('[data-nav-theme="light"]'),
    );
    if (lightSections.length === 0) return;

    // The pill sits around y=12–60px. We flip to "light" once any
    // tagged section's top has crossed below y=60 and its bottom is
    // still below y=0. Check cheaply on scroll.
    const NAV_BAND_TOP = 0;
    const NAV_BAND_BOTTOM = 60;

    const check = () => {
      let inLight = false;
      for (const s of lightSections) {
        const r = s.getBoundingClientRect();
        if (r.top <= NAV_BAND_BOTTOM && r.bottom >= NAV_BAND_TOP) {
          inLight = true;
          break;
        }
      }
      setTheme(inLight ? "light" : "dark");
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    const pill = pillRef.current;
    const cta = ctaRef.current;
    const logo = logoRef.current;
    if (!header || !pill) return;

    const isLight = theme === "light";

    // Pill fill / border — dark pill over dark sections, light pill
    // over off-white sections. Alpha at peak stays the same (~0.7) so
    // the translucent feel is preserved on both surfaces.
    const pillFill = isLight
      ? "255, 255, 255" // light: white pill, darkens whatever sits behind
      : "48, 48, 48"; // dark: charcoal pill
    const pillBorder = isLight
      ? "0, 0, 0" // light: subtle dark outline
      : "255, 255, 255"; // dark: subtle white outline
    const pillBorderAlphaMax = isLight ? 0.08 : 0.12;

    let raf = null;
    const apply = () => {
      raf = null;
      const p = Math.max(0, Math.min(1, window.scrollY / SCROLL_RANGE));
      // easeOutQuad — front-loaded but not as abrupt as pure linear.
      // Keeps the pill visibly changing from the first pixel of scroll
      // instead of a slow-start curve like cubic.
      const e = 1 - Math.pow(1 - p, 2);

      // Pill background, border, blur — all fade in together.
      pill.style.backgroundColor = `rgba(${pillFill}, ${e * 0.7})`;
      pill.style.borderColor = `rgba(${pillBorder}, ${e * pillBorderAlphaMax})`;
      const blur = e * 10;
      const blurValue = blur > 0.1 ? `blur(${blur}px)` : "none";
      pill.style.backdropFilter = blurValue;
      pill.style.webkitBackdropFilter = blurValue;

      // Very soft shadow — just enough to hint at elevation without
      // reading as a floating chrome bar.
      pill.style.boxShadow = `0 ${4 * e}px ${16 * e}px -${10 * e}px rgba(0, 0, 0, ${0.2 * e})`;

      // Slight compacting: pill shrinks very subtly (1 → 0.98) so the
      // transformation reads as the nav "settling in" rather than
      // expanding outward.
      const scale = 1 - e * 0.02;
      pill.style.transform = `scale(${scale})`;

      // Top offset tightens a touch as the pill docks.
      header.style.top = `${12 - e * 2}px`;

      // CTA fades in alongside the pill — the top state is just the
      // logo (minimal, no call-to-action yet). Pointer-events gated
      // on visibility so the invisible button isn't clickable.
      if (cta) {
        cta.style.opacity = String(e);
        cta.style.pointerEvents = e > 0.5 ? "auto" : "none";
        cta.style.transform = `translate3d(${(1 - e) * 8}px, 0, 0)`;
      }
    };

    // Logo color swap — the wordmark + mark SVGs are filled with pure
    // white, so inverting the image turns every pixel black. Applies
    // to the <img> via CSS filter with a smooth transition so the
    // crossfade reads as a single material flipping, not two logos
    // swapping. Transition is set once on mount (below) so the color
    // change itself eases even when the state updates instantly.
    if (logo) {
      logo.style.filter = isLight ? "invert(1)" : "invert(0)";
    }

    const onScroll = () => {
      if (raf != null) return;
      raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, [theme]);

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
          // Transition bg + border so the dark↔light flip eases smoothly
          // when crossing section boundaries. The scroll listener still
          // sets these each frame; the transition covers the gap between
          // frames when only the theme (not scroll) has changed.
          transition:
            "background-color 300ms ease, border-color 300ms ease",
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
              transition: "filter 300ms ease",
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
          <CTAButton variant="primary" size="sm" />
        </span>
      </div>
    </header>
  );
}
