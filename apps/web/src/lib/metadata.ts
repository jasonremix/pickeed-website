import { defaultLocale, localizedPath, locales, type Locale } from "@pickeed/i18n";
import { siteUrl } from "./site";

/**
 * Kanonische URL und hreflang-Alternativen für einen sprachneutralen Pfad.
 * x-default zeigt auf die deutsche Version (Standardsprache).
 */
export function alternatesFor(locale: Locale, path = "/") {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `${siteUrl}${localizedPath(l, path)}`;
  languages["x-default"] = `${siteUrl}${localizedPath(defaultLocale, path)}`;
  return {
    canonical: `${siteUrl}${localizedPath(locale, path)}`,
    languages,
  };
}
