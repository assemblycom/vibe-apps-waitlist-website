import clsx from "clsx";
import { TYPEFORM_URL, SITE } from "../config/site";

export function CTAButton({ variant = "primary", size = "sm", label, className }) {
  const base =
    "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200";
  const sizes = {
    sm: "px-4 py-2 text-[13px]",
    md: "px-6 py-3 text-sm",
  };
  const styles = {
    primary:
      "bg-white text-[#101010] hover:bg-white hover:shadow-[0_0_24px_rgba(214,249,144,0.18)]",
    ghost:
      "border border-white/15 bg-transparent text-white hover:border-white/30 hover:bg-white/5",
  };

  return (
    <a
      href={TYPEFORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        base,
        sizes[size] ?? sizes.md,
        styles[variant] ?? styles.primary,
        className,
      )}
    >
      {label ?? SITE.cta}
    </a>
  );
}
