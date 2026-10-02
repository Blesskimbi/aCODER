import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Card, Badge } from "@/components/ui/primitives";
import { EmptyState, CardGrid, LinkCard } from "@/components/ui/blocks";
import { sortedPosts } from "@/content/blog";
import { EXTERNAL } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes from the A-Coder project — release thinking, design decisions and what changed under the hood.",
};

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));

export default function BlogPage() {
  const posts = sortedPosts();

  return (
    <PageShell>
      <PageHeader
        eyebrow="Blog"
        title="Notes from the project."
        lead="Design decisions, release thinking, and the reasoning behind choices that are easier to explain once than to infer from a diff."
      />

      <Container className="max-w-[900px]">
        {posts.length === 0 ? (
          <>
            <EmptyState
              title="Nothing published yet"
              body="The project has not published any posts, and we would rather show you an empty shelf than fill it with filler. The changelog is where the real activity is in the meantime — it is generated from GitHub releases, so it is never out of date."
              action={{ label: "Read the changelog", href: "/changelog" }}
            />

            <div className="mt-10">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                In the meantime
              </h2>
              <div className="mt-5">
                <CardGrid cols={3}>
                  <LinkCard
                    href="/changelog"
                    title="Changelog"
                    blurb="Every release, pulled from GitHub and refreshed hourly."
                  />
                  <LinkCard
                    href="/docs"
                    title="Documentation"
                    blurb="The user guides, which are genuinely thorough."
                  />
                  <LinkCard
                    href={EXTERNAL.forum}
                    external
                    title="Community forum"
                    blurb="Where discussion actually happens right now."
                  />
                </CardGrid>
              </div>
            </div>
          </>
        ) : (
          <ul className="divide-y divide-white/[0.06]">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="group block py-7">
                  <div className="flex flex-wrap items-center gap-3">
                    <time
                      dateTime={p.date}
                      className="font-mono text-[11px] text-white/50"
                    >
                      {fmt(p.date)}
                    </time>
                    {p.readingMinutes && (
                      <span className="font-mono text-[11px] text-white/40">
                        {p.readingMinutes} min
                      </span>
                    )}
                    {p.tags?.map((t) => <Badge key={t}>{t}</Badge>)}
                  </div>

                  <h2 className="mt-2.5 font-display text-[21px] font-light tracking-[-0.01em] text-steel-50 transition-colors group-hover:text-white">
                    {p.title}
                  </h2>
                  <p className="mt-2 max-w-[66ch] text-[13.5px] leading-relaxed text-white/58">
                    {p.summary}
                  </p>
                  <p className="mt-3 text-[12.5px] text-white/45">
                    {p.author}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* How to publish — the machinery is live, so say where. */}
        <Card className="mt-14 p-6" interactive={false}>
          <h2 className="text-[14px] font-medium text-steel-50">
            Publishing a post
          </h2>
          <p className="mt-2 max-w-[62ch] text-[13px] leading-relaxed text-white/58">
            Add an entry to{" "}
            <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[12px] text-steel-100">
              src/content/blog.ts
            </code>
            . The index, the post page, static generation and the sitemap all
            pick it up — there is no further code to write.
          </p>
        </Card>
      </Container>
    </PageShell>
  );
}
