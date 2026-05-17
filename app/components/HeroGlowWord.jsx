"use client";

import { useEffect, useRef, useState } from "react";

const CHAR_STAGGER_MS = 55;

// Per-character neon ignite. Defaults to the hero "client-facing"
// behavior: plays once on mount and re-plays on hover (desktop) or
// tap (touch). Pointerdown is used so a finger tap fires the replay
// immediately instead of waiting for a synthesized mouse event that
// mobile Safari only sometimes emits.
//
// `playOnInView` switches the component into a one-shot reveal mode:
// the chars render in their default visible state until the element
// scrolls into view, then the ignite plays exactly once. Hover/tap
// replay is disabled in that mode so it stays a single-fire payoff
// instead of becoming a re-triggerable easter egg.
export function HeroGlowWord({ text, playOnInView = false }) {
  const ref = useRef(null);
  const lastReplayRef = useRef(0);
  // `playing` gates whether the CSS animation is allowed to run. In
  // the default (hero) mode it starts true so the ignite fires on
  // mount. In `playOnInView` mode it starts false, holding the chars
  // at opacity:1 with `animation-name: none` until the
  // IntersectionObserver flips it on.
  const [playing, setPlaying] = useState(!playOnInView);

  const replay = () => {
    // Coalesce rapid double-fires (pointerdown + synthesized mouseenter
    // on the same tap) so the animation isn't reset twice in one frame.
    const now = Date.now();
    if (now - lastReplayRef.current < 120) return;
    lastReplayRef.current = now;

    const chars = ref.current?.querySelectorAll(".hero-glow-char");
    if (!chars || !chars.length) return;
    // Touch only `animationName` (not the `animation` shorthand) so the
    // inline `animation-delay` set per character from the JSX side
    // survives the restart and the stagger plays back exactly like the
    // first-load run instead of every letter firing at once.
    chars.forEach((c) => {
      c.style.animationName = "none";
    });
    // Force a single reflow so the browser sees the cleared state
    // before the CSS-rule name comes back into effect.
    // eslint-disable-next-line no-unused-expressions
    ref.current.offsetWidth;
    chars.forEach((c) => {
      c.style.animationName = "";
    });
  };

  // Scroll-reveal mode: watch the element and let the animation play
  // the first time it crosses ~halfway into view. Disconnect after the
  // single firing so it never re-plays as the user scrolls past again.
  useEffect(() => {
    if (!playOnInView) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      // Older browsers (or SSR-equivalent guards) — just reveal now.
      setPlaying(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlaying(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [playOnInView]);

  const interactive = !playOnInView;

  return (
    <span
      ref={ref}
      className="hero-glow-word"
      aria-label={text}
      onMouseEnter={interactive ? replay : undefined}
      onPointerDown={interactive ? replay : undefined}
    >
      {Array.from(text).map((c, j) => (
        <span
          key={j}
          aria-hidden="true"
          className="hero-glow-char"
          style={{
            animationDelay: `${j * CHAR_STAGGER_MS}ms`,
            // Pre-reveal state for `playOnInView`: the chars sit in
            // their final appearance (visible white at full opacity,
            // no glow) so the heading reads normally while waiting,
            // then drops these overrides when `playing` flips and the
            // CSS rule's animation runs end-to-end from the top.
            ...(playing ? {} : { animationName: "none", opacity: 1 }),
          }}
        >
          {c}
        </span>
      ))}
    </span>
  );
}
