# PLAN.md — A-Coder marketing site

Phase 1 deliverable. **Nothing is built until you pick an identity.**

Companion documents: `DESIGN_SPEC.md` (reference tokens), `RESEARCH.md` (competitive), `PRODUCT_NOTES.md` (copy source of truth), `identity-options.html` (the three directions, rendered).

---

## 1. Keep / change / add

### Keep from the freebuff reference
Its *structure*, not its identity. Achromatic surface ramp · white-alpha depth layering · light editorial weights (300–500) · 4px spacing scale · barbell radii (3–5px chrome, full pills, 12–24px panels) · the top-lit 1px shine border · `--shadow-lg` negative spread · `py-24 md:py-32` section rhythm · asymmetric `1.35fr / 1fr` rows with hairline separators · window-chrome mockups at real UI density · two-band motion (90–340ms interaction / 15–34s atmosphere) · the 70ms mechanical hold.

### Change
- Single 900px breakpoint → a **390 / 768 / 1024 / 1280 / 1536** ladder
- 1152px content container (`max-w-6xl`), 1024px for docs and changelog
- `#0A0A0A` → a near-black tuned to the metallic logo
- Add the missing **15–24px radius tier** the reference lacks, for bento cards
- White-only glow → **one** restrained accent glow, used once in the hero
- **Fix the accessibility failure**: the reference sets body copy at `white/30–40` (≈3.4:1, below AA). A-Coder floors sustained body copy at `white/60` (≈6.5:1) and reserves `/35–45` for decorative or large text.

### Reject
The lime/sage/forest brand ramp · "Google Sans" (proprietary) · landscape/parallax nature art · the ad-funded "replaces these paid tools" competitive framing · all freebuff copy, imagery and logos.

### Add
3D nested-triangle logo hero · site-wide ⌘K palette · scroll-driven product tour · bento grid with live micro-animations · light/dark toggle (reference is dark-only) · full WCAG AA pass.

---

## 2. Identity — pick one

Rendered side by side in `identity-options.html`. Summary:

| | **A · Aperture** ← recommended | **B · Raking Light** | **C · Blueprint** |
|---|---|---|---|
| Accent | Teal `#00B5B5` | Steel + ember `#FF8A4C` | Teal `#00B5B5` as line |
| Type | Outfit 300 + Inter + JetBrains Mono | Space Grotesk + Inter + JBM | Outfit 200, mono-forward |
| Motif | Nested-triangle **aperture** | The **raking light** itself | Technical **grid** |
| Risk | Teal is a common dev-tool accent | **Contradicts the IDE's own accent** | Wireframe fights a volumetric logo |

**I recommend A.** Not on taste — `DESIGN.md` in the A-Coder repo already specifies `--void-accent-primary: oklch(0.7 0.12 195)` (= `#00B5B5`) as the IDE's accent and explicitly rejects the purple/indigo "AI gradient". Using it makes site and product one brand by construction, which is what the brief asks for. It is also clear of freebuff's lime, Cursor's monochrome, Linear's indigo and Supabase's emerald, and cool teal is the right partner for brushed steel.

B is the most distinctive but would put the site at odds with the app. C keeps the correct colour but its flat wireframe language undercuts the solid, lit, volumetric logo that Phase 2 is built around.

---

## 3. Build phases

**Phase 2 — 3D logo.** Procedural nested-triangle rebuild on `/lab/logo` first: 7 extruded bevelled ring frames, 3 segments each with varied corner gaps, gear details at joints, `MeshPhysicalMaterial` brushed steel, studio HDRI, top-left key + rim. Sequencer in `useTwistSequence` — assembled → scramble (6–8 moves) → hold → exact reverse → assembled, ±120° Z twists and 180° median flips so it always lands correct. `next/dynamic` `ssr:false` after hero text paints, DPR cap 1.5, off-screen pause, `prefers-reduced-motion` static, no-WebGL poster fallback. **Recording for your review before it enters the hero.**

