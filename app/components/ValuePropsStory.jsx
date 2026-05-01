"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { PromptCardVisual } from "./visuals/PromptCardVisual";
import { StudioAppCardVisual } from "./visuals/StudioAppCardVisual";
import { InfrastructureCardVisual } from "./visuals/InfrastructureCardVisual";
import { ThreeStepsVisual } from "./visuals/ThreeStepsVisual";
import { ClientPortalVisual } from "./visuals/ClientPortalVisual";

const VISUALS = {
  promptCard: PromptCardVisual,
  studioApp: StudioAppCardVisual,
  infrastructure: InfrastructureCardVisual,
  threeSteps: ThreeStepsVisual,
  clientPortal: ClientPortalVisual,
};

// Short menu labels — falls back to eyebrow if not provided.
function menuLabel(item) {
  return item.menuLabel ?? item.eyebrow ?? "";
}

function Visual({ item }) {
  const Component = VISUALS[item.visualKey];
  if (!Component) return null;
  return <Component />;
}

export function ValuePropsStory({ items = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const markersRef = useRef([]);
  const menuScrollerRef = useRef(null);
  // While a click-driven smooth scroll is in flight, ignore IO updates so
  // they don't overwrite the index the user just picked. Without this, the
  // source marker (still highly intersecting at t=0) wins the IO race and
  // reverts activeIndex — the first click appears to "do nothing".
  const programmaticScrollRef = useRef(false);
  const programmaticScrollTimeoutRef = useRef(null);

  // Scroll-driven progression — invisible markers underneath the sticky
  // content area. When the marker for step N crosses the middle of the
  // viewport, step N becomes active. No scroll hijacking; user scrolls
  // normally through the section.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.IntersectionObserver) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Don't fight a click-driven scroll in progress.
        if (programmaticScrollRef.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const idx = Number(visible.target.dataset.stepIndex);
        if (!Number.isNaN(idx)) setActiveIndex(idx);
      },
      {
        // Treat a marker as "active" when it's near the vertical center
        // of the viewport. A wider center band (20% of viewport) reduces
        // jittery flip-flops when scrolling through the boundary between
        // two markers — the handoff happens once, not oscillating.
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    markersRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [items.length]);

  // Keep the active menu item in view on the mobile horizontal tab strip.
  useEffect(() => {
    const scroller = menuScrollerRef.current;
    if (!scroller) return;
    const activeBtn = scroller.querySelector(`[data-step="${activeIndex}"]`);
    if (!activeBtn) return;
    const scrollerRect = scroller.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    if (btnRect.left < scrollerRect.left || btnRect.right > scrollerRect.right) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeIndex]);

  // Clear the programmatic-scroll lock timer on unmount so we don't touch
  // state after the component is gone.
  useEffect(() => {
    return () => {
      if (programmaticScrollTimeoutRef.current) {
        clearTimeout(programmaticScrollTimeoutRef.current);
      }
    };
  }, []);

  const handleSelect = (index) => {
    setActiveIndex(index);
    // Smooth-scroll to the corresponding marker so scroll state stays in
    // sync with the click. Works on desktop and mobile.
    const marker = markersRef.current[index];
    if (!marker) return;
    // Offset so the marker lands near the viewport center (matches the
    // IntersectionObserver rootMargin).
    const rect = marker.getBoundingClientRect();
    const target = window.scrollY + rect.top - window.innerHeight * 0.45;

    // Lock the IO handler until the smooth scroll finishes. 900ms covers
    // typical browser smooth-scroll durations; a longer-than-actual lock is
    // fine because we unlock on scrollend too.
    programmaticScrollRef.current = true;
    if (programmaticScrollTimeoutRef.current) {
      clearTimeout(programmaticScrollTimeoutRef.current);
    }
    programmaticScrollTimeoutRef.current = setTimeout(() => {
      programmaticScrollRef.current = false;
    }, 900);

    window.scrollTo({ top: target, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <section className="relative">
      {/* Sticky viewport — holds the menu, copy, and visual as the user
          scrolls through the taller outer section. */}
      <div className="sticky top-0 flex min-h-screen items-center py-20 md:py-24">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="grid items-start gap-10 md:grid-cols-[180px_1fr] md:gap-16">
            {/* Menu — vertical on desktop, horizontal tab strip on mobile */}
            <nav
              ref={menuScrollerRef}
              aria-label="Value props"
              className="-mx-6 flex shrink-0 snap-x snap-mandatory gap-2 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:flex-col md:gap-1 md:overflow-visible md:px-0 md:self-center"
            >
              {items.map((item, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={i}
                    type="button"
                    data-step={i}
                    onClick={() => handleSelect(i)}
                    aria-current={isActive ? "step" : undefined}
                    className={clsx(
                      "flex-none snap-start whitespace-nowrap rounded-full border border-white/10 px-4 py-2 text-left text-[13px] transition-all duration-300 md:whitespace-normal md:rounded-none md:border-0 md:border-l md:px-4 md:py-3",
                      isActive
                        ? "border-white/40 bg-white/5 text-white md:border-white md:bg-transparent"
                        : "text-white/40 hover:border-white/20 hover:text-white/70 md:border-white/10",
                    )}
                  >
                    {menuLabel(item)}
                  </button>
                );
              })}
            </nav>

            {/* Content area — grid-stack so all panels share one cell and
                the tallest panel defines the height. Inactive panels fade
                out but keep their grid position (no layout shift). */}
            <div className="relative">
              <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
                {items.map((item, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <article
                      key={i}
                      aria-hidden={!isActive}
                      // `transition-[opacity,transform]` (not `transition-all`)
                      // keeps the browser from trying to animate layout
                      // properties — huge smoothness win. `will-change` hints
                      // the compositor to give the panel its own GPU layer so
                      // the crossfade doesn't jitter with scroll updates.
                      className={clsx(
                        // Instant swap — no fade. Inactive panels are fully
                        // hidden (no partial opacity) so there's nothing to
                        // "disappear then appear". The active panel simply
                        // is, the others simply aren't.
                        "flex flex-col gap-10",
                        isActive
                          ? "visible opacity-100"
                          : "pointer-events-none invisible opacity-0",
                      )}
                    >
                      <div className="max-w-3xl">
                        {item.eyebrow && (
                          <span className="mono mb-4 block text-xs uppercase tracking-[0.08em] text-white/40">
                            {item.eyebrow}
                          </span>
                        )}
                        <h3 className="mb-5 text-2xl font-semibold leading-tight tracking-[-0.02em] text-white [text-wrap:balance] md:text-[2rem]">
                          {item.heading}
                        </h3>
                        <p className="text-base leading-[1.65] text-white/70 md:text-[1.05rem]">
                          {item.body}
                        </p>
                      </div>
                      {/* Cap the visual's rendered size so its aspect-[5/4]
                          doesn't force it to eat half the viewport. All
                          visuals stay mounted (no jumping grid row heights
                          when the active panel changes) — the inactive ones
                          are opacity:0 via the article wrapper. */}
                      <div className="w-full max-w-3xl">
                        <Visual item={item} />
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll markers — invisible divs spaced so the full section is
          roughly `items.length * 80vh` tall. The section's overall height
          equals the markers' cumulative height (the sticky child doesn't
          contribute). Each marker drives one step via IntersectionObserver. */}
      <div aria-hidden="true">
        {items.map((_, i) => (
          <div
            key={i}
            ref={(el) => (markersRef.current[i] = el)}
            data-step-index={i}
            className="h-[80vh]"
          />
        ))}
      </div>
    </section>
  );
}
