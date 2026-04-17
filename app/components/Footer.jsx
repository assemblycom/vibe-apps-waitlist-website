import { SITE } from "../config/site";

export function Footer({ copyright, legalLinks = [] }) {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-8 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-white/70">
            {SITE.brand}
          </span>
          <span className="mono text-[11px] text-white/35">{copyright}</span>
        </div>
        <div className="flex gap-5">
          {legalLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="mono text-[11px] uppercase tracking-[0.08em] text-white/40 transition-colors hover:text-white/70"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
