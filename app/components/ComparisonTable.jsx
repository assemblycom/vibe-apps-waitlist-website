export function ComparisonTable({
  eyebrow,
  heading,
  firstColumnLabel,
  leftLabel,
  rightLabel,
  rows = [],
}) {
  return (
    <section className="gradient-divider py-20 md:py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-12 text-center">
          {eyebrow && (
            <span className="mono mb-4 block text-xs uppercase tracking-[0.08em] text-white/40">
              {eyebrow}
            </span>
          )}
          {heading && (
            <h3 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-white [text-wrap:balance] md:text-[2rem]">
              {heading}
            </h3>
          )}
        </div>

        {/* 3-col grid: row label | left (competitor) | right (us). The
            label column is narrower and quieter; the accent shading
            stays on the right half to keep the "us" column visually
            dominant. */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-white/[0.03] to-transparent"
          />
          <div className="relative grid grid-cols-[minmax(120px,180px)_1fr_1fr] border-b border-white/10 bg-white/[0.02]">
            <div className="px-5 py-4 text-sm text-white/45">
              {firstColumnLabel}
            </div>
            <div className="border-l border-white/10 px-5 py-4 text-sm text-white/50">
              {leftLabel}
            </div>
            <div className="border-l border-white/10 px-5 py-4 text-sm text-white">
              {rightLabel}
            </div>
          </div>
          {rows.map(([label, left, right], i) => (
            <div
              key={i}
              className="relative grid grid-cols-[minmax(120px,180px)_1fr_1fr] border-b border-white/5 transition-colors duration-200 last:border-b-0 hover:bg-white/[0.02]"
            >
              <div className="px-5 py-4 text-sm text-white/45">{label}</div>
              <div className="border-l border-white/10 px-5 py-4 text-sm text-white/55">
                {left}
              </div>
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
