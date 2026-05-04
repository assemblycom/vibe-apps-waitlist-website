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
const CheckIcon = (p) => <StrokeIcon {...p} d="M3.5 8.5l3 3 6-6.5" />;

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
    slug: "time-tracker",
    iconSrc: "/Icons/clock-three.svg",
    // clock-three.svg fills more of its viewBox than the chat glyph,
    // so render it a step smaller to match the Messages row visually.
    iconClass: "h-3 w-3",
    prompt:
      "Build a time tracker where the team can log work and associate it with clients",
    main: <TimeTrackerView />,
  },
  {
    id: "helpdesk",
    label: "Helpdesk",
    slug: "helpdesk",
    iconSrc: "/Icons/helpdesk.svg",
    prompt:
      "Build a helpdesk where clients can submit tickets and follow along for progress",
    main: <HelpdeskView />,
  },
  {
    id: "community",
    label: "Community",
    slug: "community",
    iconSrc: "/Icons/globe.svg",
    prompt:
      "Build a community where clients can post and interact with each other",
    main: <CommunityView />,
  },
];

// iconClass per row: the source SVGs render at slightly different
// optical sizes inside the same h-w container (the home/clock glyphs
// fill more of their viewBox than the chat glyph), so without a
// per-icon override they look mismatched in the sidebar. Setting the
// home + clock to a touch smaller normalizes the visual weight to the
// Messages icon, which uses the default h-3.5 (14px).
const BUILT_IN = [
  {
    id: "home",
    label: "Home",
    iconSrc: "/Icons/clienthome.svg",
    iconClass: "h-3 w-3",
  },
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
// Each view renders content directly with no panel header — the
// browser-window URL bar above already names the page (the slug
// updates per app), so a separate "Time Tracker" / "Helpdesk" header
// inside the canvas just stuttered the title.

function HomeEmpty() {
  // Quiet Home — no CTA, no instructional copy. Just a placeholder
  // that occupies the canvas before the first app slots in. The
  // sidebar appearing alongside it carries the integration story; the
  // main view doesn't need to repeat it.
  return (
    <div className="flex h-full min-w-0 flex-col">
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
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div className="flex min-w-0 items-center gap-3 rounded border border-black/[0.08] bg-black/[0.03] p-3">
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
              className="flex min-w-0 items-center gap-2 rounded border border-black/[0.06] bg-black/[0.025] px-3 py-2"
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
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        {[
          { client: "Acme", subject: "Logo file missing from latest delivery" },
          { client: "Lyra", subject: "Question about brand guideline section 3" },
        ].map((row, i) => (
          <div
            key={i}
            className="flex min-w-0 items-center gap-2 rounded border border-black/[0.06] bg-black/[0.025] px-3 py-2"
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
  // Two posts. Avatars are two-letter monogram chips (first + last
  // name initials) so the chrome stays self-contained (no extra image
  // requests) and the row reads as a real social/forum thread rather
  // than a generic list.
  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        {[
          {
            initials: "MP",
            name: "Maya Patel",
            body: "Anyone else seeing the new brand kit show up in their portal?",
            replies: "4 replies",
          },
          {
            initials: "JB",
            name: "Jordan Brooks",
            body: "Tip: paste your guideline section number in helpdesk for faster routing.",
            replies: "2 replies",
          },
        ].map((p, i) => (
          <div
            key={i}
            className="flex min-w-0 gap-2.5 rounded border border-black/[0.06] bg-black/[0.025] px-3 py-2"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/10 text-[9.5px] font-medium tracking-tight text-black/85">
              {p.initials}
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

function SidebarRow({ iconSrc, iconClass, label, active, muted, entryT }) {
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
        "flex items-center gap-2 rounded px-2 py-2 text-[11px] leading-none transition-colors duration-300",
        active
          ? "bg-black/[0.04] text-[#0A0A0A]"
          : muted
          ? "text-black/55"
          : "text-black/75",
      ].join(" ")}
      style={style}
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

  // Active app in main panel: the latest one that's been sent. On
  // initial load (first cycle, not yet sent) we wrap to the last app
  // in the list so the right pane is never empty — viewers always see
  // a fully populated generated-app preview, not a placeholder.
  const showHome = false;
  const activeApp = sent
    ? app
    : APPS[(cycleIndex - 1 + APPS.length) % APPS.length];

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
        className="relative mx-auto w-full max-w-[1100px] overflow-hidden lg:h-[min(78vh,720px)] lg:rounded-3xl lg:border lg:border-black/[0.08] lg:bg-white lg:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]"
      >
        <div className="flex h-full flex-col">
          {/* Body: composer left, embedded browser preview right. */}
          <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[1fr_1.25fr] lg:gap-0">
            {/* Composer column — chat-style builder. Sent prompt bubble
                at top, AI response line beneath it, follow-up input
                pinned to the bottom. The right column shows the
                resulting BrandMages portal preview. */}
            <div className="relative flex min-w-0 flex-col lg:h-full lg:border-r lg:border-black/[0.09]">
              <div className="flex min-w-0 flex-1 flex-col px-6 pt-2 lg:px-6 lg:pb-6 lg:pt-6">
                {/* Mobile-only inline label. */}
                <div className="mb-3 text-[12px] font-medium text-black/65 lg:hidden">
                  Build an app
                </div>

                {/* Conversation stack — each app in turn appears as a
                    sent prompt + status line (Building → Build
                    complete). Once an app finishes, the next prompt
                    lands beneath it so the column reads as a growing
                    chat thread. After all apps are built, the next
                    cycle resets back to a single prompt. */}
                {APPS.slice(0, inResetPause ? APPS.length : cycleIndex + 1).map(
                  (a, i) => {
                    const complete =
                      inResetPause ||
                      i < cycleIndex ||
                      (i === cycleIndex && cycleT >= FLY_END);
                    return (
                      <div key={a.id} className={i === 0 ? "" : "mt-5"}>
                        <div className="rounded-2xl bg-black/[0.05] px-4 py-3 text-[13px] leading-[1.5] text-black/85">
                          {a.prompt}
                        </div>
                        <div
                          className={`mt-3 flex items-center gap-2 text-[12.5px] ${
                            complete ? "text-black/70" : "text-black/55"
                          }`}
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-black/[0.08] text-black/85">
                            {complete ? (
                              <CheckIcon className="h-3 w-3" />
                            ) : (
                              <BrandMagesMark className="h-3 w-3" />
                            )}
                          </span>
                          <span>
                            {complete ? "Build complete" : "Building your app"}
                          </span>
                          {!complete && (
                            <span className="flex items-center gap-0.5">
                              <span className="studio-thinking-dot inline-block h-1 w-1 rounded-full bg-black/55" />
                              <span
                                className="studio-thinking-dot inline-block h-1 w-1 rounded-full bg-black/55"
                                style={{ animationDelay: "0.15s" }}
                              />
                              <span
                                className="studio-thinking-dot inline-block h-1 w-1 rounded-full bg-black/55"
                                style={{ animationDelay: "0.3s" }}
                              />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}

                {/* Spacer — pushes the follow-up input to the bottom. */}
                <div className="hidden flex-1 lg:block" />

                {/* Follow-up input — placeholder + dimmed send arrow.
                    No paperclip; this is a static visual. */}
                <div className="mt-6 hidden rounded-xl border border-black/[0.10] bg-white px-3.5 py-3 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.08)] lg:block">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 text-[13px] leading-[1.5] text-black/40">
                      How might you improve your app?
                    </div>
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/[0.04] text-black/30">
                      <ArrowIcon className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: a "canvas" tinted slightly off-white so the
                preview window inside it sits as a distinct surface
                (rounded on all four corners + soft shadow). Reads as a
                browser preview embedded *in* the build tool, not a
                sibling pane sharing the card's edges. Desktop only. */}
            <div className="relative hidden min-h-0 min-w-0 flex-col bg-black/[0.025] p-4 lg:flex">
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-black/[0.10] bg-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)]">
                {/* Browser chrome: traffic lights left, URL pill
                    centered, right-side spacer so the URL is
                    optically centered. */}
                <div className="flex h-8 shrink-0 items-center gap-3 border-b border-black/[0.06] bg-black/[0.02] px-3">
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-black/[0.12]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-black/[0.12]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-black/[0.12]" />
                  </div>
                  <div className="mx-auto flex h-5 max-w-[320px] flex-1 items-center justify-center rounded border border-black/[0.06] bg-white px-2.5 text-[11px] leading-none text-black/65">
                    <span className="truncate">
                      brandmages.assembly.com
                      {activeApp ? `/${activeApp.slug}` : ""}
                    </span>
                  </div>
                  <div className="w-[42px] shrink-0" />
                </div>

                <div className="grid min-h-0 flex-1 grid-cols-[180px_1fr] gap-0">
              {/* Sidebar — flat list: BrandMages, Home, Messages,
                  installed apps. The slot-in motion carries the
                  integration story; no section headers needed. */}
              <div className="flex h-full min-w-0 flex-col border-r border-black/[0.05] p-3">
                <div className="mb-3 flex items-center gap-2 px-2 py-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-black/[0.08] text-black/85">
                    <BrandMagesMark className="h-3.5 w-3.5" />
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
                      iconClass={b.iconClass}
                      label={b.label}
                      muted
                    />
                  ))}
                  {APPS.slice(0, installed).map((a, i) => (
                    <SidebarRow
                      key={a.id}
                      iconSrc={a.iconSrc}
                      iconClass={a.iconClass}
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
                      <div className="hpv7-build-shimmer h-3 w-full rounded" />
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
      </div>
    </div>
  );
}
