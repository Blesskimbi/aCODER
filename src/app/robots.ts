import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The logo lab is a development harness, not content.
      disallow: "/lab/",
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
