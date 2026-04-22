// All page copy for Assembly Studio V1.
// Clone this file (e.g. home-variant-b.js) and swap import in app/page.js for variants.

export const HOME_CONTENT = {
  hero: {
    heading:
      "Deliver tailored client experiences without rebuilding the fundamentals",
    subheading:
      "Assembly Studio lets you deliver tailor-made client experiences with an app builder, on top of a foundation that includes a CRM, client portal, payments, messaging, and more.",
  },

  whyAssemblyStudio: {
    // Display headline is split in two: the primary statement renders at
    // full weight, and the `callout` continues inline at reduced opacity
    // (V7-style). Together they read as one sentence — "Assembly Studio
    // is not just another app builder" — with visual emphasis on the
    // first half.
    heading: "Assembly Studio is not",
    callout: "just another app builder",
    body: [
      "Other app builders are great for internal tools, prototypes, and websites. But if you're serving real paying clients, you don't need one vibe-coded app. You need a polished, branded, secure, and consolidated client experience.",
      "Our app builder is the only one that understands your business. Describe what you want: a custom intake flow, a progress tracker, a proposal tool. It builds an app that works with your existing contacts and companies, respects your permissions, and integrates with email and in-product notifications. Every app deploys straight into your client experience, not as a standalone tool on a separate URL, but as a native part of your firm.",
      "And underneath it all, a real platform. Assembly Studio gives you a CRM for your team, a branded portal for clients, integrated notifications, and permissions, plus a library of reviewed apps you can one-click enable. Every piece is designed to work together, so the client experience you deliver feels cohesive and complete.",
    ],
  },

  logoStrip: {
    label: "Trusted by teams at",
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
      menuLabel: "AI builder",
      heading: "Describe an idea, watch it come alive",
      body: "Start from a template or describe your own app in plain English. Assembly generates a secure app and publishes it to your client portal. No code, no deploy step, no infrastructure to wire up.",
      visualKey: "threeSteps",
    },
    {
      layout: "split",
      orientation: "text-right",
      menuLabel: "Client experience",
      heading: "Where your apps meet your clients",
      body: "Every client sees a portal built from native Assembly apps and the ones you built yourself, organized into folders, scoped per client, branded as yours.",
      visualKey: "infrastructure",
    },
    {
      layout: "stacked",
      menuLabel: "Internal dashboard",
      heading: "Your team's command center",
      body: "Behind the portal, your team's command center. A CRM with contacts and companies, custom fields, internal notes, a unified notification center, automations, and every custom app you built ships with an internal view for your team, too.",
      visualKey: "studioApp",
    },
  ],

  comparison: {
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
    heading: "What alpha testers are saying",
    // Subheading intentionally omitted — the design lands on the heading
    // alone, no supporting line.
    quotes: [
      {
        body: "We replaced three tools and a half-finished Lovable project with one Assembly Studio workspace. Clients see a polished portal, not a prototype.",
        name: "Maya Chen",
        title: "Partner",
        company: "Archer & Co",
      },
      {
        body: "Auth, permissions, billing. The stuff that normally kills a weekend project was just there.",
        name: "Jordan Reyes",
        title: "Founder",
        company: "Pennant Advisory",
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
    heading: "Frequently asked questions",
    items: [
      {
        q: "How do I get access to Assembly Studio?",
        a: "Assembly Studio is in pre-launch. Join the waitlist above with your work email and we'll open seats in waves, earliest firms first. Signing up before launch locks in $100 of build credits.",
      },
      {
        q: "What does it cost?",
        a: "Assembly Studio includes the full foundation (CRM, portal, auth, permissions, messaging, payments) on a flat per-workspace plan. Custom apps run on metered build credits; waitlist members get $100 to start. Full pricing will be published at launch.",
      },
      {
        q: "How secure is it?",
        a: "Every workspace runs on one permissions layer with row-level client scoping on by default, magic-link and SSO auth, encrypted data at rest and in transit, and audit logs. SOC 2 Type II is in progress; region-pinned data is available on Enterprise.",
      },
      {
        q: "Can I get help building features?",
        a: "Yes. Assembly Studio ships with a library of 21 reviewed apps you can enable with one click. For bespoke work, our solutions team and partner network can build alongside you, and everything they build lives on the same platform as the rest of your workspace.",
      },
      {
        q: "What if I already have an Assembly workspace?",
        a: "Assembly Studio slots directly into your existing workspace: same CRM, same portal, same clients. When you get access, you'll see it appear in your sidebar. No migration needed.",
      },
    ],
  },

  finalCta: {
    heading: "Reserve your seat",
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
