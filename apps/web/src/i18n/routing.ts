import { defaultLocale, localePrefixes, locales } from "@pickeed/i18n";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: { mode: "as-needed", prefixes: localePrefixes },
  // hreflang-Links werden in den Metadaten erzeugt (src/lib/metadata.ts).
  alternateLinks: false,
});
