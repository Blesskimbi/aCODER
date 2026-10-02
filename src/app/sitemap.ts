import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getReleases, releaseSlug } from "@/lib/github";
import { MODE_DETAILS } from "@/content/modes";
import { HELP_ARTICLES } from "@/content/help";
import { POSTS } from "@/content/blog";
import { WORKSHOPS } from "@/content/workshops";

type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

/** Static routes. Dynamic ones are appended from their collections. */
const ROUTES: Array<{ path: string; priority: number; changeFrequency: Freq }> = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/download", priority: 0.9, changeFrequency: "weekly" },

  // Product
  { path: "/features", priority: 0.8, changeFrequency: "monthly" },
  { path: "/modes", priority: 0.8, changeFrequency: "monthly" },
  { path: "/models", priority: 0.8, changeFrequency: "monthly" },
  { path: "/integrations", priority: 0.7, changeFrequency: "monthly" },
  { path: "/students", priority: 0.7, changeFrequency: "monthly" },
  { path: "/cli", priority: 0.6, changeFrequency: "monthly" },
  { path: "/mobile", priority: 0.6, changeFrequency: "monthly" },
  { path: "/migrate", priority: 0.7, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.6, changeFrequency: "monthly" },

  // Resources
  { path: "/docs", priority: 0.7, changeFrequency: "monthly" },
  { path: "/help", priority: 0.7, changeFrequency: "monthly" },
  { path: "/changelog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/compare", priority: 0.7, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.5, changeFrequency: "weekly" },
  { path: "/workshops", priority: 0.5, changeFrequency: "weekly" },
  { path: "/security", priority: 0.6, changeFrequency: "monthly" },

  // Community & company
  { path: "/open-source", priority: 0.7, changeFrequency: "weekly" },
  { path: "/community", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/brand", priority: 0.4, changeFrequency: "yearly" },
  { path: "/join", priority: 0.4, changeFrequency: "monthly" },

  // Legal
  { path: "/privacy", priority: 0.4, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.4, changeFrequency: "yearly" },
  { path: "/licence", priority: 0.4, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const url = (path: string) => `${SITE.url}${path}`;

  const entries: MetadataRoute.Sitemap = ROUTES.map((r) => ({
    url: url(r.path),
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Modes
  for (const m of MODE_DETAILS) {
    entries.push({
      url: url(`/modes/${m.id}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // Help articles
  for (const a of HELP_ARTICLES) {
    entries.push({
      url: url(`/help/${a.slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  // Blog and workshops — empty collections contribute nothing, which is
  // correct: a sitemap should not advertise URLs that 404.
  for (const p of POSTS) {
    entries.push({
      url: url(`/blog/${p.slug}`),
      lastModified: new Date(p.date),
      changeFrequency: "yearly",
      priority: 0.5,
    });
  }

  for (const w of WORKSHOPS) {
    entries.push({
      url: url(`/workshops/${w.slug}`),
      lastModified: w.date ? new Date(w.date) : now,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  // Per-release changelog pages. Degrades to nothing if the API is
  // unavailable at build time rather than failing the build.
  const releases = await getReleases();
  for (const r of releases) {
    entries.push({
      url: url(`/changelog/${releaseSlug(r.version)}`),
      lastModified: r.publishedAt ? new Date(r.publishedAt) : now,
      changeFrequency: "yearly",
      priority: 0.4,
    });
  }

  return entries;
}
