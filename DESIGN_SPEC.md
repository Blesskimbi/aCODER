# DESIGN_SPEC.md — extracted from the freebuff.com reference

**Source:** `freebuff.com/` local download (HTML + 6 CSS chunks), cross-checked against the live site at 1456px.
**Purpose:** capture the reference's *design language* — tokens, proportions, rhythm, motion — as the structural base for the A-Coder site. No freebuff copy, imagery, logo or brand colour is carried over.

> **Reference-copy caveat.** The local download is incomplete. `_next/static/chunks/2vp2n-gigqhq2.css` (the Tailwind utility layer) and all four `.woff2` font files downloaded as 70–90 byte `"No Content: …"` stubs. The local page therefore renders unstyled (0 utility rules; `py-24` resolves to `0px`). Every token below is read from the **CSS chunks that did download intact**, and proportions were verified against the **live site**.

---

## 1. Colour tokens

The reference stores colour as bare HSL triplets consumed via `hsl(var(--token))`.

### 1.1 Neutral surface scale — *structural, adopted*

A pure-grey achromatic ramp (0% saturation throughout). This is a proportioning system, not an identity, so A-Coder adopts the *steps* and re-tunes the base.

| Token | HSL | Hex | Role |
|---|---|---|---|
| `--background` | `0 0% 3.9%` | `#0A0A0A` | page canvas |
| `--popover` | `0 0% 7.1%` | `#121212` | popovers, floating surfaces |
| `--card` | `0 0% 9%` | `#171717` | card / container fill |
| `--surface-workspace` | `0 0% 9.41%` | `#181818` | editor-chrome fill |
| `--muted` | `0 0% 11%` | `#1C1C1C` | muted fill |
| `--secondary` | `0 0% 12.9%` | `#212121` | secondary button fill |
| `--accent` | `0 0% 13.7%` | `#232323` | active / selected surface |
| `--border` | `0 0% 14.9%` | `#262626` | 1px structural border |
| `--ring` | `0 0% 32%` | `#525252` | focus ring |
| `--muted-foreground` | `0 0% 62%` | `#9E9E9E` | metadata |
| `--foreground` | `0 0% 92.2%` | `#EBEBEB` | primary text |

Note: `#EBEBEB`, not `#FFFFFF`. The reference never uses pure white for body text — that softness is a large part of why it reads as expensive.

Cool-tinted UI tokens coexist with the neutral ramp (hue 220):
`--content-secondary 220 9% 92%` · `--content-muted 220 7% 64%` · `--content-subtle 220 7% 64%` · `--content-disabled 220 7% 46%` · `--surface-hover 220 4% 24%` · `--surface-selected 220 4% 22%`

### 1.2 Alpha-layering system — *the actual mechanism, adopted*

In markup, surfaces and borders are overwhelmingly white-alpha over black rather than solid greys. Measured frequency across `index.html`:

- **Fills:** `bg-white/[0.02]` (6) · `[0.03]` (4) · `[0.04]` (14) · `[0.05]` (4) · `[0.06]` (1) · `[0.08]` (3) · `/10` (3) · `/15` (2)
- **Borders:** `border-white/[0.06]` (9) · `[0.07]` (1) · `[0.08]` (6) · `/10` (8)
- **Text:** `/20` (9) · `/30` (14) · `/35` (24) · `/40` (35) · `/45` (33) · `/50` (24) · `/55` (26) · `/60` (9) · `/70` (8) · `/75` (8) · `/85` (30) · `/90` (4) · `text-white` (65)

**Rule derived:** one background; depth comes from translucent white. Body copy sits at 40–55% white, headings at 85–100%, borders never exceed 10%.

### 1.3 Brand accent — *rejected, must not be reused*

| Token | HSL | Hex |
|---|---|---|
| `--brand` | `100 100% 62%` | `#7EFF3D` |
| `--primary` | `92 22% 63%` | `#9FB58C` |
| `--brand-1 / -2 / -3` | — | `#86956F` · `#B5CFA5` · `#E1E9D8` |
| forest RGBs | — | `rgb(157 181 139)` · `rgb(94 119 78)` · `rgb(130 150 111)` · `rgb(181 206 165)` |

Lime / sage / forest. **A-Coder takes none of it** — see `RESEARCH.md` §4 and the identity options.

### 1.4 Functional

`--warning 38 92% 50%` (`#F5A30A`) · `--warning-foreground 0 0% 8%` · `--scrim 0 0% 0%` at `--scrim-opacity .55`.

---

## 2. Type scale

