import { CTAButton } from "./CTAButton";
import { SITE } from "../config/site";

export function Header() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
      <a
        href="/"
        aria-label={SITE.brand}
        className="inline-flex items-center transition-opacity duration-200 hover:opacity-80"
      >
        <img
          src="/logos/web-logo.svg"
          alt={SITE.brand}
          className="hidden h-6 w-auto md:block"
        />
        <img
          src="/logos/mobile-logo.svg"
          alt={SITE.brand}
          className="h-7 w-auto md:hidden"
        />
      </a>
      <CTAButton variant="ghost" size="sm" />
    </header>
  );
}
