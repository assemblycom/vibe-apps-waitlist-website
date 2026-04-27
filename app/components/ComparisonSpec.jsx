"use client";

import { useEffect, useRef, useState } from "react";

// Spec-sheet comparison. A bordered, rounded card consistent with
// the rest of the page's card pattern (FAQ, Testimonials,
// ArchitectureDiagram all use the same rounded-2xl + subtle border +
// faint surface tint). Inside, two products read as parallel
// stances on the same questions — no scoring, no ranking. Hierarchy
// is carried entirely by typography and a thin column rule between
// the two answer columns; the last row gets quiet emphasis via a
// slightly stronger rule above and one type step up.
export function ComparisonSpec({
  heading,
  headingCallout,
  leftLabel,
  rightLabel,
  rows = [],
  theme = "dark",
}) {
  const ref = useRef(null);
  const [animate, setAnimate] = useState(false);
  const isLight = theme === "light";

  // Token map. Card chrome matches the rest of the page; rule
  // weights are tuned to read as "drawn lines" without pulling
  // toward a spreadsheet feel. The summary rule lifts to ~25-30%
  // so the last row's break is visible but not loud.
  const t = isLight
    ? {
        heading: "text-[#1A1A1A]",
        headingMuted: "text-[#1A1A1A]/55",
        cardBorder: "border-[#1A1A1A]/10",
        cardBg: "bg-[#1A1A1A]/[0.03]",
        rule: "bg-[#1A1A1A]/10",
        ruleBorder: "border-[#1A1A1A]/10",
        rowHover: "hover:bg-[#1A1A1A]/[0.04]",
        rowLabel: "text-[#1A1A1A]/55",
        rowLabelStrong: "text-[#1A1A1A]/75",
        bodyText: "text-[#1A1A1A]",
        bodyMuted: "text-[#1A1A1A]/70",
        brandLabel: "text-[#1A1A1A]/90",
        brandMuted: "text-[#1A1A1A]/55",
        brandRing: "ring-[#1A1A1A]/10",
        brandSurface: "bg-[#1A1A1A]/[0.04]",
        mobileBorder: "border-[#1A1A1A]/10",
        mobileBg: "bg-[#1A1A1A]/[0.03]",
        mobileCheckBg: "bg-[#1A1A1A]/10 text-[#1A1A1A]",
        mobileCheckText: "text-[#1A1A1A]",
      }
    : {
        heading: "text-white",
        headingMuted: "text-white/50",
        cardBorder: "border-white/10",
        cardBg: "bg-white/[0.02]",
        rule: "bg-white/10",
        ruleBorder: "border-white/8",
        rowHover: "hover:bg-white/[0.03]",
        rowLabel: "text-white/50",
        rowLabelStrong: "text-white/75",
        bodyText: "text-white",
        bodyMuted: "text-white/65",
        brandLabel: "text-white/85",
        brandMuted: "text-white/55",
        brandRing: "ring-white/10",
        brandSurface: "bg-white/[0.04]",
        mobileBorder: "border-white/10",
        mobileBg: "bg-white/[0.02]",
        mobileCheckBg: "bg-white/10 text-white",
        mobileCheckText: "text-white",
      };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setAnimate(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimate(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Last row reads as the takeaway: stronger rule above, slightly
  // emphasised label, larger answer type. Everything before it is a
  // standard body row.
  const bodyRows = rows.length > 1 ? rows.slice(0, -1) : rows;
  const summaryRow = rows.length > 1 ? rows[rows.length - 1] : null;

  // Shared 5-column grid: row label | rule | competitor | rule |
  // assembly. The two 1px rule tracks split the table into three
  // visually distinct columns. Padding lives inside each cell (not
  // on the row) so the rule tracks stretch to the full row height
  // via self-stretch.
  const gridCols =
    "grid-cols-[minmax(180px,220px)_1px_1fr_1px_1fr]";

  return (
    <section className="gradient-divider py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
        {/* Heading — primary claim on top, dimmed callout below. */}
        <div className="mb-7 text-center">
          {heading && (
            <h3 className={`text-[1.75rem] font-normal leading-[1.1] tracking-[-0.025em] [text-wrap:balance] md:text-[2.375rem] md:tracking-[-0.03em] ${t.heading}`}>
              {heading}
              {headingCallout && (
                <>
                  <br />
                  <span className={t.headingMuted}>{headingCallout}</span>
                </>
              )}
            </h3>
          )}
        </div>

        {/* Desktop card — same chrome pattern as FAQ / Testimonials /
            ArchitectureDiagram so the section reads as part of the
            family. overflow-hidden gives the internal hairlines a
            clean clip against the rounded corners. */}
        <div
          ref={ref}
          data-spec-animate={animate ? "true" : "false"}
          data-spec-theme={theme}
          className={`hidden overflow-hidden rounded-2xl border ${t.cardBorder} ${t.cardBg} md:block`}
        >
          {/* Header strip — brand slots in their respective columns,
              separated by the same vertical 1px rule that runs
              through the body. Padding is inside cells so the rule
              fills the full strip height. */}
          <div className={`grid ${gridCols} gap-x-6 px-6 md:px-8`}>
            <div className={`py-5 text-[14px] leading-[1.5] ${t.brandMuted}`}>
              Comparison
            </div>
            <span aria-hidden="true" className={`block self-stretch ${t.rule}`} />
            <div className="py-5">
              <BrandSlot variant="competitor" label={leftLabel} t={t} />
            </div>
            <span aria-hidden="true" className={`block self-stretch ${t.rule}`} />
            <div className="py-5">
              <BrandSlot variant="assembly" label={rightLabel} t={t} />
            </div>
          </div>

          {/* Top edge of the body. */}
          <div className={`h-px w-full ${t.rule}`} />

          {/* Body rows. Per-row vertical rule lives in column 3;
              between-row hairlines come from divide-y on the wrapper. */}
          <div className={`divide-y ${t.ruleBorder}`}>
            {bodyRows.map(([label, left, right], i) => {
              const base = i * 80;
              return (
                <div
                  key={i}
                  className={`grid ${gridCols} gap-x-6 px-6 md:px-8 items-start transition-colors duration-150 ${t.rowHover}`}
                >
                  <div
                    className={`spec-row py-5 text-[14px] leading-[1.5] ${t.rowLabel}`}
                    style={{ animationDelay: `${base}ms` }}
                  >
                    {label}
                  </div>
                  <span aria-hidden="true" className={`block self-stretch ${t.rule}`} />
                  <div
                    className={`spec-row py-5 text-[14px] leading-[1.5] ${t.bodyText}`}
                    style={{ animationDelay: `${base}ms` }}
                  >
                    {left}
                  </div>
                  <span aria-hidden="true" className={`block self-stretch ${t.rule}`} />
                  <div
                    className={`spec-row py-5 text-[14px] leading-[1.5] ${t.bodyText}`}
                    style={{ animationDelay: `${base + 60}ms` }}
                  >
                    {right}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary row — same hairline weight as the body rules so
              nothing reads as a "bright line." Emphasis comes only
              from a one-step type bump and a slightly darker label. */}
          {summaryRow && (
            <>
              <div className={`h-px w-full ${t.rule}`} />
              <div className={`grid ${gridCols} gap-x-6 px-6 md:px-8 items-start transition-colors duration-150 ${t.rowHover}`}>
                <div
                  className={`spec-row py-6 text-[14px] leading-[1.5] font-medium ${t.rowLabelStrong}`}
                  style={{ animationDelay: `${bodyRows.length * 80}ms` }}
                >
                  {summaryRow[0]}
                </div>
                <span aria-hidden="true" className={`block self-stretch ${t.rule}`} />
                <div
                  className={`spec-row py-6 text-[15px] leading-[1.45] ${t.bodyText}`}
                  style={{ animationDelay: `${bodyRows.length * 80}ms` }}
                >
                  {summaryRow[1]}
                </div>
                <span aria-hidden="true" className={`block self-stretch ${t.rule}`} />
                <div
                  className={`spec-row py-6 text-[15px] leading-[1.45] ${t.bodyText}`}
                  style={{ animationDelay: `${bodyRows.length * 80 + 60}ms` }}
                >
                  {summaryRow[2]}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile — Studio-only checklist, same card chrome as the
            rest of the page so it sits naturally in the cream
            chapter. */}
        <div className="flex flex-col gap-2 md:hidden">
          {rows.map(([, , right, mobileFeature], i) => (
            <div
              key={i}
              className={`flex items-start gap-3 rounded-2xl border ${t.mobileBorder} ${t.mobileBg} px-4 py-4`}
            >
              <span
                aria-hidden="true"
                className={`mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full ${t.mobileCheckBg}`}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2.5 6.5l2.5 2.5 4.5-5.5" />
                </svg>
              </span>
              <span className={`text-[14px] leading-[1.5] ${t.mobileCheckText}`}>
                {mobileFeature || right}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Brand slot — 32px logo square + label. Matches the chip pattern
// used elsewhere on the page (Testimonials avatars, InlinePreview
// chips). The Assembly side renders the actual app mark on its dark
// brand surface; the competitor renders a neutral, unbranded
// placeholder — we deliberately don't display third-party logos in
// a comparative context.
function BrandSlot({ variant, label, t }) {
  const isAssembly = variant === "assembly";
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className={
          isAssembly
            ? `flex h-8 w-8 flex-none items-center justify-center rounded-md bg-[#101010] ring-1 ${t.brandRing}`
            : `flex h-8 w-8 flex-none rounded-md ring-1 ${t.brandSurface} ${t.brandRing}`
        }
      >
        {isAssembly && <AssemblyMark />}
      </span>
      <span
        className={`text-[14px] leading-[1.5] ${
          isAssembly ? t.brandLabel : t.brandMuted
        }`}
      >
        {label}
      </span>
    </div>
  );
}

// Inline four-dot Assembly mark used in the brand chip. Recreated
// inline (vs. <img src="/logos/favicon.svg">) so it inherits
// currentColor and stays visually in sync with future colour
// changes.
function AssemblyMark() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 73 73"
      fill="currentColor"
      className="text-white"
      aria-hidden="true"
    >
      <path d="M47.3157 72.1924H66.7338C70.0489 72.1924 72.7363 69.505 72.7363 66.1899V46.7717C72.7363 43.4567 70.0489 40.7692 66.7338 40.7692H47.3157C44.0006 40.7692 41.3132 43.4567 41.3132 46.7717V66.1899C41.3132 69.505 44.0006 72.1924 47.3157 72.1924Z" />
      <path d="M57.03 0L57.024 0C48.3484 0 41.3154 7.03297 41.3154 15.7086V15.7146C41.3154 24.3902 48.3484 31.4231 57.024 31.4231H57.03C65.7056 31.4231 72.7386 24.3902 72.7386 15.7146V15.7086C72.7386 7.03297 65.7056 0 57.03 0Z" />
      <path d="M15.7146 0L15.7086 0C7.03296 0 0 7.03297 0 15.7086L0 15.7146C0 24.3902 7.03296 31.4231 15.7086 31.4231H15.7146C24.3902 31.4231 31.4231 24.3902 31.4231 15.7146V15.7086C31.4231 7.03297 24.3902 0 15.7146 0Z" />
      <path d="M15.7146 40.7666H15.7086C7.03297 40.7666 0 47.7996 0 56.4752L0 56.4812C0 65.1568 7.03297 72.1897 15.7086 72.1897H15.7146C24.3902 72.1897 31.4231 65.1568 31.4231 56.4812V56.4752C31.4231 47.7996 24.3902 40.7666 15.7146 40.7666Z" />
    </svg>
  );
}
