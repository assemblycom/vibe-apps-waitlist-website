"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

// Short, roughly-equal-length prompts (~48–58 chars) so the chat input's
// height stays constant as each one types in.
const PROMPTS = [
  "Build a time tracking app to log hours across projects",
  "Build a client intake flow that drafts proposals",
  "Build a client portal to sign contracts and pay invoices",
  "Build a creative review tool for comments on drafts",
  "Build an engagement tracker with milestones and invoicing",
];

// Figma node 139:46328 — gradient panel (white → pale blue → pale green)
// layered on a white base so it never goes transparent against the page.
const CARD_GRADIENT = [
  "linear-gradient(180deg, rgba(255,255,255,0) 12.397%, rgb(139,153,200) 74.611%, rgb(217,237,146) 100%)",
  "linear-gradient(90deg, rgb(255,255,255) 0%, rgb(255,255,255) 100%)",
].join(", ");

export function PromptCardVisual() {
  const [typed, setTyped] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  // Start the animation once the card enters the viewport
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Continuously cycle through PROMPTS: type → hold → erase → advance → type.
  // Per-keystroke delay is lightly randomised with extra pauses after spaces
  // and punctuation so the cadence reads as human typing, not a metronome.
  useEffect(() => {
    if (!inView) return;

    let timerId = null;
    let cancelled = false;
    let currentIndex = 0;

    const HOLD_FULL_MS = 1800;
    const HOLD_EMPTY_MS = 500;

    const nextTypeDelay = (justTyped) => {
      let d = 45 + Math.random() * 35;
      if (justTyped === " ") d += 30 + Math.random() * 40;
      if (justTyped === ",") d += 140 + Math.random() * 80;
      if (justTyped === ".") d += 200 + Math.random() * 100;
      if (Math.random() < 0.05) d += 90 + Math.random() * 110;
      return d;
    };

    const nextEraseDelay = () => 14 + Math.random() * 14;

    const type = (i) => {
      if (cancelled) return;
      const text = PROMPTS[currentIndex];
      if (i > text.length) {
        timerId = setTimeout(() => erase(text.length), HOLD_FULL_MS);
        return;
      }
      setTyped(text.slice(0, i));
      timerId = setTimeout(() => type(i + 1), nextTypeDelay(text[i - 1]));
    };

    const erase = (i) => {
      if (cancelled) return;
      const text = PROMPTS[currentIndex];
      if (i <= 0) {
        setTyped("");
        currentIndex = (currentIndex + 1) % PROMPTS.length;
        setPromptIndex(currentIndex);
        timerId = setTimeout(() => type(1), HOLD_EMPTY_MS);
        return;
      }
      setTyped(text.slice(0, i - 1));
      timerId = setTimeout(() => erase(i - 1), nextEraseDelay());
    };

    setTyped("");
    setPromptIndex(0);
    timerId = setTimeout(() => type(1), 400);

    return () => {
      cancelled = true;
      if (timerId) clearTimeout(timerId);
    };
  }, [inView]);

  const currentPrompt = PROMPTS[promptIndex];
  const isEmpty = typed.length === 0;
  const isDone = typed.length >= currentPrompt.length;

  return (
    <div
      ref={ref}
      className="font-inter relative aspect-[3/2] w-full overflow-hidden rounded-[16px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]"
      style={{ backgroundImage: CARD_GRADIENT }}
    >
      {/* Chat input — centered in the card */}
      <div className="absolute left-1/2 top-1/2 w-[82%] max-w-[460px] -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-[10px] border border-[#dfe1e4] bg-[#fbfbfb] px-4 pb-2.5 pt-3 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)]">
          {/* Input text area — fixed height so the box doesn't grow/shrink as
              prompts cycle. Text aligns to the top like a real textarea. */}
          <div className="mb-2 h-[52px] overflow-hidden text-[15px] leading-[1.55]">
            {isEmpty ? (
              <span className="text-[#90959d]">
                How might you improve your app?
              </span>
            ) : (
              <span className="text-[#101010]">
                {typed}
                {!isDone && (
                  <span
                    aria-hidden="true"
                    className="ml-0.5 inline-block h-[0.95em] w-[2px] translate-y-[-0.5px] animate-pulse bg-[#101010] align-text-top"
                  />
                )}
              </span>
            )}
          </div>

          {/* Actions row */}
          <div className="flex items-center justify-between">
            {/* Paperclip */}
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-md text-[#90959d]"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </span>

            {/* "Build app" button — disabled-looking until the user finishes typing */}
            <span
              className={clsx(
                "rounded-[4px] px-3 py-1.5 text-[13px] font-medium transition-colors duration-300",
                isDone
                  ? "bg-[#101010] text-white"
                  : "bg-[#eff1f4] text-[#c9cbcd]",
              )}
            >
              Build app
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
