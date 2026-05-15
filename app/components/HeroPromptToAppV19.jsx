"use client";

// HeroPromptToAppV19 — off-white hero variant. Identical client portal
// + composer to v18; the surrounding hero is a cream off-white instead
// of #101010, so the white card layers sit on a soft background rather
// than contrasting against dark.

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
    iconClass: "h-3 w-3",
    prompt:
      "Build a time tracker so the team can log work against each client",
  },
  {
    id: "helpdesk",
    label: "Helpdesk",
    iconSrc: "/Icons/helpdesk.svg",
    tabIconClass: "h-5 w-5",
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

// ── Cycle timing ─────────────────────────────────────────────────
//
// Phases per app cycle, matching v15/v16 so the loading beat is real:
//   0           → TYPE_START   pre-type pause
//   TYPE_START  → TYPE_END     prompt typewrites in
//   TYPE_END    → SEND         "thinking" hold
//   SEND        → REVEAL_END   skeleton/loading visible in portal
//   REVEAL_END  → CYCLE_MS     app view visible, sidebar shimmer fades
// After all apps cycle once: FINAL_HOLD on the last app, then RESET_FADE.

const TYPE_START = 400;
const TYPE_END = 3600;
const SEND = 4000;
const REVEAL_END = 5400;
const CYCLE_MS = 8400;
const FINAL_HOLD = 1200;
// IDLE_HOLD only applies in progressHeader mode — after the final hold,
// the composer clears and the "enter your next idea" cursor prompt
// sits for this long before the cycle resets.
const IDLE_HOLD = 5200;
const RESET_FADE = 600;

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

// ── Portal sub-views ─────────────────────────────────────────────
//
// Light-card content — the portal sits as a white surface on the dark
// hero, so text/borders stay dark for legibility. Mirrors v15 views.

const CARD =
  "rounded border border-[#101010]/[0.10] bg-white";

function HomeView() {
  const updates = [
    {
      title: "Q3 brand refresh delivered",
      body: "Final logo, type system, and color tokens are ready in your shared drive.",
      time: "2h",
    },
    {
      title: "New point of contact",
      body: "Maya Patel will be your day-to-day lead going forward.",
      time: "1d",
    },
    {
      title: "Studio holiday hours",
      body: "We'll be offline Dec 24-26. Tickets answered first thing on the 27th.",
      time: "5d",
    },
  ];
  return (
    <div className="flex h-full min-w-0 flex-col gap-3 p-4">
      <div>
        <div className="text-[14px] text-[#101010]/75">Good morning, Ana</div>
        <div className="text-[11px] text-[#101010]/30">
          Here&apos;s the latest from BrandMages
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {updates.map((u, i) => (
          <div
            key={i}
            className={`${CARD} flex min-w-0 flex-col gap-0.5 px-3 py-2`}
          >
            <div className="flex min-w-0 items-center justify-between gap-2">
              <span className="truncate text-[11px] text-[#101010]/75">
                {u.title}
              </span>
              <span className="shrink-0 text-[9px] text-[#101010]/30">
                {u.time}
              </span>
            </div>
            <span className="line-clamp-2 text-[11px] leading-[1.4] text-[#101010]/55">
              {u.body}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Starting display for the "currently tracking" timer in TimeTrackerView.
// Ticks up by one second while the time-tracker view is mounted so the
// hero demo reads as a real running stopwatch.
const TIMER_START_SECONDS = 2 * 3600 + 34 * 60 + 18;

function formatTimer(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function TimeTrackerView() {
  const entries = [
    { client: "Acme", task: "Brand sprint kickoff", time: "1h 20m" },
    { client: "Lyra", task: "Wireframe review", time: "0h 55m" },
    { client: "Pine", task: "Logo exploration round 2", time: "2h 10m" },
    { client: "Acme", task: "Stakeholder feedback sync", time: "0h 35m" },
    { client: "Orbit", task: "Style guide cleanup", time: "1h 05m" },
  ];
  const [elapsed, setElapsed] = useState(TIMER_START_SECONDS);
  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex h-full min-w-0 flex-col gap-2.5 p-4">
      <div className={`${CARD} flex items-end justify-between gap-3 px-3 py-3`}>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[9px] text-[#101010]/30">Currently tracking</span>
          <span className="truncate text-[12px] leading-none text-[#101010]/75">
            Acme · Brand sprint kickoff
          </span>
        </div>
        <span
          className="shrink-0 whitespace-nowrap font-mono text-[18px] leading-none tracking-tight text-[#101010]/75 tabular-nums"
          aria-live="off"
        >
          {formatTimer(elapsed)}
        </span>
      </div>

      <div className="px-1 pt-1">
        <span className="text-[11px] text-[#101010]/30">Today</span>
      </div>

      {entries.map((row, i) => (
        <div
          key={i}
          className={`${CARD} grid min-w-0 grid-cols-[20px_auto_1fr_auto] items-center gap-x-1.5 pl-2 pr-3 py-2`}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded bg-[#101010]/[0.08] text-[9px] font-medium leading-none text-[#101010]/75">
            {row.client.slice(0, 2).toUpperCase()}
          </span>
          <span className="truncate text-[11px] text-[#101010]/75">
            {row.client}
          </span>
          <span className="min-w-0 truncate text-[11px] text-[#101010]/55">
            {row.task}
          </span>
          <span className="whitespace-nowrap text-[11px] leading-none text-[#101010]/55">
            {row.time}
          </span>
        </div>
      ))}
    </div>
  );
}

function HelpdeskView() {
  const tickets = [
    { client: "Acme", subject: "Missing print-ready files in the May delivery", status: "Open", time: "May 8" },
    { client: "Lyra", subject: "Question about brand guideline section 3", status: "In progress", time: "May 8" },
    { client: "Pine", subject: "Need export in CMYK for the print run", status: "Open", time: "May 7" },
    { client: "Orbit", subject: "Typography spec mismatch on landing page", status: "In progress", time: "May 7" },
    { client: "Acme", subject: "Wordmark SVG missing from the asset pack", status: "Resolved", time: "May 6" },
  ];
  const statusTone = {
    Open: "bg-[#101010]/[0.08] text-[#101010]/75",
    "In progress": "bg-[#101010]/[0.04] text-[#101010]/55",
    Resolved: "bg-[#101010]/[0.04] text-[#101010]/30",
  };
  return (
    <div className="flex h-full min-w-0 flex-col gap-2 p-4">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] text-[#101010]/30">Inbox</span>
        <span className="text-[11px] text-[#101010]/30">5 open</span>
      </div>
      {tickets.map((row, i) => (
        <div
          key={i}
          className={`${CARD} grid min-w-0 grid-cols-[20px_auto_1fr] items-center gap-x-1.5 pl-2 pr-3 py-2`}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded bg-[#101010]/[0.08] text-[9px] font-medium leading-none text-[#101010]/75">
            {row.client.slice(0, 2).toUpperCase()}
          </span>
          <span className="truncate text-[11px] text-[#101010]/75">
            {row.client}
          </span>
          <span className="min-w-0 truncate text-[11px] text-[#101010]/55">
            {row.subject}
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
      body: "Rolling out our refreshed brand internally next week — anyone have a launch checklist that actually got sales-team buy-in?",
      likes: 12,
      replies: 4,
    },
    {
      initials: "JB",
      name: "Jordan Brooks",
      body: "Any tips for getting sales and support teams to actually follow the brand voice? Half our outbound still feels off.",
      likes: 7,
      replies: 2,
    },
    {
      initials: "AC",
      name: "Aisha Cole",
      body: "Our refresh ships next month — what's the one thing you wish you'd done differently on rollout?",
      likes: 21,
      replies: 6,
    },
    {
      initials: "RT",
      name: "Ravi Thomas",
      body: "Anyone been through a naming exercise recently? Curious how long the full thing actually took end-to-end.",
      likes: 4,
      replies: 1,
    },
  ];
  return (
    <div className="flex h-full min-w-0 flex-col gap-2 p-4">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] text-[#101010]/30">Recent posts</span>
        <span className="text-[11px] text-[#101010]/30">All channels</span>
      </div>
      {posts.map((p, i) => (
        <div key={i} className={`${CARD} flex min-w-0 gap-2.5 px-3 py-2.5`}>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#101010]/[0.08] text-[11px] font-medium leading-none text-[#101010]/75">
            {p.initials}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="shrink-0 text-[11px] text-[#101010]/75">
                {p.name}
              </span>
            </div>
            <span className="line-clamp-2 text-[11px] leading-[1.4] text-[#101010]/55">
              {p.body}
            </span>
            <div className="mt-0.5 flex items-center gap-3 text-[9px] text-[#101010]/30">
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

// ── Skeleton + sidebar primitives ────────────────────────────────

function SkeletonBlock({ height, shimmerX }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded bg-[#101010]/[0.04]"
      style={{ height }}
    >
      <div
        className="absolute inset-y-0 w-[60%]"
        style={{
          background:
            "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
          transform: `translateX(${shimmerX}%)`,
        }}
      />
    </div>
  );
}

function SidebarRow({ iconSrc, iconClass, label, active, muted, style, skeleton, shimmerX }) {
  if (skeleton) {
    return (
      <div
        className="relative h-[26px] w-full overflow-hidden rounded bg-[#101010]/[0.06]"
        style={style}
      >
        <span
          aria-hidden="true"
          className="absolute inset-y-0 w-[60%]"
          style={{
            background:
              "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
            transform: `translateX(${shimmerX}%)`,
          }}
        />
      </div>
    );
  }
  return (
    <div
      className={[
        "flex items-center gap-2 rounded px-2 py-1.5 text-[12px] leading-none transition-colors duration-200",
        active
          ? "bg-[#101010]/[0.06] text-[#101010]/85"
          : muted
          ? "text-[#101010]/55 hover:bg-[#101010]/[0.04] hover:text-[#101010]/75"
          : "text-[#101010]/75 hover:bg-[#101010]/[0.04]",
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

// ── Component ────────────────────────────────────────────────────

export function HeroPromptToAppV19({ borderless = false, progressHeader = false } = {}) {
  const now = useCycleClock();
  // Clicking a tab anchors the cycle to start fresh at that app's
  // running beat — the cycle keeps progressing from there instead of
  // freezing.
  const [clickAnchor, setClickAnchor] = useState({ index: 0, time: 0 });

  // Borderless variants (v20/v21/v22) get the "Added to your portal"
  // success beat + "Enter your next idea" cursor idle beat after every
  // full cycle. v19 keeps the original straight loop.
  const idleHold = borderless ? IDLE_HOLD : 0;
  const totalMs = CYCLE_MS * APPS.length + FINAL_HOLD + idleHold + RESET_FADE;
  const anchorOffsetMs = clickAnchor.index * CYCLE_MS;
  const sinceAnchor = Math.max(0, now - clickAnchor.time);
  const elapsed = (sinceAnchor + anchorOffsetMs) % totalMs;

  let cycleIndex;
  let cycleT;
  let phase;
  const runningEnd = CYCLE_MS * APPS.length;
  const holdEnd = runningEnd + FINAL_HOLD;
  const idleEnd = holdEnd + idleHold;
  if (elapsed < runningEnd) {
    cycleIndex = Math.floor(elapsed / CYCLE_MS);
    cycleT = elapsed - cycleIndex * CYCLE_MS;
    phase = "running";
  } else if (elapsed < holdEnd) {
    cycleIndex = APPS.length - 1;
    cycleT = CYCLE_MS;
    phase = "hold";
  } else if (elapsed < idleEnd) {
    cycleIndex = APPS.length - 1;
    cycleT = CYCLE_MS;
    phase = "idle";
  } else {
    cycleIndex = APPS.length - 1;
    cycleT = CYCLE_MS;
    phase = "reset";
  }

  const app = APPS[cycleIndex];
  const promptText =
    phase === "running" ? typed(app.prompt, cycleT) : app.prompt;
  const showCursor =
    phase === "running" && cycleT >= TYPE_START && cycleT < SEND;
  const sent = phase !== "running" || cycleT >= SEND;

  // Number of apps "installed" in the sidebar — accumulates across the
  // cycle so each new app's labeled row pops in only after its own
  // generate beat completes (REVEAL_END). Before that, the sidebar
  // shows a nameless skeleton square in its place so it reads as
  // "still building" — the labeled, selected row replaces it once the
  // main view is ready.
  let installed;
  if (phase === "reset") {
    installed = 0;
  } else if (phase === "hold" || phase === "idle") {
    installed = APPS.length;
  } else {
    installed = cycleT >= REVEAL_END ? cycleIndex + 1 : cycleIndex;
  }

  // The app currently being generated — rendered as a skeleton row in
  // the sidebar between TYPE_END and REVEAL_END (the same window where
  // the composer shows "Hold on, we're generating your app…" and the
  // tab label shimmers).
  const installingApp =
    phase === "running" && cycleT >= TYPE_END && cycleT < REVEAL_END
      ? APPS[cycleIndex]
      : null;

  // Generating + sidebar skeleton run on the same window now so both
  // surfaces shimmer and reveal together — no longer a 400ms gap
  // where the composer says "Hold on…" but the portal still shows the
  // previous app's content.
  const generating =
    phase === "running" && cycleT >= TYPE_END && cycleT < REVEAL_END;
  const thinking =
    phase === "running" && cycleT >= TYPE_END && cycleT < REVEAL_END + 200;
  const shimmerCycle = (now % 1800) / 1800;
  const shimmerX = -120 + shimmerCycle * 340;

  // During the install window (between TYPE_END and REVEAL_END) we
  // drop the highlight off the previously-built app so the user
  // doesn't read "two selected" — the sidebar reads as "the last app
  // has handed off, the next one is loading" until the new view is
  // ready and its row takes over the selected state at REVEAL_END.
  const activeAppId =
    phase === "reset"
      ? "home"
      : generating
      ? null
      : installed === 0
      ? "home"
      : APPS[installed - 1].id;

  // Progress through the current app's full cycle for the tab underbar.
  const tabProgressIndex = cycleIndex;
  const tabProgress =
    phase === "running" ? Math.min(1, cycleT / CYCLE_MS) : 1;

  // Overall progress across all apps — drives the single progress bar
  // in progressHeader mode (0 at first prompt, 1 once every app is built).
  const overallProgress =
    phase === "running"
      ? (cycleIndex * CYCLE_MS + cycleT) / (APPS.length * CYCLE_MS)
      : 1;

  const handleTabClick = (idx) => {
    setClickAnchor({ index: idx, time: now });
  };

  return (
    <div className="pointer-events-none relative mx-auto w-full max-w-[1180px] px-2 pt-2 pb-24 md:px-4 md:pt-4 md:pb-6 lg:px-6 lg:pt-2 lg:pb-16">
      {/* ── Outer frame ────────────────────────────────────────────
          Light card sitting on the dark hero — single bordered surface
          wrapping tabs + composer + portal. */}
      <div
        className={`relative w-full hero-card-fade-mobile${borderless ? " overflow-hidden rounded-t-[20px] px-2.5 pt-2.5 pb-0 lg:overflow-visible lg:rounded-b-[20px] lg:pb-2.5" : " overflow-hidden rounded-[16px] border"}`}
        style={{
          backgroundColor: borderless ? "#FFFFFF" : "#FFFFFF",
          ...(borderless ? {} : { borderColor: "rgba(16,16,16,0.10)" }),
        }}
      >
      <div
        className={borderless ? "relative w-full overflow-hidden rounded-t-[14px] border border-b-0 lg:rounded-[14px] lg:border-b" : "contents"}
        style={borderless ? { backgroundColor: "#FFFFFF", borderColor: "rgba(16,16,16,0.10)" } : undefined}
      >
        {/* ── Top chrome ────────────────────────────────────────────
            Default: tab strip (one tab per app, clickable, progress
            underbar tracking the current cycle). progressHeader: a
            single status row + one continuous progress bar across all
            apps (label updates as we move through each app). */}
        {progressHeader ? (
          <div className="border-b border-[#101010]/[0.08] px-5 pt-4 pb-4">
            <div className="flex items-center justify-end text-[12px] leading-none text-[#101010]/40">
              <span>
                {(() => {
                  // 4 parts = 3 app builds + the "ready for next idea" stage.
                  const totalSteps = APPS.length + 1;
                  const step =
                    phase === "running"
                      ? cycleIndex + 1
                      : phase === "hold"
                      ? APPS.length
                      : totalSteps; // idle + reset
                  return `${step} of ${totalSteps}`;
                })()}
              </span>
            </div>
          </div>
        ) : (
        <div className="hidden border-b border-[#101010]/[0.08] pb-0 lg:block">
          <div className={`flex items-center ${borderless ? "" : "gap-1 overflow-hidden px-3"}`}>
            {APPS.map((a, i) => {
              const isActive = i === tabProgressIndex;
              // A tab is "enabled" once its app is in flight or already
              // built. Future apps in the cycle render dimmed +
              // non-interactive, mirroring the sidebar's progressive
              // install reveal.
              const isEnabled = phase !== "running" || i <= cycleIndex;
              // Once built, a tab stays at full prominence (text + icon
              // remain dark) so completed tabs don't fade back to a
              // dimmed/disabled-looking state when the cycle moves on.
              const isBuilt = isActive || isEnabled;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => isEnabled && handleTabClick(i)}
                  aria-label={`Show ${a.label}`}
                  aria-disabled={!isEnabled}
                  className={[
                    "relative flex items-center text-[12px] leading-none transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#101010]/40",
                    isEnabled
                      ? "pointer-events-auto cursor-pointer"
                      : "pointer-events-none cursor-default",
                    borderless
                      ? "flex-1 basis-0 justify-center px-4 py-4"
                      : "shrink-0 gap-1.5 px-4 py-4",
                    i > 0 ? "border-l border-[#101010]/[0.08]" : "",
                    !borderless && i === APPS.length - 1 ? "border-r border-[#101010]/[0.08]" : "",
                  ].join(" ")}
                >
                  {!borderless && (
                    <span
                      className={[
                        "flex h-5 w-5 shrink-0 items-center justify-center transition-colors duration-300",
                        isBuilt ? "text-[#101010]/85" : "text-[#101010]/20",
                      ].join(" ")}
                    >
                      <MaskIcon
                        src={a.iconSrc}
                        className={a.tabIconClass ?? "h-4 w-4"}
                      />
                    </span>
                  )}
                  <span
                    className={[
                      "transition-colors duration-300",
                      isActive && generating
                        ? "hero-text-shimmer"
                        : isBuilt
                        ? "text-[#101010]/85"
                        : "text-[#101010]/20",
                    ].join(" ")}
                  >
                    {a.label}
                  </span>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className={[
                        `absolute -bottom-[1px] z-10 origin-left ${borderless ? "h-[1.5px] bg-[#a3a3a3]" : "h-[2px] bg-[#101010]"}`,
                        // For the first tab in non-borderless mode, extend
                        // the bar left into the strip's px-3 gutter so
                        // progress starts flush at the frame edge. In
                        // borderless mode tabs are equal-width and flush,
                        // so the bar spans the tab itself.
                        !borderless && i === 0
                          ? "-left-3 w-[calc(100%+0.75rem)]"
                          : "left-0 w-full",
                      ].join(" ")}
                      style={{ transform: `scaleX(${tabProgress})` }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        )}

        {/* ── Body: composer + portal ───────────────────────────── */}
        <div className="grid grid-cols-1 gap-2 px-2 pt-2 pb-0 lg:gap-3 lg:px-3 lg:pt-3 lg:pb-3 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
          {/* Composer — input-style panel */}
          <div className="relative px-3 pb-2 pt-3 lg:p-4">
            <div className="mb-1 text-[12px] text-[#101010]/45 lg:mb-2">
              Describe your app
            </div>
            <div className="relative h-[44px] text-[14px] leading-[1.5] text-[#101010]/85 md:h-[28px] lg:h-auto lg:min-h-[60px]">
              {/* Typed prompt layer — fades out when we enter the
                  "thinking" beat so the swap to the generating message
                  reads as a single soft cross-fade. */}
              <div
                className="transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{ opacity: thinking && phase !== "idle" ? 0 : 1 }}
              >
                {(phase === "idle" || phase === "reset") && borderless ? (
                  <span className="inline-flex items-center align-middle">
                    <span className="hero-cursor-blink inline-block h-[16px] w-[1.5px] bg-[#101010]/85" />
                    <span className="ml-[3px] text-[#101010]/35">
                      Enter your next idea
                    </span>
                  </span>
                ) : borderless &&
                  ((phase === "running" && cycleT >= REVEAL_END) ||
                    phase === "hold") ? (
                  <span className="text-[#101010]/65">
                    Added to your portal
                  </span>
                ) : promptText ? (
                  <>
                    {promptText}
                    {showCursor && !thinking && (
                      <span className="ml-[1px] inline-block h-[14px] w-[1px] -translate-y-[1px] animate-pulse bg-[#101010]/85 align-middle" />
                    )}
                  </>
                ) : (
                  <span className="text-[#101010]/35">
                    Build a time tracker for my team…
                  </span>
                )}
              </div>
              {/* "Hold on…" layer — fades in over the typed prompt.
                  Text shimmer signals the build is actively running. */}
              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{ opacity: thinking ? 1 : 0 }}
              >
                <span className="hero-text-shimmer">
                  Hold on, we&apos;re generating your app…
                </span>
              </div>
            </div>
          </div>

          {/* Portal preview */}
          <div className="relative">
            <div
              className={`overflow-hidden rounded-t-[10px] border border-b-0 lg:rounded-[10px] lg:border-b lg:shadow-[0_10px_28px_-8px_rgba(16,16,16,0.18)]${borderless ? " border-[#101010]/[0.10]" : " border-[#101010]/[0.10]"}`}
              style={{
                background: borderless ? "#FFFFFF" : "#FFFFFF",
                ...(borderless ? { borderColor: "rgba(16,16,16,0.10)" } : {}),
              }}
            >
              {/* Desktop chrome — traffic-lights bar. Hidden on mobile,
                  where the portal renders as a single-pane mobile app
                  with its own top bar (hamburger / app name / kebab). */}
              <div
                className="hidden h-7 shrink-0 items-center gap-1.5 border-b border-[#101010]/[0.06] px-3 lg:flex"
                style={{ background: borderless ? "#FFFFFF" : "#F4F4F5" }}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-[#101010]/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#101010]/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#101010]/15" />
              </div>

              {/* Mobile chrome — single-pane "mobile app" top bar that
                  replaces the sidebar on small screens: hamburger button
                  on the left, current app/screen name next to it, kebab
                  on the right. The hamburger/kebab are visual only —
                  the cycle still drives the active app from the top tab
                  strip above. */}
              <div
                className="flex h-12 shrink-0 items-center justify-between border-b border-[#101010]/[0.06] px-3 lg:hidden"
                style={{ background: borderless ? "#FFFFFF" : "#F4F4F5" }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#101010]/[0.10] text-[#101010]/75">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <path d="M4 7h16M4 12h16M4 17h16" />
                    </svg>
                  </span>
                  <span className="truncate text-[13px] text-[#101010]/85">
                    {([...BUILT_IN, ...APPS].find((a) => a.id === activeAppId)?.label) ?? ""}
                  </span>
                </div>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#101010]/[0.10] text-[#101010]/75">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                    <circle cx="5" cy="12" r="1.6" />
                    <circle cx="12" cy="12" r="1.6" />
                    <circle cx="19" cy="12" r="1.6" />
                  </svg>
                </span>
              </div>

              <div className={`grid grid-cols-1 gap-0 lg:h-[520px] lg:grid-cols-[140px_1fr] ${borderless ? "h-[170px]" : "h-[420px]"}`}>
                {/* Sidebar with progressive install — desktop only.
                    On mobile the portal is a single content pane and
                    the sidebar collapses into the mobile chrome above. */}
                <div
                  className="hidden h-full min-w-0 flex-col border-r border-[#101010]/[0.08] p-2.5 lg:flex"
                  style={{ background: borderless ? "#FFFFFF" : "#F4F4F5" }}
                >
                  <div className="mb-3 flex items-center gap-2 px-2 py-1.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#101010]/[0.06] text-[#101010]/80">
                      <BrandMagesMark className="h-3.5 w-3.5" />
                    </span>
                    <span className="truncate text-[12px] font-medium text-[#101010]/85">
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

                    {APPS.slice(0, installed).map((a) => {
                      const rowOpacity =
                        phase === "reset"
                          ? 1 -
                            Math.min(
                              1,
                              (elapsed - (CYCLE_MS * APPS.length + FINAL_HOLD)) /
                                RESET_FADE,
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
                        </div>
                      );
                    })}

                    {installingApp && (
                      <div key={`installing-${installingApp.id}`} className="relative">
                        <SidebarRow
                          iconSrc={installingApp.iconSrc}
                          iconClass={installingApp.iconClass}
                          muted
                          skeleton
                          shimmerX={shimmerX}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Main content: VIEWS with cross-fade + skeleton.
                    Bottom-fade mask on mobile so the last visible row
                    fades out instead of getting hard-cut at the portal
                    edge. Desktop is tall enough that all rows fit. */}
                <div
                  className="hero-portal-content relative h-full min-w-0 overflow-hidden"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, #000 0%, #000 80%, transparent 100%)",
                    maskImage:
                      "linear-gradient(to bottom, #000 0%, #000 80%, transparent 100%)",
                  }}
                >
                  {Object.keys(VIEWS).map((id) => {
                    const isActive = id === activeAppId;
                    return (
                      <div
                        key={id}
                        className="absolute inset-0 transition-opacity duration-500 ease-out"
                        style={{ opacity: isActive && !generating ? 1 : 0 }}
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
    </div>
  );
}
