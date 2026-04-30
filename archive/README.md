# Hero visual archive

Snapshots of earlier hero visuals so we can iterate without losing prior work.

## `hero-portal-v1` — full-bleed portal showcase

Files:
- [`HeroPromptToApp.portal-v1.jsx`](HeroPromptToApp.portal-v1.jsx) — the React component
- [`hero-portal-v1.css`](hero-portal-v1.css) — the matching `hpd-*` keyframes and animation classes

What it does: oversized BrandMages portal mock anchored at the bottom of the hero, bleeding past the section edge. Sidebar opens with brand + Home + Messages, then On-Boarding, Payments, and Helpdesk slide in over time. The main view shows a per-app top bar (Home → On-Boarding → Payments → Helpdesk) with crossfading content. A "Build an app" composer floats at the upper-right, breaking out of the portal frame; three prompts type in with a generating shimmer between typing and the matching app appearing in the sidebar, and a teaser idle state ("Start typing to build a new idea…" with a blinking cursor) lands once the three apps are placed.

### Restoring this version

1. Copy the component back:
   ```
   cp archive/HeroPromptToApp.portal-v1.jsx app/components/HeroPromptToApp.jsx
   ```
2. Make sure the `hpd-*` rules in `archive/hero-portal-v1.css` are present in `app/globals.css`. If they were edited or removed for the new version, paste this block back into globals.css just below the `.hls-pill` reduced-motion rule (around line 502 in the original layout).
3. Confirm the `Hero.jsx` is still rendering `<HeroPromptToApp />` inside the full-bleed wrapper and that the alpha-logos strip is positioned at `absolute inset-x-0 bottom-0`.
