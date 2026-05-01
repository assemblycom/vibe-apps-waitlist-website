export function StackedSection({ id, eyebrow, heading, body, visual, cta }) {
  return (
    <section id={id} className="gradient-divider py-20 md:py-24">
      <div className="mx-auto max-w-4xl px-6 text-left md:text-center">
        {eyebrow && (
          <span className="mono mb-4 block text-xs uppercase tracking-[0.08em] text-white/40">
            {eyebrow}
          </span>
        )}
        <h3 className="mb-5 text-2xl font-semibold leading-tight tracking-[-0.02em] text-white [text-wrap:balance] md:text-[2rem]">
          {heading}
        </h3>
        <p className="max-w-2xl text-base leading-[1.65] text-white/70 md:mx-auto">
          {body}
        </p>
        {cta && <div className="mt-7 flex md:justify-center">{cta}</div>}
        {visual && <div className="mt-12">{visual}</div>}
      </div>
    </section>
  );
}
