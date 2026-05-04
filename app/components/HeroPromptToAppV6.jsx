"use client";

// HeroPromptToAppV6 — prompt → useful app, dropped into a real branded
// client portal (not a standalone tool).
//
// Built on v3's split layout, tuned around the feedback that v3 was
// "closest to working" but didn't convey two things sharply enough:
//
//   1. Building an app is *simple* — a single prompt, a useful app.
//   2. The app *integrates* into a client experience that already
//      exists (vs. shipping as another standalone tool).
//
// To address (1): one slow, deliberate beat per app cycle, with cleaner
// section labels ("Describe an app" / "Already part of your client
// portal") and a connector line that traces the prompt → portal moment.
//
// To address (2): the portal sidebar starts populated with built-in
// apps (Home, Messages, Files) under a faint "Built-in" group label.
// New apps land in a separate "Your apps" group below, making it
// obvious that what you build slots in alongside Assembly's primitives
// rather than living off on its own URL.

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
const PlayIcon = (p) => <StrokeIcon {...p} d="M5 3.5l7 4.5-7 4.5z" />;

// ── App definitions (the three things that get built) ────────────

const APPS = [
  {
    id: "time",
    label: "Time Tracker",
    iconSrc: "/Icons/clock-three.svg",
    prompt: "Build a time tracker so the team can log hours per client.",
    main: <TimeTrackerView />,
  },
  {
    id: "helpdesk",
    label: "Helpdesk",
    iconSrc: "/Icons/helpdesk.svg",
    prompt: "Build a helpdesk where clients can submit support tickets.",
    main: <HelpdeskView />,
  },
  {
    id: "payments",
    label: "Payments",
    iconSrc: "/Icons/payments.svg",
    prompt: "Build a payments dashboard with invoices and statuses.",
    main: <PaymentsView />,
  },
];

// Built-in apps live in the portal from day one. They render at half
// opacity in the sidebar with a faint "Built-in" group label so the
// viewer reads them as Assembly primitives the new app slots in next
// to (vs. blank chrome a standalone tool would otherwise replace).
// Two rows is plenty to convey 'already populated' without piling up
// chrome on the right side.
const BUILT_IN = [
  { id: "home", label: "Home", iconSrc: "/Icons/clienthome.svg" },
  { id: "messages", label: "Messages", iconSrc: "/Icons/messages.svg" },
];

// ── Timing (ms within one cycle) ─────────────────────────────────
//
// One cycle is intentionally slower than v3 so the moment reads
// "prompt → built → installed" instead of a busy loop. Phases:
//
//   TYPE_START..TYPE_END  — prompt types out
//   TYPE_END..SEND        — armed, hold for a beat
//   SEND..FLY_END         — connector trail lights up, app lands
//                            in the sidebar with a soft pulse
//   FLY_END..HOLD_END     — settle, main panel shows the app
//   HOLD_END..CYCLE_MS    — quiet beat before the next cycle

