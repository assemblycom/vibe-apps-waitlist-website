"use client";

// HeroPromptToAppV11 — dark-mode sibling of v10. Same composition
// (composer at center, four corner-anchored fragments forming an
// intentional grid), but the cards adopt the navbar pill's visual
// language: dark translucent fill, faint white border, soft blur,
// premium shadow. Mobile keeps the four fragments visible in a 2×2
// grid below the composer instead of hiding them entirely, so the
// "prompt → app" beat reads on small screens too.

import { useEffect, useState } from "react";

const CELL = 80;

// ── Icons ─────────────────────────────────────────────────────────

function MaskIcon({ src, className = "h-3.5 w-3.5" }) {
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

const BrandMagesMark = ({ className = "h-3.5 w-3.5" }) => (
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

// ── Scenes (identical to v10) ────────────────────────────────────

const SCENES = [
  {
    id: "helpdesk",
    prompt: "Build a helpdesk where clients can submit tickets",
    metric: {
      label: "Open tickets",
      value: "24",
      delta: { dir: "down", text: "−3 today", positive: true },
      spark: [18, 22, 28, 26, 30, 27, 24],
    },
    sidebar: { label: "Helpdesk", iconSrc: "/Icons/helpdesk.svg" },
    list: {
      title: "Today's tickets",
      count: "3 new",
      rows: [
        { client: "Acme", title: "Logo file missing", meta: "12m", tone: "rose" },
        { client: "Pine", title: "Login redirect bug", meta: "1h", tone: "amber" },
        { client: "Lyra", title: "Refund · #882", meta: "3h", tone: "sky" },
      ],
    },
    detail: {
      kicker: "New ticket",
      meta: "Just now",
      client: "Acme",
      title: "Logo file missing from latest delivery",
      tone: "rose",
    },
  },
  {
    id: "time",
    prompt: "Build a time tracker for the team",
    metric: {
      label: "Today",
      value: "6h 12m",
      delta: { dir: "up", text: "+1h 20m", positive: true },
      spark: [3, 4, 5, 6, 5, 7, 6.2],
    },
    sidebar: { label: "Time Tracker", iconSrc: "/Icons/clock-three.svg" },
    list: {
      title: "Today's sessions",
      count: "3 active",
      rows: [
        { client: "Lyra", title: "Wireframe review", meta: "0h 55m", tone: "emerald" },
        { client: "Pine", title: "Brand explorations", meta: "1h 20m", tone: "amber" },
        { client: "Acme", title: "Stakeholder call", meta: "0h 30m", tone: "sky" },
      ],
    },
    detail: {
      kicker: "Now tracking",
      meta: "Live",
      client: "Lyra",
      title: "Wireframe review · 0h 55m",
      tone: "emerald",
    },
  },
  {
    id: "community",
    prompt: "Build a community for our clients",
    metric: {
      label: "Members",
      value: "142",
      delta: { dir: "up", text: "+12 this week", positive: true },
      spark: [110, 118, 122, 128, 130, 138, 142],
    },
    sidebar: { label: "Community", iconSrc: "/Icons/globe.svg" },
    list: {
      title: "New posts",
      count: "3 today",
      rows: [
        { client: "Pine", title: "Brand kit feedback?", meta: "5m", tone: "rose" },
        { client: "Lyra", title: "Sharing a Figma library", meta: "1h", tone: "emerald" },
        { client: "Acme", title: "Welcome thread — say hi", meta: "3h", tone: "sky" },
      ],
    },
    detail: {
      kicker: "Latest post",
      meta: "5m",
      client: "Pine",
      title: "Anyone using the new brand kit yet?",
      tone: "rose",
    },
  },
];

const CYCLE_MS = 6800;
const TYPE_START = 350;
const TYPE_END = 2400;

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

function BuildDots() {
  return (
    <span className="inline-flex items-center gap-[3px]">
      <span
        className="h-[3px] w-[3px] rounded-full bg-white/70"
        style={{ animation: "v11-build-dot 1100ms ease-in-out infinite 0ms" }}
      />
      <span
        className="h-[3px] w-[3px] rounded-full bg-white/70"
        style={{ animation: "v11-build-dot 1100ms ease-in-out infinite 180ms" }}
      />
      <span
        className="h-[3px] w-[3px] rounded-full bg-white/70"
        style={{ animation: "v11-build-dot 1100ms ease-in-out infinite 360ms" }}
      />
    </span>
  );
}

// ── Card primitive ───────────────────────────────────────────────
//
// Visual language matches the docked navbar pill: dark translucent
// fill (rgba(48,48,48,0.7)), faint white border, soft blur. This is
// the same token set used in Header.jsx for the dark theme state, so
// the hero feels like an extension of the chrome rather than a
// separate aesthetic.

const cardStyle = {
  background: "rgba(48, 48, 48, 0.7)",
  borderColor: "rgba(255, 255, 255, 0.12)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  boxShadow:
    "0 4px 16px -10px rgba(0,0,0,0.5), 0 24px 48px -28px rgba(0,0,0,0.6)",
};

function ShimmerCard({ className, style, scene, render }) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ ...cardStyle, ...style }}
    >
      <div
        key={`content-${scene.id}`}
        className="relative z-0"
        style={{
          animation:
            "v11-content-in 520ms cubic-bezier(0.22, 1, 0.36, 1) both",
        }}
      >
        {render(scene)}
      </div>
      {/* Shimmer is dimmer on dark — a faint white sweep instead of
          the bright one used on light cards in v10. */}
      <div
        key={`shim-${scene.id}`}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          backgroundImage:
            "linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%)",
          backgroundSize: "260% 100%",
          backgroundRepeat: "no-repeat",
          animation: "v11-shimmer 850ms cubic-bezier(0.22, 1, 0.36, 1) 1",
        }}
      />
    </div>
  );
}

