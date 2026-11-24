import { defaultTimeZone, isLocale, type Messages } from "@pickeed/i18n";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    hasLocale(routing.locales, requested) && isLocale(requested) ? requested : routing.defaultLocale;
  const messages = (await import(`@pickeed/i18n/messages/${locale}.json`)).default as Messages;
  return { locale, messages, timeZone: defaultTimeZone };
});
