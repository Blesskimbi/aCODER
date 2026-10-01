# RESEARCH.md — what makes premium developer-tool sites feel premium

> **Method note — read this first.** The freebuff reference was examined directly: six CSS chunks parsed token-by-token, `index.html` class-frequency analysed, and the live site screenshotted at 1456px. `linear.app` loaded in the browser. **`zed.dev` and the remaining sites were blocked** — the Claude in Chrome extension returned *"Navigation to this domain is not allowed"*, and the galleries (godly.website, land-book.com, saaslandingpage.com, awwwards.com, mobbin.com) were not reachable either.
>
> Sections marked **[verified]** come from direct observation this session. Sections marked **[from knowledge]** are my own familiarity with these sites and are *not* freshly screenshotted. **To complete the in-browser competitive pass, grant those domains in the Chrome extension** and I will re-run it and update this file.

---

## 1. The reference: freebuff.com **[verified]**

Full numeric breakdown is in `DESIGN_SPEC.md`. What makes it work, and what does not:

**Works**
- **Light weights at large sizes.** A 52px hero at `font-normal`. 86 uses of `font-normal` against 1 of `font-semibold`. Confidence through restraint.
- **One background, depth by alpha.** Surfaces are `white/[0.02–0.08]`, borders never above `white/10`. No competing greys, so the page never looks muddy.
- **Barbell radii.** 3–5px on dense chrome, full pills on controls. The mockups read as *software*.
- **Software shown at real density.** The product panels use genuine 11–13px UI, not enlarged marketing renders. It reads as a real tool.
- **Two-band motion.** 90–340ms for interaction, 15–34s for atmosphere, nothing between. Alive when idle, crisp when touched.
- **The top-lit 1px shine.** A border lit 26% top / 8.5% side / 2.2% bottom. Physically plausible lighting on a flat border is most of the perceived quality.

**Does not work / rejected**
- **Landscape parallax art** (sky, hills, foreground bushes) — a pastoral register that fights a professional developer tool.
- **`text-white/30–40` for sustained body copy** — ~3.4:1, below WCAG AA.
- **Competitor-price framing** ("replaces these paid tools", `$0/yr` vs red bars). Effective, but adversarial and it dates fast.
- **A single 900px breakpoint** for the whole component layer.

---

## 2. The benchmark set **[from knowledge]**

| Site | The one thing it does best | Does it fit A-Coder? |
|---|---|---|
| **linear.app** | Ruthless typographic restraint and a near-monochrome palette with one electric accent. Gradients are used *once*, at the hero, and never again. Motion is short and expo-out. | **Yes** — accent discipline and the "one gradient moment" rule. |
| **vercel.com** | Geometric precision; pure black-and-white with functional colour only in product surfaces. Lots of hairline borders and grids. Dense documentation-grade information design. | **Partly** — hairline discipline yes, the total monochrome would waste A-Coder's metallic logo. |
| **raycast.com** | Shows the *actual app UI* at real density as the hero object, with a persistent command-palette motif running through the whole site. Playful accent gradients, dark canvas. | **Strongly** — A-Coder is also a keyboard-driven tool. The ⌘K palette motif is directly applicable. |
| **warp.dev** | A terminal rendered as a beautiful object; strong block colour; animated typing that demonstrates rather than describes. | **Yes** — the animated install terminal and the typing mockups. |
| **zed.dev** | Extreme performance-first minimalism; near-zero chrome; the editor itself is the hero; typography does all the work. Honest, technical, unadorned. | **Yes** — tone. Technical honesty over marketing gloss. |
| **cursor.com** | Ultra-clean dark minimalism; a large framed editor mockup; scroll-driven feature reveals; very tight, quiet type. | **Language yes, identity no** — the brief requires we not clone it, and Cursor is a named competitor. |
| **supabase.com** | Dense, generous bento grids where every card contains a live, working micro-demo rather than an icon. | **Yes** — directly shapes the bento section. |
| **resend.com** | The 3D Rubik's-cube hero: a procedurally modelled, continuously animating brand object that is *the* memorable element. Restrained everywhere else so the one moment lands. | **Feel only** — the model, code and assets are theirs. We take the principle: one signature animated object, everything else calm. |
| **arc.net** | Warm, human, high-craft gradients and generous whitespace; personality in the copy. | **Sparingly** — A-Coder's Learn Mode is the one place warmth belongs. |

