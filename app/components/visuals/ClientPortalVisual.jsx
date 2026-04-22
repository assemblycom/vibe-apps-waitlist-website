"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

// Second value prop ("Client experience") visual. A client's-eye view of
// the portal their firm built in Assembly Studio. Follows Figma node
// 227:11325 for sidebar + home layout (lime-green client-branded sidebar,
// Good-morning banner, Your-actions counters, About-us block, working-
// hours table). Tour steps walk through the sidebar one by one:
// Client Home → Messages → On-Boarding → Payments → Helpdesk. Only the
// sidebar highlight and the main canvas change between
// phases; the sidebar itself stays mounted so the handoff reads as a real
// user navigating, not a slide show.

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

// Each phase corresponds to a sidebar item. Durations tuned per-phase so
// denser screens have more dwell time.
const PHASES = [
  { id: "home", duration: 5200 },
  { id: "messages", duration: 4600 },
  { id: "onboarding", duration: 4000 },
  { id: "payments", duration: 4200 },
  { id: "helpdesk", duration: 4400 },
];

// ── Sidebar item ────────────────────────────────────────────────────────
function SidebarItem({ label, iconSrc, iconNode, active }) {
  return (
    <div
      className={clsx(
        "flex items-center gap-2 rounded-[4px] px-2 py-[5px] transition-colors duration-[350ms] ease-out",
      )}
      style={{
        backgroundColor: active ? SIDEBAR_ACTIVE_BG : "transparent",
      }}
    >
      <span className="flex h-[16px] w-[16px] flex-shrink-0 items-center justify-center text-[#101010]">
        {iconSrc ? (
          <img
            src={iconSrc}
            alt=""
            aria-hidden="true"
            width={14}
            height={14}
          />
        ) : (
          iconNode
        )}
      </span>
      <span
        className={clsx(
          "flex-1 truncate text-[12px] leading-[16px] text-[#101010]",
          active ? "font-medium" : "font-normal",
        )}
      >
        {label}
      </span>
    </div>
  );
}

