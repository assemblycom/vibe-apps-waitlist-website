"use client";

// HeroPromptToAppV4 — v3 with separation, beefier fly-in, fixed empty state.
//
// Two visually distinct cards (own chrome, real gap between them) so the
// client portal reads as a standalone product, not a sub-panel of the
// builder. Before the first prompt completes, the portal shows a clean
// Home empty state — never a half-rendered app. The fly-in itself is
// more dramatic: the prompt card travels further, the new sidebar row
// scales in with a brief highlight pulse.

import { useEffect, useState } from "react";

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

// ── Sub-views ─────────────────────────────────────────────────────

function PanelHeader({ title, trailing }) {
  return (
    <div className="flex h-9 shrink-0 items-center gap-2 border-b border-white/[0.06] px-4">
      <span className="truncate text-[12px] font-medium text-white/85">
        {title}
      </span>
      {trailing && (
        <span className="ml-auto whitespace-nowrap rounded-full border border-white/15 px-2 py-[2px] text-[10px] text-white/55">
          {trailing}
        </span>
      )}
    </div>
  );
}

function HomeEmpty() {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <PanelHeader title="Home" />
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.04] text-white/55"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3l9 7-1 1-2-1.5V20H6v-9.5L4 12l-1-1 9-8z" />
          </svg>
        </span>
        <div className="text-[13.5px] font-medium text-white/85">
          Welcome back
        </div>
        <div className="max-w-[220px] text-[11px] leading-[1.5] text-white/45">
          Apps your team builds will appear in your sidebar.
        </div>
      </div>
    </div>
  );
}