// ── Card variants (dark-mode tokens) ─────────────────────────────

function Sparkline({ values }) {
  const w = 110;
  const h = 28;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = w / (values.length - 1);
  const points = values.map((v, i) => {
    const x = i * stepX;
    const y = h - ((v - min) / range) * h;
    return [x, y];
  });
  const path = points
    .map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`))
    .join(" ");
  const area = `${path} L${w},${h} L0,${h} Z`;
  const lastX = points[points.length - 1][0];
  const lastY = points[points.length - 1][1];

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      className="overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="v11-spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#v11-spark-fill)" />
      <path
        d={path}
        fill="none"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r="2.2" fill="#ffffff" />
    </svg>
  );
}

function MetricCard({ scene, sized = true }) {
  return (
    <ShimmerCard
      className="rounded-2xl border p-4 flex flex-col"
      style={sized ? { width: CELL * 2, height: CELL * 2 } : { height: CELL * 2 }}
      scene={scene}
      render={(s) => {
        const arrow =
          s.metric.delta.dir === "up" ? "↑" : s.metric.delta.dir === "down" ? "↓" : "→";
        const deltaColor = s.metric.delta.positive
          ? "text-emerald-300"
          : "text-rose-300";
        return (
          <>
            <div className="text-[11px] font-medium tracking-tight text-white/55">
              {s.metric.label}
            </div>
            <div className="mt-0.5 text-[26px] font-semibold leading-[1.1] tracking-tight text-white">
              {s.metric.value}
            </div>
            <div className="mt-auto">
              <Sparkline values={s.metric.spark} />
              <div
                className={`mt-1 flex items-center gap-1 text-[11px] font-medium ${deltaColor}`}
              >
                <span>{arrow}</span>
                <span className="text-white/55">{s.metric.delta.text}</span>
              </div>
            </div>
          </>
        );
      }}
    />
  );
}

function SidebarChip({ scene, sized = true }) {
  return (
    <ShimmerCard
      className="rounded-2xl border px-3 flex items-center justify-center"
      style={sized ? { width: CELL * 3, height: CELL } : { height: CELL }}
      scene={scene}
      render={(s) => (
        <div className="flex w-full items-center justify-center gap-1.5 min-w-0">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white/10 text-white/85">
            <BrandMagesMark className="h-3 w-3" />
          </span>
          <span className="hidden text-[12px] font-medium text-white/90 whitespace-nowrap sm:inline">
            BrandMages
          </span>
          <span className="hidden text-white/30 sm:inline">/</span>
          <span className="flex min-w-0 items-center gap-1.5 rounded-md bg-white/10 px-2 py-1 text-white/90">
            <MaskIcon src={s.sidebar.iconSrc} className="h-3 w-3 shrink-0" />
            <span className="min-w-0 truncate text-[11.5px] font-medium">
              {s.sidebar.label}
            </span>
          </span>
        </div>
      )}
    />
  );
}

const TONE_DOT = {
  rose: "bg-rose-400",
  amber: "bg-amber-400",
  sky: "bg-sky-400",
  emerald: "bg-emerald-400",
};

function ListCard({ scene, sized = true }) {
  return (
    <ShimmerCard
      className="rounded-2xl border px-4 py-3"
      style={sized ? { width: CELL * 3, height: CELL * 2 } : { height: CELL * 2 }}
      scene={scene}
      render={(s) => (
        <>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-medium tracking-tight text-white/60">
              {s.list.title}
            </span>
            {s.list.count && (
              <span className="rounded-full bg-white/10 px-1.5 py-[1px] text-[10px] font-medium text-white/65">
                {s.list.count}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            {s.list.rows.map((row, i) => (
              <div key={i} className="flex items-center gap-2 min-w-0">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${TONE_DOT[row.tone] || "bg-white/30"}`}
                />
                <span className="shrink-0 text-[11.5px] font-medium text-white/90">
                  {row.client}
                </span>
                <span className="shrink-0 text-white/30">·</span>
                <span className="min-w-0 flex-1 truncate text-[11.5px] text-white/65">
                  {row.title}
                </span>
                {row.meta && (
                  <span className="shrink-0 text-[10.5px] tabular-nums text-white/45">
                    {row.meta}
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    />
  );
}

