"use client";

// HeroPromptToAppV8 — light-mode variant of the prompt-to-app visual.
//
// Two-column layout inside one card:
//  Left  — chat: the user prompt that's already been sent, then the AI
//          response + plan bullets, with a follow-up input pinned to
//          the bottom.
//  Right — the generated app preview itself: a tabbed URL bar
//          (Internal / Client) sits on top of a Time Tracker UI, no
//          surrounding studio sidebar.

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
const PaperclipIcon = (p) => (
  <StrokeIcon {...p} d="M11 4l-5 5a2.5 2.5 0 003.5 3.5l5-5a4 4 0 00-5.5-5.5l-5 5" />
);
const LinkIcon = (p) => (
  <StrokeIcon
    {...p}
    d="M6.5 9.5l3-3M5 11a2.5 2.5 0 010-3.5l2-2M11 5a2.5 2.5 0 010 3.5l-2 2"
  />
);
const PlayIcon = (p) => (
  <StrokeIcon {...p} d="M5 3.5l7 4.5-7 4.5z" />
);
const RefreshIcon = (p) => (
  <StrokeIcon
    {...p}
    d="M3 8a5 5 0 015-5 5 5 0 014.5 3M13 8a5 5 0 01-5 5 5 5 0 01-4.5-3M11 4h2V2M5 12H3v2"
  />
);
const ExternalIcon = (p) => (
  <StrokeIcon {...p} d="M9 3h4v4M13 3L7 9M11 8v5H3V5h5" />
);
const MobileIcon = (p) => (
  <StrokeIcon {...p} d="M5 2h6v12H5zM7 12h2" />
);

const PROMPT =
  "Build a time tracking app to log hours, track work across clients and projects, and generate clear reports for billing and productivity insights. Include timers, manual entries, and weekly summaries.";

const AI_RESPONSE = "I set up the core structure for your Time Tracker";

const PLAN_BULLETS = [
  "Time entries (log and edit work)",
  "Daily summary (hours tracked per day)",
  "Activity dashboard (real-time insights)",
  "Reporting (trends over time)",
];

const T = {
  promptStart: 0,
  dotsStart: 0.7,
  aiResponse: 2.7,
  planTitle: 3.0,
  planBulletStagger: 0.22,
  previewEntry: 4.4,
  shimmerStart: 2.7,
  shimmerMainDuration: 2.3,
};