function TimeTrackerView() {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <PanelHeader title="Time Tracker" trailing="This week" />
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
          <span className="whitespace-nowrap font-mono text-[18px] leading-none tracking-tight text-white/85">
            02:34:18
          </span>
          <span className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-white/85">
            <PlayIcon className="h-3 w-3" />
          </span>
        </div>
        <div className="space-y-1.5">
          {[
            { client: "Acme", task: "Brand sprint kickoff", time: "1h 20m" },
            { client: "Lyra", task: "Wireframe review", time: "0h 55m" },
            { client: "Acme", task: "Design QA", time: "1h 57m" },
          ].map((row, i) => (
            <div
              key={i}
              className="flex min-w-0 items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.015] px-3 py-1.5"
            >
              <span className="shrink-0 text-[10.5px] font-medium text-white/80">
                {row.client}
              </span>
              <span className="shrink-0 text-[10.5px] text-white/45">·</span>
              <span className="min-w-0 flex-1 truncate text-[10.5px] text-white/65">
                {row.task}
              </span>
              <span className="shrink-0 whitespace-nowrap font-mono text-[10px] leading-none text-white/75">
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
      <PanelHeader title="Helpdesk" trailing="Open" />
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        {[
          { client: "Acme", subject: "Logo file missing from latest delivery", state: "Open", tone: "open" },
          { client: "Lyra", subject: "Question about brand guideline section 3", state: "Open", tone: "open" },
          { client: "Northwind", subject: "Final asset bundle approved", state: "Closed", tone: "closed" },
        ].map((row, i) => (
          <div
            key={i}
            className="flex min-w-0 items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.015] px-3 py-2"
          >
            <span className="shrink-0 text-[10.5px] font-medium text-white/80">
              {row.client}
            </span>
            <span className="shrink-0 text-[10.5px] text-white/45">·</span>
            <span className="min-w-0 flex-1 truncate text-[10.5px] text-white/65">
              {row.subject}
            </span>
            <span
              className={
                row.tone === "open"
                  ? "shrink-0 whitespace-nowrap rounded-full border border-white/25 bg-white/[0.06] px-2 py-[1px] text-[9.5px] text-white/80"
                  : "shrink-0 whitespace-nowrap rounded-full border border-white/10 px-2 py-[1px] text-[9.5px] text-white/45"
              }
            >
              {row.state}
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
      <PanelHeader title="Payments" trailing="This month" />
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Outstanding", value: "$24.8k" },
            { label: "Paid", value: "$12.1k" },
            { label: "Drafts", value: "3" },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
            >
              <div className="text-[9.5px] text-white/45">{s.label}</div>
              <div className="font-mono text-[14px] text-white/85">{s.value}</div>
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          {[
            { client: "Acme", id: "INV-204", amount: "$12,400", state: "Paid", tone: "paid" },
            { client: "Lyra", id: "INV-205", amount: "$8,600", state: "Pending", tone: "pending" },
            { client: "Northwind", id: "INV-206", amount: "$3,800", state: "Draft", tone: "draft" },
          ].map((row, i) => (
            <div
              key={i}
              className="flex min-w-0 items-center gap-2 rounded-lg border border-white/[0.05] bg-white/[0.015] px-3 py-1.5"
            >
              <span className="shrink-0 text-[10.5px] font-medium text-white/80">
                {row.client}
              </span>
              <span className="shrink-0 font-mono text-[10px] text-white/45">
                {row.id}
              </span>
              <span className="ml-auto shrink-0 whitespace-nowrap font-mono text-[10.5px] text-white/85">
                {row.amount}
              </span>
              <span
                className={
                  row.tone === "paid"
                    ? "shrink-0 whitespace-nowrap rounded-full border border-white/25 bg-white/[0.06] px-2 py-[1px] text-[9.5px] text-white/80"
                    : row.tone === "pending"
                    ? "shrink-0 whitespace-nowrap rounded-full border border-white/15 bg-white/[0.03] px-2 py-[1px] text-[9.5px] text-white/65"
                    : "shrink-0 whitespace-nowrap rounded-full border border-white/10 px-2 py-[1px] text-[9.5px] text-white/45"
                }
              >
                {row.state}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── App definitions ───────────────────────────────────────────────

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

// ── Timing (ms within one cycle) ──────────────────────────────────

const CYCLE_MS = 10500;
const TYPE_START = 300;
const TYPE_END = 2700;
const SEND = 3100;
// Message-send pattern:
//  • SEND..LOADING_END: bubble shows three pulsing dots beneath the
//    prompt — the "AI is generating" beat.
//  • LOADING_END..SHIMMER_END: a diagonal shimmer sweeps across the
//    portal panel and at the same time the sidebar entry pops in and
//    the main panel cross-fades. By the end of the shimmer everything
//    has updated.
//  • TEXT_FADE_START..CYCLE_MS: bubble text gently fades out so the
//    next cycle starts from a clean bubble.
const LOADING_END = 3800;
const SHIMMER_END = 4600;
const UPDATE_END = 4600; // sidebar + main settle by here
const TEXT_FADE_START = 8800;
const RESET_PAUSE = 1800;

// ── Hook: cycle clock ─────────────────────────────────────────────

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

// ── Utility: typewriter substring ─────────────────────────────────

function typed(text, t) {
  if (t <= TYPE_START) return "";
  if (t >= TYPE_END) return text;
  const progress = (t - TYPE_START) / (TYPE_END - TYPE_START);
  const eased = 1 - Math.pow(1 - progress, 1.4);
  const chars = Math.floor(eased * text.length);
  return text.slice(0, chars);
}

// ── Sidebar primitives ────────────────────────────────────────────

function SidebarRow({ iconSrc, label, active, entryT }) {
  // entryT: 0 → 1 over the entry window; null/undefined when settled.
  // Phases inside the entry window:
  //   0   .. 0.40 — invisible (the bubble is still in flight)
  //   0.40.. 0.55 — pop in: opacity 0→1, scale 0.7 → 1.06 (overshoot)
  //   0.55.. 0.75 — settle: scale 1.06 → 1, glow brightest
  //   0.75.. 1    — glow fades to nothing
  const entering = entryT !== null && entryT !== undefined;
  let style = {};
  if (entering) {
    let opacity = 0;
    let scale = 0.7;
    let glow = 0;
    if (entryT < 0.4) {
      opacity = 0;
      scale = 0.7;
    } else if (entryT < 0.55) {
      const p = (entryT - 0.4) / 0.15;
      opacity = p;
      scale = 0.7 + p * 0.36; // → 1.06
      glow = p;
    } else if (entryT < 0.75) {
      const p = (entryT - 0.55) / 0.2;
      opacity = 1;
      scale = 1.06 - p * 0.06; // 1.06 → 1
      glow = 1;
    } else {
      const p = (entryT - 0.75) / 0.25;
      opacity = 1;
      scale = 1;
      glow = 1 - p;
    }
    style = {
      opacity,
      transform: `scale(${scale})`,
      boxShadow: `0 0 0 ${glow * 2}px rgba(255,255,255,${glow * 0.22}), 0 6px 20px rgba(255,255,255,${glow * 0.06})`,
    };
  }
  return (
    <div
      className={[
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] leading-none transition-all",
        active ? "bg-white/[0.07] text-white/95" : "text-white/65",
      ].join(" ")}
      style={style}
    >
      <MaskIcon src={iconSrc} className="h-3 w-3 shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────

export function HeroPromptToAppV4() {
  const now = useCycleClock();

  const totalMs = CYCLE_MS * APPS.length + RESET_PAUSE;
  const elapsed = now % totalMs;
  const inResetPause = elapsed >= CYCLE_MS * APPS.length;
  const cycleIndex = inResetPause
    ? APPS.length - 1
    : Math.floor(elapsed / CYCLE_MS);
  const cycleT = inResetPause ? CYCLE_MS : elapsed % CYCLE_MS;
  const app = APPS[cycleIndex];

  const clamp01 = (v) => Math.max(0, Math.min(1, v));

  // Sidebar updates at UPDATE_END (= start of shimmer). Main panel
  // cross-fades during the same window.
  const updated = cycleT >= UPDATE_END;
  let installed = cycleIndex;
  if (updated) installed = cycleIndex + 1;
  if (inResetPause) installed = APPS.length;

  // Active app in main = the most recently committed one. Before the
  // very first update, show a clean Home empty state.
  const showHome = cycleIndex === 0 && !updated;
  const activeApp = updated ? app : cycleIndex > 0 ? APPS[cycleIndex - 1] : null;

  // Entry progress for the just-installed row, normalized 0→1 across
  // the shimmer window so the row pops in mid-shimmer.
  const entryT =
    cycleT >= LOADING_END && cycleT < SHIMMER_END + 800
      ? (cycleT - LOADING_END) / (SHIMMER_END + 800 - LOADING_END)
      : null;

  // Shimmer sweep across the portal.
  const shimmerActive = cycleT >= LOADING_END && cycleT < SHIMMER_END;
  const shimmerP = shimmerActive
    ? (cycleT - LOADING_END) / (SHIMMER_END - LOADING_END)
    : 0;
  const shimmerCenter = -30 + shimmerP * 160;
  const shimmerStyle = shimmerActive
    ? {
        opacity: Math.sin(shimmerP * Math.PI),
        background: `linear-gradient(105deg, transparent ${
          shimmerCenter - 20
        }%, rgba(255,255,255,0.10) ${shimmerCenter}%, transparent ${
          shimmerCenter + 20
        }%)`,
      }
    : { opacity: 0 };

  // Loop fade: in the last 600ms before the totalMs wrap, fade the
  // entire bubble stack out so the next loop starts from a clean slate.
  const loopFadeStart = totalMs - 600;
  const loopFadeP = elapsed > loopFadeStart
    ? clamp01((elapsed - loopFadeStart) / 600)
    : 0;
  const stackOpacity = 1 - loopFadeP;

  // Build the stacked-bubble list. For every cycle index that's been
  // reached, render a bubble. Earlier cycles render as 'settled'
  // (full text, no cursor, no dots). The current cycle's bubble is
  // 'typing', 'loading', or 'settled' depending on cycleT.
  const introP = clamp01((cycleT - TYPE_START) / 240);
  const bubbles = [];
  for (let i = 0; i <= cycleIndex; i++) {
    const a = APPS[i];
    if (i < cycleIndex) {
      bubbles.push({
        key: a.id,
        text: a.prompt,
        cursor: false,
        dots: false,
        opacity: 1,
      });
    } else {
      // Current cycle. Mode is derived from cycleT.
      const text = typed(a.prompt, cycleT);
      const isTyping = cycleT >= TYPE_START && cycleT < SEND;
      const isLoading = cycleT >= SEND && cycleT < LOADING_END;
      const isSettled = cycleT >= LOADING_END;
      bubbles.push({
        key: a.id,
        text: isSettled ? a.prompt : text,
        cursor: isTyping,
        dots: isLoading,
        opacity: isSettled ? 1 : introP,
      });
    }
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative w-full"
    >
      <div className="relative mx-auto w-full max-w-[1080px]">
        {/* Stacked prompt thread — each sent prompt remains as a settled
            message, new prompts type in below. Current bubble shows
            cursor while typing and dots during the AI-generating beat. */}
        <div
          className="mb-5 flex w-full max-w-[420px] flex-col gap-2"
          style={{ opacity: stackOpacity }}
        >
          {bubbles.map((b) => (
            <PromptBubble
              key={b.key}
              text={b.text}
              cursor={b.cursor}
              dots={b.dots}
              opacity={b.opacity}
            />
          ))}
        </div>

        {/* Single dominant Client Portal panel ─────────────────── */}
        <div
          className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c0c0d]"
          style={{
            height: "min(58vh, 560px)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 82%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 82%, transparent 100%)",
          }}
        >
          {/* Shimmer sweep — diagonal highlight that crosses the panel
              as the portal "regenerates" with the new app. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10"
            style={shimmerStyle}
          ></div>

          <div className="grid h-full min-w-0 grid-cols-[180px_1fr] gap-0">
            {/* Sidebar */}
            <div className="flex h-full min-w-0 flex-col border-r border-white/[0.05] p-3">
              <div className="mb-4 flex items-center gap-2 px-2 pt-1">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/10 text-[10px] font-semibold text-white/85">
                  B
                </span>
                <span className="truncate text-[11px] font-medium text-white/85">
                  BrandMages
                </span>
              </div>
              <div className="space-y-0.5">
                <SidebarRow iconSrc="/Icons/clienthome.svg" label="Home" />
                <SidebarRow iconSrc="/Icons/messages.svg" label="Messages" />
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
                const isActive = !showHome && activeApp && a.id === activeApp.id;
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
    </div>
  );
}

function PromptBubble({ text, cursor, dots, opacity }) {
  return (
    <div
      className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-[#141416] px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.45)] transition-opacity duration-300"
      style={{ opacity }}
    >
      <span className="mt-[1px] flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/85">
        <SparkleIcon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] leading-[1.45] text-white/85">
          {text || (
            <span className="text-white/35">
              e.g. Build a time tracker for my team
            </span>
          )}
          {cursor && (
            <span className="ml-[1px] inline-block h-[13px] w-[1px] -translate-y-[1px] animate-pulse bg-white/85 align-middle" />
          )}
        </div>
        {dots && (
          <div className="mt-2 flex items-center gap-1" aria-hidden="true">
            <LoadingDot delay={0} />
            <LoadingDot delay={160} />
            <LoadingDot delay={320} />
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingDot({ delay = 0 }) {
  return (
    <span
      className="studio-thinking-dot inline-block h-1.5 w-1.5 rounded-full bg-white/65"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}

const SparkleIcon = ({ className = "h-3.5 w-3.5" }) => (
  <svg
    viewBox="0 0 16 16"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 2v3M8 11v3M2 8h3M11 8h3M4 4l2 2M10 10l2 2M4 12l2-2M10 6l2-2" />
  </svg>
);
