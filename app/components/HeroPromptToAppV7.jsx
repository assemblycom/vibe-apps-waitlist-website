"use client";

// HeroPromptToAppV7 — light-mode variant of v6. Same prompt-to-portal
// narrative, animation timings, and component structure; only the
// chromatic surface flips:
//
//   #101010 dark card           → #FFFFFF white card
//   white text, white-alpha     → near-black text + black-alpha tints
//   white-alpha shimmer         → black-alpha shimmer (.hpv7-build-shimmer)
//
// Card sits as a near-white surface on the same dark page background,
// so the contrast against the rest of the section reads like a printed
// product spec inset into a dark chapter (Linear / Stripe ethos) rather
// than a dark UI on a dark page.

import { useEffect, useState } from "react";

// ── Icon helpers ──────────────────────────────────────────────────

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

// BrandMages mark — three stacked rounded shelves taken from
// /logos/brandmages-mark.svg. Inlined so the symbol can be painted in
// any currentColor and never drags along a background plate.
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
    prompt:
      "Build a time tracker where the team can log work and associate it with clients",
    main: <TimeTrackerView />,
  },
  {
    id: "helpdesk",
    label: "Helpdesk",
    iconSrc: "/Icons/helpdesk.svg",
    prompt:
      "Build a helpdesk where clients can submit tickets and follow along for progress",
    main: <HelpdeskView />,
  },
  {
    id: "community",
    label: "Community",
    iconSrc: "/Icons/globe.svg",
    prompt:
      "Build a community where clients can post and interact with each other",
    main: <CommunityView />,
  },
];

const BUILT_IN = [
  { id: "home", label: "Home", iconSrc: "/Icons/clienthome.svg" },
  { id: "messages", label: "Messages", iconSrc: "/Icons/messages.svg" },
];

// ── Timing (ms within one cycle) ─────────────────────────────────
//
// Tuned so the slot-in moment dominates the cycle: shorter typing
// window so we get to SEND faster, then a longer FLY window for the
// row entrance to read as the centerpiece, then a generous HOLD so
// the resulting app stays on screen long enough to be readable.

const CYCLE_MS = 10500;
const TYPE_START = 400;
const TYPE_END = 3000;
const SEND = 3500;
const FLY_END = 5000;
const HOLD_END = 9500;
const RESET_PAUSE = 1800;

// ── Hooks ────────────────────────────────────────────────────────

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

// ── Sub-views (right-side main panel content per app) ────────────

function PanelHeader({ title }) {
  return (
    <div className="flex h-9 shrink-0 items-center gap-2 border-b border-black/[0.06] px-4">
      <span className="truncate text-[12px] font-medium text-black/85">
        {title}
      </span>
    </div>
  );
}

function HomeEmpty() {
  // Quiet Home — no CTA, no instructional copy. Just a placeholder
  // that occupies the canvas before the first app slots in. The
  // sidebar appearing alongside it carries the integration story; the
  // main view doesn't need to repeat it.
  return (
    <div className="flex h-full min-w-0 flex-col">
      <PanelHeader title="Home" />
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="text-[12.5px] font-medium text-black/55">
          BrandMages
        </div>
        <div className="mt-1 text-[10.5px] text-black/30">
          Your branded client portal
        </div>
      </div>
    </div>
  );
}

