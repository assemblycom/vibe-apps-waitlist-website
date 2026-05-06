"use client";

// HeroPromptToAppV8 — "Describe your app → see it appear for the client"
//
// The v7 version read like a unified IDE: chat on the left, "live
// preview" on the right, all inside one card. Feedback was that it
// over-indexed on the *building* experience and made the right side
// look like a developer preview pane. v8 narrows the message back to
// the value: you describe an app, your client gets a polished
// experience.
//
// Structure:
//   ┌────────── composer ──────────┐    →    ┌────── portal preview ──────┐
//   │ "Describe your app"          │         │  •••  brandmages.assembly  │
//   │  [typewritten prompt]        │         │  ┌──────┐                  │
//   │                       [send] │         │  │BMages│  Time Tracker    │
//   └──────────────────────────────┘         │  │ Home │  02:34:18        │
//                                            │  │ Time │  Acme · Brand …  │
//                                            │  └──────┘                  │
//                                            └────────────────────────────┘
//
// Two separate surfaces with a gap (and a small flow arrow) so they
// read as two distinct things — the place you build, and the place
// the client lives. No "Building…" / "Build complete" status, no
// follow-up input. The composer is narrow; the portal does the heavy
// lifting visually because that's the actual product of the work.

import { useEffect, useState } from "react";

// ── Icons ─────────────────────────────────────────────────────────

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

// ── App definitions ──────────────────────────────────────────────

