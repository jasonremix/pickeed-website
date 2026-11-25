"use client";

import { localeLabels, locales, type Locale } from "@pickeed/i18n";
import { useLocale, useTranslations } from "next-intl";
import { useId, useTransition } from "react";
import { Icon } from "@/components/icons";
import { usePathname, useRouter } from "@/i18n/navigation";

type SlugMap = Record<string, Partial<Record<Locale, string>>>;

/** Sprachwechsel; Seiten mit übersetzter Adresse (z. B. Event-Ratgeber) wechseln zur passenden Adresse. */
export function LanguageSwitcher({ slugMap }: { slugMap: SlugMap }) {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const id = useId();

  const targetPath = (next: Locale) => {
    for (const alts of Object.values(slugMap)) {
      if (alts[locale] === pathname) return alts[next] ?? pathname;
    }
    return pathname;
  };

  return (
    <div className="inline-flex items-center gap-2">
      <label htmlFor={id} className="inline-flex items-center gap-1.5 text-body-sm text-text-2">
        <Icon name="globe" className="size-4 text-primary" />
        {t("label")}
      </label>
      <select
        id={id}
        value={locale}
        disabled={pending}
        onChange={(event) => {
          const next = event.target.value as Locale;
          startTransition(() => router.replace(targetPath(next), { locale: next }));
        }}
        className="h-10 rounded-md border border-line bg-surface px-3 text-body-sm font-semibold text-text-1 focus-visible:focus-ring"
      >
        {locales.map((l) => (
          <option key={l} value={l} lang={l}>
            {localeLabels[l]}
          </option>
        ))}
      </select>
    </div>
  );
}
