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
    // Centered text/CTA stack at the top, polished product surface
    // below as the hero's product feature, logo strip pinned to the
    // bottom. min-height clamped so very tall viewports don't dump
    // slack into one big gap between the CTA and the bottom-anchored
    // logo strip.
    <section
      className="relative overflow-hidden flex flex-col"
      style={{ minHeight: "min(100vh, 1080px)" }}
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
            "radial-gradient(45% 35% at 50% 30%, rgba(255,255,255,0.04) 0%, transparent 70%), radial-gradient(35% 25% at 50% 60%, rgba(217,237,146,0.04) 0%, transparent 75%)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-12 pt-32 md:pt-36 lg:pt-40">
        {/* Centered headline stack. */}
        <div className="flex flex-col items-center text-center">
          <h1 className="mb-6 max-w-[900px] text-[2.125rem] font-normal leading-[1.05] tracking-[-0.03em] text-white [text-wrap:balance] md:text-[3.25rem] md:tracking-[-0.035em]">
            {heading}
          </h1>
          <p className="mb-8 max-w-[620px] text-[1.0625rem] leading-[1.55] text-white/55 [text-wrap:pretty]">
            {subheading}
          </p>
          <EmailCTA />
        </div>

        {/* Alpha-user credential strip — pinned to the bottom of the
            section. */}
        {alphaLogos && alphaLogos.length > 0 && (
          <div className="mx-auto mt-auto w-full max-w-[620px] pt-16 md:pt-20">
            <LogoStrip label={alphaLabel} logos={alphaLogos} variant="dark" />
          </div>
        )}
      </div>
    </section>
  );
}
