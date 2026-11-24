import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { defaultLocale, locales, type Locale } from "../src";

/** Lädt einen Katalog direkt aus der Datei, damit der Test unabhängig vom Bundler ist. */
function load(locale: Locale): Record<string, unknown> {
  const file = fileURLToPath(new URL(`../messages/${locale}.json`, import.meta.url));
  return JSON.parse(readFileSync(file, "utf8")) as Record<string, unknown>;
}

function flatten(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object")
      Object.assign(out, flatten(value as Record<string, unknown>, path));
    else out[path] = String(value);
  }
  return out;
}

/** Variablen einer ICU-Nachricht, z. B. «{year}» oder «{count, plural, …}» → ["count"]. */
function placeholders(message: string): string[] {
  const names = new Set<string>();
  for (const m of message.matchAll(/\{\s*([a-zA-Z_][\w]*)\s*(?:[,}])/g)) names.add(m[1]!);
  return [...names].sort();
}

const reference = flatten(load(defaultLocale));

describe("Übersetzungskataloge", () => {
  for (const locale of locales) {
    const catalog = flatten(load(locale));

    it(`${locale}: enthält genau dieselben Schlüssel wie ${defaultLocale}`, () => {
      expect(Object.keys(catalog).sort()).toEqual(Object.keys(reference).sort());
    });

    it(`${locale}: hat keine leeren Texte`, () => {
      const empty = Object.entries(catalog).filter(([, v]) => v.trim() === "");
      expect(empty).toEqual([]);
    });

    it(`${locale}: verwendet dieselben Platzhalter wie ${defaultLocale}`, () => {
      for (const [key, value] of Object.entries(reference)) {
        expect(placeholders(catalog[key] ?? ""), key).toEqual(placeholders(value));
      }
    });
  }

  it("de-CH verwendet Schweizer Rechtschreibung (kein «ß»)", () => {
    const withEszett = Object.entries(reference).filter(([, v]) => v.includes("ß"));
    expect(withEszett).toEqual([]);
  });
});