// ── Main canvas panels ──────────────────────────────────────────────────
function PanelHeader({ title, subtitle }) {
  return (
    <div className="mb-3">
      <div className="text-[14px] font-medium leading-[1.3] text-[#212b36]">
        {title}
      </div>
      {subtitle && (
        <div className="mt-0.5 text-[9px] leading-[1.35] text-[#6b6f76]">
          {subtitle}
        </div>
      )}
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

// Home panel — mirrors Figma node 227:11387. Welcome heading → hero
// banner → Your-actions counters → About-us copy → Working-hours table.
function HomePanel() {
  // Invoices uses the Payments icon (closest semantic match from the
  // supplied asset pack); Tasks falls back to an inline tick-in-square.
  const actions = [
    { label: "Invoices", count: "100", iconSrc: "/Icons/payments.svg", active: true },
    { label: "Contracts", count: "5", iconSrc: "/Icons/contracts.svg" },
    { label: "Forms", count: "10", iconSrc: "/Icons/forms.svg" },
    { label: "Tasks", count: "50", iconNode: <TaskIcon /> },
  ];
  return (
    <div className="flex h-full flex-col overflow-hidden px-5 py-4">
      <PanelHeader
        title="Good morning, Ana"
        subtitle="Here's what needs your attention today"
      />

      {/* Hero banner — lavender/blue gradient stands in for the Figma
          image so we don't ship a photo asset. */}
      <div
        className="mb-3 h-[80px] w-full overflow-hidden rounded-[6px]"
        style={{
          background:
            "linear-gradient(135deg, rgb(125,164,255) 0%, rgb(176,147,230) 55%, rgb(102,126,234) 100%)",
        }}
      />

      {/* Your actions */}
      <div className="mb-3 rounded-[4px] border border-[#eaecf0] bg-[#f8f9fb] p-2">
        <div className="mb-1.5 text-[9px] font-medium text-[#212b36]">
          Your actions
        </div>
        <div className="grid grid-cols-4 gap-[5px]">
          {actions.map((a) => (
            <div
              key={a.label}
              className={clsx(
                "flex items-center justify-between rounded-[4px] px-2 py-[7px]",
                a.active
                  ? "border-0"
                  : "border border-[#eff1f4] bg-white",
              )}
              style={a.active ? { backgroundColor: SIDEBAR_ACTIVE_BG } : {}}
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
                <span className="text-[9px] font-medium text-[#6b6f76]">
                  {a.label}
                </span>
              </div>
              <span className="text-[9px] text-[#212b36]">{a.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* About us */}
      <div className="mb-3">
        <div className="mb-1 text-[11px] font-medium leading-[1.4] text-[#212b36]">
          About us
        </div>
        <p className="max-w-[440px] text-[9px] leading-[1.5] text-[#212b36]">
          BrandMages — a full-service marketing agency helping businesses
          grow their brand, attract new customers, and stand out in a
          crowded marketplace.
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
    <div className="flex items-center justify-center py-1">
      <div className="rounded-[4px] border border-[#eff1f4] bg-white px-1.5 py-[1px] text-[9px] text-[#212b36]">
        {label}
      </div>
    </div>
  );
}

// Messages panel — mirrors Figma node 227:18962. Group-thread header →
// date chips → messages with avatars, name+time, body (and an inline
// continuation that hangs off the prior avatar) → composer at the bottom.
function MessagesPanel() {
  return (
    <div className="flex h-full flex-col">
      {/* Header — participants + ellipsis button */}
      <div className="flex items-center gap-3 border-b border-[#dfe1e4] px-4 py-2.5">
        <p className="flex-1 text-[10px] font-medium text-[#212b36]">
          Bernard Simons, Kaitlyn Moore, Martin Sung
        </p>
        <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[3px] border border-black/10 text-[#6b6f76]">
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <circle cx="5" cy="12" r="1.8" />
            <circle cx="12" cy="12" r="1.8" />
            <circle cx="19" cy="12" r="1.8" />
          </svg>
        </span>
      </div>

      {/* Thread body */}
      <div className="flex-1 overflow-hidden pt-2">
        <DateChip label="Today" />

        {/* Bernard Simons — opening message + continuation (no avatar
            on the continuation row; it hangs off the prior avatar). */}
        <div className="px-4 py-1">
          <div className="flex items-start gap-2">
            <Avatar initials="BS" bg="#dff3f9" fg="#649eaf" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[10px] leading-[1.4]">
                <span className="font-medium text-[#212b36]">
                  Bernard Simons
                </span>
                <span className="text-[#6b6f76]">1:34 PM</span>
              </div>
              <p className="text-[10px] leading-[1.5] text-[#212b36]">
                Following up on your previous email — is there anything
                you need feedback on?
              </p>
            </div>
          </div>
          <p className="mt-0.5 pl-[30px] pr-2 text-[10px] leading-[1.5] text-[#212b36]">
            The seminal designs looked great — seems we just need more
            data to present. Let me know what you think!
          </p>
        </div>

        {/* Martin Sung — reply with @mention */}
        <div className="px-4 py-1">
          <div className="flex items-start gap-2">
            <Avatar initials="MS" bg="#f0eaff" fg="#7f69b5" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[10px] leading-[1.4]">
                <span className="font-medium text-[#212b36]">
                  Martin Sung
                </span>
                <span className="text-[#6b6f76]">2:20 PM</span>
              </div>
              <p className="text-[10px] leading-[1.5] text-[#212b36]">
                It works!{" "}
                <span className="text-[#6b6f76]">@BernardSimons</span> —
                we'll have the demo deployed by EOD tomorrow.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-[#eef0f2] bg-white px-4 py-2">
        <div className="rounded-[6px] border border-[#dfe1e4] bg-white px-2.5 py-1.5 shadow-[0_1px_2px_-1px_rgba(0,0,0,0.06)]">
          <p className="text-[10px] text-[#90959d]">Message your client</p>
          <div className="mt-1 flex items-center justify-between">
            <span className="flex h-[14px] w-[14px] items-center justify-center text-[#90959d]">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </span>
            <span className="flex h-[16px] w-[16px] items-center justify-center rounded-[3px] bg-[#eff1f4] text-[#6b6f76]">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function OnboardingPanel() {
  return (
    <div className="flex h-full flex-col px-5 py-4">
      <PanelHeader title="On-Boarding" />
      <div className="flex-1">
        <div className="mb-1.5 text-[10px] uppercase tracking-[0.08em] text-[#90959d]">
          Step 2 of 4
        </div>
        <div className="mb-3 flex gap-[3px]">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[3px] flex-1 rounded-full"
              style={{
                backgroundColor:
                  i <= 1 ? "rgba(16,16,16,0.85)" : "rgba(16,16,16,0.1)",
              }}
            />
          ))}
        </div>
        <div className="mb-3 text-[13px] font-semibold text-[#101010]">
          Tell us about your business
        </div>
        <div className="space-y-2">
          <div>
            <div className="mb-0.5 text-[10px] text-[#6b6f76]">
              Business name
            </div>
            <div className="h-[28px] rounded-[4px] border border-[#eef0f2] bg-white px-2 text-[11px] leading-[28px] text-[#212b36]">
              Acme Legal
            </div>
          </div>
          <div>
            <div className="mb-0.5 text-[10px] text-[#6b6f76]">Industry</div>
            <div className="h-[28px] rounded-[4px] border border-[#eef0f2] bg-white px-2 text-[11px] leading-[28px] text-[#212b36]">
              Law firm
            </div>
          </div>
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
    active: { bg: "#dff5d3", fg: "#3d7d2d" },
    cancelled: { bg: "#eef0f2", fg: "#6b6f76" },
    open: { bg: "#dbe8fb", fg: "#3866c0" },
    paid: { bg: "#dff5d3", fg: "#3d7d2d" },
    default: { bg: "#eef0f2", fg: "#6b6f76" },
  }[variant] || { bg: "#eef0f2", fg: "#6b6f76" };
  return (
    <span
      className="inline-block rounded-full px-[6px] py-[1px] text-[9px] font-medium leading-[1.3]"
      style={{ backgroundColor: styles.bg, color: styles.fg }}
    >
      {label}
    </span>
  );
}

// Small Visa wordmark — inline so we don't ship an image. Proportioned
// to read as "Visa" at the 16-18px height of the card row.
function VisaMark() {
  return (
    <div className="flex h-[16px] w-[24px] items-center justify-center rounded-[2px] bg-white border border-[#eef0f2] text-[8px] font-bold italic tracking-tight text-[#1a1f71]">
      VISA
    </div>
  );
}

// Simplified bank glyph for the ACH row.
function BankIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[#212b36]"
      aria-hidden="true"
    >
      <path d="M3 10 12 4l9 6" />
      <path d="M5 10v8M9 10v8M15 10v8M19 10v8" />
      <path d="M3 20h18" />
    </svg>
  );
}

function PaymentsPanel() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Page title + divider — matches Figma "Billing" header strip */}
      <div className="border-b border-[#eef0f2] px-5 py-3 text-[13px] font-medium text-[#212b36]">
        Billing
      </div>

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
            <div className="grid grid-cols-[1fr_1fr_80px] gap-2 border-b border-[#eef0f2] px-2 py-1.5 text-[9px] font-medium text-[#6b6f76]">
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
                className="grid grid-cols-[1fr_1fr_80px] items-center gap-2 border-b border-[#f4f5f7] px-2 py-1.5 text-[10px] text-[#212b36] last:border-b-0"
              >
                <span>{row.price}</span>
                <span className="text-[#6b6f76]">{row.period}</span>
                <StatusChip label={row.status} variant={row.variant} />
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
            <div className="grid grid-cols-[80px_80px_1fr] gap-2 border-b border-[#eef0f2] px-2 py-1.5 text-[9px] font-medium text-[#6b6f76]">
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
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#90959d]" aria-hidden="true">
                    <path d="M4 4v6h6M20 20v-6h-6" />
                    <path d="M4 10a8 8 0 0 1 14-5M20 14a8 8 0 0 1-14 5" />
                  </svg>
                </span>
                <StatusChip label={row.status} variant={row.variant} />
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
    <div className="flex h-full flex-col px-5 py-4">
      <PanelHeader title="Helpdesk" subtitle="Embedded from our Notion workspace" />
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
  );
}

const PANELS = {
  home: HomePanel,
  messages: MessagesPanel,
  onboarding: OnboardingPanel,
  payments: PaymentsPanel,
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

// Sidebar item order matches Figma 227:11329. Icon assets live under
// public/Icons/.
const NAV = [
  { id: "home", label: "Client Home", iconSrc: "/Icons/clienthome.svg" },
  { id: "messages", label: "Messages", iconSrc: "/Icons/messages.svg" },
  { id: "onboarding", label: "On-Boarding", iconSrc: "/Icons/on-boarding.svg" },
  { id: "payments", label: "Payments", iconSrc: "/Icons/payments.svg" },
  { id: "helpdesk", label: "Helpdesk", iconSrc: "/Icons/helpdesk.svg" },
];

// ── Portal surface — sidebar + main canvas ──────────────────────────────
function PortalSurface({ phaseIndex }) {
  const activeId = PHASES[phaseIndex].id;
  return (
    <div
      className={clsx(
        INNER_CARD,
        "absolute left-[5%] top-[7%] h-[134%] w-[120%] overflow-hidden",
      )}
    >
      <div className="flex h-full">
        {/* Sidebar — lime-green client-branded column (Figma 227:11329) */}
        <div
          className="flex w-[196px] flex-shrink-0 flex-col gap-[2px] px-2 pt-2.5"
          style={{ backgroundColor: SIDEBAR_BG }}
        >
          {/* Brand row */}
          <div className="mb-1 flex items-center gap-2 px-2 py-1.5">
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[4px] bg-[#101010]">
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                aria-hidden="true"
              >
                <circle cx="5" cy="5" r="3.2" fill="#fff" />
              </svg>
            </span>
            <span className="text-[12px] font-normal text-black">
              BrandMages
            </span>
          </div>

          {NAV.map((item) => (
            <SidebarItem
              key={item.id}
              label={item.label}
              iconSrc={item.iconSrc}
              iconNode={item.iconNode}
              active={item.id === activeId}
            />
          ))}
        </div>

        {/* Main canvas — every panel mounted so the crossfade doesn't flash
            a blank frame while React swaps in fresh markup. */}
        <div className="relative min-w-0 flex-1 bg-white">
          {PHASES.map((phase, i) => (
            <MainPanel
              key={phase.id}
              visible={i === phaseIndex}
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

  // Advance phases in a loop.
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      setPhase((p) => (p + 1) % PHASES.length);
    }, PHASES[phase].duration);
    return () => clearTimeout(t);
  }, [phase, inView]);

  return (
    <div
      ref={ref}
      className="relative aspect-[3/2] w-full overflow-hidden rounded-[28px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]"
      style={{ backgroundImage: CARD_GRADIENT }}
    >
      <PortalSurface phaseIndex={phase} />
    </div>
  );
}
