"use client";

// HeroPromptToAppV13 — light hero on a lime page. Same structure as
// v14 (composer with build tabs, portal preview with sidebar, cycling
// reveal) but inverted for the lime/cream surface so the white cards
// pop on the soft green stage.

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

const CARD = "rounded bg-[#101010]/[0.04]";

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
      time: "Yesterday",
    },
    {
      title: "Studio holiday hours",
      body: "We'll be offline Dec 24-26. Tickets answered first thing on the 27th.",
      time: "May 5",
    },
  ];
  return (
    <div className="flex h-full min-w-0 flex-col gap-3 p-4">
      <div>
        <div className="text-[14px] text-[#101010]/75">
          Good morning, Ana
        </div>
        <div className="text-[11px] text-[#101010]/30">
          Here&apos;s the latest from BrandMages
        </div>
      </div>

      <div className="h-[70px] w-full rounded-[6px] bg-[#101010]/[0.04] lg:h-[120px]" />

      <div className="flex flex-col gap-1.5">
        <div className="px-1 text-[11px] text-[#101010]/30">
          Latest updates
        </div>
        {updates.map((u, i) => (
          <div
            key={i}
            className="flex min-w-0 flex-col gap-0.5 rounded bg-[#101010]/[0.04] px-3 py-2"
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

function TimeTrackerView() {
  const entries = [
    { client: "Acme", task: "Brand sprint kickoff", time: "1h 20m", running: true },
    { client: "Lyra", task: "Wireframe review", time: "0h 55m" },
    { client: "Pine", task: "Logo exploration round 2", time: "2h 10m" },
    { client: "Acme", task: "Stakeholder feedback sync", time: "0h 35m" },
    { client: "Orbit", task: "Style guide cleanup", time: "1h 05m" },
  ];
  return (
    <div className="flex h-full min-w-0 flex-col gap-2.5 p-4">
      <div className={`${CARD} flex items-center justify-between gap-3 px-3 py-3`}>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[9px] text-[#101010]/30">
            Currently tracking
          </span>
          <span className="truncate text-[12px] text-[#101010]/75">
            Acme · Brand sprint kickoff
          </span>
        </div>
        <span className="shrink-0 whitespace-nowrap font-mono text-[18px] leading-none tracking-tight text-[#101010]/75">
          02:34:18
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
    { client: "Acme", subject: "Logo file missing from latest delivery", status: "Open", time: "May 8" },
    { client: "Lyra", subject: "Question about brand guideline section 3", status: "In progress", time: "May 8" },
    { client: "Pine", subject: "Need export in CMYK for the print run", status: "Open", time: "May 7" },
    { client: "Orbit", subject: "Typography spec mismatch on landing page", status: "In progress", time: "May 7" },
    { client: "Acme", subject: "Approval flow stuck on review step", status: "Resolved", time: "May 6" },
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
          className={`${CARD} grid min-w-0 grid-cols-[20px_auto_1fr_auto] items-center gap-x-1.5 pl-2 pr-3 py-2`}
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
          <span
            className={`whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] ${statusTone[row.status]}`}
          >
            {row.status}
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
      body: "Anyone else seeing the new brand kit show up in their portal? Curious how the typography stack is rendering on your end.",
      likes: 12,
      replies: 4,
    },
    {
      initials: "JB",
      name: "Jordan Brooks",
      body: "Tip: paste your guideline section number in the helpdesk subject for faster routing.",
      likes: 7,
      replies: 2,
    },
    {
      initials: "AC",
      name: "Aisha Cole",
      body: "Loving the new dashboard layout. The sidebar accent makes it much easier to scan between projects.",
      likes: 21,
      replies: 6,
    },
    {
      initials: "RT",
      name: "Ravi Thomas",
      body: "Anyone running A/B tests on portal onboarding? Would love to compare drop-off numbers.",
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

function SidebarRow({ iconSrc, iconClass, label, active, muted, style }) {
  return (
    <div
      className={[
        "flex items-center gap-2 rounded px-2 py-1.5 text-[12px] leading-none transition-colors duration-300",
        active
          ? "bg-[#101010]/[0.08] text-[#101010]/75"
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

export function HeroPromptToAppV15() {
  const now = useCycleClock();
  const [manualIndex, setManualIndex] = useState(null);

  const totalMs = CYCLE_MS * APPS.length + FINAL_HOLD + RESET_FADE;
  const elapsed = now % totalMs;

  let cycleIndex;
  let cycleT;
  let phase;
  if (manualIndex !== null) {
    cycleIndex = manualIndex;
    cycleT = CYCLE_MS;
    phase = "hold";
  } else if (elapsed < CYCLE_MS * APPS.length) {
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

  const generating =
    phase === "running" && cycleT >= SEND && cycleT < REVEAL_END;
  const shimmerCycle = (now % 1800) / 1800;
  const shimmerX = -120 + shimmerCycle * 340;

  const activeAppId =
    manualIndex !== null
      ? APPS[manualIndex].id
      : phase === "reset"
      ? "home"
      : installed === 0
      ? "home"
      : APPS[installed - 1].id;

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
          Cream/lime stage that frames the white cards on the lime
          page background. The stage is a touch deeper than the page
          so the cards feel layered on a lit surface. */}
      <div
        className="relative w-full overflow-hidden rounded-[24px] p-4 md:p-5 lg:p-6"
        style={{
          backgroundColor: "#8B99C8",
          boxShadow: "0 30px 80px -30px rgba(16,16,16,0.20)",
        }}
      >
<div className="relative flex w-full flex-col items-stretch gap-4 lg:flex-row lg:gap-5">
        {/* ── Composer ─ light card ─────────────────────────────── */}
        <div className="relative w-full lg:w-[320px] lg:shrink-0">
          <div
            className="relative overflow-hidden rounded-[20px] border transition-transform duration-200"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "rgba(16,16,16,0.06)",
              transform: `scale(${pulseScale})`,
              transformOrigin: "center center",
              zIndex: 1,
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.8) inset, 0 8px 24px -12px rgba(16,16,16,0.15)",
            }}
          >
            <div className="px-5 pt-4 pb-4">
              <div className="relative mb-2 text-[12px] text-[#101010]/30">Describe your app</div>
              <div className="min-h-[44px] text-[14px] leading-[1.45] text-[#101010]">
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
                  <span className="text-[#101010]/30">
                    Build a time tracker for my team…
                  </span>
                )}
              </div>
            </div>

            {/* Build tabs — composer footer chip-row. */}
            <div className="pointer-events-auto flex flex-wrap items-center gap-1 border-t border-[#101010]/[0.06] px-3 py-2">
              {APPS.map((a, i) => {
                const isSelected =
                  manualIndex !== null
                    ? i === manualIndex
                    : phase === "running" && i === cycleIndex;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setManualIndex(i)}
                    className={[
                      "flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-[11px] leading-none transition-colors duration-200",
                      isSelected
                        ? "bg-[#101010]/[0.08] text-[#101010]/75"
                        : "text-[#101010]/55 hover:bg-[#101010]/[0.04] hover:text-[#101010]/75",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex h-3 w-3 shrink-0 items-center justify-center",
                        isSelected ? "text-[#101010]/75" : "text-[#101010]/55",
                      ].join(" ")}
                    >
                      <MaskIcon src={a.iconSrc} className="h-3 w-3" />
                    </span>
                    <span>{a.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Portal preview ─────────────────────────────────────── */}
        <div className="relative hidden w-full lg:block lg:min-w-0 lg:flex-1">
          <div
            className="relative overflow-hidden rounded-[20px] border"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "rgba(16,16,16,0.06)",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.8) inset, 0 8px 24px -12px rgba(16,16,16,0.15)",
            }}
          >
            <div className="flex h-8 shrink-0 items-center gap-3 border-b border-[#101010]/[0.06] bg-[#FAFAF6] px-3">
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#101010]/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#101010]/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#101010]/15" />
              </div>
            </div>

            <div className="grid h-[320px] grid-cols-[140px_1fr] gap-0 lg:h-[560px]">
              <div
                className="flex h-full min-w-0 flex-col border-r border-[#101010]/[0.06] p-2.5"
                style={{ background: "#FAFAF6" }}
              >
                <div className="mb-3 flex items-center gap-2 px-2 py-1.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] bg-[#101010]/90 text-white">
                    <BrandMagesMark className="h-3 w-3" />
                  </span>
                  <span className="truncate text-[12px] text-[#101010]/75">
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
                                  "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
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
