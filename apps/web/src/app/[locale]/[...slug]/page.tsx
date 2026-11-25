import type { Locale } from "@pickeed/i18n";
import { buttonClasses } from "@pickeed/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContentRenderer } from "@/components/content/ContentRenderer";
import { Icon } from "@/components/icons";
import { routing } from "@/i18n/routing";
import { appLink } from "@/lib/app-links";
import { allPaths, getPage, getRoutes, keyFor } from "@/lib/content";
import { alternatesFor } from "@/lib/metadata";

/** Rechtstexte werden als ruhiger Fliesstext dargestellt. */
const PROSE = new Set(["/impressum", "/datenschutz", "/agb", "/recht/urheberrecht"]);

export function generateStaticParams() {
  return allPaths()
    .filter((p) => p.path !== "/")
    .map((p) => ({ locale: p.locale, slug: p.path.split("/").filter(Boolean) }));
}

async function resolve(params: Promise<{ locale: string; slug: string[] }>) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return null;
  const path = `/${slug.map(decodeURIComponent).join("/")}`;
  const page = getPage(locale as Locale, path);
  return page ? { locale: locale as Locale, path, page } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const r = await resolve(params);
  if (!r) return {};
  const key = keyFor(r.locale, r.path);
  const alts = key ? getRoutes()[key] : undefined;
  return {
    title: { absolute: r.page.title },
    description: r.page.description,
    alternates: alternatesFor(r.locale, (l) => alts?.[l] ?? r.path),
  };
}

export default async function ContentRoute({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const r = await resolve(params);
  if (!r) notFound();
  setRequestLocale(r.locale);
  const t = await getTranslations("Common");
  const after =
    r.path === "/kontakt" ? (
      <div data-reveal className="flex justify-center">
        <a href={appLink(r.locale, "/kontakt")} className={buttonClasses({ size: "lg", className: "group" })}>
          {t("contactForm")}
          <Icon
            name="arrow"
            className="size-5 transition-transform duration-fast group-hover:translate-x-1"
          />
        </a>
      </div>
    ) : undefined;
  return (
    <ContentRenderer
      page={r.page}
      locale={r.locale}
      mode={PROSE.has(r.path) ? "prose" : "marketing"}
      after={after}
    />
  );
}
