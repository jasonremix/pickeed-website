import { Badge, Card } from "@pickeed/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { routing } from "@/i18n/routing";
import { alternatesFor } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  return { alternates: alternatesFor(locale, "/") };
}

const pillarIcons: Record<"discover" | "plan" | "share", ReactNode> = {
  discover: (
    <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
  ),
  plan: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4M8.5 14.5l2 2 4-4" />
    </>
  ),
  share: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <path d="m3.5 16 5-5 4 4 3-3 5 5" />
      <circle cx="15.5" cy="9" r="1.5" />
    </>
  ),
};

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const pillars = ["discover", "plan", "share"] as const;

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-blush">
        <div className="pointer-events-none absolute inset-0 bg-gradient-glow" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 pt-16 pb-20 md:px-6 md:pt-24 md:pb-28">
          <Badge tone="primary">{t("kicker")}</Badge>
          <h1 className="max-w-3xl text-display text-balance">{t("title")}</h1>
          <p className="max-w-2xl text-body-lg text-text-2">{t("subtitle")}</p>
          <Card variant="outline" padding="sm" className="mt-2 flex max-w-2xl items-start gap-3">
            <svg
              viewBox="0 0 24 24"
              className="mt-0.5 size-5 shrink-0 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5M12 8h.01" />
            </svg>
            <p className="text-body-sm text-text-2">{t("statusBody")}</p>
          </Card>
        </div>
      </section>

      <section aria-labelledby="pillars-title" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <h2 id="pillars-title" className="text-h2">
          {t("pillarsTitle")}
        </h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3 md:gap-6">
          {pillars.map((key) => (
            <li key={key}>
              <Card variant="raised" padding="lg" className="h-full">
                <span className="inline-flex size-12 items-center justify-center rounded-md bg-primary-soft text-primary">
                  <svg
                    viewBox="0 0 24 24"
                    className="size-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {pillarIcons[key]}
                  </svg>
                </span>
                <h3 className="mt-5 text-h3">{t(`pillars.${key}.title`)}</h3>
                <p className="mt-2 text-body text-text-2">{t(`pillars.${key}.body`)}</p>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
