import { EmailCTA } from "./EmailCTA";
import { LogoStrip } from "./LogoStrip";
import { HeroPromptToAppV19 } from "./HeroPromptToAppV19";
import { HeroGlowWord } from "./HeroGlowWord";

// Renders the heading, swapping "client-facing" for the HeroGlowWord
// that owns the neon ignite. Two parallel structures are emitted so
// the wrap behavior can differ by breakpoint without touching the
// other: the mobile copy glues "for client-facing" via a nowrap
// group (no orphaned "for"), and the sm+ copy is flat so
// `text-wrap: balance` can split the heading freely. Whichever copy
// isn't active is `display: none`, so animations on the hidden
// HeroGlowWord don't run twice and screen readers only see one.
function renderHeading(heading) {
  if (typeof heading !== "string") return heading;
  const match = heading.match(/(\S+)\s(client-facing)/i);
  if (!match) return heading;
  const before = heading.slice(0, match.index);
  const prevWord = match[1];
  const word = match[2];
  const after = heading.slice(match.index + match[0].length);
  return (
    <>
      <span className="min-[480px]:hidden">
        {before}
        <span className="whitespace-nowrap">
          {prevWord} <HeroGlowWord text={word} />
        </span>
        {after}
      </span>
      <span className="hidden min-[480px]:contents">
        {before}
        {prevWord} <HeroGlowWord text={word} />
        {after}
      </span>
    </>
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

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-start px-6 pt-32 text-left min-[480px]:items-center min-[480px]:text-center md:pt-36 lg:pt-40">
        <h1 className="mb-6 max-w-[820px] text-[2.125rem] font-normal leading-[1.1] tracking-[-0.03em] text-white min-[480px]:leading-[1.05] min-[480px]:[text-wrap:balance] md:text-[3.25rem] md:tracking-[-0.035em]">
          {renderHeading(heading)}
        </h1>
        <p className="mb-8 max-w-[620px] text-[1.0625rem] leading-[1.55] text-white/55 [text-wrap:pretty]">
          {subheading}
        </p>
        <EmailCTA />
      </div>

      <div className="relative z-10 w-full overflow-hidden px-4 pt-8 md:px-6 md:pt-12 lg:px-10 lg:pt-16">
        {/* startDelay holds the cycle so the typing demo doesn't compete
            with the headline's per-character glow on first paint —
            "client-facing" finishes igniting (~1.4s for the stagger +
            per-char animation) and then the composer below starts
            typing. Reduced-motion users skip the glow entirely, so
            this delay still applies but reads as a brief idle beat. */}
        <HeroPromptToAppV19 borderless startDelay={1500} />
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
