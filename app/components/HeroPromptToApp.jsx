"use client";

// HeroPromptToApp — v2: studio + client-portal split.
//
// Three-column workspace mock anchored at the bottom of the hero.
// Left: studio nav (BrandMages dropdown, nav, apps, workspace).
// Middle: builder column with one user prompt that types in, then
// an AI response + plan, with a bottom input.
// Right: client-portal preview showing the resulting Time Tracker
// app the way the end client would see it.
//
// One-prompt narrative: the left column is the firm's studio, the
// middle is where the operator describes the app, the right shows
// what the client sees once it ships.

const StrokeIcon = ({ d, className = "h-3.5 w-3.5" }) => (
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

const ChevronDown = (p) => <StrokeIcon {...p} d="M4 6l4 4 4-4" />;
const HistoryIcon = (p) => (
  <StrokeIcon
    {...p}
    d="M3 8a5 5 0 105-5M3 8l-1.5-1.5M3 8l1.5-1.5M8 5v3l2 1.5"
  />
);
const ClockIcon = (p) => (
  <StrokeIcon {...p} d="M8 14A6 6 0 108 2a6 6 0 000 12zM8 5v3l2 1.5" />
);
const PaperclipIcon = (p) => (
  <StrokeIcon {...p} d="M11 4l-5 5a2.5 2.5 0 003.5 3.5l5-5a4 4 0 00-5.5-5.5l-5 5" />
);
const LinkIcon = (p) => (
  <StrokeIcon
    {...p}
    d="M6.5 9.5l3-3M5 11a2.5 2.5 0 010-3.5l2-2M11 5a2.5 2.5 0 010 3.5l-2 2"
  />
);
const PlusIcon = (p) => <StrokeIcon {...p} d="M8 3v10M3 8h10" />;
const PlayIcon = (p) => (
  <StrokeIcon
    {...p}
    d="M5 3.5l7 4.5-7 4.5z"
  />
);
const ArrowIcon = (p) => <StrokeIcon {...p} d="M3 8h10M9 4l4 4-4 4" />;

// Render an SVG asset via CSS mask so it picks up the parent's color.
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

// ── Studio nav data ────────────────────────────────────────────────

const STUDIO_NAV = [
  { label: "Dashboard", iconSrc: "/Icons/Dashboard.svg" },
  { label: "CRM", iconSrc: "/Icons/CRM.svg" },
  { label: "Notifications", iconSrc: "/Icons/Notifications.svg" },
  { label: "Automation", iconSrc: "/Icons/Automations.svg" },
];

const STUDIO_APPS = [
  { label: "App 1", dot: "rgba(255,255,255,0.55)" },
  { label: "App 2", dot: "rgba(255,255,255,0.55)" },
  { label: "App 3", dot: "rgba(255,255,255,0.55)" },
  { label: "App 4", dot: "rgba(255,255,255,0.55)" },
];
const TIME_TRACKER = {
  label: "Time Tracker",
  state: "Draft",
};

const WORKSPACE = [
  { label: "App Library" },
  { label: "Marketplace" },
  { label: "Branding" },
  { label: "Settings" },
];

// ── Prompt + plan content ──────────────────────────────────────────

const PROMPT =
  "Build a time tracking app to log hours, track work across clients and projects, and generate clear reports for billing.";

const AI_RESPONSE = "I set up the core structure for your Time Tracker";

const PLAN_BULLETS = [
  "Time entries (log and edit work)",
  "Daily summary (hours tracked per day)",
  "Activity dashboard (real-time insights)",
  "Reporting (trends over time)",
];

// ── Animation timings (seconds from mount) ─────────────────────────

const T = {
  promptStart: 0,
  // Right after the prompt is sent, three pulsing dots show as a
  // "thinking" indicator while we wait for the AI response.
  dotsStart: 0.7,
  // AI response fades in once the dots have pulsed twice.
  aiResponse: 2.7,
  planTitle: 3.0,
  planBulletStagger: 0.22,
  // Once the plan is in, the right-side client portal starts
  // populating: the new app appears in the client's sidebar, then
  // the main view crossfades to the Time Tracker UI.
  portalEntry: 4.4,
  portalMain: 4.8,
  // Studio sidebar Time Tracker entry (left column) appears at the
  // same moment as the right-side portal entry.
  studioEntry: 4.4,
};

// ── Studio sidebar row primitive ───────────────────────────────────

function StudioRow({
  iconSrc,
  iconNode,
  label,
  active,
  trailing,
  className = "",
}) {
  return (
    <div
      className={[
        "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[12px] leading-none",
        active ? "bg-white/[0.07] text-white/95" : "text-white/65",
        className,
      ].join(" ")}
    >
      {iconNode ?? (
        <MaskIcon src={iconSrc} className="h-[14px] w-[14px] shrink-0" />
      )}
      <span className="truncate">{label}</span>
      {trailing && <span className="ml-auto">{trailing}</span>}
    </div>
  );
}

// ── Right-side client-portal preview content ──────────────────────

function ClientPortalSidebarRow({ iconSrc, label, active }) {
  return (
    <div
      className={[
        "flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] leading-none",
        active ? "bg-white/[0.06] text-white/95" : "text-white/65",
      ].join(" ")}
    >
      <MaskIcon src={iconSrc} className="h-3 w-3 shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  );
}

function ClientPortalEmpty() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1.5 px-6 text-center">
      <span className="text-[12px] font-medium text-white/70">Welcome</span>
      <span className="text-[10.5px] text-white/35">
        New apps will appear here
      </span>
    </div>
  );
}

