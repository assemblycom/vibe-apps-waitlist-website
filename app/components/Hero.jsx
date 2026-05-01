"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { EmailCTA } from "./EmailCTA";
import { HeroPromptToApp } from "./HeroPromptToApp";
import { HeroPromptToAppV1 } from "./HeroPromptToAppV1";
import { HeroPromptToAppV3 } from "./HeroPromptToAppV3";
import { LogoStrip } from "./LogoStrip";

const VERSIONS = ["v1", "v2", "v3"];
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
    <section
      className="relative overflow-hidden flex flex-col"
      style={{
        height: "min(100vh, 1080px)",
      }}
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

      <div className="relative z-10 mt-auto w-full px-4 pt-12 pb-32 md:px-6 md:pt-16 md:pb-36 lg:px-10">
        {version === "v1" ? (
          <HeroPromptToAppV1 />
        ) : version === "v3" ? (
          <HeroPromptToAppV3 />
        ) : (
          <HeroPromptToApp />
        )}
      </div>

      {alphaLogos && alphaLogos.length > 0 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
          <div
            aria-hidden="true"
            className="h-20"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 60%, rgba(10,10,10,0) 100%)",
            }}
          />
          <div className="bg-[#0a0a0a]/95 pb-2 pt-4 md:pb-3">
            <div className="mx-auto w-full max-w-[620px] px-6">
              {alphaLabel && (
                <p
                  className="mb-3 text-center text-[10px] uppercase tracking-[0.18em] text-white/45"
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
        </div>
      )}
    </section>
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
