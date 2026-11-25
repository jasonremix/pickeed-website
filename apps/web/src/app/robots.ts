import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/design", "/fr/design", "/it/design", "/en/design"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
