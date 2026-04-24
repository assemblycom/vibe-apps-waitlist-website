"use client";

import { useEffect, useRef, useState } from "react";
import {
  InlinePreview,
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

// Map of preview keys → rendered preview payloads. Content files
// reference visuals by key (e.g. `visual: "portalMini"`) so home.js
// stays as plain data and the visuals live next to the component.
// Parameterized visuals accept a `visualProps` object from the payload.
const PREVIEW_VISUALS = {
  portalMini: () => <PortalMiniPreview />,
  appMock: (props) => <AppMockPreview {...(props || {})} />,
  qualityBadge: (props) => <QualityBadgePreview {...(props || {})} />,
  contacts: () => <ContactsPreview />,
  permissions: () => <PermissionsPreview />,
  notifications: () => <NotificationsPreview />,
  library: () => <LibraryPreview />,
};

function resolvePreview(preview) {
  if (!preview) return null;
  const { visual, visualProps, ...rest } = preview;
  let resolvedVisual = visual;
  if (typeof visual === "string") {
    const factory = PREVIEW_VISUALS[visual];
    resolvedVisual = factory ? factory(visualProps) : null;
  }
  return { ...rest, visual: resolvedVisual };
}

// A paragraph body can be a plain string (legacy) or an array of
// segments: strings are rendered as-is, `{ u: "text" }` objects render
// as underlined emphasis. Underline sits just below the baseline and
// inherits the muted body color, so emphasized phrases read as an
// editorial callout rather than a link. Segments can optionally include
// a `preview` payload — when present, the phrase becomes an InlinePreview
// that reveals a floating card on hover.
function renderParagraph(p) {
  if (typeof p === "string") return p;
  if (!Array.isArray(p)) return p;
  return p.map((seg, i) => {
    if (typeof seg === "string") return seg;
    if (seg && typeof seg === "object" && "u" in seg) {
      if (seg.preview) {
        return (
          <InlinePreview
            key={i}
            text={seg.u}
            preview={resolvePreview(seg.preview)}
          />
        );
      }
      return (
        <span
          key={i}
          className="underline decoration-[#1A1A1A]/40 underline-offset-[3px]"
        >
          {seg.u}
        </span>
      );
    }
    return null;
  });
}

// V7-style editorial moment: a left-aligned display headline where the
// last phrase fades into a quieter "coda", followed by a two-column
// body block underneath. Staged reveal keeps the motion minimal — the
// headline words cascade in one by one, then the body settles in after
// the last word lands.
export function NarrativeBlock({ heading, callout, body }) {
  const paragraphs = Array.isArray(body) ? body : [body];
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
          // Two rAFs so the browser has definitely painted the initial
          // opacity:0 / translateY state before we flip to visible. Without
          // this, React can batch the initial render and the setState so
          // closely that the transition never has a "from" state to
          // animate from, and the cascade looks instantaneous.
          requestAnimationFrame(() => {
            requestAnimationFrame(() => setVisible(true));
          });
          observer.disconnect();
        }
      },
      // Fire as soon as any portion of the section enters the viewport.
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
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

  // The heading fades in as a single block (quiet, editorial tone) and
  // the body follows a beat later. No per-word cascade — that read as
  // too playful for this section.
  const HEADING_DURATION_MS = 800;
  const bodyDelayMs = 260;

  return (
    // NarrativeBlock closes the off-white chapter and hands off to the
    // dark storytelling sections below. No gradient fade at the seam —
    // the light section ends on its own color with generous bottom
    // padding, and the dark chapter-opener that follows (in page.js)
    // introduces its eyebrow early so the dark section declares itself
    // by content cadence rather than color blending.
    <section
      ref={ref}
      data-nav-theme="light"
      className="relative bg-[#F5F5F0] pt-20 pb-32 md:pt-24 md:pb-40"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Display-scale headline — the optional `callout` renders inline
            at reduced opacity, echoing the V7 pattern of a bold statement
            followed by a quieter restatement. The whole line fades in as
            one block rather than cascading word-by-word. */}
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
        {/* Two-column body below the headline, offset to the right so the
            columns sit under the dimmed callout rather than spanning the
            full heading width. Paragraphs flow across columns via CSS
            columns — `break-inside-avoid` keeps each paragraph intact. */}
        <div
          className="mx-auto max-w-[640px] text-left"
          style={stageStyle(bodyDelayMs)}
        >
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="mb-5 text-[1rem] leading-[1.6] text-[#1A1A1A]/55 last:mb-0"
            >
              {renderParagraph(p)}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
