import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Card, Badge } from "@/components/ui/primitives";
import { EmptyState, SourceNote, Callout, CardGrid, LinkCard } from "@/components/ui/blocks";
import { SITE, EXTERNAL, repoDoc } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Join",
  description:
    "No open positions right now. The real route into A-Coder is contributing to it — here is where the work is and how to start.",
};

/**
 * Areas the project has said it intends to grow into. These come from an
 * internal planning document and are explicitly *contingent and
 * undated* — they are not vacancies, and this page must not read as if
 * they are. No applications, no salary bands, no "apply now".
 */
const FUTURE_AREAS = [
  {
    area: "Core performance",
    body: "Editor and agent performance work on a large TypeScript codebase.",
  },
  {
    area: "AI engineering",
    body: "Model integration, tool design and orchestration quality.",
  },
  {
    area: "Education",
    body: "Learn Mode curriculum — lessons, exercises and progression design.",
  },
  {
    area: "Developer advocacy",
    body: "Community building, talks, and the forum.",
  },
  {
    area: "Technical writing",
    body: "Documentation and course material.",
  },
];

const CONTRIBUTE = [
  {
    title: "Fix something that annoyed you",
    body: "The shortest useful contribution. You already have the reproduction, and small corrective pull requests are the easiest kind to review.",
  },
  {
    title: "Improve the documentation",
    body: "The user guides are good but inconsistent in places — the repo disagrees with itself about the third mode's name and about what Ctrl+L does. Reconciling that is real, visible work.",
  },
  {
    title: "Write a skill",
    body: "Skills are markdown packages with optional scripts. They need no editor internals knowledge, and there is a marketplace for them.",
  },
  {
    title: "Test on your platform",
    body: "Builds are unsigned and the current release has no Windows x64 artefact. Platform reports are genuinely useful right now.",
  },
];

export default function JoinPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Join"
        title="There are no job ads here."
        lead="A-Coder is a small open-source project, not a company with a hiring pipeline. That is the honest position, so rather than invent vacancies, here is where the work actually is."
      />

      <Container className="max-w-[900px]">
        <EmptyState
          title="No open positions"
          body="The project is not advertising paid roles. If that changes, this page is where it will be said — with a real role description and a real way to apply, not a general-interest form."
          action={{ label: "Contribute instead", href: "/open-source" }}
        />

        {/* ── Contributing ───────────────────────────────────────── */}
        <section className="mt-16">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Four ways in that are open today
          </h2>
          <p className="mt-3 max-w-[64ch] text-[14px] leading-relaxed text-white/60">
            On a project this size, a contributor who sticks around becomes one
            of the people who shapes it. That is a more realistic path than
            waiting for a listing.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {CONTRIBUTE.map((c) => (
              <Card key={c.title} className="p-6" interactive={false}>
                <h3 className="text-[14.5px] font-medium text-steel-50">
                  {c.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/60">
                  {c.body}
                </p>
              </Card>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
            <a
              href={repoDoc("HOW_TO_CONTRIBUTE.md")}
              target="_blank"
              rel="noreferrer noopener"
              className="text-[13px] text-ember-300 underline-offset-4 hover:underline"
            >
              Contributing guide ↗
            </a>
            <a
              href={repoDoc("DEVELOPMENT_GUIDE.md")}
              target="_blank"
              rel="noreferrer noopener"
              className="text-[13px] text-ember-300 underline-offset-4 hover:underline"
            >
              Development guide ↗
            </a>
            <a
              href={repoDoc("VOID_CODEBASE_GUIDE.md")}
              target="_blank"
              rel="noreferrer noopener"
              className="text-[13px] text-ember-300 underline-offset-4 hover:underline"
            >
              Codebase guide ↗
            </a>
          </div>
        </section>

        {/* ── Future areas, clearly marked ───────────────────────── */}
        <section className="mt-20">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Where the project wants to grow
          </h2>
          <div className="mt-6 max-w-[64ch]">
            <Callout tone="warning" title="These are not vacancies">
              <p>
                The five areas below are directions the project has said it would
                invest in <em>if</em> it is funded to do so. There is no budget,
                no timeline and no application process behind them. They are here
                so you can see where the gaps are — not as roles to apply for.
              </p>
            </Callout>
          </div>

          <ul className="mt-7 divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {FUTURE_AREAS.map((f) => (
              <li
                key={f.area}
                className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <span className="flex items-center gap-2.5 text-[14px] font-medium text-steel-100 sm:w-[34%] sm:shrink-0">
                  {f.area}
                  <Badge tone="warning">Aspiration</Badge>
                </span>
                <span className="text-[13px] leading-relaxed text-white/55">
                  {f.body}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Get in touch ───────────────────────────────────────── */}
        <section className="mt-20">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Getting in touch
          </h2>
          <p className="mt-3 max-w-[64ch] text-[14px] leading-relaxed text-white/60">
            There is no careers inbox. The forum reaches the people building it,
            and a pull request reaches them faster still.
          </p>
          <div className="mt-7">
            <CardGrid cols={3}>
              <LinkCard
                href={EXTERNAL.forum}
                external
                title="Community forum"
                blurb="Introduce yourself, or ask what needs doing."
              />
              <LinkCard
                href={SITE.repoUrl}
                external
                title="GitHub"
                blurb="Open a pull request. The most direct signal you can send."
              />
              <LinkCard
                href={EXTERNAL.company}
                external
                title="The A Tech Corporation"
                blurb="The company behind the project."
              />
            </CardGrid>
          </div>
        </section>

        <div className="mt-16 flex flex-wrap items-center gap-3 border-t border-white/[0.07] pt-8">
          <Badge>Next</Badge>
          <Link
            href="/about"
            className="text-[13.5px] text-ember-300 underline-offset-4 hover:underline"
          >
            Why the project exists →
          </Link>
          <span className="text-white/25">·</span>
          <Link
            href="/open-source"
            className="text-[13.5px] text-ember-300 underline-offset-4 hover:underline"
          >
            Build it from source →
          </Link>
        </div>

        <SourceNote href={repoDoc("HOW_TO_CONTRIBUTE.md")}>
          Contribution routes come from the repository&apos;s own guides. The
          growth areas are drawn from an internal planning document and are
          reproduced here as stated intentions, not offers.
        </SourceNote>
      </Container>
    </PageShell>
  );
}