**Phase 3 — pages.** `/` (16 sections per the brief), `/download`, `/changelog`, `/pricing`, `/security`, `/docs`, styled `404`.

**Phase 4 — production.** SEO + `next/og` images + sitemap + JSON-LD · Lighthouse 95+ · WCAG AA · strict TS, ESLint/Prettier clean · analytics hook · `README.md`.

**Stack:** Next.js App Router + TypeScript strict · Tailwind with tokens as CSS variables · Framer Motion · lucide-react · `next/font` · `next/image` · three + @react-three/fiber + drei + postprocessing.

---

## 4. Scope decisions I have made

1. **No `/cli`, `/desktop` or `/models` pages.** The `.md` spec in the reference folder describes a second product — a "Pi engine" terminal agent at `hamishfromatech/a-coder-cli`, `npm i -g @a-coder/cli`, `a-coder.dev`. None of it is verifiable from the A-Coder repo, and the brief forbids inventing features. I am building the page set from your ROLE brief instead. **Give me the CLI repo and I will add those pages.**

2. **Provider names, not model SKUs.** The `.md` spec names "Claude 3.7 Sonnet", "GPT-4o", "o3-mini", "Gemini 2.0". None appear in the repo, and version claims date badly.

3. **No manufactured social proof.** 37 stars and 3 forks, shown as live facts from the GitHub API. Testimonials ship as labelled placeholders behind `SHOW_TESTIMONIALS`, off in production.

4. **Headline weight overridden.** The `.md` spec calls for `font-bold` H1; the reference uses `font-normal` 86 times against `font-semibold` once. I am following the reference.

5. **Comparison table = verifiable facts only** (licence, open source, local models, direct-to-provider, price). Anything requiring a claim about a competitor's data handling is listed for you to confirm, not asserted.

---

## 5. Blocking questions

**Please answer 1 and 2** — the rest I will proceed on with the stated assumption.

1. **Which identity — A, B or C?**
2. **Licence: Apache-2.0 or MIT?** `LICENSE.txt` and GitHub say Apache-2.0; `product.json` says MIT. I will publish **Apache-2.0** unless told otherwise — and the `product.json` field looks like an unfixed Void leftover worth correcting in the repo.

Proceeding on assumption unless you say otherwise:

3. **Third mode is "Agent"** (README) not "Code" (docs/README).
4. **No absolute zero-telemetry claim.** I will write the architectural fact — direct-to-provider, no A-Coder intermediary, your keys, your machine — and not "zero telemetry / zero retention", which the repo does not substantiate. See `PRODUCT_NOTES.md` §6.
5. **TOON presented as opt-in** (`enableToolResultTOON` defaults to `false`) with its real measured ranges.
6. **`/changelog` sourced from the GitHub Releases API**, since `docs/release-notes.md` stops at v1.7.0 while releases run to 1.9.15.

---

## 6. What I will need from you later

Real IDE screenshots (I will write `public/screenshots/README.md` listing exact shots and dimensions) · end-user system requirements for the FAQ · real testimonials or leave the section off · domain · analytics choice · any future pricing tiers.

---

## 7. Two environment issues

1. **The reference download is incomplete.** `_next/static/chunks/2vp2n-gigqhq2.css` (the Tailwind utility layer) and all four `.woff2` fonts are 70–90 byte `"No Content: …"` stubs, so the local copy renders unstyled. I extracted every token from the six CSS chunks that did survive and verified proportions against the live site, so this did not block the spec — but a complete re-download would let me diff pixel-for-pixel during Phase 3.

2. **Browser domain permissions.** `linear.app` loaded, but `zed.dev` and the galleries returned *"Navigation to this domain is not allowed"*. `RESEARCH.md` marks every section as **[verified]** or **[from knowledge]** accordingly. Allow those domains in the Claude in Chrome extension and I will re-run the competitive pass and update the file.
