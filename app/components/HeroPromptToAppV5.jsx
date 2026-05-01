"use client";

// HeroPromptToAppV5 — simplified, settled final frame of v4.
//
// v4 cycles three apps into the portal sidebar and lands on a final
// state with every app installed plus a "Build an app" row. v5 keeps
// only that final state: no cycle, no anticipate sparkle, no status
// toast, no panel-wide shimmer sweep. The sidebar's "Build an app"
// row pulses a continuous shimmer (no hover required) so the eye
// still has something to follow toward the next action.

const APPS = [
  { id: "time", label: "Time Tracker", iconSrc: "/Icons/clock-three.svg" },
  { id: "helpdesk", label: "Helpdesk", iconSrc: "/Icons/helpdesk.svg" },
  { id: "payments", label: "Payments", iconSrc: "/Icons/payments.svg" },
];

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

const PlusIcon = ({ className = "h-3 w-3" }) => (
  <svg
    viewBox="0 0 16 16"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 3v10M3 8h10" />
  </svg>
);

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

function PanelHeader({ title }) {
  return (
    <div className="flex h-9 shrink-0 items-center gap-2 border-b border-white/[0.06] px-4">
      <span className="truncate text-[12px] font-medium text-white/85">
        {title}
      </span>
    </div>
  );
}

function SidebarRow({ iconSrc, label }) {
  return (
    <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] leading-none text-white/65">
      <MaskIcon src={iconSrc} className="h-3 w-3 shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  );
}

// Continuous-shimmer "Build an app" row. Same dashed chrome as v4's
// final-state version, but the sweep is driven by a CSS keyframe
// (.v5-build-shimmer) so it loops forever without needing a hover.
function BuildAppRow() {
  return (
    <div className="pointer-events-none relative mt-3 flex items-center gap-2 overflow-hidden rounded-md border border-dashed border-white/35 bg-white/[0.05] px-2 py-1 text-[11px] leading-none text-white/95">
      <span className="relative z-[1] flex h-3 w-3 shrink-0 items-center justify-center text-current">
        <PlusIcon className="h-3 w-3" />
      </span>
      <span className="relative z-[1] truncate">Build an app</span>
      <span aria-hidden="true" className="v5-build-shimmer" />
    </div>
  );
}

function BuildAppView() {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <PanelHeader title="Build an app" />
      <div className="flex flex-1 flex-col items-center gap-3 px-8 pt-12 text-center">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.04] text-white/55"
        >
          <SparkleIcon className="h-3.5 w-3.5" />
        </span>
        <div className="text-[12.5px] font-medium text-white/65">
          Ready for your next app?
        </div>
        <div className="max-w-[240px] text-[11px] leading-[1.5] text-white/35">
          Describe what you need and Assembly builds it into your client portal.
        </div>
      </div>
    </div>
  );
}

export function HeroPromptToAppV5() {
  return (
    <div aria-hidden="true" className="pointer-events-none relative w-full">
      <div className="relative mx-auto w-full max-w-[1080px]">
        <div
          className="relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#17181a]"
          style={{ height: "min(58vh, 560px)" }}
        >
          <div className="grid h-full min-w-0 grid-cols-[180px_1fr] gap-0">
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
                {APPS.map((a) => (
                  <SidebarRow
                    key={a.id}
                    iconSrc={a.iconSrc}
                    label={a.label}
                  />
                ))}
                <BuildAppRow />
              </div>
            </div>

            <div className="relative h-full min-w-0">
              <BuildAppView />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
