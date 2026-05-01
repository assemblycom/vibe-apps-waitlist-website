"use client";

// HeroLayeredStack — square card stack with cycling front content.
// One dim ghost square sits behind a fully-rendered front square; only
// the front card's CONTENT swaps on a timer, crossfading between
// scenes. No translate animation — just opacity — so the swap reads
// as a calm content change rather than cards moving past each other.

import { useEffect, useState } from "react";

const SWAP_INTERVAL_MS = 3600;
const FADE_MS = 600;

// ── Icons ─────────────────────────────────────────────────────────

function Icon({ kind, className = "h-3.5 w-3.5" }) {
  const common = {
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
  };
  if (kind === "lock") {
    return (
      <svg {...common}>
        <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" />
        <path d="M5.5 7V5.25a2.5 2.5 0 015 0V7" />
      </svg>
    );
  }
  if (kind === "shield") {
    return (
      <svg {...common}>
        <path d="M8 1.75l5.25 2v4c0 3.25-2.25 5.75-5.25 6.75-3-1-5.25-3.5-5.25-6.75v-4L8 1.75z" />
        <path d="M6 8l1.5 1.5L10 7" />
      </svg>
    );
  }
  if (kind === "bell") {
    return (
      <svg {...common}>
        <path d="M4 11h8l-1-1.5V7.5a3 3 0 00-6 0v2L4 11z" />
        <path d="M6.5 12.5a1.5 1.5 0 003 0" />
      </svg>
    );
  }
  if (kind === "spark") {
    return (
      <svg {...common}>
        <path d="M8 2.5v3M8 10.5v3M2.5 8h3M10.5 8h3M4.2 4.2l2 2M9.8 9.8l2 2M4.2 11.8l2-2M9.8 6.2l2-2" />
      </svg>
    );
  }
  if (kind === "user") {
    return (
      <svg {...common}>
        <circle cx="8" cy="6" r="2.5" />
        <path d="M3.5 13.5c.6-2.4 2.4-3.5 4.5-3.5s3.9 1.1 4.5 3.5" />
      </svg>
    );
  }
  if (kind === "doc") {
    return (
      <svg {...common}>
        <path d="M4 2.5h5l3 3V13a.5.5 0 01-.5.5h-7.5a.5.5 0 01-.5-.5V3a.5.5 0 01.5-.5z" />
        <path d="M9 2.5V5.5h3" />
      </svg>
    );
  }
  if (kind === "chart") {
    return (
      <svg {...common}>
        <path d="M2.5 13.5h11" />
        <path d="M4.5 11V8.5M7.5 11V5M10.5 11V7M13.5 11V3.5" />
      </svg>
    );
  }
  return null;
}

// ── Scene bodies ──────────────────────────────────────────────────
//
// Each body fills the 360×360 card. Padding and type scale are tuned
// so the four scenes feel like sibling artifacts of the same product,
// not four different mocks pasted together.

