export function ComparisonTable({
  eyebrow,
  heading,
  leftLabel,
  rightLabel,
  rows = [],
}) {
  return (
    <section className="border-t border-white/5 py-20 md:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-12 text-center">
          {eyebrow && (
            <span className="mono mb-4 block text-xs uppercase tracking-[0.08em] text-white/40">
              {eyebrow}
            </span>
          )}
          {heading && (
            <h3 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-white md:text-[2rem]">
              {heading}
            </h3>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-2 border-b border-white/10 bg-white/[0.02]">
            <div className="mono px-5 py-4 text-xs uppercase tracking-[0.08em] text-white/40">
              {leftLabel}
            </div>
            <div className="mono border-l border-white/10 px-5 py-4 text-xs uppercase tracking-[0.08em] text-white">
              {rightLabel}
            </div>
          </div>
          {rows.map(([left, right], i) => (
            <div
              key={i}
              className="grid grid-cols-2 border-b border-white/5 last:border-b-0"
            >
              <div className="px-5 py-4 text-sm text-white/55">{left}</div>
              <div className="border-l border-white/10 px-5 py-4 text-sm text-white">
                {right}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
