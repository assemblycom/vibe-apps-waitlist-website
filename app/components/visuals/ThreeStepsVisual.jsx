"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { PlayPauseToggle } from "./PlayPauseToggle";

// App-generation flow for the first value prop: a calm, curated
// animation that walks through describing an intake PDF, the model
// generating the app, and the resulting client experience coming
// alive. The outer card's gradient is preserved exactly — the
// animation sits on top of it.
//
// ── Shared type scale (Inter, applied via .font-inter on the root) ─────
//   hero    15px  — app/brand title (e.g. "BrandMages" in the result panel)
//   title   13px  — panel titles, primary buttons, prompt body
//   body    12px  — list items, tab labels, field input text
//   label   11px  — section labels, sidebar headers, file chip text
//   caption 10px  — field sub-labels ("Name", "Industry"), step badges
//   micro    9px  — (not used here; see ClientPortalVisual for dense rows)
// Shared with ClientPortalVisual.jsx so the two animations read as one
// family. Any new size needs to slot into this scale, not invent a new one.

const CARD_GRADIENT = [
  "linear-gradient(180deg, rgba(255,255,255,0) 12.397%, rgb(139,153,200) 74.611%, rgb(217,237,146) 100%)",
  "linear-gradient(90deg, rgb(255,255,255) 0%, rgb(255,255,255) 100%)",
].join(", ");

const PROMPT = "Turn this intake PDF into a digitized onboarding wizard";

const THINKING_STEPS = [
  "Reading the intake PDF",
  "Generating the client wizard",
  "Generating the internal admin view",
];

// Timing budget per phase (ms). Tuned so the viewer reads each beat
// without feeling rushed; the sum defines the loop length. Phase 2
// absorbs the brief loading-state beat that precedes the cascade.
const PHASE_DURATIONS = [6200, 5200, 6000];

