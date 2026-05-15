"use client";

// Small circular play/pause toggle overlayed on a value-prop visual's
// card. Frosted-glass capsule + white icon keeps it readable on both
// the bright product mockup (top of the card) and the lime/blue
// gradient margin (bottom of the card), and against the dark page bg
// where the visual's rounded corner shows through. Designed as a tiny
// piece of chrome, not a primary action.
//
// The progress ring is driven by a CSS keyframe that runs for `durationMs`
// and loops. Pausing the animation freezes the ring via
// `animation-play-state: paused`. The browser handles the timing so the
// ring stays in sync with the video's real-time phase progression.
const RING_RADIUS = 14.25; // circle radius in SVG coords (button is 32×32, leaves room for the hairline edge)
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function PlayPauseToggle({ paused, onToggle, durationMs, active = true }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={paused ? "Play animation" : "Pause animation"}
      aria-pressed={paused}
      className="group absolute bottom-3 right-3 z-30 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#101010]/55 text-white/90 shadow-[0_3px_8px_-3px_rgba(0,0,0,0.25)] ring-1 ring-inset ring-white/[0.14] backdrop-blur-md transition-[background-color,color,transform] duration-200 hover:bg-[#101010]/70 hover:text-white active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
    >
      <style>{`
        @keyframes pp-ring-progress {
          from { stroke-dashoffset: ${RING_CIRCUMFERENCE}; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
      {/* Progress ring — absolute, inside the button. The track is very
          faint so the inset ring above carries the visible edge; the
          indicator traces loop elapsed at higher opacity. */}
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
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="1.25"
        />
        <circle
          cx="16"
          cy="16"
          r={RING_RADIUS}
          fill="none"
          stroke="rgba(255,255,255,0.7)"
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
          width="9"
          height="11"
          viewBox="0 0 9 11"
          fill="currentColor"
          aria-hidden="true"
          className="relative ml-[1px]"
        >
          <path d="M0.5 0.6 L0.5 10.4 L8.5 5.5 Z" />
        </svg>
      ) : (
        <svg
          width="9"
          height="11"
          viewBox="0 0 9 11"
          fill="currentColor"
          aria-hidden="true"
          className="relative"
        >
          <rect x="0.5" y="0.5" width="2.4" height="10" rx="1" />
          <rect x="6.1" y="0.5" width="2.4" height="10" rx="1" />
        </svg>
      )}
    </button>
  );
}
