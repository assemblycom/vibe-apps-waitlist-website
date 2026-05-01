"use client";

// HeroPromptToAppV3 — prompt → app fly-in.
//
// Auto-playing sequence: a prompt types out on the left, then
// "compresses" into a card that flies right into the client portal,
// where it appears as a new sidebar entry and the main panel
// crossfades to the resulting app. Loops through three apps so the
// portal sidebar fills out as you watch.

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

const CYCLE_MS = 9000;
const TYPE_START = 300;
const TYPE_END = 2600;
const SEND = 3000;
const FLY_END = 3700;
const HOLD_END = 8400;
const RESET_PAUSE = 1500; // pause after all apps installed before looping

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
  // Slight ease-out for a more natural typing rhythm.
  const eased = 1 - Math.pow(1 - progress, 1.4);
  const chars = Math.floor(eased * text.length);
  return text.slice(0, chars);
}

// ── Sub-views (right-side main panel content per app) ─────────────

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
                  ? "shrink-0 whitespace-nowrap rounded-full border border-[#d9ed92]/40 bg-[#d9ed92]/10 px-2 py-[1px] text-[9.5px] text-[#d9ed92]"
                  : "shrink-0 whitespace-nowrap rounded-full border border-white/15 px-2 py-[1px] text-[9.5px] text-white/55"
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
                    ? "shrink-0 whitespace-nowrap rounded-full border border-[#d9ed92]/40 bg-[#d9ed92]/10 px-2 py-[1px] text-[9.5px] text-[#d9ed92]"
                    : row.tone === "pending"
                    ? "shrink-0 whitespace-nowrap rounded-full border border-amber-300/30 bg-amber-300/10 px-2 py-[1px] text-[9.5px] text-amber-200"
                    : "shrink-0 whitespace-nowrap rounded-full border border-white/15 px-2 py-[1px] text-[9.5px] text-white/55"
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

// ── Sidebar primitives ────────────────────────────────────────────

