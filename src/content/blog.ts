/**
 * Blog posts.
 *
 * Empty on purpose. The project has published no posts anywhere — not
 * in the repo, not on the GitHub wiki — and PRODUCT_NOTES.md is explicit
 * that copy with no source does not go on the site.
 *
 * The route, metadata, static generation and sitemap entries are all
 * live, so publishing is adding one entry to POSTS below. No new code.
 *
 * `body` paragraphs render as prose. Keep `summary` to a sentence; it is
 * what the index and the social card show.
 */

export interface Post {
  slug: string;
  title: string;
  summary: string;
  /** ISO date, e.g. "2026-10-02". */
  date: string;
  author: string;
  /** Minutes, shown on the index. Omit to hide. */
  readingMinutes?: number;
  tags?: string[];
  body: string[];
}

export const POSTS: Post[] = [];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);

export const sortedPosts = () =>
  [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
