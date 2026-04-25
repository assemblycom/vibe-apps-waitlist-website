"use client";

import { useEffect, useState } from "react";

// EDITORIAL INLINE TRIGGER + DETAIL PANEL VISUALS
//
// Previously this component rendered a floating, glass-styled tooltip
// that portaled to <body>. The new design replaces that with an
// anchored, in-flow detail panel rendered by NarrativeBlock — see
// NarrativeBlock.jsx. This file now exposes:
//
//   - InlineTrigger: an underlined phrase that, on hover/focus, asks
//     the parent to elaborate on it via callbacks. Reports active
//     state up so the parent can show ONE panel at a time.
//
//   - DetailPanel: the right-side panel shown by NarrativeBlock,
//     rendered with smooth content swaps as the user moves between
//     phrases.
//
//   - Visuals (PortalMiniPreview, AppMockPreview, …): unchanged —
//     small mini-UI cards reused inside the detail panel as a subtle
//     accompaniment to the title/body copy.

// ── Inline trigger ─────────────────────────────────────────────────
//
// Triggers only wire up hover/focus when the viewport is wide enough
// to actually fit the side detail panels (xl, 1280px+) AND the device
// has a real hover capability. Below that breakpoint, or on touch /
// no-hover devices, we render just the underline — the editorial
// emphasis still reads, but no panel work fires. NarrativeBlock
// uses the same breakpoint to swap between split-column and single-
// column layouts, so the two stay in sync.
const TRIGGER_MEDIA_QUERY =
  "(min-width: 1280px) and (hover: hover) and (pointer: fine)";

export function InlineTrigger({
  text,
  preview,
  onActivate,
  onDeactivate,
  isActive,
}) {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(TRIGGER_MEDIA_QUERY);
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  if (!canHover) {
    return (
      <span className="underline decoration-[#1A1A1A]/40 underline-offset-[3px]">
        {text}
      </span>
    );
  }

  // The trigger is a single span — no portal, no positioning. The
  // underline thickens slightly when active so the reader can see
  // which phrase the right-side panel is currently elaborating on.
  return (
    <span
      tabIndex={0}
      onMouseEnter={() => onActivate?.(preview)}
      onFocus={() => onActivate?.(preview)}
      onMouseLeave={() => onDeactivate?.(preview)}
      onBlur={() => onDeactivate?.(preview)}
      className={[
        "cursor-default underline underline-offset-[3px] outline-none transition-colors duration-200",
        isActive
          ? "decoration-[#1A1A1A]/80 text-[#1A1A1A]"
          : "decoration-[#1A1A1A]/40",
      ].join(" ")}
    >
      {text}
    </span>
  );
}

// ── Detail panel ───────────────────────────────────────────────────
//
// Rendered to the right of the body paragraphs (desktop only). It
// holds whichever preview the reader has most recently activated. On
// content swap, the inner block fades + slides in from a small offset
// (animation defined in globals.css → .narrative-detail-in) — subtle
// enough not to compete with the prose, distinct enough to signal
// that the elaboration tracks the trigger. The panel is intentionally
// text-only — no mini-UI mock cards — so the section reads as
// editorial commentary rather than a product demo with tooltips.

