/** Öffentliche Basis-URL (ohne abschliessenden Schrägstrich). In Produktion über SITE_URL gesetzt. */
export const siteUrl = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Interne Designsystem-Seite: in Entwicklung immer, in Produktion nur mit ENABLE_DESIGN_PREVIEW=true. */
export function isDesignPreviewEnabled(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.ENABLE_DESIGN_PREVIEW === "true";
}
