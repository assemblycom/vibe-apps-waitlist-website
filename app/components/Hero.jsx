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
    <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-20 pt-32 md:pb-28 md:pt-40">
      <div>
        {eyebrow && (
          <span className="mono mb-5 block text-xs uppercase tracking-[0.08em] text-white/40">
            {eyebrow}
          </span>
        )}
        <h1 className="mb-6 max-w-[900px] text-[2.125rem] font-normal leading-[1.05] tracking-[-0.03em] text-white [text-wrap:balance] md:text-[3.25rem] md:tracking-[-0.035em]">
          {heading}
        </h1>
        <p className="mb-8 max-w-[620px] text-[1.0625rem] leading-[1.55] text-white/55">
          {subheading}
        </p>
        <EmailCTA />
      </div>

      {/* Alpha-user credential strip — absorbed into the hero from its
          former standalone section so the social proof lands in the
          first view. Uses the dark variant of LogoStrip so markup is
          shared but text colors flip for the dark hero surface. */}
      {alphaLogos && alphaLogos.length > 0 && (
        <div className="mt-16 md:mt-24">
          <LogoStrip
            label={alphaLabel}
            logos={alphaLogos}
            variant="dark"
          />
        </div>
      )}
    </section>
  );
}
