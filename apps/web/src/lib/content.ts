import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { defaultLocale, locales, type Locale } from "@pickeed/i18n";

/**
 * Inhalte der Unterseiten, übernommen von pickeed.com (tools/content-import).
 * Pro Sprache eine Datei: Pfad → { title, description, body }. body ist ein bereinigter Baum:
 * Text = string, Element = [tag, ...kinder], Link = ["a", href, ...kinder].
 */
export type ContentNode = string | ContentElement;
export type ContentElement = [string, ...ContentNode[]];
export interface ContentPage {
  title: string;
  description: string;
  body: ContentNode[];
}

const contentDir = path.join(process.cwd(), "content");
const cache = new Map<string, unknown>();

function load<T>(file: string): T {
  if (!cache.has(file)) cache.set(file, JSON.parse(readFileSync(path.join(contentDir, file), "utf8")));
  return cache.get(file) as T;
}

export function getPages(locale: Locale): Record<string, ContentPage> {
  return load<Record<string, ContentPage>>(`${locale}.json`);
}

export function getPage(locale: Locale, pathname: string): ContentPage | null {
  const page = getPages(locale)[pathname];
  return page && "body" in page ? page : null;
}

/** Zuordnung deutscher Pfad → Pfad je Sprache (für übersetzte Adressen wie /en/plan-a-birthday-party). */
export function getRoutes(): Record<string, Partial<Record<Locale, string>>> {
  return load("routes.json");
}

/** Deutscher Schlüssel eines Pfades in einer Sprache. */
export function keyFor(locale: Locale, pathname: string): string | null {
  if (locale === defaultLocale) return getRoutes()[pathname] ? pathname : null;
  for (const [key, alts] of Object.entries(getRoutes())) if (alts[locale] === pathname) return key;
  return null;
}

/** Pfad einer Seite (deutscher Schlüssel) in einer Sprache – fällt auf den Schlüssel zurück. */
export function pathFor(key: string, locale: Locale): string {
  return getRoutes()[key]?.[locale] ?? key;
}

/** Alle Pfade je Sprache, die als Seite vorhanden sind (für statische Generierung und Sitemap). */
export function allPaths(): Array<{ locale: Locale; path: string }> {
  return locales.flatMap((locale) =>
    Object.entries(getPages(locale))
      .filter(([, p]) => p && "body" in p)
      .map(([p]) => ({ locale, path: p })),
  );
}

/** Nur die Zuordnungen, bei denen die Adresse je Sprache abweicht (für den Sprachwechsler im Browser). */
export function translatedSlugMap(): Record<string, Partial<Record<Locale, string>>> {
  const out: Record<string, Partial<Record<Locale, string>>> = {};
  for (const [key, alts] of Object.entries(getRoutes())) {
    if (Object.entries(alts).some(([, p]) => p !== key)) out[key] = alts;
  }
  return out;
}
