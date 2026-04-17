"use client";

import { useState } from "react";

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <span className="text-[1rem] font-semibold leading-snug text-white">
          {q}
        </span>
        <span
          className={`ml-4 flex-shrink-0 text-xl text-white/40 transition-transform duration-200 ${
            open ? "rotate-45" : "rotate-0"
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`overflow-hidden transition-[max-height] duration-300 ease-out ${
          open ? "max-h-60" : "max-h-0"
        }`}
      >
        <p className="px-6 pb-5 text-[0.9rem] leading-[1.65] text-white/60">
          {a}
        </p>
      </div>
    </div>
  );
}

export function FAQ({ eyebrow, heading, items = [] }) {
  return (
    <section className="border-t border-white/5 py-20 md:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center">
          {eyebrow && (
            <span className="mono mb-4 block text-xs uppercase tracking-[0.08em] text-white/40">
              {eyebrow}
            </span>
          )}
          {heading && (
            <h3 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-white md:text-[2rem]">
              {heading}
            </h3>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
