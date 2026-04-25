"use client";

import { useEffect, useState } from "react";

// HERO ASSEMBLY — single front card + receding back cards
//
// One primary card ("Your app") sits front-center and plays the
// product's core move: a short client brief types itself, then the
// foundation modules (CRM, Portal, Roles, Messaging, Payments)
// "attach" one at a time. Behind it, three progressively WIDER
// cards fan outward, each peeking from the top — pure visual depth
// that reads as "there's more stacked behind what you build".
//
// No interaction on the back cards: they're static composition, not
// a menu. The only live surface is the front card's typing + module
// attach loop, which auto-cycles briefs while the hero is on screen.
//
// Palette: dark glass over #101010, neutral borders, soft white
// surface gradients. No brand lime on the cards — the only accent
// lives inside the prompt bubble (cursor + attach dots), so the
// deck itself reads as a calm dark composition.

const FRONT_CARD = {
  id: "yourapp",
  label: "Your app",
};

// Back cards, nearest-to-front first. Each subsequent entry sits
// further back, wider, taller-peeking. Label is shown in the small
// tab strip that's the only visible part of each back card.
const BACK_CARDS = [
  { id: "crm", label: "CRM" },
  { id: "portal", label: "Client portal" },
  { id: "roles", label: "Roles & permissions" },
];

// Per-level geometry. Each back card is slightly NARROWER than the
// front (tucked behind it, not fanning outward) and peeks only from
// the top. Classic stacked-deck feel — the front card hides the
// sides and bottom of everything behind it, and only a thin top
// sliver of each back card shows above.
const INSET_PER_LEVEL = 18; // px narrower per side each level
const PEEK_PER_LEVEL = 14; // px of top edge visible per level

export function HeroAssembly() {
  return (
    <div className="relative mx-auto mt-16 w-full max-w-[860px] md:mt-24">
      {/* Halo — soft atmosphere behind the deck. Neutral warm tint,
          no brand-lime ring. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(55% 65% at 50% 55%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.025) 45%, transparent 80%)",
          filter: "blur(42px)",
          transform: "translateY(6%)",
        }}
      />

      <div className="relative flex flex-col items-center">
        {/* Back cards — rendered furthest-back first so DOM order
            matches paint order. Each uses absolute positioning
            anchored to the top of the deck, offset outward and
            upward so only its label strip shows. */}
        {BACK_CARDS.map((card, i) => {
          // i=0 is nearest to front, i=2 furthest back.
          // Furthest back = biggest outset + peek.
          const level = i + 1; // 1..3
          return (
            <BackCard
              key={card.id}
              card={card}
              level={level}
            />
          );
        })}

        {/* Front card — the only interactive surface. Full width
            of the inner column, clean neutral chrome, with the
            "Your app" typing + attach body. */}
        <FrontCard card={FRONT_CARD} />
      </div>
    </div>
  );
}

// ── BackCard ── a static layer sitting behind the front card.
// Absolutely positioned so it extends beyond the front card's
// horizontal edges and peeks upward above its top. Only a tab strip
// (label) is visible; the body below is occluded by the card(s)
// rendered in front of it.
function BackCard({ card, level }) {
  const [hovered, setHovered] = useState(false);
  const inset = level * INSET_PER_LEVEL;
  const peek = level * PEEK_PER_LEVEL;
  // Extra lift on hover — enough to clear the tab strip (label +
  // diamond) above the front card so the title reads. Scales up a
  // bit with depth so furthest-back cards lift slightly more,
  // keeping the hover payoff consistent.
  const hoverLift = 36 + level * 2;
  const top = -(peek + (hovered ? hoverLift : 0));
  // Progressively dimmer as cards recede. When hovered, bring the
  // card closer to full brightness so its label reads.
  const baseOpacity = Math.max(0.55, 1 - level * 0.14);
  const opacity = hovered ? Math.min(0.95, baseOpacity + 0.25) : baseOpacity;
  // Each level a hair darker — fakes atmospheric perspective.
  const bgEnd = 22 - level * 3;
  const bgStart = bgEnd + 6;
  // Back cards sit centered BEHIND the front card, narrower on
  // both sides (inset) and lifted up by `peek`. Only the top
  // rounded edge is visible; the rest is hidden behind the front
  // card. `bottom: 0` anchors them to the front card's bottom
  // so they share the same fade region.
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group absolute cursor-default rounded-[16px] border"
      style={{
        left: inset,
        right: inset,
        top,
        bottom: 0,
        zIndex: 10 - level,
        borderColor: hovered
          ? "rgba(255,255,255,0.14)"
          : "rgba(255,255,255,0.06)",
        background: `linear-gradient(180deg, rgba(${bgStart},${bgStart},${bgStart},1) 0%, rgba(${bgEnd},${bgEnd},${bgEnd},1) 100%)`,
        opacity,
        transition:
          "top 340ms cubic-bezier(0.22, 0.61, 0.36, 1), opacity 260ms ease, border-color 260ms ease",
        // Fade the bottom into bg so it merges with the front
        // card's own fade.
        maskImage:
          "linear-gradient(180deg, black 0%, black 22%, transparent 75%)",
        WebkitMaskImage:
          "linear-gradient(180deg, black 0%, black 22%, transparent 75%)",
      }}
    >
      {/* Label — hidden by default so only the clean rounded top
          sliver shows. Fades + slides into view on hover as the
          card rises enough to clear the front card's top edge. */}
      <div
        className="flex items-center px-5"
        style={{
          height: 44,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(-4px)",
          transition:
            "opacity 240ms ease 80ms, transform 320ms cubic-bezier(0.22, 0.61, 0.36, 1) 80ms",
        }}
      >
        <span className="text-[12px] font-medium tracking-[-0.005em] text-white/75 md:text-[13px]">
          {card.label}
        </span>
      </div>
    </div>
  );
}

