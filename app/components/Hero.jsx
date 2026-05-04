"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { EmailCTA } from "./EmailCTA";
import { HeroPromptToApp } from "./HeroPromptToApp";
import { HeroPromptToAppV1 } from "./HeroPromptToAppV1";
import { HeroPromptToAppV3 } from "./HeroPromptToAppV3";
import { HeroPromptToAppV4 } from "./HeroPromptToAppV4";
import { HeroPromptToAppV5 } from "./HeroPromptToAppV5";
import { HeroPromptToAppV6 } from "./HeroPromptToAppV6";
import { HeroPromptToAppV7 } from "./HeroPromptToAppV7";
import { LogoStrip } from "./LogoStrip";

const VERSIONS = ["v1", "v2", "v3", "v4", "v5", "v6", "v7"];
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
    <>
      {/* Section: fixed 100vh-ish height + bleed only at lg+. On
          mobile the section grows to its content so the hero visual
          sits inline right below the CTA instead of being pushed to
          the bottom of an empty viewport-tall band by mt-auto. */}
      <section
        className="relative overflow-hidden flex flex-col lg:h-[min(100vh,1080px)]"
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
          <h1 className="mb-6 max-w-[820px] text-[2.125rem] font-normal leading-[1.05] tracking-[-0.03em] text-white [text-wrap:balance] md:text-[3.25rem] md:tracking-[-0.035em]">
            {heading}
          </h1>
          <p className="mb-8 max-w-[620px] text-[1.0625rem] leading-[1.55] text-white/55 [text-wrap:pretty]">
            {subheading}
          </p>
          <EmailCTA />
        </div>

        {/* Visual wrapper. On mobile: no mt-auto (just sits inline
            after the CTA), no mask (the bottom-fade was tied to the
            bleed that only made sense in a 100vh section), tighter
            top padding. On lg+: the original bleed treatment. */}
        <div
          className="hero-visual-wrap relative z-10 w-full overflow-hidden px-4 pt-8 md:px-6 md:pt-12 lg:mt-auto lg:px-10 lg:pt-16"
        >
          {version === "v1" ? (
            <HeroPromptToAppV1 />
          ) : version === "v3" ? (
            <HeroPromptToAppV3 />
          ) : version === "v4" ? (
            <HeroPromptToAppV4 />
          ) : version === "v5" ? (
            <HeroPromptToAppV5 />
          ) : version === "v6" ? (
            <HeroPromptToAppV6 />
          ) : version === "v7" ? (
            <HeroPromptToAppV7 />
          ) : (
            <HeroPromptToApp />
          )}
        </div>
      </section>

      {alphaLogos && alphaLogos.length > 0 && (
        <div className="bg-[var(--color-bg)] pb-10 pt-12 md:pb-12 md:pt-14">
          <div className="mx-auto w-full max-w-[620px] px-6">
            {alphaLabel && (
              <p
                className="mb-4 text-center text-[10px] uppercase tracking-[0.18em] text-white/45"
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
    </>
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
