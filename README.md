# A-Coder — marketing site

Marketing site for [A-Coder IDE](https://github.com/hamishfromatech/A-Coder), an
open-source AI-native code editor built on VS Code.

Dark, type-led, and built so that every claim on the page can be traced back to
the product repository.

---

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript, `strict` |
| Styling | Tailwind CSS v4 — CSS-first config, tokens in `globals.css` |
| 3D | `three` · `@react-three/fiber` · `@react-three/drei` · `@react-three/postprocessing` |
| Motion | `motion` (Framer Motion) |
| Icons | `lucide-react` |
| Fonts | `next/font` — Space Grotesk (display), Inter (body), JetBrains Mono |
| Deploy | Vercel |

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint         # eslint
npx tsc --noEmit     # typecheck
```

Node 22+.

## Structure

```
src/
  app/                    routes — /, /download, /changelog, /pricing,
                          /security, /docs, 404, sitemap, robots
    globals.css           ALL design tokens + the shared effect layer
  components/
    sections/             one file per landing section
    mockups/              HTML/CSS IDE mockups (no screenshots yet)
    logo3d/               procedural 3D mark + twist sequencer
    footer/               footer wordmark
    site/                 nav, footer, shared chrome
    ui/                   primitives (Button, Card, Container, …)
  content/                all copy and data
  lib/                    GitHub API, site config, hooks
scripts/
  verify-sequence.mjs     proves the logo animation always resolves
```

### Where things live

- **Design tokens** — `src/app/globals.css`. Colour ramps, type, radii, shadows,
  easings and the `.rake-*` / `.card` / `.fade-*` effect classes are all here.
  Nothing is hard-coded in components.
- **Copy and data** — `src/content/`. `product.ts` holds every product claim,
  `providerIcons.ts` the provider marks, `testimonials.ts` the placeholders.
- **Site config** — `src/lib/site.ts`. URLs, install commands, feature flags.
- **Live GitHub data** — `src/lib/github.ts`. Stars, releases, contributors and
  download artefacts, fetched at build time with hourly ISR and fallbacks.

## Content rules

The site follows a few rules deliberately, and they are worth keeping:

- **Nothing is invented.** Every feature claim traces to the A-Coder repository.
  Where the repo is ambiguous or contradicts itself, it is recorded in
  `PRODUCT_NOTES.md` rather than guessed at.
- **No manufactured social proof.** Star and fork counts are real numbers from
  the GitHub API, shown as facts.
- **Testimonials are placeholders** and labelled as such. Toggle with
  `SHOW_TESTIMONIALS` in `src/lib/site.ts`.
- **Download links are enumerated from the live release**, never hard-coded, so
  the page cannot drift from what is actually published.
- **Australian English** throughout.

## Accessibility

Body copy is floored at `white/60` (≈6.5:1 on the canvas) to hold WCAG AA. The
full page was audited by resolving each element's real backdrop and compositing
alpha — note that Tailwind v4 emits `oklch()`, so any contrast tooling must
resolve colours through the browser rather than parsing the string.

`prefers-reduced-motion` is honoured by every animated component.

## Working documents

- `DESIGN_SPEC.md` — the reference design system, extracted token by token
- `RESEARCH.md` — competitive analysis and what premium actually consists of
- `PRODUCT_NOTES.md` — the product source of truth, **including open questions**
- `PLAN.md` — scope, decisions taken, and what is still needed

## Licence

The A-Coder editor is Apache-2.0. This site is a separate work; provider marks
in `public/providers/` are the trademarks of their respective owners and are
used referentially to indicate supported integrations.
