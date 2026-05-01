"use client";

// Small circular play/pause toggle overlayed on a value-prop visual's
// card. Dark capsule + white icon keeps it readable on both the bright
// product mockup (top of the card) and the lime/blue gradient margin
// (bottom of the card). Designed as a tiny piece of chrome, not a
// primary action: sized down, slightly translucent, low-noise hover.
//
// The progress ring is driven by a CSS keyframe that runs for `durationMs`
// and loops. Pausing the animation freezes the ring via
// `animation-play-state: paused`. The browser handles the timing so the
// ring stays in sync with the video's real-time phase progression.
const RING_RADIUS = 15; // circle radius in SVG coords (button is 32×32)
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function PlayPauseToggle({ paused, onToggle, durationMs, active = true }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={paused ? "Play animation" : "Pause animation"}
      aria-pressed={paused}
      className="group absolute bottom-3 right-3 z-30 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white/85 backdrop-blur-sm transition-colors duration-200 hover:bg-black/75 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
    >
      <style>{`
        @keyframes pp-ring-progress {
          from { stroke-dashoffset: ${RING_CIRCUMFERENCE}; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
      {/* Progress ring — absolute, inside the button. The track gives
          the button its visual edge; the indicator traces loop elapsed.
          Very low-contrast so the ring reads as chrome. */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <circle
          cx="16"
          cy="16"
          r={RING_RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1.25"
        />
        <circle
          cx="16"
          cy="16"
          r={RING_RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          transform="rotate(-90 16 16)"
          style={
            active && durationMs
              ? {
                  animation: `pp-ring-progress ${durationMs}ms linear infinite`,
                  animationPlayState: paused ? "paused" : "running",
                }
              : { strokeDashoffset: RING_CIRCUMFERENCE }
          }
        />
      </svg>

      {paused ? (
        <svg
          width="10"
          height="12"
          viewBox="0 0 10 12"
          fill="currentColor"
          aria-hidden="true"
          className="relative"
        >
          <path d="M0.5 0.75 L0.5 11.25 L9.25 6 Z" />
        </svg>
      ) : (
        <svg
          width="10"
          height="12"
          viewBox="0 0 10 12"
          fill="currentColor"
          aria-hidden="true"
          className="relative"
        >
          <rect x="0.5" y="0.5" width="2.75" height="11" rx="0.75" />
          <rect x="6.75" y="0.5" width="2.75" height="11" rx="0.75" />
        </svg>
      )}
    </button>
  );
}
