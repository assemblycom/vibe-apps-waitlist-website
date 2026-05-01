// Two-card editorial layout (inspired by the omnichannel/analytics
// reference). Each card is split: visual element on top, title + body on
// the bottom. Card 1 is a vibrant dark card with a cohort-invite
// visualization; card 2 is an off-white card with a pricing chart. The
// two treatments sit side by side on desktop and stack on mobile.

// ── Card 1 visual: cohort invites over a mesh gradient ───────────────────
function EarlyAccessVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[inherit] bg-[#F5F5F0]">
      {/* Floating "invite" cards — arranged diagonally, dim to bright,
          so the eye lands on the current "Beta" invite which is
          highlighted in the brand lime. */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="flex w-full max-w-[320px] flex-col gap-3">
          <InviteCard stage="Alpha" cohort="Cohort 1" muted />
          <InviteCard stage="Alpha" cohort="Cohort 2" muted />
          <InviteCard
            stage="Beta"
            cohort="Next cohort"
            message="You're invited"
            highlighted
          />
        </div>
      </div>
    </div>
  );
}

function InviteCard({ stage, cohort, message, muted, highlighted }) {
  return (
    <div
      className={[
        "flex items-center justify-between rounded-[10px] border px-3.5 py-2.5 transition-colors",
        highlighted
          ? "border-[#dfe1e4] bg-white shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)]"
          : muted
            ? "border-[#101010]/10 bg-transparent"
            : "border-[#101010]/15 bg-[#101010]/[0.02]",
      ].join(" ")}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={[
            "mono rounded-[4px] px-1.5 py-0.5 text-[10px] uppercase tracking-[0.1em]",
            highlighted
              ? "bg-[#101010] text-white"
              : "bg-[#101010]/[0.08] text-[#101010]/55",
          ].join(" ")}
        >
          {stage}
        </span>
        <span
          className={[
            "text-[12px]",
            highlighted ? "text-[#101010]" : "text-[#101010]/50",
          ].join(" ")}
        >
          {cohort}
        </span>
      </div>
      <span
        className={[
          "mono text-[10px] uppercase tracking-[0.08em]",
          highlighted ? "text-[#101010]/75" : "text-[#101010]/30",
        ].join(" ")}
      >
        {message ?? "Invited"}
      </span>
    </div>
  );
}

// ── Card 2 visual: pricing chart on off-white ────────────────────────────
function PricingChartVisual() {
  // Two-line chart: "Future pricing" rises across quarters; "Your rate"
  // stays flat at founding-team level. Rendered as inline SVG so it
  // stays crisp at any size and doesn't require an asset.
  return (
    <div className="absolute inset-0 rounded-[inherit] bg-[#F5F5F0]">
      <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8">
        <div className="w-full max-w-[380px] rounded-[14px] border border-[#dfe1e4] bg-white p-5 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.12)]">
          {/* Header */}
          <div className="mb-1 text-[13px] font-medium text-[#101010]">
            Your rate, locked
          </div>
          <div className="mb-4 text-[24px] font-semibold leading-none tracking-[-0.02em] text-[#101010]">
            $0 · founding
          </div>

          {/* Chart */}
          <svg
            viewBox="0 0 280 120"
            className="block w-full"
            aria-hidden="true"
          >
            {/* Gridlines */}
            <line x1="0" x2="280" y1="20" y2="20" stroke="#edeef0" />
            <line x1="0" x2="280" y1="60" y2="60" stroke="#edeef0" />
            <line x1="0" x2="280" y1="100" y2="100" stroke="#edeef0" />

            {/* Future pricing — rising curve */}
            <defs>
              <linearGradient id="risefill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(245,130,120,0.18)" />
                <stop offset="100%" stopColor="rgba(245,130,120,0)" />
              </linearGradient>
            </defs>
            <path
              d="M0,90 C40,80 80,65 120,55 S200,30 280,18 L280,120 L0,120 Z"
              fill="url(#risefill)"
            />
            <path
              d="M0,90 C40,80 80,65 120,55 S200,30 280,18"
              stroke="rgb(230,120,110)"
              strokeWidth="1.5"
              fill="none"
            />

            {/* Your rate — flat line */}
            <path
              d="M0,90 L280,90"
              stroke="rgb(70,110,210)"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              fill="none"
            />

            {/* End dots */}
            <circle cx="280" cy="18" r="3" fill="rgb(230,120,110)" />
            <circle cx="280" cy="90" r="3" fill="rgb(70,110,210)" />
          </svg>

          {/* Legend */}
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-[#101010]/55">
              <span className="inline-block h-[2px] w-3 rounded-full bg-[rgb(230,120,110)]" />
              Future pricing
            </div>
            <div className="flex items-center gap-1.5 text-[#101010]/80">
              <span className="inline-block h-[2px] w-3 rounded-full bg-[rgb(70,110,210)]" />
              Your rate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Card shell ───────────────────────────────────────────────────────────
function BenefitCard({ item, dark, visual }) {
  return (
    <div
      className="relative flex aspect-[5/6] w-full flex-col overflow-hidden rounded-[24px]"
    >
      {/* Visual region — fills the whole card; text sits on top in the
          bottom padding area */}
      {visual}

      {/* Bottom text block — absolutely positioned so the visual can
          extend to the edges but text aligns consistently across cards */}
      <div className="relative mt-auto p-6 md:p-7">
        <h4
          className={[
            "mb-2 text-[1.05rem] font-semibold tracking-[-0.01em]",
            dark ? "text-white" : "text-[#101010]",
          ].join(" ")}
        >
          {item.title}
        </h4>
        <p
          className={[
            "text-[0.9rem] leading-[1.55]",
            dark ? "text-white/65" : "text-[#101010]/65",
          ].join(" ")}
        >
          {item.body}
        </p>
      </div>
    </div>
  );
}

export function Benefits({ eyebrow, heading, items = [] }) {
  // This layout is designed for exactly two benefit cards — visuals are
  // matched 1:1 to the content order in home.js (first-access, pricing).
  const [first, second] = items;

  return (
    <section className="gradient-divider py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          {eyebrow && (
            <span className="mono mb-4 block text-xs uppercase tracking-[0.08em] text-white/40">
              {eyebrow}
            </span>
          )}
          {heading && (
            <h3 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-white [text-wrap:balance] md:text-[2rem]">
              {heading}
            </h3>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {first && (
            <BenefitCard item={first} visual={<EarlyAccessVisual />} />
          )}
          {second && (
            <BenefitCard item={second} visual={<PricingChartVisual />} />
          )}
        </div>
      </div>
    </section>
  );
}
