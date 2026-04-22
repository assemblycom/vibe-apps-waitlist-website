import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { NarrativeBlock } from "./components/NarrativeBlock";
import { ValueProps } from "./components/ValueProps";
import { ComparisonTable } from "./components/ComparisonTable";
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
      {/* GradientReveal wraps all page content so it can translate the
          content upward during wheel/touch overshoot, revealing the brand
          gradient behind it. Footer and logos stay visible because they
          move with the content — the gradient appears under them, not
          on top. */}
      <GradientReveal>
        <Header />

        {/* Hero lives inside ZoomHero so it scales down + gets rounded
            corners as the user scrolls, revealing the off-white backdrop
            around it. That same off-white carries into the NarrativeBlock
            below for a continuous color band. */}
        <ZoomHero>
          <Hero
            eyebrow={c.hero.eyebrow}
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
        eyebrow={c.whyAssemblyStudio.eyebrow}
        heading={c.whyAssemblyStudio.heading}
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

      <Reveal>
        <ComparisonTable
          eyebrow={c.comparison.eyebrow}
          heading={c.comparison.heading}
          firstColumnLabel={c.comparison.firstColumnLabel}
          leftLabel={c.comparison.leftLabel}
          rightLabel={c.comparison.rightLabel}
          rows={c.comparison.rows}
        />
      </Reveal>

      <Reveal>
        <Testimonials
          eyebrow={c.testimonials.eyebrow}
          heading={c.testimonials.heading}
          subheading={c.testimonials.subheading}
          stat={c.testimonials.stat}
          statCaption={c.testimonials.statCaption}
          quotes={c.testimonials.quotes}
        />
      </Reveal>

      <Reveal>
        <FAQ
          eyebrow={c.faq.eyebrow}
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
