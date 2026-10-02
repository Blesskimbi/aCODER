import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Card, Badge, Arrow } from "@/components/ui/primitives";
import { SourceNote, Callout, CardGrid, LinkCard } from "@/components/ui/blocks";
import { SITE, EXTERNAL } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Community",
  description:
    "Where A-Coder conversation happens: the community forum, the repository wiki, and the source itself.",
};

export default function CommunityPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Community"
        title="Where to find other people."
        lead="A short, honest list. The project is young and its community channels are still forming, so this page names only the ones that exist."
      />

      <Container className="max-w-[900px]">
        <CardGrid cols={2}>
          <LinkCard
            href={EXTERNAL.forum}
            external
            meta="Primary"
            title="Community forum"
            blurb="The Skool community linked from the repository itself. The best place to ask a question and reach a person."
          />
          <LinkCard
            href={EXTERNAL.wiki}
            external
            meta="Reference"
            title="Repository wiki"
            blurb="Longer-form notes that sit outside the docs folder."
          />
          <LinkCard
            href={SITE.repoUrl}
            external
            meta="Code"
            title="GitHub repository"
            blurb="Read the source, watch releases, or fork it. Pull requests are welcome."
          />
          <LinkCard
            href={EXTERNAL.support}
            external
            meta="Support the work"
            title="Buy Me a Coffee"
            blurb="If you want to fund development directly."
          />
        </CardGrid>

        {/* ── What does not exist ────────────────────────────────── */}
        <section className="mt-16">
          <h2 className="font-display text-[24px] font-light tracking-[-0.01em] text-steel-50 md:text-[28px]">
            What does not exist yet
          </h2>
          <p className="mt-3 max-w-[64ch] text-[14px] leading-relaxed text-white/60">
            Worth stating plainly, so you do not go looking for channels that
            are not there.
          </p>

          <div className="mt-7 space-y-3">
            {[
              {
                thing: "A Discord server",
                detail:
                  "The repository README shows a Discord link, but it points at a placeholder rather than a real server. When one opens, it will be listed here.",
              },
              {
                thing: "GitHub Discussions",
                detail:
                  "Discussions are not enabled on the repository, so the forum is the equivalent venue for now.",
              },
              {
                thing: "An issue tracker",
                detail:
                  "Issues are currently turned off on the repository. Bug reports have nowhere to land there, so raise them on the forum instead.",
              },
            ].map((n) => (
              <Card key={n.thing} className="p-6" interactive={false}>
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge tone="warning">Not available</Badge>
                  <h3 className="text-[14px] font-medium text-steel-50">
                    {n.thing}
                  </h3>
                </div>
                <p className="mt-2.5 text-[13px] leading-relaxed text-white/58">
                  {n.detail}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Contributing ───────────────────────────────────────── */}
        <section className="mt-16">
          <Callout tone="ember" title="The most useful thing you can do right now">
            <p>
              Use it and say what broke. A project at this size changes shape
              around its early users far more than a mature one does, and with no
              issue tracker open, a clear report on the forum carries further
              than it would in a queue of thousands.{" "}
              <Link href="/open-source">Contributing guides <Arrow /></Link>
            </p>
          </Callout>
        </section>

        <SourceNote href={SITE.repoUrl}>
          The forum link is the <code>homepage</code> field on the repository;
          the absent channels were checked against the repository&apos;s own
          settings and README.
        </SourceNote>
      </Container>
    </PageShell>
  );
}
