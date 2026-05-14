import { EmailCTA } from "./EmailCTA";
import { LogoStrip } from "./LogoStrip";
import { HeroPromptToAppV19 } from "./HeroPromptToAppV19";
import { HeroGlowWord } from "./HeroGlowWord";

// Renders the heading, swapping any occurrence of "client-facing" for
// a client-side HeroGlowWord that owns the load-then-hover neon
// ignite. Falls back to the raw string for unrelated headings so the
// component stays safe for variant copy.
function renderHeading(heading) {
  if (typeof heading !== "string") return heading;
  const parts = heading.split(/(client-facing)/i);
  if (parts.length === 1) return heading;
  return parts.map((part, i) =>
    /^client-facing$/i.test(part) ? (
      <HeroGlowWord key={i} text={part} />
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

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

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-start px-6 pt-32 text-left sm:items-center sm:text-center md:pt-36 lg:pt-40">
        <h1 className="mb-6 max-w-[820px] text-[2.125rem] font-normal leading-[1.1] tracking-[-0.03em] text-white [text-wrap:balance] sm:leading-[1.05] md:text-[3.25rem] md:tracking-[-0.035em]">
          {renderHeading(heading)}
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
        <div className="relative z-20 -mt-28 border-t border-white/[0.18] bg-[#101010] pb-8 pt-5 shadow-[0_-12px_24px_-6px_rgba(0,0,0,0.55)] md:-mt-12 lg:mt-0 lg:border-t-0 lg:bg-transparent lg:pb-10 lg:pt-2 lg:shadow-none">
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
