import type { Metadata } from "next";
import Image from "next/image";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Card, Badge, ExtArrow } from "@/components/ui/primitives";
import { SpecTable, SourceNote, Callout } from "@/components/ui/blocks";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Brand",
  description:
    "The A-Coder name, logo, colour palette and typography, with the rules for using them.",
};

/* Palette values are the real tokens from globals.css — a brand page
   that drifts from the stylesheet is worse than no brand page. */
const STEEL = [
  ["steel-50", "#F2F5F8"],
  ["steel-100", "#E2E8EE"],
  ["steel-200", "#C9D2DB"],
  ["steel-300", "#AEB8C2"],
  ["steel-400", "#8A939C"],
  ["steel-500", "#6B737B"],
  ["steel-600", "#4A5058"],
  ["steel-700", "#33383E"],
  ["steel-800", "#202428"],
  ["steel-900", "#14171A"],
  ["steel-950", "#0A0A0B"],
];

const EMBER = [
  ["ember-100", "#FFD0B8"],
  ["ember-200", "#FFB088"],
  ["ember-300", "#FF9A66"],
  ["ember-400", "#FF8A4C"],
  ["ember-500", "#F2701F"],
  ["ember-600", "#C85A18"],
  ["ember-700", "#7A3C1E"],
];

const PRODUCT = [
  ["ide-teal", "#00B5B5"],
  ["ide-teal-lit", "#2AD7D7"],
];

const TYPE = [
  ["Display", "Space Grotesk", "Headings. Light weights at large sizes — 300 and 400, never bold."],
  ["Body", "Inter", "Body copy and UI labels."],
  ["Mono", "JetBrains Mono", "Code, tool names, eyebrows, counters and version strings."],
];

const NAMING = [
  ["A-Coder", "Correct", "Capital A, hyphen, capital C."],
  ["A-Coder IDE", "Correct", "The full product name, used on first mention."],
  ["ACoder", "Wrong", "The hyphen is part of the name."],
  ["a-coder", "Code only", "The binary name, the data folder and the URL protocol. Not prose."],
  ["A Coder", "Wrong", "Space instead of a hyphen."],
  ["Acoder", "Wrong", "Missing hyphen and capital."],
];

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="min-w-0">
      <div
        className="h-16 rounded-lg border border-white/[0.08]"
        style={{ backgroundColor: hex }}
      />
      <p className="mt-2 truncate font-mono text-[11px] text-white/68">
        {name}
      </p>
      <p className="font-mono text-[10.5px] uppercase text-white/42">{hex}</p>
    </div>
  );
}

