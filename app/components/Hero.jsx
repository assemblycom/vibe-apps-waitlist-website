import { EmailCTA } from "./EmailCTA";
import { LogoStrip } from "./LogoStrip";

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

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-6 pb-12 pt-32 text-center md:pt-36 lg:pt-40">
        <h1 className="mb-6 max-w-[820px] text-[2.125rem] font-normal leading-[1.05] tracking-[-0.03em] text-white [text-wrap:balance] md:text-[3.25rem] md:tracking-[-0.035em]">
          {heading}
        </h1>
        <p className="mb-8 max-w-[620px] text-[1.0625rem] leading-[1.55] text-white/55 [text-wrap:pretty]">
          {subheading}
        </p>
        <EmailCTA />

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
