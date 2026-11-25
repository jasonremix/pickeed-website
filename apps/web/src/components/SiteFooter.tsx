import type { Locale } from "@pickeed/i18n";
import { getLocale, getTranslations } from "next-intl/server";
import { Logo } from "@/components/brand/Logo";
import { StoreBadges } from "@/components/home/StoreBadges";
import { Link } from "@/i18n/navigation";
import { pathFor, translatedSlugMap } from "@/lib/content";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const stores = await getTranslations("Stores");
  const locale = (await getLocale()) as Locale;
  const columns = [
    {
      title: t("product"),
      links: [
        ["/#so-funktionierts", "how"],
        ["/entdecken", "discover"],
        ["/warteliste", "app"],
        ["/preise", "pricing"],
        [pathFor("/anlaesse-planen", locale), "events"],
        ["/travel-guide", "travel"],
      ],
    },
    {
      title: t("pros"),
      links: [
        ["/fuer-creator", "creators"],
        ["/fuer-firmen", "companies"],
        ["/fuer-vereine", "clubs"],
      ],
    },
    {
      title: t("help"),
      links: [
        ["/hilfe", "help"],
        ["/kontakt", "contact"],
        ["/impressum", "imprint"],
        ["/datenschutz", "privacy"],
        ["/agb", "terms"],
      ],
    },
  ] as const;

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="text-h3">{stores("title")}</p>
            <StoreBadges locale={locale} className="mt-4" />
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-caption font-semibold tracking-wide text-text-3 uppercase">{col.title}</p>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map(([href, key]) => (
                  <li key={key}>
                    <Link
                      href={href}
                      className="rounded-sm text-body-sm font-semibold text-text-1 hover:text-link focus-visible:focus-ring"
                    >
                      {t(`links.${key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-5 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <Logo className="text-[1.5rem]" />
            <p className="text-body-sm text-text-2">{t("copy", { year: new Date().getFullYear() })}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <LanguageSwitcher slugMap={translatedSlugMap()} />
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
