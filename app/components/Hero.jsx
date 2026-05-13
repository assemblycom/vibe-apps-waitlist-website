import { EmailCTA } from "./EmailCTA";
import { LogoStrip } from "./LogoStrip";
import { HeroPromptToAppV19 } from "./HeroPromptToAppV19";

export function Hero({
  eyebrow,
  heading,
  subheading,
  alphaLabel,
  alphaLogos,
}) {
  return (
    <section className="relative flex flex-col">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: "#101010" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(40% 35% at 30% 35%, rgba(255,255,255,0.04) 0%, transparent 70%), radial-gradient(35% 30% at 75% 55%, rgba(217,237,146,0.04) 0%, transparent 75%)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 pt-32 text-center md:pt-36 lg:pt-40">
        <h1 className="mb-6 max-w-[820px] text-[2.125rem] font-normal leading-[1.05] tracking-[-0.03em] text-white [text-wrap:balance] md:text-[3.25rem] md:tracking-[-0.035em]">
          {heading}
        </h1>
        <p className="mb-8 max-w-[620px] text-[1.0625rem] leading-[1.55] text-white/55 [text-wrap:pretty]">
          {subheading}
        </p>
        <EmailCTA />
      </div>

      <div className="relative z-10 w-full overflow-hidden px-4 pt-8 md:px-6 md:pt-12 lg:px-10 lg:pt-16">
        <HeroPromptToAppV19 borderless />
      </div>

      {alphaLogos && alphaLogos.length > 0 && (
        <div className="relative z-20 -mt-20 border-t border-white/[0.08] bg-[#101010] pb-8 pt-5 md:mt-0 md:border-t-0 md:bg-transparent md:pb-10 md:pt-2">
          <div className="mx-auto w-full max-w-[620px] px-6">
            {alphaLabel && (
              <p
                className="mb-3 text-center text-[10px] uppercase tracking-[0.18em] text-white/45"
                style={{
                  fontFamily:
                    '"ABC Diatype Mono", ui-monospace, monospace',
                }}
              >
                {alphaLabel}
              </p>
            )}
            <LogoStrip logos={alphaLogos} variant="dark" />
          </div>
        </div>
      )}
    </section>
  );
}
