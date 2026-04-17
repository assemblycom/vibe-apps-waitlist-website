import { CTAButton } from "./CTAButton";
import { SITE } from "../config/site";

export function Header() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
      <span className="font-semibold tracking-[-0.01em] text-white">
        {SITE.brand}
      </span>
      <CTAButton variant="primary" />
    </header>
  );
}
