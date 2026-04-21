// All page copy for Assembly Studio V1.
// Clone this file (e.g. home-variant-b.js) and swap import in app/page.js for variants.

export const HOME_CONTENT = {
  hero: {
    eyebrow: "Early access beta",
    heading: "The platform layer for AI\u2011native service firms",
    subheading:
      "You're not a legacy firm adopting AI. You're building something new. Assembly is the operating system, so you can focus on what makes your firm different. Not another AI app builder. One that actually ships to clients.",
  },

  whyAssemblyStudio: {
    eyebrow: "Why Assembly Studio",
    heading: "Not another app builder",
    body: [
      "App builders like Lovable, Replit, and Base44 are great for internal tools and prototypes. But if you're a professional service firm or startup serving real clients, you need more than just an app. You need a whole host of features and a polished, secure experience for your customers.",
      "Assembly Studio comes with a pre-built foundation: a CRM for your team, a branded portal for your customers, integrated notifications, and roles & permissions. On top of that, a library of reviewed apps you can one\u2011click enable for messaging, payments, contracts, file\u2011sharing, and more.",
      "Assembly Studio is how you build what makes your firm different: custom intake flows, progress trackers, proposal tools, and more. Deliver an experience above the competition with Assembly Studio.",
    ],
  },

  logoStrip: {
    label: "Already used by early teams in alpha",
    logos: [
      { name: "Capital One" },
      { name: "Collective" },
      { name: "Ditto" },
      { name: "Heritage Law Partners" },
      { name: "Waymaker" },
      { name: "ce" },
      { name: "AURA" },
      { name: "CEO Bankable" },
    ],
  },

  valueProps: [
    {
      layout: "split",
      orientation: "text-left",
      eyebrow: "AI generation",
      menuLabel: "AI generation",
      heading: "Describe your firm. We build the apps around it",
      body: "Tell Studio what you do differently: intake flows, client dashboards, scoped deliverables, custom pricing logic. It generates production apps wired into Assembly's data, not throwaway prototypes.",
      visualKey: "promptCard",
    },
    {
      layout: "split",
      orientation: "text-right",
      eyebrow: "Infrastructure included",
      menuLabel: "Infrastructure",
      heading: "Auth, CRM, billing, messaging, already live",
      body: "Every generated app inherits Assembly's platform: authenticated clients, scoped permissions, billing surfaces, messaging threads, and a branded portal. You don't wire plumbing. You ship.",
      visualKey: "infrastructure",
    },
    {
      layout: "stacked",
      eyebrow: "Client-facing, not internal",
      menuLabel: "Client-facing",
      heading: "Apps your clients actually use, not internal tools",
      body: "Studio assumes the end user is your client, not your team. Branded portal, permissioned views, client-ready notifications. The difference between a demo and a product.",
      visualKey: "studioApp",
    },
    {
      layout: "split",
      orientation: "text-left",
      eyebrow: "Production-ready",
      menuLabel: "Production-ready",
      heading: "Ship the same day you describe it",
      body: "No deploy pipeline. No auth audit. No schema migrations. Studio generates, Assembly hosts, your clients sign in. Weeks of setup collapse into an afternoon.",
      visualKey: "studioApp",
    },
  ],

  comparison: {
    eyebrow: "How Studio differs",
    // Heading intentionally differs from the whyAssemblyStudio heading
    // ("Not another app builder") so the page doesn't repeat itself.
    heading: "Built for clients, not prototypes",
    firstColumnLabel: "Where we differ",
    leftLabel: "Lovable / Replit",
    rightLabel: "Assembly Studio",
    // Rows are [rowLabel, competitor, assembly]. Copy kept tight —
    // labels in the left column carry the axis, so the cells just
    // need a sharp phrase, not a sentence.
    rows: [
      ["Who it's for", "Anyone building software", "AI-native service firms"],
      ["What it's for", "Prototypes & internal tools", "Client-facing experiences"],
      ["Where it lives", "Standalone app at its own URL", "Inside your branded portal"],
      ["What's included", "You build the stack", "CRM, portal, auth, billing, notifications"],
      ["How apps connect", "Siloed, one-off apps", "Organized in folders, trigger each other"],
      ["Best fit for", "A one-off tool", "A consolidated client experience"],
    ],
  },

  howItWorks: {
    eyebrow: "How it works",
    heading: "Three steps to a shipped client app",
    steps: [
      {
        title: "Describe your app",
        body: "Tell Studio what you need in plain English: the workflow, the data, what your client sees.",
      },
      {
        title: "Assembly generates it",
        body: "A production app is built on Assembly's platform. Auth, permissions, billing, portal, all wired in.",
      },
      {
        title: "Ship to clients",
        body: "Invite clients to your branded portal. They sign in, use the app, and you bill them through Assembly.",
      },
    ],
  },

  testimonials: {
    eyebrow: "From the alpha",
    heading: "The firms shipping on Studio today",
    subheading:
      "Early partners building client-ready apps on the Assembly platform, in days not months.",
    quotes: [
      {
        segment: "Advisory",
        body: "We replaced three contractors and two weeks of Zapier glue with a single Studio prompt. Our clients never saw the seam.",
        name: "Dana Reyes",
        title: "Founder",
        company: "Northstar Advisory",
        photo: "/testimonials/Frame%202147223878.png",
      },
      {
        segment: "Legal",
        body: "Studio feels like the platform we would have built internally if we'd had two years and an engineering team. We didn't. We shipped anyway.",
        name: "Marcus Lin",
        title: "Managing Partner",
        company: "Runway Legal",
        photo: "/testimonials/Frame%202147223879.png",
      },
      {
        segment: "Consulting",
        body: "Auth, billing, the client portal: all of it was already there. I described the workflow, clients were using it by Friday.",
        name: "Priya Shah",
        title: "Principal",
        company: "Helio",
        photo: "/testimonials/image%2010.png",
      },
      {
        segment: "Accounting",
        body: "We went from spreadsheets and email threads to a branded client portal in under a week. Our retention jumped the month we shipped it.",
        name: "Evelyn Park",
        title: "Partner",
        company: "Park & Co. CPAs",
        photo: "/testimonials/image%2011.png",
      },
      {
        segment: "Agency",
        body: "Studio collapses what used to be a three-month build into an afternoon prompt. Our margins on client work changed overnight.",
        name: "Jordan Whitfield",
        title: "Creative Director",
        company: "Field Studio",
        photo: "/testimonials/image%2012.png",
      },
    ],
  },

  benefits: {
    eyebrow: "Beta benefits",
    heading: "What early access includes",
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
    heading: "Questions, answered",
    items: [
      {
        q: "What is Assembly Studio?",
        a: "Studio is the AI app layer of the Assembly platform. Describe a client-facing workflow and Studio generates a production app wired into Assembly's auth, billing, messaging, and client portal.",
      },
      {
        q: "Who is this for?",
        a: "AI-native service firms: new firms being built on AI from day one. If you're launching a modern advisory, legal, creative, or consulting firm and need client-facing tools without an engineering team, Studio is for you.",
      },
      {
        q: "Do I need to code?",
        a: "No. You describe what you want in plain English. Studio handles generation, Assembly handles infrastructure.",
      },
      {
        q: "Alpha vs beta: what does that mean?",
        a: "Studio is already live in alpha with a small group of early teams. The beta is what you're requesting access to: a wider rollout with more capacity and polish, running on the same platform.",
      },
      {
        q: "When will I get access?",
        a: "We're inviting teams in waves. Request access and we'll reach out with next-cohort timing and onboarding.",
      },
      {
        q: "Is this part of Assembly?",
        a: "Studio is a sub-brand of Assembly and runs on the Assembly platform. You don't need an existing Assembly account. We set you up when access opens.",
      },
    ],
  },

  finalCta: {
    heading: "Ship your firm on Assembly",
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
