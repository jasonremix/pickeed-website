import { localizedPath, locales } from "@pickeed/i18n";
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: locales.map((l) => localizedPath(l, "/design")) }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
