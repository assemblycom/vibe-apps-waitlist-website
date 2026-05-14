"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  InlineTrigger,
  DetailPanel,
  PortalMiniPreview,
  AppMockPreview,
  QualityBadgePreview,
  ContactsPreview,
  PermissionsPreview,
  NotificationsPreview,
  LibraryPreview,
} from "./InlinePreview";

// Subtle, unhurried ease — matches the rest of the site's motion curves.
const EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";

// Map of preview keys → rendered preview payloads. Content references
// visuals by string key (e.g. `visual: "portalMini"`) so home.js stays
// as plain data and the visuals live next to the component.
const PREVIEW_VISUALS = {
  portalMini: () => <PortalMiniPreview />,
  appMock: (props) => <AppMockPreview {...(props || {})} />,
  qualityBadge: (props) => <QualityBadgePreview {...(props || {})} />,
  contacts: () => <ContactsPreview />,
  permissions: () => <PermissionsPreview />,
  notifications: () => <NotificationsPreview />,
  library: () => <LibraryPreview />,
};

// Capitalize first letter of the trigger phrase to use as the panel
// title when the content payload doesn't supply one. Most existing
// previews don't carry a `title`, and the underlined phrase already
// reads as a clean editorial label ("Reliable", "Permissions", …).
function deriveTitle(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function resolvePreview(seg) {
  const preview = seg.preview;
  if (!preview) return null;
  const { visual, visualProps, title, side, ...rest } = preview;
  let resolvedVisual = visual;
  if (typeof visual === "string") {
    const factory = PREVIEW_VISUALS[visual];
    resolvedVisual = factory ? factory(visualProps) : null;
  }
  return {
    ...rest,
    side: side === "left" ? "left" : "right",
    title: title || deriveTitle(seg.u),
    visual: resolvedVisual,
  };
}

// Split a run of plain text into per-word spans so the mobile
// scroll-tied reveal can address each word individually. Whitespace
// returns as raw text nodes between spans so layout (line-breaking,
// kerning) is unaffected on desktop.
function wrapWords(text, keyPrefix) {
  return text.split(/(\s+)/).map((tok, i) => {
    if (tok === "") return null;
    if (/^\s+$/.test(tok)) return tok;
    return (
      <span key={`${keyPrefix}-${i}`} className="srt-word">
        {tok}
      </span>
    );
  });
}

// Render a paragraph supporting plain strings and segment arrays. A
// segment of `{ u: "text" }` renders as an underlined editorial
// emphasis; if it also carries a `preview` payload, it becomes an
// InlineTrigger that activates the side detail panel on hover/focus.
// Inline triggers / underlined phrases reveal as a single unit on
// mobile so their visual emphasis stays intact.
function renderParagraph(p, { activeKey, onActivate, onDeactivate }, pIdx) {
  if (typeof p === "string") return wrapWords(p, `p${pIdx}`);
  if (!Array.isArray(p)) return p;
  return p.map((seg, i) => {
    if (typeof seg === "string") return wrapWords(seg, `p${pIdx}s${i}`);
    if (seg && typeof seg === "object" && "u" in seg) {
      if (seg.preview) {
        const resolved = resolvePreview(seg);
        const key = `${seg.u}-${i}`;
        return (
          <span key={i} className="srt-word">
            <InlineTrigger
              text={seg.u}
              preview={{ ...resolved, _key: key }}
              isActive={activeKey === key}
              onActivate={(p) => onActivate(p, key)}
              onDeactivate={onDeactivate}
            />
          </span>
        );
      }
      return (
        <span
          key={i}
          className="srt-word underline decoration-[#1A1A1A]/40 underline-offset-[3px]"
        >
          {seg.u}
        </span>
      );
    }
    return null;
  });
}

// V7-style editorial moment rebuilt as a left-text / right-detail
// split. The headline anchors the section, the body unfolds in the
// left column, and the right column carries a single in-flow detail
// panel that updates as the reader hovers/focuses underlined phrases.
// Mobile/touch falls back to a single column with no panel — the
// underlines still emphasize the key phrases without forcing an
// interaction the device can't support.
export function NarrativeBlock({ heading, callout, body }) {
  const paragraphs = Array.isArray(body) ? body : [body];

  // Reveal animation (intersection-driven) — kept identical to the
  // previous implementation so this section still settles in the same
  // editorial cadence.
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    if (typeof window === "undefined" || !window.IntersectionObserver) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => setVisible(true));
          });
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Active panel state. The side margins start (and return to) empty
  // — the panel only renders while a phrase is hovered/focused. We
  // use a small close-delay so the hand-off between adjacent phrases
  // doesn't flash through an empty state mid-traverse.
  const [activeKey, setActiveKey] = useState(null);
  const [activePreview, setActivePreview] = useState(null);
  const closeTimerRef = useRef(null);

  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const onActivate = (preview, key) => {
    cancelClose();
    setActivePreview(preview);
    setActiveKey(key);
  };

  const onDeactivate = () => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setActivePreview(null);
      setActiveKey(null);
    }, 100);
  };

  useEffect(() => () => cancelClose(), []);

  // Mobile-only progressive reading reveal. Each word starts dimmed and
  // brightens to full opacity as it crosses the reader's eye line
  // (~62% of viewport height). Words above the eye line stay full so
  // re-reading isn't punished; words below stay dim until scrolled to.
  // Desktop is left untouched — the underline + side-panel treatment
  // already carries the section visually.
  const bodyRef = useRef(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Match the CSS gate exactly so the JS-driven opacities don't get
    // out of sync with the dim-default styles. `hover: none` +
    // `pointer: coarse` ensures a desktop browser narrowed to phone
    // width never activates the effect.
    const mql = window.matchMedia(
      "(max-width: 767px) and (hover: none) and (pointer: coarse)",
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let words = [];
    let centers = [];
    let scheduled = false;
    let rafId = 0;

    const reset = () => {
      words.forEach((w) => {
        w.style.opacity = "";
      });
    };

    const measure = () => {
      if (!bodyRef.current) return;
      words = Array.from(bodyRef.current.querySelectorAll(".srt-word"));
      const scrollY = window.scrollY || window.pageYOffset;
      centers = words.map((w) => {
        const r = w.getBoundingClientRect();
        return r.top + scrollY + r.height / 2;
      });
    };

    const update = () => {
      scheduled = false;
      const vh = window.innerHeight || 1;
      const scrollY = window.scrollY || window.pageYOffset;
      // Eye line sits a bit below center — feels like a natural read
      // position on a phone where the thumb anchors the lower half.
      const eyeY = scrollY + vh * 0.62;
      // Reveal band: words within this many px below the eye line are
      // partially brightened so the transition feels gradual, not a
      // hard cutoff. Smaller band = snappier reveal.
      const band = vh * 0.32;
      const DIM = 0.22;
      for (let i = 0; i < words.length; i++) {
        const dist = centers[i] - eyeY;
        let o;
        if (dist <= 0) o = 1;
        else if (dist >= band) o = DIM;
        else o = DIM + (1 - DIM) * (1 - dist / band);
        words[i].style.opacity = o.toFixed(3);
      }
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      rafId = requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      schedule();
    };

    let attached = false;
    const attach = () => {
      if (attached) return;
      attached = true;
      measure();
      update();
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", onResize);
    };
    const detach = () => {
      if (!attached) return;
      attached = false;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
      reset();
    };

    const apply = () => {
      if (mql.matches && !reduceMotion.matches) attach();
      else detach();
    };

    apply();
    // matchMedia.addEventListener exists in all modern browsers; the
    // legacy addListener fallback isn't worth carrying.
    mql.addEventListener?.("change", apply);
    reduceMotion.addEventListener?.("change", apply);

    return () => {
      mql.removeEventListener?.("change", apply);
      reduceMotion.removeEventListener?.("change", apply);
      detach();
    };
  }, []);

  const stageStyle = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(12px)",
    transition: [
      `opacity 800ms ${EASE} ${delay}ms`,
      `transform 800ms ${EASE} ${delay}ms`,
    ].join(", "),
    willChange: "opacity, transform",
  });

  const HEADING_DURATION_MS = 800;
  const bodyDelayMs = 260;

  return (
    <section
      ref={ref}
      data-nav-theme="light"
      className="relative bg-[#F5F5F0] pt-10 pb-24 md:pt-24 md:pb-40"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Headline — kept centered (original treatment) so the
            section opens as a display moment rather than a column
            header. The detail panel lives below it on the right; the
            asymmetry of a centered headline over a split body reads
            as editorial layered composition, not a misaligned grid. */}
        <h2
          className="mx-auto mb-12 max-w-[900px] text-center text-[2rem] font-normal leading-[1.05] tracking-[-0.025em] text-[#1A1A1A] [text-wrap:balance] md:mb-16 md:text-[2.875rem] md:tracking-[-0.03em]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
            transition: [
              `opacity ${HEADING_DURATION_MS}ms ${EASE}`,
              `transform ${HEADING_DURATION_MS}ms ${EASE}`,
            ].join(", "),
            willChange: "opacity, transform",
          }}
        >
          {heading}
          {callout && (
            <>
              <br />
              <span className="text-[#1A1A1A]/40">{callout}</span>
            </>
          )}
        </h2>

        {/* Editorial three-track layout. The body sits centered at its
            original 640px reading width, and the detail panel renders
            in BOTH side margins so the elaboration radiates outward
            from the prose. The two panels share the same content and
            update in sync — the mirroring (left aside is text-right,
            right aside is text-left) is the design: the eye reads it
            as a single annotation framing the paragraph rather than
            two separate notes.

            Below `md` the asides collapse and the body falls back to
            a single centered column. Touch devices have no hover, so
            no panel content is needed there — the underlines alone
            carry the editorial emphasis. */}
        {/* The split layout only kicks in at `xl` (1280px+) — below
            that the side margins are too narrow to hold readable
            detail copy without wrapping awkwardly, so we collapse to
            a single centered body column. InlineTrigger uses the
            matching media query to suppress hover handlers there, so
            the underline-only fallback stays inert. */}
        <div
          className="grid grid-cols-1 items-start gap-y-10 min-[1200px]:grid-cols-[minmax(0,1fr)_minmax(0,640px)_minmax(0,1fr)] min-[1200px]:gap-x-10 min-[1200px]:gap-y-0"
          style={stageStyle(bodyDelayMs)}
        >
          {/* Left margin — only renders the DetailPanel when the
              active phrase has been authored to live on the left. The
              outer aside stays in the grid so the centered body
              column doesn't shift sideways as the panel appears and
              disappears. */}
          <aside className="hidden min-[1200px]:block">
            <div className="sticky top-28">
              {activePreview && activePreview.side === "left" && (
                <DetailPanel
                  preview={activePreview}
                  eyebrow="What we mean"
                  side="left"
                />
              )}
            </div>
          </aside>

          <div ref={bodyRef} className="mx-auto w-full max-w-[640px]">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="mb-5 text-[1rem] leading-[1.6] text-[#1A1A1A]/55 last:mb-0"
              >
                {renderParagraph(
                  p,
                  { activeKey, onActivate, onDeactivate },
                  i,
                )}
              </p>
            ))}
          </div>

          {/* Right margin — same pattern, mirrored. */}
          <aside className="hidden min-[1200px]:block">
            <div className="sticky top-28">
              {activePreview && activePreview.side === "right" && (
                <DetailPanel
                  preview={activePreview}
                  eyebrow="What we mean"
                  side="right"
                />
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
