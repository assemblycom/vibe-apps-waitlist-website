"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { PromptCardVisual } from "./visuals/PromptCardVisual";
import { StudioAppCardVisual } from "./visuals/StudioAppCardVisual";
import { InfrastructureCardVisual } from "./visuals/InfrastructureCardVisual";
import { ThreeStepsVisual } from "./visuals/ThreeStepsVisual";
import { ClientPortalVisual } from "./visuals/ClientPortalVisual";

// Map content `visualKey` values to their concrete visual components so
// the content file can stay plain data (no JSX).
const VISUALS = {
  promptCard: PromptCardVisual,
  studioApp: StudioAppCardVisual,
  infrastructure: InfrastructureCardVisual,
  threeSteps: ThreeStepsVisual,
  clientPortal: ClientPortalVisual,
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
      <div className="sticky top-[88px]">
        <div className="w-full">
          {/* Items — text-only menu, selected row carries a soft pill
              background. No header, no checkmarks, no counter. */}
          <ul className="flex flex-col gap-0.5">
            {items.map((item, i) => {
              const isLast = i === items.length - 1;
              const isDone = i < activeIndex || (isLast && allCompleted);
              const isActive = i === activeIndex && !isDone;
              const label =
                item.menuLabel ?? item.eyebrow ?? `Step ${i + 1}`;
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => onSelect(i)}
                    aria-current={isActive ? "true" : undefined}
                    className={clsx(
                      "flex w-full items-center rounded-[10px] px-3 py-2 text-left transition-colors duration-200",
                      isActive
                        ? "bg-white/[0.06]"
                        : "hover:bg-white/[0.03]",
                    )}
                  >
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

// Mobile counterpart to SideMenu — a horizontal tab strip pinned to the
// BOTTOM of the viewport (like a native bottom tab bar). Only visible
// while the value-props section is in view; fades out when the section
// scrolls past. Rendered through a portal to escape any transformed
// ancestor (GradientReveal) so `position: fixed` actually anchors to
// the viewport.
function MobileNav({ items, activeIndex, visible, onSelect }) {
  const buttonRefs = useRef([]);
  const scrollerRef = useRef(null);
  const [portalTarget, setPortalTarget] = useState(null);

  useEffect(() => {
    if (typeof document !== "undefined") setPortalTarget(document.body);
  }, []);

  // Keep the active tab visible: scroll the horizontal tab strip itself
  // (not the button via scrollIntoView, which can also nudge ancestor
  // scrolls and clash with a page-level smooth-scroll already in flight).
  // No-op when the active button already fits in the visible band.
  useEffect(() => {
    const scroller = scrollerRef.current;
    const btn = buttonRefs.current[activeIndex];
    if (!scroller || !btn) return;
    const sRect = scroller.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    const fullyVisible =
      bRect.left >= sRect.left && bRect.right <= sRect.right;
    if (fullyVisible) return;
    const target =
      btn.offsetLeft - scroller.clientWidth / 2 + btn.offsetWidth / 2;
    scroller.scrollTo({ left: target, behavior: "smooth" });
  }, [activeIndex]);

  if (!portalTarget) return null;
  return createPortal(
    <div
      className={clsx(
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.06] bg-[#101010] pb-[max(env(safe-area-inset-bottom),0.5rem)] shadow-[0_-8px_16px_-8px_rgba(0,0,0,0.5)] transition-opacity duration-300 md:hidden",
        visible ? "opacity-100" : "opacity-0",
      )}
      aria-hidden={!visible}
    >
      <div
        ref={scrollerRef}
        className={clsx(
          "no-scrollbar flex gap-1 overflow-x-auto px-4 pt-2",
          visible ? "pointer-events-auto" : "",
        )}
        role="tablist"
        aria-label="Value props"
      >
        {items.map((item, i) => {
          const isActive = i === activeIndex;
          const label = item.menuLabel ?? item.eyebrow ?? `Step ${i + 1}`;
          return (
            <button
              key={i}
              ref={(el) => (buttonRefs.current[i] = el)}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(i)}
              className={clsx(
                "whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] transition-colors",
                isActive
                  ? "bg-white/[0.10] text-white"
                  : "text-white/55 hover:text-white/80",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>,
    portalTarget,
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
      // scroll-mt clears the fixed Header pill (top:12 + pill height
      // ~56px) plus breathing room when a tab tap scroll-to-section
      // parks here. Without it the heading lands inside the dead zone
      // behind the pill on mobile where py-12 alone isn't enough.
      className="scroll-mt-24 py-12 md:scroll-mt-28 md:py-24"
    >
      <div className="flex flex-col gap-10">
        <div className="max-w-3xl">
          {item.eyebrow && (
            <span className="mono mb-4 block text-xs uppercase tracking-[0.08em] text-white/40">
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
  // Set on tab tap. While the programmatic page scroll is in flight,
  // sections pass through the IntersectionObserver "active band" and
  // would otherwise flip activeIndex through every intermediate index
  // — which made the highlighted pill hop 0→1→2 mid-scroll and read as
  // jitter. We lock activeIndex to the target until the scroll settles.
  const lockedTargetRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (lockedTargetRef.current != null) return;
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
  // through it (for the final check mark), and hide the desktop side
  // menu once the section has scrolled fully above the viewport so it
  // doesn't linger into the Comparison section. The mobile nav uses a
  // separate `mobileNavVisible` flag that's true only while the
  // value-props block is actively in view (entry-through-exit). We use
  // requestAnimationFrame polling because Lenis smooth-scrolls via
  // transform — native `scroll` events don't always fire on every
  // frame, which made the threshold-based hide feel sticky.
  const [menuVisible, setMenuVisible] = useState(true);
  const [mobileNavVisible, setMobileNavVisible] = useState(false);
  // Track visibility of each section via IntersectionObserver.
  // `firstInView` = first value-prop's top has entered viewport.
  // `lastFullyAbove` = last value-prop's bottom has risen above the
  // bottom 5% of viewport (i.e., next section is starting to show).
  const [firstInView, setFirstInView] = useState(false);
  const [lastFullyAbove, setLastFullyAbove] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.IntersectionObserver) return;
    const first = sectionRefs.current[0];
    const last = sectionRefs.current[items.length - 1];
    if (!first || !last) return;
    // First section: trigger when its top crosses the bottom 15% of
    // viewport on the way up.
    const obsFirst = new IntersectionObserver(
      ([e]) => setFirstInView(e.boundingClientRect.top < window.innerHeight * 0.85),
      { threshold: [0, 0.01], rootMargin: "0px 0px -15% 0px" },
    );
    // Last section: track when its bottom crosses thresholds for
    // allCompleted, menu hide, and mobile nav hide.
    const obsLast = new IntersectionObserver(
      ([e]) => {
        const vh = window.innerHeight;
        const bottom = e.boundingClientRect.bottom;
        setAllCompleted(bottom < vh * 0.35);
        setMenuVisible(bottom > vh * 0.85);
        setLastFullyAbove(bottom <= vh * 0.95);
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
    );
    obsFirst.observe(first);
    obsLast.observe(last);
    return () => {
      obsFirst.disconnect();
      obsLast.disconnect();
    };
  }, [items.length]);

  // Mobile nav visible while in the value-props block: first section's
  // top has entered viewport AND the last section's bottom hasn't yet
  // risen above the bottom of viewport.
  useEffect(() => {
    setMobileNavVisible(firstInView && !lastFullyAbove);
  }, [firstInView, lastFullyAbove]);

  const handleSelect = (i) => {
    const el = document.getElementById(sectionId(i));
    if (!el) return;
    // Lock the highlight to the tapped target so the pill doesn't hop
    // through intermediate sections as they cross the IO active band.
    // The lock releases once scrolling has been idle for ~150ms — long
    // enough for native smooth-scroll to settle, short enough that
    // user-driven scroll after the tap reclaims the highlight.
    lockedTargetRef.current = i;
    setActiveIndex(i);
    let idle;
    const onScroll = () => {
      clearTimeout(idle);
      idle = setTimeout(() => {
        window.removeEventListener("scroll", onScroll);
        lockedTargetRef.current = null;
      }, 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // Safety unlock in case the scroll never fires (e.g. target already
    // in view) so the IO can resume driving activeIndex.
    setTimeout(() => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(idle);
      lockedTargetRef.current = null;
    }, 1200);
    // Offset parks the section below the fixed Header pill
    // (top:12 + ~56 height + breathing room). Lenis owns the scroll
    // wrapper so native scrollIntoView doesn't actually move the page
    // and CSS scroll-margin-top isn't honored — we drive Lenis directly
    // and pass the offset explicitly. Native fallback keeps the CSS
    // scroll-margin-top route working when Lenis isn't running
    // (reduced motion).
    const offset = -96;
    if (window.__lenis) {
      window.__lenis.scrollTo(el, { offset });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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

      <MobileNav
        items={items}
        activeIndex={activeIndex}
        visible={mobileNavVisible}
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
