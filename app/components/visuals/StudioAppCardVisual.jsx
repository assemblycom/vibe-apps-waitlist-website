"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import { PlayPauseToggle } from "./PlayPauseToggle";

// Third value prop ("Your team's command center") visual. Internal
// team's view of the Studio workspace: Dashboard → CRM → Company
// detail (Messages → Onboarding) → right-panel Properties → Internal
// chat. Shares the same gradient card, Studio sidebar chassis, and
// type scale as ThreeStepsVisual and ClientPortalVisual so all three
// value-prop animations read as one family.
//
// ── Shared type scale (Inter, applied via .font-inter on the root) ─────
//   hero    15px  — company/app title on detail header
//   title   13px  — panel titles, section headers
//   body    12px  — list rows, tab labels, sidebar items
//   label   11px  — inline tab labels, subsection headers
//   caption 10px  — field labels, metadata, chips
//   micro    9px  — counters, badges, dense table cells

const CARD_GRADIENT = [
  "linear-gradient(180deg, rgba(255,255,255,0) 12.397%, rgb(139,153,200) 74.611%, rgb(217,237,146) 100%)",
  "linear-gradient(90deg, rgb(255,255,255) 0%, rgb(255,255,255) 100%)",
].join(", ");

const INNER_CARD =
  "rounded-tl-[14px] rounded-tr-[14px] border border-[#e6e6e6] bg-white shadow-[0_20px_50px_-25px_rgba(16,16,16,0.35)]";

// Studio sidebar — neutral greys (this is the internal view, not the
// client portal). Palette matches ThreeStepsVisual's result phase.
const SIDEBAR_BG = "#f8f9fb";
const SIDEBAR_ACTIVE_BG = "#e9ebee";

// Animation loop: Dashboard (analytics) → CRM (companies) → click into
// a company's Messages tab (default) → click Onboarding tab (response
// data visible). Sidebar highlights Dashboard for phase 0 and CRM for
// the company-drill-in phases.
const PHASES = [
  { id: "dashboard", duration: 4200 },
  { id: "crm", duration: 4800 },
  { id: "messages", duration: 4200 },
  { id: "onboarding", duration: 4800 },
];

// ── Studio sidebar item — matches ThreeStepsVisual / ClientPortalVisual
// iconSize lets callers shrink 16-viewBox SVGs (whose glyphs fill the
// whole box) so they read the same size as 20-viewBox SVGs (which have
// built-in padding) at the default 16px render.
function SidebarItem({ label, iconSrc, iconNode, iconSize = 16, active, muted }) {
  return (
    <div
      className="flex items-center gap-2 rounded-[4px] px-2 py-1 transition-colors duration-[350ms] ease-out"
      style={{
        backgroundColor: active ? SIDEBAR_ACTIVE_BG : "transparent",
      }}
    >
      <span
        className={clsx(
          "flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center text-[#101010]",
          muted && "opacity-60",
        )}
      >
        {iconSrc ? (
          <img
            src={iconSrc}
            alt=""
            aria-hidden="true"
            width={iconSize}
            height={iconSize}
          />
        ) : (
          iconNode
        )}
      </span>
      <span
        className={clsx(
          "flex-1 truncate text-[12px] leading-[18px]",
          muted ? "text-[#6b6f76]" : "text-[#101010]",
          active ? "font-medium" : "font-normal",
        )}
      >
        {label}
      </span>
    </div>
  );
}

function PanelHeader({ title, trailing }) {
  return (
    <div className="flex h-[44px] items-center border-b border-[#eef0f2] px-4">
      <span className="truncate text-[11px] font-medium text-[#212b36]">
        {title}
      </span>
      {trailing && <span className="ml-2 flex items-center">{trailing}</span>}
    </div>
  );
}