const APPS = [
  {
    id: "time",
    label: "Time Tracker",
    slug: "time-tracker",
    iconSrc: "/Icons/clock-three.svg",
    iconClass: "h-3 w-3",
    prompt:
      "Build a time tracker where the team can log work and associate it with clients",
  },
  {
    id: "helpdesk",
    label: "Helpdesk",
    slug: "helpdesk",
    iconSrc: "/Icons/helpdesk.svg",
    prompt:
      "Build a helpdesk where clients can submit tickets and follow along for progress",
  },
  {
    id: "community",
    label: "Community",
    slug: "community",
    iconSrc: "/Icons/globe.svg",
    prompt:
      "Build a community where clients can post and interact with each other",
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
// Shorter cycle than v7 — the story is just "type prompt, see app".
// No build/complete beats to fit, so the type-then-show loop can move
// faster.

const CYCLE_MS = 6500;
const TYPE_START = 250;
const TYPE_END = 2400;
const SEND = 2800;
const RESET_PAUSE = 800;

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

function TimeTrackerView() {
  return (
    <div className="flex h-full min-w-0 flex-col gap-2.5 p-4">
      <div className="flex items-center gap-3 rounded border border-[#101010]/10 bg-white px-3 py-2.5">
        <span className="whitespace-nowrap font-mono text-[16px] leading-none tracking-tight text-[#101010]/85">
          02:34:18
        </span>
      </div>
      {[
        { client: "Acme", task: "Brand sprint kickoff", time: "1h 20m" },
        { client: "Lyra", task: "Wireframe review", time: "0h 55m" },
      ].map((row, i) => (
        <div
          key={i}
          className="flex min-w-0 items-center gap-2 rounded border border-[#101010]/[0.08] bg-white px-3 py-2"
        >
          <span className="shrink-0 text-[10.5px] font-medium text-[#101010]/80">
            {row.client}
          </span>
          <span className="shrink-0 text-[10.5px] text-[#101010]/40">·</span>
          <span className="min-w-0 flex-1 truncate text-[10.5px] text-[#101010]/65">
            {row.task}
          </span>
          <span className="shrink-0 whitespace-nowrap font-mono text-[10px] leading-none text-[#101010]/80">
            {row.time}
          </span>
        </div>
      ))}
    </div>
  );
}

function HelpdeskView() {
  return (
    <div className="flex h-full min-w-0 flex-col gap-2 p-4">
      {[
        { client: "Acme", subject: "Logo file missing from latest delivery" },
        { client: "Lyra", subject: "Question about brand guideline section 3" },
        { client: "Pine", subject: "Need export in CMYK for the print run" },
      ].map((row, i) => (
        <div
          key={i}
          className="flex min-w-0 items-center gap-2 rounded border border-[#101010]/[0.08] bg-white px-3 py-2"
        >
          <span className="shrink-0 text-[10.5px] font-medium text-[#101010]/80">
            {row.client}
          </span>
          <span className="shrink-0 text-[10.5px] text-[#101010]/40">·</span>
          <span className="min-w-0 flex-1 truncate text-[10.5px] text-[#101010]/65">
            {row.subject}
          </span>
        </div>
      ))}
    </div>
  );
}

function CommunityView() {
  return (
    <div className="flex h-full min-w-0 flex-col gap-2 p-4">
      {[
        {
          initials: "MP",
          name: "Maya Patel",
          body: "Anyone else seeing the new brand kit show up in their portal?",
        },
        {
          initials: "JB",
          name: "Jordan Brooks",
          body: "Tip: paste your guideline section number for faster routing.",
        },
      ].map((p, i) => (
        <div
          key={i}
          className="flex min-w-0 gap-2.5 rounded border border-[#101010]/[0.08] bg-white px-3 py-2"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#101010]/[0.06] text-[9.5px] font-medium tracking-tight text-[#101010]/80">
            {p.initials}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-[10.5px] font-medium text-[#101010]/80">
              {p.name}
            </span>
            <span className="truncate text-[10.5px] leading-[1.35] text-[#101010]/65">
              {p.body}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

const VIEWS = {
  time: <TimeTrackerView />,
  helpdesk: <HelpdeskView />,
  community: <CommunityView />,
};

// ── Sidebar primitives ───────────────────────────────────────────

function SidebarRow({ iconSrc, iconClass, label, active, muted }) {
  return (
    <div
      className={[
        "flex items-center gap-2 rounded px-2 py-1.5 text-[11px] leading-none transition-colors duration-300",
        active
          ? "bg-[#101010]/[0.06] text-[#101010]"
          : muted
          ? "text-[#101010]/55"
          : "text-[#101010]/70",
      ].join(" ")}
    >
      <MaskIcon
        src={iconSrc}
        className={`${iconClass ?? "h-3.5 w-3.5"} shrink-0`}
      />
      <span className="truncate">{label}</span>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────

export function HeroPromptToAppV9() {
  const now = useCycleClock();

  const totalMs = CYCLE_MS * APPS.length + RESET_PAUSE;
  const elapsed = now % totalMs;
  const inResetPause = elapsed >= CYCLE_MS * APPS.length;
  const cycleIndex = inResetPause
    ? APPS.length - 1
    : Math.floor(elapsed / CYCLE_MS);
  const cycleT = inResetPause ? CYCLE_MS : elapsed % CYCLE_MS;
  const app = APPS[cycleIndex];

  const promptText = typed(app.prompt, cycleT);
  const showCursor = cycleT >= TYPE_START && cycleT < SEND;
  const ready = cycleT >= TYPE_END;
  const sent = cycleT >= SEND;

  // Shimmer sweep across the main pane right after the prompt sends —
  // a brief diagonal highlight that signals "the app just appeared".
  const SHIMMER_DURATION = 900;
  const shimmerT = cycleT - SEND;
  const shimmerActive = shimmerT >= 0 && shimmerT < SHIMMER_DURATION;
  const shimmerProgress = shimmerActive ? shimmerT / SHIMMER_DURATION : 0;
  // Sweep from -120% to 220% across the pane.
  const shimmerX = -120 + shimmerProgress * 340;

  // Portal always visible — pre-SEND it shows the *previous* cycle's
  // app so there's never a blank frame.
  const activeApp = sent
    ? app
    : APPS[(cycleIndex - 1 + APPS.length) % APPS.length];
  const portalOpacity = 1;
  const portalScale = 1;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative mx-auto w-full max-w-[1180px] px-2 pt-10 pb-32 md:px-4 md:pt-14 md:pb-44 lg:px-6 lg:pt-2 lg:pb-24"
    >
      {/* Bloom for v8 lives at the parent level (Hero.jsx) so the
          gradient extends across the section AND the logo band
          beneath it — flows behind the logos with no hard line. */}

<div className="relative flex w-full flex-col items-stretch gap-6 lg:block lg:gap-0">
      {/* ── Composer (left) — overlapping the portal's left edge.
          On mobile it stacks above the portal; at lg+ it floats
          absolutely to overlap the portal canvas like a focal
          overlay card on a wide deck. ──────────────────────────── */}
      <div
        className="relative w-full max-w-[420px] self-center lg:absolute lg:bottom-[50%] lg:left-0 lg:top-auto lg:z-10 lg:w-[330px] lg:max-w-none lg:translate-y-0"
      >
        <div
          className="rounded-[20px] border px-5 py-4"
          style={{
            background: "#fbfbfb",
            borderColor: "#dfe1e4",
            boxShadow: "0 4px 16px -10px rgba(0,0,0,0.2), 0 30px 60px -20px rgba(0,0,0,0.5)",
          }}
        >
          <div className="mb-2.5 text-[12px] font-medium text-[#101010]/55">
            Describe your app
          </div>
          <div className="h-[42px] text-[14px] leading-[1.45] text-[#101010]/85">
            {promptText || (
              <span className="text-[#101010]/35">
                Build a time tracker for my team…
              </span>
            )}
            {showCursor && (
              <span className="ml-[1px] inline-block h-[14px] w-[1px] -translate-y-[1px] animate-pulse bg-[#101010]/90 align-middle" />
            )}
          </div>
        </div>
      </div>

      {/* ── Portal preview — wide canvas that anchors the scene ─── */}
      <div
        className="relative w-full max-w-[640px] self-center lg:ml-auto lg:w-[78%] lg:max-w-none"
        style={{
          opacity: portalOpacity,
          transform: `scale(${portalScale})`,
          transformOrigin: "center center",
        }}
      >
        {/* Soft glow halo behind the portal so it lifts off the
            scene the same way the composer does — keeps both layers
            visually connected through the same atmospheric language. */}
        <div
          className="pointer-events-none absolute -inset-10 -z-10 rounded-[40px]"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 45%, rgba(140,170,255,0.18) 0%, rgba(140,170,255,0) 70%)",
            filter: "blur(20px)",
          }}
        />
      <div
        className="overflow-hidden rounded-[20px] border"
        style={{
          background: "rgba(255,255,255,0.85)",
          borderColor: "rgba(16,16,16,0.08)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow:
            "0 4px 16px -10px rgba(0,0,0,0.15), 0 40px 80px -25px rgba(0,0,0,0.25)",
        }}
      >
        {/* Browser chrome */}
        <div className="flex h-8 shrink-0 items-center gap-3 border-b border-[#101010]/10 bg-white/60 px-3">
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#101010]/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#101010]/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#101010]/15" />
          </div>
        </div>

        {/* Sidebar + main */}
        <div className="grid h-[320px] grid-cols-[140px_1fr] gap-0 lg:h-[560px]">
          <div className="flex h-full min-w-0 flex-col border-r border-[#101010]/[0.08] p-2.5">
            <div className="mb-3 flex items-center gap-2 px-2 py-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#101010]/[0.06] text-[#101010]/80">
                <BrandMagesMark className="h-3.5 w-3.5" />
              </span>
              <span className="truncate text-[12px] font-medium text-[#101010]/85">
                BrandMages
              </span>
            </div>

            <div className="space-y-1">
              {BUILT_IN.map((b) => (
                <SidebarRow
                  key={b.id}
                  iconSrc={b.iconSrc}
                  iconClass={b.iconClass}
                  label={b.label}
                  muted
                />
              ))}
              <div className="relative overflow-hidden rounded">
                <SidebarRow
                  key={activeApp.id}
                  iconSrc={activeApp.iconSrc}
                  iconClass={activeApp.iconClass}
                  label={activeApp.label}
                  active
                />
                {shimmerActive && (
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: `linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.10) 50%, transparent 65%)`,
                      transform: `translateX(${shimmerX}%)`,
                      mixBlendMode: "screen",
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="relative h-full min-w-0 overflow-hidden">
            {APPS.map((a) => (
              <div
                key={a.id}
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: a.id === activeApp.id ? 1 : 0 }}
              >
                {VIEWS[a.id]}
              </div>
            ))}
            {shimmerActive && (
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.08) 50%, transparent 65%)`,
                  transform: `translateX(${shimmerX}%)`,
                  mixBlendMode: "screen",
                }}
              />
            )}
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}
