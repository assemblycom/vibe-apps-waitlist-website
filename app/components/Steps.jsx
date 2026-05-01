"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

// Voiceflow-style narrative timeline:
//
//   [HOW IT WORKS]
//   Three steps to a shipped client app
//   ─── dim line across columns, lime segment slides to active step ───
//   ● Step 01            ○ Step 02          ○ Step 03
//   Describe your app    Assembly generates Ship to clients
//   Body                 Body               Body
//
//   [ LARGE VISUAL — F5F5F0 card that morphs with the active step ]
//
// Interactivity: hover/focus a step to preview it; auto-cycle runs
// when the section is in view so the visual tells the "describe →
// generate → ship" story on its own.

// Content for the preview's phases
const PROMPT_LINE_1 = "A client intake flow for a boutique legal firm.";
const PROMPT_LINE_2 = "Custom scoping, documents, billing.";
const FULL_PROMPT = `${PROMPT_LINE_1}\n${PROMPT_LINE_2}`;
const GENERATED_ITEMS = [
  "Auth & permissions",
  "Client CRM",
  "Branded portal",
  "Billing + messaging",
];

const ACCENT = "rgb(217,237,146)"; // brand lime
export const DURATIONS = [3200, 1800, 2000]; // ms per step

// Shared gradient recipe — matches PromptCardVisual / Infrastructure so
// all value-prop visuals read as the same family.
const CARD_GRADIENT = [
  "linear-gradient(180deg, rgba(255,255,255,0) 12.397%, rgb(139,153,200) 74.611%, rgb(217,237,146) 100%)",
  "linear-gradient(90deg, rgb(255,255,255) 0%, rgb(255,255,255) 100%)",
].join(", ");

// Segmented progress bar: one continuous strip of vertical bars split
// evenly across the three steps. 24 segments per step → 72 total.
const SEGMENTS_PER_STEP = 24;
const TOTAL_SEGMENTS = SEGMENTS_PER_STEP * 3;

// ── Visual phases ─────────────────────────────────────────────────────────

// All three phases share one grid cell so the outer card height stays
// stable as they morph; only the active phase is visible + interactive.
function Phase({ visible, children }) {
  return (
    <div
      aria-hidden={!visible}
      className={clsx(
        "transition-[opacity,transform] duration-500 ease-out",
        visible
          ? "opacity-100 translate-y-0"
          : "pointer-events-none invisible translate-y-1 opacity-0",
      )}
    >
      {children}
    </div>
  );
}

// Shared inner-card styling — matches the floating input in
// PromptCardVisual so the Steps visual lives in the same family.
const INNER_CARD =
  "rounded-[12px] border border-[#dfe1e4] bg-[#fbfbfb] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)]";

