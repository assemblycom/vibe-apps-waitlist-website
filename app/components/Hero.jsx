import { EmailCTA } from "./EmailCTA";
import { HeroLayeredStack, FoundationIcon } from "./HeroLayeredStack";
import { LogoStrip } from "./LogoStrip";

const FOUNDATION_TAGS = [
  { iconKey: "lock", label: "Authentication" },
  { iconKey: "shield", label: "Permissions" },
  { iconKey: "bell", label: "Notifications" },
];

export function Hero({
  eyebrow,
  heading,
  subheading,
  alphaLabel,
  alphaLogos,
}) {
  return (
    // Two-column hero: text/CTA on the left, layered square-card
    // visual on the right. Logo strip pinned to the bottom across
    // the full width. min-height clamped so very tall viewports
    // don't dump slack into one big gap.
    <section
      className="relative overflow-hidden flex flex-col"
      style={{
        minHeight: "min(100vh, 1080px)",
      }}
    >
      {/* Dotted background — subtle, low-contrast, masked at the edges
          so the grid fades out instead of cutting hard at the section
          bounds. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.055) 1px, transparent 0)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(ellipse 75% 65% at 50% 45%, black 35%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 65% at 50% 45%, black 35%, transparent 95%)",
        }}
      />

      {/* Soft halo behind the headline area so the text has somewhere
          to sit visually against the dotted field. A second mint orb
          echoes the CTA accent. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(40% 35% at 30% 35%, rgba(255,255,255,0.04) 0%, transparent 70%), radial-gradient(35% 30% at 75% 55%, rgba(217,237,146,0.04) 0%, transparent 75%)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-12 pt-32 md:pt-36 lg:pt-40">
        {/* Two-column grid for md+. On mobile, text stacks above the
            (hidden) visual and stays left-aligned. */}
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[1.05fr_1fr] md:gap-10 lg:gap-16">
          {/* Left column — heading, subheading, CTA, foundation tags. */}
          <div className="flex flex-col items-start text-left">
            <h1 className="mb-6 max-w-[560px] text-[2.125rem] font-normal leading-[1.05] tracking-[-0.03em] text-white [text-wrap:balance] md:text-[3.25rem] md:tracking-[-0.035em]">
              {heading}
            </h1>
            <p className="mb-8 max-w-[520px] text-[1.0625rem] leading-[1.55] text-white/55 [text-wrap:pretty]">
              {subheading}
            </p>
            <EmailCTA />

            {/* Foundation tag row — names the primitives every app on
                Assembly Studio inherits. Lives directly under the CTA
                so the promise ("auth/perms/notifs come for free") sits
                next to the moment the user is asked to commit. */}
            <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-white/45">
              <span className="tracking-[-0.005em]">
                Every app inherits your
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {FOUNDATION_TAGS.map((f) => (
                  <span
                    key={f.label}
                    className="flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.02] px-2.5 py-1 text-white/65"
                  >
                    <FoundationIcon kind={f.iconKey} className="h-3 w-3" />
                    {f.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — layered square-card visual. Hidden on
              mobile (the component handles its own md:block). */}
          <div className="flex justify-center md:justify-end">
            <HeroLayeredStack />
          </div>
        </div>

        {/* Alpha-user credential strip — pinned to the bottom of the
            section, full-width centered. */}
        {alphaLogos && alphaLogos.length > 0 && (
          <div className="mx-auto mt-auto w-full max-w-[620px] pt-16 md:pt-20">
            <LogoStrip label={alphaLabel} logos={alphaLogos} variant="dark" />
          </div>
        )}
      </div>
    </section>
  );
}
