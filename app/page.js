import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { NarrativeBlock } from "./components/NarrativeBlock";
import { LogoStrip } from "./components/LogoStrip";
import { ValueProps } from "./components/ValueProps";
import { ComparisonTable } from "./components/ComparisonTable";
import { Steps } from "./components/Steps";
import { Testimonials } from "./components/Testimonials";
import { Benefits } from "./components/Benefits";
import { FAQ } from "./components/FAQ";
import { FinalCTA } from "./components/FinalCTA";
import { Footer } from "./components/Footer";
import { Reveal } from "./components/Reveal";
import { HOME_CONTENT } from "./content/home";

export default function Home() {
  const c = HOME_CONTENT;
  return (
    <div className="min-h-screen">
      <Header />

      <Hero
        eyebrow={c.hero.eyebrow}
        heading={c.hero.heading}
        subheading={c.hero.subheading}
      />

      <Reveal>
        <NarrativeBlock
          eyebrow={c.whyAssemblyStudio.eyebrow}
          heading={c.whyAssemblyStudio.heading}
          body={c.whyAssemblyStudio.body}
        />
      </Reveal>

      <LogoStrip label={c.logoStrip.label} logos={c.logoStrip.logos} />

      <Reveal>
        <ValueProps items={c.valueProps} />
      </Reveal>

      <Reveal>
        <ComparisonTable
          eyebrow={c.comparison.eyebrow}
          heading={c.comparison.heading}
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

      <Reveal>
        <FinalCTA
          heading={c.finalCta.heading}
          subheading={c.finalCta.subheading}
        />
      </Reveal>

      <Footer
        copyright={c.footer.copyright}
        legalLinks={c.footer.legalLinks}
      />
    </div>
  );
}
