import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

const ROUTES = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/download", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/changelog", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/docs", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/security", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/pricing", priority: 0.6, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${SITE.url}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
