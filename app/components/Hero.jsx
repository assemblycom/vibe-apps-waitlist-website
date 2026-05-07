"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { EmailCTA } from "./EmailCTA";
import { HeroPromptToApp } from "./HeroPromptToApp";
import { HeroPromptToAppV1 } from "./HeroPromptToAppV1";
import { HeroPromptToAppV3 } from "./HeroPromptToAppV3";
import { HeroPromptToAppV4 } from "./HeroPromptToAppV4";
import { HeroPromptToAppV5 } from "./HeroPromptToAppV5";
import { HeroPromptToAppV7 } from "./HeroPromptToAppV7";
import { HeroPromptToAppV8 } from "./HeroPromptToAppV8";
import { HeroPromptToAppV9 } from "./HeroPromptToAppV9";
import { HeroPromptToAppV10 } from "./HeroPromptToAppV10";
import { LogoStrip } from "./LogoStrip";

const VERSIONS = ["v1", "v2", "v3", "v4", "v5", "v7", "v8", "v9", "v10"];
const isVersion = (v) => VERSIONS.includes(v);

const STORAGE_KEY = "hero-version";

export function Hero({
  eyebrow,
  heading,
  subheading,
  alphaLabel,
  alphaLogos,
}) {
  const [version, setVersion] = useState("v2");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("hero");
    const fromStorage = window.localStorage.getItem(STORAGE_KEY);
    const initial = isVersion(fromUrl) ? fromUrl : fromStorage;
    if (isVersion(initial)) setVersion(initial);
  }, []);

  // ZoomHero scales the hero card down with `origin-top`, exposing
  // ~10% of off-white BACKDROP at the bottom as the user scrolls.
  // For v9 the hero itself is already a light chapter, so that
  // off-white strip should also count as light for the nav — without
  // it, the nav flips to dark theme over a clearly light surface.
  // Tag the ZoomHero outer (BACKDROP) wrapper accordingly.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const inner = document.querySelector(".origin-top");
    const outer = inner?.parentElement;
    if (!outer) return;
    if ((version === "v9" || version === "v10")) {
      outer.setAttribute("data-nav-theme", "light");
    } else {
      outer.removeAttribute("data-nav-theme");
    }
    return () => outer.removeAttribute("data-nav-theme");
  }, [version]);

  const choose = (v) => {
    setVersion(v);
    try {
      window.localStorage.setItem(STORAGE_KEY, v);
      const url = new URL(window.location.href);
      url.searchParams.set("hero", v);
      window.history.replaceState({}, "", url.toString());
    } catch {}
  };

  return (
    <div
      className={version === "v8" || (version === "v9" || version === "v10") ? "relative" : "contents"}
      {...((version === "v9" || version === "v10") ? { "data-nav-theme": "light" } : {})}
    >
      {version === "v9" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(180deg, #ffffff 0%, #f4f5fa 10%, rgb(170,180,215) 28%, rgb(195,215,180) 48%, rgb(217,237,146) 70%)",
          }}
        />
      )}
      {version === "v10" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            // v10 uses a softer, calmer gradient than v9 — wider
            // white runway at the top so the headline + composer have
            // room to breathe, and the lower band sits at a muted
            // off-cream rather than the lime accent. The whole hero
            // reads as one continuous quiet surface.
            background:
              "linear-gradient(180deg, #ffffff 0%, #f7f8fb 22%, #ecedf3 55%, #e7e9ee 100%)",
          }}
        />
      )}
{/* Section height:
          - mobile: content-driven (auto)
          - lg+ v7: content-driven so the whole hero card is visible
            without clipping. The page scrolls a little to reach the
            bottom of the card on shorter desktops, and the sticky
            logo strip below pins to the viewport while the hero is in
            view (un-sticks at the seam to the next section).
          - lg+ v1–v5: original 100vh-capped section with overflow-
            hidden, unchanged. */}
      <section
        className={`relative flex flex-col ${
          version === "v7" || version === "v8" || (version === "v9" || version === "v10")
            ? ""
            : "overflow-hidden lg:h-[min(100vh,1080px)]"
        }`}
      >
        <HeroVersionToggle version={version} onChange={choose} />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(40% 35% at 30% 35%, rgba(255,255,255,0.04) 0%, transparent 70%), radial-gradient(35% 30% at 75% 55%, rgba(217,237,146,0.04) 0%, transparent 75%)",
          }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 pt-32 text-center md:pt-36 lg:pt-40">
          <h1 className={`mb-6 max-w-[820px] text-[2.125rem] font-normal leading-[1.05] tracking-[-0.03em] [text-wrap:balance] md:text-[3.25rem] md:tracking-[-0.035em] ${
            (version === "v9" || version === "v10") ? "text-[#101010]" : "text-white"
          }`}>
            {heading}
          </h1>
          <p className={`mb-8 max-w-[620px] text-[1.0625rem] leading-[1.55] [text-wrap:pretty] ${
            (version === "v9" || version === "v10") ? "text-[#101010]/65" : "text-white/55"
          }`}>
            {subheading}
          </p>
          <EmailCTA theme={(version === "v9" || version === "v10") ? "light" : "dark"} />
        </div>

        {/* Visual wrapper. Hard bottom edge — no gradient bleed mask
            anymore (Notion-style). The card meets the dark logo band
            below it on a clean line, and that band carries the visual
            stop instead of a fade. On mobile the visual sits inline
            after the CTA; at lg+ mt-auto pushes it to the bottom of
            the 100vh section. */}
        <div
          className="relative z-10 w-full overflow-hidden px-4 pt-8 md:px-6 md:pt-12 lg:mt-auto lg:px-10 lg:pt-16"
        >
          {version === "v1" ? (
            <HeroPromptToAppV1 />
          ) : version === "v3" ? (
            <HeroPromptToAppV3 />
          ) : version === "v4" ? (
            <HeroPromptToAppV4 />
          ) : version === "v5" ? (
            <HeroPromptToAppV5 />
          ) : version === "v7" ? (
            <HeroPromptToAppV7 />
          ) : version === "v8" ? (
            <HeroPromptToAppV8 />
          ) : version === "v9" ? (
            <HeroPromptToAppV9 />
          ) : version === "v10" ? (
            <HeroPromptToAppV10 />
          ) : (
            <HeroPromptToApp />
          )}
        </div>


        {/* v7 only, lg+ only: sticky logo band that stays pinned to
            the viewport bottom while the user scrolls within the
            (taller) hero section. The hero card mounts above this
            band and extends behind it on initial load (the bottom
            slice is "closed off" by the logos), then scrolling moves
            the card up while the logos stay pinned — so the covered
            portion reveals into view. Once the section's natural
            bottom reaches the viewport bottom (~30vh of scroll), the
            logos un-stick and the page continues normally. */}
        {version === "v7" && alphaLogos && alphaLogos.length > 0 && (
          <div className="hidden lg:sticky lg:bottom-0 lg:z-20 lg:block lg:bg-[var(--color-bg)] lg:py-6">
            <div className="mx-auto w-full max-w-[620px] px-6">
              {alphaLabel && (
                <p
                  className={`mb-4 text-center text-[10px] uppercase tracking-[0.18em] ${
                  (version === "v9" || version === "v10") ? "text-[#101010]/55" : "text-white/45"
                }`}
                  style={{
                    fontFamily:
                      '"ABC Diatype Mono", ui-monospace, monospace',
                  }}
                >
                  {alphaLabel}
                </p>
              )}
              <LogoStrip logos={alphaLogos} variant="dark" />
            </div>
          </div>
        )}
      </section>

      {/* After-section logo band. For non-v7 versions and for mobile
          v7 (where the sticky pattern doesn't apply because the
          section is content-sized rather than 130vh), this is the
          normal fallback rendering. On v7 desktop it's hidden, since
          the sticky band inside the section above is the canonical
          version. */}
      {alphaLogos && alphaLogos.length > 0 && (
        <div
          className={`relative pb-10 pt-12 md:pb-12 md:pt-14 ${
            version === "v8" || (version === "v9" || version === "v10") ? "" : "bg-[var(--color-bg)]"
          } ${version === "v7" ? "lg:hidden" : ""}`}
        >
          <div className="mx-auto w-full max-w-[620px] px-6">
            {alphaLabel && (
              <p
                className={`mb-4 text-center text-[10px] uppercase tracking-[0.18em] ${
                  (version === "v9" || version === "v10") ? "text-[#101010]/55" : "text-white/45"
                }`}
                style={{
                  fontFamily:
                    '"ABC Diatype Mono", ui-monospace, monospace',
                }}
              >
                {alphaLabel}
              </p>
            )}
            <LogoStrip logos={alphaLogos} variant={(version === "v9" || version === "v10") ? "light-bare" : "dark"} />
          </div>
        </div>
      )}
    </div>
  );
}

function HeroVersionToggle({ version, onChange }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const ui = (
    <div
      className="flex items-center gap-1 rounded-full border border-white/15 bg-black/60 p-1 text-xs font-medium text-white/70 backdrop-blur-md"
      style={{ position: "fixed", top: 16, right: 16, zIndex: 2147483647 }}
    >
      {VERSIONS.map((v) => {
        const active = version === v;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={
              active
                ? "rounded-full bg-white px-3 py-1 text-black"
                : "rounded-full px-3 py-1 hover:text-white"
            }
          >
            {v}
          </button>
        );
      })}
    </div>
  );

  return createPortal(ui, document.body);
}
