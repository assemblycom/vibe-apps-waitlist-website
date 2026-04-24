import { EmailCTA } from "./EmailCTA";
import { LogoStrip } from "./LogoStrip";

export function Hero({
  eyebrow,
  heading,
  subheading,
  alphaLogos,
}) {
  return (
    // min-height clamped so very tall viewports (1080p+, ultrawides) don't
    // stretch the hero and dump all their slack into one big gap between the
    // CTA and the bottom-anchored logo strip. Extra top padding at xl/2xl
    // keeps the stack visually centered on large monitors without needing to
    // restructure the flex layout.
    <section
      className="mx-auto flex max-w-6xl flex-col px-6 pb-8 pt-32 md:pb-12 md:pt-40 xl:pt-52 2xl:pt-60"
      style={{ minHeight: "min(100vh, 920px)" }}
    >
      {/* Centered column — heading + subhead + CTA all align on the
          vertical axis so the hero reads as a single focused stack. Each
          child keeps its own max-width constraint; items-center lays them
          out center-anchored, text-center carries through to multi-line
          copy. */}
      <div className="flex flex-col items-center text-center">
        {eyebrow && (
          <span className="mono mb-5 block text-xs uppercase tracking-[0.08em] text-white/40">
            {eyebrow}
          </span>
        )}
        <h1 className="mb-6 max-w-[900px] text-[2.125rem] font-normal leading-[1.05] tracking-[-0.03em] text-white [text-wrap:balance] md:text-[3.25rem] md:tracking-[-0.035em]">
          {heading}
        </h1>
        <p className="mb-8 max-w-[620px] text-[1.0625rem] leading-[1.55] text-white/55 [text-wrap:pretty]">
          {subheading}
        </p>
        <EmailCTA />
      </div>

      {/* Alpha-user credential strip — absorbed into the hero from its
          former standalone section so the social proof lands in the
          first view. Uses the dark variant of LogoStrip so markup is
          shared but text colors flip for the dark hero surface. */}
      {alphaLogos && alphaLogos.length > 0 && (
        // Pinned to the bottom of the flex-column hero (`mt-auto`),
        // centered, and kept narrow so the marquee reads as a grace
        // note of social proof rather than a full-width chrome bar.
        <div className="mx-auto mt-auto w-full max-w-[620px] pt-16 md:pt-20">
          <LogoStrip logos={alphaLogos} variant="dark" />
        </div>
      )}
    </section>
  );
}
