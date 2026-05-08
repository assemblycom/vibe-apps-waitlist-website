"use client";

// Network-style hero: a primary "Build your app" hub directly below the
// CTA, connected by orthogonal "elbow" lines to five capability cards
// arranged around the headline (top-center, top-right, left, bottom-left,
// right). Each card carries a small real-looking UI preview rather than
// a gray placeholder so the network reads as a system, not decoration.
//
// Coordinate system: SVG uses viewBox="0 0 100 100" with
// preserveAspectRatio="none" so path coordinates are percentages of the
// section's bounding box and align with the cards' own % positioning.
// Cards have width clamped via clamp() so the previews stay legible
// across desktop sizes; the network is hidden below lg.

const StrokeIcon = ({ d, className = "h-3 w-3" }) => (
  <svg
    viewBox="0 0 16 16"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const SparkleIcon = (props) => (
  <StrokeIcon
    {...props}
    d="M8 2v3M8 11v3M2 8h3M11 8h3M4 4l2 2M10 10l2 2M12 4l-2 2M6 10l-2 2"
  />
);
const UserPlusIcon = (props) => (
  <StrokeIcon
    {...props}
    d="M9 7a3 3 0 100-6 3 3 0 000 6zM2 14a6 6 0 0111-3.4M13 11v4M11 13h4"
  />
);
const CheckIcon = (props) => (
  <StrokeIcon {...props} d="M3 8.5l3 3 7-7" />
);
const FolderIcon = (props) => (
  <StrokeIcon
    {...props}
    d="M2 5a1 1 0 011-1h3.5l1.5 1.5H13a1 1 0 011 1V12a1 1 0 01-1 1H3a1 1 0 01-1-1V5z"
  />
);
const ChatIcon = (props) => (
  <StrokeIcon
    {...props}
    d="M2.5 4.5a1 1 0 011-1h9a1 1 0 011 1v6a1 1 0 01-1 1H6L3 14V4.5z"
  />
);
const ReceiptIcon = (props) => (
  <StrokeIcon
    {...props}
    d="M3 1.5h10v13l-2-1.2-1.5 1.2-1.5-1.2L6.5 14.5 5 13.3 3 14.5v-13zM6 5h6M6 8h6M6 11h3"
  />
);
const ArrowIcon = (props) => (
  <StrokeIcon {...props} d="M3 8h10M9 4l4 4-4 4" />
);

// ── Card body previews ──────────────────────────────────────────────
// Schematic mini-UIs: enough structural detail to read as real
// interfaces but quiet enough to live in the background.

function HubBody() {
  return (
    <div className="mt-1.5 flex items-center gap-1.5 rounded-md border border-white/10 bg-black/40 px-2 py-1.5">
      <span className="text-[9px] leading-none text-white/35">
        Describe your app…
      </span>
      <span className="ml-auto inline-flex h-3.5 w-3.5 items-center justify-center rounded-[3px] bg-[#D9ED92] text-black">
        <ArrowIcon className="h-2 w-2" />
      </span>
    </div>
  );
}

function OnboardingBody() {
  return (
    <div className="mt-1.5 space-y-1.5">
      <div className="flex items-center gap-1.5">
        <span className="h-1 w-6 rounded-full bg-white/20" />
        <span className="h-2.5 flex-1 rounded-[3px] border border-white/10 bg-black/40" />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-1 w-4 rounded-full bg-white/20" />
        <span className="h-2.5 flex-1 rounded-[3px] border border-white/10 bg-black/40" />
      </div>
    </div>
  );
}

function ApprovalsBody() {
  return (
    <div className="mt-1.5 space-y-1.5">
      <div className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-white/15" />
        <span className="h-1 w-10 rounded-full bg-white/25" />
        <span className="ml-auto rounded-[3px] bg-[#D9ED92]/85 px-1.5 py-[2px] text-[7px] font-medium leading-none text-black">
          Approve
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-white/15" />
        <span className="h-1 w-8 rounded-full bg-white/25" />
        <span className="ml-auto rounded-[3px] border border-white/15 px-1.5 py-[2px] text-[7px] leading-none text-white/60">
          Pending
        </span>
      </div>
    </div>
  );
}

function FilesBody() {
  return (
    <div className="mt-1.5 space-y-1.5">
      <div className="flex items-center gap-1.5">
        <span className="flex h-3 w-3 items-center justify-center rounded-[2px] bg-white/10 text-[7px] leading-none text-white/50">
          P
        </span>
        <span className="h-1 w-12 rounded-full bg-white/25" />
        <span className="ml-auto h-1 w-4 rounded-full bg-white/12" />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="flex h-3 w-3 items-center justify-center rounded-[2px] bg-white/10 text-[7px] leading-none text-white/50">
          D
        </span>
        <span className="h-1 w-10 rounded-full bg-white/25" />
        <span className="ml-auto h-1 w-4 rounded-full bg-white/12" />
      </div>
    </div>
  );
}

function MessagesBody() {
  return (
    <div className="mt-1.5 space-y-1.5">
      <div className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-white/15" />
        <span className="h-2.5 w-16 rounded-[6px] border border-white/10 bg-white/[0.04]" />
      </div>
      <div className="flex items-center justify-end gap-1.5">
        <span className="h-2.5 w-12 rounded-[6px] border border-[#D9ED92]/20 bg-[#D9ED92]/15" />
        <span className="h-3 w-3 rounded-full bg-white/15" />
      </div>
    </div>
  );
}

function InvoicesBody() {
  return (
    <div className="mt-1.5 space-y-1.5">
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[8px] leading-none text-white/55">
          INV-204
        </span>
        <span className="ml-auto font-mono text-[8px] leading-none text-white/85">
          $1,200
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-[#D9ED92]" />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[8px] leading-none text-white/55">
          INV-205
        </span>
        <span className="ml-auto font-mono text-[8px] leading-none text-white/85">
          $840
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
      </div>
    </div>
  );
}

// ── Layout data ─────────────────────────────────────────────────────
// Positions are % of the section box. Card widths use clamp() in rem so
// the previews stay legible across desktop sizes; heights are content-
// driven. Six cards are placed so weight stays balanced: 2 on the left,
// 2 on the right, 2 along the vertical center axis (top-center leaf and
// hub).

const HUB = {
  id: "hub",
  title: "Build your app",
  Icon: SparkleIcon,
  Body: HubBody,
  pos: { left: 50, top: 64, centerX: true },
  primary: true,
  delay: 0.0,
};

const LEAVES = [
  {
    id: "onboarding",
    title: "Client onboarding",
    Icon: UserPlusIcon,
    Body: OnboardingBody,
    pos: { left: 50, top: -3, centerX: true },
    delay: 0.4,
  },
  {
    id: "approvals",
    title: "Approvals",
    Icon: CheckIcon,
    Body: ApprovalsBody,
    pos: { left: 82, top: 14 },
    delay: 0.55,
  },
  {
    id: "files",
    title: "Files",
    Icon: FolderIcon,
    Body: FilesBody,
    pos: { left: -10, top: 32 },
    delay: 0.7,
  },
  {
    id: "messages",
    title: "Messages",
    Icon: ChatIcon,
    Body: MessagesBody,
    pos: { left: 8, top: 74 },
    delay: 0.85,
  },
  {
    id: "invoices",
    title: "Invoices",
    Icon: ReceiptIcon,
    Body: InvoicesBody,
    pos: { left: 80, top: 54 },
    delay: 1.0,
  },
];

// Connections fan out from the hub. Paths use a horizontal run followed
// by a quadratic-rounded corner into a vertical run — the "elbow"
// routing real node editors use, so the lines feel like a wiring system
// rather than decoration. Endpoints (`to`) are also where the port dot
// sits, so the perceived wire-into-card moment is precise.

// Hub bbox (top:64, height ~13%, width ~24% centered): x=38–62, y=64–77.
// Each line emerges from a distinct point on the hub edge so source
// dots don't pile on top of each other, and right/left perimeters use
// staggered corridors so parallel runs are visibly separated.

const LINES = [
  // Onboarding — long perimeter route around the headline via the
  // outermost right corridor (x=92).
  {
    id: "onboarding",
    from: { x: 62, y: 68 },
    to: { x: 50, y: 9 },
    d: "M 62 68 L 92 68 L 92 9 L 50 9",
    delay: 0.5,
  },
  // Approvals — middle-right corridor (x=88), enters approvals' left
  // edge midpoint.
  {
    id: "approvals",
    from: { x: 62, y: 70 },
    to: { x: 82, y: 20 },
    d: "M 62 70 L 88 70 L 88 20 L 82 20",
    delay: 0.65,
  },
  // Invoices — inner-right corridor (x=82), short up-leg into invoices'
  // left edge midpoint. Emerges below approvals' source so the two
  // right-side runs don't share a starting point.
  {
    id: "invoices",
    from: { x: 62, y: 74 },
    to: { x: 80, y: 60 },
    d: "M 62 74 L 80 74 L 80 60",
    delay: 0.8,
  },
  // Files — left corridor (x=14, files' right edge).
  {
    id: "files",
    from: { x: 38, y: 68 },
    to: { x: 14, y: 38 },
    d: "M 38 68 L 14 68 L 14 38",
    delay: 0.95,
  },
  // Messages — short hop down-left to messages' right edge midpoint.
  {
    id: "messages",
    from: { x: 38, y: 74 },
    to: { x: 32, y: 80 },
    d: "M 38 74 L 32 74 L 32 80",
    delay: 1.1,
  },
];

// ── Card primitive ──────────────────────────────────────────────────

function Card({ card }) {
  const { Icon, Body, title, pos, primary, delay } = card;
  return (
    <div
      className={[
        "hero-flow-card pointer-events-none absolute rounded-xl border",
        primary
          ? "border-[#D9ED92]/30 bg-[#141414]"
          : "border-white/[0.08] bg-[#121212]/95",
      ].join(" ")}
      style={{
        left: `${pos.left}%`,
        top: `${pos.top}%`,
        // Width and min-height are expressed as % of the section so they
        // match the % coordinates the SVG path data uses. Mixing px clamps
        // here would desync the card edges from the line endpoints at
        // wider viewports (the line ports float outside the card).
        width: "24%",
        minHeight: "12%",
        transform: pos.centerX ? "translateX(-50%)" : undefined,
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.03) inset, 0 12px 32px rgba(0,0,0,0.45)",
        ["--card-delay"]: `${delay}s`,
      }}
    >
      <div className="flex items-center gap-2 px-4 pt-3 text-[12px] leading-none text-white/75">
        <span
          className={[
            "flex h-5 w-5 items-center justify-center rounded-[5px]",
            primary
              ? "bg-[#D9ED92]/15 text-[#D9ED92]"
              : "bg-white/[0.06] text-white/55",
          ].join(" ")}
        >
          <Icon />
        </span>
        <span className="tracking-[-0.01em]">{title}</span>
      </div>
      <div className="px-4 pb-4">
        <Body />
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────

export function HeroVibeApps() {
  const cards = [HUB, ...LEAVES];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 hidden lg:block"
    >
      {/* Connection lines. preserveAspectRatio="none" keeps endpoint %
          coordinates aligned with card % positions. vectorEffect keeps
          the stroke at 1px regardless of stretch. */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {LINES.map((line) => (
          <path
            key={line.id}
            d={line.d}
            fill="none"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            className="hero-flow-line"
            style={{ ["--line-delay"]: `${line.delay}s` }}
          />
        ))}
      </svg>

      {/* Port dots at each line's leaf-side endpoint. Rendered as DOM
          spans (not SVG markers) so they stay perfectly round under the
          SVG's non-uniform scaling. */}
      {LINES.map((line) => (
        <span
          key={`dot-${line.id}`}
          className="hero-flow-line absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-[#101010]"
          style={{
            left: `${line.from.x}%`,
            top: `${line.from.y}%`,
            ["--line-delay"]: `${line.delay + 0.1}s`,
          }}
        />
      ))}

      {cards.map((card) => (
        <Card key={card.id} card={card} />
      ))}
    </div>
  );
}
