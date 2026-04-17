export function Testimonials({ eyebrow, heading, quotes = [] }) {
  return (
    <section className="border-t border-white/5 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {quotes.map((quote, i) => (
            <figure
              key={i}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <blockquote className="mb-6 flex-1 text-[0.95rem] leading-[1.6] text-white/80">
                &ldquo;{quote.body}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3">
                {quote.logo ? (
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-white/10" />
                ) : (
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-white/20 to-white/5" />
                )}
                <div>
                  <div className="text-sm font-semibold text-white">
                    {quote.name}
                  </div>
                  {quote.title && (
                    <div className="text-xs text-white/45">{quote.title}</div>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