---

## 3. The five patterns that actually create the premium feeling

Distilled from the above, and each mapped to a concrete decision.

**1. One accent, held under 5% of the pixels.**
Premium dark sites are 95% neutral. The accent appears on one CTA, one active state, one focus ring, one hero gradient — then stops. The amateur signal is accent everywhere. → A-Coder: accent on the primary CTA, the active tab, focus rings, diff-add lines, and the hero glow. Nowhere else.

**2. Light weights, large sizes, tight tracking.**
Nobody good sets a marketing hero at `font-bold`. 300–500 at 48–64px with `−0.02em` and `leading-[1.05–1.1]`. → A-Coder: 300 for display, 400 body, 500 for UI labels. The `.md` brief's `font-bold tracking-tight` is overridden.

**3. The product shown at real density.**
Raycast, Linear, Warp and Zed all show genuine UI at genuine size — 11–13px type, real row heights, real chrome. Blown-up "simplified" mockups read as fake. → A-Coder: every mockup is HTML/CSS at true IDE density, using the real token scale from `DESIGN.md`.

**4. Motion that demonstrates rather than decorates.**
The best sites animate *the thing the product does* — text being completed, a diff applying, a command running. → A-Coder: the bento cards animate autocomplete typing, a diff applying, the TOON counter shrinking, a terminal running. Each is a claim being proved.

**5. Exactly one memorable object.**
Resend has the cube. That single decision is worth more than fifty polished sections. → A-Coder: the 3D nested-triangle logo, which is already our real mark, and which *is* the product's identity rather than an arbitrary object.

---

## 4. Colour positioning — staying clear of everyone

| Brand | Accent | Hue |
|---|---|---|
| freebuff (reference) | `#7EFF3D` lime / `#9FB58C` sage | ~92–100° |
| Cursor | near-monochrome | — |
| Vercel | monochrome | — |
| Linear | indigo-violet | ~250–260° |
| Supabase | emerald | ~150° |
| Warp | coral / pink | ~350° |
| Zed | near-monochrome + blue | ~220° |
| **A-Coder** | **teal `#00B5B5`** | **~195°** |

**A-Coder's teal is not a taste choice — it is already the product's own accent.** `DESIGN.md` specifies `--void-accent-primary: oklch(0.7 0.12 195)` for the IDE and explicitly rejects the purple/indigo "AI gradient" (`#6366f1`) as "too vibrant for an IDE context". Using it on the site is exactly what the brief requires: product and site as one brand.

It is also, usefully, empty space. 195° sits between Supabase's emerald and Zed's blue, and nowhere near freebuff's lime or Linear's indigo. And it is the correct partner for a **brushed-steel** logo: cool metal wants a cool accent, and teal reads as an oxide/patina on steel rather than as a sticker on top of it.

---

## 5. Typography — free pairings

The reference's `"Google Sans"` is Google-internal and unusable. Candidates, all OFL:

| Face | Character | Note |
|---|---|---|
| **Outfit** | Geometric, generous apertures, variable 100–900 | Named in A-Coder's `DESIGN.md`; the reference download itself ships an `Outfit` directory |
| **Space Grotesk** | Neo-grotesque with mechanical quirks | Distinctive; pairs with a metallic, engineered mark |
| **Inter** | The neutral workhorse | Best body face; overexposed as a display face |
| **Instrument Sans** | Quiet, slightly condensed | Good neutral alternative |
| **JetBrains Mono** | The reference's own mono, and named in `DESIGN.md` | **Keep — it is already both products' mono** |

Geist is a strong candidate but is Vercel's house face; using it would borrow another company's voice. **Satoshi is not free for commercial use** (Indian Type Foundry, paid licence) despite being named in `DESIGN.md` — excluded.

---

## 6. What this means for A-Coder

1. Keep the reference's *structure* (tokens, rhythm, alpha depth, barbell radii, top-lit shine) and replace its *identity* entirely.
2. Take the accent from A-Coder's own `DESIGN.md`, not from a mood board.
3. Make the 3D logo the single memorable object and keep everything else calm.
4. Show real IDE density everywhere; animate only what proves a claim.
5. Be technically honest in tone — closer to Zed than to a growth-marketing page. It suits an Apache-2.0 project with 37 stars far better than manufactured social proof would.
6. Fix the reference's accessibility failure rather than inheriting it.
