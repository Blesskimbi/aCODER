import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Card, Badge } from "@/components/ui/primitives";
import { EmptyState, CardGrid, LinkCard } from "@/components/ui/blocks";
import { WORKSHOPS, upcoming, past, selfPaced, type Workshop } from "@/content/workshops";
import { EXTERNAL } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Workshops",
  description:
    "Guided sessions on building with A-Coder — agent workflows, local models, and teaching with Learn Mode.",
};

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));

function WorkshopRow({ w }: { w: Workshop }) {
  return (
    <Link href={`/workshops/${w.slug}`} className="block">
      <Card className="h-full p-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge>{w.level}</Badge>
          {w.duration && (
            <span className="font-mono text-[11px] text-white/45">
              {w.duration}
            </span>
          )}
        </div>
        <h3 className="mt-3 text-[15px] font-medium text-steel-50">
          {w.title}
          <span aria-hidden="true" className="ml-1.5 text-white/35">
            →
          </span>
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-white/58">
          {w.summary}
        </p>
        <p className="mt-3.5 font-mono text-[11px] text-white/50">
          {w.date ? fmt(w.date) : "Self-paced"}
        </p>
      </Card>
    </Link>
  );
}

export default function WorkshopsPage() {
  const next = upcoming();
  const done = past();
  const anytime = selfPaced();

  return (
    <PageShell>
      <PageHeader
        eyebrow="Workshops"
        title="Guided sessions."
        lead="Working through a real task with someone who has done it before — agent workflows, running models locally, and teaching with Learn Mode."
      />

      <Container className="max-w-[960px]">
        {WORKSHOPS.length === 0 ? (
          <>
            <EmptyState
              title="No workshops scheduled"
              body="None are on the calendar, and we are not going to invent dates or sign-up links to make this page look busy. The community forum is where sessions would be announced first, so that is the place to watch."
              action={{
                label: "Join the community forum",
                href: EXTERNAL.forum,
                external: true,
              }}
            />

            <div className="mt-10">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                Learn it yourself in the meantime
              </h2>
              <div className="mt-5">
                <CardGrid cols={3}>
                  <LinkCard
                    href="/students"
                    title="Learn Mode"
                    blurb="The editor's own tutor — exercises, hints and quizzes at your level."
                  />
                  <LinkCard
                    href="/help"
                    title="Help centre"
                    blurb="Task-shaped answers drawn from the documentation."
                  />
                  <LinkCard
                    href="/modes"
                    title="The four modes"
                    blurb="Start here. The mode decides what the model may do."
                  />
                </CardGrid>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-14">
            {next.length > 0 && (
              <section>
                <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-ember-400">
                  Upcoming
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {next.map((w) => (
                    <WorkshopRow key={w.slug} w={w} />
                  ))}
                </div>
              </section>
            )}

            {anytime.length > 0 && (
              <section>
                <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                  Self-paced
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {anytime.map((w) => (
                    <WorkshopRow key={w.slug} w={w} />
                  ))}
                </div>
              </section>
            )}

            {done.length > 0 && (
              <section>
                <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                  Past
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {done.map((w) => (
                    <WorkshopRow key={w.slug} w={w} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        <Card className="mt-14 p-6" interactive={false}>
          <h2 className="text-[14px] font-medium text-steel-50">
            Scheduling a workshop
          </h2>
          <p className="mt-2 max-w-[62ch] text-[13px] leading-relaxed text-white/58">
            Add an entry to{" "}
            <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-steel-100">
              src/content/workshops.ts
            </code>
            . Upcoming, self-paced and past sections sort themselves by date, and
            the detail page and sitemap follow automatically.
          </p>
        </Card>
      </Container>
    </PageShell>
  );
}
