import { Avatar, Badge, Button, Card, Skeleton, Spinner, TextField } from "@pickeed/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { routing } from "@/i18n/routing";
import { isDesignPreviewEnabled } from "@/lib/site";

/** Freigabe wird zur Laufzeit geprüft (ENABLE_DESIGN_PREVIEW), nicht beim Build. */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Design");
  return { title: t("metaTitle"), robots: { index: false, follow: false } };
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-line py-10">
      <h2 id={id} className="text-h2">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/** Farbfelder: Klassen stammen aus den Tokens, nicht aus Hex-Werten. */
const swatches = [
  { key: "primary", className: "bg-primary" },
  { key: "surface", className: "bg-surface border border-line" },
  { key: "text", className: "bg-text-1" },
  { key: "success", className: "bg-success" },
  { key: "warning", className: "bg-warning" },
  { key: "danger", className: "bg-danger" },
  { key: "bloom", className: "bg-gradient-bloom" },
  { key: "action", className: "bg-gradient-action" },
] as const;

const pinkScale = [
  "bg-pink-50",
  "bg-pink-100",
  "bg-pink-200",
  "bg-pink-400",
  "bg-pink-500",
  "bg-pink-600",
  "bg-pink-700",
];

export default async function DesignPage({ params }: { params: Promise<{ locale: string }> }) {
  if (!isDesignPreviewEnabled()) notFound();
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Design");
  const format = await getFormatter();
  const sampleDate = new Date(Date.UTC(2026, 10, 27, 18, 30));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      <h1 className="text-h1">{t("title")}</h1>
      <p className="mt-2 max-w-2xl text-body-lg text-text-2">{t("intro")}</p>

      <Section id="colors" title={t("sections.colors")}>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {swatches.map((s) => (
            <li key={s.key} className="flex flex-col gap-2">
              <span className={`h-16 rounded-md ${s.className}`} aria-hidden="true" />
              <span className="text-body-sm text-text-2">{t(`colorNames.${s.key}`)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex overflow-hidden rounded-md" aria-hidden="true">
          {pinkScale.map((c) => (
            <span key={c} className={`h-10 flex-1 ${c}`} />
          ))}
        </div>
      </Section>

      <Section id="typography" title={t("sections.typography")}>
        <div className="flex flex-col gap-3">
          <p className="text-display">{t("typeSample")}</p>
          <p className="text-h1">{t("typeSample")}</p>
          <p className="text-h2">{t("typeSample")}</p>
          <p className="text-h3">{t("typeSample")}</p>
          <p className="text-body-lg">{t("bodySample")}</p>
          <p className="text-body">{t("bodySample")}</p>
          <p className="text-body-sm text-text-2">{t("bodySample")}</p>
          <p className="text-caption text-text-3">{t("bodySample")}</p>
        </div>
      </Section>

      <Section id="buttons" title={t("sections.buttons")}>
        <div className="flex flex-wrap items-center gap-3">
          <Button>{t("buttons.primary")}</Button>
          <Button variant="secondary">{t("buttons.secondary")}</Button>
          <Button variant="tertiary">{t("buttons.tertiary")}</Button>
          <Button variant="danger">{t("buttons.danger")}</Button>
          <Button loading loadingLabel={t("buttons.loading")}>
            {t("buttons.primary")}
          </Button>
          <Button disabled>{t("buttons.disabled")}</Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button size="sm">{t("buttons.primary")}</Button>
          <Button size="md">{t("buttons.primary")}</Button>
          <Button size="lg">{t("buttons.primary")}</Button>
        </div>
      </Section>

      <Section id="forms" title={t("sections.forms")}>
        <div className="grid max-w-md gap-5">
          <TextField
            label={t("form.emailLabel")}
            type="email"
            autoComplete="email"
            placeholder={t("form.emailPlaceholder")}
            hint={t("form.emailHint")}
          />
          <TextField label={t("form.nameLabel")} required error={t("form.nameError")} />
        </div>
      </Section>

      <Section id="cards" title={t("sections.cards")}>
        <div className="grid gap-4 sm:grid-cols-3">
          {(["default", "outline", "raised"] as const).map((variant) => (
            <Card key={variant} variant={variant}>
              <p className="text-h3">{t("card.title")}</p>
              <p className="mt-1 text-body-sm text-text-2">{t("card.meta", { count: 4 })}</p>
              <div className="mt-4 flex -space-x-2 [&>*]:rounded-full [&>*]:ring-2 [&>*]:ring-surface-raised">
                <Avatar name={t("people.person1")} size="sm" />
                <Avatar name={t("people.person2")} size="sm" />
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="people" title={t("sections.people")}>
        <div className="flex flex-wrap items-end gap-4">
          <Avatar name={t("people.person1")} size="xs" />
          <Avatar name={t("people.person1")} size="sm" />
          <Avatar name={t("people.person2")} size="md" ring />
          <Avatar name={t("people.page")} size="lg" verifiedLabel={t("badges.confirmed")} />
          <Avatar name={t("people.person1")} size="xl" ring />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Badge>{t("badges.draft")}</Badge>
          <Badge tone="primary">{t("badges.new")}</Badge>
          <Badge tone="success">{t("badges.confirmed")}</Badge>
          <Badge tone="warning">{t("badges.full")}</Badge>
          <Badge tone="danger">{t("buttons.danger")}</Badge>
        </div>
      </Section>

      <Section id="feedback" title={t("sections.feedback")}>
        <div className="flex items-center gap-6">
          <Spinner size="lg" label={t("buttons.loading")} />
          <div className="flex flex-1 items-center gap-3">
            <Skeleton shape="circle" className="size-11" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton shape="text" className="w-1/2" />
              <Skeleton shape="text" className="w-1/3" />
            </div>
          </div>
        </div>
      </Section>

      <Section id="formats" title={t("sections.formats")}>
        <ul className="flex flex-col gap-2 text-body">
          <li>
            {t("formats.money", { amount: format.number(24.5, { style: "currency", currency: "CHF" }) })}
          </li>
          <li>
            {t("formats.date", {
              date: format.dateTime(sampleDate, { dateStyle: "full", timeStyle: "short" }),
            })}
          </li>
          <li>{t("formats.number", { value: format.number(1234567) })}</li>
        </ul>
      </Section>
    </div>
  );
}
