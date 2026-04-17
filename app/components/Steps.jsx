"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const PROMPT_LINE_1 = "A client intake flow for a boutique legal firm.";
const PROMPT_LINE_2 = "Custom scoping, documents, billing.";
const FULL_PROMPT = `${PROMPT_LINE_1}\n${PROMPT_LINE_2}`;
const GENERATED_ITEMS = [
  "Auth & permissions",
  "Client CRM",
  "Branded portal",
  "Billing + messaging",
];

function StudioPreview({ activeStep }) {
  // When activeStep === null we show the "resting" completed state so the section
  // looks coherent before the cycle begins (pre-inView). Once the cycle kicks in,
  // useEffects below drive the per-step animation.
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

  const isActive = (step) => activeStep === step;
  const isDim = (step) => activeStep !== null && activeStep !== step;

  const displayText = FULL_PROMPT.slice(0, typedLength);
  const showCursor = activeStep === 0 && typedLength < FULL_PROMPT.length;
  const generating = activeStep === 1 && revealCount < GENERATED_ITEMS.length;

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.02] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <span className="mono ml-3 text-[10px] uppercase tracking-[0.1em] text-white/30">
          studio.assembly.com / new
        </span>
      </div>

      <div className="space-y-5 p-5">
        {/* STEP 01 — prompt (typing cursor is the cue, no ring) */}
        <div
          className={clsx(
            "rounded-lg transition-opacity duration-500",
            isDim(0) && "opacity-40",
          )}
        >
          <div className="mono mb-2 text-[10px] uppercase tracking-[0.12em] text-white/35">
            Prompt
          </div>
          <div className="min-h-[72px] whitespace-pre-line rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-[13px] leading-[1.5] text-white/80">
            {displayText}
            {showCursor && (
              <span className="ml-0.5 inline-block h-[0.95em] w-[1.5px] translate-y-[2px] animate-pulse bg-white/70 align-middle" />
            )}
          </div>
        </div>

        {/* STEP 02 — generating (AI "thinking" dots are the cue, no ring) */}
        <div
          className={clsx(
            "rounded-lg transition-opacity duration-500",
            isDim(1) && "opacity-40",
          )}
        >
          <div className="mono mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-white/35">
            <span className="inline-flex items-center gap-[3px]">
              <span
                className={clsx(
                  "h-[5px] w-[5px] rounded-full bg-white/60",
                  generating && "studio-thinking-dot",
                )}
                style={generating ? { animationDelay: "0ms" } : undefined}
              />
              <span
                className={clsx(
                  "h-[5px] w-[5px] rounded-full bg-white/60",
                  generating && "studio-thinking-dot",
                )}
                style={generating ? { animationDelay: "160ms" } : undefined}
              />
              <span
                className={clsx(
                  "h-[5px] w-[5px] rounded-full bg-white/60",
                  generating && "studio-thinking-dot",
                )}
                style={generating ? { animationDelay: "320ms" } : undefined}
              />
            </span>
            <span className="ml-1">{generating ? "Thinking…" : "Generated"}</span>
          </div>
          <div className="space-y-1.5">
            {GENERATED_ITEMS.map((item, i) => {
              const visible = i < revealCount;
              return (
                <div
                  key={item}
                  className={clsx(
                    "flex items-center gap-2 rounded-md border border-white/5 bg-white/[0.015] px-3 py-2 text-[12px] text-white/70 transition-all duration-500 ease-out",
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
                    className="flex-shrink-0 text-white/60"
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

        {/* STEP 03 — ready to ship (subtle border/bg shift, no ring) */}
        <div
          className={clsx(
            "flex items-center justify-between rounded-lg border px-4 py-3 transition-all duration-500",
            isActive(2)
              ? "border-white/25 bg-white/[0.06]"
              : "border-white/15 bg-white/[0.04]",
            isDim(2) && "opacity-40",
          )}
        >
          <div>
            <div className="text-[13px] font-semibold text-white">
              Ready to ship
            </div>
            <div className="text-[11px] text-white/45">
              Clients onboarded in minutes
            </div>
          </div>
          <div
            className={clsx(
              "mono flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] transition-colors duration-300",
              isActive(2) ? "text-white" : "text-white/60",
            )}
          >
            Ship
            <span
              className={clsx(
                "inline-block",
                isActive(2) && "studio-ship-arrow",
              )}
            >
              →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Steps({ eyebrow, heading, steps = [] }) {
  // hoveredStep overrides the auto-cycle; cycleStep drives it.
  const [hoveredStep, setHoveredStep] = useState(null);
  const [cycleStep, setCycleStep] = useState(null);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  const activeStep = hoveredStep !== null ? hoveredStep : cycleStep;

  // Start the cycle once the section scrolls into view.
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-advance through the three steps while in view and not hovering.
  useEffect(() => {
    if (!inView || hoveredStep !== null) return;
    if (cycleStep === null) {
      setCycleStep(0);
      return;
    }
    // Dwell per step: give the typing animation enough time, then shorter pauses.
    const durations = [3200, 1800, 2000];
    const t = setTimeout(() => {
      setCycleStep((s) => ((s ?? 0) + 1) % 3);
    }, durations[cycleStep]);
    return () => clearTimeout(t);
  }, [cycleStep, inView, hoveredStep]);

  return (
    <section
      ref={sectionRef}
      className="gradient-divider py-20 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-12">
          {eyebrow && (
            <span className="mono mb-4 block text-xs uppercase tracking-[0.08em] text-white/40">
              {eyebrow}
            </span>
          )}
          {heading && (
            <h3 className="max-w-2xl text-2xl font-semibold leading-tight tracking-[-0.02em] text-white md:text-[2rem]">
              {heading}
            </h3>
          )}
        </div>

        {/* Two-column body */}
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* Left — interactive feature list */}
          <div
            className="flex flex-col"
            onMouseLeave={() => setHoveredStep(null)}
          >
            {steps.map((step, i) => {
              const isActive = activeStep === i;
              const isInactive = activeStep !== null && activeStep !== i;
              return (
                <button
                  key={i}
                  type="button"
                  onMouseEnter={() => setHoveredStep(i)}
                  onFocus={() => setHoveredStep(i)}
                  onBlur={() => setHoveredStep(null)}
                  className={clsx(
                    "flex w-full cursor-default gap-5 border-b border-white/[0.06] py-6 text-left transition-opacity duration-300 first:pt-0 last:border-b-0 last:pb-0",
                    isInactive && "opacity-45",
                  )}
                >
                  <span
                    className={clsx(
                      "mono flex-shrink-0 pt-0.5 text-[11px] uppercase tracking-[0.1em] transition-colors duration-300",
                      isActive ? "text-white" : "text-white/40",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="mono mb-2 text-[13px] uppercase tracking-[0.08em] text-white">
                      {step.title}
                    </h4>
                    <p className="text-[0.95rem] leading-[1.6] text-white/55">
                      {step.body}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right — product mockup, syncs with the active step */}
          <div>
            <StudioPreview activeStep={activeStep} />
          </div>
        </div>
      </div>
    </section>
  );
}