**Fonts:** `--font-sans: "Google Sans", system-ui, arial` · `--font-mono: "JetBrains Mono", system-ui, arial` (fallback chunk: `ui-monospace, SFMono-Regular, Menlo, monospace`).

> **Google Sans is proprietary** (Google-internal, not published on Google Fonts) — it cannot be used. JetBrains Mono is OFL and is kept as-is. The sans replacement is chosen per identity option in §9 below; note the reference download itself ships an `Outfit` directory, and A-Coder's own `DESIGN.md` names *Geist, Outfit or Satoshi* — so **Outfit (OFL, variable)** is the convergent free choice.

### 2.1 Component scale (`fb-text-*`) — an application-UI scale

| Class | Size | Line-height | Tracking | Weight |
|---|---|---|---|---|
| `.fb-text-display` | 1.75rem / 28px | 1.25 | −.025em | 300 |
| `.fb-text-metric` | 1.75rem / 28px | 1.1 | −.03em | 300 |
| `.fb-text-title` | 1rem / 16px | 1.5 | −.01em | 500 |
| `.fb-text-heading` | .875rem / 14px | 1.4286 | — | 500 |
| `.fb-text-body` | .875rem / 14px | 1.4286 | — | 400 |
| `.fb-text-body-sm` | .8125rem / 13px | 1.3846 | — | 400 |
| `.fb-text-caption` | .75rem / 12px | 1.3333 | — | 500 |
| `.fb-text-micro` | .6875rem / 11px | 1.4545 | .02em | 500 |
| `.fb-text-mono` | .8125rem / 13px | 1.3846 | — | 400 |

Control type: `.fb-btn` 13px/450 −.005em · `.fb-btn--xs/--sm` 12px · `.fb-btn--xl` 14px · `.fb-input` 13px · `.fb-badge` 11px/500 .01em · `.fb-tab` 12px · `.fb-tooltip` 11px · `.kbd` 11px · `.codeblock` 12px/1.7 · `.avatar` 11px/600.

**Weight 450 on buttons** — an intermediate variable-font weight, so a variable font is required. Outfit is variable.

### 2.2 Editorial scale (landing markup, arbitrary px)

| Role | 390 | ≥768 | ≥1024 | Line-height |
|---|---|---|---|---|
| Hero H1 | 34px | 46px | 52px | `leading-[1.1]` |
| Hero H1 (largest variant) | 40px | 56px | 62px | `leading-[1.1]` |
| Section H2 | 28px | 38px | 44px | `leading-[1.15]` |
| Sub-head | 17px | — | — | `leading-snug` |
| Lead body | 15px | — | — | `leading-relaxed` |
| Body | 13–14px | — | — | `leading-relaxed` |
| Micro label | 10–11px | — | — | `tracking-[0.2em]`–`[0.25em]`, uppercase |
| Wordmark | `.fb-wordmark-text` 108.74px / 600 | | | |

**Weight distribution in markup:** `font-normal` ×86 · `font-medium` ×22 · `font-semibold` ×1 · `font-mono` ×20.

**This is the single most important finding.** The reference is a *light-weight* typographic system — a 52px hero set at weight 400. It never shouts. The `.md` brief's `font-bold` H1 would break the language; A-Coder uses 300–500 and lets size and space carry the hierarchy.

Tracking: `tracking-tight` ×2 · `tracking-wide` ×6 · `tracking-wider` ×5 · `tracking-[0.2em]` / `[0.22em]` / `[0.25em]` ×3 (uppercase eyebrows only).

---

## 3. Spacing scale

4px base, exposed as tokens:

`--space-0 0` · `0-5 2px` · `1 4px` · `1-5 6px` · `2 8px` · `2-5 10px` · `3 12px` · `3-5 14px` · `4 16px` · `5 20px` · `6 24px` · `8 32px` · `10 40px` · `12 48px` · `16 64px`

Control heights: `--control-h-xs 24px` · `sm 28px` · `md 32px` · `lg 36px` · `xl 40px`.

**Gap frequency (real usage):** `gap-2` (53) · `gap-3` (39) · `gap-1.5` (26) · `gap-4` (12) · `gap-1` (10) · `gap-x-2` (8) · `gap-10` (5) · `gap-x-7` (5) · `gap-y-5` (5) · `gap-6` (3) · `gap-12` (1).

Intra-component gaps live at 4–16px; only section-level grids reach 40–48px. **Dense inside, generous between.**

---

## 4. Layout & containers

