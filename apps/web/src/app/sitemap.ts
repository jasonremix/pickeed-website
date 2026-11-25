import { localizedPath, locales, type Locale } from "@pickeed/i18n";
import type { MetadataRoute } from "next";
import { allPaths, getRoutes, keyFor } from "@/lib/content";
import { alternatesFor } from "@/lib/metadata";
import { siteUrl } from "@/lib/site";

/** Startseite und alle übernommenen Seiten in allen Sprachen, mit hreflang-Alternativen. */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = getRoutes();
  const home = locales.map((locale) => ({
    url: `${siteUrl}${localizedPath(locale, "/")}`,
    alternates: { languages: alternatesFor(locale, "/").languages },
  }));
  const pages = allPaths()
    .filter((p) => p.path !== "/")
    .map(({ locale, path }) => {
      const key = keyFor(locale, path);
      const alts = key ? routes[key] : undefined;
      return {
        url: `${siteUrl}${localizedPath(locale, path)}`,
        alternates: { languages: alternatesFor(locale, (l: Locale) => alts?.[l] ?? path).languages },
      };
    });
  return [...home, ...pages];
}
