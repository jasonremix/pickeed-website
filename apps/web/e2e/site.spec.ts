import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const pages = [
  { path: "/", lang: "de-CH", title: "Weniger scrollen. Mehr zusammen erleben." },
  { path: "/fr", lang: "fr-CH", title: "Moins scroller. Vivre plus ensemble." },
  { path: "/it", lang: "it-CH", title: "Meno scroll. Più momenti insieme." },
  { path: "/en", lang: "en-CH", title: "Scroll less. Do more together." },
] as const;

async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

async function expectAccessible(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`)).toEqual([]);
}

for (const p of pages) {
  test(`Startseite ${p.lang}: Sprache, Inhalt, hreflang`, async ({ page }) => {
    await page.goto(p.path);
    await expect(page.locator("html")).toHaveAttribute("lang", p.lang);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.title);
    for (const hreflang of ["de-CH", "fr-CH", "it-CH", "en-CH", "x-default"]) {
      await expect(page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`)).toHaveCount(1);
    }
    await expectNoHorizontalScroll(page);
  });
}

test("Spracherkennung: englischer Browser wird auf /en geleitet", async ({ browser }) => {
  const context = await browser.newContext({ locale: "en-US" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en-CH");
  await context.close();
});

test("Sprachwechsel führt zur französischen Version", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Sprache").selectOption("fr-CH");
  await expect(page).toHaveURL(/\/fr$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr-CH");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(pages[1].title);
});

test("Dunkelmodus wird gewählt und bleibt nach dem Neuladen erhalten", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("radio", { name: "Dunkel" }).check({ force: true });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("radio", { name: "Dunkel" })).toBeChecked();
  await page.getByRole("radio", { name: "System" }).check({ force: true });
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
});

test("Unbekannte Seite zeigt lokalisierte 404", async ({ page }) => {
  const response = await page.goto("/it/gibt-es-nicht");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pagina non trovata");
  await page.getByRole("link", { name: "Alla pagina iniziale", exact: true }).click();
  await expect(page).toHaveURL(/\/it$/);
});

test("Skip-Link springt zum Inhalt", async ({ page, isMobile }) => {
  test.skip(isMobile, "Tastaturnavigation nur auf Desktop");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Zum Inhalt springen" });
  await expect(skip).toBeFocused();
  await skip.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test.describe("Barrierefreiheit (axe, WCAG 2.2 AA)", () => {
  for (const theme of ["light", "dark"] as const) {
    test(`Startseite im Modus ${theme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme });
      await page.goto("/");
      await expectAccessible(page);
    });

    test(`Designsystem im Modus ${theme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme });
      await page.goto("/design");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Designsystem");
      await expectAccessible(page);
      await expectNoHorizontalScroll(page);
    });
  }
});

test("Sicherheitsheader und robots", async ({ request }) => {
  const res = await request.get("/");
  const headers = res.headers();
  expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-powered-by"]).toBeUndefined();
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /design");
});
