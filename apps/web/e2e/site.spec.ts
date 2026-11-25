import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import de from "@pickeed/i18n/messages/de-CH.json" with { type: "json" };
import en from "@pickeed/i18n/messages/en-CH.json" with { type: "json" };
import es from "@pickeed/i18n/messages/es-419.json" with { type: "json" };
import fr from "@pickeed/i18n/messages/fr-CH.json" with { type: "json" };
import it from "@pickeed/i18n/messages/it-CH.json" with { type: "json" };
import pt from "@pickeed/i18n/messages/pt-BR.json" with { type: "json" };

const h1 = (m: typeof de) => `${m.Home.hero.h1a}${m.Home.hero.h1b}${m.Home.hero.h1c}`;
const homes = [
  { path: "/", lang: "de-CH", m: de },
  { path: "/fr", lang: "fr-CH", m: fr },
  { path: "/it", lang: "it-CH", m: it },
  { path: "/en", lang: "en-CH", m: en },
  { path: "/es", lang: "es-419", m: es },
  { path: "/pt", lang: "pt-BR", m: pt },
] as const;

async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

async function expectAccessible(page: Page) {
  // Animationen abschliessen, damit axe die endgültigen Farben prüft
  await page.evaluate(() =>
    document.querySelectorAll("[data-reveal]").forEach((el) => el.setAttribute("data-revealed", "")),
  );
  await page.waitForTimeout(800);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
}

for (const h of homes) {
  test(`Startseite ${h.lang}: Sprache, offizieller Titel, hreflang`, async ({ page }) => {
    await page.goto(h.path);
    await expect(page.locator("html")).toHaveAttribute("lang", h.lang);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1(h.m));
    await expect(page).toHaveTitle(h.m.Meta.title);
    for (const l of ["de-CH", "fr-CH", "it-CH", "en-CH", "es-419", "pt-BR", "x-default"]) {
      await expect(page.locator(`link[rel="alternate"][hreflang="${l}"]`)).toHaveCount(1);
    }
    await expectNoHorizontalScroll(page);
  });
}

test("Startseite: alle Abschnitte der offiziellen Website sind vorhanden", async ({ page }) => {
  await page.goto("/");
  for (const title of [
    de.Home.topPicks.title,
    de.Home.demo.title,
    de.Home.features.title,
    de.Home.profile.title,
    de.Home.invitee.title,
    de.Home.examples.title,
    de.Home.business.title,
    de.Home.privacy.title,
    de.Home.final.title,
  ]) {
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
  }
});

test("Aufrufe führen zur App und in die Stores", async ({ page }) => {
  await page.goto("/fr");
  await expect(page.getByRole("link", { name: fr.Home.hero.cta }).first()).toHaveAttribute(
    "href",
    /^https:\/\/pickeed\.com\/fr\/anmelden/,
  );
  await expect(page.getByRole("link", { name: fr.Stores.appStore }).first()).toHaveAttribute(
    "href",
    /apps\.apple\.com/,
  );
  await expect(page.getByRole("link", { name: fr.Stores.googlePlay }).first()).toHaveAttribute(
    "href",
    /play\.google\.com/,
  );
});

