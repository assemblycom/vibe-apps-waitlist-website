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

// Reusable horizontally-scrolling marquee. Logos render twice inside a
// flex track that translates -50%, so the second copy lands exactly where
// the first started and the loop is seamless. Edge fades via mask-image
// so logos ease in and out instead of hard-clipping.
function LogoMarquee({ logos, variant, ariaLabel }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0, black 12%, black 88%, transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0, black 12%, black 88%, transparent 100%)",
      }}
      aria-label={ariaLabel}
    >
      <div className="logo-marquee-track flex w-max items-center gap-x-12 md:gap-x-16">
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
  );
}

// variant "light" (default): renders as a standalone section with
// off-white bg, used as the tail of the NarrativeBlock chapter. Static
// centered wrap.
// variant "dark": bare markup for use inside an existing dark container
// (the Hero). Always a centered scrolling marquee with fades on both
// ends, so the row feels alive instead of a static left-aligned list.
export function LogoStrip({ label, logos = [], variant = "light" }) {
  const dark = variant === "dark";

  if (dark) {
    return (
      <>
        {label && (
          <p className="mono mb-6 text-center text-[11px] uppercase tracking-[0.03em] text-white/40 md:mb-8">
            {label}
          </p>
        )}
        <LogoMarquee logos={logos} variant={variant} ariaLabel="Alpha users" />
      </>
    );
  }

  const strip = (
    <>
      <p className="mono mb-6 text-center text-[11px] uppercase tracking-[0.03em] text-[#1A1A1A]/45 md:mb-8">
        {label}
      </p>

      {/* Mobile — marquee, same pattern as the dark variant. */}
      <div className="md:hidden">
        <LogoMarquee logos={logos} variant={variant} ariaLabel="Alpha users" />
      </div>

      {/* Desktop — static, centered wrap. Each logo fades in with a
          stagger via Reveal. */}
      <div className="hidden items-center justify-center gap-x-10 gap-y-6 md:flex md:flex-wrap">
        {logos.map((logo, i) => (
          <Reveal key={logo.name} delay={i * 60}>
            <LogoItem name={logo.name} variant={variant} />
          </Reveal>
        ))}
      </div>
    </>
  );

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
