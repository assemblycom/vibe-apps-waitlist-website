"use client";

import { useState } from "react";
import clsx from "clsx";

function Chevron({ open }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={clsx(
        "flex-shrink-0 transition-[transform,color] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        open ? "rotate-180 text-white/55" : "text-white/40",
      )}
      aria-hidden="true"
    >
      <path
        d="M3 5l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Hover-to-open with click-to-toggle, mirroring the Testimonials card
// pattern (onMouseEnter/onFocus activate, click acts as a toggle so
// keyboard + touch users can still close items). State is lifted to the
// parent so only one item is open at a time — preserves the editorial
// "one detail at a time" feel.
function FaqItem({ q, a, open, onActivate, onToggle }) {
  return (
    <div
      onMouseEnter={onActivate}
      className={clsx(
        "group overflow-hidden rounded-2xl border bg-white/[0.02] transition-colors duration-300",
        open ? "border-white/25" : "border-white/10 hover:border-white/20",
      )}
    >
      <button
        onClick={onToggle}
        onFocus={onActivate}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
      >
        <span className="text-[1rem] leading-snug text-white">
          {q}
        </span>
        <Chevron open={open} />
      </button>
      <div
        className={clsx(
          "grid transition-[grid-template-rows] duration-[520ms] ease-[cubic-bezier(0.22,1.2,0.36,1)]",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <p
            className={clsx(
              "px-6 pb-5 pr-12 text-[1rem] leading-[1.6] text-white/55 transition-all duration-[520ms]",
              open
                ? "translate-y-0 opacity-100 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                : "-translate-y-1 opacity-0 ease-[cubic-bezier(0.4,0,0.2,1)]",
            )}
          >
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FAQ({ eyebrow, heading, items = [] }) {
  // Single source of truth for which item is open. Hovering a row sets
  // it; clicking the active row closes it. Mouse leaving the whole list
  // keeps the last hovered item open — feels less twitchy than auto-
  // collapsing on every move.
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="gradient-divider py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center">
          {eyebrow && (
            <span className="mono mb-4 block text-xs uppercase tracking-[0.08em] text-white/40">
              {eyebrow}
            </span>
          )}
          {heading && (
            <h3 className="text-[1.75rem] font-normal leading-[1.05] tracking-[-0.025em] text-white [text-wrap:balance] md:text-[2.375rem] md:tracking-[-0.03em]">
              {heading}
            </h3>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <FaqItem
              key={i}
              q={item.q}
              a={item.a}
              open={activeIndex === i}
              onActivate={() => setActiveIndex(i)}
              onToggle={() =>
                setActiveIndex((cur) => (cur === i ? null : i))
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
