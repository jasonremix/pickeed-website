import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Alle Seiten ausser API, Next.js-Interna und Dateien mit Endung.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
