import { buttonClasses } from "@pickeed/ui";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("NotFound");
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="text-display text-gradient-bloom" aria-hidden="true">
        404
      </p>
      <h1 className="mt-4 text-h1">{t("title")}</h1>
      <p className="mt-2 text-body-lg text-text-2">{t("body")}</p>
      <Link href="/" className={buttonClasses({ variant: "primary", className: "mt-8" })}>
        {t("back")}
      </Link>
    </div>
  );
}
