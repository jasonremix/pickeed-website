export {
  defaultLocale,
  defaultTimeZone,
  isLocale,
  localeLabels,
  localePrefixes,
  localizedPath,
  locales,
  type Locale,
} from "./config";
export { formatDateTime, formatMoney, formatNumber } from "./format";

import type messages from "../messages/de-CH.json";
/** Struktur der Übersetzungen – Referenz ist Deutsch (Schweiz). */
export type Messages = typeof messages;
