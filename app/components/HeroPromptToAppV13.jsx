"use client";

// HeroPromptToAppV13 — dark hero, ChatGPT-style composer.
//
// Same animation principles as the prior v12 (post-typing reveal,
// sidebar accumulates, starts on Home, prompt → app pulse), now on
// a dark surface with a chat-input composer that mirrors the look
// of modern AI chat UIs:
//
//   ┌──────────────────────────────────────────────────┐
//   │  Hold on, we're generating your answer…          │
//   │                                                  │
//   │  📎  ⊞  ▢   ┃ GPT 5.0          ┃           ◉    │
//   └──────────────────────────────────────────────────┘
//   🟦 Thinking…                                     ↻
//
// The composer sits in front of a wide, light client portal so the
// product of the prompt is the bright thing in the frame. Composer
// chrome (icons, model chip, mic button) is tuned to the same dark
// pill tokens used by the site nav, so the hero reads as one piece.

import { useEffect, useState } from "react";

// ── Icons ─────────────────────────────────────────────────────────

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

const Stroke = ({ d, viewBox = "0 0 16 16", className = "h-3.5 w-3.5" }) => (
  <svg
    viewBox={viewBox}
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

// Paperclip (attach)
const PaperclipIcon = (p) => (
  <Stroke
    {...p}
    d="M9.5 3.5 4.7 8.3a2.4 2.4 0 0 0 3.4 3.4l5.4-5.4a3.6 3.6 0 0 0-5.1-5.1l-5.6 5.6a4.8 4.8 0 0 0 6.8 6.8L13 9"
  />
);
// 2x2 grid (apps)
const GridIcon = (p) => (
  <Stroke
    {...p}
    d={[
      "M3 3h4v4H3z",
      "M9 3h4v4H9z",
      "M3 9h4v4H3z",
      "M9 9h4v4H9z",
    ]}
  />
);
// Dotted square + cursor (selection)
const SelectIcon = (p) => (
  <svg
    viewBox="0 0 16 16"
    className={p.className ?? "h-3.5 w-3.5"}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeDasharray="1.4 1.6"
  >
    <rect x="2.5" y="2.5" width="9" height="9" rx="1.2" />
    <path
      d="M8.5 8.5l4.5 1.6-2.1.7-.7 2.1z"
      strokeDasharray="0"
      fill="currentColor"
    />
  </svg>
);
// Sparkle (model logo)
const SparkleIcon = (p) => (
  <svg
    viewBox="0 0 16 16"
    className={p.className ?? "h-3 w-3"}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M8 1.5l1.4 3.6 3.6 1.4-3.6 1.4L8 11.5 6.6 7.9 3 6.5 6.6 5.1 8 1.5z" />
    <path d="M13 10.5l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7.7-1.6z" />
  </svg>
);
// Mic / waveform pill
const WaveIcon = (p) => (
  <svg
    viewBox="0 0 16 16"
    className={p.className ?? "h-3.5 w-3.5"}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
  >
    <path d="M3 8v0M5.5 6v4M8 4.5v7M10.5 6v4M13 8v0" />
  </svg>
);
// Spinner (Thinking…)
const SpinnerIcon = ({ className = "h-3.5 w-3.5" }) => (
  <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
    <circle
      cx="8"
      cy="8"
      r="6"
      fill="none"
      stroke="currentColor"
      strokeOpacity="0.25"
      strokeWidth="1.6"
    />
    <path
      d="M14 8a6 6 0 0 0-6-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

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

// ── App definitions ───────────────────────────────────────────────

const APPS = [
  {
    id: "time",
    label: "Time Tracker",
    iconSrc: "/Icons/clock-three.svg",
    iconClass: "h-3 w-3",
    prompt:
      "Build a time tracker so the team can log work against each client",
  },
  {
    id: "helpdesk",
    label: "Helpdesk",
    iconSrc: "/Icons/helpdesk.svg",
    prompt:
      "Build a helpdesk where clients submit tickets and follow progress",
  },
  {
    id: "community",
    label: "Community",
    iconSrc: "/Icons/globe.svg",
    prompt:
      "Build a community where clients can post and reply to each other",
  },
];

const BUILT_IN = [
  {
    id: "home",
    label: "Home",
    iconSrc: "/Icons/clienthome.svg",
    iconClass: "h-3 w-3",
  },
  { id: "messages", label: "Messages", iconSrc: "/Icons/messages.svg" },
];

// ── Cycle timing (ms) ─────────────────────────────────────────────

const TYPE_START = 400;
const TYPE_END = 3600;
const SEND = 4000;
const REVEAL_END = 5400;
const CYCLE_MS = 8400;
const FINAL_HOLD = 3000;
const RESET_FADE = 900;

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

// ── Portal sub-views (light mode) ─────────────────────────────────

const CARD =
  "rounded border border-[#101010]/[0.07] bg-white";

// Mirrors the real client home: breadcrumb → greeting → blue/purple
// gradient banner → "Your actions" cards with icon + count.
function AbstractBanner() {
  return (
    <div
      className="relative h-[100px] w-full overflow-hidden rounded-[8px] border border-[#101010]/[0.06] lg:h-[160px]"
      style={{
        background:
          "radial-gradient(120% 100% at 0% 100%, #ECF6CC 0%, #F4F7E4 45%, #FAFAF7 100%)",
      }}
    >
      <svg
        viewBox="0 0 600 200"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="v13-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#101010" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#101010" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M -20 150 Q 120 100 260 130 T 540 90 T 720 110"
          stroke="url(#v13-line)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M -20 175 Q 140 130 280 155 T 560 120 T 720 145"
          stroke="url(#v13-line)"
          strokeWidth="1"
          fill="none"
        />
        <circle cx="120" cy="60" r="22" fill="#101010" fillOpacity="0.05" />
        <circle cx="430" cy="80" r="36" fill="#101010" fillOpacity="0.04" />
        <circle cx="510" cy="40" r="14" fill="#101010" fillOpacity="0.06" />
      </svg>
    </div>
  );
}

function HomeView() {
  return (
    <div className="flex h-full min-w-0 flex-col gap-3 p-4">
      <div>
        <div className="text-[13px] text-[#101010]/95">
          Good morning, Ana
        </div>
        <div className="text-[10.5px] text-[#101010]/55">
          Here&apos;s what BrandMages has set up for you
        </div>
      </div>

      <AbstractBanner />

      <div className="rounded-[8px] border border-[#101010]/[0.06] bg-[#fafaf7] p-3">
        <div className="mb-1 text-[11px] text-[#101010]/85">
          Welcome to your portal
        </div>
        <div className="text-[10.5px] leading-[1.45] text-[#101010]/55">
          Your team will share project updates, support requests, and
          community posts with you here.
        </div>
      </div>
    </div>
  );
}

function TimeTrackerView() {
  const entries = [
    { client: "Acme", task: "Brand sprint kickoff workshop", time: "1h 20m" },
    { client: "Lyra", task: "Wireframe review with PM", time: "0h 55m" },
    { client: "Pine", task: "Logo exploration round 2", time: "2h 10m" },
    { client: "Acme", task: "Stakeholder feedback sync", time: "0h 35m" },
    { client: "Orbit", task: "Style guide cleanup", time: "1h 05m" },
  ];
  return (
    <div className="flex h-full min-w-0 flex-col gap-2.5 p-4">
      <div className={`${CARD} flex items-center justify-between gap-3 px-3 py-3`}>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[9.5px] text-[#101010]/45">
            Currently tracking
          </span>
          <span className="truncate text-[11px] text-[#101010]/85">
            Acme · Brand sprint kickoff
          </span>
        </div>
        <span className="shrink-0 whitespace-nowrap font-mono text-[18px] leading-none tracking-tight text-[#101010]">
          02:34:18
        </span>
      </div>

      <div className="px-1 pt-1">
        <span className="text-[10px] text-[#101010]/50">Today</span>
      </div>

      {entries.map((row, i) => (
        <div
          key={i}
          className={`${CARD} grid min-w-0 grid-cols-[20px_56px_1fr_auto] items-center gap-2 px-3 py-2`}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded bg-[#101010]/[0.06] text-[9px] font-medium tracking-tight text-[#101010]/75">
            {row.client.slice(0, 2).toUpperCase()}
          </span>
          <span className="truncate text-[10.5px] text-[#101010]/85">
            {row.client}
          </span>
          <span className="min-w-0 truncate text-[10.5px] text-[#101010]/60">
            {row.task}
          </span>
          <span className="whitespace-nowrap text-[10px] leading-none text-[#101010]/75">
            {row.time}
          </span>
        </div>
      ))}
    </div>
  );
}

function HelpdeskView() {
  const tickets = [
    {
      client: "Acme",
      subject: "Source file missing from final delivery",
      status: "Open",
      time: "May 8",
    },
    {
      client: "Lyra",
      subject: "Updated copy needed before Friday launch",
      status: "In progress",
      time: "May 8",
    },
    {
      client: "Pine",
      subject: "Need print-ready CMYK exports",
      status: "Open",
      time: "May 7",
    },
    {
      client: "Orbit",
      subject: "Typography mismatch on the new landing page",
      status: "In progress",
      time: "May 7",
    },
    {
      client: "Acme",
      subject: "Approval workflow stuck on review step",
      status: "Resolved",
      time: "May 6",
    },
  ];
  const statusTone = {
    Open: "bg-[#101010]/[0.08] text-[#101010]/80",
    "In progress": "bg-[#101010]/[0.05] text-[#101010]/70",
    Resolved: "bg-[#101010]/[0.03] text-[#101010]/45",
  };
  return (
    <div className="flex h-full min-w-0 flex-col gap-2 p-4">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] text-[#101010]/60">Inbox</span>
        <button
          type="button"
          tabIndex={-1}
          className="flex shrink-0 items-center gap-1 rounded-full bg-[#101010] px-2.5 py-1 text-[10px] text-white"
        >
          <Stroke d="M8 3v10M3 8h10" className="h-2.5 w-2.5" />
          Submit a ticket
        </button>
      </div>
      {tickets.map((row, i) => (
        <div
          key={i}
          className={`${CARD} grid min-w-0 grid-cols-[20px_56px_1fr_auto_auto] items-center gap-2 px-3 py-2`}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded bg-[#101010]/[0.06] text-[9px] font-medium tracking-tight text-[#101010]/75">
            {row.client.slice(0, 2).toUpperCase()}
          </span>
          <span className="truncate text-[10.5px] text-[#101010]/85">
            {row.client}
          </span>
          <span className="min-w-0 truncate text-[10.5px] text-[#101010]/60">
            {row.subject}
          </span>
          <span
            className={`whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] ${statusTone[row.status]}`}
          >
            {row.status}
          </span>
          <span className="whitespace-nowrap text-[10px] text-[#101010]/45">
            {row.time}
          </span>
        </div>
      ))}
    </div>
  );
}

function CommunityView() {
  const posts = [
    {
      initials: "MP",
      name: "Maya Patel",
      time: "2m",
      topic: "AEO",
      body: "How are you measuring AEO relevance for B2B clients? Trying to benchmark against organic search before our Q3 review.",
      likes: 14,
      replies: 5,
    },
    {
      initials: "JB",
      name: "Jordan Brooks",
      time: "20m",
      topic: "Outbound",
      body: "Sharing a few ideas for outbound animation we&apos;re testing across LinkedIn ads — happy to swap notes on what&apos;s converting.",
      likes: 9,
      replies: 3,
    },
    {
      initials: "AC",
      name: "Aisha Cole",
      time: "1h",
      topic: "Brand",
      body: "Looking for examples of motion brand systems where the accent color does the heavy lifting. Bonus if it scales to product UI.",
      likes: 22,
      replies: 7,
    },
    {
      initials: "RT",
      name: "Ravi Thomas",
      time: "3h",
      topic: "Strategy",
      body: "Anyone running creative testing on first-touch ads? Curious how you split learning budget vs. scaling budget.",
      likes: 6,
      replies: 2,
    },
  ];
  return (
    <div className="flex h-full min-w-0 flex-col gap-2 p-4">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] text-[#101010]/60">Recent posts</span>
        <span className="text-[10px] text-[#101010]/45">All channels</span>
      </div>
      {posts.map((p, i) => (
        <div key={i} className={`${CARD} flex min-w-0 gap-2.5 px-3 py-2.5`}>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#101010]/[0.06] text-[10px] font-medium tracking-tight text-[#101010]/85">
            {p.initials}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="shrink-0 text-[10.5px] text-[#101010]/90">
                {p.name}
              </span>
              <span className="shrink-0 rounded-full bg-[#101010]/[0.06] px-1.5 py-0.5 text-[9px] text-[#101010]/65">
                {p.topic}
              </span>
              <span className="shrink-0 text-[10px] text-[#101010]/35">·</span>
              <span className="shrink-0 text-[10px] text-[#101010]/45">
                {p.time}
              </span>
            </div>
            <span className="line-clamp-2 text-[10.5px] leading-[1.4] text-[#101010]/65">
              {p.body}
            </span>
            <div className="mt-0.5 flex items-center gap-3 text-[10px] text-[#101010]/45">
              <span className="flex items-center gap-1">
                <MaskIcon src="/Icons/heart.svg" className="h-2.5 w-2.5" />
                {p.likes}
              </span>
              <span className="flex items-center gap-1">
                <MaskIcon src="/Icons/messages.svg" className="h-2.5 w-2.5" />
                {p.replies}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const VIEWS = {
  home: <HomeView />,
  time: <TimeTrackerView />,
  helpdesk: <HelpdeskView />,
  community: <CommunityView />,
};

function SkeletonBlock({ height, shimmerX }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded border border-[#101010]/[0.06] bg-[#101010]/[0.03]"
      style={{ height }}
    >
      <div
        className="absolute inset-y-0 w-[60%]"
        style={{
          background:
            "linear-gradient(105deg, transparent 0%, rgba(16,16,16,0.06) 50%, transparent 100%)",
          transform: `translateX(${shimmerX}%)`,
        }}
      />
    </div>
  );
}

// ── Sidebar primitives ────────────────────────────────────────────

function SidebarRow({ iconSrc, iconClass, label, active, muted, style }) {
  return (
    <div
      className={[
        "flex items-center gap-2 rounded px-2 py-1.5 text-[11px] leading-none transition-colors duration-300",
        active
          ? "bg-[#101010]/[0.06] text-[#101010]"
          : muted
          ? "text-[#101010]/55"
          : "text-[#101010]/75",
      ].join(" ")}
      style={style}
    >
      <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
        <MaskIcon src={iconSrc} className={iconClass ?? "h-3.5 w-3.5"} />
      </span>
      <span className="truncate">{label}</span>
    </div>
  );
}

function ProgressBar({ apps, cycleIndex, cycleT, phase }) {
  const total = apps.length;
  return (
    <div className="mb-3 flex w-full items-center gap-2 px-1">
      <div className="flex flex-1 items-center gap-1.5">
        {apps.map((a, i) => {
          let progress = 0;
          if (phase === "running") {
            if (i < cycleIndex) progress = 1;
            else if (i === cycleIndex) progress = Math.min(1, cycleT / CYCLE_MS);
          } else if (phase === "hold" || phase === "reset") {
            progress = 1;
          }
          return (
            <div
              key={a.id}
              className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-[#101010]/12"
            >
              <div
                className="absolute inset-y-0 left-0 bg-[#101010]"
                style={{
                  width: `${progress * 100}%`,
                  transition: "width 80ms linear",
                }}
              />
            </div>
          );
        })}
      </div>
      <span className="shrink-0 text-[10.5px] text-[#101010]/70">
        {phase === "reset" ? apps[total - 1].label : apps[cycleIndex].label}
      </span>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────

export function HeroPromptToAppV13() {
  const now = useCycleClock();

  const totalMs = CYCLE_MS * APPS.length + FINAL_HOLD + RESET_FADE;
  const elapsed = now % totalMs;

  let cycleIndex;
  let cycleT;
  let phase;
  if (elapsed < CYCLE_MS * APPS.length) {
    cycleIndex = Math.floor(elapsed / CYCLE_MS);
    cycleT = elapsed - cycleIndex * CYCLE_MS;
    phase = "running";
  } else if (elapsed < CYCLE_MS * APPS.length + FINAL_HOLD) {
    cycleIndex = APPS.length - 1;
    cycleT = CYCLE_MS;
    phase = "hold";
  } else {
    cycleIndex = APPS.length - 1;
    cycleT = CYCLE_MS;
    phase = "reset";
  }

  const app = APPS[cycleIndex];
  const promptText = phase === "running" ? typed(app.prompt, cycleT) : app.prompt;
  const showCursor = phase === "running" && cycleT >= TYPE_START && cycleT < SEND;
  const sent = phase !== "running" || cycleT >= SEND;

  let installed;
  if (phase === "reset") {
    installed = 0;
  } else if (phase === "hold") {
    installed = APPS.length;
  } else {
    installed = sent ? cycleIndex + 1 : cycleIndex;
  }

  const enterT = phase === "running" && sent ? cycleT - SEND : Infinity;
  const enterDur = REVEAL_END - SEND;
  const enterProgress = Math.min(1, Math.max(0, enterT / enterDur));

  const generating =
    phase === "running" && cycleT >= SEND && cycleT < REVEAL_END;
  const shimmerCycle = (now % 1800) / 1800;
  const shimmerX = -120 + shimmerCycle * 340;

  const activeAppId =
    phase === "reset"
      ? "home"
      : installed === 0
      ? "home"
      : APPS[installed - 1].id;

  // Composer is "thinking" once the prompt is fully typed and just
  // after send — drives the bottom status row + the placeholder copy.
  const thinking =
    phase === "running" && cycleT >= TYPE_END && cycleT < REVEAL_END + 200;
  const pulseT = phase === "running" ? cycleT - SEND : -1;
  const pulseActive = pulseT >= 0 && pulseT < 500;
  const pulseProgress = pulseActive ? pulseT / 500 : 0;
  const pulseScale = pulseActive ? 1 + 0.012 * Math.sin(Math.PI * pulseProgress) : 1;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative mx-auto w-full max-w-[1180px] px-2 pt-10 pb-32 md:px-4 md:pt-14 md:pb-44 lg:px-6 lg:pt-2 lg:pb-24"
    >
      {/* ── Stage ──────────────────────────────────────────────────
          A rounded "stage" wraps the composer and portal so they read
          as two cards on a shared surface (per the reference). The
          stage uses the v9 light gradient as its background so the
          dark composer + portal cards float on a colorful surface
          inside the otherwise-dark hero. */}
      <div
        className="relative w-full overflow-hidden rounded-[24px] p-4 md:p-5 lg:p-6"
        style={{
          background: "#D9ED92",
        }}
      >
        <ProgressBar
          apps={APPS}
          cycleIndex={cycleIndex}
          cycleT={cycleT}
          phase={phase}
        />
      <div className="relative flex w-full flex-col items-stretch gap-4 lg:flex-row lg:gap-5">
        {/* ── Composer ─ chat-style, dark mode ──────────────────── */}
        <div className="relative w-full lg:w-[320px] lg:shrink-0">
          <div
            className="relative rounded-[20px] border px-5 pt-4 pb-5 transition-transform duration-200"
            style={{
              background: "#ffffff",
              borderColor: "rgba(16,16,16,0.06)",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.6) inset, 0 30px 60px -25px rgba(16,16,16,0.18)",
              transform: `scale(${pulseScale})`,
              transformOrigin: "center center",
              zIndex: 1,
            }}
          >
            <div className="mb-2 text-[11px] text-[#101010]/50">Describe your app</div>
            <div className="min-h-[44px] text-[15px] leading-[1.45] text-[#101010]">
              {thinking ? (
                <span className="text-[#101010]/55">
                  Hold on, we&apos;re generating your app…
                </span>
              ) : promptText ? (
                <>
                  {promptText}
                  {showCursor && (
                    <span className="ml-[1px] inline-block h-[14px] w-[1px] -translate-y-[1px] animate-pulse bg-[#101010] align-middle" />
                  )}
                </>
              ) : (
                <span className="text-[#101010]/35">
                  Build a community for my agency clients…
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Portal preview ─────────────────────────────────────── */}
        <div className="relative hidden w-full lg:block lg:min-w-0 lg:flex-1">
          <div
            className="overflow-hidden rounded-[20px] border"
            style={{
              background: "#ffffff",
              borderColor: "rgba(16,16,16,0.06)",
              boxShadow:
                "0 30px 60px -25px rgba(16,16,16,0.22)",
            }}
          >
            <div className="flex h-8 shrink-0 items-center gap-3 border-b border-[#101010]/[0.06] bg-[#fafaf7] px-3">
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#101010]/12" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#101010]/12" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#101010]/12" />
              </div>
            </div>

            <div className="grid h-[320px] grid-cols-[140px_1fr] gap-0 lg:h-[560px]">
              <div
                className="flex h-full min-w-0 flex-col border-r border-[#101010]/[0.06] p-2.5"
                style={{ background: "#fafaf7" }}
              >
                <div className="mb-3 flex items-center gap-2 px-2 py-1.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] bg-[#101010] text-white">
                    <BrandMagesMark className="h-3 w-3" />
                  </span>
                  <span className="truncate text-[12px] text-[#101010]/90">
                    BrandMages
                  </span>
                </div>

                <div className="space-y-1">
                  <SidebarRow
                    iconSrc={BUILT_IN[0].iconSrc}
                    iconClass={BUILT_IN[0].iconClass}
                    label={BUILT_IN[0].label}
                    active={activeAppId === "home"}
                    muted={activeAppId !== "home"}
                  />
                  <SidebarRow
                    iconSrc={BUILT_IN[1].iconSrc}
                    label={BUILT_IN[1].label}
                    muted
                  />

                  {APPS.slice(0, installed).map((a, i) => {
                    const isNewest = i === installed - 1;
                    const isShimmering = isNewest && generating;
                    const rowOpacity =
                      phase === "reset"
                        ? 1 -
                          Math.min(
                            1,
                            (elapsed - (CYCLE_MS * APPS.length + FINAL_HOLD)) /
                              RESET_FADE
                          )
                        : 1;
                    return (
                      <div key={a.id} className="relative">
                        <SidebarRow
                          iconSrc={a.iconSrc}
                          iconClass={a.iconClass}
                          label={a.label}
                          active={activeAppId === a.id}
                          muted={activeAppId !== a.id}
                          style={{
                            opacity: rowOpacity,
                            transition: "opacity 300ms ease",
                          }}
                        />
                        {isShimmering && (
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 overflow-hidden rounded"
                          >
                            <div
                              className="absolute inset-y-0 w-[60%]"
                              style={{
                                background:
                                  "linear-gradient(105deg, transparent 0%, rgba(16,16,16,0.10) 50%, transparent 100%)",
                                transform: `translateX(${shimmerX}%)`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative h-full min-w-0 overflow-hidden">
                {Object.keys(VIEWS).map((id) => {
                  const isActive = id === activeAppId;
                  return (
                    <div
                      key={id}
                      className="absolute inset-0 transition-opacity duration-500 ease-out"
                      style={{
                        opacity: isActive && !generating ? 1 : 0,
                      }}
                    >
                      {VIEWS[id]}
                    </div>
                  );
                })}
                {generating && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex flex-col gap-2.5 p-4"
                  >
                    <SkeletonBlock height={44} shimmerX={shimmerX} />
                    <SkeletonBlock height={28} shimmerX={shimmerX} />
                    <SkeletonBlock height={28} shimmerX={shimmerX} />
                    <SkeletonBlock height={28} shimmerX={shimmerX} />
                    <SkeletonBlock height={28} shimmerX={shimmerX} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
