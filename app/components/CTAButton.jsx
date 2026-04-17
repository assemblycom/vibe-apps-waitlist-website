import clsx from "clsx";
import { TYPEFORM_URL, SITE } from "../config/site";

export function CTAButton({ variant = "primary", label, className }) {
  const base =
    "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200";
  const sizes = "px-6 py-3 text-sm";
  const primary =
    "bg-white text-[#101010] hover:bg-white hover:shadow-[0_0_24px_rgba(214,249,144,0.18)]";
  const secondary =
    "border border-white/15 bg-transparent text-white hover:bg-white/5 hover:border-white/30";

  return (
    <a
      href={TYPEFORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        base,
        sizes,
        variant === "primary" ? primary : secondary,
        className,
      )}
    >
      {label ?? SITE.cta}
    </a>
  );
}
