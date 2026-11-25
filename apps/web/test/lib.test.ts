import { describe, expect, it } from "vitest";
import { alternatesFor } from "@/lib/metadata";
import { parseThemePreference, resolveTheme, themeInitScript } from "@/lib/theme";

describe("Theme", () => {
  it("akzeptiert nur gültige Werte", () => {
    expect(parseThemePreference("dark")).toBe("dark");
    expect(parseThemePreference("light")).toBe("light");
    expect(parseThemePreference("blau")).toBe("system");
    expect(parseThemePreference(null)).toBe("system");
  });

  it("löst «system» über die Systemeinstellung auf", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
    expect(resolveTheme("light", true)).toBe("light");
  });

  it("Init-Skript ist gültiges JavaScript", () => {
    expect(() => new Function(themeInitScript)).not.toThrow();
  });
});

describe("hreflang-Alternativen", () => {
  it("liefern alle Sprachen, x-default und die kanonische URL", () => {
    const a = alternatesFor("fr-CH", "/");
    expect(a.canonical).toBe("http://localhost:3000/fr");
    expect(a.languages).toEqual({
      "de-CH": "http://localhost:3000/",
      "fr-CH": "http://localhost:3000/fr",
      "it-CH": "http://localhost:3000/it",
      "en-CH": "http://localhost:3000/en",
      "es-419": "http://localhost:3000/es",
      "pt-BR": "http://localhost:3000/pt",
      "x-default": "http://localhost:3000/",
    });
  });
});

describe("hreflang mit übersetzten Adressen", () => {
  it("verwendet je Sprache den passenden Pfad", () => {
    const paths: Record<string, string> = {
      "de-CH": "/geburtstag-planen",
      "en-CH": "/plan-a-birthday-party",
    };
    const a = alternatesFor("en-CH", (l) => paths[l] ?? "/geburtstag-planen");
    expect(a.canonical).toBe("http://localhost:3000/en/plan-a-birthday-party");
    expect(a.languages["de-CH"]).toBe("http://localhost:3000/geburtstag-planen");
    expect(a.languages["x-default"]).toBe("http://localhost:3000/geburtstag-planen");
  });
});
