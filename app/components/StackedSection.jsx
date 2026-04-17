export function StackedSection({ eyebrow, heading, body, visual, cta }) {
  return (
    <section className="gradient-divider py-20 md:py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        {eyebrow && (
          <span className="mono mb-4 block text-xs uppercase tracking-[0.08em] text-white/40">
            {eyebrow}
          </span>
        )}
        <h3 className="mb-5 text-2xl font-semibold leading-tight tracking-[-0.02em] text-white md:text-[2rem]">
          {heading}
        </h3>
        <p className="mx-auto max-w-2xl text-base leading-[1.65] text-white/70">
          {body}
        </p>
        {cta && <div className="mt-7 flex justify-center">{cta}</div>}
        {visual && <div className="mt-12">{visual}</div>}
      </div>
    </section>
  );
}
