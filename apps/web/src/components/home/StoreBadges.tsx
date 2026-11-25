import type { Locale } from "@pickeed/i18n";
import { cn } from "@pickeed/ui";
import { getTranslations } from "next-intl/server";
import { badgeLang, storeLinks } from "@/lib/app-links";

export async function StoreBadges({ locale, className }: { locale: Locale; className?: string }) {
  const t = await getTranslations("Stores");
  const l = badgeLang(locale);
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <a
        href={storeLinks.ios}
        className="rounded-md transition-transform duration-fast hover:-translate-y-0.5 focus-visible:focus-ring"
        rel="noopener"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- offizielles Store-Badge (SVG) */}
        <img
          src={`/images/badges/app-store-${l}.svg`}
          alt={t("appStore")}
          width={144}
          height={48}
          className="h-12 w-auto"
        />
      </a>
      <a
        href={storeLinks.android}
        className="rounded-md transition-transform duration-fast hover:-translate-y-0.5 focus-visible:focus-ring"
        rel="noopener"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- offizielles Store-Badge (SVG) */}
        <img
          src={`/images/badges/google-play-${l}.svg`}
          alt={t("googlePlay")}
          width={162}
          height={48}
          className="h-12 w-auto"
        />
      </a>
    </div>
  );
}