// How long the Result phase shows its empty-shell loading state before
// the sidebar cascade starts populating. Sized to read as "app is
// rendering" without stalling the loop.
const RESULT_LOADING_MS = 800;

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
function InputPhase({ active, paused }) {
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
    if (paused) return; // Freeze choreography at current state.

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

    // Attach the PDF chip shortly after typing finishes, then arm the
    // button. Pulled forward by ~1s so the chip doesn't sit waiting in
    // the wings after the prompt completes.
    timers.push(setTimeout(() => !cancelled && setAttached(true), 2700));
    timers.push(setTimeout(() => !cancelled && setArmed(true), 3500));

    // Cursor appears after the button arms, glides into the button,
    // presses, releases — then the phase advances on its own clock.
    timers.push(setTimeout(() => !cancelled && setCursorPhase("moving"), 3750));
    timers.push(
      setTimeout(() => !cancelled && setCursorPhase("clicking"), 4650),
    );
    timers.push(setTimeout(() => !cancelled && setCursorPhase("done"), 4900));

    return () => {
      cancelled = true;
      timers.forEach((t) => clearTimeout(t));
    };
  }, [active, paused]);

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
function ThinkingPhase({ active, paused }) {
  const [currentStep, setCurrentStep] = useState(-1);

  useEffect(() => {
    if (!active) {
      setCurrentStep(-1);
      return;
    }
    // First entry into the phase — kick off at step 0.
    setCurrentStep((s) => (s < 0 ? 0 : s));
    if (paused) return; // Freeze at current step.
    // Tick one past the last step so the final row flips from circle
    // to checkmark before phase 2 begins.
    const id = setInterval(() => {
      setCurrentStep((s) => (s < THINKING_STEPS.length ? s + 1 : s));
    }, 920);
    return () => clearInterval(id);
  }, [active, paused]);

  return (
    <div className={clsx(INNER_CARD, "px-5 pb-7 pt-5")}>
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
              {/* Step indicator — checkmark for done, circle outline for
                  pending/current. Inlined so the glyph takes currentColor
                  (softer than the source SVGs' hard black). */}
              <span
                aria-hidden="true"
                className={clsx(
                  "flex h-[11px] w-[11px] flex-shrink-0 items-center justify-center transition-colors duration-300",
                  isPast && "text-[#101010]/45",
                  isCurrent && "text-[#101010]/55",
                  !isPast && !isCurrent && "text-[#101010]/25",
                )}
              >
                {isPast ? (
                  <svg
                    width="11"
                    height="10"
                    viewBox="0 0 11 10"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M10.2668 0.105509C10.5199 0.285978 10.5762 0.63754 10.3957 0.890666L4.2082 9.51567C4.11211 9.64926 3.96211 9.73598 3.79805 9.7477C3.63398 9.75942 3.46992 9.70317 3.35273 9.58598L0.165234 6.39848C-0.0550781 6.17817 -0.0550781 5.82192 0.165234 5.60395C0.385547 5.38598 0.741797 5.38363 0.959766 5.60395L3.68086 8.32035L9.48164 0.234416C9.66211 -0.0187095 10.0137 -0.0749595 10.2668 0.105509Z" />
                  </svg>
                ) : (
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 12 12"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M10.875 6C10.875 4.70707 10.3614 3.46709 9.44715 2.55285C8.53291 1.63861 7.29293 1.125 6 1.125C4.70707 1.125 3.46709 1.63861 2.55285 2.55285C1.63861 3.46709 1.125 4.70707 1.125 6C1.125 7.29293 1.63861 8.53291 2.55285 9.44715C3.46709 10.3614 4.70707 10.875 6 10.875C7.29293 10.875 8.53291 10.3614 9.44715 9.44715C10.3614 8.53291 10.875 7.29293 10.875 6ZM0 6C0 4.4087 0.632141 2.88258 1.75736 1.75736C2.88258 0.632141 4.4087 0 6 0C7.5913 0 9.11742 0.632141 10.2426 1.75736C11.3679 2.88258 12 4.4087 12 6C12 7.5913 11.3679 9.11742 10.2426 10.2426C9.11742 11.3679 7.5913 12 6 12C4.4087 12 2.88258 11.3679 1.75736 10.2426C0.632141 9.11742 0 7.5913 0 6Z" />
                  </svg>
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

// ── Phase 2: Result — Client sidebar with new On-Boarding draft ─────
//
// Client-side view: lime-branded sidebar with Client Home / Messages /
// On-Boarding (freshly-generated, highlighted) / Payments / Tasks /
// Other folder (Helpdesk and Schedule Call live inside). Onboarding is
// a top-level row because it's the narrative payoff — burying it under
// "Other" would hide what just got built. Main-canvas content is
// unchanged — the moment is still "your new app just appeared in the
// sidebar".

// Client-side sidebar palette — matches ClientPortalVisual so both
// animations share the same lime chrome.
const SIDEBAR_BG = "#d9ed92";
const SIDEBAR_ACTIVE_BG = "#f1f9d8";

// Client nav — Other is a folder; its children render indented.
// `iconSize` normalises visual weight across SVGs with different
// viewBoxes: clienthome.svg is 16×16 (glyph fills the whole box) while
// the rest are 20×20 (glyph sits inside ~2px padding). Rendering them
// all at the same pixel size would make the 16-box one look ~25%
// larger, so it gets a slightly smaller render size.
//
// The "Other" folder stays collapsed here — its children (Helpdesk,
// Schedule Call) aren't part of the Result-phase narrative, which is
// just "your freshly-generated Onboarding app appeared in the
// sidebar". Showing the folder's contents would pull attention away
// from that highlight.
// Badges mirror ClientPortalVisual's sidebar so the freshly-generated
// app reads as already wired into the client's notifications: 1
// onboarding step pending, 1 invoice open, 2 tasks to do. Messages has
// no badge — the welcome thread has been replied to.
const STUDIO_NAV = [
  { id: "home", label: "Home", icon: "/Icons/clienthome.svg", iconSize: 13 },
  { id: "messages", label: "Messages", icon: "/Icons/messages.svg" },
  {
    id: "onboarding",
    label: "Onboarding",
    icon: "/Icons/on-boarding.svg",
    active: true,
    badge: "1",
  },
  { id: "payments", label: "Payments", icon: "/Icons/payments.svg", badge: "1" },
  { id: "tasks", label: "Tasks", icon: "/Icons/tasks.svg", badge: "2" },
  { id: "other", label: "Other", icon: "/Icons/other.svg" },
];

const WIZARD_FIELDS = [
  { label: "Business name", value: "Acme Legal" },
  { label: "Industry", value: "Law firm" },
  { label: "Team size", value: "5–10 people" },
  { label: "Primary location", value: "New York, NY" },
];

function ResultPhase({ active, paused }) {
  const [ready, setReady] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const [badgeVisible, setBadgeVisible] = useState(false);
  const [wizardHeader, setWizardHeader] = useState(false);
  const [fieldCount, setFieldCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setReady(false);
      setRevealCount(0);
      setBadgeVisible(false);
      setWizardHeader(false);
      setFieldCount(0);
      return;
    }
    if (paused) return; // Freeze cascade at current reveal.

    const timers = [];
    // Brief loading-state beat: the empty app shell renders first with
    // a centered loader so the result reads as "the generated app is
    // opening" instead of appearing fully-formed.
    timers.push(setTimeout(() => setReady(true), RESULT_LOADING_MS));

    // Cascade the sidebar rows — offset by the loading beat.
    STUDIO_NAV.forEach((_, i) => {
      timers.push(
        setTimeout(
          () => setRevealCount((c) => Math.max(c, i + 1)),
          RESULT_LOADING_MS + 120 + i * 55,
        ),
      );
    });
    // Badge pops in slightly after the On-Boarding row.
    const onboardingIndex = STUDIO_NAV.findIndex((n) => n.id === "onboarding");
    timers.push(
      setTimeout(
        () => setBadgeVisible(true),
        RESULT_LOADING_MS + 120 + onboardingIndex * 55 + 280,
      ),
    );
    // Wizard in the main canvas — header first, then fields.
    timers.push(
      setTimeout(() => setWizardHeader(true), RESULT_LOADING_MS + 850),
    );
    WIZARD_FIELDS.forEach((_, i) => {
      timers.push(
        setTimeout(
          () => setFieldCount((c) => Math.max(c, i + 1)),
          RESULT_LOADING_MS + 1100 + i * 170,
        ),
      );
    });

    return () => timers.forEach((t) => clearTimeout(t));
  }, [active, paused]);

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
      {/* Loading overlay — matches the hero (HeroPromptToAppV19) shimmer
          treatment: each sidebar nav row is a single full-width
          rectangle (no separate icon block), and the wizard body is a
          stack of rectangles standing in for the resolved fields.
          rounded (4px) corners and the diagonal sweep keep it visually
          aligned with the hero's loading state. */}
      <div
        aria-hidden="true"
        className={clsx(
          "pointer-events-none absolute inset-0 z-10 flex bg-white transition-opacity duration-[450ms] ease-out",
          ready ? "opacity-0" : "opacity-100",
        )}
      >
        {/* Sidebar skeleton — one rectangle per real nav row, same
            geometry and spacing the resolved sidebar uses. */}
        <div
          className="flex w-[200px] flex-shrink-0 flex-col gap-[6px] px-2 pt-2.5"
          style={{ backgroundColor: SIDEBAR_BG }}
        >
          <div className="studio-shimmer mx-2 h-[26px] rounded" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="studio-shimmer mx-2 h-[26px] rounded" />
          ))}
        </div>
        {/* Main canvas skeleton — single uniform bar height across the
            body so the rhythm matches the sidebar instead of mixing
            thin labels with taller inputs. Width varies (heading
            narrower than form rows) to keep the hierarchy without
            breaking height cohesion. */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-[44px] items-center border-b border-[#eef0f2] px-6">
            <div className="studio-shimmer h-[14px] w-[88px] rounded" />
          </div>
          <div className="flex-1 space-y-3 px-6 py-5">
            <div className="studio-shimmer h-[24px] w-[60%] rounded" />
            {[0, 1, 2].map((i) => (
              <div key={i} className="studio-shimmer h-[24px] w-full rounded" />
            ))}
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Sidebar — lime-branded client view (matches
            ClientPortalVisual's chrome). */}
        <div
          className="flex w-[200px] flex-shrink-0 flex-col gap-[6px] overflow-hidden px-2 pt-2.5"
          style={{ backgroundColor: SIDEBAR_BG }}
        >
          {/* Brand row */}
          <div
            className="flex items-center gap-2 rounded-[4px] px-2 py-1.5 transition-all duration-[400ms] ease-out"
            style={{
              opacity: revealCount > 0 ? 1 : 0,
              transform: `translateY(${revealCount > 0 ? 0 : -3}px)`,
            }}
          >
            <img
              src="/logos/brandmages.svg"
              alt=""
              aria-hidden="true"
              width={18}
              height={18}
              className="h-[18px] w-[18px] flex-shrink-0 rounded-[3px]"
            />
            <span className="flex-1 text-[12px] font-medium text-[#212b36]">
              BrandMages
            </span>
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
                    "flex items-center gap-2 rounded-[4px] py-1 transition-all duration-[400ms] ease-out",
                    item.indented ? "ml-3.5 px-2" : "px-2",
                  )}
                  style={{
                    opacity: shown ? 1 : 0,
                    transform: `translateX(${shown ? 0 : -4}px)`,
                    backgroundColor:
                      item.active && shown ? SIDEBAR_ACTIVE_BG : "transparent",
                  }}
                >
                  <span
                    className={clsx(
                      "flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center",
                      item.muted ? "opacity-60" : "",
                    )}
                  >
                    <img
                      src={item.icon}
                      alt=""
                      aria-hidden="true"
                      width={item.iconSize ?? 16}
                      height={item.iconSize ?? 16}
                    />
                  </span>
                  <span
                    className={clsx(
                      "flex-1 truncate text-[12px] leading-[18px]",
                      item.muted ? "text-[#6b6f76]" : "text-[#212b36]",
                    )}
                  >
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className="flex h-[14px] min-w-[16px] flex-shrink-0 items-center justify-center rounded-[3px] bg-[#bdd180] px-1 text-[10px] font-medium leading-none text-[#2a3d0a] transition-all duration-[350ms] ease-out"
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
          <div className="flex h-[44px] items-center border-b border-[#eef0f2] px-6">
            <span
              className="text-[11px] font-medium text-[#212b36] transition-opacity duration-[400ms]"
              style={{ opacity: wizardHeader ? 1 : 0 }}
            >
              Onboarding
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
              {/* Progress — sentence-case meta label + one continuous
                  bar. Feels like a calm product screen instead of the
                  old caps-lock + segmented strip. */}
              <div className="mb-2 text-[11px] text-[#6b6f76]">
                Step 2 of 5
              </div>
              <div className="mb-4 h-[2px] w-full overflow-hidden rounded-full bg-[#101010]/[0.08]">
                <div
                  className="h-full rounded-full bg-[#101010]/85 transition-[width] duration-[600ms] ease-out"
                  style={{ width: wizardHeader ? "40%" : "0%" }}
                />
              </div>
              <div className="mb-4 text-[13px] font-medium tracking-[-0.005em] text-[#101010]">
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
  const [paused, setPaused] = useState(false);
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

  // Advance phases in a loop. Paused freezes the current phase.
  useEffect(() => {
    if (!inView || paused) return;
    const t = setTimeout(() => {
      setPhase((p) => (p + 1) % 3);
    }, PHASE_DURATIONS[phase]);
    return () => clearTimeout(t);
  }, [phase, inView, paused]);

  // Total loop duration — drives the progress ring's CSS keyframe so it
  // completes one full revolution per video loop.
  const loopMs = PHASE_DURATIONS.reduce((a, b) => a + b, 0);

  return (
    <div
      ref={ref}
      className="font-inter relative aspect-[3/2] w-full overflow-hidden rounded-[16px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] sm:rounded-[28px]"
      style={{ backgroundImage: CARD_GRADIENT }}
    >
      {/* Input + Thinking share a centered slot; the Result phase
          renders at card scale so it can spill past the edges. */}
      <div className="absolute left-1/2 top-1/2 w-[82%] max-w-[460px] -translate-x-1/2 -translate-y-1/2">
        <div className="grid items-center [&>*]:col-start-1 [&>*]:row-start-1">
          <Phase visible={phase === 0}>
            <InputPhase active={inView && phase === 0} paused={paused} />
          </Phase>
          <Phase visible={phase === 1}>
            <ThinkingPhase active={inView && phase === 1} paused={paused} />
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
        <ResultPhase active={inView && phase === 2} paused={paused} />
      </div>
      <PlayPauseToggle
        paused={paused}
        durationMs={loopMs}
        active={inView}
        onToggle={() => setPaused((p) => !p)}
      />
    </div>
  );
}