function TimeTrackerPreviewLight() {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="flex min-w-0 flex-1 flex-col items-center justify-start gap-6 px-6 pt-10 md:pt-14">
        <div className="text-center">
          <h3 className="text-[20px] font-medium leading-tight tracking-[-0.01em] text-[#101010] md:text-[24px]">
            Marketing opportunity
          </h3>
          <p className="mt-2 max-w-[440px] text-[12.5px] leading-[1.5] text-[#101010]/55">
            Our best client portal and platform every created and maker this
            even bet
          </p>
        </div>

        <div className="w-full max-w-[520px]">
          <div className="rounded-xl border border-black/[0.08] bg-black/[0.02] aspect-[16/9]" />
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-black/[0.10] text-[#101010]/55">
              <StrokeIcon d="M10 4L6 8l4 4" className="h-3 w-3" />
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1 w-1 rounded-full bg-black/20" />
              <span className="h-1 w-1 rounded-full bg-black/20" />
              <span className="h-1 w-1 rounded-full bg-black/20" />
              <span className="h-1 w-6 rounded-full bg-[#101010]" />
              <span className="h-1 w-1 rounded-full bg-black/20" />
              <span className="h-1 w-1 rounded-full bg-black/20" />
              <span className="h-1 w-1 rounded-full bg-black/20" />
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-black/[0.10] text-[#101010]/55">
              <StrokeIcon d="M6 4l4 4-4 4" className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroPromptToAppV8() {
  return (
    <div
      aria-hidden="true"
      className="hsv-stage pointer-events-none relative w-full"
    >
      <div
        className="mx-auto h-[640px] w-full max-w-[1180px] overflow-hidden rounded-t-2xl border border-b-0 border-black/[0.08] bg-white"
        style={{
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.6) inset, 0 -16px 80px rgba(16,16,16,0.08)",
        }}
      >
        <div className="flex h-full flex-row">
          {/* ── Chat column (left) ──────────────────────────── */}
          <section className="relative flex flex-1 flex-col lg:w-[380px] lg:flex-initial lg:shrink-0 lg:border-r lg:border-black/[0.06]">
            <div className="flex h-10 shrink-0 items-center border-b border-black/[0.06] px-4">
              <span className="flex items-center gap-1.5 text-[12px] text-[#101010]/85">
                Time Tracker
                <ChevronDown className="h-3 w-3 text-[#101010]/45" />
              </span>
            </div>

            <div className="relative flex-1 overflow-hidden px-4 pt-4">
              <div
                className="hsv-fade-in rounded-xl border border-black/[0.06] bg-black/[0.025] p-3 text-[11.5px] leading-[1.55] text-[#101010]/85"
                style={{ animationDelay: `${T.promptStart}s` }}
              >
                {PROMPT}
              </div>

              <div
                className="hsv-dots mt-3 flex items-center gap-1 px-1"
                style={{ animationDelay: `${T.dotsStart}s` }}
              >
                {[0, 0.18, 0.36].map((d) => (
                  <span
                    key={d}
                    className="hsv-dot inline-block h-1.5 w-1.5 rounded-full bg-[#101010]/55"
                    style={{ animationDelay: `${T.dotsStart + d}s` }}
                  />
                ))}
              </div>

              <div
                className="hsv-fade-in mt-3 flex items-center gap-1.5 text-[11.5px] text-[#101010]/85"
                style={{ animationDelay: `${T.aiResponse}s` }}
              >
                <span className="truncate">{AI_RESPONSE}</span>
                <span className="text-[#101010]/45">
                  <StrokeIcon d="M6 4l4 4-4 4" className="h-3 w-3" />
                </span>
              </div>

              <div
                className="hsv-fade-in mt-3 text-[11px] leading-[1.55] text-[#101010]/65"
                style={{ animationDelay: `${T.planTitle}s` }}
              >
                Here&apos;s a structured plan for your Time Tracker:
              </div>
              <div
                className="hsv-fade-in mt-2 text-[11.5px] font-medium text-[#101010]"
                style={{ animationDelay: `${T.planTitle + 0.1}s` }}
              >
                Core Modules
              </div>

              <ul className="mt-1 space-y-1 pl-1">
                {PLAN_BULLETS.map((b, i) => (
                  <li
                    key={i}
                    className="hsv-fade-in flex gap-2 text-[11px] leading-[1.5] text-[#101010]/75"
                    style={{
                      animationDelay: `${
                        T.planTitle + 0.3 + i * T.planBulletStagger
                      }s`,
                    }}
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#101010]/55" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div
                className="hsv-fade-in mt-3 rounded-lg border border-black/[0.06] bg-black/[0.02] px-3 py-2"
                style={{
                  animationDelay: `${
                    T.planTitle +
                    0.3 +
                    PLAN_BULLETS.length * T.planBulletStagger
                  }s`,
                }}
              >
                <div className="mb-1.5 flex items-center gap-1.5 text-[10.5px] text-[#101010]/55">
                  <LinkIcon className="h-3 w-3" />
                  References
                  <span className="ml-auto text-[#101010]/35">2 results</span>
                </div>
                <div className="space-y-1 text-[10px] leading-[1.4] text-[#101010]/55">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">Time-tracking patterns</span>
                    <span className="font-mono text-[#101010]/35">linear.app</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">Dashboard inspiration</span>
                    <span className="font-mono text-[#101010]/35">stripe.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 px-4 pb-4 pt-3">
              <div className="rounded-xl border border-black/[0.08] bg-white p-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[#101010]/45">
                    <PaperclipIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex-1 text-[11px] text-[#101010]/40">
                    How might you improve your app?
                  </span>
                  <span className="rounded-md bg-[#101010] px-2 py-1 text-[10px] font-medium text-white">
                    Build app
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Generated app preview (right) ──────────────── */}
          <div className="relative hidden flex-1 flex-col lg:flex">
            {/* URL bar with Internal / Client tabs */}
            <div className="flex h-10 shrink-0 items-center gap-3 border-b border-black/[0.06] px-3">
              <div className="flex items-center gap-0 rounded-md border border-black/[0.08] bg-white p-[2px] text-[10.5px]">
                <span className="rounded-[4px] bg-[#101010]/[0.06] px-2 py-[3px] text-[#101010]">
                  Internal
                </span>
                <span className="px-2 py-[3px] text-[#101010]/55">Client</span>
              </div>
              <div className="flex flex-1 items-center gap-2 rounded-md border border-black/[0.08] bg-white px-2.5 py-[5px] text-[10.5px] text-[#101010]/65">
                <span className="truncate font-mono">
                  brandmages.assembly.com/timetracker
                </span>
                <span className="ml-auto flex items-center gap-1.5 text-[#101010]/45">
                  <RefreshIcon className="h-3 w-3" />
                  <ExternalIcon className="h-3 w-3" />
                  <MobileIcon className="h-3 w-3" />
                </span>
              </div>
            </div>

            <main className="relative flex-1 overflow-hidden bg-white">
              <div
                aria-hidden="true"
                className="absolute inset-4"
              >
                <div
                  className="hsv-shimmer h-full w-full"
                  style={{
                    ["--shimmer-delay"]: `${T.shimmerStart}s`,
                    ["--shimmer-duration"]: `${T.shimmerMainDuration}s`,
                    borderRadius: "10px",
                  }}
                />
              </div>
              <div
                className="hsv-portal-main absolute inset-0 flex flex-col"
                style={{ animationDelay: `${T.previewEntry}s` }}
              >
                <TimeTrackerPreviewLight />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
