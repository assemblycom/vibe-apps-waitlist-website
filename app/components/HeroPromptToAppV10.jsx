"use client";

// HeroPromptToAppV10 — calm, centered, premium.
//
// The earlier versions all leaned hard on a literal "IDE / portal"
// preview, which kept pulling the eye away from the headline and the
// email CTA. v10 strips that back: the hero is built around the
// headline + email composer, and the "app" is suggested rather than
// demonstrated — two or three minimal floating UI fragments orbit a
// quietly animated prompt composer underneath the CTA.
//
// The fragments aren't a full UI; they're shorthand:
//   • a sidebar-style nav chip on the left ("BrandMages → Helpdesk")
//   • a single app row card on the right (a ticket from the helpdesk)
// They cycle with the composer's prompt, so as the typewriter cycles
// from time tracker → helpdesk → community, the floating cards retag
// themselves accordingly. That's the whole "prompt → app" beat —
// nothing more.
//
// Mobile collapses to one moment: the composer alone, no floats.
// At lg+ the floats fade in around the composer with a subtle drift.

import { useEffect, useState } from "react";

// ── Icons ─────────────────────────────────────────────────────────

function MaskIcon({ src, className = "h-3.5 w-3.5" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block bg-current ${className}`}
      style={{
        WebkitMaskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskImage: `url(${src})`,
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
      }}
    />
  );
}

const BrandMagesMark = ({ className = "h-3.5 w-3.5" }) => (
  <svg
    viewBox="0 0 15 14"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M9.179 0H5.798C4.706 0 3.82.888 3.82 1.984v.007c0 1.096.886 1.984 1.978 1.984h3.381c1.092 0 1.978-.888 1.978-1.984v-.007C11.157.888 10.271 0 9.179 0Z" />
    <path d="M10.904 4.947H4.068c-1.093 0-1.978.888-1.978 1.984v.007c0 1.096.885 1.984 1.978 1.984h6.836c1.092 0 1.978-.888 1.978-1.984v-.007c0-1.096-.886-1.984-1.978-1.984Z" />
    <path d="M12.998 9.889H1.978C.886 9.889 0 10.777 0 11.873v.006c0 1.096.886 1.984 1.978 1.984h11.02c1.092 0 1.978-.888 1.978-1.984v-.006c0-1.096-.886-1.984-1.978-1.984Z" />
  </svg>
);

// ── App scenes — the prompt cycles through these ────────────────
//
// Each scene defines (a) the prompt the typewriter types and (b) the
// fragment content the floating cards swap to once the prompt sends.

const SCENES = [
  {
    id: "helpdesk",
    prompt:
      "Build a helpdesk where clients can submit tickets",
    sidebar: { label: "Helpdesk", iconSrc: "/Icons/helpdesk.svg" },
    row: {
      client: "Acme",
      title: "Logo file missing from latest delivery",
    },
  },
  {
    id: "time",
    prompt: "Build a time tracker for the team",
    sidebar: { label: "Time Tracker", iconSrc: "/Icons/clock-three.svg" },
    row: { client: "Lyra", title: "Wireframe review · 0h 55m" },
  },
  {
    id: "community",
    prompt: "Build a community for our clients",
    sidebar: { label: "Community", iconSrc: "/Icons/globe.svg" },
    row: {
      client: "Pine",
      title: "Anyone using the new brand kit yet?",
    },
  },
];

// ── Cycle clock ──────────────────────────────────────────────────

const CYCLE_MS = 6800;
const TYPE_START = 350;
const TYPE_END = 2400;
const SEND = 2900;
const HOLD_END = 6300;

function useCycleClock() {
  const [now, setNow] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = () => {
      setNow(performance.now() - start);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return now;
}

function typed(text, t) {
  if (t <= TYPE_START) return "";
  if (t >= TYPE_END) return text;
  const progress = (t - TYPE_START) / (TYPE_END - TYPE_START);
  const eased = 1 - Math.pow(1 - progress, 1.4);
  const chars = Math.floor(eased * text.length);
  return text.slice(0, chars);
}

// Smooth 0→1→0 ease for "fade-in, hold, fade-out" of the floating
// fragments around each prompt.
function floatProgress(cycleT) {
  // Fade IN starts at SEND, takes ~500ms.
  // Fade OUT starts at HOLD_END, takes ~400ms.
  if (cycleT < SEND) return 0;
  if (cycleT < SEND + 500) return (cycleT - SEND) / 500;
  if (cycleT < HOLD_END) return 1;
  if (cycleT < HOLD_END + 400) return 1 - (cycleT - HOLD_END) / 400;
  return 0;
}

// ── Floating fragments ───────────────────────────────────────────

function SidebarChip({ scene, opacity, drift }) {
  return (
    <div
      className="pointer-events-none flex items-center gap-2.5 rounded-2xl border bg-white/85 px-3 py-2 backdrop-blur-md"
      style={{
        opacity,
        transform: `translate3d(${drift}px, ${-drift * 0.3}px, 0)`,
        transition: "opacity 220ms linear",
        borderColor: "rgba(16,16,16,0.08)",
        boxShadow:
          "0 4px 14px -8px rgba(0,0,0,0.18), 0 24px 48px -28px rgba(0,0,0,0.35)",
      }}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#101010]/[0.06] text-[#101010]/80">
        <BrandMagesMark className="h-3 w-3" />
      </span>
      <span className="text-[12px] font-medium text-[#101010]/85 whitespace-nowrap">
        BrandMages
      </span>
      <span className="text-[#101010]/30">/</span>
      <span className="flex items-center gap-1.5 rounded-md bg-[#101010]/[0.06] px-2 py-1 text-[#101010]/85">
        <MaskIcon src={scene.sidebar.iconSrc} className="h-3 w-3" />
        <span className="text-[11.5px] font-medium whitespace-nowrap">
          {scene.sidebar.label}
        </span>
      </span>
    </div>
  );
}

function AppRowCard({ scene, opacity, drift }) {
  return (
    <div
      className="pointer-events-none flex w-[260px] flex-col gap-2 rounded-2xl border bg-white/85 px-4 py-3 backdrop-blur-md"
      style={{
        opacity,
        transform: `translate3d(${drift}px, ${-drift * 0.3}px, 0)`,
        transition: "opacity 220ms linear",
        borderColor: "rgba(16,16,16,0.08)",
        boxShadow:
          "0 4px 14px -8px rgba(0,0,0,0.18), 0 24px 48px -28px rgba(0,0,0,0.35)",
      }}
    >
      <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#101010]/40">
        New ticket
      </span>
      <div className="flex items-center gap-2 min-w-0">
        <span className="shrink-0 text-[12px] font-medium text-[#101010]/85">
          {scene.row.client}
        </span>
        <span className="shrink-0 text-[#101010]/30">·</span>
        <span className="min-w-0 flex-1 truncate text-[12px] text-[#101010]/65">
          {scene.row.title}
        </span>
      </div>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────

export function HeroPromptToAppV10() {
  const now = useCycleClock();

  const totalMs = CYCLE_MS * SCENES.length;
  const elapsed = now % totalMs;
  const sceneIndex = Math.floor(elapsed / CYCLE_MS);
  const cycleT = elapsed % CYCLE_MS;
  const scene = SCENES[sceneIndex];

  const promptText = typed(scene.prompt, cycleT);
  const showCursor = cycleT >= TYPE_START && cycleT < SEND;

  const fp = floatProgress(cycleT);
  // Tiny inward drift on the way in / outward on the way out — gives
  // the floats a sense of "settling toward the composer" without ever
  // becoming busy.
  const drift = (1 - fp) * 12;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative mx-auto w-full max-w-[1080px] px-4 pt-6 pb-24 md:pt-10 md:pb-32 lg:pt-2 lg:pb-20"
    >
      {/* Centered composer column. The composer is THE focal element;
          floats sit absolutely around it on lg+. */}
      <div className="relative mx-auto flex w-full max-w-[560px] flex-col items-center">
        {/* ── Floating fragments (lg+ only) ─────────────────────
            Positioned absolutely relative to the composer column so
            they read as "orbiting" the prompt. Hidden on mobile to
            keep the layout to one focal moment. ──────────────────── */}
        <div
          className="pointer-events-none absolute -left-[230px] top-[6px] hidden lg:block"
          style={{ opacity: fp }}
        >
          <SidebarChip scene={scene} opacity={fp} drift={-drift} />
        </div>
        <div
          className="pointer-events-none absolute -right-[230px] top-[64px] hidden lg:block"
          style={{ opacity: fp }}
        >
          <AppRowCard scene={scene} opacity={fp} drift={drift} />
        </div>

        {/* ── Prompt composer ─────────────────────────────────── */}
        <div
          className="relative w-full rounded-[24px] border px-6 py-5"
          style={{
            background: "rgba(255,255,255,0.82)",
            borderColor: "rgba(16,16,16,0.08)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            boxShadow:
              "0 4px 16px -10px rgba(0,0,0,0.18), 0 40px 80px -32px rgba(0,0,0,0.35)",
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#101010]/45">
              Describe your app
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#101010] text-white">
              <svg
                viewBox="0 0 16 16"
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </span>
          </div>
          <div className="min-h-[28px] text-[16px] leading-[1.45] text-[#101010]/90">
            {promptText || (
              <span className="text-[#101010]/35">
                Build a helpdesk where clients can submit tickets…
              </span>
            )}
            {showCursor && (
              <span className="ml-[1px] inline-block h-[16px] w-[1.5px] -translate-y-[1px] animate-pulse bg-[#101010]/85 align-middle" />
            )}
          </div>
        </div>

        {/* Subtle ambient glow — the composer reads as a lit object
            on the gradient instead of a flat card. */}
        <div
          className="pointer-events-none absolute -inset-16 -z-10 rounded-[40px]"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(180,200,255,0.22) 0%, rgba(180,200,255,0) 70%)",
            filter: "blur(24px)",
          }}
        />
      </div>
    </div>
  );
}
