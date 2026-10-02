import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Card, Badge } from "@/components/ui/primitives";
import { SourceNote, CardGrid, LinkCard } from "@/components/ui/blocks";
import { HELP_ARTICLES, HELP_CATEGORIES } from "@/content/help";
import { SITE, EXTERNAL } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Help centre",
  description:
    "Task-shaped answers drawn from A-Coder's own documentation: installing, connecting a model, controlling the agent, running offline, and fixing what goes wrong.",
};

export default function HelpPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Help centre"
        title="Answers, by what you are trying to do."
        lead="Each article is assembled from the repository's own user guides and links back to the guide it came from, so you can check it rather than take it on trust."
      />

      <Container className="max-w-[960px]">
        <div className="space-y-14">
          {HELP_CATEGORIES.map((cat) => {
            const items = HELP_ARTICLES.filter((a) => a.category === cat);
            if (items.length === 0) return null;

            return (
              <section key={cat}>
                <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-ember-400">
                  {cat}
                </h2>
                <ul className="mt-5 divide-y divide-white/[0.06] border-y border-white/[0.06]">
                  {items.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/help/${a.slug}`}
                        className="group flex flex-col gap-1 py-4 transition-colors sm:flex-row sm:items-baseline sm:gap-6"
                      >
                        <span className="text-[14px] font-medium text-steel-100 transition-colors group-hover:text-white sm:w-[42%] sm:shrink-0">
                          {a.title}
                          <span
                            aria-hidden="true"
                            className="ml-1.5 text-white/30"
                          >
                            →
                          </span>
                        </span>
                        <span className="text-[13px] leading-relaxed text-white/55">
                          {a.summary}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        {/* ── Where else to go ───────────────────────────────────── */}
        <section className="mt-20">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            Still stuck
          </h2>
          <p className="mt-3 max-w-[62ch] text-[14px] leading-relaxed text-white/60">
            The full documentation is in the repository, and the community forum
            is the place to ask a person.
          </p>

          <div className="mt-7">
            <CardGrid cols={3}>
              <LinkCard
                href="/docs"
                title="Documentation"
                blurb="Every user guide, grouped by subject."
              />
              <LinkCard
                href={EXTERNAL.forum}
                external
                title="Community forum"
                blurb="Ask a question where other people can answer it."
              />
              <LinkCard
                href={SITE.docsUrl}
                external
                title="Docs in the repo"
                blurb="The source of everything on this page."
              />
            </CardGrid>
          </div>

          {/* The repo has issues disabled, so saying "file an issue"
              would send people somewhere that cannot receive them. */}
          <Card className="mt-6 p-6" interactive={false}>
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge tone="warning">Note</Badge>
              <h3 className="text-[14px] font-medium text-steel-50">
                There is no public issue tracker right now
              </h3>
            </div>
            <p className="mt-2.5 text-[13px] leading-relaxed text-white/60">
              Issues are currently disabled on the repository, so bug reports
              have nowhere to land there. Use the community forum instead, or the
              wiki for longer-form notes, until a tracker is opened.
            </p>
            <a
              href={EXTERNAL.wiki}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 inline-block text-[13px] text-ember-300 underline-offset-4 hover:underline"
            >
              Repository wiki ↗
            </a>
          </Card>
        </section>

        <SourceNote href={SITE.docsUrl}>
          Every article restates material from the repository&apos;s user guides
          and names its source.
        </SourceNote>
      </Container>
    </PageShell>
  );
}
