"use client";

import { SITE } from "../config/site";

export function Footer() {
  const scrollToTop = () => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 md:py-8">
      <a
        href="/"
        aria-label={SITE.brand}
        className="inline-flex items-center transition-opacity duration-200 hover:opacity-80"
      >
        <img
          src="/logos/mobile-logo.svg"
          alt={SITE.brand}
          className="h-7 w-auto"
        />
      </a>

      <button
        type="button"
        onClick={scrollToTop}
        className="inline-flex items-center gap-1.5 text-[13px] text-white/55 transition-colors duration-200 hover:text-white"
      >
        Back to the top
        <span aria-hidden="true">↑</span>
      </button>
    </footer>
  );
}
