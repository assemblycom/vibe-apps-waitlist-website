"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// EDITORIAL HOVER PREVIEW
//
// Wraps an underlined phrase in a paragraph and reveals a floating card
// on hover, so dense editorial copy can elaborate inline without forcing
// the reader to leave the paragraph.
//
// The preview card is PORTALED to document.body so it escapes any
// transformed / opacity-animated ancestors on the page. That matters
// because CSS `backdrop-filter` only sees through the nearest ancestor
// that establishes a "backdrop root" (anything with transform, opacity<1,
// filter, etc.). NarrativeBlock uses transform+opacity on its body
// wrapper for the reveal animation, which scoped the filter and left the
// text behind the card perfectly crisp. Rendering via portal lifts the
// card up to <body>, so the filter reads the entire page as its backdrop
// and produces real glass.
const TOOLTIP_WIDTH = 300;
const TOOLTIP_GAP = 12;

export function InlinePreview({ text, preview }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  // Touch devices have no hover, and adding a tap-toggle interferes with
  // reading and scrolling. On those devices we skip the tooltip entirely
  // — the underlined phrase still renders for emphasis.
  const [canHover, setCanHover] = useState(false);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const closeTimer = useRef(null);

  // Portal target is only available on the client.
  useEffect(() => setMounted(true), []);

  // Detect hover capability and keep it in sync if the input mode
  // changes (e.g. user plugs in a mouse on a hybrid device).
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // Compute tooltip position based on the trigger's viewport rect. Runs
  // on open, and on scroll/resize while open so the card tracks the
  // phrase if the page moves underneath it.
  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const t = triggerRef.current;
      if (!t) return;
      // When the phrase wraps across lines, getBoundingClientRect()
      // returns a box spanning every line — so centering on it lands
      // the tooltip in empty space above the paragraph rather than
      // next to the actual trigger. Use getClientRects() and anchor
      // to the first line's rect (tooltip renders above the trigger).
      const rects = t.getClientRects();
      const r = rects.length ? rects[0] : t.getBoundingClientRect();
      const tooltipH = tooltipRef.current?.offsetHeight ?? 120;
      const centerX = r.left + r.width / 2;
      // Clamp horizontally so the card doesn't spill past the viewport.
      const half = TOOLTIP_WIDTH / 2;
      const left = Math.max(
        8 + half,
        Math.min(window.innerWidth - 8 - half, centerX),
      );
      const top = r.top - TOOLTIP_GAP - tooltipH;
      setPos({ top, left });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  // Small open/close lag so the card doesn't flicker when the cursor
  // travels from phrase to card across a few pixels of gap.
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };
  const cancelClose = () => clearTimeout(closeTimer.current);

  // On touch devices, render just the underlined phrase — no wrapper
  // span, no event handlers, no portal. The emphasis still reads; we
  // don't fight the device's interaction model.
  if (!canHover) {
    return (
      <span className="underline decoration-[#1A1A1A]/40 underline-offset-[3px]">
        {text}
      </span>
    );
  }

  return (
    <span
      ref={triggerRef}
      className="relative inline"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onFocus={() => setOpen(true)}
      onBlur={() => scheduleClose()}
    >
      <span
        tabIndex={0}
        className="cursor-default underline decoration-[#1A1A1A]/40 underline-offset-[3px] outline-none focus-visible:decoration-[#1A1A1A]/70"
      >
        {text}
      </span>
      {mounted &&
        createPortal(
          <span
            ref={tooltipRef}
            role="tooltip"
            aria-hidden={!open}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            className="block select-none rounded-[18px] p-3 text-left"
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              width: TOOLTIP_WIDTH,
              zIndex: 9999,
              opacity: open ? 1 : 0,
              transform: `translateX(-50%) translateY(${open ? "0" : "4px"})`,
              pointerEvents: open ? "auto" : "none",
              transition:
                "opacity 180ms cubic-bezier(0.22, 0.61, 0.36, 1), transform 180ms cubic-bezier(0.22, 0.61, 0.36, 1)",
              background: "rgba(255,255,255,0.35)",
              backdropFilter: "blur(28px) saturate(1.5)",
              WebkitBackdropFilter: "blur(28px) saturate(1.5)",
              border: "1px solid rgba(255,255,255,0.55)",
              boxShadow: [
                "0 24px 60px -24px rgba(0,0,0,0.28)",
                "0 8px 24px -12px rgba(0,0,0,0.12)",
                "inset 0 1px 0 rgba(255,255,255,0.7)",
              ].join(", "),
            }}
          >
            {preview.visual && (
              <span className="mb-2 block">{preview.visual}</span>
            )}
            {preview.title && (
              <span className="mb-0.5 block text-[12px] font-semibold tracking-[-0.005em] text-[#1A1A1A]">
                {preview.title}
              </span>
            )}
            {preview.body && (
              <span className="block text-[11px] leading-[1.45] text-[#1A1A1A]/70">
                {preview.body}
              </span>
            )}
          </span>,
          document.body,
        )}
    </span>
  );
}

// ── Miniature preview visuals ──
//
// Each visual is a small mini-UI card — a soft frame with a header label
// and 1–2 rows of content — sized to hint at the concept without looking
// like a full app screen. The shared CardShell provides a subtle inner
// frame that sits on top of the glass tooltip.

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

  // Type forward, pause at full, reset, repeat. Caret blink is on its
  // own interval so it stays steady during the hold and reset phases.
  // We track the current count in a local variable inside the effect —
  // keeping the scheduling side-effect OUT of setTyped's updater so
  // React StrictMode's double-invoked setter can't race the timer.
  useEffect(() => {
    let count = 0;
    let timeout;
    const tick = () => {
      if (count < url.length) {
        count += 1;
        setTyped(count);
        timeout = setTimeout(tick, 90);
      } else {
        // Hold the completed URL for a beat, then reset and restart.
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
        {/* Search / URL-bar magnifying glass */}
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
          {/* Blinking caret. While typing, keep it visible so the
              rhythm reads as "keystrokes landing"; only blink during
              the idle hold and the empty reset moment. */}
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

// Small mini-app card: header with a menu dots + two status rows. Good
// for concepts like "an app running", "an approval flow", etc.
//
// Row glyphs are intentionally lightweight — a faint check stroke for
// done rows, a soft hollow ring for upcoming. Solid dark fills read
// like a page-level control (button, bullet); these rows are just a
// status hint, so the glyph stays at low opacity and thin stroke.
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

// Quality badge: framed ✓ + label for intangibles like reliable /
// unified / polished.
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

// Contacts list with header + two rows.
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

// Permissions: two role rows, each with a trailing access-level chip.
// A matrix reads like a spreadsheet — slow to parse in a tooltip. A
// role → chip list lets the reader skim both rows in one glance:
// "Team can edit, Client can view."
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

// Notifications stack: framed header + two items.
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

// App library: compact row of short app pills with a trailing "+N"
// chip. Reads as "a library of vetted apps you can pick from" without
// painting a full app-store grid.
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
