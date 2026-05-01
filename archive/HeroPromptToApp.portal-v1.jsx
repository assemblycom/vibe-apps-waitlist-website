"use client";

// HeroPromptToApp — full-bleed portal showcase.
//
// Anchors the bottom of the hero with an oversized client-portal mock
// that extends past the section's bottom edge. Sidebar opens with the
// brand row plus Home and Messages; three more apps (On-Boarding,
// Payments, Helpdesk) drop into the sidebar over time. Each app has
// its own panel header inside the main view (matching the in-app
// pattern from ClientPortalVisual). The Vibe AI composer floats over
// the upper-right of the visual, breaking out of the portal frame on
// the right so it reads as the source the apps "ship" from.

// ── Icon helper ────────────────────────────────────────────────────
// SvgIcon renders an SVG asset as a CSS mask so the icon is tinted
// with currentColor — letting one black-on-white asset be reused as
// a muted-white sidebar glyph or a stronger active-state glyph by
// adjusting the parent's text color.

function SvgIcon({ src, className = "h-[14px] w-[14px]" }) {
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

// Inline strokes — used only for utility glyphs not in the icon pack.
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
const SparkleIcon = (p) => (
  <StrokeIcon
    {...p}
    d="M8 2v3M8 11v3M2 8h3M11 8h3M4 4l2 2M10 10l2 2M12 4l-2 2M6 10l-2 2"
  />
);
const ArrowIcon = (p) => (
  <StrokeIcon {...p} d="M3 8h10M9 4l4 4-4 4" />
);
const CheckIcon = (p) => <StrokeIcon {...p} d="M3 8.5l3 3 7-7" />;

// ── Apps + timeline ────────────────────────────────────────────────

const APPS = [
  {
    id: "onboarding",
    label: "On-Boarding",
    panelTitle: "On-Boarding",
    iconSrc: "/Icons/on-boarding.svg",
    prompt: "Build a client onboarding flow",
    promptDelay: 0,
    entryDelay: 2.6,
    mainDelay: 2.8,
  },
  {
    id: "payments",
    label: "Payments",
    panelTitle: "Payments",
    iconSrc: "/Icons/payments.svg",
    prompt: "Build a payments dashboard",
    promptDelay: 3,
    entryDelay: 5.6,
    mainDelay: 5.8,
  },
  {
    id: "helpdesk",
    label: "Helpdesk",
    panelTitle: "Helpdesk",
    iconSrc: "/Icons/helpdesk.svg",
    prompt: "Build a helpdesk for tickets",
    promptDelay: 6,
    entryDelay: 8.6,
    mainDelay: 8.8,
  },
];

// Teaser idle state — runs after the three apps have been built.
// Shows a blinking cursor at the start of the input followed by a
// grayed-out hint, suggesting "and you can keep building". No app
// is added to the sidebar.
const TEASER = {
  hint: "Start typing to build a new idea…",
  delay: 9,
};

// ── Panel header ───────────────────────────────────────────────────
// Mirrors the in-app PanelHeader pattern (h-11, bottom border, app
// name on the left) but recolored for dark mode.

function PanelHeader({ title }) {
  return (
    <div className="flex h-11 shrink-0 items-center border-b border-white/[0.06] px-4">
      <span className="truncate text-[12px] font-medium text-white/95">
        {title}
      </span>
    </div>
  );
}

// ── Main-view content blocks ───────────────────────────────────────

function MainViewWelcome() {
  return (
    <>
      <PanelHeader title="Home" />
      <div className="flex flex-1 flex-col items-center justify-center gap-1.5 px-6 text-center">
        <div className="text-[13px] font-medium text-white/80">
          Welcome to BrandMages
        </div>
        <div className="text-[11px] text-white/40">
          Your apps will appear here as you build them
        </div>
      </div>
    </>
  );
}

function OnboardingPreview() {
  return (
    <>
      <PanelHeader title="On-Boarding" />
      <div className="flex flex-1 flex-col gap-1.5 p-4 md:p-5">
        {[
          { done: true, label: "Send welcome packet" },
          { done: true, label: "Collect billing details" },
          { done: false, label: "Schedule kickoff call" },
        ].map((row, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
          >
            <span
              className={[
                "flex h-4 w-4 items-center justify-center rounded-full",
                row.done
                  ? "bg-white text-black"
                  : "border border-white/25 text-transparent",
              ].join(" ")}
            >
              <CheckIcon className="h-2.5 w-2.5" />
            </span>
            <span className="text-[11.5px] text-white/85">{row.label}</span>
            <span className="ml-auto text-[10px] uppercase tracking-[0.06em] text-white/40">
              {row.done ? "Done" : "Today"}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function PaymentsPreview() {
  return (
    <>
      <PanelHeader title="Payments" />
      <div className="flex flex-1 flex-col gap-2.5 p-4 md:p-5">
        <div className="grid grid-cols-3 gap-2">
          {[
            { v: "$24.8k", l: "Outstanding" },
            { v: "$12.1k", l: "Paid this month" },
            { v: "3", l: "Overdue" },
          ].map((kpi) => (
            <div
              key={kpi.l}
              className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
            >
              <div className="text-[14px] font-medium leading-none text-white/95">
                {kpi.v}
              </div>
              <div className="mt-1.5 text-[9.5px] leading-none text-white/45">
                {kpi.l}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          {[
            { id: "INV-204", amt: "$1,200", live: true },
            { id: "INV-205", amt: "$840", live: false },
          ].map((row) => (
            <div
              key={row.id}
              className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5"
            >
              <span className="font-mono text-[10px] leading-none text-white/55">
                {row.id}
              </span>
              <span className="ml-auto font-mono text-[10px] leading-none text-white/95">
                {row.amt}
              </span>
              <span
                className={[
                  "rounded-[3px] px-1.5 py-[2px] text-[9px] leading-none",
                  row.live
                    ? "bg-white text-black"
                    : "border border-white/15 text-white/55",
                ].join(" ")}
              >
                {row.live ? "Paid" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function HelpdeskPreview() {
  return (
    <>
      <PanelHeader title="Helpdesk" />
      <div className="flex flex-1 flex-col gap-1.5 p-4 md:p-5">
        {[
          { tag: "Open", live: true, t: "Cannot access invoice export" },
          { tag: "Open", live: true, t: "Add user to billing role" },
          { tag: "Closed", live: false, t: "Update onboarding template" },
        ].map((row, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
          >
            <span
              className={[
                "rounded-[3px] px-1.5 py-[2px] text-[9px] leading-none",
                row.live
                  ? "bg-white text-black"
                  : "border border-white/15 text-white/55",
              ].join(" ")}
            >
              {row.tag}
            </span>
            <span className="truncate text-[11.5px] text-white/85">
              {row.t}
            </span>
            <span className="ml-auto font-mono text-[9.5px] leading-none text-white/40">
              #{1024 + i}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Vibe AI composer ───────────────────────────────────────────────

function VibeComposer() {
  return (
    <div className="rounded-xl border border-white/[0.10] bg-[#141414] p-3">
      <div className="mb-2 flex items-center gap-1.5 px-1 text-[11px] leading-none text-white/75">
        <span className="flex h-4 w-4 items-center justify-center rounded-[4px] bg-white/[0.08] text-white/80">
          <SparkleIcon className="h-2.5 w-2.5" />
        </span>
        <span>Build an app</span>
      </div>
      <div className="relative h-9 overflow-hidden rounded-md border border-white/[0.10] bg-black/40">
        {/* Default placeholder. Fades out at the very start so the
            typing reveal doesn't draw on top of it as the prompt is
            being typed in. */}
        <div className="hpd-placeholder absolute inset-0 flex items-center pl-3 pr-9 text-[11.5px] leading-none text-white/35">
          Describe an app for your client…
        </div>
        {APPS.map((app) => (
          <div
            key={app.id}
            className="hpd-prompt-line absolute inset-0"
            style={{ animationDelay: `${app.promptDelay}s` }}
          >
            <div className="absolute inset-0 flex items-center pl-3 pr-9">
              <span
                className="hpd-prompt-text inline-block overflow-hidden whitespace-nowrap text-[11.5px] leading-none text-white/95"
                style={{
                  animationDelay: `${app.promptDelay}s`,
                  // Sized to the prompt's character count so the
                  // typing reveal stops at the last character and
                  // the caret sits right after it. Slight overshoot
                  // (+0.5ch) buffers proportional-font widths.
                  ["--type-w"]: `${app.prompt.length + 0.5}ch`,
                }}
              >
                {app.prompt}
              </span>
              <span
                className="hpd-prompt-caret ml-[1px] inline-block h-3 w-[1.5px] bg-white/85"
                style={{ animationDelay: `${app.promptDelay}s` }}
              />
            </div>
            {/* Shimmer overlay — sits on top of the typed prompt
                during the "generating" phase, signalling that the
                AI is producing the app. */}
            <span
              className="hpd-prompt-shimmer absolute inset-0 rounded-md"
              style={{ animationDelay: `${app.promptDelay}s` }}
            />
          </div>
        ))}

        {/* Teaser idle — comes in after the three apps. A blinking
            cursor at the start of the input followed by a grayed-out
            hint, like an empty input waiting for the next idea. */}
        <div
          className="hpd-prompt-line-stay absolute inset-0 flex items-center pl-3 pr-9"
          style={{ animationDelay: `${TEASER.delay}s` }}
        >
          <span className="hpd-caret-blink mr-1.5 inline-block h-3 w-[1.5px] bg-white/85" />
          <span className="text-[11.5px] leading-none text-white/35">
            {TEASER.hint}
          </span>
        </div>
        <div className="absolute right-1.5 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-[5px] text-white/65">
          <ArrowIcon className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
}

// ── Sidebar entry ──────────────────────────────────────────────────

function SidebarEntry({ iconSrc, label, animate, animationDelay, active }) {
  return (
    <div
      className={[
        "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[12.5px] leading-none transition-colors",
        active
          ? "bg-white/[0.06] text-white/95"
          : "text-white/65 hover:text-white/85",
        animate ? "hpd-entry" : "",
      ].join(" ")}
      style={animate ? { animationDelay: `${animationDelay}s` } : undefined}
    >
      <SvgIcon src={iconSrc} className="h-[14px] w-[14px] shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────

export function HeroPromptToApp() {
  return (
    <div
      aria-hidden="true"
      className="hpd-stage pointer-events-none relative w-full"
    >
      <div
        className="mx-auto w-full max-w-[1024px] overflow-hidden rounded-t-2xl border border-b-0 border-white/[0.10] bg-[#0e0e0e]"
        style={{
          height: "640px",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.04) inset, 0 -16px 80px rgba(0,0,0,0.5)",
        }}
      >
        {/* Window chrome */}
        <div className="flex h-9 items-center gap-1.5 border-b border-white/[0.06] bg-[#0a0a0a] px-3.5">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="ml-3 text-[10px] leading-none text-white/40">
            brandmages.client
          </span>
        </div>

        <div className="flex h-[calc(100%-36px)]">
          {/* Sidebar */}
          <aside className="hidden w-[220px] shrink-0 flex-col border-r border-white/[0.06] bg-[#0a0a0a] p-3 md:flex">
            {/* Brand row — uses BrandMages mark with invert so the
                black mark + white shapes flip to white mark + black
                shapes for higher contrast on dark mode. */}
            <div className="mb-3 flex items-center gap-2 px-1">
              <img
                src="/logos/brandmages.svg"
                alt=""
                aria-hidden="true"
                width={16}
                height={16}
                className="h-[16px] w-[16px] shrink-0 rounded-[3px]"
                style={{ filter: "invert(1)" }}
              />
              <span className="text-[12.5px] font-medium text-white/95">
                BrandMages
              </span>
            </div>

            <div className="space-y-0.5">
              <SidebarEntry iconSrc="/Icons/clienthome.svg" label="Home" />
              <SidebarEntry iconSrc="/Icons/messages.svg" label="Messages" />
              {APPS.map((app, i) => {
                const isLast = i === APPS.length - 1;
                return (
                  <SidebarEntry
                    key={app.id}
                    iconSrc={app.iconSrc}
                    label={app.label}
                    animate
                    animationDelay={app.entryDelay}
                    active={isLast}
                  />
                );
              })}
            </div>
          </aside>

          {/* Main view — flex-col so each preview can pin its own
              PanelHeader to the top of the area. */}
          <main className="relative flex-1 overflow-hidden">
            <div className="hpd-welcome absolute inset-0 flex flex-col">
              <MainViewWelcome />
            </div>
            <div
              className="hpd-main-fade absolute inset-0 flex flex-col"
              style={{ animationDelay: `${APPS[0].mainDelay}s` }}
            >
              <OnboardingPreview />
            </div>
            <div
              className="hpd-main-fade absolute inset-0 flex flex-col"
              style={{ animationDelay: `${APPS[1].mainDelay}s` }}
            >
              <PaymentsPreview />
            </div>
            <div
              className="hpd-main-stay absolute inset-0 flex flex-col"
              style={{ animationDelay: `${APPS[2].mainDelay}s` }}
            >
              <HelpdeskPreview />
            </div>
          </main>
        </div>
      </div>

      {/* Composer — anchored relative to the portal frame's right
          edge (not the viewport) so as the viewport resizes, the
          composer stays in the same position relative to the portal
          and just smoothly slides toward the right edge once the
          portal's max-width caps. The clamp ensures it never drifts
          off-screen on narrower viewports: when the stage is wider
          than the portal cap, the composer overflows the portal by a
          fixed 60px; once the stage shrinks below that threshold,
          the composer snaps to a 16px inset from the stage's right
          edge instead of going negative. Hidden below md where the
          sidebar is collapsed and there's no room to overlap. */}
      <div
        className="pointer-events-none absolute z-20 hidden w-[300px] md:block lg:w-[320px]"
        style={{
          top: "120px",
          right: "max(16px, calc((100% - 1024px) / 2 - 60px))",
          boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
          borderRadius: "12px",
        }}
      >
        <VibeComposer />
      </div>
    </div>
  );
}
