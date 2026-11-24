import { localizedPath, locales } from "@pickeed/i18n";
import type { MetadataRoute } from "next";
import { alternatesFor } from "@/lib/metadata";
import { siteUrl } from "@/lib/site";

/** Öffentliche, indexierbare Seiten (wächst mit Phase 7). */
const publicPaths = ["/"];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPaths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteUrl}${localizedPath(locale, path)}`,
      alternates: { languages: alternatesFor(locale, path).languages },
    })),
  );
}
