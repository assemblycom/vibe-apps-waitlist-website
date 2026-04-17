export function LogoStrip({ label, logos = [] }) {
  return (
    <section className="border-t border-white/5 py-16">
      <div className="mx-auto max-w-6xl px-6">
        {label && (
          <p className="mono mb-8 text-center text-xs uppercase tracking-[0.08em] text-white/40">
            {label}
          </p>
        )}
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-6">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="flex h-8 items-center justify-center"
            >
              <span className="text-sm font-semibold tracking-tight text-white/35 transition-colors hover:text-white/60">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
