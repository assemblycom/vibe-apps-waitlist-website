import { EmailCTA } from "./EmailCTA";
import { LogoStrip } from "./LogoStrip";
import { HeroPromptToApp } from "./HeroPromptToApp";

export function Hero({
  eyebrow,
  heading,
  subheading,
  alphaLabel,
  alphaLogos,
}) {
  return (
    // V7: full-screen hero. The section is exactly one viewport tall so
    // the dark hero ends cleanly at the fold, and the cream NarrativeBlock
    // below carries the color transition (Notion-style hard flip — no
    // scroll-driven scale/zoom).
    //
    // The section itself does NOT use overflow-hidden, because that would
    // turn the section into a sticky containment context and the bottom
    // logo row would no longer track the viewport. Bleed clipping for the
    // tall studio/portal mock is moved to the visual wrapper instead.
    <section
      className="relative flex flex-col"
      style={{ height: "100vh", minHeight: "100vh" }}
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

      {/* Headline + CTA — pinned to the top of the section. */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl shrink-0 flex-col items-center px-6 pt-28 text-center md:pt-32 lg:pt-36">
        <h1 className="mb-6 max-w-[820px] text-[2.125rem] font-normal leading-[1.05] tracking-[-0.03em] text-white [text-wrap:balance] md:text-[3.25rem] md:tracking-[-0.035em]">
          {heading}
        </h1>
        <p className="mb-8 max-w-[620px] text-[1.0625rem] leading-[1.55] text-white/55 [text-wrap:pretty]">
          {subheading}
        </p>
        <EmailCTA />
      </div>

      {/* Visual slot — takes the remaining vertical space between the
          CTA and the bottom edge. The HeroPromptToApp card is taller than
          the slot on most viewports; its own overflow-hidden wrapper
          clips the bleed so the section can keep overflow visible (which
          is what lets the sticky logo row work). min-h-0 is needed so
          flex-1 can shrink under its content height. */}
      <div className="relative z-10 mt-10 flex min-h-0 flex-1 items-start justify-center overflow-hidden px-6 md:mt-12">
        <div className="w-full max-w-[1100px]">
          <HeroPromptToApp />
        </div>
      </div>

      {/* Alpha-user credential band — sticky to the viewport bottom while
          the hero is on screen, then locks at the section's bottom edge
          (standard `position: sticky; bottom: 0` behavior; the section is
          the containing block, so the strip stops moving with the viewport
          when the hero scrolls past).
          Background is opaque so the bleeding visual underneath stays
          covered as the strip slides over it. */}
      {alphaLogos && alphaLogos.length > 0 && (
        <div className="sticky bottom-0 z-20 mt-auto shrink-0 bg-[var(--color-bg)]">
          <div className="pb-2 pt-4 md:pb-3">
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
        </div>
      )}
    </section>
  );
}
