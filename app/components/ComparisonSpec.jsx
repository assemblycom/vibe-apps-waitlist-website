"use client";

import { useEffect, useRef, useState } from "react";

// Spec-sheet comparison. The Assembly column is highlighted with a
// pricing-page detail: a separate tab cap sits ABOVE the card on
// the Assembly column (rounded top corners, square bottom), and
// inside the card the column-3 area shares the same fill so the
// tab and column read as a connected pair. The card's TOP-RIGHT
// corner is squared off (rounded-tr-none) so the tab's square
// bottom-right meets the card's square top-right exactly — no
// rounded-corner overhang where the tab would otherwise stick out
// past the card's curve. Tone: neutral on-brand warm dark wash
// (#1A1A1A at 6% over the cream chapter) — no mint.
export function ComparisonSpec({
  heading,
  headingCallout,
  leftLabel,
  rightLabel,
  rows = [],
  theme = "light",
}) {
  const ref = useRef(null);
  const [animate, setAnimate] = useState(false);
  const isLight = theme === "light";

  const t = isLight
    ? {
        heading: "text-[#1A1A1A]",
        headingMuted: "text-[#1A1A1A]/55",
        cardBorder: "border-[#1A1A1A]/10",
        cardBg: "bg-[#1A1A1A]/[0.03]",
        rule: "bg-[#1A1A1A]/10",
        ruleBorder: "divide-[#1A1A1A]/10",
        cellBorder: "border-[#1A1A1A]/10",
        rowHover: "hover:bg-[#1A1A1A]/[0.04]",
        rowLabel: "text-[#1A1A1A]/55",
        rowLabelStrong: "text-[#1A1A1A]/80",
        bodyText: "text-[#1A1A1A]/85",
        bodyMuted: "text-[#1A1A1A]/65",
        brandLabel: "text-[#1A1A1A]",
        brandMuted: "text-[#1A1A1A]/55",
        brandRing: "ring-[#1A1A1A]/10",
        brandSurface: "bg-[#1A1A1A]/[0.04]",
        mobileBorder: "border-[#1A1A1A]/10",
        mobileBg: "bg-[#1A1A1A]/[0.03]",
        mobileCheckBg: "bg-[#1A1A1A]/[0.06] text-[#1A1A1A]/55",
        mobileCheckText: "text-[#1A1A1A]/85",
        tabBg: "bg-[#1A1A1A]/[0.06]",
        tabLabel: "text-[#1A1A1A]/60",
        sparklesText: "text-[#1A1A1A]/45",
        assemblyTileBg: "bg-[#101010]",
        assemblyMarkText: "text-white",
      }
    : {
        heading: "text-white",
        headingMuted: "text-white/50",
        cardBorder: "border-white/10",
        cardBg: "bg-white/[0.02]",
        rule: "bg-white/10",
        ruleBorder: "divide-white/8",
        cellBorder: "border-white/8",
        rowHover: "hover:bg-white/[0.03]",
        rowLabel: "text-white/50",
        rowLabelStrong: "text-white/80",
        bodyText: "text-white/85",
        bodyMuted: "text-white/65",
        brandLabel: "text-white",
        brandMuted: "text-white/55",
        brandRing: "ring-white/10",
        brandSurface: "bg-white/[0.04]",
        mobileBorder: "border-white/10",
        mobileBg: "bg-white/[0.02]",
        mobileCheckBg: "bg-white/10 text-white",
        mobileCheckText: "text-white",
        tabBg: "bg-white/[0.06]",
        tabLabel: "text-white/60",
        sparklesText: "text-white/45",
        assemblyTileBg: "bg-white",
        assemblyMarkText: "text-[#101010]",
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

  const bodyRows = rows.length > 1 ? rows.slice(0, -1) : rows;
  const summaryRow = rows.length > 1 ? rows[rows.length - 1] : null;

  // 3-column grid: label | competitor | assembly. No gap tracks —
  // column rules are drawn via `border-l` on each answer cell so
  // the row, the contour overlay, and the pill row all share the
  // exact same column geometry.
  const gridCols = "grid-cols-[minmax(180px,220px)_1fr_1fr]";

  return (
    <section className="gradient-divider py-16 md:py-28">
      <div className="mx-auto max-w-5xl px-6">
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

        {/* Desktop card. */}
        <div
          ref={ref}
          data-spec-animate={animate ? "true" : "false"}
          data-spec-theme={theme}
          className="relative hidden md:block"
        >
          {/* Tab cap — separate element above the card. Rounded top
              corners, square bottom. Right edge sits at the same x
              as the card's outer right edge; the card's top-right
              corner is squared off (rounded-tr-none below) so the
              tab's square bottom-right meets the card's square
              top-right cleanly — no overhang past a curved corner. */}
          <div className={`grid ${gridCols} -mb-px`}>
            <div />
            <div />
            <div className={`rounded-t-2xl border border-b-0 ${t.cardBorder} ${t.tabBg} px-6 md:px-8 py-2.5`}>
              <span className={`mono text-[10px] uppercase tracking-[0.14em] ${t.tabLabel}`}>
                Built for client work
              </span>
            </div>
          </div>

          {/* Card. Top-right is squared (rounded-tr-none) so the tab
              cap connects to a flat edge. Other corners stay
              rounded-2xl. */}
          <div className={`relative overflow-hidden rounded-2xl rounded-tr-none border ${t.cardBorder} ${t.cardBg}`}>
            {/* Column-3 highlight overlay. Same fill as the tab so
                the two read as a continuous wash, but they're
                separated by the card's top border. */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 grid ${gridCols}`}
            >
              <div />
              <div />
              <div className={t.tabBg} />
            </div>

            {/* Header row. */}
            <div className={`relative grid ${gridCols}`}>
              <div className={`px-6 md:px-8 py-5 text-[14px] leading-[1.5] ${t.brandMuted}`}>
                Comparison
              </div>
              <div className={`px-6 md:px-8 py-5 border-l ${t.cellBorder}`}>
                <BrandSlot variant="competitor" label={leftLabel} t={t} />
              </div>
              <div className={`px-6 md:px-8 py-5 border-l ${t.cellBorder}`}>
                <BrandSlot variant="assembly" label={rightLabel} t={t} accent />
              </div>
            </div>

            {/* Top edge of body. */}
            <div className={`relative h-px w-full ${t.rule}`} />

            {/* Body rows. */}
            <div className={`relative divide-y ${t.ruleBorder}`}>
              {bodyRows.map(([label, left, right], i) => {
                const base = i * 80;
                return (
                  <div
                    key={i}
                    className={`grid ${gridCols} items-stretch transition-colors duration-150 ${t.rowHover}`}
                  >
                    <div
                      className={`spec-row px-6 md:px-8 py-5 text-[14px] leading-[1.5] ${t.rowLabel}`}
                      style={{ animationDelay: `${base}ms` }}
                    >
                      {label}
                    </div>
                    <div
                      className={`spec-row px-6 md:px-8 py-5 text-[14px] leading-[1.5] border-l ${t.cellBorder} ${t.bodyMuted}`}
                      style={{ animationDelay: `${base}ms` }}
                    >
                      {left}
                    </div>
                    <div
                      className={`spec-row px-6 md:px-8 py-5 text-[14px] leading-[1.5] border-l ${t.cellBorder} ${t.bodyText}`}
                      style={{ animationDelay: `${base + 60}ms` }}
                    >
                      {right}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stronger separator above the takeaway. */}
            <div className={`relative h-px w-full ${t.rule}`} />

            {/* Summary row. */}
            {summaryRow && (
              <div
                className={`relative grid ${gridCols} items-stretch transition-colors duration-150 ${t.rowHover}`}
              >
                <div
                  className={`spec-row px-6 md:px-8 py-6 text-[14px] leading-[1.5] font-medium ${t.rowLabelStrong}`}
                  style={{ animationDelay: `${bodyRows.length * 80}ms` }}
                >
                  {summaryRow[0]}
                </div>
                <div
                  className={`spec-row px-6 md:px-8 py-6 text-[14px] leading-[1.5] border-l ${t.cellBorder} ${t.bodyMuted}`}
                  style={{ animationDelay: `${bodyRows.length * 80}ms` }}
                >
                  {summaryRow[1]}
                </div>
                <div
                  className={`spec-row px-6 md:px-8 py-6 text-[14px] leading-[1.5] font-medium border-l ${t.cellBorder} ${t.bodyText}`}
                  style={{ animationDelay: `${bodyRows.length * 80 + 60}ms` }}
                >
                  {summaryRow[2]}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile — Studio-only checklist. */}
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
                <CheckIcon className="h-2.5 w-2.5" />
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

// Brand slot — 32px logo square + label. Competitor slot is a
// neutral sparkles glyph (stand-in for the broad "AI app builders"
// category — Lovable / Replit / Base44 / etc — without picking one
// brand mark over another).
function BrandSlot({ variant, label, t, accent = false }) {
  const isAssembly = variant === "assembly";
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className={
          isAssembly
            ? `flex h-8 w-8 flex-none items-center justify-center rounded-md ${t.assemblyTileBg} ring-1 ${t.brandRing}`
            : `flex h-8 w-8 flex-none items-center justify-center rounded-md ring-1 ${t.brandSurface} ${t.brandRing}`
        }
      >
        {isAssembly ? <AssemblyMark className={t.assemblyMarkText} /> : <SparklesMark className={t.sparklesText} />}
      </span>
      <span
        className={`text-[14px] leading-[1.5] ${
          accent ? `${t.brandLabel} font-medium` : t.brandMuted
        }`}
      >
        {label}
      </span>
    </div>
  );
}

// Brand check — same filled glyph the WaitlistModal uses for its
// success/step states, so the checks across the site read as one
// family. Inherits color from currentColor.
function CheckIcon({ className }) {
  return (
    <svg
      viewBox="0 0 11 10"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M10.2668 0.105509C10.5199 0.285978 10.5762 0.63754 10.3957 0.890666L4.2082 9.51567C4.11211 9.64926 3.96211 9.73598 3.79805 9.7477C3.63398 9.75942 3.46992 9.70317 3.35273 9.58598L0.165234 6.39848C-0.0550781 6.17817 -0.0550781 5.82192 0.165234 5.60395C0.385547 5.38598 0.741797 5.38363 0.959766 5.60395L3.68086 8.32035L9.48164 0.234416C9.66211 -0.0187095 10.0137 -0.0749595 10.2668 0.105509Z" />
    </svg>
  );
}

// Sparkles glyph — inlined from public/Icons/sparklesolid.svg. Uses
// currentColor so the outer span's text-color sets the tone —
// muted, never full black.
function SparklesMark({ className = "text-[#1A1A1A]/45" }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 12 12"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M6.52734 0.365625C6.44531 0.145313 6.23438 0 6 0C5.76562 0 5.55469 0.145313 5.47266 0.365625L4.08281 4.08281L0.365625 5.47266C0.145313 5.55469 0 5.76562 0 6C0 6.23438 0.145313 6.44531 0.365625 6.52734L4.08281 7.91953L5.475 11.6367C5.55469 11.8547 5.76562 12 6 12C6.23438 12 6.44531 11.8547 6.52734 11.6344L7.91953 7.91719L11.6367 6.525C11.8547 6.44531 12 6.23438 12 6C12 5.76562 11.8547 5.55469 11.6344 5.47266L7.91719 4.08281L6.52734 0.365625Z" />
    </svg>
  );
}

function AssemblyMark({ className = "text-white" }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 73 73"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M47.3157 72.1924H66.7338C70.0489 72.1924 72.7363 69.505 72.7363 66.1899V46.7717C72.7363 43.4567 70.0489 40.7692 66.7338 40.7692H47.3157C44.0006 40.7692 41.3132 43.4567 41.3132 46.7717V66.1899C41.3132 69.505 44.0006 72.1924 47.3157 72.1924Z" />
      <path d="M57.03 0L57.024 0C48.3484 0 41.3154 7.03297 41.3154 15.7086V15.7146C41.3154 24.3902 48.3484 31.4231 57.024 31.4231H57.03C65.7056 31.4231 72.7386 24.3902 72.7386 15.7146V15.7086C72.7386 7.03297 65.7056 0 57.03 0Z" />
      <path d="M15.7146 0L15.7086 0C7.03296 0 0 7.03297 0 15.7086L0 15.7146C0 24.3902 7.03296 31.4231 15.7086 31.4231H15.7146C24.3902 31.4231 31.4231 24.3902 31.4231 15.7146V15.7086C31.4231 7.03297 24.3902 0 15.7146 0Z" />
      <path d="M15.7146 40.7666H15.7086C7.03297 40.7666 0 47.7996 0 56.4752L0 56.4812C0 65.1568 7.03297 72.1897 15.7086 72.1897H15.7146C24.3902 72.1897 31.4231 65.1568 31.4231 56.4812V56.4752C31.4231 47.7996 24.3902 40.7666 15.7146 40.7666Z" />
    </svg>
  );
}