function DetailCard({ scene, sized = true }) {
  return (
    <ShimmerCard
      className="rounded-2xl border px-4 py-3 flex flex-col justify-center gap-1"
      style={sized ? { width: CELL * 3, height: CELL } : { height: CELL }}
      scene={scene}
      render={(s) => (
        <>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${TONE_DOT[s.detail.tone] || "bg-white/30"}`}
              />
              <span className="text-[11px] font-medium tracking-tight text-white/60">
                {s.detail.kicker}
              </span>
            </div>
            {s.detail.meta && (
              <span className="shrink-0 text-[10.5px] tabular-nums text-white/45">
                {s.detail.meta}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="shrink-0 text-[12px] font-medium text-white/90">
              {s.detail.client}
            </span>
            <span className="shrink-0 text-white/30">·</span>
            <span className="min-w-0 flex-1 truncate text-[11.5px] text-white/65">
              {s.detail.title}
            </span>
          </div>
        </>
      )}
    />
  );
}

// ── Corner wrapper (lg+ only) ────────────────────────────────────

function Corner({ position, mountDelay, children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), mountDelay);
    return () => clearTimeout(t);
  }, [mountDelay]);

  const cls = {
    tl: "absolute left-0 top-0 hidden lg:block",
    tr: "absolute right-0 top-0 hidden lg:block",
    bl: "absolute left-0 bottom-0 hidden lg:block",
    br: "absolute right-0 bottom-0 hidden lg:block",
  }[position];

  const [dx, dy] = {
    tl: [-8, -8],
    tr: [8, -8],
    bl: [-8, 8],
    br: [8, 8],
  }[position];

  return (
    <div
      className={`pointer-events-none ${cls}`}
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted
          ? "translate3d(0,0,0)"
          : `translate3d(${dx}px, ${dy}px, 0)`,
        transition:
          "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {children}
    </div>
  );
}

// ── Mobile fragment wrapper — fades in with a small stagger so
// the four fragments arrive in sequence after the composer, mirroring
// the desktop staggered mount.

function MobileFragment({ delay, children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translate3d(0,0,0)" : "translate3d(0, 6px, 0)",
        transition:
          "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {children}
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────

export function HeroPromptToAppV11() {
  const now = useCycleClock();

  const totalMs = CYCLE_MS * SCENES.length;
  const elapsed = now % totalMs;
  const sceneIndex = Math.floor(elapsed / CYCLE_MS);
  const cycleT = elapsed % CYCLE_MS;
  const scene = SCENES[sceneIndex];

  const promptText = typed(scene.prompt, cycleT);
  const showCursor = cycleT >= TYPE_START && cycleT < TYPE_END;
  const isBuilding = cycleT >= TYPE_END;

  const traceBorder = isBuilding && (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -inset-[1.5px] rounded-[26px]"
      style={{
        background:
          "conic-gradient(from var(--v11-angle, 0deg), rgba(170,180,215,0) 0deg, rgba(170,180,215,1) 35deg, rgba(195,215,180,1) 65deg, rgba(217,237,146,1) 95deg, rgba(217,237,146,0) 135deg, rgba(170,180,215,0) 360deg)",
        animation: "v11-trace-spin 1800ms linear infinite",
        WebkitMask:
          "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
        WebkitMaskComposite: "xor",
        mask: "linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)",
        maskComposite: "exclude",
        padding: "1.5px",
      }}
    />
  );

  // Composer adopts the same dark glassy pill language as the cards
  // and the navbar. The trace border keeps the brand-gradient comet so
  // the "building" beat still pops against the dark surface.
  const composerInner = (
    <div className="relative h-full w-full">
      {traceBorder}
      <div
        className="relative h-full w-full overflow-hidden rounded-[24px] border px-6 py-4"
        style={{
          background: "rgba(48, 48, 48, 0.72)",
          borderColor: "rgba(255, 255, 255, 0.14)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow:
            "0 4px 16px -10px rgba(0,0,0,0.5), 0 40px 80px -32px rgba(0,0,0,0.7)",
        }}
      >
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[12px] font-medium tracking-tight text-white/55">
            Describe your app
          </span>
        </div>
        <div className="min-h-[28px] text-[16px] leading-[1.45] text-white/95">
          {promptText || (
            <span className="text-white/40">
              Build a helpdesk where clients can submit tickets…
            </span>
          )}
          {showCursor && (
            <span className="ml-[1px] inline-block h-[16px] w-[1.5px] -translate-y-[1px] animate-pulse bg-white/85 align-middle" />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
@property --v11-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
@keyframes v11-shimmer {
  0%   { background-position: 200% 0; opacity: 0; }
  15%  { opacity: 1; }
  85%  { opacity: 1; }
  100% { background-position: -100% 0; opacity: 0; }
}
@keyframes v11-content-in {
  0%   { opacity: 0; transform: translateY(4px); filter: blur(2px); }
  100% { opacity: 1; transform: translateY(0); filter: blur(0); }
}
@keyframes v11-build-dot {
  0%, 100% { opacity: 0.25; transform: translateY(0); }
  50%      { opacity: 1; transform: translateY(-1px); }
}
@keyframes v11-trace-spin {
  to { --v11-angle: 360deg; }
}
`,
        }}
      />

      <div
        className="pointer-events-none relative mx-auto w-full px-4 pt-4 pb-16 md:pt-6 md:pb-20 lg:pt-0 lg:pb-12"
        style={{ maxWidth: CELL * 12 + 32 }}
      >
        <div
          className="relative mx-auto w-full lg:h-[480px]"
          style={{ width: "100%", maxWidth: CELL * 12 }}
        >
          {/* Background grid (lg+ only) — slightly stronger than v10
              since the surface is darker; same radial fade. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden lg:block"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: `${CELL}px ${CELL}px`,
              backgroundPosition: "0 0",
              maskImage:
                "radial-gradient(ellipse 75% 80% at 50% 50%, #000 55%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 75% 80% at 50% 50%, #000 55%, transparent 100%)",
            }}
          />

          {/* Corners (lg+) — same grid-aligned positions as v10. */}
          <Corner position="tl" mountDelay={120}>
            <MetricCard scene={scene} />
          </Corner>
          <Corner position="tr" mountDelay={200}>
            <SidebarChip scene={scene} />
          </Corner>
          <Corner position="bl" mountDelay={280}>
            <ListCard scene={scene} />
          </Corner>
          <Corner position="br" mountDelay={360}>
            <DetailCard scene={scene} />
          </Corner>

          {/* Desktop composer — exact CELL multiples on a 12×6 grid. */}
          <div
            className="absolute hidden lg:block"
            style={{
              left: CELL * 3,
              top: CELL * 1,
              width: CELL * 5,
              height: CELL * 2,
            }}
          >
            {composerInner}
          </div>

          {/* ── Mobile layout (lg-) ─────────────────────────────────
              Composer on top, then a 2×2 grid of fragments below it.
              Improves on v10 where the corners disappeared on mobile,
              losing the "prompt → app" beat. The grid uses real CELL-
              based heights so proportions match desktop, and gaps
              roughly match a half-cell so the rhythm reads similarly.
          */}
          <div className="block lg:hidden">
            <div className="relative mx-auto w-full max-w-[560px]">
              <div className="h-[160px] sm:h-[160px]">{composerInner}</div>
            </div>

            <div className="mx-auto mt-3 grid w-full max-w-[560px] grid-cols-2 gap-3 sm:gap-4">
              <MobileFragment delay={140}>
                <MetricCard scene={scene} sized={false} />
              </MobileFragment>
              <MobileFragment delay={220}>
                <ListCard scene={scene} sized={false} />
              </MobileFragment>
              <MobileFragment delay={300}>
                <SidebarChip scene={scene} sized={false} />
              </MobileFragment>
              <MobileFragment delay={380}>
                <DetailCard scene={scene} sized={false} />
              </MobileFragment>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
