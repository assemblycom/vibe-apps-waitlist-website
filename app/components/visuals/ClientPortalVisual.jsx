"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { PlayPauseToggle } from "./PlayPauseToggle";

// Second value prop ("Client experience") visual. A client's-eye view of
// the portal their firm built in Assembly Studio. Follows Figma node
// 227:11325 for sidebar + home layout (lime-green client-branded sidebar,
// Good-morning banner, Your-actions counters, About-us block, working-
// hours table). Tour steps walk through the sidebar one by one:
// Client Home → Messages → Onboarding → Payments → Tasks → Other ▸
// Schedule Call. Onboarding is a top-level row (not inside "Other")
// because it's important enough to surface directly; the tour still
// opens the "Other" folder at the end to reveal a Calendly-like
// Schedule-a-Call screen as the narrative payoff. Only the sidebar
// highlight and the main canvas change between phases; the sidebar
// itself stays mounted so the handoff reads as a real user navigating,
// not a slide show.
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

// Each phase corresponds to a sidebar item. Helpdesk lives inside the
// "Other" folder and isn't part of the click-through flow — the tour
// ends on Schedule Call, which is the narrative payoff (the folder
// opens to reveal a Calendly-like booking screen). Onboarding sits at
// the top level, so it's a simple one-step click.
const PHASES = [
  { id: "home", duration: 5200 },
  { id: "messages", duration: 4600 },
  { id: "onboarding", duration: 4600 },
  { id: "payments", duration: 4200 },
  { id: "tasks", duration: 4200 },
  { id: "schedule", duration: 5200 },
];

// Phases that live inside the "Other" folder. When one of these is
// active the folder auto-expands; otherwise it stays collapsed to its
// folder icon.
const CHILD_PHASE_IDS = new Set(["schedule"]);

