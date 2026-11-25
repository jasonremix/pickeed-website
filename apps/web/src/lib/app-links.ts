import type { Locale } from "@pickeed/i18n";
import { localePrefixes } from "@pickeed/i18n";

/**
 * Die Pickeed-App (Anmeldung, Pläne, Entdecken) läuft unter APP_URL. Standard: die bestehende App auf pickeed.com.
 * Sobald die neue Plattform Anmeldung anbietet (Phase 6), zeigt APP_URL auf sie.
 */
export const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "https://pickeed.com").replace(/\/$/, "");

function prefix(locale: Locale): string {
  return locale === "de-CH" ? "" : localePrefixes[locale as keyof typeof localePrefixes];
}

export function appLink(locale: Locale, path: string): string {
  return `${appUrl}${prefix(locale)}${path}`;
}

/** «Kostenlos einen Plan erstellen» – Registrierung mit neuem Plan. */
export const signupLink = (locale: Locale) => appLink(locale, "/anmelden?weiter=%2F%3Fneu%3D1");
export const signinLink = (locale: Locale) => appLink(locale, "/anmelden");

export const storeLinks = {
  ios: "https://apps.apple.com/ch/app/pickeed-freunde-events/id6805627477",
  android: "https://play.google.com/store/apps/details?id=com.pickeed.app",
} as const;

/** Store-Badges gibt es auf Deutsch, Englisch, Französisch und Italienisch; sonst Englisch. */
export function badgeLang(locale: Locale): "de" | "en" | "fr" | "it" {
  const l = locale.slice(0, 2);
  return l === "de" || l === "fr" || l === "it" ? l : "en";
}

/** Bilder der App gibt es in allen sechs Sprachen. */
export function screenshotLang(locale: Locale): string {
  return locale.slice(0, 2);
}
