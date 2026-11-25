import { type Locale } from "@pickeed/i18n";
import { buttonClasses, cn } from "@pickeed/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import type { CSSProperties, ReactNode } from "react";
import { Demo } from "@/components/home/Demo";
import { PhotoMarquee } from "@/components/home/PhotoMarquee";
import { StoreBadges } from "@/components/home/StoreBadges";
import { Icon, type IconName } from "@/components/icons";
import { PhoneFrame } from "@/components/motion/PhoneFrame";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { screenshotLang, signinLink, signupLink } from "@/lib/app-links";
import { pathFor } from "@/lib/content";
import { alternatesFor } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Meta" });
  return {
    title: { absolute: t("title") },
    description: t("description"),
    alternates: alternatesFor(locale, "/"),
  };
}

const delay = (ms: number) => ({ ["--reveal-delay" as string]: `${ms}ms` }) as CSSProperties;

function Section({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={cn("scroll-mt-20 overflow-x-clip px-4 py-20 md:px-6 md:py-28", className)}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

function H2({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <h2
      id={id}
      data-reveal
      className={cn(
        "max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!hasLocale(routing.locales, raw)) notFound();
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const format = await getFormatter();
  const shot = (name: string) => `/images/app/${name}.${screenshotLang(locale)}.webp`;

  const features: Array<[string, IconName]> = [
    ["denktmit", "sparkles"],
    ["zusagen", "users"],
    ["circle", "circle"],
    ["entdecken", "ticket"],
    ["memories", "camera"],
    ["qr", "qr"],
  ];
  const profileItems = ["farbe", "song", "sticker", "status", "frei", "leute"] as const;
  const trust: Array<[string, IconName]> = [
    ["t1", "gift"],
    ["t2", "shield"],
    ["t3", "lock"],
    ["t4", "chat"],
    ["t5", "pin"],
  ];
  const examples: Array<["i1" | "i2" | "i3", IconName, string]> = [
    ["i1", "food", "/apero-organisieren"],
    ["i2", "gift", "/geburtstag-planen"],
    ["i3", "building", "/firmenevent-planen"],
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-10 pb-20 md:px-6 md:pt-16 md:pb-28">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-blush" aria-hidden="true" />
        <div
          className="animate-glow pointer-events-none absolute -top-40 right-[-10%] -z-10 size-[42rem] rounded-full bg-gradient-glow opacity-90"
          aria-hidden="true"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h1 className="animate-rise text-[clamp(2.75rem,6.2vw,5rem)] leading-[0.97] font-black tracking-[-0.045em] text-balance">
              {t("hero.h1a")}
              <span className="text-gradient-bloom">{t("hero.h1b")}</span>
              {t("hero.h1c")}
            </h1>
            <p
              className="animate-rise mt-6 max-w-xl text-body-lg text-text-2 md:text-[1.25rem] md:leading-8"
              style={{ ["--rise-delay" as string]: "120ms" }}
            >
              {t("hero.lead")}
            </p>
            <div
              className="animate-rise mt-8 flex flex-col items-start gap-4"
              style={{ ["--rise-delay" as string]: "240ms" }}
            >
              <a href={signupLink(locale)} className={buttonClasses({ size: "lg", className: "group" })}>
                {t("hero.cta")}
                <Icon
                  name="arrow"
                  className="size-5 transition-transform duration-fast group-hover:translate-x-1"
                />
              </a>
              <StoreBadges locale={locale} />
              <p className="flex items-center gap-2 text-body-sm text-text-2">
                <Icon name="share" className="size-4 text-primary" />
                {t("hero.friends")}
              </p>
            </div>
          </div>
          <div
            className="relative mx-auto h-[25rem] w-full max-w-[34rem] sm:h-[34rem]"
            role="img"
            aria-label={t("hero.phonesLabel")}
          >
            <div
              className="animate-rise absolute left-0 top-12 w-[38%] -rotate-6"
              style={{ ["--rise-delay" as string]: "380ms" }}
            >
              <div className="animate-float" style={{ ["--float-delay" as string]: "-2s" }}>
                <PhoneFrame src={shot("top-picks")} alt="" />
              </div>
            </div>
            <div
              className="animate-rise absolute right-0 top-14 w-[38%] rotate-6"
              style={{ ["--rise-delay" as string]: "520ms" }}
            >
              <div className="animate-float" style={{ ["--float-delay" as string]: "-4s" }}>
                <PhoneFrame src={shot("event")} alt="" />
              </div>
            </div>
            <div
              className="animate-rise absolute left-1/2 top-0 z-10 w-[46%] -translate-x-1/2"
              style={{ ["--rise-delay" as string]: "250ms" }}
            >
              <div className="animate-float">
                <PhoneFrame src={shot("start")} alt="" priority className="shadow-pop" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Drei Schritte */}
      <Section id="so-funktionierts" className="border-y border-line">
        <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
          {(["s1", "s2", "s3"] as const).map((k, i) => (
            <li key={k} data-reveal style={delay(i * 120)}>
              <span
                className="text-gradient-bloom block text-[clamp(3.5rem,7vw,5rem)] leading-none font-black tracking-[-0.04em]"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-h2">{t(`steps.${k}.title`)}</h3>
              <p className="mt-2 text-body-lg text-text-2">{t(`steps.${k}.text`)}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Top Picks */}
      <section className="bg-ink-section px-4 py-20 text-on-ink md:px-6 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div className="relative pb-10" data-reveal="zoom">
            {/* eslint-disable-next-line @next/next/no-img-element -- Foto als WebP */}
            <img
              src="/images/photos/club.webp"
              alt=""
              width={640}
              height={800}
              loading="lazy"
              className="aspect-[4/5] w-[82%] rounded-xl object-cover"
            />
            <div className="absolute right-0 bottom-0 w-[42%] rotate-3">
              <div className="animate-float">
                <PhoneFrame src={shot("top-picks")} alt={t("topPicks.sub")} />
              </div>
            </div>
          </div>
          <div>
            <H2 className="text-on-ink">{t("topPicks.title")}</H2>
            <p data-reveal style={delay(120)} className="mt-5 max-w-lg text-body-lg text-on-ink-2">
              {t("topPicks.text")}
            </p>
            <p
              data-reveal
              style={delay(220)}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--pk-on-ink-2)]/30 px-4 py-2 text-body-sm text-on-ink-2"
            >
              <Icon name="star" className="size-4 text-pink-400" />
              {t("topPicks.sub")}
            </p>
          </div>
        </div>
      </section>

      {/* So funktioniert's (Demo) */}
      <Section>
        <div className="mb-12 flex flex-col gap-4 md:mb-16">
          <H2>{t("demo.title")}</H2>
          <p data-reveal style={delay(100)} className="max-w-2xl text-body-lg text-text-2">
            {t("demo.intro")}
          </p>
          <p
            data-reveal
            style={delay(180)}
            className="max-w-2xl rounded-lg border border-primary-soft-line bg-primary-soft p-4 text-body text-text-1"
          >
            <strong className="text-link">{t("plan.title")}:</strong> {t("plan.text")}
          </p>
        </div>
        <div data-reveal style={delay(120)}>
          <Demo />
        </div>
      </Section>

      {/* Alles drin */}
      <Section className="pt-0 md:pt-0">
        <H2>{t("features.title")}</H2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([key, icon], i) => (
            <li
              key={key}
              data-reveal
              style={delay((i % 3) * 100)}
              className="group rounded-xl border border-line bg-surface-raised p-6 transition-[transform,box-shadow,border-color] duration-base hover:-translate-y-1 hover:border-primary-soft-line hover:shadow-2"
            >
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-gradient-action text-on-primary shadow-pop transition-transform duration-base group-hover:scale-110 group-hover:rotate-6">
                <Icon name={icon} className="size-5" />
              </span>
              <h3 className="mt-5 text-h3">
                {t(`features.items.${key}.title` as "features.items.qr.title")}
              </h3>
              <p className="mt-2 text-body text-text-2">
                {t(`features.items.${key}.text` as "features.items.qr.text")}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <PhotoMarquee />

      {/* Profil */}
      <Section>
        <p data-reveal className="text-caption font-bold tracking-[0.14em] text-link uppercase">
          {t("profile.kicker")}
        </p>
        <H2 className="mt-3">{t("profile.title")}</H2>
        <p data-reveal style={delay(100)} className="mt-5 max-w-2xl text-body-lg text-text-2">
          {t("profile.lead")}
        </p>
        <p className="mt-4 text-body-sm text-text-3 md:hidden">{t("profile.swipe")} →</p>
        {/* Auf dem Handy seitlich scrollbar – per Tastatur fokussierbar (WCAG 2.1.1) */}
        <ul
          tabIndex={0}
          aria-label={t("profile.title")}
          className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 focus-visible:focus-ring md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0"
        >
          {profileItems.map((key, i) => (
            <li
              key={key}
              data-reveal
              style={delay((i % 3) * 110)}
              className="flex w-[78vw] max-w-sm shrink-0 snap-center flex-col overflow-hidden rounded-xl bg-surface md:w-auto md:max-w-none"
            >
              <div className="p-6 pb-0">
                <h3 className="text-h3">{t(`profile.items.${key}.title`)}</h3>
                <p className="mt-2 text-body text-text-2">{t(`profile.items.${key}.text`)}</p>
              </div>
              <div className="mt-6 h-72 overflow-hidden px-10 sm:h-80">
                <PhoneFrame
                  src={shot(`profil-${key}`)}
                  alt=""
                  className="mx-auto w-full max-w-[15rem] translate-y-2 transition-transform duration-slow ease-out hover:-translate-y-2"
                />
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Einladung per Link */}
      <Section className="pt-0 md:pt-0">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <H2>{t("invitee.title")}</H2>
            <p data-reveal style={delay(100)} className="mt-5 text-body-lg text-text-2">
              {t("invitee.lead")}
            </p>
            <ol className="mt-8 flex flex-col gap-5">
              {(["p1", "p2", "p3"] as const).map((k, i) => (
                <li key={k} data-reveal style={delay(160 + i * 110)} className="flex items-start gap-4">
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-primary text-body font-bold text-link">
                    {i + 1}
                  </span>
                  <span className="pt-2 text-body-lg">{t(`invitee.${k}`)}</span>
                </li>
              ))}
            </ol>
          </div>
          <figure data-reveal="zoom" style={delay(150)} className="relative">
            <div
              className="pointer-events-none absolute -inset-8 rounded-full bg-gradient-glow"
              aria-hidden="true"
            />
            <div className="relative rounded-xl border border-line bg-surface-raised p-6 shadow-pop">
              <p className="flex items-center gap-3 text-h3">
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-primary-soft text-body-sm font-bold text-link">
                  LE
                </span>
                {t("invitee.invites")}
              </p>
              <div className="mt-5 flex items-center gap-4 rounded-lg border border-line p-4">
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-[var(--pk-phone-ink)] text-white">
                  <Icon name="food" className="size-5" />
                </span>
                <span>
                  <span className="block text-body-lg font-semibold">{t("demo.plan")}</span>
                  <span className="text-body-sm font-medium text-link">{t("invitee.finding")}</span>
                </span>
              </div>
              <p className="mt-6 text-body-sm font-semibold">{t("invitee.name")}</p>
              <div
                className="mt-2 flex h-12 items-center rounded-md border-2 border-primary px-4 text-body-lg"
                aria-hidden="true"
              >
                <span
                  className="animate-type inline-block overflow-hidden border-r-2 border-primary pr-0.5 whitespace-nowrap"
                  style={{
                    ["--type-steps" as string]: String(t("invitee.nameValue").length),
                    width: `${t("invitee.nameValue").length + 0.3}ch`,
                  }}
                >
                  {t("invitee.nameValue")}
                </span>
              </div>
              <p className="mt-2 text-body-sm text-text-2">{t("invitee.noAccount")}</p>
              <span
                className={buttonClasses({ fullWidth: true, className: "mt-5 pointer-events-none" })}
                aria-hidden="true"
              >
                {t("invitee.join")}
              </span>
            </div>
          </figure>
        </div>
      </Section>

      {/* Wofür Gruppen Pickeed nutzen */}
      <Section className="pt-0 md:pt-0">
        <H2>{t("examples.title")}</H2>
        <ul className="mt-10 grid gap-8 md:grid-cols-3">
          {examples.map(([key, icon, guide], i) => (
            <li
              key={key}
              data-reveal
              style={delay(i * 110)}
              className="group border-t-2 border-line pt-6 transition-colors duration-base hover:border-primary"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-[var(--pk-phone-ink)] text-white transition-colors duration-base group-hover:bg-primary">
                <Icon name={icon} className="size-5" />
              </span>
              <h3 className="mt-4 text-h3">{t(`examples.${key}.title`)}</h3>
              <p className="mt-2 text-body text-text-2">{t(`examples.${key}.text`)}</p>
              <Link
                href={pathFor(guide, locale)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-sm text-body-sm font-semibold text-link hover:underline focus-visible:focus-ring"
              >
                {t("examples.more")}
                <span className="sr-only">: {t(`examples.${key}.title`)}</span>
                <Icon
                  name="arrow"
                  className="size-4 transition-transform duration-fast group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Für Businesses, Creator und Vereine */}
      <section className="relative overflow-hidden bg-ink-section px-4 py-20 text-on-ink md:px-6 md:py-28">
        <div
          className="animate-glow pointer-events-none absolute -bottom-40 -left-20 size-[36rem] rounded-full bg-gradient-glow opacity-70"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.3fr_1fr]">
          <div>
            <p data-reveal className="text-caption font-bold tracking-[0.14em] text-pink-400 uppercase">
              {t("business.kicker")}
            </p>
            <H2 className="mt-3 text-on-ink">{t("business.title")}</H2>
            <p data-reveal style={delay(100)} className="mt-5 max-w-xl text-body-lg text-on-ink-2">
              {t("business.text")}
            </p>
            <p
              data-reveal
              style={delay(160)}
              className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-body-sm font-semibold"
            >
              <Link
                href="/fuer-firmen"
                className="underline underline-offset-4 hover:text-pink-400 focus-visible:focus-ring"
              >
                {t("business.companies")}
              </Link>
              <Link
                href="/fuer-creator"
                className="underline underline-offset-4 hover:text-pink-400 focus-visible:focus-ring"
              >
                {t("business.creators")}
              </Link>
              <Link
                href="/fuer-vereine"
                className="underline underline-offset-4 hover:text-pink-400 focus-visible:focus-ring"
              >
                {t("business.clubs")}
              </Link>
            </p>
            <div data-reveal style={delay(220)} className="mt-8">
              <a href={signupLink(locale)} className={buttonClasses({ size: "lg" })}>
                {t("business.cta")}
              </a>
            </div>
          </div>
          <div data-reveal="zoom" style={delay(150)}>
            {/* eslint-disable-next-line @next/next/no-img-element -- Foto als WebP */}
            <img
              src="/images/photos/picknick.webp"
              alt=""
              width={640}
              height={800}
              loading="lazy"
              className="mx-auto aspect-[4/5] w-full max-w-sm rounded-xl object-cover md:rotate-2"
            />
          </div>
        </div>
      </section>

      {/* Daten */}
      <Section>
        <H2>{t("privacy.title")}</H2>
        <p data-reveal style={delay(100)} className="mt-5 max-w-2xl text-body-lg text-text-2">
          {t("privacy.text")}
        </p>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {trust.map(([key, icon], i) => (
            <li
              key={key}
              data-reveal
              style={delay(i * 80)}
              className="flex items-center gap-3 rounded-lg border border-line bg-surface-raised p-4"
            >
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--pk-phone-ink)] text-white">
                <Icon name={icon} className="size-4" />
              </span>
              <span className="text-body-sm font-semibold">
                {t(`privacy.items.${key}` as "privacy.items.t1")}
              </span>
            </li>
          ))}
        </ul>
        <p data-reveal className="mt-6 text-body-sm text-text-2">
          {t("privacy.free", {
            date: format.dateTime(new Date(Date.UTC(2027, 4, 31, 12)), { dateStyle: "long" }),
          })}{" "}
          <Link
            href="/preise"
            className="inline-flex items-center gap-1 font-semibold text-link hover:underline"
          >
            {t("privacy.freeMore")}
            <Icon name="arrow" className="size-4" />
          </Link>
        </p>
      </Section>

      {/* Abschluss */}
      <Section className="pt-0 md:pt-0">
        <div
          data-reveal="zoom"
          className="relative overflow-hidden rounded-xl border border-line bg-surface-raised px-6 py-16 text-center shadow-2 md:py-20"
        >
          <div
            className="animate-glow pointer-events-none absolute -top-32 left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-gradient-glow"
            aria-hidden="true"
          />
          <div className="relative">
            <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-balance">
              {t("final.title")}
            </h2>
            <p className="mt-4 text-body-lg text-text-2">{t("final.text")}</p>
            <a href={signupLink(locale)} className={buttonClasses({ size: "lg", className: "group mt-8" })}>
              {t("hero.cta")}
              <Icon
                name="arrow"
                className="size-5 transition-transform duration-fast group-hover:translate-x-1"
              />
            </a>
            <p className="mt-5 text-body-sm text-text-2">
              {t("final.already")}{" "}
              <a href={signinLink(locale)} className="font-semibold text-link underline underline-offset-4">
                {t("final.signIn")}
              </a>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
