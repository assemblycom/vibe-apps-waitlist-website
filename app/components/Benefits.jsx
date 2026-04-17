export function Benefits({ eyebrow, heading, items = [] }) {
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <h4 className="mb-2 text-[1.05rem] font-semibold tracking-[-0.01em] text-white">
                {item.title}
              </h4>
              <p className="text-[0.9rem] leading-[1.6] text-white/60">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