function PromptPhase({ typed, isDone }) {
  const isEmpty = typed.length === 0;
  return (
    <div className={clsx(INNER_CARD, "px-5 pb-3 pt-4")}>
      <div className="mb-2 h-[64px] overflow-hidden whitespace-pre-line text-[15px] leading-[1.55]">
        {isEmpty ? (
          <span className="text-[#90959d]">
            Describe the app your firm needs…
          </span>
        ) : (
          <span className="text-[#101010]">
            {typed}
            {!isDone && (
              <span
                aria-hidden="true"
                className="ml-0.5 inline-block h-[0.95em] w-[2px] translate-y-[-0.5px] animate-pulse bg-[#101010] align-text-top"
              />
            )}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span
          aria-hidden="true"
          className="flex h-7 w-7 items-center justify-center text-[#90959d]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </span>
        <span
          className={clsx(
            "rounded-[4px] px-3 py-1.5 text-[13px] font-medium transition-colors duration-300",
            isDone
              ? "bg-[#101010] text-white"
              : "bg-[#eff1f4] text-[#c9cbcd]",
          )}
        >
          Build app
        </span>
      </div>
    </div>
  );
}

function GeneratingPhase({ revealCount, items, generating }) {
  return (
    <div className={clsx(INNER_CARD, "p-5")}>
      <div className="mono mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-[#101010]/45">
        <span className="inline-flex items-center gap-[3px]">
          {[0, 160, 320].map((delay) => (
            <span
              key={delay}
              className={clsx(
                "h-[5px] w-[5px] rounded-full bg-[#101010]/55",
                generating && "studio-thinking-dot",
              )}
              style={generating ? { animationDelay: `${delay}ms` } : undefined}
            />
          ))}
        </span>
        <span className="ml-1">{generating ? "Thinking…" : "Generated"}</span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => {
          const visible = i < revealCount;
          return (
            <div
              key={item}
              className={clsx(
                "flex items-center gap-2 rounded-md border border-[#e4e6ea] bg-white px-3 py-2.5 text-[13px] text-[#101010]/80 transition-all duration-500 ease-out",
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-1 opacity-0",
              )}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="flex-shrink-0 text-[#101010]/55"
              >
                <path
                  d="M2.5 6l2.5 2.5L9.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ShippedPhase({ active }) {
  return (
    <div
      className={clsx(
        INNER_CARD,
        "flex items-center justify-between px-5 py-4",
      )}
    >
      <div>
        <div className="text-[15px] font-semibold text-[#101010]">
          Ready to ship
        </div>
        <div className="text-[13px] text-[#101010]/50">
          Clients onboarded in minutes
        </div>
      </div>
      <span
        className={clsx(
          "mono flex items-center gap-1.5 rounded-[4px] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] transition-colors duration-300",
          active
            ? "bg-[#101010] text-white"
            : "bg-[#eff1f4] text-[#101010]/40",
        )}
      >
        Ship
        <span className={clsx("inline-block", active && "studio-ship-arrow")}>
          →
        </span>
      </span>
    </div>
  );
}

export function StudioPreview({ activeStep }) {
  // Default to phase 0 at rest (matches the timeline's default first-step
  // active state).
  const effectiveStep = activeStep ?? 0;

  const [typedLength, setTypedLength] = useState(FULL_PROMPT.length);
  const [revealCount, setRevealCount] = useState(GENERATED_ITEMS.length);

  // Typing effect on step 0
  useEffect(() => {
    if (activeStep === 0) {
      setTypedLength(0);
      let i = 0;
      const id = setInterval(() => {
        i += 2;
        if (i >= FULL_PROMPT.length) {
          setTypedLength(FULL_PROMPT.length);
          clearInterval(id);
        } else {
          setTypedLength(i);
        }
      }, 35);
      return () => clearInterval(id);
    }
    setTypedLength(FULL_PROMPT.length);
  }, [activeStep]);

  // Staggered reveal of generated items on step 1
  useEffect(() => {
    if (activeStep === 0) {
      setRevealCount(0);
      return;
    }
    if (activeStep === 1) {
      setRevealCount(0);
      let i = 0;
      const id = setInterval(() => {
        i += 1;
        setRevealCount(i);
        if (i >= GENERATED_ITEMS.length) clearInterval(id);
      }, 180);
      return () => clearInterval(id);
    }
    setRevealCount(GENERATED_ITEMS.length);
  }, [activeStep]);

  const displayText = FULL_PROMPT.slice(0, typedLength);
  const isTypingDone = typedLength >= FULL_PROMPT.length;
  const generating = activeStep === 1 && revealCount < GENERATED_ITEMS.length;

  return (
    // Matches the card shape + gradient of PromptCardVisual and
    // InfrastructureCardVisual so the value-prop set feels like one
    // family.
    <div
      className="relative aspect-[3/2] w-full overflow-hidden rounded-[28px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]"
      style={{ backgroundImage: CARD_GRADIENT }}
    >
      <div className="absolute left-1/2 top-1/2 w-[82%] max-w-[460px] -translate-x-1/2 -translate-y-1/2">
        <div className="grid items-center [&>*]:col-start-1 [&>*]:row-start-1">
          <Phase visible={effectiveStep === 0}>
            <PromptPhase typed={displayText} isDone={isTypingDone} />
          </Phase>
          <Phase visible={effectiveStep === 1}>
            <GeneratingPhase
              revealCount={revealCount}
              items={GENERATED_ITEMS}
              generating={generating}
            />
          </Phase>
          <Phase visible={effectiveStep === 2}>
            <ShippedPhase active={effectiveStep === 2} />
          </Phase>
        </div>
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────

export function Steps({ eyebrow, heading, steps = [] }) {
  const [hoveredStep, setHoveredStep] = useState(null);
  const [cycleStep, setCycleStep] = useState(null);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  const activeStep = hoveredStep !== null ? hoveredStep : cycleStep;
  const displayStep = activeStep ?? 0;

  // Start the auto-cycle once the section is 25% visible. Uses a scroll
  // listener (checked on mount + scroll) as a fallback for environments
  // where IntersectionObserver doesn't fire reliably (e.g. iframes).
  useEffect(() => {
    if (!sectionRef.current) return;
    const check = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const threshold = window.innerHeight * 0.75;
      if (rect.top < threshold) {
        setInView(true);
        window.removeEventListener("scroll", check);
      }
    };
    check(); // fire immediately in case section is already visible
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  // Auto-advance through the three steps while in view and not hovering.
  useEffect(() => {
    if (!inView || hoveredStep !== null) return;
    if (cycleStep === null) {
      setCycleStep(0);
      return;
    }
    const t = setTimeout(() => {
      setCycleStep((s) => ((s ?? 0) + 1) % 3);
    }, DURATIONS[cycleStep]);
    return () => clearTimeout(t);
  }, [cycleStep, inView, hoveredStep]);

  return (
    <section ref={sectionRef} className="gradient-divider py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header — left-aligned. Eyebrow + heading use the same type
            rules as Hero / NarrativeBlock so the section sits inside
            the site's brand voice:
              - eyebrow: mono · text-xs · uppercase · tracking-[0.08em]
                         · text-white/40
              - heading: text-[2.25rem] md:text-[3rem] · semibold
                         · leading-[1.1] · tracking-[-0.03em] */}
        <div className="mb-6 md:mb-8">
          {eyebrow && (
            <span className="mono mb-4 block text-xs uppercase tracking-[0.08em] text-white/40">
              {eyebrow}
            </span>
          )}
          {heading && (
            <h3 className="max-w-3xl text-2xl font-semibold leading-tight tracking-[-0.02em] text-white [text-wrap:balance] md:text-[2rem]">
              {heading}
            </h3>
          )}
        </div>

        {/* Segmented progress bar — one continuous strip of thin vertical
            bars split evenly across the three steps. Step-number labels
            sit directly above their starting segment (grid-cols-3 keeps
            them anchored to each third). Within the active step the
            segments light up one-by-one with staggered delays so the bar
            fills left-to-right at the step's dwell speed; completed
            steps stay lit through cycles. */}
        <div className="mb-4 md:mb-5" aria-hidden="true">
          <div className="mb-1.5 grid grid-cols-3">
            {steps.map((_, i) => {
              const LABELS = ["01", "02", "03"];
              const isReached =
                cycleStep !== null && i <= cycleStep;
              return (
                <div
                  key={i}
                  className={clsx(
                    "mono text-[10px] tracking-[0.12em] transition-colors duration-500",
                    isReached ? "text-white/50" : "text-white/20",
                  )}
                >
                  {LABELS[i]}
                </div>
              );
            })}
          </div>
          <div className="flex h-4 items-stretch gap-[2px] md:h-5">
            {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => {
              const stepOfSegment = Math.floor(i / SEGMENTS_PER_STEP);
              const indexInStep = i % SEGMENTS_PER_STEP;
              const isCompleted =
                cycleStep !== null && stepOfSegment < cycleStep;
              const isActive = stepOfSegment === cycleStep;
              const stepDuration = DURATIONS[stepOfSegment];
              const slotMs = stepDuration / SEGMENTS_PER_STEP;
              // Key includes cycleStep so active segments remount and
              // replay their animation on every cycle (including the
              // wrap from step 2 back to step 0).
              return (
                <div
                  key={`seg-${i}-${cycleStep ?? "idle"}`}
                  className="flex-1 rounded-[1px]"
                  style={{
                    backgroundColor: isCompleted
                      ? "rgba(255,255,255,0.7)"
                      : "rgba(255,255,255,0.08)",
                    boxShadow: isCompleted
                      ? "0 0 4px rgba(255,255,255,0.15)"
                      : "none",
                    animation: isActive
                      ? `steps-segment ${Math.max(
                          slotMs * 1.4,
                          120,
                        )}ms ease-out ${indexInStep * slotMs}ms forwards`
                      : "none",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Step selector — grid of 3 columns. Tightly packed under the
            progress bar so the eye moves in one continuous beat from
            segments → titles → body copy. */}
        <div
          className="mb-6 grid grid-cols-1 gap-6 md:mb-8 md:grid-cols-3 md:gap-6"
          onMouseLeave={() => setHoveredStep(null)}
        >
          {steps.map((step, i) => {
            const isActive = displayStep === i;
            return (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setHoveredStep(i)}
                onFocus={() => setHoveredStep(i)}
                onBlur={() => setHoveredStep(null)}
                aria-current={isActive ? "step" : undefined}
                className={clsx(
                  "group cursor-default text-left transition-opacity duration-300",
                  !isActive && activeStep !== null && "opacity-55",
                )}
              >
                <h4 className="mb-2 text-[1.05rem] font-semibold tracking-[-0.01em] text-white">
                  {step.title}
                </h4>
                <p className="text-[0.9rem] leading-[1.6] text-white/60">
                  {step.body}
                </p>
              </button>
            );
          })}
        </div>

        {/* Large visual — focal endpoint, morphs to match the active
            step. Spans the full section width (wider than the step row's
            max) so it reads as the hero of the section. */}
        <div className="w-full">
          <StudioPreview activeStep={activeStep} />
        </div>
      </div>
    </section>
  );
}