function ScenePane({ eyebrow, title, children }) {
  return (
    <div className="flex h-full w-full flex-col p-5 md:p-6">
      <div className="mb-1 text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/35">
        {eyebrow}
      </div>
      <div className="mb-4 text-[13px] tracking-[-0.005em] text-white/85 md:mb-5 md:text-[14px]">
        {title}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function FoundationScene() {
  const items = [
    { iconKey: "lock", label: "Authentication", meta: "SSO · SAML · OIDC" },
    { iconKey: "shield", label: "Permissions", meta: "Row-level access" },
    { iconKey: "bell", label: "Notifications", meta: "Email · in-app" },
  ];
  return (
    <ScenePane eyebrow="Foundation" title="Inherited by every app">
      <div className="flex flex-col gap-2">
        {items.map((it) => (
          <div
            key={it.label}
            className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-white/65">
              <Icon kind={it.iconKey} />
            </span>
            <div className="min-w-0">
              <div className="text-[12.5px] tracking-[-0.005em] text-white/85">
                {it.label}
              </div>
              <div className="text-[11px] text-white/40">{it.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </ScenePane>
  );
}

function AppsScene() {
  const apps = [
    { iconKey: "doc", name: "Onboarding packet", status: "Drafted" },
    { iconKey: "spark", name: "Client intake form", status: "Live" },
    { iconKey: "user", name: "Matter timeline", status: "In review" },
    { iconKey: "chart", name: "Billing rollup", status: "Live" },
  ];
  return (
    <ScenePane eyebrow="Apps" title="Built on the foundation">
      <div className="flex flex-col divide-y divide-white/[0.05] rounded-xl border border-white/[0.06] bg-white/[0.02]">
        {apps.map((a) => (
          <div
            key={a.name}
            className="flex items-center gap-3 px-3 py-2.5"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.05] text-white/60">
              <Icon kind={a.iconKey} className="h-3 w-3" />
            </span>
            <div className="flex-1 truncate text-[12.5px] tracking-[-0.005em] text-white/80">
              {a.name}
            </div>
            <span className="text-[10.5px] text-white/40">{a.status}</span>
          </div>
        ))}
      </div>
    </ScenePane>
  );
}

function PortalScene() {
  return (
    <ScenePane eyebrow="Client portal" title="What the client sees">
      <div className="flex h-full gap-2">
        <div className="flex w-[78px] shrink-0 flex-col gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2">
          {["Home", "Docs", "Tasks", "Billing"].map((l, i) => (
            <div
              key={l}
              className={[
                "rounded-md px-2 py-1.5 text-[10.5px] tracking-[-0.005em]",
                i === 1
                  ? "bg-white/[0.07] text-white/85"
                  : "text-white/45",
              ].join(" ")}
            >
              {l}
            </div>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="text-[11px] text-white/40">Acme Corp · Documents</div>
          {[
            "Engagement letter.pdf",
            "Discovery — Q2.docx",
            "Term sheet v3.pdf",
          ].map((d) => (
            <div
              key={d}
              className="flex items-center gap-2 rounded-md bg-white/[0.03] px-2 py-1.5"
            >
              <Icon kind="doc" className="h-3 w-3 text-white/50" />
              <span className="truncate text-[11.5px] text-white/75">{d}</span>
            </div>
          ))}
        </div>
      </div>
    </ScenePane>
  );
}

function DashboardScene() {
  const bars = [38, 62, 48, 74, 56, 88, 70];
  return (
    <ScenePane eyebrow="Internal dashboard" title="What the team sees">
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Active matters", value: "24" },
            { label: "Pending docs", value: "7" },
            { label: "This week", value: "+12" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-2.5 py-2"
            >
              <div className="text-[10px] uppercase tracking-[0.1em] text-white/35">
                {s.label}
              </div>
              <div className="mt-1 text-[16px] tracking-[-0.01em] text-white/90">
                {s.value}
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] text-white/40">Activity · 7d</span>
            <span className="text-[11px] text-white/55">↑ 18%</span>
          </div>
          <div className="flex h-[64px] items-end gap-1.5">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-white/[0.18]"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </ScenePane>
  );
}

const SCENES = [FoundationScene, AppsScene, PortalScene, DashboardScene];

// ── Main component ────────────────────────────────────────────────

export function HeroLayeredStack() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % SCENES.length);
    }, SWAP_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto w-full max-w-[320px] md:max-w-[420px]"
    >
      {/* Stage — square. Two ghost cards peek out from behind the
          front card (offset down + right) to suggest a stack of more
          scenes than just the one currently in view. */}
      <div className="relative aspect-square w-full">
        {/* Back-2 ghost — furthest back */}
        <div
          className="absolute rounded-3xl border border-white/[0.05] bg-[#141414]/60 backdrop-blur-md"
          style={{
            inset: "32px -28px -32px 28px",
            opacity: 0.35,
          }}
        />
        {/* Back-1 ghost — middle layer */}
        <div
          className="absolute rounded-3xl border border-white/[0.07] bg-[#181818]/75 backdrop-blur-md"
          style={{
            inset: "16px -14px -16px 14px",
            opacity: 0.7,
          }}
        />

        {/* Front card — chrome stays fixed; only its content
            crossfades between scenes. */}
        <div
          className="absolute inset-0 overflow-hidden rounded-3xl border border-white/[0.09] bg-[#1a1a1a]/90 backdrop-blur-md"
        >
          {SCENES.map((Scene, i) => (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                opacity: i === active ? 1 : 0,
                transition: `opacity ${FADE_MS}ms ease-in-out`,
              }}
            >
              <Scene />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Small icon export so the Hero can render the foundation chip row
// using the same glyph set the front card uses.
export function FoundationIcon({ kind, className }) {
  return <Icon kind={kind} className={className} />;
}
