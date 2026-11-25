"use client";

import { localeLabels, locales, type Locale } from "@pickeed/i18n";
import { useLocale, useTranslations } from "next-intl";
import { useId, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const id = useId();

  return (
    <div className="inline-flex items-center gap-2">
      <label htmlFor={id} className="text-body-sm text-text-2">
        {t("label")}
      </label>
      <select
        id={id}
        value={locale}
        disabled={pending}
        onChange={(event) => {
          const next = event.target.value as Locale;
          startTransition(() => router.replace(pathname, { locale: next }));
        }}
        className="h-9 rounded-sm border border-line bg-surface px-2 text-body-sm text-text-1 focus-visible:focus-ring"
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
