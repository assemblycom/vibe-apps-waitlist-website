"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

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

// Animation loop starts at the CRM view — the user wanted to skip the
// Dashboard intro. Every phase highlights CRM in the sidebar because
// the whole sequence is a drill-in from Companies into a record.
const PHASES = [
  { id: "crm", duration: 4800 },
  { id: "messages", duration: 4200 },
  { id: "onboarding", duration: 4200 },
  { id: "chat", duration: 5400 },
];

// ── Studio sidebar item — matches ThreeStepsVisual / ClientPortalVisual
function SidebarItem({ label, iconSrc, iconNode, active, muted }) {
  return (
    <div
      className="flex items-center gap-2 rounded-[4px] px-2 py-1 transition-colors duration-[350ms] ease-out"
      style={{
        backgroundColor: active ? SIDEBAR_ACTIVE_BG : "transparent",
      }}
    >
      <span
        className={clsx(
          "flex h-[16px] w-[16px] flex-shrink-0 items-center justify-center text-[#101010]",
          muted && "opacity-60",
        )}
      >
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
          "flex-1 truncate text-[12px] leading-[16px]",
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
    <div className="flex h-[36px] items-center border-b border-[#eef0f2] px-4">
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
function StatCard({ label, value, delta, deltaPositive }) {
  return (
    <div className="rounded-[5px] border border-[#eef0f2] bg-white px-2.5 py-2">
      <div className="text-[9px] uppercase tracking-[0.06em] text-[#6b6f76]">
        {label}
      </div>
      <div className="mt-0.5 flex items-baseline gap-1.5">
        <span className="text-[16px] font-semibold leading-none text-[#101010]">
          {value}
        </span>
        {delta && (
          <span
            className={clsx(
              "text-[9px] font-medium",
              deltaPositive ? "text-[#3d7d2d]" : "text-[#6b6f76]",
            )}
          >
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}

function OnboardingProgressRow({ name, step, total, pct }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5">
      <span className="flex-1 truncate text-[10px] text-[#212b36]">{name}</span>
      <span className="w-[70px] text-[9px] text-[#6b6f76]">
        Step {step} / {total}
      </span>
      <div className="h-[3px] w-[70px] overflow-hidden rounded-full bg-[#eef0f2]">
        <div
          className="h-full rounded-full bg-[#101010]/75"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function DashboardPanel() {
  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Dashboard" />
      <div className="flex-1 overflow-hidden px-5 py-3">
        {/* Greeting */}
        <div className="mb-3 text-[13px] font-semibold text-[#101010]">
          Good morning, Martin
        </div>

        {/* Stat cards */}
        <div className="mb-4 grid grid-cols-3 gap-1.5">
          <StatCard label="Active clients" value="24" delta="+3" deltaPositive />
          <StatCard label="Onboarding" value="6" delta="in progress" />
          <StatCard label="Kickoffs this week" value="4" />
        </div>

        {/* Onboarding progress */}
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[11px] font-medium text-[#212b36]">
            Onboarding in progress
          </div>
          <div className="text-[9px] text-[#6b6f76]">This week</div>
        </div>
        <div className="overflow-hidden rounded-[5px] border border-[#eef0f2]">
          <OnboardingProgressRow name="Acme Legal" step={4} total={4} pct={100} />
          <div className="border-t border-[#f0f1f3]" />
          <OnboardingProgressRow name="Northstar Advisory" step={3} total={4} pct={75} />
          <div className="border-t border-[#f0f1f3]" />
          <OnboardingProgressRow name="Helio" step={2} total={4} pct={50} />
          <div className="border-t border-[#f0f1f3]" />
          <OnboardingProgressRow name="Park & Co. CPAs" step={1} total={4} pct={25} />
        </div>
      </div>
    </div>
  );
}

// ── CRM → Companies list panel (phase 1) ────────────────────────────────
// Matches the Assembly CRM reference: sub-tabs Companies | Contacts,
// row per company with a square company avatar + domain, a contact
// avatar + name in the second column (or "N contacts" link for
// multiples), and a Created date. Cursor glides over the top row and
// presses near the end of the phase to hand off to the Company view.
function CompanyAvatar({ initials, bg, fg }) {
  return (
    <div
      className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-[4px] text-[9px] font-semibold"
      style={{ backgroundColor: bg, color: fg }}
    >
      {initials}
    </div>
  );
}

function ContactAvatar({ initials, bg, fg }) {
  return (
    <div
      className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full text-[9px] font-medium"
      style={{ backgroundColor: bg, color: fg }}
    >
      {initials}
    </div>
  );
}

function RowCheckbox() {
  return (
    <span className="flex h-[14px] w-[14px] flex-shrink-0 items-center justify-center rounded-full border border-[#dfe1e4] bg-white" />
  );
}

function CompaniesPanel({ cursorPhase }) {
  const rows = [
    {
      name: "Acme Legal",
      domain: "acme-legal.com",
      avatar: { initials: "AL", bg: "#e6efff", fg: "#3866c0" },
      contact: { name: "Bernard Simons", initials: "BS", bg: "#dff3f9", fg: "#649eaf" },
      created: "8/19/2024",
    },
    {
      name: "Northstar Advisory",
      domain: "northstar.co",
      avatar: { initials: "N", bg: "#101010", fg: "#ffffff" },
      contact: { name: "Dana Reyes", initials: "DR", bg: "#ffe2c9", fg: "#b36a2d" },
      created: "7/02/2024",
    },
    {
      name: "Helio",
      domain: "helio.io",
      avatar: { initials: "H", bg: "#fff1c5", fg: "#8a6d0d" },
      contacts: 2,
      created: "6/14/2024",
    },
    {
      name: "Park & Co. CPAs",
      domain: "parkco.com",
      avatar: { initials: "P", bg: "#dff5d3", fg: "#3d7d2d" },
      contact: { name: "Evelyn Park", initials: "EP", bg: "#ffe4ec", fg: "#b8477a" },
      created: "5/28/2024",
    },
    {
      name: "Runway Legal",
      domain: "runwaylegal.com",
      avatar: { initials: "R", bg: "#f0eaff", fg: "#7f69b5" },
      contact: { name: "Marcus Lin", initials: "ML", bg: "#eef0f2", fg: "#6b6f76" },
      created: "4/10/2024",
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

      {/* Table — cols: Company | Contacts | Created */}
      <div className="relative flex-1 overflow-hidden px-4 py-2">
        <div className="overflow-hidden rounded-[5px] border border-[#eef0f2]">
          <div className="grid grid-cols-[1.5fr_1fr_70px] gap-2 border-b border-[#eef0f2] bg-[#f8f9fb] px-2.5 py-1.5 text-[9px] font-medium text-[#6b6f76]">
            <span>Company</span>
            <span>Contacts</span>
            <span>Created</span>
          </div>
          {rows.map((row, i) => {
            const hovered =
              i === targetIndex &&
              (cursorPhase === "hovering" || cursorPhase === "clicking");
            return (
              <div
                key={row.name}
                className={clsx(
                  "grid grid-cols-[1.5fr_1fr_70px] items-center gap-2 border-b border-[#f4f5f7] px-2.5 py-1.5 text-[10px] text-[#212b36] last:border-b-0 transition-colors duration-[200ms]",
                  hovered && "bg-[#f4f6f9]",
                )}
              >
                {/* Company — checkbox + square avatar + name/domain */}
                <div className="flex min-w-0 items-center gap-2">
                  <RowCheckbox />
                  <CompanyAvatar {...row.avatar} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[10px] font-medium text-[#212b36]">
                      {row.name}
                    </div>
                    <div className="truncate text-[9px] text-[#6b6f76]">
                      {row.domain}
                    </div>
                  </div>
                </div>
                {/* Contacts — circle avatar + name, or "N contacts" link */}
                <div className="flex min-w-0 items-center gap-1.5">
                  {row.contacts ? (
                    <span className="truncate text-[10px] text-[#212b36] underline decoration-dotted decoration-[#c9cbcd] underline-offset-[2px]">
                      {row.contacts} contacts
                    </span>
                  ) : (
                    <>
                      <ContactAvatar {...row.contact} />
                      <span className="truncate text-[10px] text-[#212b36]">
                        {row.contact.name}
                      </span>
                    </>
                  )}
                </div>
                {/* Created date */}
                <span className="truncate text-[10px] text-[#6b6f76]">
                  {row.created}
                </span>
              </div>
            );
          })}
        </div>

        {/* Cursor — anchored to the target row's center. */}
        <div
          aria-hidden="true"
          className={clsx(
            "pointer-events-none absolute transition-[transform,opacity] ease-[cubic-bezier(0.22,0.61,0.36,1)]",
            cursorPhase === "hidden"
              ? "opacity-0 duration-[200ms]"
              : "opacity-100 duration-[900ms]",
          )}
          style={{
            // The target row sits ~34px below the header bar + ~8px
            // padding. Anchor cursor's tip roughly over the row's
            // middle-left (the company name).
            left: "70px",
            top: "58px",
            transform:
              cursorPhase === "hidden" || cursorPhase === "entering"
                ? "translate(60px, 90px) scale(0.95)"
                : cursorPhase === "clicking"
                ? "translate(0, 0) scale(0.88)"
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
      </div>
    </div>
  );
}

function StatusChip({ label }) {
  const styles = {
    Onboarding: { bg: "#dbe8fb", fg: "#3866c0" },
    Active: { bg: "#dff5d3", fg: "#3d7d2d" },
    Prospect: { bg: "#eef0f2", fg: "#6b6f76" },
  }[label] || { bg: "#eef0f2", fg: "#6b6f76" };
  return (
    <span
      className="inline-block rounded-full px-[6px] py-[1px] text-[9px] font-medium leading-[1.3]"
      style={{ backgroundColor: styles.bg, color: styles.fg }}
    >
      {label}
    </span>
  );
}

// ── Company detail header (shared by Messages/Onboarding/chat phases) ──
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

function CompanyHeader({ activeTab }) {
  const tabs = [
    { id: "messages", label: "Messages" },
    { id: "onboarding", label: "Onboarding" },
    { id: "files", label: "Files" },
    { id: "contracts", label: "Contracts" },
    { id: "forms", label: "Forms" },
    { id: "billing", label: "Billing" },
  ];
  return (
    <>
      {/* Crumb / title row */}
      <div className="flex h-[40px] items-center gap-1.5 border-b border-[#eef0f2] px-4">
        <span className="text-[11px] text-[#6b6f76]">CRM</span>
        <ChevronRight />
        <span className="text-[11px] text-[#101010]">Acme Legal</span>
      </div>
      {/* Tabs — active tab's accent line sits on the row's border line
          via -mb-px, so the two lines overlap instead of floating. */}
      <div className="flex items-center gap-4 border-b border-[#eef0f2] px-4">
        {tabs.map((t) => {
          const isActive = t.id === activeTab;
          return (
            <span
              key={t.id}
              className={clsx(
                "py-2 text-[11px] transition-colors duration-[250ms]",
                isActive
                  ? "-mb-px border-b border-[#101010] text-[#101010]"
                  : "text-[#6b6f76]",
              )}
            >
              {t.label}
            </span>
          );
        })}
        <span className="flex items-center gap-0.5 py-2 text-[11px] text-[#6b6f76]">
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
      {/* Contact selector */}
      <div className="flex items-center border-b border-[#eef0f2] px-4 py-2">
        <div className="flex items-center gap-1 rounded-[4px] border border-[#dfe1e4] bg-white px-2 py-[3px] text-[10px] text-[#212b36]">
          Bernard Simons
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
        </div>
      </div>
    </>
  );
}

// ── Company Messages panel (phase 2) ────────────────────────────────────
// Matches the Assembly company-messages reference: small rounded
// date chips separate the thread by day, each message carries an
// empty circle avatar + name + time label, and bodies are plain
// paragraphs (no bubbles).
function MessageDateChip({ label, align = "right" }) {
  return (
    <div className={clsx("flex py-1", align === "right" ? "justify-end" : "justify-start")}>
      <div className="rounded-[4px] border border-[#eef0f2] bg-white px-1.5 py-[1px] text-[9px] text-[#212b36]">
        {label}
      </div>
    </div>
  );
}

function EmptyAvatar() {
  return (
    <div className="h-[18px] w-[18px] flex-shrink-0 rounded-full border border-[#dfe1e4] bg-white" />
  );
}

function ThreadMessage({ name, time, body }) {
  return (
    <div className="flex items-start gap-2">
      <EmptyAvatar />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[10px] leading-[1.4]">
          <span className="font-medium text-[#212b36]">{name}</span>
          <span className="text-[#6b6f76]">{time}</span>
        </div>
        <p className="text-[10px] leading-[1.5] text-[#212b36]">{body}</p>
      </div>
    </div>
  );
}

function CompanyMessagesBody() {
  return (
    <div className="flex-1 overflow-hidden px-4 py-2">
      <MessageDateChip label="Wed, Sep 4" align="right" />
      <div className="space-y-2 py-1">
        <ThreadMessage
          name="Bernard Simons"
          time="1:37 PM"
          body="Hi Jennifer, can you tell me more about SEO?"
        />
        <ThreadMessage
          name="Charlotte Beaty"
          time="1:56 PM"
          body="Absolutely, Charles! SEO is about improving your website’s visibility — optimizing content, targeting the right keywords, and building links to boost credibility."
        />
      </div>
      <MessageDateChip label="Fri, Sep 6" align="right" />
      <div className="space-y-2 py-1">
        <ThreadMessage
          name="Bernard Simons"
          time="1:37 PM"
          body="That sounds interesting — what would make it work for a firm like ours?"
        />
      </div>
    </div>
  );
}

// ── Company Onboarding panel (phase 3) ──────────────────────────────────
// Displays the responses the client submitted in the generated
// onboarding wizard — structured but simplified.
function OnboardingField({ label, value, multiline }) {
  return (
    <div>
      <div className="mb-0.5 text-[9px] uppercase tracking-[0.06em] text-[#6b6f76]">
        {label}
      </div>
      <div
        className={clsx(
          "rounded-[4px] border border-[#eef0f2] bg-white px-2 text-[10px] text-[#212b36]",
          multiline ? "py-1.5 leading-[1.5]" : "h-[26px] leading-[26px]",
        )}
      >
        {value}
      </div>
    </div>
  );
}

function CompanyOnboardingBody() {
  return (
    <div className="flex-1 overflow-hidden px-4 py-3">
      <div className="mb-2">
        <div className="text-[11px] font-medium text-[#212b36]">
          Intake responses
        </div>
        <span className="mt-1 inline-block rounded-full bg-[#dff5d3] px-1.5 py-[1px] text-[9px] font-medium text-[#3d7d2d]">
          Complete
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <OnboardingField label="Business name" value="Acme Legal" />
        <OnboardingField label="Industry" value="Law firm" />
        <OnboardingField label="Team size" value="5–10 people" />
        <OnboardingField label="Primary contact" value="Bernard Simons" />
      </div>
      <div className="mt-2">
        <OnboardingField
          label="Goals for this engagement"
          value="Launch a refreshed brand and client portal by Q3. Focus on inbound leads."
          multiline
        />
      </div>
    </div>
  );
}

// ── Right panels (phase 4): Properties → Internal chat ──────────────────
function PropertyRow({ label, value, chip }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <span className="w-[70px] flex-shrink-0 text-[9px] uppercase tracking-[0.06em] text-[#6b6f76]">
        {label}
      </span>
      <span className="min-w-0 flex-1 truncate text-[10px] text-[#212b36]">
        {value}
      </span>
      {chip && <StatusChip label={chip} />}
    </div>
  );
}

function PropertiesRightPanel() {
  return (
    <div className="flex h-full flex-col">
      {/* Panel tabs */}
      <div className="flex items-center gap-3 border-b border-[#eef0f2] px-3 h-[36px]">
        <span className="border-b-2 border-[#101010] py-1 text-[10px] font-medium text-[#101010]">
          Properties
        </span>
        <span className="border-b-2 border-transparent py-1 text-[10px] text-[#6b6f76]">
          Internal chat
        </span>
      </div>
      <div className="flex-1 overflow-hidden px-3 py-2">
        <PropertyRow label="Owner" value="Martin Sung" />
        <PropertyRow label="Stage" value="Onboarding" chip="Onboarding" />
        <PropertyRow label="Plan" value="Growth · Monthly" />
        <PropertyRow label="Next step" value="Kickoff call · Thu 10:00" />
        <PropertyRow label="Tags" value="Brand, Portal, Q3 launch" />
      </div>
    </div>
  );
}

function InternalChatRightPanel() {
  // Static message — the panel just appears with the message already
  // written so nothing "slides" or types in on the last frame.
  const message =
    "Hey @Martin, Acme Legal finished onboarding. Let me know how the kickoff call goes.";

  // Inline renderer that highlights @mentions in a muted teal.
  const renderWithMentions = (body) => {
    const parts = body.split(/(@\w+)/g);
    return parts.map((p, i) =>
      p.startsWith("@") ? (
        <span key={i} className="text-[#3866c0]">
          {p}
        </span>
      ) : (
        <span key={i}>{p}</span>
      ),
    );
  };

  return (
    <div className="flex h-full flex-col">
      {/* Panel tabs — Internal chat is active now. */}
      <div className="flex items-center gap-3 border-b border-[#eef0f2] px-3 h-[36px]">
        <span className="border-b-2 border-transparent py-1 text-[10px] text-[#6b6f76]">
          Properties
        </span>
        <span className="border-b-2 border-[#101010] py-1 text-[10px] font-medium text-[#101010]">
          Internal chat
        </span>
      </div>

      {/* Thread */}
      <div className="flex-1 overflow-hidden px-3 py-2">
        <div className="mb-1.5 text-[9px] uppercase tracking-[0.06em] text-[#6b6f76]">
          Today
        </div>
        <div className="flex items-start gap-2">
          <div className="flex h-[20px] w-[20px] flex-shrink-0 items-center justify-center rounded-full bg-[#ffe2c9] text-[9px] font-medium text-[#b36a2d]">
            PR
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[10px] leading-[1.4]">
              <span className="font-medium text-[#212b36]">Priya R.</span>
              <span className="text-[#6b6f76]">now</span>
            </div>
            <p className="text-[10px] leading-[1.5] text-[#212b36]">
              {renderWithMentions(message)}
            </p>
          </div>
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-[#eef0f2] bg-white px-3 py-2">
        <div className="rounded-[5px] border border-[#dfe1e4] bg-white px-2 py-1.5">
          <p className="text-[9px] text-[#90959d]">Message your team</p>
        </div>
      </div>
    </div>
  );
}

// ── Right sidebar — overlays the right edge of the main canvas during
// the "chat" phase. It does NOT push the main canvas narrower, so the
// onboarding fields underneath stay in their original positions (no
// reflow when the panel appears).
function RightSidebar({ visible, subPhase }) {
  if (!visible) return null;
  return (
    <div className="absolute bottom-0 right-0 top-0 z-10 w-[220px] border-l border-[#eef0f2] bg-white">
      <div className="relative h-full w-full">
        {/* Properties panel — pure opacity crossfade, no translate. */}
        <div
          className={clsx(
            "absolute inset-0 transition-opacity duration-[350ms] ease-out",
            subPhase === "properties"
              ? "visible opacity-100"
              : "pointer-events-none invisible opacity-0",
          )}
        >
          <PropertiesRightPanel />
        </div>
        {/* Internal chat panel — pure opacity crossfade, no translate. */}
        <div
          className={clsx(
            "absolute inset-0 transition-opacity duration-[350ms] ease-out",
            subPhase === "chat"
              ? "visible opacity-100"
              : "pointer-events-none invisible opacity-0",
          )}
        >
          <InternalChatRightPanel />
        </div>
      </div>
    </div>
  );
}

// ── Main canvas switcher ────────────────────────────────────────────────
function MainCanvas({ phaseId, cursorPhase }) {
  // Dashboard and CRM swap the whole body; the three company phases
  // share the company header but swap the body area.
  if (phaseId === "dashboard") return <DashboardPanel />;
  if (phaseId === "crm") return <CompaniesPanel cursorPhase={cursorPhase} />;

  // Company detail — determine which tab is active.
  const activeTab = phaseId === "onboarding" || phaseId === "chat"
    ? "onboarding"
    : "messages";
  return (
    <div className="flex h-full flex-col">
      <CompanyHeader activeTab={activeTab} />
      {activeTab === "messages" ? (
        <CompanyMessagesBody />
      ) : (
        <CompanyOnboardingBody />
      )}
    </div>
  );
}

const NAV = [
  { id: "dashboard", label: "Dashboard", iconSrc: "/Icons/Dashboard.svg" },
  { id: "crm", label: "CRM", iconSrc: "/Icons/CRM.svg" },
  { id: "notifications", label: "Notifications", iconSrc: "/Icons/Notifications.svg" },
  { id: "automation", label: "Automation", iconSrc: "/Icons/Automations.svg" },
  { id: "pizzatracker", label: "Pizzatracker", iconSrc: "/Icons/pizzatracker.svg", sectionLabel: "Apps" },
  { id: "onboarding", label: "On-Boarding", iconSrc: "/Icons/on-boarding.svg" },
  { id: "add", label: "Add App", iconSrc: "/Icons/add.svg", muted: true },
  { id: "marketplace", label: "Marketplace", iconSrc: "/Icons/marketplace.svg", sectionLabel: "Workspace" },
  { id: "settings", label: "Settings", iconSrc: "/Icons/Settings.svg" },
];

function StudioSurface({ phaseIndex, cursorPhase, rightPanel }) {
  const activePhase = PHASES[phaseIndex].id;
  // CRM is the active sidebar item for the entire loop.
  const activeSidebar = "crm";
  const showRightPanel = activePhase === "chat";

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
          className="flex w-[200px] flex-shrink-0 flex-col gap-[6px] border-r border-[#dfe1e4] px-2 pt-2.5"
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

        {/* Right panel — only during chat phase */}
        <RightSidebar visible={showRightPanel} subPhase={rightPanel} />
      </div>
    </div>
  );
}

// ── Top-level: drive phase loop, gate on in-view ────────────────────────
export function StudioAppCardVisual() {
  const [phase, setPhase] = useState(0);
  const [inView, setInView] = useState(false);
  // Cursor animation for the CRM phase only. "hidden" outside CRM;
  // "entering" → "hovering" → "clicking" as the phase unfolds.
  const [cursorPhase, setCursorPhase] = useState("hidden");
  // Right-panel sub-phase during the chat phase: "properties" is
  // briefly visible first, then swaps to "chat".
  const [rightPanel, setRightPanel] = useState("properties");
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

  // Drive phase progression.
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      setPhase((p) => (p + 1) % PHASES.length);
    }, PHASES[phase].duration);
    return () => clearTimeout(t);
  }, [phase, inView]);

  // Cursor choreography for the CRM phase (phase index 1).
  useEffect(() => {
    if (!inView) return;
    const activeId = PHASES[phase].id;
    if (activeId !== "crm") {
      setCursorPhase("hidden");
      return;
    }
    const timers = [];
    setCursorPhase("entering");
    timers.push(setTimeout(() => setCursorPhase("hovering"), 700));
    // Press near the end so the phase transition feels like the click
    // opened the company.
    timers.push(setTimeout(() => setCursorPhase("clicking"), 3600));
    return () => timers.forEach((t) => clearTimeout(t));
  }, [phase, inView]);

  // Right-panel choreography during the chat phase.
  useEffect(() => {
    if (!inView) return;
    const activeId = PHASES[phase].id;
    if (activeId !== "chat") {
      setRightPanel("properties");
      return;
    }
    setRightPanel("properties");
    const t = setTimeout(() => setRightPanel("chat"), 1400);
    return () => clearTimeout(t);
  }, [phase, inView]);

  return (
    <div
      ref={ref}
      className="font-inter relative aspect-[3/2] w-full overflow-hidden rounded-[28px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]"
      style={{ backgroundImage: CARD_GRADIENT }}
    >
      <StudioSurface
        phaseIndex={phase}
        cursorPhase={cursorPhase}
        rightPanel={rightPanel}
      />
    </div>
  );
}