// The panel content always reads left-to-right (text-left). Only the
// eyebrow's em-rule swaps sides — on a left-margin panel the rule
// trails the label so the marker points TOWARD the body it's
// annotating; on a right-margin panel the rule leads the label for
// the same reason. The mono ABC Diatype face on the eyebrow makes it
// read as a typographic system label distinct from the prose.
export function DetailPanel({ preview, eyebrow = "What we mean", side = "right" }) {
  const key = preview?.title || preview?.body || "empty";
  const isLeft = side === "left";

  return (
    <div className="text-left">
      {/* Full-width rule + eyebrow stacked underneath. Reads like a
          magazine side-note: the rule is the panel's top edge, the
          eyebrow is its caption. Side prop is kept for API parity but
          no longer flips a tick — the rule always spans the panel. */}
      <div className="mb-3 border-t border-[#1A1A1A]/15 pt-3">
        <div
          className="text-[10px] uppercase tracking-[0.14em] text-[#1A1A1A]/45"
          style={{ fontFamily: '"ABC Diatype Mono", ui-monospace, monospace' }}
        >
          {eyebrow}
        </div>
      </div>

      <div key={key} className="narrative-detail-in block">
        {preview ? (
          <>
            {preview.title && (
              <h3 className="mb-1.5 text-[1rem] font-medium leading-[1.25] tracking-[-0.01em] text-[#1A1A1A] [text-wrap:balance]">
                {preview.title}
              </h3>
            )}
            {preview.body && (
              <p className="text-[0.8125rem] leading-[1.5] text-[#1A1A1A]/65 [text-wrap:pretty]">
                {preview.body}
              </p>
            )}
          </>
        ) : (
          <p className="text-[0.8125rem] leading-[1.55] text-[#1A1A1A]/40">
            Hover any highlighted phrase to expand the meaning.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Miniature preview visuals ──
//
// Each visual is a small mini-UI card — a soft frame with a header
// label and 1–2 rows of content — sized to hint at the concept
// without looking like a full app screen. The shared CardShell
// provides a subtle inner frame that sits in the side panel.

const CardShell = ({ children }) => (
  <span className="block overflow-hidden rounded-[6px] border border-[#1A1A1A]/10 bg-white/45">
    {children}
  </span>
);

const CardHeader = ({ label, menu = false }) => (
  <span className="flex items-center justify-between border-b border-[#1A1A1A]/8 px-2 py-1">
    <span className="text-[10px] font-semibold text-[#1A1A1A]/80">{label}</span>
    {menu && (
      <span className="flex gap-0.5">
        <span className="h-[3px] w-[3px] rounded-full bg-[#1A1A1A]/20" />
        <span className="h-[3px] w-[3px] rounded-full bg-[#1A1A1A]/20" />
        <span className="h-[3px] w-[3px] rounded-full bg-[#1A1A1A]/20" />
      </span>
    )}
  </span>
);

// Portal hint for "native part of your client experience". A mock
// browser address bar with a typing animation: a search icon on the
// left, then "yourbrand.com" being typed character-by-character into
// the field with a blinking caret. Reinforces the "arriving at your
// branded portal URL" moment without painting a full page mock.
export function PortalMiniPreview() {
  const url = "yourbrand.com";
  const [typed, setTyped] = useState(0);
  const [caretOn, setCaretOn] = useState(true);

  useEffect(() => {
    let count = 0;
    let timeout;
    const tick = () => {
      if (count < url.length) {
        count += 1;
        setTyped(count);
        timeout = setTimeout(tick, 90);
      } else {
        timeout = setTimeout(() => {
          count = 0;
          setTyped(0);
          timeout = setTimeout(tick, 400);
        }, 1400);
      }
    };
    timeout = setTimeout(tick, 300);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setCaretOn((c) => !c), 520);
    return () => clearInterval(id);
  }, []);

  const shown = url.slice(0, typed);
  const isTyping = typed < url.length;

  return (
    <CardShell>
      <span className="flex items-center gap-1.5 px-2 py-1.5">
        <svg
          viewBox="0 0 12 12"
          aria-hidden="true"
          className="h-[10px] w-[10px] flex-none text-[#1A1A1A]/55"
        >
          <circle
            cx="5"
            cy="5"
            r="3.25"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M7.6 7.6 L10 10"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        <span className="flex flex-1 items-center text-[10px] leading-none text-[#1A1A1A]/80">
          {shown || (
            <span className="text-[#1A1A1A]/35">Search or enter URL…</span>
          )}
          <span
            aria-hidden="true"
            className="ml-[1px] inline-block h-[10px] w-[1px] bg-[#1A1A1A]/70"
            style={{ opacity: isTyping ? 1 : caretOn ? 1 : 0 }}
          />
        </span>
      </span>
    </CardShell>
  );
}

export function AppMockPreview({ title, rows = [], accent = "progress" }) {
  return (
    <CardShell>
      <CardHeader label={title} menu />
      <span className="flex flex-col">
        {rows.map((row, i) => {
          const isDone = accent === "progress" && i === 0;
          return (
            <span
              key={i}
              className={[
                "flex items-center gap-1.5 px-2 py-1",
                i < rows.length - 1 ? "border-b border-[#1A1A1A]/8" : "",
              ].join(" ")}
            >
              {isDone ? (
                <svg
                  viewBox="0 0 10 10"
                  aria-hidden="true"
                  className="h-[9px] w-[9px] flex-none text-[#1A1A1A]/45"
                >
                  <path
                    d="M2 5.2 L4.2 7.3 L8 3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <span className="h-[7px] w-[7px] flex-none rounded-full border border-[#1A1A1A]/22" />
              )}
              <span className="text-[9px] text-[#1A1A1A]/70">{row}</span>
            </span>
          );
        })}
      </span>
    </CardShell>
  );
}

export function QualityBadgePreview({ label }) {
  return (
    <CardShell>
      <span className="flex items-center gap-1.5 px-2 py-1.5">
        <span className="flex h-[16px] w-[16px] flex-none items-center justify-center rounded-full bg-[#1A1A1A]/10 text-[10px] leading-none text-[#1A1A1A]/75">
          ✓
        </span>
        <span className="text-[10px] font-medium text-[#1A1A1A]/85">
          {label}
        </span>
      </span>
    </CardShell>
  );
}

export function ContactsPreview() {
  const rows = [
    { name: "Acme Legal", tag: "Client" },
    { name: "Priya Shah", tag: "Team" },
  ];
  return (
    <CardShell>
      <CardHeader label="Contacts" />
      <span className="flex flex-col">
        {rows.map((row, i) => (
          <span
            key={row.name}
            className={[
              "flex items-center gap-1.5 px-2 py-1",
              i < rows.length - 1 ? "border-b border-[#1A1A1A]/8" : "",
            ].join(" ")}
          >
            <span className="flex-1 text-[9px] text-[#1A1A1A]">
              {row.name}
            </span>
            <span className="rounded-[2px] bg-[#1A1A1A]/10 px-[4px] py-[0.5px] text-[7px] uppercase tracking-[0.06em] text-[#1A1A1A]/60">
              {row.tag}
            </span>
          </span>
        ))}
      </span>
    </CardShell>
  );
}

export function PermissionsPreview() {
  const rows = [
    { role: "Team", level: "Can edit" },
    { role: "Client", level: "View only" },
  ];
  return (
    <CardShell>
      <CardHeader label="Roles" />
      <span className="flex flex-col">
        {rows.map((row, i) => (
          <span
            key={row.role}
            className={[
              "flex items-center gap-1.5 px-2 py-1",
              i < rows.length - 1 ? "border-b border-[#1A1A1A]/8" : "",
            ].join(" ")}
          >
            <span className="flex-1 text-[9px] text-[#1A1A1A]">{row.role}</span>
            <span className="rounded-[2px] bg-[#1A1A1A]/10 px-[4px] py-[0.5px] text-[7px] uppercase tracking-[0.06em] text-[#1A1A1A]/60">
              {row.level}
            </span>
          </span>
        ))}
      </span>
    </CardShell>
  );
}

export function NotificationsPreview() {
  const items = [
    { title: "New intake", sub: "Acme Legal · 2m" },
    { title: "Invoice paid", sub: "$900 · Northstar" },
  ];
  return (
    <CardShell>
      <CardHeader label="Notifications" />
      <span className="flex flex-col">
        {items.map((n, i) => (
          <span
            key={n.title}
            className={[
              "flex items-start gap-1.5 px-2 py-1",
              i < items.length - 1 ? "border-b border-[#1A1A1A]/8" : "",
            ].join(" ")}
          >
            <span className="mt-[3px] h-[5px] w-[5px] flex-none rounded-full bg-[#1A1A1A]/70" />
            <span className="flex-1">
              <span className="block text-[9px] font-medium text-[#1A1A1A]">
                {n.title}
              </span>
              <span className="block text-[8px] text-[#1A1A1A]/50">
                {n.sub}
              </span>
            </span>
          </span>
        ))}
      </span>
    </CardShell>
  );
}

export function LibraryPreview() {
  const apps = ["Messaging", "Payments", "Intake"];
  return (
    <CardShell>
      <CardHeader label="App library" />
      <span className="flex flex-wrap items-center gap-1 p-1.5">
        {apps.map((a) => (
          <span
            key={a}
            className="flex items-center gap-1 rounded-full border border-[#1A1A1A]/12 bg-white/60 px-1.5 py-[1px] text-[9px] text-[#1A1A1A]/75"
          >
            <span className="h-[4px] w-[4px] rounded-full bg-[#1A1A1A]/45" />
            {a}
          </span>
        ))}
        <span className="rounded-full bg-[#1A1A1A]/8 px-1.5 py-[1px] text-[9px] font-medium text-[#1A1A1A]/60">
          +18
        </span>
      </span>
    </CardShell>
  );
}
