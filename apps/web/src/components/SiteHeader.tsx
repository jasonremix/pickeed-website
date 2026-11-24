import { Badge, Wordmark } from "@pickeed/ui";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function SiteHeader() {
  const t = await getTranslations();
  return (
    <header className="sticky top-0 z-40 glass border-b border-line">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href="/"
          aria-label={t("Header.homeLink")}
          className="rounded-sm text-h3 focus-visible:focus-ring"
        >
          <Wordmark />
        </Link>
        <Badge tone="primary">{t("Common.inDevelopment")}</Badge>
      </div>
    </header>
  );
}
