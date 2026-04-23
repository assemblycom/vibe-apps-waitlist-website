"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { PlayPauseToggle } from "./PlayPauseToggle";

// Second value prop ("Client experience") visual. A client's-eye view of
// the portal their firm built in Assembly Studio. Follows Figma node
// 227:11325 for sidebar + home layout (lime-green client-branded sidebar,
// Good-morning banner, Your-actions counters, About-us block, working-
// hours table). Tour steps walk through the sidebar one by one:
// Client Home → Messages → On-Boarding → Payments → Helpdesk. Only the
// sidebar highlight and the main canvas change between
// phases; the sidebar itself stays mounted so the handoff reads as a real
// user navigating, not a slide show.
//
// ── Shared type scale (Inter, applied via .font-inter on the root) ─────
//   hero    15px  — app/brand title (not used here; see ThreeStepsVisual)
//   title   13px  — panel titles, section headers, FAQ header
//   body    12px  — list items, main content rows
//   label   11px  — subsection headers, FAQ links, truncate titles
//   caption 10px  — field labels, metadata, inline help
//   micro    9px  — counters, badges, dense tables, avatar initials
// The Visa glyph at 8px is a faux-logo asset (not body typography) and is
// intentionally off-scale. Font weights pair medium/semibold to content
// emphasis — see ThreeStepsVisual.jsx for the same scale applied to the
// first-value-prop animation.

const CARD_GRADIENT = [
  "linear-gradient(180deg, rgba(255,255,255,0) 12.397%, rgb(139,153,200) 74.611%, rgb(217,237,146) 100%)",
  "linear-gradient(90deg, rgb(255,255,255) 0%, rgb(255,255,255) 100%)",
].join(", ");

const INNER_CARD =
  "rounded-tl-[14px] rounded-tr-[14px] border border-[#e6e6e6] bg-white shadow-[0_20px_50px_-25px_rgba(16,16,16,0.35)]";

// Sidebar palette from Figma — this is the client's branded view, so the
// sidebar is their colour (lime), not the internal Studio greys.
const SIDEBAR_BG = "#d9ed92";
const SIDEBAR_ACTIVE_BG = "#f1f9d8";

// Each phase corresponds to a sidebar item. Helpdesk and Schedule Call
// are visible in the sidebar but aren't part of the click-through
// flow — the tour ends on Onboarding, which is the narrative payoff
// (the folder opens to reveal the freshly-generated app).
const PHASES = [
  { id: "home", duration: 5200 },
  { id: "messages", duration: 4600 },
  { id: "payments", duration: 4200 },
  { id: "tasks", duration: 4400 },
  { id: "onboarding", duration: 4800 },
];

// Phases that live inside the "Other" folder. When one of these is
// active the folder auto-expands; otherwise it stays collapsed to its
// folder icon.
const CHILD_PHASE_IDS = new Set(["onboarding"]);

// Fixed row positions inside the sidebar column (px, relative to the
// sidebar's top-left). Used to drive the click-through cursor. y values
// aim at the middle of each row; x puts the cursor tip over the label.
// The child rows (onboarding, helpdesk, schedule) are only visited
// while the "Other" folder is expanded.
const CURSOR_POS = {
  home: { x: 96, y: 54 },
  messages: { x: 96, y: 86 },
  payments: { x: 96, y: 118 },
  tasks: { x: 96, y: 150 },
  other: { x: 96, y: 182 },
  onboarding: { x: 108, y: 224 },
  // Helpdesk stays in the sidebar but isn't part of the cursor tour.
};

// ── Sidebar item ────────────────────────────────────────────────────────
// Dimensions (width, gap, padding, icon size, label size/weight) are
// intentionally locked to the Studio sidebar in ThreeStepsVisual so both
// animations read as the same product.
function SidebarItem({
  label,
  iconSrc,
  iconNode,
  iconSize = 16,
  active,
  background,
}) {
  return (
    <div
      className={clsx(
        "flex items-center gap-2 rounded-[4px] px-2 py-1 transition-colors duration-[320ms] ease-out",
      )}
      style={{
        backgroundColor:
          background ?? (active ? SIDEBAR_ACTIVE_BG : "transparent"),
      }}
    >
      <span className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center text-[#101010]">
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
          "flex-1 truncate text-[12px] leading-[18px] text-[#101010]",
          active ? "font-medium" : "font-normal",
        )}
      >
        {label}
      </span>
    </div>
  );
}

