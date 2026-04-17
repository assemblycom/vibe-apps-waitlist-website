// All page copy for Assembly Studio V1.
// Clone this file (e.g. home-variant-b.js) and swap import in app/page.js for variants.

export const HOME_CONTENT = {
  hero: {
    eyebrow: "Early access — beta",
    heading: "The platform layer for AI-native service firms.",
    subheading:
      "You're not a legacy firm adopting AI. You're building something new. Assembly is the operating system — so you can focus on what makes your firm different. Not another AI app builder. One that actually ships to clients.",
  },

  whyAssemblyStudio: {
    eyebrow: "Why Assembly Studio",
    heading: "Built for firms shipping to clients — not prototypes to teammates.",
    body: [
      "AI app builders like Lovable and Replit are great for spinning up internal tools or demos. They stop where real work begins: client scoping, auth, billing, messaging, permissions, a production-grade portal. You end up stitching infrastructure together before you can ship a single client.",
      "Assembly is the foundation — CRM, billing, messaging, client portal, permissions — already live, already used by early teams in alpha. Studio is the AI layer on top: describe what makes your firm different, and we build the client-facing apps around it. You launch the firm. Not the infrastructure.",
    ],
  },

  logoStrip: {
    label: "Already used by early teams in alpha",
    logos: [
      { name: "Northstar" },
      { name: "Helio" },
      { name: "Runway Legal" },
      { name: "Halcyon" },
      { name: "Orbit Studio" },
      { name: "Meridian" },
    ],
  },

  valueProps: [
    {
      layout: "split",
      orientation: "text-left",
      eyebrow: "AI generation",
      heading: "Describe your firm. We build the apps around it.",
      body: "Tell Studio what you do differently — intake flows, client dashboards, scoped deliverables, custom pricing logic. It generates production apps wired into Assembly's data, not throwaway prototypes.",
    },
    {
      layout: "split",
      orientation: "text-right",
      eyebrow: "Infrastructure included",
      heading: "Auth, CRM, billing, messaging — already live.",
      body: "Every generated app inherits Assembly's platform: authenticated clients, scoped permissions, billing surfaces, messaging threads, and a branded portal. You don't wire plumbing. You ship.",
    },
    {
      layout: "stacked",
      eyebrow: "Client-facing, not internal",
      heading: "Apps your clients actually use — not internal tools.",
      body: "Studio assumes the end user is your client, not your team. Branded portal, permissioned views, client-ready notifications. The difference between a demo and a product.",
    },
    {
      layout: "split",
      orientation: "text-left",
      eyebrow: "Production-ready",
      heading: "Ship the same day you describe it.",
      body: "No deploy pipeline. No auth audit. No schema migrations. Studio generates, Assembly hosts, your clients sign in. Weeks of setup collapse into an afternoon.",
    },
  ],

  comparison: {
    eyebrow: "How Studio differs",
    heading: "Not another AI app builder.",
    leftLabel: "Lovable / Replit",
    rightLabel: "Assembly Studio",
    rows: [
      ["Builds app UI", "Builds + ships client-ready apps"],
      ["You handle auth", "Auth included"],
      ["No client scoping", "Client scoping built in"],
      ["Prototype-level", "Production-ready"],
      ["You host & operate", "Runs on Assembly platform"],
    ],
  },

  howItWorks: {
    eyebrow: "How it works",
    heading: "Three steps to a shipped client app.",
    steps: [
      {
        title: "Describe your app",
        body: "Tell Studio what you need in plain English — the workflow, the data, what your client sees.",
      },
      {
        title: "Assembly generates it",
        body: "A production app is built on Assembly's platform. Auth, permissions, billing, portal — all wired in.",
      },
      {
        title: "Ship to clients",
        body: "Invite clients to your branded portal. They sign in, use the app, and you bill them through Assembly.",
      },
    ],
  },

  testimonials: {
    eyebrow: "From the alpha",
    heading: "Early teams shipping on Studio today.",
    quotes: [
      {
        body: "We replaced three contractors and two weeks of Zapier glue with a single Studio prompt. Our clients never saw the seam.",
        name: "Dana Reyes",
        title: "Founder, Northstar Advisory",
      },
      {
        body: "Studio feels like the platform we would have built internally if we'd had two years and an engineering team. We didn't. We shipped anyway.",
        name: "Marcus Lin",
        title: "Managing Partner, Runway Legal",
      },
      {
        body: "Auth, billing, the client portal — all of it was already there. I described the workflow, clients were using it by Friday.",
        name: "Priya Shah",
        title: "Principal, Helio",
      },
    ],
  },

  benefits: {
    eyebrow: "Beta benefits",
    heading: "What early access includes.",
    items: [
      {
        title: "First access to the beta",
        body: "Request access and we'll bring you onto the platform in the next cohort.",
      },
      {
        title: "Founding-team pricing",
        body: "Beta users lock in early pricing as Studio graduates from alpha to general availability.",
      },
    ],
  },

  faq: {
    eyebrow: "FAQ",
    heading: "Questions, answered.",
    items: [
      {
        q: "What is Assembly Studio?",
        a: "Studio is the AI app layer of the Assembly platform. Describe a client-facing workflow and Studio generates a production app wired into Assembly's auth, billing, messaging, and client portal.",
      },
      {
        q: "Who is this for?",
        a: "AI-native service firms — new firms being built on AI from day one. If you're launching a modern advisory, legal, creative, or consulting firm and need client-facing tools without an engineering team, Studio is for you.",
      },
      {
        q: "Do I need to code?",
        a: "No. You describe what you want in plain English. Studio handles generation, Assembly handles infrastructure.",
      },
      {
        q: "Alpha vs beta — what does that mean?",
        a: "Studio is already live in alpha with a small group of early teams. The beta is what you're requesting access to — a wider rollout with more capacity and polish, but running on the same platform.",
      },
      {
        q: "When will I get access?",
        a: "We're inviting teams in waves. Request access and we'll reach out with next-cohort timing and onboarding.",
      },
      {
        q: "Is this part of Assembly?",
        a: "Studio is a sub-brand of Assembly and runs on the Assembly platform. You don't need an existing Assembly account — we set you up when access opens.",
      },
    ],
  },

  finalCta: {
    heading: "Ship your firm on Assembly.",
    subheading: "Request early access to the Studio beta. Built on the platform already running in alpha.",
  },

  footer: {
    copyright: `© ${new Date().getFullYear()} Assembly Studio.`,
    legalLinks: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
};
