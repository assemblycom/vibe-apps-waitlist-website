"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

// App-generation flow for the first value prop: a calm, curated
// animation that walks through describing an intake PDF, the model
// generating the app, and the resulting client experience coming
// alive. The outer card's gradient is preserved exactly — the
// animation sits on top of it.

const CARD_GRADIENT = [
  "linear-gradient(180deg, rgba(255,255,255,0) 12.397%, rgb(139,153,200) 74.611%, rgb(217,237,146) 100%)",
  "linear-gradient(90deg, rgb(255,255,255) 0%, rgb(255,255,255) 100%)",
].join(", ");

const PROMPT = "Turn this intake PDF into a digitized onboarding wizard";

const THINKING_STEPS = [
  "Analyzing PDF questionnaire",
  "Categorizing questions into wizard steps",
  "Polishing the client experience",
  "Creating internal admin experience",
  "Finalizing notification logic",
];

// Timing budget per phase (ms). Tuned so the viewer reads each beat
// without feeling rushed; the sum defines the loop length.
const PHASE_DURATIONS = [6200, 5200, 5200];

// Matches the inner-card treatment used across value-prop visuals so
// the whole set reads as one family.
const INNER_CARD =
  "rounded-[12px] border border-[#dfe1e4] bg-[#fbfbfb] shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)]";

// ── Phase wrapper: grid-stack crossfade with soft scale ──────────────
function Phase({ visible, children }) {
  return (
    <div
      aria-hidden={!visible}
      className={clsx(
        "transition-[opacity,transform] duration-[600ms] ease-out",
        visible
          ? "opacity-100 translate-y-0 scale-100"
          : "pointer-events-none invisible translate-y-1 scale-[0.985] opacity-0",
      )}
    >
      {children}
    </div>
  );
}

