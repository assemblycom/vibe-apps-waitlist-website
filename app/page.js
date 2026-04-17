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

      <NarrativeBlock
        eyebrow={c.whyAssemblyStudio.eyebrow}
        heading={c.whyAssemblyStudio.heading}
        body={c.whyAssemblyStudio.body}
      />

      <LogoStrip label={c.logoStrip.label} logos={c.logoStrip.logos} />

      <ValueProps items={c.valueProps} />

      <ComparisonTable
        eyebrow={c.comparison.eyebrow}
        heading={c.comparison.heading}
        leftLabel={c.comparison.leftLabel}
        rightLabel={c.comparison.rightLabel}
        rows={c.comparison.rows}
      />

      <Steps
        eyebrow={c.howItWorks.eyebrow}
        heading={c.howItWorks.heading}
        steps={c.howItWorks.steps}
      />

      <Testimonials
        eyebrow={c.testimonials.eyebrow}
        heading={c.testimonials.heading}
        quotes={c.testimonials.quotes}
      />

      <Benefits
        eyebrow={c.benefits.eyebrow}
        heading={c.benefits.heading}
        items={c.benefits.items}
      />

      <FAQ
        eyebrow={c.faq.eyebrow}
        heading={c.faq.heading}
        items={c.faq.items}
      />

      <FinalCTA
        heading={c.finalCta.heading}
        subheading={c.finalCta.subheading}
      />

      <Footer
        copyright={c.footer.copyright}
        legalLinks={c.footer.legalLinks}
      />
    </div>
  );
}