export default function BrandPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Brand"
        title="The name, the mark, the palette."
        lead="A-Coder is Apache-2.0, so the code is yours to fork. The name and logo are how people tell your fork from the original, so those have rules."
      />

      <Container className="max-w-[960px]">
        {/* ── Logo ───────────────────────────────────────────────── */}
        <section id="logo" className="scroll-mt-28">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            The mark
          </h2>
          <p className="mt-3 max-w-[64ch] text-[14px] leading-relaxed text-white/60">
            A brushed-steel triangle of nested concentric triangular frames, each
            ring broken into segments with gaps at varying corners, thinning
            toward a bright open centre and lit from the upper left.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <Card className="flex items-center justify-center p-10" interactive={false}>
              <Image
                src="/brand/a-coder-logo.png"
                alt="The A-Coder logo: nested broken triangular frames in brushed steel"
                width={200}
                height={200}
                className="h-auto w-[160px]"
              />
            </Card>
            <Card className="p-7" interactive={false}>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                Using it
              </h3>
              <ul className="mt-4 space-y-2.5">
                {[
                  "Keep clear space around the mark of at least a quarter of its width.",
                  "Place it on a dark ground. The mark is lit for dark backgrounds and loses its form on white.",
                  "Do not recolour it, add effects, or rotate it — the lighting direction is part of the mark.",
                  "Do not stretch it. Scale proportionally.",
                  "Do not place it on a busy image without a solid plate behind it.",
                ].map((r) => (
                  <li key={r} className="flex gap-2.5 text-[13px] leading-relaxed">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ember-400/60"
                    />
                    <span className="text-white/60">{r}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/brand/a-coder-logo.png"
                target="_blank"
                rel="noreferrer noopener"
                className="mt-5 inline-block text-[13px] text-ember-300 underline-offset-4 hover:underline"
              >
                Open the PNG <ExtArrow />
              </a>
            </Card>
          </div>

          <p className="mt-5 text-[12.5px] leading-relaxed text-white/50">
            Higher-resolution source files live in the repository under{" "}
            <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-steel-100">
              resources/
            </code>{" "}
            — a transparent 512px PNG, a 1024px PNG and a 2048px master.
          </p>
        </section>

        {/* ── Name ───────────────────────────────────────────────── */}
        <section id="name" className="mt-20 scroll-mt-28">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Writing the name
          </h2>
          <div className="mt-7">
            <SpecTable
              head={["Form", "Status", "Note"]}
              rows={NAMING.map(([form, status, note]) => [
                <code key={form} className="font-mono text-[12.5px]">
                  {form}
                </code>,
                <Badge
                  key="s"
                  tone={
                    status === "Correct"
                      ? "steel"
                      : status === "Code only"
                        ? "ember"
                        : "warning"
                  }
                >
                  {status}
                </Badge>,
                note,
              ])}
            />
          </div>
          <p className="mt-6 max-w-[64ch] text-[13px] leading-relaxed text-white/55">
            The lowercase <code className="font-mono text-[12px] text-steel-100">a-coder</code>{" "}
            form is not a stylistic variant — it is the actual application name,
            the <code className="font-mono text-[12px] text-steel-100">.a-coder</code>{" "}
            data folder and the{" "}
            <code className="font-mono text-[12px] text-steel-100">acoder://</code>{" "}
            URL protocol. Use it in commands and paths, not in sentences.
          </p>
        </section>

        {/* ── Palette ────────────────────────────────────────────── */}
        <section id="palette" className="mt-20 scroll-mt-28">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Palette
          </h2>
          <p className="mt-3 max-w-[64ch] text-[14px] leading-relaxed text-white/60">
            Two ramps. <strong className="text-steel-100">Steel</strong> carries
            structure and type; <strong className="text-ember-300">ember</strong>{" "}
            is the accent, used sparingly — an eyebrow, a single call to action, a
            marker on the current item. If everything is ember, nothing is.
          </p>

          <div className="mt-8 space-y-9">
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                Steel
              </h3>
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
                {STEEL.map(([n, h]) => (
                  <Swatch key={n} name={n} hex={h} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                Ember
              </h3>
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
                {EMBER.map(([n, h]) => (
                  <Swatch key={n} name={n} hex={h} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                Product accent
              </h3>
              <p className="mt-2 max-w-[60ch] text-[13px] leading-relaxed text-white/55">
                The IDE&apos;s own accent, specified in the repository&apos;s
                design guide. It appears in product UI rather than on this site,
                and the guide explicitly rejects the vivid purple-blue gradient
                common to AI tools as too loud for an editor.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
                {PRODUCT.map(([n, h]) => (
                  <Swatch key={n} name={n} hex={h} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Type ───────────────────────────────────────────────── */}
        <section id="type" className="mt-20 scroll-mt-28">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Typography
          </h2>
          <div className="mt-7">
            <SpecTable
              head={["Role", "Family", "Use"]}
              rows={TYPE.map(([role, family, use]) => [role, family, use])}
            />
          </div>
          <p className="mt-6 max-w-[64ch] text-[13px] leading-relaxed text-white/55">
            The one rule that matters: headings get <em>lighter</em> as they get
            larger. A 44px heading is weight 300, not 700. Bold display type reads
            as a consumer app; this is a tool.
          </p>
        </section>

        {/* ── Forks ──────────────────────────────────────────────── */}
        <section className="mt-20">
          <Callout tone="warning" title="If you fork A-Coder, rename it">
            <p>
              Apache-2.0 gives you the code, not the identity. A fork that keeps
              the A-Coder name and mark makes it impossible for users to tell
              whose build they are running, and whose security posture they are
              trusting. Change the name, the logo and the{" "}
              <code>acoder://</code> protocol — then do what you like with the
              rest. Attribution back to this project is required by the licence
              and appreciated beyond it.
            </p>
          </Callout>
        </section>

        <SourceNote href={SITE.repoUrl}>
          The mark is described from the logo files in the repository; the product
          accent and typographic direction come from its design guide, and the
          palette values are the live tokens from this site&apos;s stylesheet.
        </SourceNote>
      </Container>
    </PageShell>
  );
}
