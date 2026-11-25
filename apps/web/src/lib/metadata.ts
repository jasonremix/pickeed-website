import { defaultLocale, localizedPath, locales, type Locale } from "@pickeed/i18n";
import { siteUrl } from "./site";

/**
 * Kanonische URL und hreflang-Alternativen. Pfade können je Sprache verschieden sein
 * (z. B. Event-Ratgeber); x-default zeigt auf die deutsche Version.
 */
export function alternatesFor(locale: Locale, path: string | ((l: Locale) => string) = "/") {
  const pathIn = (l: Locale) => (typeof path === "function" ? path(l) : path);
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `${siteUrl}${localizedPath(l, pathIn(l))}`;
  languages["x-default"] = `${siteUrl}${localizedPath(defaultLocale, pathIn(defaultLocale))}`;
  return {
    canonical: `${siteUrl}${localizedPath(locale, pathIn(locale))}`,
    languages,
  };
}