- The component layer clamps at **900px** (`max-width: 900px`) — also the **only** media query in the entire CSS.
- Landing containers: `max-w-6xl` (1152px) ×6 dominant · `max-w-5xl` (1024px) ×3 · `max-w-3xl` / `2xl` / `xl` for prose · `max-w-md` / `sm` for cards.
- Horizontal padding: `px-4` → `sm:px-6` (16 → 24px).
- **Section vertical rhythm:** `py-24 md:py-32` (96 → 128px) standard; `md:py-36` (144px) ×5 for the widest breaks; `pt-40 md:pt-44` on the first section after the hero.
- Hero uses viewport-relative padding: `pt-[18vh] md:pt-[26vh]`, `pb-[42vh] sm:pb-[46vh]`.
- Grids: `md:grid-cols-2` ×6 · `grid-cols-2` ×5 · `sm:grid-cols-3` ×5, plus asymmetric `md:grid-cols-[1.35fr_1fr]` and `lg:grid-cols-[0.8fr_1.4fr]`.

**The asymmetric split is a signature.** Alternating `1.35fr / 1fr` copy-vs-mockup rows, separated by full-bleed hairlines, is the reference's core page pattern.

---

## 5. Radii

Tokens: `--radius-xs 4px` · `--radius-sm 6px` · `--radius-xl 12px` · `--radius-full 9999px` · `--radius 14px` · `--radius-control 8px→14px` · `--radius-card 12px→20px` · `--radius-popup 12px→18px` · `--radius-dialog 14px→24px` · `--radius-chrome-control 18px` · `--radius-composer 24px` · `--fx-radius 44 / 48 / 62px` (glow bloom only).

**Markup frequency:** `rounded-full` (69) · `rounded-[5px]` (47) · `rounded-md` (15) · `rounded-control` (12) · `rounded-2xl` (10) · `rounded-xl` (7) · `rounded-[3px]` (5).

**Rule derived — a barbell.** Tiny 3–5px radii on dense UI chrome (rows, chips, code lines) and full pills on buttons/badges, with little in between. The mid-range 12–24px is reserved for large panels. This is what makes the mockups read as *software* rather than as marketing cards.

---

## 6. Elevation, glow & glass

```css
--shadow-sm: 0 1px 2px #0006;
--shadow-md: 0 2px 6px #00000073;
--shadow-lg: 0 8px 24px -12px #000000b3;   /* note the -12px spread */
```

Shadows are pure black at 37–70% alpha. `--shadow-lg`'s negative spread tightens the contact shadow, so a large panel floats without a halo.

`backdrop-filter: blur(4px)` only — restrained. Scrim `#000` @ 55%.

### The "shine" system — the reference's signature effect

An animated conic border driven by a registered custom property, `@property --shine-angle`:

```css
--shine-strength: 1;
--shine-a-top:    calc(.26  * var(--shine-strength));
--shine-a-side:   calc(.085 * var(--shine-strength));
--shine-a-bottom: calc(.022 * var(--shine-strength));
--shine-a-inner:  calc(.055 * var(--shine-strength));
--shine-width: 1px;  --shine-turn: 180deg;  --shine-speed: 1.8s;
--shine-transition: --shine-angle var(--shine-speed) cubic-bezier(.32,.72,0,1),
                    --fx-radius   var(--fx-expand)   cubic-bezier(.22,.61,.36,1);
```

A 1px border lit top-heavy (26% top → 8.5% sides → 2.2% bottom), simulating a light source above. On hover the angle rotates 180° over 1.8s. Variants: `--reveal` (0→1 on hover/focus), `--static`, `--quiet` (.55), `--lift` (`translateY(-1px)`).

Glow bloom (`.fb-fx`): `--fx-core` / `--fx-mid` / `--fx-edge` at `#ffffff08` → `#ffffff03` → transparent, radius 44–62px. **White, never coloured.**

Shimmer (`--shim-*`): a 14%-wide, 100° sweep band, 1.8s, over a `#ffffff0e` track — used for loading and streaming states.

---

## 7. Motion

**Easings — the complete set present in the CSS:**

| Curve | Use |
|---|---|
| `cubic-bezier(.32,.72,0,1)` | shine rotation — decelerating |
| `cubic-bezier(.22,1,.36,1)` | expo-out, the general UI curve |
| `cubic-bezier(.22,.61,.36,1)` | radius expansion |
| `cubic-bezier(.25,.7,.3,1)` | soft settle |
| `cubic-bezier(.34,1.56,.64,1)` | **overshoot** — toggles / switches only |
| `cubic-bezier(.4,0,1,1)` | ease-in, exits |

