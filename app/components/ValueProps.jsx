"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { PromptCardVisual } from "./visuals/PromptCardVisual";
import { StudioAppCardVisual } from "./visuals/StudioAppCardVisual";
import { InfrastructureCardVisual } from "./visuals/InfrastructureCardVisual";
import { ThreeStepsVisual } from "./visuals/ThreeStepsVisual";

// Map content `visualKey` values to their concrete visual components so
// the content file can stay plain data (no JSX).
const VISUALS = {
  promptCard: PromptCardVisual,
  studioApp: StudioAppCardVisual,
  infrastructure: InfrastructureCardVisual,
  threeSteps: ThreeStepsVisual,
};

function renderVisual(key) {
  if (!key) return undefined;
  const Component = VISUALS[key];
  return Component ? <Component /> : undefined;
}

const sectionId = (i) => `value-prop-${i}`;

// Left-column sticky menu. Passive — observes which panel is in view
// and highlights the active label. Clicking scrolls to the target via
// native smooth-scroll (no scroll hijacking).
//
// The menu lives inside the section's grid column so it naturally pins
// while scrolling through the value-props block and releases as soon
// as we scroll past. Sticky is used (not fixed) because GradientReveal
// wraps the page in a transformed ancestor, which would break `fixed`.
//
// Visual language borrows from analog tuner/scale UIs: a column of
// tick marks on the left, each row with a mono step number and sans
// label. A lime pill slides vertically to mark the active step,
// matching the brand accent (rgb(217,237,146)). Tick length grows
// when the row is active/hovered so the scale "breathes" as the user
// moves through it.
// Checklist-style side menu inspired by onboarding/progress UIs.
// Monochrome only — no colored accents — so it sits in the same
// dark/white palette as the rest of the page (ComparisonTable,
// Benefits white card, etc.).
//
// - Header row: a small progress bar + "N/total" readout in mono
// - Each row: a status glyph (filled circle for done, hollow ring
//   for current/upcoming) + the step label
// - Current row highlights with a subtle bg tint + medium weight
function CheckIcon({ className }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path
        d="M4 8.5l2.5 2.5L12 5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatusGlyph({ state }) {
  // done = filled white circle + dark check
  // current = solid ring, thicker stroke
  // upcoming = thin ring, low opacity
  if (state === "done") {
    return (
      <span className="flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full bg-white text-[#101010]">
        <CheckIcon className="h-3 w-3" />
      </span>
    );
  }
  const stroke =
    state === "current" ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.25)";
  const strokeWidth = state === "current" ? 1.6 : 1.2;
  return (
    <svg
      viewBox="0 0 18 18"
      className="h-[18px] w-[18px] flex-none"
      aria-hidden="true"
    >
      <circle
        cx="9"
        cy="9"
        r="7.5"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

function SideMenu({ items, activeIndex, allCompleted, visible, onSelect }) {
  const total = items.length;
  // When the user has scrolled past the last section, treat the whole
  // list as completed: progress hits 100% and the last row gets a
  // check mark.
  const current = allCompleted ? total : activeIndex + 1;
  const progressPct = (current / total) * 100;
  return (
    <aside
      aria-label="Value props"
      aria-hidden={!visible}
      className={clsx(
        "hidden pt-20 transition-opacity duration-300 md:col-start-1 md:row-start-1 md:block md:pt-24",
        visible
          ? "opacity-100"
          : "pointer-events-none opacity-0",
      )}
    >
      <div className="sticky top-24">
        <div className="w-full">
          {/* Header — slim progress bar + mono counter */}
          <div className="mb-4 flex items-center justify-between gap-3 px-2">
            <span className="text-[12px] font-medium text-white/80">
              Overview
            </span>
            <div className="flex items-center gap-2">
              <div className="relative h-[3px] w-14 overflow-hidden rounded-full bg-white/10">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-white transition-[width] duration-500 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="mono text-[10px] tracking-[0.08em] text-white/50">
                {current}/{total}
              </span>
            </div>
          </div>

          {/* Items */}
          <ul className="flex flex-col gap-0.5">
            {items.map((item, i) => {
              const isLast = i === items.length - 1;
              // The last row flips to done once the user has scrolled
              // past the end of the value-props block.
              const isDone =
                i < activeIndex || (isLast && allCompleted);
              const isActive = i === activeIndex && !isDone;
              const state = isDone
                ? "done"
                : isActive
                  ? "current"
                  : "upcoming";
              const label =
                item.menuLabel ?? item.eyebrow ?? `Step ${i + 1}`;
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => onSelect(i)}
                    aria-current={isActive ? "true" : undefined}
                    className={clsx(
                      "flex w-full items-center gap-3 rounded-[10px] px-2 py-2 text-left transition-colors duration-200",
                      isActive
                        ? "bg-white/[0.06]"
                        : "hover:bg-white/[0.03]",
                    )}
                  >
                    <StatusGlyph state={state} />
                    <span
                      className={clsx(
                        "whitespace-nowrap text-[13px] transition-colors",
                        isActive
                          ? "text-white"
                          : isDone
                            ? "text-white/55"
                            : "text-white/40 hover:text-white/75",
                      )}
                    >
                      {label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}

// Single-column panel — matches the old ValuePropsStory rendering:
// eyebrow, heading, body, then a wide visual below. Consistent per
// item so the rhythm doesn't break between panels.
function ValuePropPanel({ id, item, visual, sectionRef, index }) {
  return (
    <section
      id={id}
      ref={sectionRef}
      data-section-index={index}
      className="py-20 md:py-24"
    >
      <div className="flex flex-col gap-10">
        <div className="max-w-3xl">
          {item.eyebrow && (
            <span className="mono mb-4 block text-[11px] uppercase tracking-[0.08em] text-white/40">
              {item.eyebrow}
            </span>
          )}
          <h3 className="mb-5 text-[1.75rem] font-normal leading-[1.05] tracking-[-0.025em] text-white [text-wrap:balance] md:text-[2.375rem] md:tracking-[-0.03em]">
            {item.heading}
          </h3>
          <p className="text-[1rem] leading-[1.6] text-white/55 md:text-[1.0625rem]">
            {item.body}
          </p>
        </div>
        {visual && <div className="w-full max-w-[52rem]">{visual}</div>}
      </div>
    </section>
  );
}

export function ValueProps({ items = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  // True once the user has scrolled past the bottom of the last
  // section. Lets us flip the final checklist row to "done" (check
  // mark) at the end of the block, since the usual "i < activeIndex"
  // check can never mark the last item as done on its own.
  const [allCompleted, setAllCompleted] = useState(false);
  const sectionRefs = useRef([]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const idx = Number(visible.target.dataset.sectionIndex);
        if (!Number.isNaN(idx)) setActiveIndex(idx);
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [items.length]);

  // Watch the last section: flip `allCompleted` when user has read
  // through it (for the final check mark), and hide the menu once
  // the section has scrolled fully above the viewport so it doesn't
  // linger into the Comparison section.
  const [menuVisible, setMenuVisible] = useState(true);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const last = sectionRefs.current[items.length - 1];
    if (!last) return;
    const check = () => {
      const rect = last.getBoundingClientRect();
      setAllCompleted(rect.bottom < window.innerHeight * 0.35);
      // Menu stays visible while the last section's bottom is still
      // below the upper third of the viewport — user is reading the
      // body copy. Once the bottom rises past that line (most of the
      // section has scrolled off the top), hide the menu so it
      // doesn't linger into the next section.
      setMenuVisible(rect.bottom > window.innerHeight * 0.85);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [items.length]);

  const handleSelect = (i) => {
    const el = document.getElementById(sectionId(i));
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 md:grid md:grid-cols-[180px_1fr] md:gap-16">
      <SideMenu
        items={items}
        activeIndex={activeIndex}
        allCompleted={allCompleted}
        visible={menuVisible}
        onSelect={handleSelect}
      />

      <div className="md:col-start-2 md:row-start-1">
        {items.map((item, i) => {
          const visual = item.visual ?? renderVisual(item.visualKey);
          return (
            <ValuePropPanel
              key={i}
              id={sectionId(i)}
              index={i}
              sectionRef={(el) => (sectionRefs.current[i] = el)}
              item={item}
              visual={visual}
            />
          );
        })}
      </div>
    </div>
  );
}