// ── Main canvas panels ──────────────────────────────────────────────────
// Shared top-bar strip — matches the On-Boarding page header in
// ThreeStepsVisual (fixed 36px tall, 1px bottom border, section name in
// 11px medium, optional trailing chip/button). No subcopy: the sidebar
// already establishes context, so the top bar stays quiet.
function PanelHeader({ title, trailing }) {
  return (
    <div className="flex h-[36px] items-center border-b border-[#eef0f2] px-4">
      <span className="truncate text-[11px] font-medium text-[#212b36]">
        {title}
      </span>
      {trailing && <span className="ml-2 flex items-center">{trailing}</span>}
    </div>
  );
}

// Fallback glyph for Tasks — no asset was supplied in the icon pack.
function TaskIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[#6b6f76]"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="m8 12 2.5 2.5L16 9.5" />
    </svg>
  );
}

// Home panel — mirrors Figma node 227:11387. Personalised greeting →
// hero banner → Your-actions counters → About-us copy → Working-hours
// table. The greeting replaces the generic "Client Home" panel bar
// the other screens use; the reference shows the greeting sitting at
// the top of the canvas with no separator above it.
function HomePanel() {
  // Invoices uses the Payments icon (closest semantic match from the
  // supplied asset pack); Tasks falls back to an inline tick-in-square.
  // Neutral action-card styling — the sidebar is the client's lime brand,
  // but the action cards are app surface, so they read in greys. Counts
  // carry the "what needs attention" signal (100 invoices vs 5 contracts).
  const actions = [
    { label: "Invoices", count: "100", iconSrc: "/Icons/payments.svg" },
    { label: "Contracts", count: "5", iconSrc: "/Icons/contracts.svg" },
    { label: "Forms", count: "10", iconSrc: "/Icons/forms.svg" },
    { label: "Tasks", count: "50", iconNode: <TaskIcon /> },
  ];
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex-1 overflow-hidden px-5 pt-4">

      {/* Greeting — 13px medium title + 10px gray subcopy. */}
      <div className="mb-3">
        <div className="text-[13px] font-medium leading-[1.3] text-[#101010]">
          Good morning, Ana
        </div>
        <div className="mt-0.5 text-[10px] text-[#6b6f76]">
          Here&apos;s what needs your attention today
        </div>
      </div>

      {/* Hero banner — playful multi-stop gradient (blue → violet →
          peach) standing in for the Figma photo. */}
      <div
        className="mb-3 h-[110px] w-full overflow-hidden rounded-[6px]"
        style={{
          background:
            "linear-gradient(135deg, #7da4ff 0%, #a18cd1 45%, #fbc2eb 75%, #ffd6a5 100%)",
        }}
      />

      {/* Your actions */}
      <div className="mb-3 rounded-[4px] border border-[#eaecf0] bg-[#f8f9fb] p-2">
        <div className="mb-1.5 text-[10px] font-medium text-[#212b36]">
          Your actions
        </div>
        <div className="grid grid-cols-4 gap-[5px]">
          {actions.map((a) => (
            <div
              key={a.label}
              className="flex items-center justify-between rounded-[4px] border border-[#eff1f4] bg-white px-2 py-[7px]"
            >
              <div className="flex items-center gap-1">
                {a.iconSrc ? (
                  <img
                    src={a.iconSrc}
                    alt=""
                    aria-hidden="true"
                    width={10}
                    height={10}
                  />
                ) : (
                  a.iconNode
                )}
                <span className="text-[10px] font-medium text-[#6b6f76]">
                  {a.label}
                </span>
              </div>
              <span className="text-[10px] text-[#212b36]">{a.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* About us */}
      <div className="mb-3">
        <div className="mb-1 text-[11px] font-medium leading-[1.4] text-[#101010]">
          About us
        </div>
        <p className="text-[10px] leading-[1.5] text-[#212b36]">
          BrandMages, a full-service marketing agency that helps businesses
          increase their brand awareness and online presence. We
          specialize in crafting unique and effective marketing strategies
          that align with your business goals and stand out in a crowded
          marketplace. Our team blends brand storytelling, performance
          campaigns, and always-on content to turn first impressions into
          long-term customers.
        </p>
        <p className="mt-1.5 text-[10px] leading-[1.5] text-[#212b36]">
          We&apos;ve launched brands across SaaS, retail, legal, and
          wellness, and every engagement starts the same way — a short
          discovery call to understand your audience, a tailored roadmap
          within a week, and a dedicated team who treats your brand like
          it&apos;s our own.
        </p>
      </div>

      {/* Working hours table */}
      <div className="w-[280px] overflow-hidden rounded-[5px] border border-[#dfe1e4]">
        <div className="flex h-[22px] items-center bg-[#f9f9f9] border-b border-[#dfe1e4] text-[9px] font-medium text-[#6b6f76]">
          <span className="flex-1 px-2.5">Days</span>
          <span className="flex-[1.4] px-2.5">Hours (EST)</span>
        </div>
        {[
          ["M–F", "9AM – 6PM"],
          ["Sat", "10AM – 5PM"],
          ["Sun", "Closed"],
        ].map(([d, h], i) => (
          <div
            key={d}
            className={clsx(
              "flex h-[22px] items-center text-[9px]",
              i < 2 ? "border-b border-[#f0f1f3]" : "",
            )}
          >
            <span className="flex-1 px-2.5 text-[#212b36]">{d}</span>
            <span className="flex-[1.4] px-2.5 text-[#6b6f76]">{h}</span>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

// Circular avatar with coloured initials — matches Figma 227:19413 style
// (filled pastel disc, medium initials in darker shade of the same hue).
function Avatar({ initials, bg, fg }) {
  return (
    <div
      className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full text-[9px] font-medium"
      style={{ backgroundColor: bg, color: fg }}
    >
      {initials}
    </div>
  );
}

function DateChip({ label }) {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="rounded-[4px] border border-[#eff1f4] bg-white px-2 py-[2px] text-[10px] text-[#6b6f76]">
        {label}
      </div>
    </div>
  );
}

// Messages panel — group thread. Header shows participant names;
// body is a scroll of messages broken up by date chips. Long lines
// use whitespace-nowrap + the panel's overflow-hidden so copy reads
// like it runs off the right edge (matches Figma reference where a
// real thread extends past the visible width).
function MessageRow({ initials, avatarBg, avatarFg, name, time, children }) {
  return (
    <div className="px-4 py-1.5">
      <div className="flex items-start gap-2">
        <Avatar initials={initials} bg={avatarBg} fg={avatarFg} />
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-center gap-1.5 text-[11px] leading-[1.4]">
            <span className="font-medium text-[#212b36]">{name}</span>
            <span className="text-[#6b6f76]">{time}</span>
          </div>
          <div className="text-[11px] leading-[1.5] text-[#212b36]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function MessagesPanel() {
  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Messages" />

      {/* Thread body — three date sections, each with its own messages. */}
      <div className="flex-1 overflow-hidden pt-2">
        <DateChip label="September 18, 2025" />

        <MessageRow
          initials="BS"
          avatarBg="#dff3f9"
          avatarFg="#649eaf"
          name="Bernard Simons"
          time="1:34 PM"
        >
          <p className="whitespace-nowrap">
            Following up on your previous email on the job, is there
            anything that you need feedback on before the review?
          </p>
          {/* Continuation inside the same row so it aligns flush with
              the first paragraph's left edge (both sit in the body
              column, not at an arbitrary pl offset). */}
          <p className="mt-2 whitespace-nowrap">
            I had taken a look at some of the seminal designs and they
            looked great, seems to me we just need more
          </p>
          <p className="whitespace-nowrap">
            data to present, let me know what you think!
          </p>
        </MessageRow>

        <MessageRow
          initials="MS"
          avatarBg="#f0eaff"
          avatarFg="#7f69b5"
          name="Martin Sung"
          time="2:20 PM"
        >
          <p className="whitespace-nowrap">
            It works! <span className="text-[#6b6f76]">@BernardSimons</span>{" "}
            we&apos;ll have a copy of the demo app deployed and ready for
            review tomorrow EOD.
          </p>
        </MessageRow>

        <DateChip label="Yesterday" />

        <MessageRow
          initials="KM"
          avatarBg="#fde2e4"
          avatarFg="#c56277"
          name="Kaitlyn Moore"
          time="2:20 PM"
        >
          <p className="whitespace-nowrap">
            <span className="text-[#6b6f76]">@BrianWilson</span> Check this
            link, there seems to be a fix, you&apos;ll have to toy with it
            a bit before it fully
          </p>
          <p className="whitespace-nowrap">
            <a className="text-[#3866c0] underline" href="#">
              meta.stackexchange.com/questions/43969/
            </a>
          </p>
        </MessageRow>

        <DateChip label="Today" />

        <MessageRow
          initials="MS"
          avatarBg="#f0eaff"
          avatarFg="#7f69b5"
          name="Martin Sung"
          time="1:45 PM"
        >
          <p className="whitespace-nowrap">
            Following up on your previous email on the job, is there
            anything that feedback on?
          </p>
        </MessageRow>
      </div>
    </div>
  );
}

function OnboardingPanel() {
  // Mirrors the onboarding wizard in ThreeStepsVisual (value prop 1)
  // so both videos show the same product screen. Single continuous
  // progress bar + sentence-case meta, 13px font-medium wizard title,
  // four field rows with 30px tall inputs.
  const fields = [
    { label: "Business name", value: "Acme Legal" },
    { label: "Industry", value: "Law firm" },
    { label: "Team size", value: "5–10 people" },
    { label: "Primary location", value: "New York, NY" },
  ];
  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Onboarding" />
      <div className="flex-1 overflow-hidden px-6 py-5">
        <div className="mb-2 text-[11px] text-[#6b6f76]">Step 2 of 5</div>
        <div className="mb-4 h-[2px] w-full overflow-hidden rounded-full bg-[#101010]/[0.08]">
          <div
            className="h-full rounded-full bg-[#101010]/85"
            style={{ width: "40%" }}
          />
        </div>
        <div className="mb-4 text-[13px] font-medium tracking-[-0.005em] text-[#101010]">
          Tell us about your business
        </div>
        <div className="space-y-2.5">
          {fields.map((field) => (
            <div key={field.label}>
              <div className="mb-1 text-[10px] text-[#6b6f76]">
                {field.label}
              </div>
              <div className="h-[30px] rounded-[4px] border border-[#eef0f2] bg-white px-2.5 text-[12px] leading-[30px] text-[#212b36]">
                {field.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Payments sub-components (Figma 227:19600) ───────────────────────────
function StatusChip({ label, variant }) {
  const styles = {
    // Soft pastel chips with matching text so the colour carries the
    // meaning — Figma uses a "Tag" component in brand-green, brand-blue,
    // and brand-grey tokens.
    active: { bg: "#dff5d3", fg: "#1e7c3a" },
    cancelled: { bg: "#eef0f2", fg: "#2b2f36" },
    open: { bg: "#dbe8fb", fg: "#2e57b0" },
    paid: { bg: "#dff5d3", fg: "#1e7c3a" },
    default: { bg: "#eef0f2", fg: "#2b2f36" },
  }[variant] || { bg: "#eef0f2", fg: "#6b6f76" };
  return (
    <span
      className="inline-block rounded-full px-2 py-[2px] text-[10px] font-medium leading-[1.3]"
      style={{ backgroundColor: styles.bg, color: styles.fg }}
    >
      {label}
    </span>
  );
}

// The supplied visa.svg and chasebank.svg already ship as dark tiles
// with white glyphs baked in, so we render them at their native
// aspect with no wrapper or filter.
function VisaMark() {
  return (
    <img
      src="/Icons/visa.svg"
      alt=""
      aria-hidden="true"
      width={20}
      height={20}
      className="flex-shrink-0"
    />
  );
}

function BankIcon() {
  return (
    <img
      src="/Icons/chasebank.svg"
      alt=""
      aria-hidden="true"
      width={20}
      height={20}
      className="flex-shrink-0"
    />
  );
}

function PaymentsPanel() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PanelHeader title="Billing" />
      <div className="flex-1 overflow-hidden px-5 py-3 space-y-4">
        {/* Payment Methods */}
        <section>
          <div className="mb-2 text-[11px] font-medium text-[#212b36]">
            Payment Methods
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 rounded-[5px] border border-[#eef0f2] bg-white px-2.5 py-1.5">
              <VisaMark />
              <span className="text-[10px] tracking-[0.1em] text-[#6b6f76]">
                ••••
              </span>
              <span className="text-[10px] text-[#212b36]">2905</span>
              <span className="ml-1">
                <StatusChip label="Default" variant="default" />
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-[5px] border border-[#eef0f2] bg-white px-2.5 py-1.5">
              <BankIcon />
              <span className="text-[10px] text-[#212b36]">Chase Bank</span>
              <span className="text-[10px] tracking-[0.1em] text-[#6b6f76]">
                ••••
              </span>
              <span className="text-[10px] text-[#212b36]">3948</span>
            </div>
          </div>
        </section>

        {/* Subscriptions */}
        <section>
          <div className="mb-2 text-[11px] font-medium text-[#212b36]">
            Subscriptions
          </div>
          <div className="overflow-hidden rounded-[4px]">
            <div className="grid grid-cols-[90px_150px_1fr] gap-2 border-b border-[#eef0f2] px-2 py-1.5 text-[10px] text-[#6b6f76]">
              <span>Price</span>
              <span>Billing period</span>
              <span>Status</span>
            </div>
            {[
              { price: "$8,400", period: "Monthly", status: "Active", variant: "active" },
              { price: "$14,500", period: "Yearly", status: "Cancelled", variant: "cancelled" },
            ].map((row) => (
              <div
                key={row.price + row.period}
                className="grid grid-cols-[90px_150px_1fr] items-center gap-2 border-b border-[#f4f5f7] px-2 py-1.5 text-[10px] text-[#212b36] last:border-b-0"
              >
                <span>{row.price}</span>
                <span className="text-[#6b6f76]">{row.period}</span>
                {/* Wrap chip so it keeps its content width instead of
                    stretching to fill the grid cell. */}
                <span>
                  <StatusChip label={row.status} variant={row.variant} />
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Invoices */}
        <section>
          <div className="mb-2 text-[11px] font-medium text-[#212b36]">
            Invoices
          </div>
          <div className="overflow-hidden rounded-[4px]">
            <div className="grid grid-cols-[80px_80px_1fr] gap-2 border-b border-[#eef0f2] px-2 py-1.5 text-[10px] text-[#6b6f76]">
              <span>Price</span>
              <span>Status</span>
              <span>Invoice number</span>
            </div>
            {[
              { price: "$900", status: "Open", variant: "open", inv: "SUB-D8EF5DE9-0001" },
              { price: "$1,400", status: "Paid", variant: "paid", inv: "D8EF5DE9-0001" },
              { price: "$8,400", status: "Open", variant: "open", inv: "SUB-D8EF5DE9-0002" },
            ].map((row) => (
              <div
                key={row.inv}
                className="grid grid-cols-[80px_80px_1fr] items-center gap-2 border-b border-[#f4f5f7] px-2 py-1.5 text-[10px] text-[#212b36] last:border-b-0"
              >
                <span className="flex items-center gap-1">
                  <span>{row.price}</span>
                  <img
                    src="/Icons/return.svg"
                    alt=""
                    aria-hidden="true"
                    width={10}
                    height={10}
                    className="flex-shrink-0"
                  />
                </span>
                <span>
                  <StatusChip label={row.status} variant={row.variant} />
                </span>
                <span className="truncate text-[#6b6f76]">{row.inv}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function HelpdeskPanel() {
  const items = [
    "What's included in onboarding?",
    "How do invoices and retainers work?",
    "Where can I see the project plan?",
    "How do I book a kickoff call?",
  ];
  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Helpdesk" />
      <div className="flex-1 overflow-hidden px-5 py-3">
      <div className="mb-2 text-[11px] font-semibold text-[#101010]">FAQ</div>
      <div className="space-y-1.5">
        {items.map((q, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-[4px] border border-[#eef0f2] bg-white px-2.5 py-1.5 text-[11px] text-[#212b36]"
          >
            <span className="text-[10px] text-[#90959d]">▸</span>
            <span className="truncate">{q}</span>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

// ── Tasks sub-components ───────────────────────────────────────────────
// Status dot — uses the supplied icon assets for todo / in-progress /
// done. The SVGs are 24×24 with the glyph in the middle 16×16, so the
// displayed size matches the icon's "ink" size rather than its bbox.
const TASK_STATUS_ICONS = {
  todo: "/Icons/todo.svg",
  inProgress: "/Icons/inprogress.svg",
  done: "/Icons/done.svg",
};
function TaskStatusDot({ status, size = 12 }) {
  const src = TASK_STATUS_ICONS[status] || TASK_STATUS_ICONS.todo;
  // Icons have a ~4px viewBox margin around the 16-unit glyph. Scale
  // up so the rendered circle matches the requested visual size.
  const render = Math.round(size * 1.5);
  return (
    <span
      className="flex flex-shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt=""
        aria-hidden="true"
        width={render}
        height={render}
      />
    </span>
  );
}

// Client-side Tasks — matches the Figma reference. Tabs across the
// top (All tasks / My tasks), a To Do count, and task cards that can
// nest subtasks with mixed statuses. Styling mirrors the other client
// panels (11px titles, 10px meta) so the whole family reads as one
// product.
function TasksPanel() {
  const tasks = [
    { title: "Share market research", due: "Apr 4" },
    {
      title: "Share design files",
      due: "Apr 4",
      subtasks: [
        { label: "Attach the payment details to the project.", status: "todo" },
        { label: "Export final design assets (Figma, PSD, etc.)", status: "todo" },
        { label: "Check mobile vs. desktop versions", status: "inProgress" },
        { label: "Double-check font and license compliance", status: "inProgress" },
        { label: "Include any fonts or third-party assets used", status: "done" },
        { label: "Confirm file access permissions for client", status: "done" },
      ],
    },
  ];
  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Tasks" />

      <div className="flex-1 overflow-hidden px-5 py-3">
        <div className="mb-2 text-[11px] text-[#101010]">
          To Do
          <span className="ml-1.5 text-[#6b6f76]">
            {tasks.length}
          </span>
        </div>

        {/* Cap the card list width so the right border lands inside
            the visible canvas instead of getting clipped by the
            oversized inner surface. */}
        <div className="max-w-[440px] space-y-2">
          {tasks.map((task, i) => (
            <div
              key={i}
              className="rounded-[6px] border border-[#eef0f2] bg-white px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <TaskStatusDot status="todo" size={13} />
                <span className="text-[12px] text-[#212b36]">{task.title}</span>
              </div>
              <div className="mt-0.5 pl-[22px] text-[11px] text-[#6b6f76]">
                Due: {task.due}
              </div>

              {task.subtasks && (
                <div className="mt-2 space-y-1 pl-[22px]">
                  {task.subtasks.map((st, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-2 text-[11px] text-[#212b36]"
                    >
                      <TaskStatusDot status={st.status} size={12} />
                      <span className="truncate">{st.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PANELS = {
  home: HomePanel,
  messages: MessagesPanel,
  onboarding: OnboardingPanel,
  payments: PaymentsPanel,
  tasks: TasksPanel,
  helpdesk: HelpdeskPanel,
};

function MainPanel({ visible, phaseId }) {
  const Panel = PANELS[phaseId];
  if (!Panel) return null;
  return (
    <div
      aria-hidden={!visible}
      className={clsx(
        "absolute inset-0 transition-[opacity,transform] duration-[550ms] ease-out",
        visible
          ? "visible translate-y-0 opacity-100"
          : "pointer-events-none invisible translate-y-1 opacity-0",
      )}
    >
      <Panel />
    </div>
  );
}

// Top-level sidebar rows. On-Boarding, Helpdesk and Schedule Call live
// as children of the "Other" folder — see OTHER_CHILDREN. Matches the
// client portal sidebar structure in Figma (BrandMages → Home →
// Messages → Payments → Other ▾).
const NAV = [
  { id: "home", label: "Home", iconSrc: "/Icons/clienthome.svg", iconSize: 13 },
  { id: "messages", label: "Messages", iconSrc: "/Icons/messages.svg" },
  { id: "payments", label: "Payments", iconSrc: "/Icons/payments.svg" },
  // Tasks sits just above the Other folder. It doesn't have a phase
  // in this tour (no TasksPanel), so the cursor never clicks it — it
  // just rounds out the sidebar to match the rest of the product.
  { id: "tasks", label: "Tasks", iconSrc: "/Icons/tasks.svg" },
];

// Children revealed when the "Other" folder expands. Schedule Call is
// present for completeness (it mirrors the first-value-prop visual) but
// never goes active — there's no Schedule Call panel in this tour.
const OTHER_CHILDREN = [
  { id: "onboarding", label: "Onboarding", iconSrc: "/Icons/on-boarding.svg" },
  { id: "helpdesk", label: "Helpdesk", iconSrc: "/Icons/helpdesk.svg" },
  { id: "schedule", label: "Schedule Call", iconSrc: "/Icons/call.svg", iconSize: 13 },
];

// ── Portal surface — sidebar + main canvas ──────────────────────────────
function PortalSurface({ phaseIndex, active, paused }) {
  // phaseId drives the loop clock in the parent. displayId is what's
  // actually shown in the main canvas and highlighted in the sidebar —
  // it updates at the moment the cursor commits a click, so content
  // never changes before the user "presses" the row.
  const phaseId = PHASES[phaseIndex].id;
  const [displayId, setDisplayId] = useState("home");
  const [otherOpen, setOtherOpen] = useState(false);
  const [cursorTarget, setCursorTarget] = useState("home");
  const [cursorClicking, setCursorClicking] = useState(false);
  const [cursorArrived, setCursorArrived] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);

  // Click-through choreography. For each phase we queue one or two
  // "click beats" — move the cursor to a row, hover, press, commit.
  // The commit step is where the consequences of the click happen
  // (folder opens, or main canvas panel swaps), so the content always
  // lags the cursor by the hover → press beat. Onboarding is a
  // two-step: first click Other to open the folder, then click
  // Onboarding inside. Helpdesk reuses the single-step flow (folder
  // is already open from the previous phase).
  useEffect(() => {
    if (!active) {
      setCursorVisible(false);
      setCursorClicking(false);
      setCursorArrived(false);
      setCursorTarget("home");
      setDisplayId("home");
      setOtherOpen(false);
      return;
    }
    if (paused) return;

    const timers = [];
    timers.push(setTimeout(() => setCursorVisible(true), 60));

    // MOVE_MS matches the cursor's CSS transition duration so the
    // hover tint doesn't flash mid-flight. HOVER_MS is how long the
    // row sits in the hover state before the press fires.
    const MOVE_MS = 620;
    const HOVER_MS = 240;
    const PRESS_MS = 220;
    const TAIL_MS = 260;

    const steps =
      phaseId === "onboarding"
        ? [
            {
              target: "other",
              commit: () => setOtherOpen(true),
            },
            {
              target: "onboarding",
              commit: () => setDisplayId("onboarding"),
            },
          ]
        : [
            {
              target: phaseId,
              commit: () => {
                setDisplayId(phaseId);
                // Collapse the folder when we land on a top-level
                // phase. Done after the press so the folder closes
                // just as the new panel reveals.
                if (!CHILD_PHASE_IDS.has(phaseId)) setOtherOpen(false);
              },
            },
          ];

    let at = 140;
    steps.forEach((step) => {
      const moveAt = at;
      const arriveAt = moveAt + MOVE_MS;
      const pressAt = arriveAt + HOVER_MS;
      const releaseAt = pressAt + PRESS_MS;

      timers.push(
        setTimeout(() => {
          setCursorTarget(step.target);
          setCursorArrived(false);
          setCursorClicking(false);
        }, moveAt),
      );
      timers.push(setTimeout(() => setCursorArrived(true), arriveAt));
      timers.push(setTimeout(() => setCursorClicking(true), pressAt));
      // Commit side-effect a beat into the press so the visible change
      // looks caused-by-the-click, not simultaneous with it.
      timers.push(setTimeout(step.commit, pressAt + 90));
      timers.push(setTimeout(() => setCursorClicking(false), releaseAt));

      at = releaseAt + TAIL_MS;
    });

    return () => timers.forEach((t) => clearTimeout(t));
  }, [phaseIndex, active, paused, phaseId]);

  const cursorPosKey = CURSOR_POS[cursorTarget] ? cursorTarget : "home";
  const cursorPos = CURSOR_POS[cursorPosKey];

  // The Other row's chevron is derived from cursor state: when the
  // cursor is sitting on Other and the folder isn't open yet, show a
  // chevron-right (hover hint); otherwise folder icon (closed) or
  // chevron-down (open).
  const hoverHint =
    cursorTarget === "other" && cursorArrived && !otherOpen;

  // Row background driver. Only two tints are visible: hover (pre-click)
  // and active (post-click). Removing the dark "pressed" tint fixes a
  // flicker where the eye caught three colors shifting in rapid
  // succession (hover → dark press → hover → active). The click
  // feedback is now carried by the cursor's scale press instead. Once
  // a row is the active/selected one, it stays at the active tint
  // even while the cursor is still sitting on it — no snap back to
  // hover.
  const ROW_HOVER_BG = "#e8f3b8";
  const rowBg = (id) => {
    if (id === displayId) return SIDEBAR_ACTIVE_BG;
    if (cursorTarget === id && cursorArrived) return ROW_HOVER_BG;
    return "transparent";
  };

  return (
    <div
      className={clsx(
        INNER_CARD,
        "absolute left-[5%] top-[7%] h-[134%] w-[120%] overflow-hidden",
      )}
    >
      <div className="flex h-full">
        {/* Sidebar — lime-green client-branded column (Figma 227:11329).
            Width/gap/padding match ThreeStepsVisual's Studio sidebar so
            both animations share the same chassis. */}
        <div
          className="relative flex w-[200px] flex-shrink-0 flex-col gap-[6px] px-2 pt-2.5"
          style={{ backgroundColor: SIDEBAR_BG }}
        >
          {/* Click-through cursor — glides between sidebar rows and
              presses each one. The "click" is now carried by the row
              itself (hover tint → pressed tint → active), so the
              cursor only does a subtle nudge-down on press. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-10 transition-[transform,opacity] duration-[620ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
            style={{
              opacity: cursorVisible ? 1 : 0,
              transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
              transformOrigin: "top left",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className="transition-transform duration-[160ms] ease-out"
              style={{
                filter: "drop-shadow(0 1px 2px rgba(16,16,16,0.28))",
                transform: `scale(${cursorClicking ? 0.8 : 1})`,
                transformOrigin: "top left",
              }}
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

          {/* Brand row — uses the uploaded BrandMages mark */}
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
            <SidebarItem
              key={item.id}
              label={item.label}
              iconSrc={item.iconSrc}
              iconNode={item.iconNode}
              iconSize={item.iconSize}
              active={item.id === displayId}
              background={rowBg(item.id)}
            />
          ))}

          {/* "Other" folder — its own flex column so the collapsing
              children don't leave a ghost gap behind the folder row. */}
          <div className="flex flex-col">
            <div
              className="flex items-center gap-2 rounded-[4px] px-2 py-1 transition-colors duration-[320ms] ease-out"
              style={{ backgroundColor: rowBg("other") }}
            >
              {/* Icon slot — all three glyphs live in the same stack
                  and cross-fade + rotate between states for a smooth
                  folder → chevron-right (hover) → chevron-down
                  (expanded) transition. */}
              <span className="relative flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center text-[#101010]">
                <img
                  src="/Icons/other.svg"
                  alt=""
                  aria-hidden="true"
                  width={16}
                  height={16}
                  className="absolute transition-opacity duration-[220ms] ease-out"
                  style={{ opacity: otherOpen || hoverHint ? 0 : 1 }}
                />
                {/* Single caret asset that rotates between 0° (down,
                    expanded) and -90° (right, hover). Rotating one
                    element instead of swapping two SVGs keeps the
                    motion continuous. */}
                <img
                  src="/Icons/arrowdown.svg"
                  alt=""
                  aria-hidden="true"
                  width={9}
                  height={13}
                  className="absolute transition-[opacity,transform] duration-[260ms] ease-out"
                  style={{
                    opacity: otherOpen || hoverHint ? 1 : 0,
                    transform: `rotate(${otherOpen ? 0 : -90}deg)`,
                  }}
                />
              </span>
              <span className="flex-1 truncate text-[12px] font-normal leading-[18px] text-[#101010]">
                Other
              </span>
            </div>

            {/* Children — CSS-grid-rows accordion (0fr ↔ 1fr) gives
                a buttery height transition without guessing a
                max-height. Each child also fades + slides in on a
                stagger so the reveal feels layered, not blocky. */}
            <div
              className="grid transition-[grid-template-rows] duration-[420ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ gridTemplateRows: otherOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="flex flex-col gap-[6px] pt-[6px]">
                  {OTHER_CHILDREN.map((child, i) => {
                    const active = child.id === displayId;
                    // Stagger expand top-to-bottom, collapse
                    // bottom-to-top so motion always reads as
                    // flowing in the direction the tree is opening.
                    const stagger = otherOpen
                      ? i * 55
                      : (OTHER_CHILDREN.length - 1 - i) * 35;
                    return (
                    <div
                      key={child.id}
                      className="ml-3.5 flex items-center gap-2 rounded-[4px] px-2 py-1"
                      style={{
                        backgroundColor: rowBg(child.id),
                        opacity: otherOpen ? 1 : 0,
                        transform: `translateY(${otherOpen ? 0 : -4}px)`,
                        transition: `background-color 320ms ease-out, opacity 260ms ease-out ${stagger}ms, transform 260ms ease-out ${stagger}ms`,
                      }}
                    >
                      <span className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center text-[#101010]">
                        <img
                          src={child.iconSrc}
                          alt=""
                          aria-hidden="true"
                          width={child.iconSize ?? 16}
                          height={child.iconSize ?? 16}
                        />
                      </span>
                      <span
                        className={clsx(
                          "flex-1 truncate text-[12px] leading-[18px] text-[#101010]",
                          active ? "font-medium" : "font-normal",
                        )}
                      >
                        {child.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* end Other folder */}
        </div>
        {/* end sidebar */}
        </div>

        {/* Main canvas — every panel mounted so the crossfade doesn't flash
            a blank frame while React swaps in fresh markup. */}
        <div className="relative min-w-0 flex-1 bg-white">
          {PHASES.map((phase) => (
            <MainPanel
              key={phase.id}
              visible={phase.id === displayId}
              phaseId={phase.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Top-level: drive phase loop, gate on in-view ────────────────────────
export function ClientPortalVisual() {
  const [phase, setPhase] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const ref = useRef(null);

  // In-view detection — scroll-listener fallback so it works inside the
  // sticky ValuePropsStory layout (IntersectionObserver fights the
  // sticky ancestor).
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

  // Advance phases in a loop. Paused freezes the current phase.
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

  return (
    <div
      ref={ref}
      className="font-inter relative aspect-[3/2] w-full overflow-hidden rounded-[28px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]"
      style={{ backgroundImage: CARD_GRADIENT }}
    >
      <PortalSurface phaseIndex={phase} active={inView} paused={paused} />
      <PlayPauseToggle
        paused={paused}
        durationMs={loopMs}
        active={inView}
        onToggle={() => setPaused((p) => !p)}
      />
    </div>
  );
}