**Durations:** micro `10ms` / `90ms`; `--fx-expand .6s` · `--fx-hold 70ms` · `--fx-collapse .34s` · `--fx-fade .3s`; shine & shimmer `1.8s`; ambient loops `2s, 3s, 15s, 16s, 18s, 22s, 28s, 34s`.

**Rule derived:** interaction lives at 90–340ms, atmosphere at 15–34s, and nothing sits in between. Those long loops (parallax, drift, smoke) are what make the page feel alive while idle.

**Keyframes present:** `fb-fade-in/out` · `fb-dialog-in/out` · `fb-toast-in/out` · `fb-shim-sweep` · `fb-shim-blink` · `fb-shim-pulse` · `fb-shim-rot`.

`--fx-hold: 70ms` is a deliberate pause between expand and collapse — mechanical, not rubbery. This is carried directly into the Phase 2 logo sequencer.

---

## 8. Components & states

**Nav** — `fixed inset-x-0 top-0 z-50`, GPU-promoted. Wordmark left · centred text links · GitHub star pill · icon links · solid white pill CTA right. 56–64px tall, hairline bottom border, blurs on scroll.

**Buttons** — `.fb-btn` 13px/450, `--radius-control`, heights from `--control-h-*`. Primary = solid fill with dark text. Ghost = `::before` overlay 0→1. `--lift` = `translateY(-1px)`; `:active` = `scale(.98)` at 50ms.

**Cards** — `--radius-card`, `bg-white/[0.02–0.04]`, `border-white/[0.06–0.08]`; hover lifts the *border only*, with no internal glow.

**Window-chrome mockups** — the reference's primary visual device. Three traffic-light dots, a title, a hairline, a dark body around `#0D0D10`, `--shadow-lg`. Content inside is *real UI at real density* (11–13px mono, `rounded-[3px]` rows).

**Tabs** — `.fb-tabs` / `.fb-tab` 12px, pill track, active = raised surface. Instant swap, no layout shift.

**Badges** — `.fb-badge` 11px/500, `.01em`, pill.

**Code blocks** — `.codeblock` 12px with 1.7 line-height.

**Kbd** — `.kbd` 11px, `rounded-[3px]`.

---

## 9. Landing section order (as built)

1. Fixed header
2. **Hero** — full-bleed, `isolate overflow-hidden`, layered parallax (sky / hills / foreground), centred light headline with one accented word, sub-line, segmented tab pills, one wide primary CTA, fine print
3. Comparison panel — dark card with horizontal bars
4. `px-4 pb-10` — marquee / logo band
5. `py-10` — narrow strip
6. `pt-24 pb-12 md:pt-32` — first alternating feature row
7. `py-16 md:py-20` — second row
8. `#blog` — `py-24 md:py-32`
9. `py-24 md:py-32`
10. `py-24 md:py-32`
11. Final CTA — `overflow-hidden`
12. Footer nav — centred wrap, 13px, `text-white/45`

**Alternating row anatomy** (repeated verbatim ×3 on the live site): `NEW` badge → 44–56px light headline with one accent word → 15px lead → uppercase 11px eyebrow → 2–3 column item grid → CTA, paired with a window-chrome mockup opposite. A hairline separates every row.

---

## 10. What A-Coder keeps / changes / rejects

| | Decision |
|---|---|
| **Keep** | achromatic surface ramp; white-alpha depth; light editorial weights (300–500); 4px spacing; barbell radii; shine border with top-lit 1px; `--shadow-lg` negative spread; `py-24 / md:py-32` rhythm; asymmetric `1.35fr / 1fr` rows with hairlines; window-chrome mockups at real UI density; two-band motion (90–340ms / 15–34s); `--fx-hold 70ms` |
| **Change** | single 900px breakpoint → a 390 / 768 / 1024 / 1280 / 1536 ladder; 1152px content container; `#0A0A0A` → a warmer near-black tuned to the metallic logo; add the missing 15–24px radius tier for bento cards; white-only glow → one restrained accent glow |
| **Reject** | the lime / sage / forest brand ramp; "Google Sans"; landscape & parallax nature art (wrong register for a developer IDE); the ad-funded, "replaces these paid tools" competitive framing; all freebuff copy, imagery and logos |
| **Add** | 3D logo hero; ⌘K palette; scroll-driven product tour; bento grid with live micro-animations; light/dark toggle (the reference is dark-only); a WCAG AA pass |

### Accessibility correction

`text-white/40` on `#0A0A0A` is roughly **3.4:1** — below the 4.5:1 AA minimum for body text, and the reference uses it heavily. A-Coder keeps the *look* but floors sustained body copy at `white/60` (≈6.5:1), reserving `/35–45` for decorative or large text only.
