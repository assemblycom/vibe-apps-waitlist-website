"use client";

// HeroPromptToAppV6 — prompt → useful app, slotted into a real branded
// client portal. Tuned for launch readiness around the latest round of
// feedback:
//
//   • Two visually separated panels with whitespace between them
//     (the prior shared frame + eyebrow chrome read as one big card).
//   • No "Describe an app" / "Client portal preview" labels — the
//     panels speak for themselves.
//   • Sidebar is just BrandMages → Home → Messages with new apps
//     slotting in below; no Built-in / Your apps section headers, no
//     "Add an app" placeholder row.
//   • Slot-in is the hero moment: bigger overshoot + brighter glow so
//     the "your app appears in the portal" beat lands hard.
//   • Higher-contrast surfaces against the dark page so the visual
//     stops feeling muted.

import { useEffect, useState } from "react";

// ── Icon helpers ──────────────────────────────────────────────────

function MaskIcon({ src, className = "h-[14px] w-[14px]" }) {
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

const StrokeIcon = ({ d, className = "h-3 w-3" }) => (
  <svg
    viewBox="0 0 16 16"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);
const ArrowIcon = (p) => <StrokeIcon {...p} d="M3 8h10M9 4l4 4-4 4" />;

// BrandMages mark — three stacked rounded shelves taken from
// /logos/brandmages-mark.svg. Inlined so the symbol can be painted in
// any currentColor and never drags along a background plate.
const BrandMagesMark = ({ className = "h-4 w-4" }) => (
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

// ── App definitions ──────────────────────────────────────────────

const APPS = [
  {
    id: "time",
    label: "Time Tracker",
    iconSrc: "/Icons/clock-three.svg",
    prompt:
      "Build a time tracker where the team can log work and associate it with clients",
    main: <TimeTrackerView />,
  },
  {
    id: "helpdesk",
    label: "Helpdesk",
    iconSrc: "/Icons/helpdesk.svg",
    prompt:
      "Build a helpdesk where clients can submit tickets and follow along for progress",
    main: <HelpdeskView />,
  },
  {
    id: "community",
    label: "Community",
    iconSrc: "/Icons/globe.svg",
    prompt:
      "Build a community where clients can post and interact with each other",
    main: <CommunityView />,
  },
];

const BUILT_IN = [
  { id: "home", label: "Home", iconSrc: "/Icons/clienthome.svg" },
  { id: "messages", label: "Messages", iconSrc: "/Icons/messages.svg" },
];

// ── Timing (ms within one cycle) ─────────────────────────────────
//
// Tuned so the slot-in moment dominates the cycle: shorter typing
// window so we get to SEND faster, then a longer FLY window for the
// row entrance to read as the centerpiece, then a generous HOLD so
// the resulting app stays on screen long enough to be readable.

const CYCLE_MS = 10500;
const TYPE_START = 400;
const TYPE_END = 3000;
const SEND = 3500;
const FLY_END = 5000;
const HOLD_END = 9500;
const RESET_PAUSE = 1800;

// ── Hooks ────────────────────────────────────────────────────────

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

// ── Sub-views (right-side main panel content per app) ────────────

function PanelHeader({ title }) {
  return (
    <div className="flex h-9 shrink-0 items-center gap-2 border-b border-white/[0.06] px-4">
      <span className="truncate text-[12px] font-medium text-white/85">
        {title}
      </span>
    </div>
  );
}

function HomeEmpty() {
  // Quiet Home — no CTA, no instructional copy. Just a placeholder
  // that occupies the canvas before the first app slots in. The
  // sidebar appearing alongside it carries the integration story; the
  // main view doesn't need to repeat it.
  return (
    <div className="flex h-full min-w-0 flex-col">
      <PanelHeader title="Home" />
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="text-[12.5px] font-medium text-white/55">
          BrandMages
        </div>
        <div className="mt-1 text-[10.5px] text-white/30">
          Your branded client portal
        </div>
      </div>
    </div>
  );
}

function TimeTrackerView() {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <PanelHeader title="Time Tracker" />
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
          <span className="whitespace-nowrap font-mono text-[18px] leading-none tracking-tight text-white/85">
            02:34:18
          </span>
        </div>
        <div className="space-y-1.5">
          {[
            { client: "Acme", task: "Brand sprint kickoff", time: "1h 20m" },
            { client: "Lyra", task: "Wireframe review", time: "0h 55m" },
          ].map((row, i) => (
            <div
              key={i}
              className="flex min-w-0 items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2"
            >
              <span className="shrink-0 text-[10.5px] font-medium text-white/80">
                {row.client}
              </span>
              <span className="shrink-0 text-[10.5px] text-white/45">·</span>
              <span className="min-w-0 flex-1 truncate text-[10.5px] text-white/65">
                {row.task}
              </span>
              <span className="shrink-0 whitespace-nowrap font-mono text-[10px] leading-none text-white/80">
                {row.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HelpdeskView() {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <PanelHeader title="Helpdesk" />
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        {[
          { client: "Acme", subject: "Logo file missing from latest delivery" },
          { client: "Lyra", subject: "Question about brand guideline section 3" },
        ].map((row, i) => (
          <div
            key={i}
            className="flex min-w-0 items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2"
          >
            <span className="shrink-0 text-[10.5px] font-medium text-white/80">
              {row.client}
            </span>
            <span className="shrink-0 text-[10.5px] text-white/45">·</span>
            <span className="min-w-0 flex-1 truncate text-[10.5px] text-white/65">
              {row.subject}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommunityView() {
  // Two posts. Avatars are first-letter chips so the chrome stays
  // self-contained (no extra image requests) but the row reads as a
  // forum/community thread rather than a generic list.
  return (
    <div className="flex h-full min-w-0 flex-col">
      <PanelHeader title="Community" />
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        {[
          {
            initial: "M",
            name: "Maya · Acme",
            body: "Anyone else seeing the new brand kit show up in their portal?",
            replies: "4 replies",
          },
          {
            initial: "J",
            name: "Jordan · Lyra",
            body: "Tip: paste your guideline section number in helpdesk for faster routing.",
            replies: "2 replies",
          },
        ].map((p, i) => (
          <div
            key={i}
            className="flex min-w-0 gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[10px] font-medium text-white/85">
              {p.initial}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[10.5px] font-medium text-white/80">
                {p.name}
              </span>
              <span className="truncate text-[10.5px] leading-[1.35] text-white/65">
                {p.body}
              </span>
              <span className="text-[9.5px] text-white/40">{p.replies}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Sidebar primitives ───────────────────────────────────────────

function SidebarRow({ iconSrc, label, active, muted, entryT }) {
  // entryT: 0..1 across the SEND → FLY_END window for the just-
  // installed row (null otherwise). This animation is the hero of
  // the visual — the "your app appears in the portal" moment — so
  // the overshoot is bigger and the glow brighter than a typical
  // list-enter. Built-in rows never receive entryT.
  let style = {};
  if (entryT !== null && entryT !== undefined) {
    let opacity = 0;
    let scale = 0.78;
    let glow = 0;
    if (entryT < 0.18) {
      opacity = 0;
      scale = 0.78;
    } else if (entryT < 0.42) {
      const p = (entryT - 0.18) / 0.24;
      opacity = p;
      scale = 0.78 + p * 0.28; // → 1.06 (overshoot)
      glow = p;
    } else if (entryT < 0.65) {
      const p = (entryT - 0.42) / 0.23;
      opacity = 1;
      scale = 1.06 - p * 0.06; // 1.06 → 1
      glow = 1;
    } else {
      const p = (entryT - 0.65) / 0.35;
      opacity = 1;
      scale = 1;
      glow = 1 - p;
    }
    style = {
      opacity,
      transform: `scale(${scale})`,
      // Brighter ring + drop so the slot-in moment carries the eye.
      boxShadow: `0 0 0 ${glow * 2}px rgba(255,255,255,${glow * 0.32}), 0 6px 22px rgba(255,255,255,${glow * 0.10})`,
    };
  }
  return (
    <div
      className={[
        "flex items-center gap-2 rounded-md px-2 py-2 text-[11px] leading-none transition-colors duration-300",
        active
          ? "bg-white/[0.09] text-white"
          : muted
          ? "text-white/55"
          : "text-white/75",
      ].join(" ")}
      style={style}
    >
      <MaskIcon src={iconSrc} className="h-3 w-3 shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────

export function HeroPromptToAppV6() {
  const now = useCycleClock();

  const totalMs = CYCLE_MS * APPS.length + RESET_PAUSE;
  const elapsed = now % totalMs;
  const inResetPause = elapsed >= CYCLE_MS * APPS.length;
  const cycleIndex = inResetPause
    ? APPS.length - 1
    : Math.floor(elapsed / CYCLE_MS);
  const cycleT = inResetPause ? CYCLE_MS : elapsed % CYCLE_MS;
  const app = APPS[cycleIndex];

  const sent = cycleT >= FLY_END;
  const promptText = typed(app.prompt, cycleT);
  const showCursor = cycleT >= TYPE_START && cycleT < SEND;

  // Sidebar fill: how many of APPS have been installed so far.
  let installed = cycleIndex;
  if (sent) installed = cycleIndex + 1;
  if (inResetPause) installed = APPS.length;

  // Just-installed row's entry progress (drives the pop + glow).
  const entryT =
    cycleT >= SEND && cycleT < FLY_END
      ? (cycleT - SEND) / (FLY_END - SEND)
      : cycleT >= FLY_END
      ? 1
      : null;

  // Building shimmer — kicks in the moment SEND fires and ramps out as
  // the real row/main fades in. Sidebar shimmer ends earlier than main
  // shimmer because the row visually "lands" first; the main view
  // crossfade trails by ~half the FLY window.
  let buildShimmerSidebar = 0;
  let buildShimmerMain = 0;
  if (cycleT >= SEND) {
    const winSidebar = (FLY_END - SEND) * 0.7;
    const winMain = FLY_END - SEND;
    buildShimmerSidebar = Math.max(0, 1 - (cycleT - SEND) / winSidebar);
    buildShimmerMain = Math.max(0, 1 - (cycleT - SEND) / winMain);
  }

  // Active app in main panel: the latest one that's been sent.
  const showHome = !sent && cycleIndex === 0;
  const activeApp = sent ? app : cycleIndex > 0 ? APPS[cycleIndex - 1] : null;

  return (
    <div aria-hidden="true" className="pointer-events-none relative w-full">
      {/* Single combined card. The two halves still read as distinct
          environments via internal bg shift (#0a0a0a builder vs.
          #0c0c0d portal) plus a thin divider, but they share one
          frame so the whole visual stays compact and on-brand for
          the dark page (no washed-out lifted greys). */}
      <div
        className="relative mx-auto w-full max-w-[1100px] overflow-hidden rounded-t-2xl border border-white/[0.11] bg-[#16171a] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]"
        style={{ height: "min(50vh, 480px)" }}
      >
        <div className="grid h-full grid-cols-[1fr_1.25fr] gap-0">
          {/* Left: prompt composer. No eyebrow header. Same surface
              color as the right portal — Linear-style, one unified
              card bg with the vertical divider doing the separation
              instead of a panel-bg shift. */}
          <div className="relative flex h-full min-w-0 flex-col border-r border-white/[0.09] bg-[#16171a]">
            <div className="flex min-w-0 flex-1 flex-col items-center px-6 pt-14 md:pt-16">
              <div className="w-full max-w-[320px]">
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2.5">
                  <div className="text-[13px] leading-[1.5] text-white/85">
                    {promptText || (
                      <span className="text-white/30">
                        Build a time tracker for my team…
                      </span>
                    )}
                    {showCursor && (
                      <span className="ml-[1px] inline-block h-[13px] w-[1px] -translate-y-[1px] animate-pulse bg-white/85 align-middle" />
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-end">
                    <span
                      className={[
                        "flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-300",
                        cycleT >= TYPE_END
                          ? "bg-white/25 text-white/95"
                          : "bg-white/10 text-white/55",
                      ].join(" ")}
                    >
                      <ArrowIcon className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: client portal. Same surface tone as the left half
              and the outer card — Linear-style flat dark — so the seam
              is carried by the vertical divider, not by stacking
              different shades of near-black against each other. */}
          <div className="relative flex h-full min-w-0 flex-col bg-[#16171a]">
            <div className="grid h-full min-h-0 grid-cols-[180px_1fr] gap-0">
              {/* Sidebar — flat list: BrandMages, Home, Messages,
                  installed apps. The slot-in motion carries the
                  integration story; no section headers needed. */}
              <div className="flex h-full min-w-0 flex-col border-r border-white/[0.05] p-3">
                <div className="mb-3 flex items-center gap-2 px-2 py-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/[0.08] text-white/85">
                    <BrandMagesMark className="h-3 w-3" />
                  </span>
                  <span className="truncate text-[12px] font-medium text-white/90">
                    BrandMages
                  </span>
                </div>

                <div className="space-y-1">
                  {BUILT_IN.map((b) => (
                    <SidebarRow
                      key={b.id}
                      iconSrc={b.iconSrc}
                      label={b.label}
                      muted
                    />
                  ))}
                  {APPS.slice(0, installed).map((a, i) => (
                    <SidebarRow
                      key={a.id}
                      iconSrc={a.iconSrc}
                      label={a.label}
                      active={activeApp && a.id === activeApp.id}
                      entryT={i === cycleIndex ? entryT : null}
                    />
                  ))}
                  {/* Building placeholder — sits in the next sidebar
                      slot during SEND→FLY_END so the operator can see
                      "an app is being assembled here" before the real
                      row pops in. Fades out as the row scales up. Only
                      rendered while there is still room (i.e. not on
                      the last app's reset pause). */}
                  {buildShimmerSidebar > 0 && installed < APPS.length && (
                    <div
                      style={{ opacity: buildShimmerSidebar }}
                      className="px-2 py-2"
                    >
                      <div className="hpv6-build-shimmer h-3 w-full rounded-md" />
                    </div>
                  )}
                </div>
              </div>

              {/* Main */}
              <div className="relative h-full min-w-0">
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{ opacity: showHome ? 1 : 0 }}
                >
                  <HomeEmpty />
                </div>
                {APPS.map((a) => {
                  const isActive =
                    !showHome && activeApp && a.id === activeApp.id;
                  return (
                    <div
                      key={a.id}
                      className="absolute inset-0 transition-opacity duration-500"
                      style={{ opacity: isActive ? 1 : 0 }}
                    >
                      {a.main}
                    </div>
                  );
                })}
                {/* Building shimmer over the main canvas. Reads as
                    "the new app is being assembled here" while the
                    sidebar row is still flying in. Fades out as the
                    real app view crossfades up. */}
                {buildShimmerMain > 0 && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-3"
                    style={{ opacity: buildShimmerMain }}
                  >
                    <div className="hpv6-build-shimmer h-full w-full rounded-lg" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
