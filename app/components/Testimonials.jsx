import clsx from "clsx";

const TILE_GRADIENTS = [
  "from-white/[0.06] via-white/[0.03] to-transparent",
  "from-white/[0.05] via-white/[0.02] to-transparent",
  "from-white/[0.07] via-white/[0.03] to-transparent",
];

function Tile({ name, body, index }) {
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  return (
    <div
      className={clsx(
        "relative aspect-[5/4] w-full overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br",
        TILE_GRADIENTS[index % TILE_GRADIENTS.length],
      )}
    >
      {/* Placeholder label — visible at rest, fades out on group hover */}
      <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0">
        <span className="mono text-[11px] uppercase tracking-[0.12em] text-white/25">
          Placeholder
        </span>
      </div>

      {/* Dot-grid texture, always visible, ties the tile to the footer pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35] transition-opacity duration-300 group-hover:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />

      {/* Quote — hidden at rest, fades + rises into view on hover */}
      <div className="absolute inset-0 flex items-start p-5 opacity-0 transition-all duration-300 group-hover:opacity-100">
        <blockquote className="translate-y-1 text-[0.9rem] leading-[1.55] text-white/85 transition-transform duration-300 group-hover:translate-y-0 md:text-[0.95rem]">
          &ldquo;{body}&rdquo;
        </blockquote>
      </div>
    </div>
  );
}

export function Testimonials({
  eyebrow,
  heading,
  subheading,
  stat,
  statCaption,
  quotes = [],
}) {
  return (
    <section className="gradient-divider py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div
          className={clsx(
            "mb-16 grid grid-cols-1 items-start gap-10 md:mb-20 md:gap-16",
            stat && "md:grid-cols-2",
          )}
        >
          <div>
            {eyebrow && (
              <span className="mono mb-5 block text-xs uppercase tracking-[0.08em] text-white/40">
                {eyebrow}
              </span>
            )}
            {heading && (
              <h3 className="mb-5 max-w-2xl text-3xl font-semibold leading-[1.1] tracking-[-0.025em] text-white md:text-[2.75rem]">
                {heading}
              </h3>
            )}
            {subheading && (
              <p className="max-w-md text-[0.95rem] leading-[1.6] text-white/55">
                {subheading}
              </p>
            )}
          </div>

          {stat && (
            <div className="flex flex-col items-start md:items-end md:text-right">
              <span className="text-[5rem] font-semibold leading-[0.95] tracking-[-0.04em] text-white md:text-[8rem]">
                {stat}
              </span>
              {statCaption && (
                <p className="mt-3 max-w-[240px] text-[0.85rem] leading-[1.5] text-white/45 md:text-right">
                  {statCaption}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {quotes.map((quote, i) => (
            <figure
              key={i}
              className="group flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.015] p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.025]"
            >
              {quote.segment && (
                <span className="mono mb-5 block text-[11px] uppercase tracking-[0.1em] text-white/40">
                  {quote.segment}
                </span>
              )}

              <Tile name={quote.name} body={quote.body} index={i} />

              <figcaption className="mt-6 flex flex-col gap-0.5 border-t border-white/5 pt-5">
                <span className="text-[1.05rem] font-semibold tracking-[-0.01em] text-white">
                  {quote.name}
                </span>
                {(quote.title || quote.company) && (
                  <span className="text-[13px] text-white/50">
                    {quote.title}
                    {quote.title && quote.company ? " " : ""}
                    {quote.company && (
                      <span className="text-white/35">@ {quote.company}</span>
                    )}
                  </span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
