/**
 * Sprach- und Regionskonfiguration von Pickeed (docs/04, Abschnitt 5).
 * Locale-Codes enthalten die Region, damit Zahlen, Währungen und Daten Schweizer Formate erhalten.
 */

export const locales = ["de-CH", "fr-CH", "it-CH", "en-CH"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale = "de-CH" satisfies Locale;

/** URL-Präfixe: Deutsch ohne Präfix, die übrigen Sprachen mit Kurzform. */
export const localePrefixes = {
  "fr-CH": "/fr",
  "it-CH": "/it",
  "en-CH": "/en",
} as const satisfies Partial<Record<Locale, string>>;

/** Sprachnamen in der jeweiligen Sprache (für den Sprachwechsler). */
export const localeLabels: Record<Locale, string> = {
  "de-CH": "Deutsch",
  "fr-CH": "Français",
  "it-CH": "Italiano",
  "en-CH": "English",
};

/** Standard-Zeitzone für Anzeige und Planung. */
export const defaultTimeZone = "Europe/Zurich";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** Pfad eines Locales für einen sprachneutralen Pfad («/» → «/fr»). */
export function localizedPath(locale: Locale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const prefix =
    locale === defaultLocale ? "" : localePrefixes[locale as Exclude<Locale, typeof defaultLocale>];
  if (clean === "/") return prefix || "/";
  return `${prefix}${clean}`;
}
