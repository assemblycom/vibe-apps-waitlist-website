import { CTAButton } from "./CTAButton";

export function FinalCTA({ heading, subheading }) {
  return (
    <section className="border-t border-white/5 py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h3 className="mb-5 text-3xl font-semibold leading-tight tracking-[-0.02em] text-white md:text-[2.5rem]">
          {heading}
        </h3>
        {subheading && (
          <p className="mx-auto mb-8 max-w-xl text-[1.05rem] leading-[1.65] text-white/65">
            {subheading}
          </p>
        )}
        <div className="flex justify-center">
          <CTAButton variant="primary" />
        </div>
      </div>
    </section>
  );
}
