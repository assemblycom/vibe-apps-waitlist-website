import { CTAButton } from "./CTAButton";

export function Hero({ eyebrow, heading, subheading }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">
      <div>
        {eyebrow && (
          <span className="mono mb-5 block text-xs uppercase tracking-[0.08em] text-white/40">
            {eyebrow}
          </span>
        )}
        <h1 className="mb-6 max-w-[900px] whitespace-pre-line text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.035em] text-white md:text-[3.5rem]">
          {heading}
        </h1>
        <p className="mb-8 max-w-[620px] text-[1.05rem] leading-[1.6] text-white/65">
          {subheading}
        </p>
        <CTAButton variant="primary" />
      </div>
    </section>
  );
}