function SidebarRow({ iconSrc, label, active, entering }) {
  return (
    <div
      className={[
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] leading-none transition-all duration-500",
        active ? "bg-white/[0.07] text-white/95" : "text-white/65",
      ].join(" ")}
      style={{
        opacity: entering ? 0 : 1,
        transform: entering ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      <MaskIcon src={iconSrc} className="h-3 w-3 shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────

export function HeroPromptToAppV3() {
  const now = useCycleClock();

  // Loop indefinitely through APPS. After the last app, hold the full
  // sidebar for RESET_PAUSE before looping back to an empty state.
  const totalMs = CYCLE_MS * APPS.length + RESET_PAUSE;
  const elapsed = now % totalMs;
  const inResetPause = elapsed >= CYCLE_MS * APPS.length;
  const cycleIndex = inResetPause
    ? APPS.length - 1
    : Math.floor(elapsed / CYCLE_MS);
  const cycleT = inResetPause ? CYCLE_MS : elapsed % CYCLE_MS;
  const app = APPS[cycleIndex];

  // Phase flags
  const sending = cycleT >= SEND && cycleT < FLY_END;
  const sent = cycleT >= FLY_END;
  const promptText = typed(app.prompt, cycleT);
  const showCursor = cycleT >= TYPE_START && cycleT < SEND;

  // Sidebar contents: first N apps where N = how many cycles fully
  // completed by `sent`. After the loop pauses we briefly show all
  // apps before resetting to empty.
  let installed = cycleIndex;
  if (sent) installed = cycleIndex + 1;
  if (inResetPause) installed = APPS.length;
  // The cycle that just sent should appear as "entering" for a beat
  // so the row animates in instead of popping.
  const enteringIndex = sending || (sent && cycleT < FLY_END + 400) ? cycleIndex : -1;

  // Active app in main = the latest one that's been sent. Before the
  // very first app sends, show the empty welcome state.
  const showEmpty = cycleIndex === 0 && !sent;
  const activeApp = sent ? app : cycleIndex > 0 ? APPS[cycleIndex - 1] : null;

  // Card fly: prompt panel "compresses" + translates right at SEND.
  const promptFly = sending
    ? {
        opacity: 1 - (cycleT - SEND) / (FLY_END - SEND),
        transform: `translateX(${((cycleT - SEND) / (FLY_END - SEND)) * 80}px) scale(${
          1 - ((cycleT - SEND) / (FLY_END - SEND)) * 0.1
        })`,
      }
    : sent
    ? { opacity: 0, transform: "translateX(80px) scale(0.9)" }
    : { opacity: 1, transform: "translateX(0) scale(1)" };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative w-full"
    >
      <div
        className="relative mx-auto w-full max-w-[1100px] overflow-hidden rounded-t-2xl border border-white/[0.07] bg-[#0e0e0f]"
        style={{ height: "min(56vh, 540px)" }}
      >
        <div className="grid h-full grid-cols-[1fr_1.2fr] gap-0">
          {/* Left: studio with prompt input */}
          <div className="relative flex h-full min-w-0 flex-col border-r border-white/[0.06] bg-[#0a0a0a]">
            <div className="flex h-9 shrink-0 items-center gap-2 border-b border-white/[0.06] px-4">
              <span className="text-[11px] font-medium text-white/55">
                Untitled
              </span>
              <span className="ml-auto rounded-full bg-white/85 px-2 py-[2px] text-[10px] font-medium text-black">
                Publish app
              </span>
            </div>

            <div className="flex min-w-0 flex-1 flex-col items-center px-6 pt-10">
              <div className="text-[10.5px] uppercase tracking-[0.18em] text-white/40">
                Describe your app
              </div>
              <div className="mt-8 w-full max-w-[340px]">
                <div
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition-all duration-500"
                  style={promptFly}
                >
                  <div className="min-h-[64px] text-[12.5px] leading-[1.45] text-white/85">
                    {promptText}
                    {showCursor && (
                      <span className="ml-[1px] inline-block h-[12px] w-[1px] -translate-y-[1px] animate-pulse bg-white/85 align-middle" />
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2">
                    <span className="text-[10px] text-white/35">Prompt</span>
                    <span
                      className={[
                        "flex h-6 w-6 items-center justify-center rounded-full transition-colors",
                        cycleT >= TYPE_END
                          ? "bg-[#d9ed92] text-black"
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

          {/* Right: client portal preview */}
          <div className="relative flex h-full min-w-0 flex-col bg-[#0c0c0d]">
            <div className="flex h-9 shrink-0 items-center gap-2 border-b border-white/[0.06] px-4">
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                Client portal preview
              </span>
              <span className="ml-auto text-[10px] text-white/35">
                brandmages.client
              </span>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-[160px_1fr] gap-0">
              {/* Sidebar */}
              <div className="flex h-full min-w-0 flex-col border-r border-white/[0.05] p-3">
                <div className="mb-3 flex items-center gap-2 px-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/10 text-[10px] font-semibold text-white/85">
                    B
                  </span>
                  <span className="truncate text-[11px] font-medium text-white/85">
                    BrandMages
                  </span>
                </div>
                <div className="space-y-0.5">
                  <SidebarRow
                    iconSrc="/Icons/clienthome.svg"
                    label="Home"
                  />
                  <SidebarRow
                    iconSrc="/Icons/messages.svg"
                    label="Messages"
                  />
                  {APPS.slice(0, installed).map((a, i) => (
                    <SidebarRow
                      key={a.id}
                      iconSrc={a.iconSrc}
                      label={a.label}
                      active={activeApp && a.id === activeApp.id}
                      entering={i === enteringIndex}
                    />
                  ))}
                </div>
              </div>

              {/* Main */}
              <div className="relative h-full min-w-0">
                {showEmpty ? (
                  <div className="flex h-full flex-col items-center justify-center gap-1.5 px-6 text-center">
                    <span className="text-[12px] font-medium text-white/70">
                      Welcome
                    </span>
                    <span className="text-[10.5px] text-white/35">
                      New apps will appear here
                    </span>
                  </div>
                ) : (
                  APPS.map((a) => {
                    const isActive = activeApp && a.id === activeApp.id;
                    return (
                      <div
                        key={a.id}
                        className="absolute inset-0 transition-opacity duration-500"
                        style={{ opacity: isActive ? 1 : 0 }}
                      >
                        {a.main}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