// Fixed row positions inside the sidebar column (px, relative to the
// sidebar's top-left). Used to drive the click-through cursor. y values
// aim at the middle of each row; x puts the cursor tip over the label.
// Onboarding sits between Messages and Payments at the top level; the
// "Other" folder is the last row and its children (helpdesk, schedule)
// reveal below it when expanded.
const CURSOR_POS = {
  home: { x: 96, y: 54 },
  messages: { x: 96, y: 86 },
  onboarding: { x: 96, y: 118 },
  payments: { x: 96, y: 150 },
  tasks: { x: 96, y: 182 },
  other: { x: 96, y: 214 },
  // Children of "Other" — appear when the folder expands. Helpdesk is
  // first, then Schedule Call. x is nudged right (+12) because the
  // child rows are indented by ml-3.5.
  helpdesk: { x: 108, y: 256 },
  schedule: { x: 108, y: 288 },
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
  badge,
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
      {badge != null && (
        // Unread-count chip. Muted-lime fill sits naturally against both
        // the idle and active row tints — darker than SIDEBAR_BG so it
        // reads as a separate chip, but still within the client's
        // brand palette rather than a harsh neutral grey. Square with
        // a small corner radius (matches the surrounding row
        // rounding).
        <span className="flex h-[14px] min-w-[16px] flex-shrink-0 items-center justify-center rounded-[3px] bg-[#bdd180] px-1 text-[10px] font-medium leading-none text-[#2a3d0a]">
          {badge}
        </span>
      )}
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
    <div className="flex h-[44px] items-center border-b border-[#eef0f2] px-4">
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

// Home panel — mirrors Figma node 227:11387. Standard "Home" top bar
// (matches the other phases so the surrounding chrome stays constant
// across the tour), then personalised greeting → hero banner →
// Your-actions counters → About-us copy → Working-hours table.
function HomePanel() {
  // Counts here must match the sidebar row badges below — the
  // Your-actions card is the "what's pending" summary that each nav
  // indicator links back to. Messages isn't surfaced as an action
  // because the welcome thread has already been replied to.
  const actions = [
    { label: "Onboarding", count: "1", iconSrc: "/Icons/on-boarding.svg" },
    { label: "Payments", count: "1", iconSrc: "/Icons/payments.svg" },
    { label: "Tasks", count: "2", iconSrc: "/Icons/tasks.svg" },
  ];
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PanelHeader title="Home" />
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
        <div className="grid grid-cols-3 gap-[5px]">
          {actions.map((a) => (
            <div
              key={a.label}
              className="flex items-center justify-between gap-1 overflow-hidden rounded-[4px] border border-[#eff1f4] bg-white px-2 py-[7px]"
            >
              <div className="flex min-w-0 items-center gap-1">
                {a.iconSrc ? (
                  // Render the SVG via mask so the glyph picks up the
                  // label's color (#6b6f76) instead of the asset's native
                  // near-black fill — keeps icon + label as one visual unit.
                  <span
                    aria-hidden="true"
                    className="block h-[10px] w-[10px] flex-shrink-0 bg-[#6b6f76]"
                    style={{
                      WebkitMaskImage: `url(${a.iconSrc})`,
                      maskImage: `url(${a.iconSrc})`,
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      maskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      maskPosition: "center",
                    }}
                  />
                ) : (
                  a.iconNode
                )}
                <span className="truncate text-[10px] font-medium text-[#6b6f76]">
                  {a.label}
                </span>
              </div>
              <span className="flex-shrink-0 text-[10px] text-[#212b36]">
                {a.count}
              </span>
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
          BrandMages is a full-service marketing agency that helps
          businesses grow their brand awareness through storytelling,
          performance campaigns, and always-on content — every engagement
          starts with a discovery call and a tailored roadmap within a
          week.
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
  // Cap the content column so body text wraps within the visible card
  // area. The inner portal surface is wider than the outer card's
  // overflow-clip, so without a max-width the message text wraps offscreen
  // and the visible portion reads as broken mid-sentence lines.
  return (
    <div className="px-4 py-1.5">
      <div className="flex items-start gap-2">
        <Avatar initials={initials} bg={avatarBg} fg={avatarFg} />
        <div className="min-w-0 max-w-[520px] flex-1">
          <div className="mb-0.5 flex items-center gap-1.5 text-[11px] leading-[1.4]">
            <span className="font-medium text-[#212b36]">{name}</span>
            <span className="text-[#6b6f76]">{time}</span>
          </div>
          <div className="text-[11px] leading-[1.55] text-[#212b36]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Toolbar glyph helper — uses the uploaded SVG assets so the composer
// matches the rest of the product's icon library (no inline
// approximations). Sizes mirror the assets' native geometry scaled
// into a uniform 11px box so the toolbar row reads tight and even.
// Note: the shipped asset filenames don't match their visual
// contents — `UnorderedList.svg` actually draws an Underline (U with
// a stroke), `Underline.svg` draws a numbered list (1/2 with lines),
// and the top-level `Icon (approved).svg` is the bullet list. The
// mapping below is by what each file *renders*, not by filename.
const COMPOSER_ICONS = {
  bold: { src: "/Icons/Vector.svg", w: 11, h: 11 },
  italic: { src: "/Icons/italic.svg", w: 11, h: 11 },
  underline: { src: "/Icons/Icon (approved)/UnorderedList.svg", w: 11, h: 11 },
  bullet: { src: "/Icons/Icon (approved).svg", w: 11, h: 11 },
  number: { src: "/Icons/Icon (approved)/Underline.svg", w: 11, h: 11 },
  link: { src: "/Icons/Icon (approved)/Link.svg", w: 10, h: 11 },
  clip: { src: "/Icons/paperclip.svg", w: 12, h: 12 },
  magic: { src: "/Icons/Primary.svg", w: 11, h: 11 },
};
function ComposerIcon({ kind }) {
  const spec = COMPOSER_ICONS[kind];
  if (!spec) return null;
  return (
    <img
      src={spec.src}
      alt=""
      aria-hidden="true"
      width={spec.w}
      height={spec.h}
      className="flex-shrink-0"
    />
  );
}

function MessagesPanel() {
  // Kickoff thread between the client (Ana — matches the HomePanel
  // "Good morning, Ana" greeting) and her account lead at BrandMages
  // (Jennifer Rocha — also the host on the Schedule Call panel, so
  // the same person carries across the tour). One welcome note
  // covering the three pending actions the client's portal surfaces
  // (onboarding, first invoice, the task assigned to them), and a
  // short "sounds good" reply. A quiet composer sits below the thread
  // so the panel fills its height and reads as a real messaging
  // surface, not a truncated log.
  // Composer is absolutely positioned near the bottom of the visible
  // area. The inner portal surface extends ~30% below the outer
  // card's clip, so a simple flex-bottom composer would fall entirely
  // into the clipped region. Instead we pin the composer with a
  // bottom offset that lands it at (or just past) the card's visible
  // edge — a slight clip is intentional per the reference screenshot.
  return (
    <div className="relative flex h-full flex-col">
      <PanelHeader title="Messages" />

      <div className="overflow-hidden pt-2">
        <DateChip label="Today" />

        <MessageRow
          initials="JR"
          avatarBg="#f0eaff"
          avatarFg="#7f69b5"
          name="Jennifer Rocha"
          time="10:12 AM"
        >
          <p>
            Hi Ana — welcome to BrandMages! Before we kick off the brand
            sprint, a few quick things to wrap up on your end: finish the
            onboarding form, settle your first invoice, and take a look at
            the task I assigned you. Once those are in, we&apos;ll lock
            timelines and start on the positioning work.
          </p>
        </MessageRow>

        <MessageRow
          initials="AM"
          avatarBg="#fde2e4"
          avatarFg="#c56277"
          name="Ana Mitchell"
          time="10:18 AM"
        >
          <p>Sounds good, thanks!</p>
        </MessageRow>
      </div>

      {/* Composer — absolutely anchored near the visible bottom. A
          small amount of bottom clipping is desired so the composer
          feels like it runs off the screen edge (matches the
          reference screenshot). */}
      <div className="absolute inset-x-4 bottom-[18%] overflow-hidden rounded-[6px] border border-[#e5e7eb] bg-white sm:bottom-[33%]">
        {/* Toolbar — lists (text formatting) first, then B/I/U styling. */}
        <div className="flex items-center gap-2 border-b border-[#eef0f2] bg-[#f8f9fb] px-2 py-1.5 text-[#6b6f76]">
          <ComposerIcon kind="bullet" />
          <ComposerIcon kind="number" />
          <span className="mx-0.5 h-3 w-px bg-[#e5e7eb]" />
          <ComposerIcon kind="bold" />
          <ComposerIcon kind="italic" />
          <ComposerIcon kind="underline" />
          <span className="mx-0.5 h-3 w-px bg-[#e5e7eb]" />
          <ComposerIcon kind="link" />
          <span className="mx-0.5 h-3 w-px bg-[#e5e7eb]" />
          <div className="flex items-center gap-1 text-[#212b36]">
            <ComposerIcon kind="magic" />
            <span className="text-[10px]">Suggest reply</span>
          </div>
        </div>

        {/* Body — blank space so the composer reads as an empty
            ready-to-type field. */}
        <div className="h-[44px]" />

        {/* Footer: attach on the left, send on the right. */}
        <div className="flex items-center justify-between px-2 py-1.5 text-[#6b6f76]">
          <span className="opacity-55">
            <ComposerIcon kind="clip" />
          </span>
          <button
            type="button"
            aria-label="Send"
            className="flex h-[20px] w-[20px] items-center justify-center rounded-[4px] bg-[#101010] text-white"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="m3 2.5 10 5.5-10 5.5V9l6-1-6-1V2.5Z" />
            </svg>
          </button>
        </div>
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

function PaymentsPanel() {
  // Matches the client-onboarding story: Ana has added a card on file
  // but hasn't paid the first invoice yet (the one Jennifer calls out
  // in her welcome message). Subscriptions section is intentionally
  // omitted — the brand sprint is a one-time engagement, so the page
  // reads cleaner with just Payment Methods + Invoices.
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PanelHeader title="Billing" />
      <div className="flex-1 overflow-hidden px-5 py-3 space-y-4">
        <section>
          <div className="mb-2 text-[11px] font-medium text-[#212b36]">
            Payment Methods
          </div>
          <div className="flex items-center justify-between rounded-[5px] border border-[#dfe1e4] bg-white px-3 py-2.5">
            <div className="flex items-center gap-2.5">
              <VisaMark />
              <div>
                <div className="text-[11px] font-medium text-[#212b36]">
                  Visa ending in 4242
                </div>
                <div className="text-[10px] text-[#6b6f76]">Expires 09/28</div>
              </div>
            </div>
            <span className="rounded-full bg-[#eef0f2] px-2 py-[2px] text-[10px] font-medium text-[#2b2f36]">
              Default
            </span>
          </div>
        </section>

        {/* Invoices — exactly one open invoice (the first one from
            the welcome message). Keeping the full table chrome so
            the section still reads as a real billing surface, not a
            bare empty state. */}
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
              { price: "$900", status: "Open", variant: "open", inv: "INV-D8EF5DE9-0001" },
            ].map((row) => (
              <div
                key={row.inv}
                className="grid grid-cols-[80px_80px_1fr] items-center gap-2 border-b border-[#f4f5f7] px-2 py-1.5 text-[10px] text-[#212b36] last:border-b-0"
              >
                <span>{row.price}</span>
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

// ── Schedule Call panel (Calendly-style booking surface) ───────────────
// Left rail carries the event metadata (host + title + duration +
// conferencing blurb); right side is the Select-a-Date-&-Time block
// with a month grid and a column of time slots. Rendered as the
// narrative payoff at the end of the tour — the client just clicked
// Other ▸ Schedule Call, and this is what they land on.
function ScheduleCallPanel() {
  // June 2026. Cells for week rows; blanks pad the leading empties so
  // the 1st (Monday) lands in column 0. Monday-first week matches
  // Calendly's default for the reference screenshot.
  const weeks = [
    [1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19, 20, 21],
    [22, 23, 24, 25, 26, 27, 28],
    [29, 30, null, null, null, null, null],
  ];
  // Only weekdays ≥ today (12th) are bookable; the 16th is picked.
  const available = new Set([
    12, 13, 15, 16, 17, 18, 19,
    22, 23, 24, 25, 26, 29, 30,
  ]);
  const selected = 16;
  const slots = ["9:00am", "9:30am", "10:00am", "10:30am", "11:30am"];
  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="Schedule a call" />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left rail — host, event title, meta rows. */}
        <div className="flex w-[38%] flex-shrink-0 flex-col gap-2 border-r border-[#eef0f2] px-5 py-4">
          <div className="text-[10px] font-medium tracking-[0.01em] text-[#6b6f76]">
            BrandMages · Jennifer Rocha
          </div>
          <div className="text-[13px] font-semibold leading-[1.25] text-[#101010]">
            Discovery call
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#212b36]">
            <img
              src="/Icons/clock-three.svg"
              alt=""
              aria-hidden="true"
              width={12}
              height={12}
              className="flex-shrink-0"
            />
            30 min
          </div>
          <div className="flex items-start gap-1.5 text-[11px] leading-[1.45] text-[#6b6f76]">
            <img
              src="/Icons/video.svg"
              alt=""
              aria-hidden="true"
              width={12}
              height={12}
              className="mt-[2px] flex-shrink-0"
            />
            <span>Video link sent on confirmation.</span>
          </div>
        </div>

        {/* Right side — date grid + time slot column. */}
        <div className="flex min-w-0 flex-1 gap-4 px-5 py-4">
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="mb-2 text-[12px] font-semibold text-[#101010]">
              Select a Date &amp; Time
            </div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#212b36]">
                June 2026
              </span>
              <div className="flex items-center gap-1 text-[#6b6f76]">
                <span className="rounded-[3px] px-1 text-[11px]">‹</span>
                <span className="rounded-[3px] bg-[#eef2ff] px-1 text-[11px] text-[#2f6bff]">
                  ›
                </span>
              </div>
            </div>
            {/* Day header */}
            <div className="mb-1 grid grid-cols-7 text-center text-[9px] font-medium uppercase tracking-[0.04em] text-[#90959d]">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
            {/* Calendar grid — each cell centers a fixed-size circle so
                available/selected dates read as circles (not pills)
                regardless of column width. */}
            <div className="flex flex-col gap-[4px]">
              {weeks.map((row, rIdx) => (
                <div key={rIdx} className="grid grid-cols-7 gap-[4px]">
                  {row.map((day, cIdx) => {
                    if (day === null) {
                      return <span key={cIdx} />;
                    }
                    const isSel = day === selected;
                    const isAvail = available.has(day);
                    return (
                      <span
                        key={cIdx}
                        className="flex h-[26px] items-center justify-center"
                      >
                        <span
                          className={clsx(
                            "flex h-[22px] w-[22px] items-center justify-center rounded-full text-[10px]",
                            isSel
                              ? "bg-[#2f6bff] font-semibold text-white"
                              : isAvail
                                ? "bg-[#eef2ff] font-medium text-[#2f6bff]"
                                : "text-[#c3c7cf]",
                          )}
                        >
                          {day}
                        </span>
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="mt-3">
              <div className="text-[10px] font-medium text-[#212b36]">
                Time zone
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#6b6f76]">
                <img
                  src="/Icons/globe.svg"
                  alt=""
                  aria-hidden="true"
                  width={11}
                  height={11}
                  className="flex-shrink-0"
                />
                Eastern Time (3:01pm) ▾
              </div>
            </div>
          </div>

          {/* Time slots for the selected date. */}
          <div className="flex w-[96px] flex-shrink-0 flex-col">
            <div className="mb-1.5 text-[11px] font-medium text-[#101010]">
              Fri, Jun 16
            </div>
            <div className="flex flex-col gap-[5px]">
              {slots.map((s, i) => (
                <div
                  key={i}
                  className={clsx(
                    "flex h-[26px] items-center justify-center rounded-[4px] text-[11px] font-medium",
                    i === 0
                      ? "bg-[#2f6bff] text-white"
                      : "border border-[#d3ddff] text-[#2f6bff]",
                  )}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
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
  // Marketing-agency → client handoff checklist. BrandMages can't
  // start the brand sprint without basic inputs from Ana's side, so
  // these are the questions and asset uploads the agency routinely
  // assigns a new client during onboarding. Subtasks all roll up
  // sensibly under their parent (every child of "Share brand
  // assets" is an actual asset the client can upload).
  const tasks = [
    { title: "Complete brand questionnaire", due: "Apr 4" },
    {
      title: "Share existing brand assets",
      due: "Apr 4",
      subtasks: [
        { label: "Upload current logo files (SVG or AI)", status: "todo" },
        { label: "Share existing brand guidelines PDF", status: "todo" },
        { label: "Provide approved brand colors and fonts", status: "inProgress" },
        { label: "Link product and lifestyle photography", status: "inProgress" },
        { label: "Attach prior marketing collateral", status: "done" },
        { label: "Share voice and tone examples", status: "done" },
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
                <TaskStatusDot status="todo" size={16} />
                <span className="text-[12px] text-[#212b36]">{task.title}</span>
              </div>
              <div className="mt-0.5 pl-[24px] text-[11px] text-[#6b6f76]">
                Due: {task.due}
              </div>

              {task.subtasks && (
                <div className="mt-2 space-y-1 pl-[24px]">
                  {task.subtasks.map((st, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-2 text-[11px] text-[#212b36]"
                    >
                      <TaskStatusDot status={st.status} size={14} />
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
  schedule: ScheduleCallPanel,
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

// Top-level sidebar rows. Onboarding sits at the top level (directly
// under Messages) because it's the narrative payoff — the whole tour
// ends on it. Helpdesk and Schedule Call live as children of the
// "Other" folder — see OTHER_CHILDREN. Matches the client portal
// sidebar structure in Figma (BrandMages → Home → Messages →
// Onboarding → Payments → Tasks → Other ▾).
// Badge counts mirror the Your-actions card in HomePanel so the
// sidebar indicators feel load-bearing — the viewer can trace each
// count from the summary card back to the row it belongs to. Messages
// has no badge: the welcome thread has already been replied to, so
// nothing is unread.
const NAV = [
  { id: "home", label: "Home", iconSrc: "/Icons/clienthome.svg", iconSize: 13 },
  { id: "messages", label: "Messages", iconSrc: "/Icons/messages.svg" },
  { id: "onboarding", label: "Onboarding", iconSrc: "/Icons/on-boarding.svg", badge: "1" },
  { id: "payments", label: "Payments", iconSrc: "/Icons/payments.svg", badge: "1" },
  { id: "tasks", label: "Tasks", iconSrc: "/Icons/tasks.svg", badge: "2" },
];

// Children revealed when the "Other" folder expands. These rows are
// present for completeness (they mirror the first-value-prop visual)
// but never go active — there are no Helpdesk/Schedule Call panels in
// this tour.
const OTHER_CHILDREN = [
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
  // lags the cursor by the hover → press beat. Schedule Call is a
  // two-step: first click "Other" to open the folder, then click
  // "Schedule Call" inside.
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
      phaseId === "schedule"
        ? [
            {
              target: "other",
              commit: () => setOtherOpen(true),
            },
            {
              target: "schedule",
              commit: () => setDisplayId("schedule"),
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
          className="relative flex w-[160px] flex-shrink-0 flex-col gap-[6px] px-2 pt-2.5 sm:w-[200px]"
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
              badge={item.badge}
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

// Design-space dimensions. The inner workspace is laid out as if the
// outer card were always this size; a CSS transform scales it down to
// match the actual container. This keeps the multi-column panels
// (Schedule, Tasks, etc.) from compressing past their designed widths
// on narrower viewports — they just render proportionally smaller.
const DESIGN_W = 832;
const DESIGN_H = (DESIGN_W * 2) / 3;
// On phones the fit-scaled visual reads small; nudge it ~15% larger so
// text and chrome breathe. Crop grows on the right/bottom peek (which is
// already off-canvas by design), so primary content stays visible.
const MOBILE_BREAK = 540;
const MOBILE_ZOOM = 1.18;

// ── Top-level: drive phase loop, gate on in-view ────────────────────────
export function ClientPortalVisual() {
  const [phase, setPhase] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const ref = useRef(null);
  const [scale, setScale] = useState(1);

  // Measure the outer card and scale the design space to match. Anchored
  // to top-left so the sidebar's left padding stays at the same on-screen
  // position regardless of zoom — the mobile zoom expands toward the
  // right/bottom (into the existing peek crop).
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const update = () => {
      const w = el.getBoundingClientRect().width;
      if (w <= 0) return;
      const zoom = w < MOBILE_BREAK ? MOBILE_ZOOM : 1;
      setScale((w / DESIGN_W) * zoom);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
      className="font-inter relative aspect-[4/3] w-full overflow-hidden rounded-[12px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] sm:aspect-[3/2] sm:rounded-[22px]"
      style={{ backgroundImage: CARD_GRADIENT }}
    >
      <div
        className="absolute left-0 top-0"
        style={{
          width: `${DESIGN_W}px`,
          height: `${DESIGN_H}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <PortalSurface phaseIndex={phase} active={inView} paused={paused} />
      </div>
      <PlayPauseToggle
        paused={paused}
        durationMs={loopMs}
        active={inView}
        onToggle={() => setPaused((p) => !p)}
      />
    </div>
  );
}
