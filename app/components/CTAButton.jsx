import clsx from "clsx";
import { TYPEFORM_URL, SITE } from "../config/site";

export function CTAButton({
  variant = "primary",
  size = "sm",
  label,
  className,
  showArrow = false,
}) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition-all duration-200";
  const sizes = {
    sm: "px-4 py-2 text-[13px]",
    md: "px-6 py-3 text-sm",
  };
  const styles = {
    primary:
      "bg-[#D9ED92] text-[#101010] hover:bg-[#C7DA86]",
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
      {showArrow && (
        <svg
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="M13 5l7 7-7 7" />
        </svg>
      )}
    </a>
  );
}