// ── Phase 0: Input box — placeholder → typing → attach PDF → armed ──
function InputPhase({ active }) {
  const [typed, setTyped] = useState(0);
  const [attached, setAttached] = useState(false);
  const [armed, setArmed] = useState(false);
  // hidden: off-card, moving: traveling to button, clicking: pressed,
  // done: released (button stays dark).
  const [cursorPhase, setCursorPhase] = useState("hidden");

  useEffect(() => {
    if (!active) {
      setTyped(0);
      setAttached(false);
      setArmed(false);
      setCursorPhase("hidden");
      return;
    }

    let cancelled = false;
    const timers = [];

    // Short settle before typing so the cursor isn't mid-stroke when
    // the phase appears.
    timers.push(
      setTimeout(() => {
        if (cancelled) return;
        let i = 0;
        const typeTick = () => {
          if (cancelled) return;
          i += 2;
          if (i >= PROMPT.length) {
            setTyped(PROMPT.length);
            return;
          }
          setTyped(i);
          timers.push(setTimeout(typeTick, 42));
        };
        typeTick();
      }, 420),
    );

    // Attach the PDF chip after typing finishes, then arm the button.
    timers.push(setTimeout(() => !cancelled && setAttached(true), 3700));
    timers.push(setTimeout(() => !cancelled && setArmed(true), 4500));

    // Cursor appears after the button arms, glides into the button,
    // presses, releases — then the phase advances on its own clock.
    timers.push(setTimeout(() => !cancelled && setCursorPhase("moving"), 4750));
    timers.push(
      setTimeout(() => !cancelled && setCursorPhase("clicking"), 5650),
    );
    timers.push(setTimeout(() => !cancelled && setCursorPhase("done"), 5900));

    return () => {
      cancelled = true;
      timers.forEach((t) => clearTimeout(t));
    };
  }, [active]);

  const text = PROMPT.slice(0, typed);
  const isEmpty = typed === 0;
  const isDone = typed >= PROMPT.length;

  const pressed = cursorPhase === "clicking";

  return (
    <div className={clsx(INNER_CARD, "relative px-5 pb-3 pt-4")}>
      {/* File chip — slides in from below the input once "attached". */}
      <div
        className={clsx(
          "overflow-hidden transition-[max-height,opacity,margin,transform] duration-[450ms] ease-out",
          attached
            ? "mb-3 max-h-[48px] translate-y-0 opacity-100"
            : "mb-0 max-h-0 translate-y-1 opacity-0",
        )}
      >
        <div className="inline-flex items-center gap-2 rounded-md border border-[#e4e6ea] bg-white px-2.5 py-1.5">
          {/* Project-supplied PDF glyph (public/Icons/pdf.svg). Sized
              to match the previous inline icon so the chip's metrics
              don't shift. */}
          <img
            src="/Icons/pdf.svg"
            alt=""
            aria-hidden="true"
            width={14}
            height={14}
            className="flex-shrink-0"
          />
          <span className="text-[11px] font-medium text-[#212b36]">
            intake-form.pdf
          </span>
          <span className="text-[10px] text-[#90959d]">24 KB</span>
        </div>
      </div>

      {/* Prompt text area — fixed min-height so the box doesn't shift
          when the chip appears. */}
      <div className="mb-2 min-h-[52px] text-[15px] leading-[1.55]">
        {isEmpty ? (
          <span className="text-[#90959d]">
            Describe the app your firm needs…
          </span>
        ) : (
          <span className="text-[#101010]">
            {text}
            {!isDone && (
              <span
                aria-hidden="true"
                className="ml-0.5 inline-block h-[0.95em] w-[2px] translate-y-[-0.5px] animate-pulse bg-[#101010] align-text-top"
              />
            )}
          </span>
        )}
      </div>

      {/* Actions row */}
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
            "rounded-[4px] px-3 py-1.5 text-[13px] font-medium transition-[background-color,color,transform,box-shadow] duration-[200ms] ease-out",
            armed
              ? "bg-[#101010] text-white"
              : "bg-[#eff1f4] text-[#c9cbcd]",
            pressed &&
              "scale-[0.96] shadow-[0_0_0_3px_rgba(16,16,16,0.08)]",
          )}
        >
          Build
        </span>
      </div>

      {/* Animated cursor — glides from off the bottom-right corner up
          to the Build-app button, clicks, and stays. Purely visual:
          `pointer-events-none` so it never intercepts real input. */}
      <div
        aria-hidden="true"
        className={clsx(
          "pointer-events-none absolute transition-[transform,opacity] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
          cursorPhase === "hidden"
            ? "opacity-0 duration-[200ms]"
            : "opacity-100 duration-[900ms]",
        )}
        style={{
          // Anchor: the cursor's tip (top-left of the SVG) lands a hair
          // inside the "Build" button when translate=0.
          right: "44px",
          bottom: "14px",
          transform:
            cursorPhase === "hidden"
              ? "translate(42px, 46px) scale(0.92)"
              : cursorPhase === "clicking"
              ? "translate(0, 0) scale(0.88)"
              : "translate(0, 0) scale(1)",
          transformOrigin: "top left",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          style={{
            filter: "drop-shadow(0 1px 2px rgba(16,16,16,0.18))",
          }}
        >
          <path
            d="M2.5 1.5 L2.5 14 L5.8 11 L8 15.2 L10 14.4 L7.8 10.2 L12.2 10.2 Z"
            fill="#101010"
            stroke="#ffffff"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

// ── Phase 1: Thinking — short status lines crossfade one at a time ──
function ThinkingPhase({ active }) {
  const [currentStep, setCurrentStep] = useState(-1);

  useEffect(() => {
    if (!active) {
      setCurrentStep(-1);
      return;
    }
    setCurrentStep(0);
    const id = setInterval(() => {
      setCurrentStep((s) => (s < THINKING_STEPS.length - 1 ? s + 1 : s));
    }, 920);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div className={clsx(INNER_CARD, "px-5 py-5")}>
      {/* Thinking header — matches the item type size (13px) so the
          header and list read as one block. */}
      <div className="mb-3 flex items-center gap-2 text-[13px] leading-[1.4] text-[#101010]/45">
        <span className="inline-flex items-center gap-[2px]">
          {[0, 160, 320].map((delay) => (
            <span
              key={delay}
              className="studio-thinking-dot h-[3px] w-[3px] rounded-full bg-[#101010]/40"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </span>
        <span className="ml-1">Building…</span>
      </div>

      {/* Step list — each step fades/slides in and stays. Past steps
          stay visible (slightly dimmed) so the reasoning stack builds
          up rather than flipping through one line at a time. */}
      <div className="flex flex-col gap-1.5">
        {THINKING_STEPS.map((step, i) => {
          const isCurrent = i === currentStep;
          const isPast = i < currentStep;
          const shown = isCurrent || isPast;
          return (
            <div
              key={step}
              className={clsx(
                "flex items-center gap-2.5 text-[13px] leading-[1.4] transition-[opacity,transform,color] duration-[600ms] ease-out",
                shown
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-1 opacity-0",
                isCurrent && "text-[#101010]/85",
                isPast && "text-[#101010]/45",
              )}
            >
              {/* Soft check glyph — past steps read as "done", current
                  as an outlined ring. No hard black dots. */}
              <span
                aria-hidden="true"
                className="flex h-[12px] w-[12px] flex-shrink-0 items-center justify-center"
              >
                {isPast ? (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    className="text-[#101010]/40"
                  >
                    <path
                      d="M2 5.2 L4.2 7.4 L8 3.4"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span
                    className={clsx(
                      "h-[7px] w-[7px] rounded-full border transition-colors duration-300",
                      isCurrent
                        ? "border-[#101010]/45"
                        : "border-[#101010]/20",
                    )}
                  />
                )}
              </span>
              {step}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Phase 2: Result — Studio sidebar with new On-Boarding draft ─────
//
// Mirrors the Figma reference (node 164:58865): a "BrandMages"
// workspace sidebar with core nav (Dashboard / CRM / Notifications /
// Automation), an Apps list where the freshly-generated "On-Boarding"
// app is highlighted as a Draft, and a Workspace section underneath.
// The main canvas is intentionally blank apart from a header strip —
// the narrative moment is "your new app just appeared in the
// sidebar", so the focus belongs there.

// Compact inline icon set keyed by name. Simple outline glyphs at
// 12px — Figma's icon assets are behind expiring URLs so we redraw
// equivalents.
const STUDIO_ICONS = {
  dashboard: (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M10.7 5.3 L9.1 9.1 L5.3 10.7 L6.9 6.9 Z" />
    </g>
  ),
  crm: (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="6" r="2.6" />
      <path d="M3 14c.8-2.4 2.7-3.6 5-3.6s4.2 1.2 5 3.6" />
    </g>
  ),
  bell: (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d="M4.2 11.3c.4-.8 1.3-1.5 1.3-3.3a2.5 2.5 0 0 1 5 0c0 1.8.9 2.5 1.3 3.3H4.2Z" />
      <path d="M7 13.5a1 1 0 0 0 2 0" />
    </g>
  ),
  bolt: (
    <path
      d="M9 2 L4.5 8.6 H7.6 L6.8 14 L11.5 7.2 H8.3 L9 2 Z"
      fill="currentColor"
    />
  ),
  clock: (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.6 6A6 6 0 1 1 2 8.2" />
      <path d="M2.6 3v3h3" />
    </g>
  ),
  plus: (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    >
      <path d="M8 3.5v9M3.5 8h9" />
    </g>
  ),
  gear: (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="2" />
      <path d="M8 1.8v1.6M8 12.6v1.6M14.2 8h-1.6M3.4 8H1.8M12.4 3.6l-1.1 1.1M4.7 11.3l-1.1 1.1M12.4 12.4l-1.1-1.1M4.7 4.7 3.6 3.6" />
    </g>
  ),
};

// Items in render order. `active: true` marks the row that should be
// highlighted (On-Boarding). `badge` shows a pill on the right.
// Section headers are emitted when an item's `sectionLabel` is set —
// the label renders above it.
// Full Studio sidebar per the Figma reference. The panel is rendered
// oversized relative to the card so the bottom items crop naturally
// — the sidebar feels like a slice of a real product surface rather
// than a squashed-to-fit summary.
const STUDIO_NAV = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "crm", label: "CRM", icon: "crm" },
  { id: "notifications", label: "Notifications", icon: "bell" },
  { id: "automation", label: "Automation", icon: "bolt" },
  { id: "app1", label: "App 1", icon: "dashboard", sectionLabel: "Apps" },
  { id: "app2", label: "App 2", icon: "crm" },
  { id: "app3", label: "App 3", icon: "bell" },
  { id: "app4", label: "App 4", icon: "bolt" },
  {
    id: "onboarding",
    label: "On-Boarding",
    icon: "clock",
    active: true,
    badge: "Draft",
  },
  { id: "add", label: "Add App", icon: "plus", muted: true },
  {
    id: "library",
    label: "App Library",
    icon: "dashboard",
    sectionLabel: "Workspace",
  },
  { id: "marketplace", label: "Marketplace", icon: "crm" },
  { id: "branding", label: "Branding", icon: "bell" },
  { id: "settings", label: "Settings", icon: "gear" },
];

const WIZARD_FIELDS = [
  { label: "Business name", value: "Acme Legal" },
  { label: "Industry", value: "Law firm" },
  { label: "Team size", value: "5–10 people" },
];

function ResultPhase({ active }) {
  const [revealCount, setRevealCount] = useState(0);
  const [badgeVisible, setBadgeVisible] = useState(false);
  const [wizardHeader, setWizardHeader] = useState(false);
  const [fieldCount, setFieldCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setRevealCount(0);
      setBadgeVisible(false);
      setWizardHeader(false);
      setFieldCount(0);
      return;
    }

    const timers = [];
    // Cascade the sidebar rows.
    STUDIO_NAV.forEach((_, i) => {
      timers.push(
        setTimeout(
          () => setRevealCount((c) => Math.max(c, i + 1)),
          120 + i * 55,
        ),
      );
    });
    // Badge pops in slightly after the On-Boarding row.
    const onboardingIndex = STUDIO_NAV.findIndex((n) => n.id === "onboarding");
    timers.push(
      setTimeout(
        () => setBadgeVisible(true),
        120 + onboardingIndex * 55 + 280,
      ),
    );
    // Wizard in the main canvas — header first, then fields.
    timers.push(setTimeout(() => setWizardHeader(true), 850));
    WIZARD_FIELDS.forEach((_, i) => {
      timers.push(
        setTimeout(
          () => setFieldCount((c) => Math.max(c, i + 1)),
          1100 + i * 170,
        ),
      );
    });

    return () => timers.forEach((t) => clearTimeout(t));
  }, [active]);

  return (
    // Oversized product surface. Anchored near the card's top-left so
    // it extends past the right and bottom edges — the outer card's
    // `overflow-hidden` crops it. Reads as a slice of a real Studio
    // workspace rather than a to-scale miniature.
    <div
      className={clsx(
        INNER_CARD,
        "absolute left-[5%] top-[8%] h-[130%] w-[120%] overflow-hidden rounded-tl-[14px] rounded-tr-[14px] rounded-br-0 rounded-bl-0 bg-white shadow-[0_20px_50px_-25px_rgba(16,16,16,0.35)]",
      )}
    >
      <div className="flex h-full">
        {/* Sidebar — matches Figma 164:58865. */}
        <div className="flex w-[200px] flex-shrink-0 flex-col gap-[6px] overflow-hidden border-r border-[#dfe1e4] bg-[#f8f9fb] px-2 pt-2.5">
          {/* Brand row */}
          <div
            className="flex items-center gap-2 rounded-[4px] px-2 py-1.5 transition-all duration-[400ms] ease-out"
            style={{
              opacity: revealCount > 0 ? 1 : 0,
              transform: `translateY(${revealCount > 0 ? 0 : -3}px)`,
            }}
          >
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[3px] bg-[#101010]">
              <svg
                width="10"
                height="10"
                viewBox="0 0 8 8"
                fill="none"
                aria-hidden="true"
              >
                <rect x="0.6" y="0.6" width="2.8" height="2.8" rx="0.4" fill="#fff" />
                <rect x="4.6" y="0.6" width="2.8" height="2.8" rx="0.4" fill="#fff" />
                <rect x="0.6" y="4.6" width="2.8" height="2.8" rx="0.4" fill="#fff" />
                <rect x="4.6" y="4.6" width="2.8" height="2.8" rx="0.4" fill="#fff" />
              </svg>
            </span>
            <span className="flex-1 text-[12px] font-medium text-[#212b36]">
              BrandMages
            </span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
              className="text-[#6b6f76]"
            >
              <path
                d="M2.5 4L5 6.5L7.5 4"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Nav rows with inlined section labels. */}
          {STUDIO_NAV.map((item, i) => {
            const shown = i < revealCount;
            const showBadge = item.badge && badgeVisible;
            return (
              <div key={item.id}>
                {item.sectionLabel && (
                  <div
                    className="mb-0.5 mt-1.5 px-2 text-[10px] font-medium text-[#6b6f76] transition-opacity duration-[400ms]"
                    style={{ opacity: shown ? 1 : 0 }}
                  >
                    {item.sectionLabel}
                  </div>
                )}
                <div
                  className={clsx(
                    "flex items-center gap-2 rounded-[4px] px-2 py-1 transition-all duration-[400ms] ease-out",
                    item.active && shown && "bg-[#e9ebee]",
                  )}
                  style={{
                    opacity: shown ? 1 : 0,
                    transform: `translateX(${shown ? 0 : -4}px)`,
                  }}
                >
                  <span
                    className={clsx(
                      "flex h-[16px] w-[16px] flex-shrink-0 items-center justify-center",
                      item.muted ? "text-[#6b6f76]" : "text-[#212b36]",
                    )}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16">
                      {STUDIO_ICONS[item.icon]}
                    </svg>
                  </span>
                  <span
                    className={clsx(
                      "flex-1 truncate text-[12px] leading-[16px]",
                      item.muted ? "text-[#6b6f76]" : "text-[#212b36]",
                    )}
                  >
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className="rounded-full bg-[#dfe1e4] px-1.5 py-[1px] text-[10px] font-medium leading-[14px] text-[#212b36] transition-all duration-[350ms] ease-out"
                      style={{
                        opacity: showBadge ? 1 : 0,
                        transform: `scale(${showBadge ? 1 : 0.85})`,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main canvas — onboarding wizard view. */}
        <div className="flex min-w-0 flex-1 flex-col bg-white">
          {/* Page header strip */}
          <div className="flex h-[36px] items-center border-b border-[#eef0f2] px-4">
            <span
              className="text-[11px] font-medium text-[#212b36] transition-opacity duration-[400ms]"
              style={{ opacity: wizardHeader ? 1 : 0 }}
            >
              On-Boarding
            </span>
            <span
              className="ml-2 rounded-full bg-[#f0f1f4] px-1.5 py-[1px] text-[9px] font-medium text-[#6b6f76] transition-opacity duration-[400ms]"
              style={{ opacity: wizardHeader ? 1 : 0 }}
            >
              Draft
            </span>
          </div>

          {/* Wizard body */}
          <div className="flex-1 px-6 py-5">
            <div
              className="transition-all duration-[500ms] ease-out"
              style={{
                opacity: wizardHeader ? 1 : 0,
                transform: `translateY(${wizardHeader ? 0 : 4}px)`,
              }}
            >
              <div className="mb-2 text-[10px] uppercase tracking-[0.08em] text-[#90959d]">
                Step 2 of 5
              </div>
              <div className="mb-4 flex gap-[3px]">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-[3px] flex-1 rounded-full transition-colors duration-[500ms]"
                    style={{
                      backgroundColor:
                        wizardHeader && i <= 1
                          ? "rgba(16,16,16,0.85)"
                          : "rgba(16,16,16,0.08)",
                    }}
                  />
                ))}
              </div>
              <div className="mb-4 text-[15px] font-semibold text-[#101010]">
                Tell us about your business
              </div>
            </div>

            <div className="space-y-2.5">
              {WIZARD_FIELDS.map((field, i) => {
                const shown = i < fieldCount;
                return (
                  <div
                    key={field.label}
                    className="transition-all duration-[500ms] ease-out"
                    style={{
                      opacity: shown ? 1 : 0,
                      transform: `translateY(${shown ? 0 : 4}px)`,
                    }}
                  >
                    <div className="mb-1 text-[10px] text-[#6b6f76]">
                      {field.label}
                    </div>
                    <div className="h-[30px] rounded-[4px] border border-[#eef0f2] bg-white px-2.5 text-[12px] leading-[30px] text-[#212b36]">
                      {field.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Top-level: drive phase progression, gate on in-view ──────────────
export function ThreeStepsVisual() {
  const [phase, setPhase] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  // In-view detection — scroll-listener fallback matches the rest of
  // the story visuals so it works inside the sticky story layout.
  useEffect(() => {
    if (!ref.current) return;
    const check = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const threshold = window.innerHeight * 0.85;
      if (rect.top < threshold && rect.bottom > 0) {
        setInView(true);
        window.removeEventListener("scroll", check);
      }
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  // Advance phases in a loop.
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      setPhase((p) => (p + 1) % 3);
    }, PHASE_DURATIONS[phase]);
    return () => clearTimeout(t);
  }, [phase, inView]);

  return (
    <div
      ref={ref}
      className="relative aspect-[3/2] w-full overflow-hidden rounded-[28px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]"
      style={{ backgroundImage: CARD_GRADIENT }}
    >
      {/* Input + Thinking share a centered slot; the Result phase
          renders at card scale so it can spill past the edges. */}
      <div className="absolute left-1/2 top-1/2 w-[82%] max-w-[460px] -translate-x-1/2 -translate-y-1/2">
        <div className="grid items-center [&>*]:col-start-1 [&>*]:row-start-1">
          <Phase visible={phase === 0}>
            <InputPhase active={inView && phase === 0} />
          </Phase>
          <Phase visible={phase === 1}>
            <ThinkingPhase active={inView && phase === 1} />
          </Phase>
        </div>
      </div>

      {/* Result phase sits on top of the whole card so it can
          anchor to the card's corner and overflow the right/bottom
          edges — the card's `overflow-hidden` crops the excess. */}
      <div
        aria-hidden={phase !== 2}
        className={clsx(
          "absolute inset-0 transition-[opacity,transform] duration-[600ms] ease-out",
          phase === 2
            ? "opacity-100 scale-100"
            : "pointer-events-none invisible scale-[0.985] opacity-0",
        )}
      >
        <ResultPhase active={inView && phase === 2} />
      </div>
    </div>
  );
}
