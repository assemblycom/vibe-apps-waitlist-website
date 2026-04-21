import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { NarrativeBlock } from "./components/NarrativeBlock";
import { LogoStrip } from "./components/LogoStrip";
import { ValueProps } from "./components/ValueProps";
import { ValuePropsStory } from "./components/ValuePropsStory";
import { ComparisonTable } from "./components/ComparisonTable";
import { Steps } from "./components/Steps";
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

      <LogoStrip label={c.logoStrip.label} logos={c.logoStrip.logos} />

      {/* Mobile — standard stacked/split value prop sections. Story mode is
          desktop-only (requires sticky content area + scroll-marker layout
          that doesn't make sense on a narrow viewport). */}
      <div className="md:hidden">
        <Reveal>
          <ValueProps items={c.valueProps} />
        </Reveal>
      </div>

      {/* Desktop — story mode: sticky menu + content, scroll-driven. */}
      <div className="hidden md:block">
        <ValuePropsStory items={c.valueProps} />
      </div>

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
        <Steps
          eyebrow={c.howItWorks.eyebrow}
          heading={c.howItWorks.heading}
          steps={c.howItWorks.steps}
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
        <Benefits
          eyebrow={c.benefits.eyebrow}
          heading={c.benefits.heading}
          items={c.benefits.items}
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
