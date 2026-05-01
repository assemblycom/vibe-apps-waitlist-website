"use client";

import { useState } from "react";
import clsx from "clsx";

// Smooth, unhurried curve for the expand/collapse motion.
const EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";

// Render the avatar: either the provided photo or a colored initial bubble.
// If the photo fails to load (file missing, 404, etc.) we quietly fall back
// to the initial bubble instead of showing the browser's broken-image icon.
// Rounded *square* (not circle) — gives each photo more presence in the
// collapsed card column.
function Avatar({ quote, size = 56, isLight = false }) {
  const initial = (quote.name ?? "?").trim().charAt(0).toUpperCase();
  const [failed, setFailed] = useState(false);
  const showPhoto = quote.photo && !failed;

  const imgRef = (el) => {
    if (!el) return;
    // If the image has already loaded (complete=true) but has zero natural
    // dimensions, it failed — React's onError won't fire after the fact.
    if (el.complete && el.naturalWidth === 0) {
      setFailed(true);
    }
  };

  // Size animates with the card so the collapsed column gets a larger,
  // more intentional avatar, shrinking back once the quote expands and
  // no longer needs the visual anchor.
  //
  // aspectRatio + maxWidth:100% keeps the avatar square even when the
  // collapsed card is narrower than `size`. Tailwind's preflight adds
  // `max-width: 100%` to <img>, so at narrow viewports the img width would
  // get capped while height stayed explicit — producing a stretched
  // rectangle. Using aspect-ratio with no inline height lets height follow
  // width, so the avatar stays 1:1 and just shrinks proportionally.
  const sizeStyle = {
    width: size,
    maxWidth: "100%",
    aspectRatio: "1 / 1",
    transition: `width 500ms ${EASE}`,
  };

  if (showPhoto) {
    return (
      <img
        ref={imgRef}
        src={quote.photo}
        alt=""
        aria-hidden="true"
        onError={() => setFailed(true)}
        className="flex-none rounded-[10px] object-cover"
        style={sizeStyle}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className={`flex flex-none items-center justify-center rounded-[10px] border text-[15px] font-medium ${
        isLight
          ? "border-[#1A1A1A]/15 bg-[#1A1A1A]/[0.06] text-[#1A1A1A]/80"
          : "border-white/15 bg-white/[0.06] text-white/80"
      }`}
      style={sizeStyle}
    >
      {initial}
    </div>
  );
}

// ── Horizontal accordion (md+) ────────────────────────────────────────────
// Each card is a flex item that grows when active (flex: 5) and shrinks when
// not (flex: 1). Transitioning `flex-grow` animates the width smoothly.
// Inactive cards show only avatar + name. Active card reveals quote and
// attribution with a slight delay so content fades in after the width has
// started opening — avoiding a visual "jump".
function HorizontalAccordion({ quotes, activeIndex, onActivate, isLight = false }) {
  return (
    <div
      className="hidden h-[440px] gap-3 md:flex"
      role="tablist"
      aria-label="Testimonials"
    >
      {quotes.map((quote, i) => {
        const isActive = i === activeIndex;
        const attribution = [quote.title, quote.company]
          .filter(Boolean)
          .join(", ");
        return (
          <article
            key={i}
            role="tab"
            tabIndex={0}
            aria-selected={isActive}
            aria-label={quote.name ?? `Testimonial ${i + 1}`}
            onMouseEnter={() => onActivate(i)}
            onFocus={() => onActivate(i)}
            onClick={() => onActivate(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onActivate(i);
              }
            }}
            style={{
              // flex-basis:0 ensures flex-grow ratios dictate width
              // independent of intrinsic content width. Without it the
              // collapsed cards still sit around their content's natural
              // width, so the "expand" doesn't really expand.
              flexGrow: isActive ? 4 : 1,
              flexBasis: 0,
              flexShrink: 1,
              transitionProperty: "flex-grow",
              transitionDuration: "700ms",
              transitionTimingFunction: EASE,
            }}
            className={clsx(
              "group relative min-w-0 cursor-pointer overflow-hidden rounded-[20px] border outline-none",
              isLight ? "focus-visible:ring-2 focus-visible:ring-[#1A1A1A]/40" : "focus-visible:ring-2 focus-visible:ring-white/40",
              isActive
                ? isLight
                  ? "border-[#1A1A1A]/15 bg-[#1A1A1A]/[0.04]"
                  : "border-white/20 bg-white/[0.04]"
                : isLight
                  ? "border-[#1A1A1A]/10 bg-[#1A1A1A]/[0.02] hover:border-[#1A1A1A]/15"
                  : "border-white/10 bg-white/[0.02] hover:border-white/15",
            )}
          >
            {/* Inner padding; grid so children land in known rows */}
            <div className="relative flex h-full flex-col justify-between p-6 md:p-7">
              {/* Avatar — always visible. Top-left when expanded; horizontally
                  centered when collapsed so the narrow column doesn't leave
                  an awkward gap to the avatar's right. */}
              <div
                className={clsx(
                  "flex",
                  isActive ? "justify-start" : "justify-center",
                )}
                style={{
                  transition: `justify-content 300ms ${EASE}`,
                }}
              >
                <Avatar quote={quote} size={isActive ? 56 : 68} isLight={isLight} />
              </div>

              {/* Active-only: big quote + attribution. Collapsed cards hide
                  this so the column stays narrow. Opacity fades in *after*
                  the width has mostly opened (delay 180ms) so content
                  doesn't appear before there's room for it. */}
              <div
                aria-hidden={!isActive}
                className="pointer-events-none absolute inset-x-6 top-24 bottom-6 flex flex-col justify-between md:inset-x-7 md:top-28 md:bottom-7"
                style={{
                  opacity: isActive ? 1 : 0,
                  transition: `opacity 400ms ${EASE} ${
                    isActive ? "180ms" : "0ms"
                  }`,
                }}
              >
                <blockquote className={`text-[1.0625rem] leading-[1.5] md:text-[1.1875rem] ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>
                  “{quote.body}”
                </blockquote>
                <div>
                  {quote.name && (
                    <div className={`text-[14px] leading-[1.3] ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>
                      {quote.name}
                    </div>
                  )}
                  {attribution && (
                    <div className={`mono mt-1 text-[12px] leading-[1.4] ${isLight ? "text-[#1A1A1A]/55" : "text-white/55"}`}>
                      {attribution}
                    </div>
                  )}
                </div>
              </div>

              {/* Collapsed-only: name at bottom. Fades opposite to the
                  active content so only one is visible at a time.
                  `truncate` prevents the name from wrapping when the
                  column is narrow (it'll ellipsize instead). */}
              <div
                aria-hidden={isActive}
                className="pointer-events-none min-w-0"
                style={{
                  opacity: isActive ? 0 : 1,
                  transition: `opacity 300ms ${EASE}`,
                }}
              >
                {quote.name && (
                  <div className={`truncate text-[13px] leading-[1.3] ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>
                    {quote.name}
                  </div>
                )}
                {quote.title && (
                  <div className={`mono mt-1 truncate text-[11px] leading-[1.3] ${isLight ? "text-[#1A1A1A]/55" : "text-white/55"}`}>
                    {quote.title}
                  </div>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

// ── Vertical accordion (mobile) ───────────────────────────────────────────
// Same idea but stacked: active row is tall and shows the full quote,
// collapsed rows shrink to a compact strip with avatar + name.
function VerticalAccordion({ quotes, activeIndex, onActivate, isLight = false }) {
  return (
    <div
      className="flex flex-col gap-3 md:hidden"
      role="tablist"
      aria-label="Testimonials"
    >
      {quotes.map((quote, i) => {
        const isActive = i === activeIndex;
        const attribution = [quote.title, quote.company]
          .filter(Boolean)
          .join(", ");
        return (
          <article
            key={i}
            role="tab"
            aria-selected={isActive}
            onClick={() => onActivate(i)}
            className={clsx(
              "group relative cursor-pointer overflow-hidden rounded-[20px] border transition-[height,border-color,background-color] ease-[cubic-bezier(0.22,0.61,0.36,1)] duration-500",
              isActive
                ? isLight
                  ? "h-[280px] border-[#1A1A1A]/15 bg-[#1A1A1A]/[0.04]"
                  : "h-[280px] border-white/20 bg-white/[0.04]"
                : isLight
                  ? "h-[76px] border-[#1A1A1A]/10 bg-[#1A1A1A]/[0.02]"
                  : "h-[76px] border-white/10 bg-white/[0.02]",
            )}
          >
            <div className="flex h-full flex-col p-5">
              <div className="flex items-center gap-3">
                <Avatar quote={quote} size={36} isLight={isLight} />
                <div className="min-w-0">
                  {quote.name && (
                    <div className={`truncate text-[13px] ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>
                      {quote.name}
                    </div>
                  )}
                  {quote.title && (
                    <div className={`mono truncate text-[11px] ${isLight ? "text-[#1A1A1A]/55" : "text-white/55"}`}>
                      {quote.title}
                    </div>
                  )}
                </div>
              </div>

              {/* Active-only — quote + attribution, fades in after expand */}
              <div
                aria-hidden={!isActive}
                className="mt-5 flex flex-1 flex-col justify-between overflow-hidden"
                style={{
                  opacity: isActive ? 1 : 0,
                  transition: `opacity 350ms ${EASE} ${
                    isActive ? "160ms" : "0ms"
                  }`,
                }}
              >
                <blockquote className={`text-[1rem] leading-[1.55] ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>
                  “{quote.body}”
                </blockquote>
                {attribution && (
                  <div className={`mono mt-4 text-[12px] leading-[1.4] ${isLight ? "text-[#1A1A1A]/55" : "text-white/55"}`}>
                    {attribution}
                  </div>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function Testimonials({ eyebrow, heading, subheading, quotes = [], theme = "dark" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isLight = theme === "light";

  return (
    <section className="gradient-divider py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-12 max-w-2xl">
          {eyebrow && (
            <span className={`mono mb-4 block text-xs uppercase tracking-[0.08em] ${isLight ? "text-[#1A1A1A]/45" : "text-white/40"}`}>
              {eyebrow}
            </span>
          )}
          {heading && (
            <h3 className={`mb-4 text-[1.75rem] font-normal leading-[1.05] tracking-[-0.025em] [text-wrap:balance] md:text-[2.375rem] md:tracking-[-0.03em] ${isLight ? "text-[#1A1A1A]" : "text-white"}`}>
              {heading}
            </h3>
          )}
          {subheading && (
            <p className={`text-[1rem] leading-[1.6] ${isLight ? "text-[#1A1A1A]/60" : "text-white/55"}`}>
              {subheading}
            </p>
          )}
        </div>

        <HorizontalAccordion
          quotes={quotes}
          activeIndex={activeIndex}
          onActivate={setActiveIndex}
          isLight={isLight}
        />
        <VerticalAccordion
          quotes={quotes}
          activeIndex={activeIndex}
          onActivate={setActiveIndex}
          isLight={isLight}
        />
      </div>
    </section>
  );
}
