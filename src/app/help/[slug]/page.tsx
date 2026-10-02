import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Card, Badge } from "@/components/ui/primitives";
import { SourceNote, Callout, Prose } from "@/components/ui/blocks";
import { HELP_ARTICLES, getArticle } from "@/content/help";
import { guide } from "@/lib/site";

export const revalidate = 3600;

export function generateStaticParams() {
  return HELP_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: "Article not found" };
  return { title: a.title, description: a.summary };
}

export default async function HelpArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = (article.related ?? [])
    .map(getArticle)
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <PageShell>
      <PageHeader
        eyebrow={article.category}
        title={article.title}
        lead={article.summary}
        breadcrumb={{ label: "Help centre", href: "/help" }}
      />

      <Container className="max-w-[820px]">
        {/* Steps render as an ordered list; prose as paragraphs. */}
        {article.steps && (
          <ol className="space-y-5">
            {article.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="mt-[2px] flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] font-mono text-[11px] text-ember-300">
                  {i + 1}
                </span>
                <p className="text-[14px] leading-relaxed text-white/68">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        )}

        {article.body && (
          <Prose>
            {article.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Prose>
        )}

        {article.caveat && (
          <div className="mt-9">
            <Callout tone="warning" title="Worth knowing">
              <p>{article.caveat}</p>
            </Callout>
          </div>
        )}

        {/* ── Related ────────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-white/[0.07] pt-8">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
              Related
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <Link key={r.slug} href={`/help/${r.slug}`} className="block">
                  <Card className="h-full p-5">
                    <Badge>{r.category}</Badge>
                    <h3 className="mt-3 text-[14px] font-medium text-steel-50">
                      {r.title}
                      <span aria-hidden="true" className="ml-1 text-white/35">
                        →
                      </span>
                    </h3>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/55">
                      {r.summary}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <SourceNote href={guide(article.guide)}>
          This article restates <code>{article.guide}</code> from the
          repository&apos;s user guide.
        </SourceNote>
      </Container>
    </PageShell>
  );
}
