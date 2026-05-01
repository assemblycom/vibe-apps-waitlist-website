// All page copy for Assembly Studio V1.
// Clone this file (e.g. home-variant-b.js) and swap import in app/page.js for variants.

export const HOME_CONTENT = {
  hero: {
    heading: "The AI app builder for client-facing experiences",
    subheading:
      "Build apps in minutes, or pick from a library of pre-built ones. Each one deploys to your client portal and inherits your contacts, permissions, and preferences.",
  },

  whyAssemblyStudio: {
    // Display headline is split in two: the primary statement renders at
    // full weight, and the `callout` continues inline at reduced opacity
    // (V7-style).
    heading: "Assembly Studio is not just",
    callout: "another app builder",
    // Body paragraphs support inline emphasis via `{ u: "text" }` segments,
    // which render as underlined phrases. Plain strings are passed
    // through as-is. NarrativeBlock flattens arrays paragraph-by-paragraph.
    body: [
      [
        "Today's app builders are great for internal tools, websites, and one-off apps. But if you're serving real paying clients, you don't want a single isolated app. You want a ",
        {
          u: "unified",
          preview: {
            side: "left",
            visual: "qualityBadge",
            visualProps: { label: "One workspace" },
            body: "Every app you build shows up as part of an integrated experience in your client-facing portal. Apps can be grouped into folders, surface notifications the same way, and combine into a cohesive experience.",
          },
        },
        ", ",
        {
          u: "reliable",
          preview: {
            side: "left",
            visual: "qualityBadge",
            visualProps: { label: "99.9% uptime" },
            body: "Apps deploy into a secure, production-grade client experience. So when one app misbehaves, clients can still authenticate and use built-in features like messaging and payments.",
          },
        },
        ", and ",
        {
          u: "polished",
          preview: {
            side: "right",
            visual: "qualityBadge",
            visualProps: { label: "Production-ready" },
            body: "Your client experience is fully brandable, and the apps you generate automatically combine your brand language with our app design system.",
          },
        },
        " client experience.",
      ],
      [
        "Describe what you want — a client onboarding wizard, a approvals workflow, a client community space. From there, Assembly Studio generates an app that works with your ",
        {
          u: "existing contacts and team",
          preview: {
            side: "left",
            visual: "contacts",
            body: "When you build a new app it automatically works with the contacts and companies in your CRM and the internal users on your team. You don't have to rebuild these primitives for each new app.",
          },
        },
        ", ",
        {
          u: "respects your permissions",
          preview: {
            side: "right",
            visual: "permissions",
            body: "For each app, control which clients can access it. This lets you create tiered client experiences — for trial vs. paying clients, clients in different industries, clients on different subscription plans, and more.",
          },
        },
        ", and ",
        {
          u: "seamlessly integrates notifications",
          preview: {
            side: "left",
            visual: "notifications",
            body: "Every app surfaces notifications the same way. In your portal, a counter appears next to the app name in the sidebar. Over email, clients get white-labeled notifications with magic-link actions for seamless login.",
          },
        },
        ". Every app deploys straight into your portal, not as a standalone tool on a separate URL, but as a native part of your client experience. Authentication, permissions, client identity, branding — all handled automatically.",
      ],
      [
        "And you don't have to build everything yourself. Assembly ships with a ",
        {
          u: "library of vetted apps",
          preview: {
            side: "right",
            visual: "library",
            body: "You don't have to build everything from scratch. For example, you can enable our Messages App in one click to let clients seamlessly communicate with you and reply directly via email. Our app library now has 20 apps and counting.",
          },
        },
        " that you can enable in one click — for client messaging, payments, proposals, project management, and more. Don't rebuild the 80% that's been perfected over years of iteration. Focus on the 20% that makes you different.",
      ],
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
      menuLabel: "AI builder",
      heading: "Describe an app, ship it in minutes",
      body: "Start from a template or describe your own app in plain English. Assembly generates a secure app you can publish to your client portal in one click. No code, no infrastructure, no developer required.",
      visualKey: "threeSteps",
    },
    {
      layout: "split",
      orientation: "text-right",
      menuLabel: "Client experience",
      heading: "A branded portal your clients actually want to use",
      body: "Native Assembly apps and the ones you build live side by side in a portal that's branded as your firm. Organize apps into folders on the sidebar and set permissions so every client sees only what's meant for them.",
      visualKey: "clientPortal",
    },
    {
      layout: "stacked",
      menuLabel: "Internal dashboard",
      heading: "Your team's command center",
      body: "Manage contacts and companies in a built-in CRM. Stay on top of activity with a unified notification center. And every app you build ships with an internal view for your team — automatically.",
      visualKey: "studioApp",
    },
  ],

  comparison: {
    // Heading splits onto two lines: primary claim on top, a dimmed
    // "coda" below — mirrors the NarrativeBlock headline pattern.
    heading: "Built for",
    headingCallout: "client experiences",
    leftLabel: "Lovable / Base44",
    rightLabel: "Assembly Studio",
    // Rows are [rowLabel, competitor, assembly, mobileFeature?]. The
    // first three drive the desktop 3-col grid where the axis label
    // carries the comparison. Mobile renders as a Studio-only
    // checklist, so the optional 4th element rephrases the Assembly
    // answer as a standalone statement — reads naturally without the
    // axis as scaffolding.
    rows: [
      [
        "What it's for",
        "Internal tools, websites, one-off apps",
        "Authenticated client-facing experiences",
        "Built for authenticated client-facing experiences",
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
        "CRM, portal, 30+ primitives, 20+ apps",
        "CRM, portal, 30+ primitives, and 20+ apps included",
      ],
      [
        "What if one app fails?",
        "The core client experience goes down",
        "The core client experience remains active",
        "Core client experience stays up if one app fails",
      ],
      [
        "Best fit when",
        "Building a one-off app",
        "Deliver a consolidated client experience",
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
        a: "We're rolling out access in waves. Waitlist members get first access, and founding members get extra perks like a founding member plan and personalized onboarding.",
      },
      {
        q: "What can I actually build?",
        a: "Assembly Studio is a particularly good fit for anything you'd want your clients to interact with. The specifics vary by firm — accounting firms might build year-end checklist apps, consulting firms build deliverable review flows, law firms build case status trackers, marketing agencies build campaign approval flows, interior design firms build mood board approvals. If you can describe a workflow you run with clients, you can probably build it as an app.",
      },
      {
        q: "Do I need to know how to code?",
        a: "No. Describe the app you want in plain English and Assembly Studio generates it. Iterate by chatting — no code required.",
      },
      {
        q: "What if I already have an Assembly.com workspace?",
        a: [
          "For now, Assembly Studio is a standalone product. If you're invited to create an Assembly Studio workspace, it'll be separate from your existing ",
          { link: "Assembly.com", href: "http://assembly.com" },
          " workspace, and the two can't be combined. Longer term, Assembly Studio features will roll out to everyone.",
        ],
      },
      {
        q: "How do I get in touch with the team?",
        a: [
          "For questions about Assembly Studio, email us at ",
          {
            link: "assemblystudio@assembly.com",
            href: "mailto:assemblystudio@assembly.com",
          },
          ".",
        ],
      },
    ],
  },

  finalCta: {
    heading: "Reserve your seat",
    subheading:
      "Reserve your seat to become a founding member — with an exclusive plan, personalized onboarding, and direct access to our team.",
  },

  // Post-submit modal that appears after the user enters an email in
  // any EmailCTA instance. The email submit is confirmed in the modal
  // header; this array drives three optional follow-ups below it.
  waitlistModal: {
    heading: "You're on the list",
    subheading:
      "Unlock early access perks by completing the steps below.",
    // First step is auto-complete: the email is already in. Subsequent
    // steps each advertise the perk unlocked by completing them.
    emailStep: {
      title: "Email submitted",
      subtitle: "You're on the waitlist!",
    },
    allCompleteLabel: "All perks unlocked — you're on the next cohort.",
    // Each follow-up is a single-click external action: opens a URL in
    // a new tab and marks the row complete. `prefillEmail` appends the
    // submitted email to the URL fragment as `#email=…` (Typeform's
    // hidden-field convention).
    items: [
      {
        id: "survey",
        title: "Answer short survey",
        effort: "3 minutes",
        reward: "Even earlier access",
        url: "https://assemblycom.typeform.com/to/x5QfEJKM",
        prefillEmail: true,
        completedLabel: "Even earlier access unlocked",
      },
      {
        id: "community",
        title: "Join beta community",
        effort: "Requires Slack",
        reward: "Shape the roadmap",
        url: "https://assembly.com/assembly-studio-community",
        completedLabel: "Roadmap access unlocked",
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
