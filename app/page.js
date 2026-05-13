import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { NarrativeBlock } from "./components/NarrativeBlock";
import { ValueProps } from "./components/ValueProps";
import { ComparisonSpec } from "./components/ComparisonSpec";
import { Testimonials } from "./components/Testimonials";
import { Benefits } from "./components/Benefits";
import { FAQ } from "./components/FAQ";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { GradientReveal } from "./components/GradientReveal";
import { ZoomHero } from "./components/ZoomHero";
import { Reveal } from "./components/Reveal";
import { HOME_CONTENT } from "./content/home";

export default function Home() {
  const c = HOME_CONTENT;
  return (
    <div className="min-h-screen">
      {/* Header is rendered OUTSIDE GradientReveal so its `position:
          fixed` actually anchors to the viewport. GradientReveal
          applies a `translate3d` to its content frame for the bottom-
          overshoot gradient, which creates a new containing block and
          would otherwise trap any fixed descendant inside it (the nav
          would scroll with the page instead of sticking). It's also a
          sibling of ZoomHero — not nested — so the nav stays visible
          as the user scrolls past the hero. The seam/criss-cross bug
          is avoided a different way now: the Header is *surfaceless*
          (no bg/border/blur) while the hero is on screen, so there is
          no pill layer to overlap with the hero card. The pill only
          materializes once the hero has scrolled past, where it sits
          over NarrativeBlock/ValueProps rather than the hero. See
          Header.jsx for the fuller explanation. */}
      <Header />
      {/* GradientReveal wraps all page content so it can translate the
          content upward during wheel/touch overshoot, revealing the brand
          gradient behind it. Footer and logos stay visible because they
          move with the content — the gradient appears under them, not
          on top. */}
      <GradientReveal>
        <ZoomHero>
          <Hero
            heading={c.hero.heading}
            subheading={c.hero.subheading}
            alphaLabel={c.logoStrip.label}
            alphaLogos={c.logoStrip.logos}
          />
        </ZoomHero>

      {/* NarrativeBlock manages its own staged reveal (heading first, then
          body) — no outer <Reveal> wrapper so the two effects don't
          double-fade. */}
      <NarrativeBlock
        heading={c.whyAssemblyStudio.heading}
        callout={c.whyAssemblyStudio.callout}
        body={c.whyAssemblyStudio.body}
      />

      {/* No gradient and no added chapter-opener between the
          NarrativeBlock and the dark ValueProps section. The transition
          is carried purely by cadence: the light section exits with
          generous bottom padding, a short dark spacer gives the eye a
          beat to register the color shift, and ValueProps declares the
          new chapter with its own first eyebrow ("AI BUILDER"), which
          sits close enough to the seam to feel like content leading
          you in rather than a void to traverse. */}
      <div aria-hidden="true" className="h-12 bg-[#101010] md:h-16" />

      {/* All breakpoints — stacked value prop sections that scroll with
          the page. The old desktop story-mode (sticky menu + scroll
          markers) pinned content and took over native scroll, which
          read as hijacking. Using the mobile layout everywhere keeps
          scroll feel native. */}
      <Reveal>
        <ValueProps items={c.valueProps} />
      </Reveal>

      {/* Cream chapter — ComparisonSpec + Testimonials read as a single
          light-mode interlude between dark ValueProps and dark FAQ.
          Same pattern as NarrativeBlock: explicit cream bg with generous
          bottom padding so its content ends well above the seam, then a
          short dark spacer gives the eye a beat before FAQ's white text.
          data-nav-theme="light" drives the nav pill's continuous tint. */}
      <div
        data-nav-theme="light"
        data-tinted-section="light"
        className="bg-[#F5F5F0] pb-20 md:pb-40"
      >
        <Reveal>
          <ComparisonSpec
            heading={c.comparison.heading}
            headingCallout={c.comparison.headingCallout}
            leftLabel={c.comparison.leftLabel}
            rightLabel={c.comparison.rightLabel}
            rows={c.comparison.rows}
          />
        </Reveal>

        <Reveal>
          <Testimonials
            theme="light"
            heading={c.testimonials.heading}
            subheading={c.testimonials.subheading}
            stat={c.testimonials.stat}
            statCaption={c.testimonials.statCaption}
            quotes={c.testimonials.quotes}
          />
        </Reveal>
      </div>

      {/* Dark spacer — same pattern as the NarrativeBlock → ValueProps
          seam. Hard color flip at the wrapper edge with this strip of
          empty dark giving the eye a beat to register the change before
          FAQ content arrives. */}
      <div aria-hidden="true" className="h-12 bg-[#101010] md:h-16" />

      <Reveal>
        <FAQ
          heading={c.faq.heading}
          items={c.faq.items}
        />
      </Reveal>

      {/* FinalCTA drives its own scroll-reveal (fiasco.design-style
          slide-up + fade + subtle scale); no outer Reveal so the two
          animations don't fight. */}
      <FinalCTA
        heading={c.finalCta.heading}
        subheading={c.finalCta.subheading}
      />

        <Footer
          copyright={c.footer.copyright}
          legalLinks={c.footer.legalLinks}
        />
      </GradientReveal>
    </div>
  );
}
