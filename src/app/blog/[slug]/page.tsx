import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell, PageHeader } from "@/components/site/PageShell";
import { Container, Badge } from "@/components/ui/primitives";
import { Prose } from "@/components/ui/blocks";
import { POSTS, getPost } from "@/content/blog";

export const revalidate = 3600;

/**
 * Empty while POSTS is empty, which is correct: with no entries there
 * are no /blog/* URLs to prerender, and any slug falls through to
 * notFound() rather than rendering a shell.
 */
export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
    },
  };
}

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <PageShell>
      <PageHeader
        eyebrow={fmt(post.date)}
        title={post.title}
        lead={post.summary}
        breadcrumb={{ label: "Blog", href: "/blog" }}
      >
        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <span className="text-[13px] text-white/60">{post.author}</span>
          {post.readingMinutes && (
            <span className="font-mono text-[11px] text-white/42">
              · {post.readingMinutes} min read
            </span>
          )}
          {post.tags?.map((t) => <Badge key={t}>{t}</Badge>)}
        </div>
      </PageHeader>

      <Container className="max-w-[760px]">
        <Prose>
          {post.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Prose>
      </Container>
    </PageShell>
  );
}
