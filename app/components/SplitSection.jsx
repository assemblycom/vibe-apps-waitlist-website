import clsx from "clsx";

export function SplitSection({
  id,
  orientation = "text-left",
  eyebrow,
  heading,
  body,
  visual,
  cta,
}) {
  const textRight = orientation === "text-right";
  return (
    <section id={id} className="gradient-divider py-20 md:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:gap-16">
        <div className={clsx(textRight && "md:order-2")}>
          {eyebrow && (
            <span className="mono mb-4 block text-xs uppercase tracking-[0.08em] text-white/40">
              {eyebrow}
            </span>
          )}
          <h3 className="mb-4 text-2xl font-semibold leading-tight tracking-[-0.02em] text-white [text-wrap:balance] md:text-[2rem]">
            {heading}
          </h3>
          <p className="text-base leading-[1.65] text-white/70">{body}</p>
          {cta && <div className="mt-6">{cta}</div>}
        </div>
        <div className={clsx(textRight && "md:order-1")}>
          {visual ?? <VisualPlaceholder />}
        </div>
      </div>
    </section>
  );
}

function VisualPlaceholder() {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent" />
      <div className="mono absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.08em] text-white/30">
        Preview
      </div>
    </div>
  );
}
