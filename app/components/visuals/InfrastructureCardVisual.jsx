"use client";

// Shared gradient recipe — matches PromptCardVisual so this card reads as
// the same family.
const CARD_GRADIENT = [
  "linear-gradient(180deg, rgba(255,255,255,0) 12.397%, rgb(139,153,200) 74.611%, rgb(217,237,146) 100%)",
  "linear-gradient(90deg, rgb(255,255,255) 0%, rgb(255,255,255) 100%)",
].join(", ");

// Empty gradient card — placeholder for the Infrastructure section.
// Content (pill cloud, spec list, etc.) to be added once the direction is
// locked. The card shape, aspect, shadow, and gradient match
// PromptCardVisual so the two sections feel like one set.
export function InfrastructureCardVisual() {
  return (
    <div
      className="relative aspect-[3/2] w-full overflow-hidden rounded-[16px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]"
      style={{ backgroundImage: CARD_GRADIENT }}
    />
  );
}