function TimeTrackerPreview() {
  return (
    <div className="flex h-full min-w-0 flex-col">
      {/* Panel header — same pattern as the studio's portal preview */}
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-white/[0.06] px-4">
        <span className="truncate text-[12px] font-medium text-white/85">
          Time Tracker
        </span>
        <span className="ml-auto hidden whitespace-nowrap rounded-full border border-white/15 px-2 py-[2px] text-[10px] text-white/55 sm:inline">
          This week
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-3 md:p-4">
        {/* Big timer + start button. The "Acme · Brand sprint"
            eyebrow is hidden on narrow viewports because there
            isn't room for it next to the timer + play button — the
            timer alone carries the meaning. */}
        <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
          <span className="whitespace-nowrap font-mono text-[18px] leading-none tracking-tight text-white/80 md:text-[20px]">
            02:34:18
          </span>
          <span className="hidden truncate text-[10.5px] text-white/45 lg:inline">
            Acme · Brand sprint
          </span>
          <span className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-white/85">
            <PlayIcon className="h-3 w-3" />
          </span>
        </div>

        {/* Today's entries */}
        <div className="min-w-0">
          <div className="mb-1.5 flex items-center justify-between text-[10.5px] text-white/45">
            <span>Today</span>
            <span className="whitespace-nowrap font-mono text-white/55">
              4h 12m
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

        {/* Weekly summary — hidden on narrow viewports where vertical
            room is tight. */}
        <div className="hidden min-w-0 sm:block">
          <div className="mb-1.5 flex items-center justify-between text-[10.5px] text-white/45">
            <span>This week</span>
            <span className="whitespace-nowrap font-mono text-white/55">
              22h / 30h
            </span>
          </div>
          <div className="flex h-10 items-end gap-1.5 rounded-lg border border-white/[0.05] bg-white/[0.015] px-2.5 py-2">
            {[40, 70, 55, 85, 60, 30, 15].map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-[2px] bg-white/25"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────

export function HeroPromptToApp() {
  return (
    <div
      aria-hidden="true"
      className="hsv-stage pointer-events-none relative w-full"
    >
      <div
        className="mx-auto h-[640px] w-full max-w-[1100px] overflow-hidden rounded-t-2xl border border-b-0 border-white/[0.10] bg-[#0c0c0c]"
        style={{
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.04) inset, 0 -16px 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* Below lg only the builder column shows (full width) — it
            carries the prompt → plan story end-to-end. At lg+ the
            client-portal preview is added beside it for the "and
            here's what the client sees" beat. Stacking both on
            mobile pushed the preview below the section bleed, so
            this is the cleaner trade-off. */}
        <div className="flex h-full flex-row">
          {/* ── Builder column ───────────────────────────────── */}
          <section className="relative flex flex-1 flex-col lg:w-[400px] lg:flex-initial lg:shrink-0 lg:border-r lg:border-white/[0.06]">
            {/* Top bar: just the document title — history icon and
                Publish button removed for now. */}
            <div className="flex h-10 shrink-0 items-center border-b border-white/[0.06] px-4">
              <span className="flex items-center gap-1.5 text-[12px] text-white/85">
                Untitled
                <ChevronDown className="h-3 w-3 text-white/45" />
              </span>
            </div>

            <div className="relative flex-1 overflow-hidden px-4 pt-4">
              {/* User prompt — already-sent message that fades in.
                  Earlier version typewrote the text, but with a long
                  multi-line prompt the per-character reveal stuttered
                  on word wrap; treating it as sent reads cleaner. */}
              <div
                className="hsv-fade-in rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-[11.5px] leading-[1.55] text-white/85"
                style={{ animationDelay: `${T.promptStart}s` }}
              >
                {PROMPT}
              </div>

              {/* Loading dots — pulse while the AI is "thinking",
                  bridging the gap between the prompt being sent and
                  the response landing. */}
              <div
                className="hsv-dots mt-3 flex items-center gap-1 px-1"
                style={{ animationDelay: `${T.dotsStart}s` }}
              >
                {[0, 0.18, 0.36].map((d) => (
                  <span
                    key={d}
                    className="hsv-dot inline-block h-1.5 w-1.5 rounded-full bg-white/65"
                    style={{ animationDelay: `${T.dotsStart + d}s` }}
                  />
                ))}
              </div>

              {/* AI response title with chevron */}
              <div
                className="hsv-fade-in mt-3 flex items-center gap-1.5 text-[11.5px] text-white/85"
                style={{ animationDelay: `${T.aiResponse}s` }}
              >
                <span className="truncate">{AI_RESPONSE}</span>
                <span className="text-white/45">
                  <StrokeIcon d="M6 4l4 4-4 4" className="h-3 w-3" />
                </span>
              </div>

              {/* Plan title */}
              <div
                className="hsv-fade-in mt-3 text-[11px] leading-[1.55] text-white/65"
                style={{ animationDelay: `${T.planTitle}s` }}
              >
                Here&apos;s a structured plan for your Time Tracker:
              </div>
              <div
                className="hsv-fade-in mt-2 text-[11.5px] font-medium text-white/95"
                style={{ animationDelay: `${T.planTitle + 0.1}s` }}
              >
                Core Modules
              </div>

              {/* Plan bullets — staggered fade-in */}
              <ul className="mt-1 space-y-1 pl-1">
                {PLAN_BULLETS.map((b, i) => (
                  <li
                    key={i}
                    className="hsv-fade-in flex gap-2 text-[11px] leading-[1.5] text-white/75"
                    style={{
                      animationDelay: `${
                        T.planTitle + 0.3 + i * T.planBulletStagger
                      }s`,
                    }}
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/55" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {/* References block — appears with the plan */}
              <div
                className="hsv-fade-in mt-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
                style={{
                  animationDelay: `${
                    T.planTitle +
                    0.3 +
                    PLAN_BULLETS.length * T.planBulletStagger
                  }s`,
                }}
              >
                <div className="mb-1.5 flex items-center gap-1.5 text-[10.5px] text-white/55">
                  <LinkIcon className="h-3 w-3" />
                  References
                  <span className="ml-auto text-white/35">2 results</span>
                </div>
                <div className="space-y-1 text-[10px] leading-[1.4] text-white/55">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">Time-tracking patterns</span>
                    <span className="font-mono text-white/35">linear.app</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">Dashboard inspiration</span>
                    <span className="font-mono text-white/35">stripe.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom input — "How might you improve your app?" */}
            <div className="shrink-0 px-4 pb-4 pt-3">
              <div className="rounded-xl border border-white/[0.08] bg-[#121212] p-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-white/45">
                    <PaperclipIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex-1 text-[11px] text-white/35">
                    How might you improve your app?
                  </span>
                  <span className="rounded-md bg-white/[0.08] px-2 py-1 text-[10px] font-medium text-white/55">
                    Build app
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Client portal preview — visible on lg+ only ── */}
          <div className="relative hidden flex-1 flex-col bg-[#080808] lg:flex">
            {/* Top: just the "Client portal preview" label. */}
            <div className="flex h-10 shrink-0 items-center border-b border-white/[0.06] px-4">
              <span className="text-[10.5px] text-white/45">
                Client portal preview
              </span>
            </div>

            <div className="relative flex-1 p-5">
              {/* Inner portal frame — what the end client sees */}
              <div className="relative h-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#0e0e0e]">
                {/* Window chrome */}
                <div className="flex h-7 shrink-0 items-center gap-1 border-b border-white/[0.06] bg-[#0a0a0a] px-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                  <span className="ml-2 text-[9px] leading-none text-white/35">
                    BrandMages · Acme
                  </span>
                </div>

                <div className="flex h-[calc(100%-28px)]">
                  {/* Client's sidebar */}
                  <aside className="w-[140px] shrink-0 border-r border-white/[0.06] bg-[#0a0a0a] p-2.5">
                    <div className="mb-3 flex items-center gap-1.5 px-1">
                      <img
                        src="/logos/brandmages.svg"
                        alt=""
                        aria-hidden="true"
                        width={14}
                        height={14}
                        className="h-[14px] w-[14px] shrink-0 rounded-[3px]"
                        style={{ filter: "invert(1)" }}
                      />
                      <span className="text-[11px] font-medium text-white/90">
                        BrandMages
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <ClientPortalSidebarRow
                        iconSrc="/Icons/clienthome.svg"
                        label="Home"
                      />
                      <ClientPortalSidebarRow
                        iconSrc="/Icons/messages.svg"
                        label="Messages"
                      />
                      {/* Time Tracker entry — fades in once the build
                          is complete. */}
                      <div
                        className="hsv-portal-entry"
                        style={{ animationDelay: `${T.portalEntry}s` }}
                      >
                        <div className="flex items-center gap-2 rounded-md bg-white/[0.06] px-2 py-1.5 text-[11px] leading-none text-white/95">
                          <ClockIcon className="h-3 w-3 shrink-0" />
                          <span className="truncate">Time Tracker</span>
                        </div>
                      </div>
                    </div>
                  </aside>

                  {/* Client's main view — empty placeholder, then
                      crossfades to the actual Time Tracker UI. */}
                  <main className="relative flex-1 overflow-hidden">
                    <div
                      className="hsv-portal-empty absolute inset-0 flex flex-col"
                      style={{ animationDelay: "0s" }}
                    >
                      <ClientPortalEmpty />
                    </div>
                    <div
                      className="hsv-portal-main absolute inset-0 flex flex-col"
                      style={{ animationDelay: `${T.portalMain}s` }}
                    >
                      <TimeTrackerPreview />
                    </div>
                  </main>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