function TimeTrackerView() {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <PanelHeader title="Time Tracker" />
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div className="flex min-w-0 items-center gap-3 rounded-xl border border-black/[0.08] bg-black/[0.03] p-3">
          <span className="whitespace-nowrap font-mono text-[18px] leading-none tracking-tight text-black/85">
            02:34:18
          </span>
        </div>
        <div className="space-y-1.5">
          {[
            { client: "Acme", task: "Brand sprint kickoff", time: "1h 20m" },
            { client: "Lyra", task: "Wireframe review", time: "0h 55m" },
          ].map((row, i) => (
            <div
              key={i}
              className="flex min-w-0 items-center gap-2 rounded-lg border border-black/[0.06] bg-black/[0.025] px-3 py-2"
            >
              <span className="shrink-0 text-[10.5px] font-medium text-black/80">
                {row.client}
              </span>
              <span className="shrink-0 text-[10.5px] text-black/45">·</span>
              <span className="min-w-0 flex-1 truncate text-[10.5px] text-black/65">
                {row.task}
              </span>
              <span className="shrink-0 whitespace-nowrap font-mono text-[10px] leading-none text-black/80">
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
      <PanelHeader title="Helpdesk" />
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        {[
          { client: "Acme", subject: "Logo file missing from latest delivery" },
          { client: "Lyra", subject: "Question about brand guideline section 3" },
        ].map((row, i) => (
          <div
            key={i}
            className="flex min-w-0 items-center gap-2 rounded-lg border border-black/[0.06] bg-black/[0.025] px-3 py-2"
          >
            <span className="shrink-0 text-[10.5px] font-medium text-black/80">
              {row.client}
            </span>
            <span className="shrink-0 text-[10.5px] text-black/45">·</span>
            <span className="min-w-0 flex-1 truncate text-[10.5px] text-black/65">
              {row.subject}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommunityView() {
  // Two posts. Avatars are first-letter chips so the chrome stays
  // self-contained (no extra image requests) but the row reads as a
  // forum/community thread rather than a generic list.
  return (
    <div className="flex h-full min-w-0 flex-col">
      <PanelHeader title="Community" />
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        {[
          {
            initial: "M",
            name: "Maya · Acme",
            body: "Anyone else seeing the new brand kit show up in their portal?",
            replies: "4 replies",
          },
          {
            initial: "J",
            name: "Jordan · Lyra",
            body: "Tip: paste your guideline section number in helpdesk for faster routing.",
            replies: "2 replies",
          },
        ].map((p, i) => (
          <div
            key={i}
            className="flex min-w-0 gap-2.5 rounded-lg border border-black/[0.06] bg-black/[0.025] px-3 py-2"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/10 text-[10px] font-medium text-black/85">
              {p.initial}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[10.5px] font-medium text-black/80">
                {p.name}
              </span>
              <span className="truncate text-[10.5px] leading-[1.35] text-black/65">
                {p.body}
              </span>
              <span className="text-[9.5px] text-black/40">{p.replies}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Sidebar primitives ───────────────────────────────────────────

function SidebarRow({ iconSrc, label, active, muted, entryT }) {
  // entryT: 0..1 across the SEND → FLY_END window for the just-
  // installed row (null otherwise). This animation is the hero of
  // the visual — the "your app appears in the portal" moment — so
  // the overshoot is bigger and the glow brighter than a typical
  // list-enter. Built-in rows never receive entryT.
  let style = {};
  if (entryT !== null && entryT !== undefined) {
    let opacity = 0;
    let scale = 0.78;
    let glow = 0;
    if (entryT < 0.18) {
      opacity = 0;
      scale = 0.78;
    } else if (entryT < 0.42) {
      const p = (entryT - 0.18) / 0.24;
      opacity = p;
      scale = 0.78 + p * 0.28; // → 1.06 (overshoot)
      glow = p;
    } else if (entryT < 0.65) {
      const p = (entryT - 0.42) / 0.23;
      opacity = 1;
      scale = 1.06 - p * 0.06; // 1.06 → 1
      glow = 1;
    } else {
      const p = (entryT - 0.65) / 0.35;
      opacity = 1;
      scale = 1;
      glow = 1 - p;
    }
    style = {
      opacity,
      transform: `scale(${scale})`,
      // Brighter ring + drop so the slot-in moment carries the eye.
      boxShadow: `0 0 0 ${glow * 2}px rgba(0,0,0,${glow * 0.10}), 0 6px 22px rgba(0,0,0,${glow * 0.08})`,
    };
  }
  return (
    <div
      className={[
        "flex items-center gap-2 rounded-md px-2 py-2 text-[11px] leading-none transition-colors duration-300",
        active
          ? "bg-black/[0.07] text-[#0A0A0A]"
          : muted
          ? "text-black/55"
          : "text-black/75",
      ].join(" ")}
      style={style}
    >
      <MaskIcon src={iconSrc} className="h-3 w-3 shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────

export function HeroPromptToAppV7() {
  const now = useCycleClock();

  const totalMs = CYCLE_MS * APPS.length + RESET_PAUSE;
  const elapsed = now % totalMs;
  const inResetPause = elapsed >= CYCLE_MS * APPS.length;
  const cycleIndex = inResetPause
    ? APPS.length - 1
    : Math.floor(elapsed / CYCLE_MS);
  const cycleT = inResetPause ? CYCLE_MS : elapsed % CYCLE_MS;
  const app = APPS[cycleIndex];

  const sent = cycleT >= FLY_END;
  const promptText = typed(app.prompt, cycleT);
  const showCursor = cycleT >= TYPE_START && cycleT < SEND;

  // Send-button state: just disabled → active at TYPE_END. The button
  // brightens (and the icon along with it) so it reads as "armed" once
  // the prompt finishes typing. No click/press animation — that beat
  // read as distracting; the bg transition alone carries enough of a
  // signal that the prompt is going through.
  const ready = cycleT >= TYPE_END;

  // Sidebar fill: how many of APPS have been installed so far.
  let installed = cycleIndex;
  if (sent) installed = cycleIndex + 1;
  if (inResetPause) installed = APPS.length;

  // Just-installed row's entry progress (drives the pop + glow).
  const entryT =
    cycleT >= SEND && cycleT < FLY_END
      ? (cycleT - SEND) / (FLY_END - SEND)
      : cycleT >= FLY_END
      ? 1
      : null;

  // Building shimmer — telegraphs that the new app is being assembled
  // between SEND and FLY_END. Sidebar slot opacity tracks entryT (the
  // shimmer hands off to the real row exactly as it pops in); the main
  // canvas opacity rides the same window so the two beats stay in sync.
  let buildShimmerSidebar = 0;
  let buildShimmerMain = 0;
  if (cycleT >= SEND && cycleT < FLY_END) {
    const p = (cycleT - SEND) / (FLY_END - SEND);
    // Quick fade-in (200ms-equivalent ≈ first 13% of the window) then a
    // gentle ease-out so the shimmer is gone before the row scale lands
    // at 1 — no visual collision between placeholder and real content.
    const fadeIn = Math.min(1, p / 0.13);
    const fadeOut = 1 - Math.max(0, (p - 0.55) / 0.45);
    buildShimmerSidebar = Math.max(0, fadeIn * fadeOut);
    buildShimmerMain = Math.max(0, fadeIn * fadeOut);
  }

  // Active app in main panel: the latest one that's been sent.
  const showHome = !sent && cycleIndex === 0;
  const activeApp = sent ? app : cycleIndex > 0 ? APPS[cycleIndex - 1] : null;

  return (
    <div aria-hidden="true" className="pointer-events-none relative w-full">
      {/* Single combined card on a near-white surface (#FFFFFF), sitting
          on the page's dark #101010 background. The contrast between
          the card and the page is the framing — a thin black-alpha
          border + a soft drop shadow anchor it. Both halves of the
          card share the same white surface; the vertical divider
          carries the seam, same Linear-style flat treatment as v6
          (just inverted in tone). */}
      {/* Layout is responsive:
          - <lg: just the composer, no card frame. The bordered card
            on mobile read as an empty container around a single
            input — like a UI mistake — so on phones we render the
            composer directly with no surrounding border, bg, or
            rounded corners.
          - lg+: original 1100×min(50vh,480px) two-column card with
            composer on the left and BrandMages portal on the right. */}
      <div
        className="relative mx-auto w-full max-w-[1100px] overflow-hidden lg:h-[min(50vh,480px)] lg:rounded-t-2xl lg:border lg:border-black/[0.08] lg:bg-white lg:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]"
      >
        <div className="flex flex-col lg:grid lg:h-full lg:grid-cols-[1fr_1.25fr] lg:gap-0">
          {/* Composer: free-standing on mobile, left column at lg+. */}
          <div className="relative flex min-w-0 flex-col lg:h-full lg:border-r lg:border-black/[0.09] lg:bg-white">
            <div className="flex min-w-0 flex-1 flex-col items-center px-6 lg:pt-16">
              {/* Composer width: wider on mobile/tablet (where this is
                  the whole hero visual and a 320px box would leave a
                  big empty band on either side) and back to the
                  original 320px at lg+ where it lives in the left
                  half of the 2-column card. */}
              <div className="w-full max-w-[420px] md:max-w-[520px] lg:max-w-[320px]">
                {/* Header above the composer — names the surface so
                    the prompt box doesn't sit alone with no framing. */}
                <div className="mb-3 text-[12px] font-medium text-black/65 lg:mb-2.5">
                  Build an app
                </div>

                <div className="rounded-xl border border-black/[0.08] bg-black/[0.02] px-3 py-2.5">
                  {/* min-h reserves space for the longest wrapped
                      prompt (2 lines at this font/width across all
                      three apps in the cycle) so the field doesn't
                      visibly grow while characters type in. */}
                  <div className="min-h-[42px] text-[13px] leading-[1.5] text-black/85">
                    {promptText || (
                      <span className="text-black/30">
                        Build a time tracker for my team…
                      </span>
                    )}
                    {showCursor && (
                      <span className="ml-[1px] inline-block h-[13px] w-[1px] -translate-y-[1px] animate-pulse bg-black/85 align-middle" />
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-end">
                    {/* Disabled → active transition only at TYPE_END.
                        bg + color ease over 220ms when ready flips. */}
                    <span
                      style={{
                        transition:
                          "background-color 220ms ease, color 220ms ease",
                      }}
                      className={[
                        "flex h-6 w-6 items-center justify-center rounded-full",
                        ready
                          ? "bg-black/25 text-black/95"
                          : "bg-black/10 text-black/55",
                      ].join(" ")}
                    >
                      <ArrowIcon className="h-3 w-3" />
                    </span>
                  </div>
                </div>

                {/* Suggestion chips — one per cycling app. The chip for
                    the app currently being demoed in the cycle is
                    highlighted (border + bg lift) so the row feels
                    connected to whatever the prompt is typing right
                    now, instead of a static decoration. */}
                <div className="mt-3 flex flex-wrap items-center justify-start gap-2">
                  {APPS.map((a, i) => {
                    const isCurrent = i === cycleIndex;
                    return (
                      <span
                        key={a.id}
                        style={{
                          transition:
                            "background-color 220ms ease, border-color 220ms ease, color 220ms ease",
                        }}
                        className={[
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] leading-none",
                          isCurrent
                            ? "border-black/[0.18] bg-black/[0.05] text-black/85"
                            : "border-black/[0.08] bg-transparent text-black/55",
                        ].join(" ")}
                      >
                        <MaskIcon
                          src={a.iconSrc}
                          className="h-3 w-3 shrink-0"
                        />
                        {a.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Portal: hidden on mobile (the composer is the whole hero
              visual on phones), right column at lg+. */}
          <div className="relative hidden h-full min-w-0 flex-col bg-white lg:flex">
            <div className="grid h-full min-h-0 grid-cols-[180px_1fr] gap-0">
              {/* Sidebar — flat list: BrandMages, Home, Messages,
                  installed apps. The slot-in motion carries the
                  integration story; no section headers needed. */}
              <div className="flex h-full min-w-0 flex-col border-r border-black/[0.05] p-3">
                <div className="mb-3 flex items-center gap-2 px-2 py-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-black/[0.08] text-black/85">
                    <BrandMagesMark className="h-3 w-3" />
                  </span>
                  <span className="truncate text-[12px] font-medium text-black/90">
                    BrandMages
                  </span>
                </div>

                <div className="space-y-1">
                  {BUILT_IN.map((b) => (
                    <SidebarRow
                      key={b.id}
                      iconSrc={b.iconSrc}
                      label={b.label}
                      muted
                    />
                  ))}
                  {APPS.slice(0, installed).map((a, i) => (
                    <SidebarRow
                      key={a.id}
                      iconSrc={a.iconSrc}
                      label={a.label}
                      active={activeApp && a.id === activeApp.id}
                      entryT={i === cycleIndex ? entryT : null}
                    />
                  ))}
                  {/* Building placeholder — sits in the next sidebar
                      slot during SEND→FLY_END so the operator can see
                      "an app is being assembled here" before the real
                      row pops in. Fades out as the row scales up. Only
                      rendered while there is still room (i.e. not on
                      the last app's reset pause). */}
                  {buildShimmerSidebar > 0 && installed < APPS.length && (
                    <div
                      style={{ opacity: buildShimmerSidebar }}
                      className="px-2 py-2"
                    >
                      <div className="hpv7-build-shimmer h-3 w-full rounded-md" />
                    </div>
                  )}
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
                  const isActive =
                    !showHome && activeApp && a.id === activeApp.id;
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
                {/* Building shimmer over the main canvas. Reads as
                    "the new app is being assembled here" while the
                    sidebar row is still flying in. Spans the full
                    panel (inset-0, rounded-none) so the sweep reaches
                    the outer card's right border instead of stopping
                    12px short, which read as truncated. The card's
                    own border carries the framing. */}
                {buildShimmerMain > 0 && (
                  <div
                    aria-hidden="true"
                    className="hpv7-build-shimmer pointer-events-none absolute inset-0"
                    style={{ opacity: buildShimmerMain }}
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
