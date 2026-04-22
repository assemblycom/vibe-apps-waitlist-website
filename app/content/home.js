// All page copy for Assembly Studio V1.
// Clone this file (e.g. home-variant-b.js) and swap import in app/page.js for variants.

export const HOME_CONTENT = {
  hero: {
    eyebrow: "Early access beta",
    heading: "The platform layer for AI\u2011native service firms",
    subheading:
      "You're building something new. Assembly is the system behind it, so you can focus on what makes your firm different. Not another AI app builder, one that actually ships to clients.",
  },

  whyAssemblyStudio: {
    eyebrow: "Why Assembly Studio",
    heading: "Not another app builder",
    body: [
      "Other app builders are great for internal tools, prototypes, and websites. But if you're serving real paying clients, you don't need one vibe-coded app. You need a polished, branded, secure, and consolidated client experience.",
      "Our app builder is the only one that understands your business. Describe what you want, a custom intake flow, a progress tracker, a proposal tool, and it builds an app that works with your existing contacts and companies, respects your permissions, and integrates with email and in-product notifications. Every app deploys straight into your client experience, not as a standalone tool on a separate URL, but as a native part of your firm.",
      "And underneath it all, a real platform. Assembly Studio gives you a CRM for your team, a branded portal for clients, integrated notifications, and permissions, plus a library of reviewed apps you can one-click enable. Every piece is designed to work together, so the client experience you deliver feels cohesive and complete.",
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
      eyebrow: "AI builder",
      menuLabel: "AI builder",
      heading: "Three steps to a shipped client app",
      body: "Start from a template or describe your own app in plain English. Assembly generates a secure app and publishes it to your client portal, no code, no deploy step, no infrastructure to wire up.",
      visualKey: "threeSteps",
    },
    {
      layout: "split",
      orientation: "text-right",
      eyebrow: "Client experience",
      menuLabel: "Client experience",
      heading: "Where your apps meet your clients",
      body: "Every client sees a portal built from native Assembly apps and the ones you built yourself, organized into folders, scoped per client, branded as yours.",
      visualKey: "infrastructure",
    },
    {
      layout: "stacked",
      eyebrow: "Internal dashboard",
      menuLabel: "Internal dashboard",
      heading: "Your team's command center",
      body: "Behind the portal, your team's command center. A CRM with contacts and companies, custom fields, internal notes, a unified notification center, automations, and every custom app you built ships with an internal view for your team, too.",
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
    // Rows are [rowLabel, competitor, assembly, mobileFeature?]. The
    // first three drive the desktop 3-col grid where the axis label
    // carries the comparison. Mobile renders as a Studio-only
    // checklist, so the optional 4th element rephrases the Assembly
    // answer as a standalone statement — reads naturally without the
    // axis as scaffolding.
    rows: [
      [
        "Who it's for",
        "Anyone building software",
        "AI-native service firms",
        "Built for AI-native service firms",
      ],
      [
        "What it's for",
        "Prototypes & internal tools",
        "Client-facing experiences",
        "Built for client-facing experiences",
      ],
      [
        "Where it lives",
        "Standalone app at its own URL",
        "Inside your branded portal",
        "Lives inside your branded portal",
      ],
      [
        "What's included",
        "You build the stack",
        "CRM, portal, auth, billing, notifications",
        "CRM, portal, auth, billing, and notifications included",
      ],
      [
        "How apps connect",
        "Siloed, one-off apps",
        "Organized in folders, trigger each other",
        "Apps organized in folders, triggering each other",
      ],
      [
        "Best fit for",
        "A one-off tool",
        "A consolidated client experience",
        "Built for a consolidated client experience",
      ],
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
        q: "How do I get access to Assembly Studio?",
        a: "Join the waitlist. We're onboarding in waves and reaching out with cohort timing as capacity opens.",
      },
      {
        q: "What does it cost?",
        a: "Flat per-workspace plan for the foundation (CRM, portal, auth, permissions, messaging, payments). Custom apps run on metered build credits. Waitlist members get $100 to start. Full pricing at launch.",
      },
      {
        q: "How secure is it?",
        a: "Row-level client scoping on by default, magic-link and SSO auth, encryption at rest and in transit, audit logs. SOC 2 Type II in progress. Region-pinned data on Enterprise.",
      },
      {
        q: "Can I get help building features?",
        a: "Yes. 21 reviewed apps enable with one click. For bespoke work, our solutions team and partner network build alongside you on the same platform.",
      },
      {
        q: "What if I already have an Assembly workspace?",
        a: "Studio slots into your existing workspace. Same CRM, portal, clients. When access opens, it appears in your sidebar. No migration.",
      },
    ],
  },

  finalCta: {
    heading: "Reserve your seat.",
    subheading:
      "The first signups get a personalized onboarding session. We'll sit with you, understand your firm, and help you craft the client experience your firm deserves.",
  },

  // Post-submit modal that appears after the user enters an email in
  // any EmailCTA instance. The email submit is confirmed in the modal
  // header; this array drives three optional follow-ups below it.
  waitlistModal: {
    heading: "You're on the list",
    subheading: "We'll be in touch as cohorts open.",
    items: [
      {
        id: "build",
        title: "What would you build first?",
        subtitle: "One sentence is plenty.",
        placeholder:
          "e.g. a client intake form that routes to the right partner",
        actionLabel: "Save",
        completedLabel: "Saved",
      },
      {
        id: "share",
        title: "Share with your network",
        subtitle: "Post a quick note on LinkedIn or X.",
        actionLabel: "Share on LinkedIn",
        actionLabelX: "Share on X",
        completedLabel: "Shared",
      },
      {
        id: "survey",
        title: "Quick survey",
        subtitle: "Five questions, about two minutes.",
        actionLabel: "Take survey",
        completedLabel: "Opened",
      },
    ],
    dismissLabel: "Close",
  },

  footer: {
    copyright: `© ${new Date().getFullYear()} Assembly Studio.`,
    legalLinks: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
};
