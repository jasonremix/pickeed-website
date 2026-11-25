import { defaultTimeZone, type Locale } from "./config";

/**
 * Formatierung ausserhalb von React (z. B. E-Mails, Server-Jobs).
 * In Komponenten wird der Formatter von next-intl verwendet – beide nutzen Intl mit denselben Locales.
 */

/** Geldbetrag aus kleinster Einheit (Rappen/Cent), z. B. 990 → «CHF 9.90». */
export function formatMoney(amountMinor: number, currency: string, locale: Locale): string {
  if (!Number.isInteger(amountMinor)) throw new TypeError("amountMinor muss eine ganze Zahl sein");
  const digits =
    new Intl.NumberFormat(locale, { style: "currency", currency }).resolvedOptions().maximumFractionDigits ??
    2;
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amountMinor / 10 ** digits);
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatDateTime(
  date: Date,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short" },
  timeZone: string = defaultTimeZone,
): string {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone }).format(date);
}
