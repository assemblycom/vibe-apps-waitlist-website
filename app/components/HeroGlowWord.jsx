"use client";

import { useRef } from "react";

const CHAR_STAGGER_MS = 55;

// Per-character neon ignite on "client-facing". Plays once on mount
// (CSS-driven, staggered via inline animation-delay) and re-plays on
// hover by clearing + re-applying the animation on each char. Stays
// inert on touch since `:hover` never fires there.
export function HeroGlowWord({ text }) {
  const ref = useRef(null);

  const replay = () => {
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

  return (
    <span
      ref={ref}
      className="hero-glow-word"
      aria-label={text}
      onMouseEnter={replay}
    >
      {Array.from(text).map((c, j) => (
        <span
          key={j}
          aria-hidden="true"
          className="hero-glow-char"
          style={{ animationDelay: `${j * CHAR_STAGGER_MS}ms` }}
        >
          {c}
        </span>
      ))}
    </span>
  );
}
