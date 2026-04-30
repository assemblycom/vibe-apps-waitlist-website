import { EmailCTA } from "./EmailCTA";
import { HeroPromptToApp } from "./HeroPromptToApp";
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
        height: "min(100vh, 1080px)",
      }}
    >
      {/* Soft halo behind the headline area so the text has somewhere
          to sit visually against the dark field. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(40% 35% at 30% 35%, rgba(255,255,255,0.04) 0%, transparent 70%), radial-gradient(35% 30% at 75% 55%, rgba(217,237,146,0.04) 0%, transparent 75%)",
        }}
      />

      {/* Centered text + CTA — the readable column. Logos no longer
          live here; they're pinned to the bottom of the section over
          the portal so they read as a credibility strip on the
          showcase rather than a stack right under the CTA. */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 pt-32 text-center md:pt-36 lg:pt-40">
        <h1 className="mb-6 max-w-[820px] text-[2.125rem] font-normal leading-[1.05] tracking-[-0.03em] text-white [text-wrap:balance] md:text-[3.25rem] md:tracking-[-0.035em]">
          {heading}
        </h1>
        <p className="mb-8 max-w-[620px] text-[1.0625rem] leading-[1.55] text-white/55 [text-wrap:pretty]">
          {subheading}
        </p>
        <EmailCTA />
      </div>

      {/* Full-bleed portal showcase — pushed to the bottom of the
          section via mt-auto so the readable column above stays
          anchored to the top. The portal frame's height intentionally
          exceeds the remaining space so it bleeds past the section's
          bottom edge (clipped by overflow-hidden). */}
      <div className="relative z-10 mt-auto w-full px-4 pt-12 md:px-6 md:pt-16 lg:px-10">
        <HeroPromptToApp />
      </div>

      {/* Alpha-user credential strip — pinned to the bottom of the
          section, layered above the portal. A short gradient mask
          behind it fades the portal under the strip so the logos
          stay readable without obscuring the visual. */}
      {alphaLogos && alphaLogos.length > 0 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
          <div
            aria-hidden="true"
            className="h-20"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 60%, rgba(10,10,10,0) 100%)",
            }}
          />
          <div className="bg-[#0a0a0a]/95 pb-2 pt-4 md:pb-3">
            <div className="mx-auto w-full max-w-[620px] px-6">
              {/* Eyebrow ("Already used by early teams in alpha") is
                  intentionally omitted for now — just the marquee.
                  Tight bottom padding so the strip hugs the very
                  bottom edge of the hero viewport. */}
              <LogoStrip logos={alphaLogos} variant="dark" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
