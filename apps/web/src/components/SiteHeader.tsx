import type { Locale } from "@pickeed/i18n";
import { buttonClasses } from "@pickeed/ui";
import { getLocale, getTranslations } from "next-intl/server";
import { Logo } from "@/components/brand/Logo";
import { MobileMenu } from "@/components/MobileMenu";
import { Link } from "@/i18n/navigation";
import { signinLink } from "@/lib/app-links";

export async function SiteHeader() {
  const t = await getTranslations();
  const locale = (await getLocale()) as Locale;
  const links = [
    { href: "/entdecken", label: t("Nav.discover") },
    { href: "/fuer-creator", label: t("Nav.creators") },
    { href: "/fuer-firmen", label: t("Nav.companies") },
    { href: "/preise", label: t("Nav.pricing") },
    { href: "/warteliste", label: t("Nav.app") },
  ];
  return (
    <header className="glass sticky top-0 z-40 border-b border-line">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:h-[4.5rem] md:px-6">
        <Link
          href="/"
          aria-label={t("Header.homeLink")}
          className="rounded-sm text-[1.65rem] focus-visible:focus-ring"
        >
          <Logo />
        </Link>
        <nav aria-label={t("Nav.how")} className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-body-sm font-semibold text-text-1 transition-colors duration-fast hover:bg-surface focus-visible:focus-ring"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={signinLink(locale)} className={buttonClasses({ size: "sm", className: "h-10 px-4" })}>
            {t("Nav.signIn")}
          </a>
          <MobileMenu>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-md px-3 py-3 hover:bg-surface focus-visible:focus-ring"
              >
                {l.label}
              </Link>
            ))}
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
