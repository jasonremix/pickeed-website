import { describe, expect, it } from "vitest";
import { formatDateTime, formatMoney, formatNumber, isLocale, localizedPath } from "../src";

describe("Locale-Konfiguration", () => {
  it("erkennt gültige Locales", () => {
    expect(isLocale("de-CH")).toBe(true);
    expect(isLocale("en-CH")).toBe(true);
    expect(isLocale("de")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

  it("baut lokalisierte Pfade", () => {
    expect(localizedPath("de-CH")).toBe("/");
    expect(localizedPath("fr-CH")).toBe("/fr");
    expect(localizedPath("it-CH", "/design")).toBe("/it/design");
    expect(localizedPath("de-CH", "kontakt")).toBe("/kontakt");
  });
});

describe("Formatierung nach Region", () => {
  const date = new Date(Date.UTC(2026, 10, 24, 18, 30));

  it("formatiert Zahlen mit Schweizer Tausendertrennzeichen", () => {
    // Je nach ICU-Version Apostroph ' oder typografisch ’ – beides ist korrekt.
    expect(formatNumber(1234567.5, "de-CH")).toMatch(/^1['’]234['’]567\.5$/);
    expect(formatNumber(1234567.5, "en-CH")).toMatch(/^1['’]234['’]567\.5$/);
  });

  it("formatiert Geldbeträge aus Rappen", () => {
    // Intl setzt geschützte Leerzeichen; für den Vergleich normalisieren.
    const plain = (s: string) => s.replace(/\s/g, " ");
    expect(plain(formatMoney(990, "CHF", "de-CH"))).toBe("CHF 9.90");
    expect(plain(formatMoney(990, "CHF", "fr-CH"))).toBe("9.90 CHF");
    expect(plain(formatMoney(150000, "EUR", "de-CH"))).toMatch(/^EUR 1['’]500\.00$/);
    expect(() => formatMoney(9.9, "CHF", "de-CH")).toThrow(TypeError);
  });

  it("formatiert Datum und Zeit in der Zeitzone Zürich", () => {
    expect(formatDateTime(date, "de-CH")).toBe("24.11.2026, 19:30");
    expect(formatDateTime(date, "it-CH")).toContain("19:30");
  });
});