test("Spracherkennung: englischer Browser wird auf /en geleitet", async ({ browser }) => {
  const context = await browser.newContext({ locale: "en-US" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
  await context.close();
});

test("Sprachwechsel auf der Startseite", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel(de.LanguageSwitcher.label).selectOption("it-CH");
  await expect(page).toHaveURL(/\/it$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(h1(it));
});

test("Sprachwechsel auf einer Seite mit übersetzter Adresse", async ({ page }) => {
  await page.goto("/en/plan-a-birthday-party");
  await page.getByLabel(en.LanguageSwitcher.label).selectOption("de-CH");
  await expect(page).toHaveURL(/\/geburtstag-planen$/);
  await page.getByLabel(de.LanguageSwitcher.label).selectOption("fr-CH");
  await expect(page).toHaveURL(/\/fr\/organiser-un-anniversaire$/);
});

test("Unterseiten aus allen Bereichen werden dargestellt", async ({ page }) => {
  const pages: Array<[string, RegExp]> = [
    ["/preise", /Pickeed ist kostenlos/],
    ["/fuer-creator", /Werde gefunden/],
    ["/fuer-firmen", /Teamevents/],
    ["/fuer-vereine", /Verein/],
    ["/entdecken", /Mitmachen/],
    ["/warteliste", /Pickeed fürs Handy/],
    ["/hilfe", /Hilfecenter/],
    ["/kontakt", /Schreib uns/],
    ["/impressum", /Impressum/],
    ["/datenschutz", /Datenschutz/],
    ["/agb", /Geschäftsbedingungen/],
    ["/anlaesse-planen", /Events planen/],
    ["/geburtstag-planen/bern", /Bern/],
    ["/travel-guide", /Travel Guide/],
    ["/travel-guide/zermatt", /Zermatt/],
    ["/en/travel-guide/tokyo", /Tokyo/],
    ["/it/organizzare-un-compleanno/ginevra", /Ginevra/],
  ];
  for (const [path, heading] of pages) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(200);
    await expect(page.getByRole("heading", { level: 1 }), path).toHaveText(heading);
  }
});

test("Alle internen Links der Übersichtsseiten funktionieren", async ({ page, request }) => {
  const hubs = [
    "/",
    "/fr",
    "/en/event-planning-guides",
    "/anlaesse-planen",
    "/travel-guide",
    "/hilfe",
    "/preise",
    "/pt/travel-guide/lissabon",
  ];
  const links = new Set<string>();
  for (const hub of hubs) {
    await page.goto(hub);
    for (const href of await page
      .locator("a[href^='/']")
      .evaluateAll((as) => as.map((a) => a.getAttribute("href")!))) {
      links.add(href.split("#")[0]!);
    }
  }
  const broken: string[] = [];
  for (const href of links) {
    const res = await request.get(href, { maxRedirects: 2 });
    if (res.status() !== 200) broken.push(`${href} → ${res.status()}`);
  }
  expect(links.size).toBeGreaterThan(150);
  expect(broken).toEqual([]);
});

test("Häufige Fragen lassen sich auf- und zuklappen", async ({ page }) => {
  await page.goto("/geburtstag-planen");
  const question = page.locator("details").first();
  await expect(question).not.toHaveAttribute("open", "");
  await question.locator("summary").click();
  await expect(question).toHaveAttribute("open", "");
});

test("Demo «So funktioniert’s» lässt sich steuern", async ({ page }) => {
  await page.goto("/");
  const demo = page.locator("section", { has: page.getByRole("heading", { name: de.Home.demo.title }) });
  await demo.scrollIntoViewIfNeeded();
  await demo.getByRole("button", { name: de.Home.demo.steps.idea.title }).click();
  await expect(demo.getByText(de.Home.demo.vote)).toBeVisible();
  await demo.getByRole("button", { name: de.Home.demo.next }).click();
  await expect(demo.getByText(de.Home.demo.ready, { exact: true })).toBeVisible();
});

test("Menü auf dem Handy", async ({ page, isMobile }) => {
  test.skip(!isMobile, "nur mobil");
  await page.goto("/");
  await page.getByRole("button", { name: de.Common.menu }).click();
  const menu = page.getByRole("dialog", { name: de.Common.menu });
  await expect(menu).toBeVisible();
  await menu.getByRole("link", { name: de.Nav.pricing }).click();
  await expect(page).toHaveURL(/\/preise$/);
  await expect(menu).toBeHidden();
});

test("Dunkelmodus wird gewählt und bleibt nach dem Neuladen erhalten", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("radio", { name: de.ThemeSwitcher.dark }).check({ force: true });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("radio", { name: de.ThemeSwitcher.system }).check({ force: true });
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
});

test("Unbekannte Seite zeigt lokalisierte 404", async ({ page }) => {
  const response = await page.goto("/it/gibt-es-nicht");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(it.NotFound.title);
});

test("Skip-Link springt zum Inhalt", async ({ page, isMobile }) => {
  test.skip(isMobile, "Tastaturnavigation nur auf Desktop");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: de.Common.skipToContent });
  await expect(skip).toBeFocused();
  await skip.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test.describe("Barrierefreiheit (axe, WCAG 2.2 AA)", () => {
  for (const theme of ["light", "dark"] as const) {
    for (const path of ["/", "/preise", "/travel-guide/zermatt", "/hilfe", "/datenschutz", "/design"]) {
      test(`${path} im Modus ${theme}`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: theme });
        await page.goto(path);
        await expectAccessible(page);
        await expectNoHorizontalScroll(page);
      });
    }
  }
});

test("Sicherheitsheader, robots und Sitemap", async ({ request }) => {
  const res = await request.get("/");
  const headers = res.headers();
  expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-powered-by"]).toBeUndefined();
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /design");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/en/plan-a-birthday-party");
  expect(sitemap).toContain("/pt/travel-guide/zermatt");
  expect((sitemap.match(/<url>/g) ?? []).length).toBeGreaterThan(1600);
});