// ── FrontCard ── the primary surface. Neutral dark chrome (no lime
// border), strong elevation, and a tab row + body. Sits in front of
// the three back cards via z-index.
function FrontCard({ card }) {
  return (
    <div
      className="relative w-full rounded-[16px] border"
      style={{
        zIndex: 20,
        borderColor: "rgba(255,255,255,0.13)",
        background:
          "linear-gradient(180deg, rgba(30,30,30,1) 0%, rgba(20,20,20,1) 65%, rgba(16,16,16,1) 100%)",
        // Elevation lives mostly at the top (where the card meets
        // the back slivers) — no big drop shadow below, because
        // the bottom fades into bg.
        boxShadow:
          "0 -14px 30px -18px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.06) inset",
        // Bottom-fade: the card gradient-dissolves into the page
        // bg instead of ending with a hard edge. Matches the
        // reference — the whole deck reads as emerging from dark.
        maskImage:
          "linear-gradient(180deg, black 0%, black 62%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(180deg, black 0%, black 62%, transparent 100%)",
      }}
    >
      {/* Tab row */}
      <div className="flex items-center px-5 pt-1" style={{ height: 48 }}>
        <span className="text-[12px] font-medium tracking-[-0.005em] text-white/95 md:text-[13px]">
          {card.label}
        </span>
      </div>

      {/* Body */}
      <div id={`${card.id}-body`} role="region" className="font-inter">
        <YourAppBody />
      </div>

      {/* Extra bottom spacer so the mask has content to fade over
          — otherwise the modules chips would sit right at the
          fade line. Gives breathing room for the dissolve. */}
      <div aria-hidden="true" style={{ height: 72 }} />
    </div>
  );
}

// ── YourAppBody ── types a short client brief character-by-
// character, then shows the foundation modules "attaching" one by
// one. Auto-cycles briefs. This is the only moving element in the
// hero visual now.
const BRIEFS = [
  "A client portal for a boutique real-estate practice",
  "An intake wizard for new advisory clients",
  "A deliverable approval flow for a legal team",
];
const MODS = ["CRM", "Client portal", "Roles", "Messaging", "Payments"];

function YourAppBody() {
  const [briefIdx, setBriefIdx] = useState(0);
  const [typed, setTyped] = useState(0);
  const [checked, setChecked] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const text = BRIEFS[briefIdx];

  // Typing loop. On reduced-motion, skip the animation and just
  // settle on the fully-typed + fully-checked state.
  useEffect(() => {
    if (reducedMotion) {
      setTyped(text.length);
      setChecked(MODS.length);
      return;
    }
    let count = 0;
    let t;
    const step = () => {
      if (count < text.length) {
        count += 1;
        setTyped(count);
        t = setTimeout(step, 38);
      } else {
        t = setTimeout(() => {
          setTyped(0);
          setChecked(0);
          setBriefIdx((b) => (b + 1) % BRIEFS.length);
        }, 1800);
      }
    };
    t = setTimeout(step, 260);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [briefIdx, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const total = text.length * 38 * 0.85;
    const step = total / MODS.length;
    const timers = MODS.map((_, i) =>
      setTimeout(
        () => setChecked((c) => Math.max(c, i + 1)),
        step * (i + 1),
      ),
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [briefIdx, reducedMotion]);

  const shown = text.slice(0, typed);
  const isTyping = typed < text.length;

  return (
    <div className="px-4 pb-4 pt-2">
      {/* Prompt surface */}
      <div
        className="mb-3 rounded-[8px] border px-3 py-2.5"
        style={{
          background: "rgba(0,0,0,0.32)",
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <div className="mb-1.5 text-[10px] tracking-[-0.005em] text-white/40 md:text-[11px]">
          Prompt
        </div>
        <div className="min-h-[40px] text-[12px] leading-[1.55] text-white/90 md:text-[13px]">
          {shown}
          <span
            aria-hidden="true"
            className="ml-[1px] inline-block h-[1em] w-[1px] -translate-y-[1px] align-middle"
            style={{
              background: "rgba(255,255,255,0.85)",
              opacity: isTyping ? 1 : 0.5,
            }}
          />
        </div>
      </div>

      {/* Foundation modules */}
      <div className="px-1">
        <div className="mb-2 flex items-center gap-2 text-[10px] tracking-[-0.005em] text-white/40 md:text-[11px]">
          <span>Assembling on foundation</span>
          <span className="flex items-center gap-[2px]">
            <span
              className="studio-thinking-dot h-[3px] w-[3px] rounded-full"
              style={{ background: "rgba(255,255,255,0.45)" }}
            />
            <span
              className="studio-thinking-dot h-[3px] w-[3px] rounded-full"
              style={{
                background: "rgba(255,255,255,0.45)",
                animationDelay: "0.15s",
              }}
            />
            <span
              className="studio-thinking-dot h-[3px] w-[3px] rounded-full"
              style={{
                background: "rgba(255,255,255,0.45)",
                animationDelay: "0.3s",
              }}
            />
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {MODS.map((m, i) => {
            const done = i < checked;
            return (
              <span
                key={m}
                className="rounded-[4px] border px-2.5 py-[4px] text-[10px] md:text-[11px]"
                style={{
                  borderColor: done
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(255,255,255,0.05)",
                  background: done
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(255,255,255,0.01)",
                  color: done
                    ? "rgba(255,255,255,0.6)"
                    : "rgba(255,255,255,0.3)",
                  transition:
                    "border-color 320ms ease, background 320ms ease, color 320ms ease",
                }}
              >
                {m}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
