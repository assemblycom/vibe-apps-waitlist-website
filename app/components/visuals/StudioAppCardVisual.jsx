"use client";

// Figma node 139:51670 — "Auth, CRM, billing, messaging — already live"
// value-prop visual. Matches the gradient card from the first prop and
// overlays a scaled-down Studio app mockup (sidebar + chat) on top.
// Structured so future animation can reveal messages/items in sequence.

const CARD_GRADIENT = [
  "linear-gradient(180deg, rgba(255,255,255,0) 12.397%, rgb(139,153,200) 74.611%, rgb(217,237,146) 100%)",
  "linear-gradient(90deg, rgb(255,255,255) 0%, rgb(255,255,255) 100%)",
].join(", ");

// ── Icons (inline SVGs so nothing depends on expiring Figma asset URLs) ──
function Icon({ path, className = "h-3.5 w-3.5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {path}
    </svg>
  );
}

const ICONS = {
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.2" />
      <rect x="14" y="3" width="7" height="7" rx="1.2" />
      <rect x="3" y="14" width="7" height="7" rx="1.2" />
      <rect x="14" y="14" width="7" height="7" rx="1.2" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  pennant: (
    <>
      <path d="M5 4v16" />
      <path d="M5 4h12l-3 4 3 4H5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </>
  ),
  bell: (
    <>
      <path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5 2 6H4c.5-1 2-2 2-6Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </>
  ),
  bolt: <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  library: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 3v18" />
    </>
  ),
  store: (
    <>
      <path d="M4 7h16l-1 3a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-3-3Z" />
      <path d="M5 10v10h14V10" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1 0 1.5-.5 1.5-1.5 0-.9-.8-1.2-.8-2 0-1 .8-1.5 1.8-1.5H17a4 4 0 0 0 4-4A9 9 0 0 0 12 3Z" />
      <circle cx="7.5" cy="10.5" r="1" />
      <circle cx="12" cy="7.5" r="1" />
      <circle cx="16.5" cy="10.5" r="1" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h.1a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z" />
    </>
  ),
  chevronDown: <path d="M6 9l6 6 6-6" />,
  paperclip: (
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  ),
  arrowUp: (
    <>
      <path d="M12 19V5" />
      <path d="M5 12l7-7 7 7" />
    </>
  ),
};

// ── Sidebar item ──
function NavItem({ icon, label, active = false, badge, muted = false }) {
  return (
    <div
      className={[
        "flex w-full items-center gap-2 rounded-[3px] px-2 py-1",
        active ? "bg-[#e9ebee]" : "",
      ].join(" ")}
    >
      <span className={muted ? "text-[#6b6f76]" : "text-[#212b36]"}>
        <Icon path={ICONS[icon]} className="h-[11px] w-[11px]" />
      </span>
      <span
        className={[
          "flex-1 truncate text-[10px] leading-[14px]",
          muted ? "text-[#6b6f76]" : "text-[#212b36]",
        ].join(" ")}
      >
        {label}
      </span>
      {badge && (
        <span className="rounded-full bg-[#dfe1e4] px-1.5 py-0.5 text-[9px] font-medium leading-none text-[#212b36]">
          {badge}
        </span>
      )}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="mt-2 px-2 pb-0.5 pt-1 text-[9px] font-medium tracking-[0.01em] text-[#6b6f76]">
      {children}
    </div>
  );
}

// ── Chat message bubbles ──
function UserBubble({ children }) {
  return (
    <div className="flex w-full justify-end">
      <div className="max-w-[75%] rounded-[6px] bg-[#eff1f4] px-2 py-1 text-[9px] leading-[13px] text-[#212b36]">
        {children}
      </div>
    </div>
  );
}

function AssistantText({ children }) {
  return (
    <div className="text-[9px] leading-[13px] text-[#212b36]">{children}</div>
  );
}

export function StudioAppCardVisual() {
  return (
    <div
      className="relative aspect-[3/2] w-full overflow-hidden rounded-[16px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]"
      style={{ backgroundImage: CARD_GRADIENT }}
    />
  );
}