const CYCLE_MS = 11000;
const TYPE_START = 400;
const TYPE_END = 3300;
const SEND = 3900;
const FLY_END = 5000;
const HOLD_END = 10000;
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
  return (
    <div className="flex h-full min-w-0 flex-col">
      <PanelHeader title="Home" />
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-8 text-center">
        <div className="text-[13px] font-medium text-white/85">
          Welcome to BrandMages
        </div>
        <div className="max-w-[240px] text-[11px] leading-[1.5] text-white/45">
          Your branded client portal. New apps your team builds will appear in
          the sidebar.
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
        <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.1] bg-white/[0.04] p-3">
          <span className="whitespace-nowrap font-mono text-[18px] leading-none tracking-tight text-white/95">
            02:34:18
          </span>
          <span className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
            <PlayIcon className="h-3 w-3" />
          </span>
        </div>
        <div className="space-y-1.5">
          {[
            { client: "Acme", task: "Brand sprint kickoff", time: "1h 20m" },
            { client: "Lyra", task: "Wireframe review", time: "0h 55m" },
          ].map((row, i) => (
            <div
              key={i}
              className="flex min-w-0 items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-1.5"
            >
              <span className="shrink-0 text-[10.5px] font-medium text-white/85">
                {row.client}
              </span>
              <span className="shrink-0 text-[10.5px] text-white/45">·</span>
              <span className="min-w-0 flex-1 truncate text-[10.5px] text-white/70">
                {row.task}
              </span>
              <span className="shrink-0 whitespace-nowrap font-mono text-[10px] leading-none text-white/85">
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
            className="flex min-w-0 items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2"
          >
            <span className="shrink-0 text-[10.5px] font-medium text-white/85">
              {row.client}
            </span>
            <span className="shrink-0 text-[10.5px] text-white/45">·</span>
            <span className="min-w-0 flex-1 truncate text-[10.5px] text-white/70">
              {row.subject}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentsView() {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <PanelHeader title="Payments" />
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Outstanding", value: "$24.8k" },
            { label: "Paid", value: "$12.1k" },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2"
            >
              <div className="text-[9.5px] text-white/45">{s.label}</div>
              <div className="font-mono text-[14px] text-white/95">{s.value}</div>
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          {[
            { client: "Acme", id: "INV-204", amount: "$12,400" },
            { client: "Lyra", id: "INV-205", amount: "$8,600" },
          ].map((row, i) => (
            <div
              key={i}
              className="flex min-w-0 items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-1.5"
            >
              <span className="shrink-0 text-[10.5px] font-medium text-white/85">
                {row.client}
              </span>
              <span className="shrink-0 font-mono text-[10px] text-white/45">
                {row.id}
              </span>
              <span className="ml-auto shrink-0 whitespace-nowrap font-mono text-[10.5px] text-white/95">
                {row.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Sidebar primitives ───────────────────────────────────────────

function GroupLabel({ children }) {
  return (
    <div className="px-2 pb-1 pt-2 text-[10px] text-white/30">
      {children}
    </div>
  );
}

function SidebarRow({ iconSrc, label, active, muted, entryT }) {
  // entryT: 0..1 over the fly-in window (null when settled). The new
  // row pops in with a brief overshoot + soft glow so the eye knows
  // where to land. Built-in rows never enter — they're always there.
  let style = {};
  if (entryT !== null && entryT !== undefined) {
    let opacity = 0;
    let scale = 0.85;
    let glow = 0;
    if (entryT < 0.2) {
      opacity = 0;
      scale = 0.85;
    } else if (entryT < 0.45) {
      const p = (entryT - 0.2) / 0.25;
      opacity = p;
      scale = 0.85 + p * 0.18; // → 1.03
      glow = p;
    } else if (entryT < 0.7) {
      const p = (entryT - 0.45) / 0.25;
      opacity = 1;
      scale = 1.03 - p * 0.03; // 1.03 → 1
      glow = 1;
    } else {
      const p = (entryT - 0.7) / 0.3;
      opacity = 1;
      scale = 1;
      glow = 1 - p;
    }
    style = {
      opacity,
      transform: `scale(${scale})`,
      boxShadow: `0 0 0 ${glow * 1.5}px rgba(255,255,255,${glow * 0.18}), 0 4px 14px rgba(255,255,255,${glow * 0.06})`,
    };
  }
  return (
    <div
      className={[
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] leading-none transition-colors duration-300",
        active
          ? "bg-white/[0.07] text-white/95"
          : muted
          ? "text-white/45"
          : "text-white/70",
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

  const sending = cycleT >= SEND && cycleT < FLY_END;
  const sent = cycleT >= FLY_END;
  const promptText = typed(app.prompt, cycleT);
  const showCursor = cycleT >= TYPE_START && cycleT < SEND;

  // Sidebar fill: how many of APPS have already been "installed".
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

  // Active app in main panel: the latest one that's been sent.
  // Before the very first app sends we show the Home empty state so
  // the right side reads as a fresh portal that hasn't grown yet.
  const showHome = !sent && cycleIndex === 0;
  const activeApp = sent ? app : cycleIndex > 0 ? APPS[cycleIndex - 1] : null;

  // Connector trail — a quiet horizontal line that lights up between
  // the prompt card and the sidebar during the send window. Reads as
  // "the prompt becomes a row in the portal" without any extra copy.
  const trailOpacity = sending
    ? Math.sin(((cycleT - SEND) / (FLY_END - SEND)) * Math.PI) * 0.9
    : 0;

  return (
    <div aria-hidden="true" className="pointer-events-none relative w-full">
      <div
        className="relative mx-auto w-full max-w-[1100px] overflow-hidden rounded-t-2xl border border-white/[0.09] bg-[#0e0e0f]"
        style={{ height: "min(56vh, 540px)" }}
      >
        <div className="grid h-full grid-cols-[1fr_1.25fr] gap-0">
          {/* Left: prompt composer. Kept slightly darker than the right
              portal panel so the two surfaces read as distinct
              environments (builder vs. deployed portal). */}
          <div className="relative flex h-full min-w-0 flex-col border-r border-white/[0.09] bg-[#0f1012]">
            <div className="flex h-9 shrink-0 items-center gap-2 border-b border-white/[0.06] px-4">
              <span className="text-[11px] font-medium text-white/55">
                Describe an app
              </span>
            </div>

            <div className="flex min-w-0 flex-1 flex-col items-center px-6 pt-12">
              <div className="w-full max-w-[360px]">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
                  <div className="min-h-[68px] text-[13px] leading-[1.5] text-white/85">
                    {promptText || (
                      <span className="text-white/30">
                        e.g. Build a time tracker for my team
                      </span>
                    )}
                    {showCursor && (
                      <span className="ml-[1px] inline-block h-[13px] w-[1px] -translate-y-[1px] animate-pulse bg-white/85 align-middle" />
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-end">
                    <span
                      className={[
                        "flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-300",
                        cycleT >= TYPE_END
                          ? "bg-white text-black"
                          : "bg-white/10 text-white/55",
                      ].join(" ")}
                    >
                      <ArrowIcon className="h-3 w-3" />
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-center text-[10.5px] text-white/35">
                  One prompt. A working app, deployed to your client portal.
                </div>
              </div>
            </div>
          </div>

          {/* Right: client portal — always populated with built-in apps.
              Lifted bg (#17181a, matches v5) for higher contrast against
              the darker left builder panel and the page behind it, so
              the portal reads as a distinct, lit-up surface. */}
          <div className="relative flex h-full min-w-0 flex-col bg-[#17181a]">
            <div className="flex h-9 shrink-0 items-center gap-2 border-b border-white/[0.06] px-4">
              <span className="text-[11px] font-medium text-white/55">
                Client portal preview
              </span>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-[170px_1fr] gap-0">
              {/* Sidebar */}
              <div className="flex h-full min-w-0 flex-col border-r border-white/[0.05] p-3">
                <div className="mb-2 flex items-center gap-2 px-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/10 text-[10px] font-semibold text-white/85">
                    B
                  </span>
                  <span className="truncate text-[11px] font-medium text-white/85">
                    BrandMages
                  </span>
                </div>

                <GroupLabel>Built-in</GroupLabel>
                <div className="space-y-0.5">
                  {BUILT_IN.map((b) => (
                    <SidebarRow
                      key={b.id}
                      iconSrc={b.iconSrc}
                      label={b.label}
                      muted
                    />
                  ))}
                </div>

                <GroupLabel>Your apps</GroupLabel>
                <div className="space-y-0.5">
                  {installed === 0 && (
                    <div className="px-2 py-1 text-[10px] italic leading-[1.4] text-white/25">
                      Apps you build appear here
                    </div>
                  )}
                  {APPS.slice(0, installed).map((a, i) => (
                    <SidebarRow
                      key={a.id}
                      iconSrc={a.iconSrc}
                      label={a.label}
                      active={activeApp && a.id === activeApp.id}
                      entryT={i === cycleIndex ? entryT : null}
                    />
                  ))}
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
              </div>
            </div>
          </div>
        </div>

        {/* Connector trail — soft horizontal line that lights up during
            the send window, visually narrating "prompt becomes a row in
            the portal sidebar." Sits at roughly the prompt-card's
            vertical center, only visible during the fly-in. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0"
          style={{
            top: "47%",
            height: 1,
            background:
              "linear-gradient(90deg, transparent 18%, rgba(255,255,255,0.55) 50%, transparent 82%)",
            opacity: trailOpacity,
            transition: "opacity 200ms ease-out",
          }}
        />
      </div>
    </div>
  );
}
