import { Reveal } from "./Reveal";

// Single logo cell — extracted so the mobile marquee and desktop grid
// render identical-looking items without duplicating markup inline.
// Text colors flip based on the surface the strip is sitting on
// (`variant="light"` for the off-white chapter, `variant="dark"` for
// the hero).
function LogoItem({ name, variant }) {
  const base =
    variant === "dark"
      ? "text-white/40 hover:text-white/80"
      : "text-[#1A1A1A]/40 hover:text-[#1A1A1A]/80";
  return (
    <div className="flex h-8 items-center justify-center">
      <span
        className={`whitespace-nowrap text-[14px] font-semibold tracking-[-0.01em] transition-colors duration-200 ${base}`}
      >
        {name}
      </span>
    </div>
  );
}

// variant "light" (default): renders as a standalone section with
// off-white bg, used as the tail of the NarrativeBlock chapter.
// variant "dark": renders bare markup (no <section>, no bg), for use
// inside an existing dark-themed container like the Hero.
export function LogoStrip({ label, logos = [], variant = "light" }) {
  const dark = variant === "dark";

  const labelEl = label && (
    <p
      className={`mono mb-6 text-[11px] uppercase tracking-[0.08em] md:mb-8 ${
        dark ? "text-white/40" : "text-center text-[#1A1A1A]/45"
      }`}
    >
      {label}
    </p>
  );

  const strip = (
    <>
      {labelEl}

      {/* Mobile — continuous auto-scrolling marquee. Logos render twice
          inside a flex track that translates -50%, so the second copy
          lands exactly where the first started and the loop is seamless.
          Edge fades via mask-image so logos ease in and out instead of
          hard-clipping at the container edge. */}
      <div
        className="relative overflow-hidden md:hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)",
        }}
        aria-label="Alpha users"
      >
        <div className="logo-marquee-track flex w-max items-center gap-x-12">
          {logos.map((logo) => (
            <div key={`a-${logo.name}`} className="flex-none">
              <LogoItem name={logo.name} variant={variant} />
            </div>
          ))}
          {/* Duplicate set — aria-hidden so SR users don't hear logos
              announced twice. */}
          {logos.map((logo) => (
            <div
              key={`b-${logo.name}`}
              className="flex-none"
              aria-hidden="true"
            >
              <LogoItem name={logo.name} variant={variant} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop — static, centered wrap in the off-white section,
          left-aligned inside the hero. Each logo fades in with a
          stagger via Reveal. */}
      <div
        className={`hidden items-center gap-x-10 gap-y-6 md:flex md:flex-wrap ${
          dark ? "" : "justify-center"
        }`}
      >
        {logos.map((logo, i) => (
          <Reveal key={logo.name} delay={i * 60}>
            <LogoItem name={logo.name} variant={variant} />
          </Reveal>
        ))}
      </div>
    </>
  );

  if (dark) {
    // Bare markup — parent supplies the wrapper / spacing.
    return strip;
  }

  return (
    // `bg-[#F5F5F0]` + `pt-0` stitches this section onto the bottom of
    // NarrativeBlock so the two read as a single off-white "chapter".
    // `rounded-b-[28px]` closes the chapter with the same corner radius
    // the Hero uses at full zoom — the boundary reads as a deliberate
    // card edge rather than a hard color cut. The dark page bg shows in
    // the corners beneath the curve.
    <section data-nav-theme="light" className="gradient-divider bg-[#F5F5F0] pt-0 pb-16 rounded-b-[28px] md:pb-20 md:rounded-b-[36px]">
      <div className="mx-auto max-w-6xl px-6">{strip}</div>
    </section>
  );
}
