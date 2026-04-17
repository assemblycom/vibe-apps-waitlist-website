import { Reveal } from "./Reveal";

export function LogoStrip({ label, logos = [] }) {
  return (
    <section className="gradient-divider py-14">
      <div className="mx-auto max-w-6xl px-6">
        {label && (
          <p className="mono mb-10 text-center text-xs uppercase tracking-[0.08em] text-white/40">
            {label}
          </p>
        )}
        <div className="grid grid-cols-2 items-center gap-x-4 gap-y-6 sm:grid-cols-3 md:flex md:flex-wrap md:justify-center md:gap-x-10">
          {logos.map((logo, i) => (
            <Reveal key={logo.name} delay={i * 60}>
              <div className="flex h-8 items-center justify-center">
                <span className="text-sm font-semibold tracking-tight text-white/30 transition-colors duration-200 hover:text-white/80">
                  {logo.name}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
