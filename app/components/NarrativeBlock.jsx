export function NarrativeBlock({ eyebrow, heading, body }) {
  const paragraphs = Array.isArray(body) ? body : [body];
  return (
    <section className="border-t border-white/5 py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        {eyebrow && (
          <span className="mono mb-5 block text-xs uppercase tracking-[0.08em] text-white/40">
            {eyebrow}
          </span>
        )}
        <h2 className="mb-8 text-3xl font-semibold leading-[1.15] tracking-[-0.02em] text-white md:text-[2.5rem]">
          {heading}
        </h2>
        <div className="space-y-5 text-[1.05rem] leading-[1.7] text-white/70">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