// ── Dashboard panel (phase 0) ───────────────────────────────────────────
// Three simple stat cards + a lightweight onboarding-progress list so
// the homepage reads as "where the team starts their day" without
// looking like a data dump.
function StatCard({ label, value, delta, trend }) {
  // trend: "up" (green ↑), "down" (red ↓), or undefined.
  const deltaColor =
    trend === "up" ? "#3d7d2d" : trend === "down" ? "#c4452d" : "#6b6f76";
  const arrow = trend === "up" ? "↑" : trend === "down" ? "↓" : null;
  return (
    <div className="rounded-[5px] border border-[#eef0f2] bg-white px-2.5 py-2">
      <div className="text-[9px] text-[#6b6f76]">{label}</div>
      <div className="mt-0.5 flex items-baseline gap-1">
        <span className="text-[13px] font-semibold leading-none text-[#101010]">
          {value}
        </span>
        {delta && (
          <span
            className="flex items-baseline gap-[2px] text-[9px] font-medium"
            style={{ color: deltaColor }}
          >
            {arrow && <span aria-hidden="true">{arrow}</span>}
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}

// Growth trend chart — line stays near zero through most of April with
// small humps, then climbs steeply from early May. Y-axis shows 0/50/100
// on the left; X-axis labels every 3 days from Apr 12 → May 6. Shape
// mirrors the dashboard reference.
function TrendChart() {
  const xLabels = [
    "Apr 12",
    "Apr 15",
    "Apr 18",
    "Apr 21",
    "Apr 24",
    "Apr 27",
    "Apr 30",
    "May 3",
    "May 6",
  ];
  // 9 data points evenly spaced across viewBox width 200 (step = 25).
  // Y is inverted (0 = top). Lower y = higher on chart.
  // Flat-ish along the bottom with small humps, then steep climb at end.
  const ys = [52, 52, 50, 46, 50, 46, 44, 30, 10];
  const xs = ys.map((_, i) => i * 25);
  const line = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x} ${ys[i]}`).join(" ");
  const area = `${line} L200 55 L0 55 Z`;
  // Horizontal gridlines for the 0/50/100 marks. Y=55 is the baseline
  // (value 0), Y=30 ≈ 50, Y=5 ≈ 100. Keeps the math simple for a small
  // sparkline-sized chart.
  const yTicks = [
    { label: "100", y: 5 },
    { label: "50", y: 30 },
    { label: "0", y: 55 },
  ];

  return (
    <div className="mt-2">
      <div className="flex">
        {/* Y-axis labels */}
        <div className="relative mr-1 h-[58px] w-[18px] flex-shrink-0">
          {yTicks.map((t) => (
            <span
              key={t.label}
              className="absolute right-0 -translate-y-1/2 text-[9px] text-[#6b6f76]"
              style={{ top: `${(t.y / 60) * 100}%` }}
            >
              {t.label}
            </span>
          ))}
        </div>
        {/* Chart area */}
        <div className="relative h-[58px] flex-1">
          <svg
            viewBox="0 0 200 60"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {/* Horizontal gridlines aligned with Y labels */}
            {yTicks.map((t) => (
              <line
                key={t.label}
                x1="0"
                y1={t.y}
                x2="200"
                y2={t.y}
                stroke="#f0f1f3"
                strokeWidth="0.5"
              />
            ))}
            {/* Area fill under the curve */}
            <path d={area} fill="rgba(61,125,45,0.08)" />
            {/* Trend line */}
            <path
              d={line}
              fill="none"
              stroke="#3d7d2d"
              strokeWidth="1.25"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
      {/* X-axis labels — offset by Y-axis gutter so ticks align under chart */}
      <div className="mt-1 flex pl-[22px]">
        <div className="flex flex-1 justify-between text-[9px] text-[#6b6f76]">
          {xLabels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardPanel() {
  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Dashboard" />
      <div className="flex-1 overflow-hidden px-5 py-3">
        {/* Date + greeting */}
        <div className="mb-0.5 text-[10px] text-[#6b6f76]">Monday, May 27</div>
        <div className="mb-3 text-[13px] font-semibold text-[#101010]">
          Good morning, John 👋
        </div>

        {/* Stat cards + trend chart wrapped in a single outer container */}
        <div className="mb-3 rounded-[6px] border border-[#eef0f2] bg-white p-2">
          <div className="grid grid-cols-3 gap-1.5">
            <StatCard label="Clients" value="2,000" delta="10%" trend="up" />
            <StatCard label="Active clients" value="1467" delta="45%" trend="up" />
            <StatCard label="Active subscriptions" value="280" delta="-100%" trend="down" />
          </div>

          {/* Trend chart */}
          <TrendChart />
        </div>
      </div>
    </div>
  );
}

// ── CRM → Companies list panel (phase 1) ────────────────────────────────
// Matches the Assembly CRM reference: sub-tabs Companies | Contacts,
// row per company with a small colored company avatar + name, a single
// contact (empty outline + name) in the second column, and a Tier
// badge ("Active") in the third. Cursor glides over the top row and
// presses near the end of the phase to hand off to the Company view.
// ── Shared animated cursor ─────────────────────────────────────────────
// Rendered over a specific target (CRM row, Onboarding tab, etc.) and
// driven by `cursorPhase`:
//   hidden    → invisible
//   entering  → faded in, offset from target (eases toward it)
//   hovering  → on target, full size
//   clicking  → on target, pressed (scale down)
// Position is configured via `x`/`y` (final hover coords in px from the
// absolutely-positioned parent), and `enterOffsetX`/`enterOffsetY`
// (how far off-target the cursor starts during the `entering` phase).
function AnimatedCursor({ phase, x, y, enterOffsetX = 60, enterOffsetY = 90 }) {
  // Clicking uses a much shorter transition and a more pronounced
  // scale-down (0.72 vs resting 1.0) so the press reads as a crisp
  // tap — without any ring/ripple or extra chrome.
  const durationClass =
    phase === "hidden"
      ? "duration-[200ms]"
      : phase === "clicking"
      ? "duration-[140ms]"
      : "duration-[900ms]";
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "pointer-events-none absolute transition-[transform,opacity] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
        phase === "hidden" ? "opacity-0" : "opacity-100",
        durationClass,
      )}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform:
          phase === "hidden" || phase === "entering"
            ? `translate(${enterOffsetX}px, ${enterOffsetY}px) scale(0.95)`
            : phase === "clicking"
            ? "translate(0, 0) scale(0.72)"
            : "translate(0, 0) scale(1)",
        transformOrigin: "top left",
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 18 18"
        fill="none"
        style={{ filter: "drop-shadow(0 1px 2px rgba(16,16,16,0.18))" }}
      >
        <path
          d="M2.5 1.5 L2.5 14 L5.8 11 L8 15.2 L10 14.4 L7.8 10.2 L12.2 10.2 Z"
          fill="#101010"
          stroke="#ffffff"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function CompanyAvatar({ initials, bg, fg }) {
  return (
    <div
      className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-[4px] text-[10px] font-normal"
      style={{ backgroundColor: bg, color: fg }}
    >
      {initials}
    </div>
  );
}

function ContactChip({ initials, bg, fg }) {
  // Circular contact avatar — initials + paired bg/fg from the shared
  // palette (see `CONTACT_AVATARS` below). Same chip used across the
  // Contacts column; each row picks its own color combo so the list
  // reads as a real roster rather than a placeholder.
  return (
    <span
      className="flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center rounded-full text-[9px] font-normal"
      style={{ backgroundColor: bg, color: fg }}
    >
      {initials}
    </span>
  );
}

// Shared avatar palette — 8 muted pastel/earth-tone pairs matching the
// design spec swatches. Each pair is a pale tinted bg with a deeper,
// desaturated fg of the same hue family (not straight black on color).
// Ordered so rows read with variety (no two neighbors share a hue).
const CONTACT_AVATARS = [
  { bg: "#f3f4f5", fg: "#1a1a1a" }, // neutral gray → near-black
  { bg: "#dae8dc", fg: "#4d7f6c" }, // eucalyptus mint → muted teal
  { bg: "#e1dbef", fg: "#7864a8" }, // pale lavender → dusty purple
  { bg: "#eed8d8", fg: "#a35859" }, // dusty rose → muted maroon
  { bg: "#f7f1e4", fg: "#a4751f" }, // cream → ochre / mustard
  { bg: "#dff3f9", fg: "#649eaf" }, // pale cyan → muted teal-blue
  { bg: "#ebf3e7", fg: "#75876e" }, // pale green → muted sage
  { bg: "#ebdcef", fg: "#8860a0" }, // pale lilac → plum
];

function TierPill({ label = "Active" }) {
  return (
    <span className="inline-flex items-center self-center rounded-full bg-[#dff5d3] px-1.5 py-[1px] text-[9px] font-medium text-[#3d7d2d]">
      {label}
    </span>
  );
}

function CompaniesPanel({ cursorPhase }) {
  // 10 rows so the list reads as a real client roster; overflow below
  // the panel clips naturally (mirrors the reference screenshot).
  // Company avatars reuse the updated palette for visual cohesion with
  // the new contact avatars.
  const rows = [
    {
      name: "Acme Legal",
      avatar: { initials: "AL", ...CONTACT_AVATARS[5] }, // slate blue
      contactName: "Bernard Simons",
      contactAvatar: { initials: "BS", ...CONTACT_AVATARS[2] }, // lavender
    },
    {
      name: "Northstar Advisory",
      avatar: { initials: "NA", ...CONTACT_AVATARS[0] }, // neutral
      contactName: "Dana Reyes",
      contactAvatar: { initials: "DR", ...CONTACT_AVATARS[1] }, // mint
    },
    {
      name: "Helio",
      avatar: { initials: "HE", ...CONTACT_AVATARS[4] }, // cream/gold
      contactName: "Jordan Hale",
      contactAvatar: { initials: "JH", ...CONTACT_AVATARS[5] }, // slate blue
    },
    {
      name: "Park & Co. CPAs",
      avatar: { initials: "PC", ...CONTACT_AVATARS[6] }, // sage
      contactName: "Evelyn Park",
      contactAvatar: { initials: "EP", ...CONTACT_AVATARS[3] }, // rose
    },
    {
      name: "Runway Legal",
      avatar: { initials: "RL", ...CONTACT_AVATARS[7] }, // lilac
      contactName: "Marcus Lin",
      contactAvatar: { initials: "ML", ...CONTACT_AVATARS[4] }, // cream/gold
    },
    {
      name: "Maple Creative",
      avatar: { initials: "MC", ...CONTACT_AVATARS[3] }, // rose
      contactName: "Priya Shah",
      contactAvatar: { initials: "PS", ...CONTACT_AVATARS[6] }, // sage
    },
    {
      name: "Vanguard Tax",
      avatar: { initials: "VT", ...CONTACT_AVATARS[1] }, // mint
      contactName: "Oliver Nash",
      contactAvatar: { initials: "ON", ...CONTACT_AVATARS[4] }, // cream/gold
    },
    {
      name: "Harbor Design",
      avatar: { initials: "HD", ...CONTACT_AVATARS[2] }, // lavender
      contactName: "Tessa Wu",
      contactAvatar: { initials: "TW", ...CONTACT_AVATARS[7] }, // lilac
    },
    {
      name: "Lennox Group",
      avatar: { initials: "LG", ...CONTACT_AVATARS[0] }, // neutral
      contactName: "Aiden Rivera",
      contactAvatar: { initials: "AR", ...CONTACT_AVATARS[1] }, // mint
    },
  ];
  // Index 0 is the row the cursor targets.
  const targetIndex = 0;

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="CRM" />

      {/* Sub-tabs: Companies | Contacts (Companies active) — active
          label carries its own bottom border pulled down 1px so it
          lands exactly on the row's border line (no floating gap). */}
      <div className="flex items-center gap-4 border-b border-[#eef0f2] px-4">
        <span className="-mb-px border-b border-[#101010] py-2 text-[11px] text-[#101010]">
          Companies
        </span>
        <span className="py-2 text-[11px] text-[#6b6f76]">Contacts</span>
      </div>

      {/* Table — cols: Company | Contacts | Tier. Flat chrome to match
          the Assembly CRM reference: no wrapping box, no gray fill on the
          header; rows separated by hairlines only. Proportional columns
          so the Tier pill always has room. */}
      <div className="relative flex-1 overflow-hidden px-4 py-2">
        <div>
          <div className="grid grid-cols-[1.6fr_1.2fr_0.7fr] gap-2 border-b border-[#eef0f2] px-2.5 py-2 text-[10px] font-normal text-[#6b6f76]">
            <span>Company</span>
            <span>Contacts</span>
            <span>Tier</span>
          </div>
          {rows.map((row, i) => {
            const isTarget = i === targetIndex;
            const hovered = isTarget && cursorPhase === "hovering";
            // Click uses a only-slightly-darker tint so the press reads
            // as a soft state change — not the muddy gray of a full
            // selection highlight. Paired with the cursor's scale-down
            // this gives a gentle "tap" feel.
            const clicked = isTarget && cursorPhase === "clicking";
            return (
              <div
                key={row.name}
                className={clsx(
                  "grid grid-cols-[1.6fr_1.2fr_0.7fr] items-center gap-2 border-b border-[#f1f2f4] px-2.5 py-2.5 text-[11px] text-[#212b36] last:border-b-0 transition-colors duration-[180ms]",
                  hovered && "bg-[#f6f8fa]",
                  clicked && "bg-[#eef1f4]",
                )}
              >
                {/* Company — avatar + name */}
                <div className="flex min-w-0 items-center gap-2">
                  <CompanyAvatar {...row.avatar} />
                  <span className="truncate text-[11px] font-normal text-[#212b36]">
                    {row.name}
                  </span>
                </div>
                {/* Contacts — colored initials avatar + name */}
                <div className="flex min-w-0 items-center gap-1.5">
                  <ContactChip {...row.contactAvatar} />
                  <span className="truncate text-[11px] text-[#212b36]">
                    {row.contactName}
                  </span>
                </div>
                {/* Tier — green "Active" pill, left-aligned in its column
                    to read as a clear third column (matches reference). */}
                <div className="flex min-w-0 items-center">
                  <TierPill label="Active" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Cursor — anchored to the target row's center (company name). */}
        <AnimatedCursor phase={cursorPhase} x={70} y={58} />
      </div>
    </div>
  );
}

// ── Company detail header (shared by Messages/Onboarding phases) ───────
// Matches the Assembly company-detail reference: a `CRM › Company` crumb
// with the company name as the heading, a horizontal tab row
// (Messages / Onboarding / Files / Contracts / Forms / Billing / + more),
// and a contact-selector dropdown beneath the tabs.
function ChevronRight() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[#90959d]"
      aria-hidden="true"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function CompanyHeader({ activeTab, pressingTab, textActiveTab }) {
  // `textActiveTab` controls only which tab gets the dark text colour;
  // `activeTab` drives the sliding underline. Splitting them lets the
  // underline begin its slide on the click while the type colour holds
  // until the body actually swaps — avoids a heavy "everything bolds at
  // once" flash at the moment of press.
  const colorActive = textActiveTab ?? activeTab;
  const tabs = [
    { id: "messages", label: "Messages" },
    { id: "onboarding", label: "Onboarding" },
    { id: "files", label: "Files" },
    { id: "contracts", label: "Contracts" },
    { id: "forms", label: "Forms" },
    { id: "billing", label: "Billing" },
  ];
  // Single underline element that translates between tab targets so the
  // active line slides on tab change instead of jump-cutting. Position
  // is measured from each tab's actual rendered width so it matches
  // even as the type scale or copy changes.
  const tabRefs = useRef({});
  const [underline, setUnderline] = useState({ left: 0, width: 0 });
  useLayoutEffect(() => {
    const el = tabRefs.current[activeTab];
    if (el) setUnderline({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeTab]);
  return (
    <>
      {/* Crumb / title row */}
      <div className="flex h-[40px] items-center gap-1.5 border-b border-[#eef0f2] px-4">
        <span className="text-[11px] text-[#6b6f76]">CRM</span>
        <ChevronRight />
        <span className="text-[11px] text-[#101010]">Acme Legal</span>
      </div>
      {/* Tabs — active tab's accent line is absolutely positioned at the
          row's bottom so it sits exactly on the gray separator instead
          of floating above it at fractional mobile render scales. */}
      <div className="relative flex items-center gap-4 border-b border-[#eef0f2] px-4">
        {tabs.map((t) => {
          const isColorActive = t.id === colorActive;
          const isPressing = t.id === pressingTab;
          return (
            <span
              key={t.id}
              ref={(el) => {
                tabRefs.current[t.id] = el;
              }}
              className={clsx(
                "relative flex-shrink-0 whitespace-nowrap py-2 text-[11px] transition-[color,background-color] duration-[200ms]",
                isColorActive ? "text-[#101010]" : "text-[#6b6f76]",
              )}
              style={{
                // Press feedback — kept very light: a faint warm tint
                // under the tab during the cursor's pressed state, no
                // scale/padding shifts, no early colour bump. The
                // sliding underline carries most of the click signal.
                backgroundColor: isPressing
                  ? "rgba(16,16,16,0.035)"
                  : "transparent",
              }}
            >
              {t.label}
            </span>
          );
        })}
        {/* Sliding underline — sits on the bottom border, tracks the
            active tab's geometry. Hidden until the first measurement
            so it doesn't flash at width 0. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-px h-px bg-[#101010] transition-[transform,width,opacity] duration-[420ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
          style={{
            left: 0,
            width: `${underline.width}px`,
            transform: `translateX(${underline.left}px)`,
            opacity: underline.width > 0 ? 1 : 0,
          }}
        />
        <span className="flex flex-shrink-0 items-center gap-0.5 whitespace-nowrap py-2 text-[11px] text-[#6b6f76]">
          9 more
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </div>
    </>
  );
}

// ── Company Messages panel (phase 2) ────────────────────────────────────
// Matches the Assembly company-messages reference: small rounded
// date chips separate the thread by day, each message carries an
// empty circle avatar + name + time label, and bodies are plain
// paragraphs (no bubbles).
function MessageDateChip({ label, align = "center" }) {
  // Centered by default — the StudioSurface overflows the visible card
  // on the right (w-[120%]), so right-aligning the chip pushes it past
  // the card edge. Center reads as a normal thread date separator and
  // stays inside the viewable panel.
  // Border + shadow tuned a touch stronger than "real" iOS-style chips
  // so the badge still reads at the card's small render scale.
  const justify =
    align === "right"
      ? "justify-end"
      : align === "left"
      ? "justify-start"
      : "justify-center";
  // Main canvas is w-[120%] of the outer card so its right edge runs
  // off the visible card. A plain `justify-center` lands at 50% of the
  // oversized canvas — i.e. right of the visible centre. Pad the right
  // so the chip reads as centred against what the user actually sees.
  return (
    <div className={clsx("flex py-1.5 pr-[20%]", justify)}>
      <div className="rounded-[4px] border border-[#d0d4d9] bg-white px-2 py-[3px] text-[10px] font-normal text-[#212b36]">
        {label}
      </div>
    </div>
  );
}

// Initials avatar used in the message thread — same circular chip style
// as `ContactChip` but sized a bit larger since message rows carry more
// text per row. Pulls bg/fg from the shared `CONTACT_AVATARS` palette.
function MessageAvatar({ initials, bg, fg }) {
  return (
    <span
      className="flex h-[24px] w-[24px] flex-shrink-0 items-center justify-center rounded-full text-[10px] font-normal"
      style={{ backgroundColor: bg, color: fg }}
    >
      {initials}
    </span>
  );
}

function ThreadMessage({ name, time, body, avatar }) {
  return (
    <div className="flex items-start gap-2.5">
      <MessageAvatar {...avatar} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 leading-[1.4]">
          <span className="text-[11px] font-medium text-[#212b36]">{name}</span>
          <span className="text-[10px] text-[#6b6f76]">{time}</span>
        </div>
        <p className="text-[11px] leading-[1.5] text-[#212b36]">{body}</p>
      </div>
    </div>
  );
}

function CompanyMessagesBody() {
  // Just the kickoff note from the BrandMages account lead (Jennifer
  // Rocha — same person who hosts Schedule Call and writes the
  // welcome in the client-portal visual). Bernard's reply is
  // intentionally omitted here to keep the internal-dashboard tab
  // focused on the agency-side message; the two-way exchange lives
  // on the client-portal surface.
  const jenniferAvatar = { initials: "JR", ...CONTACT_AVATARS[3] };

  return (
    <div className="flex-1 overflow-hidden px-5 py-3">
      <MessageDateChip label="Today" />
      <div className="space-y-3 py-1.5">
        <ThreadMessage
          name="Jennifer Rocha"
          time="10:12 AM"
          body="Hi Bernard — welcome to BrandMages! Before we kick off the brand sprint, a few quick things on your end: finish the onboarding form, settle your first invoice, and take a look at the task I assigned you. Once those are in we'll lock timelines and start on the positioning work."
          avatar={jenniferAvatar}
        />
      </div>
    </div>
  );
}

// ── Company Onboarding panel (phase 3) ──────────────────────────────────
// Shows the list of onboarding forms required for this client and who
// at the client's team submitted each one. Mixes Completed / Pending
// states so the team can see progress at a glance. Layout matches the
// flat-table chrome used on the CRM list (no wrapping box, hairline
// separators, sentence-case column headers).
function StatusPill({ variant, label }) {
  // Green = completed, amber = pending. Inline-flex keeps the pill
  // centered on its row with no extra wrapper.
  const styles =
    variant === "completed"
      ? "bg-[#ebf3e7] text-[#3d7d2d]"
      : "bg-[#fdf3d9] text-[#8a6d0d]";
  return (
    <span
      className={clsx(
        "inline-flex items-center self-center rounded-full px-1.5 py-[1px] text-[9px] font-medium",
        styles,
      )}
    >
      {label}
    </span>
  );
}

function CompanyOnboardingBody() {
  // Each form has either a submitter (completed) or null (pending).
  const forms = [
    {
      name: "Intake form",
      submitter: { initials: "BS", name: "Bernard Simons", ...CONTACT_AVATARS[2] },
      status: "completed",
      date: "Sep 4",
    },
    {
      name: "Engagement letter",
      submitter: { initials: "BS", name: "Bernard Simons", ...CONTACT_AVATARS[2] },
      status: "completed",
      date: "Sep 4",
    },
    {
      name: "Team roster",
      submitter: { initials: "EP", name: "Evelyn Park", ...CONTACT_AVATARS[3] },
      status: "completed",
      date: "Sep 5",
    },
    {
      name: "Brand assets",
      submitter: null,
      status: "pending",
      date: null,
    },
    {
      name: "Billing details",
      submitter: null,
      status: "pending",
      date: null,
    },
  ];

  return (
    <div className="flex-1 overflow-hidden px-4 py-3">
      {/* Forms list — flat table, sentence-case column headers */}
      <div>
        <div className="grid grid-cols-[1.3fr_1.4fr_0.9fr] gap-2 border-b border-[#eef0f2] px-2.5 py-2 text-[10px] font-normal text-[#6b6f76]">
          <span>Form</span>
          <span>Submitted by</span>
          <span>Status</span>
        </div>
        {forms.map((f) => (
          <div
            key={f.name}
            className="grid grid-cols-[1.3fr_1.4fr_0.9fr] items-center gap-2 border-b border-[#f1f2f4] px-2.5 py-2 text-[11px] text-[#212b36] last:border-b-0"
          >
            {/* Form name */}
            <span className="truncate text-[11px] text-[#212b36]">
              {f.name}
            </span>
            {/* Submitter — avatar + name, or em-dash placeholder */}
            <div className="flex min-w-0 items-center gap-1.5">
              {f.submitter ? (
                <>
                  <ContactChip
                    initials={f.submitter.initials}
                    bg={f.submitter.bg}
                    fg={f.submitter.fg}
                  />
                  <span className="truncate text-[11px] text-[#212b36]">
                    {f.submitter.name}
                  </span>
                </>
              ) : (
                <span className="text-[11px] text-[#9097a0]">—</span>
              )}
            </div>
            {/* Status — pill + date when completed */}
            <div className="flex min-w-0 items-center gap-1.5">
              <StatusPill
                variant={f.status}
                label={f.status === "completed" ? "Completed" : "Pending"}
              />
              {f.date && (
                <span className="text-[10px] text-[#6b6f76]">{f.date}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main canvas switcher ────────────────────────────────────────────────
function MainCanvas({ phaseId, cursorPhase }) {
  // Dashboard and CRM swap the whole body; the two company phases
  // share the company header but swap the body area.
  if (phaseId === "dashboard") return <DashboardPanel />;
  if (phaseId === "crm") return <CompaniesPanel cursorPhase={cursorPhase} />;

  // Company detail — Messages tab by default, Onboarding once the
  // cursor commits its click. The underline slides as soon as the
  // press fires (well before the phase transition lands ~600ms later),
  // so the click reads as a real interaction instead of a jump cut.
  const clickCommit = phaseId === "messages" && cursorPhase === "clicking";
  const bodyTab = phaseId === "onboarding" ? "onboarding" : "messages";
  const activeTab = clickCommit ? "onboarding" : bodyTab;
  const pressingTab = clickCommit ? "onboarding" : null;
  return (
    <div className="relative flex h-full flex-col">
      <CompanyHeader
        activeTab={activeTab}
        textActiveTab={bodyTab}
        pressingTab={pressingTab}
      />
      {bodyTab === "messages" ? (
        <CompanyMessagesBody />
      ) : (
        <CompanyOnboardingBody />
      )}
      {/* Messages-phase cursor — aimed at the Onboarding tab label in
          the CompanyHeader tab row. Tab row sits below the 40px crumb,
          py-2 adds ~8px of top padding → tab text center ~y 52.
          Horizontally: px-4 (16) + "Messages" label (~56) + gap-4 (16)
          puts the Onboarding tab start around x 88. Cursor tip sits
          slightly inside the label. */}
      {phaseId === "messages" && (
        <AnimatedCursor phase={cursorPhase} x={100} y={48} />
      )}
    </div>
  );
}

// Apps listed here mirror the client-portal visual (value prop 2) so
// the internal dashboard feels like the other side of the same
// workspace: Onboarding, Helpdesk, Schedule Call are the apps
// BrandMages enabled for their clients. "Automation", "Pizzatracker"
// and the muted "Add App" row are intentionally dropped to keep the
// sidebar uncluttered for the tour; the Workspace section at the
// bottom can overflow the card if it doesn't fit.
const NAV = [
  { id: "dashboard", label: "Dashboard", iconSrc: "/Icons/Dashboard.svg", iconSize: 13 },
  { id: "crm", label: "CRM", iconSrc: "/Icons/CRM.svg" },
  { id: "notifications", label: "Notifications", iconSrc: "/Icons/Notifications.svg" },
  { id: "onboarding", label: "Onboarding", iconSrc: "/Icons/on-boarding.svg", sectionLabel: "Apps" },
  { id: "helpdesk", label: "Helpdesk", iconSrc: "/Icons/helpdesk.svg" },
  { id: "schedule", label: "Schedule Call", iconSrc: "/Icons/call.svg", iconSize: 13 },
  { id: "marketplace", label: "Marketplace", iconSrc: "/Icons/marketplace.svg", sectionLabel: "Workspace" },
  { id: "settings", label: "Settings", iconSrc: "/Icons/Settings.svg" },
];

function StudioSurface({ phaseIndex, cursorPhase }) {
  const activePhase = PHASES[phaseIndex].id;
  // Sidebar follows the flow: Dashboard lights up only during the
  // analytics intro; every CRM-drill-in phase keeps CRM active.
  const activeSidebar = activePhase === "dashboard" ? "dashboard" : "crm";

  return (
    <div
      className={clsx(
        INNER_CARD,
        "absolute left-[5%] top-[7%] h-[134%] w-[120%] overflow-hidden",
      )}
    >
      <div className="relative flex h-full">
        {/* Studio sidebar */}
        <div
          className="flex w-[160px] flex-shrink-0 flex-col gap-[6px] border-r border-[#dfe1e4] px-2 pt-2.5 sm:w-[200px]"
          style={{ backgroundColor: SIDEBAR_BG }}
        >
          {/* Brand row */}
          <div className="flex items-center gap-2 rounded-[4px] px-2 py-1.5">
            <img
              src="/logos/brandmages.svg"
              alt=""
              aria-hidden="true"
              width={18}
              height={18}
              className="h-[18px] w-[18px] flex-shrink-0 rounded-[3px]"
            />
            <span className="flex-1 text-[12px] font-medium text-[#212b36]">
              BrandMages
            </span>
          </div>

          {NAV.map((item) => (
            <div key={item.id}>
              {item.sectionLabel && (
                <div className="mb-0.5 mt-1.5 px-2 text-[10px] font-medium text-[#6b6f76]">
                  {item.sectionLabel}
                </div>
              )}
              <SidebarItem
                label={item.label}
                iconSrc={item.iconSrc}
                iconSize={item.iconSize}
                active={item.id === activeSidebar}
                muted={item.muted}
              />
            </div>
          ))}
        </div>

        {/* Main canvas */}
        <div className="relative min-w-0 flex-1 bg-white">
          <MainCanvas phaseId={activePhase} cursorPhase={cursorPhase} />
        </div>
      </div>
    </div>
  );
}

// ── Top-level: drive phase loop, gate on in-view ────────────────────────
export function StudioAppCardVisual() {
  const [phase, setPhase] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  // Cursor animation for the CRM phase only. "hidden" outside CRM;
  // "entering" → "hovering" → "clicking" as the phase unfolds.
  const [cursorPhase, setCursorPhase] = useState("hidden");
  const ref = useRef(null);

  // In-view detection — scroll-listener fallback to work inside the
  // sticky ValuePropsStory layout (IntersectionObserver fights sticky).
  useEffect(() => {
    if (!ref.current) return;
    const check = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const threshold = window.innerHeight * 0.85;
      if (rect.top < threshold && rect.bottom > 0) {
        setInView(true);
        window.removeEventListener("scroll", check);
      }
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  // Drive phase progression. Paused freezes the current phase; on
  // resume the timer restarts for the current phase's full duration.
  useEffect(() => {
    if (!inView || paused) return;
    const t = setTimeout(() => {
      setPhase((p) => (p + 1) % PHASES.length);
    }, PHASES[phase].duration);
    return () => clearTimeout(t);
  }, [phase, inView, paused]);

  // Total loop duration — drives the progress ring's CSS keyframe so it
  // completes one full revolution per video loop.
  const loopMs = PHASES.reduce((s, p) => s + p.duration, 0);

  // Cursor choreography — runs for both CRM (clicks a company row) and
  // Messages (clicks the Onboarding tab). The target differs per phase
  // but the animation states are identical: entering → hovering → click
  // just before the phase transitions, so the click "causes" the next
  // phase in the narrative.
  useEffect(() => {
    if (!inView) return;
    const activeId = PHASES[phase].id;
    if (activeId !== "crm" && activeId !== "messages") {
      setCursorPhase("hidden");
      return;
    }
    const timers = [];
    setCursorPhase("entering");
    if (activeId === "crm") {
      // CRM phase (4200ms): click ~3600ms in — phase flips at 4200ms.
      timers.push(setTimeout(() => setCursorPhase("hovering"), 700));
      timers.push(setTimeout(() => setCursorPhase("clicking"), 3600));
    } else {
      // Messages phase (4200ms): cursor appears later so viewer has
      // time to read the thread before it moves up to click Onboarding.
      timers.push(setTimeout(() => setCursorPhase("hovering"), 2000));
      timers.push(setTimeout(() => setCursorPhase("clicking"), 3600));
    }
    return () => timers.forEach((t) => clearTimeout(t));
  }, [phase, inView]);

  return (
    <div
      ref={ref}
      className="font-inter relative aspect-[3/2] w-full overflow-hidden rounded-[16px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] sm:rounded-[28px]"
      style={{ backgroundImage: CARD_GRADIENT }}
    >
      <StudioSurface phaseIndex={phase} cursorPhase={cursorPhase} />
      <PlayPauseToggle
        paused={paused}
        durationMs={loopMs}
        active={inView}
        onToggle={() => setPaused((p) => !p)}
      />
    </div>
  );
}
