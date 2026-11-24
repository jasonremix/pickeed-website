// @vitest-environment node
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Prüft die Design-Tokens automatisch auf WCAG-Kontraste (AA = 4.5 : 1 für normalen Text).
 * Grundlage: docs/06-designkonzept.md und ADR-0003.
 */

const css = readFileSync(fileURLToPath(new URL("../src/styles/tokens.css", import.meta.url)), "utf8");

function block(selector: string): string {
  const start = css.indexOf(selector);
  if (start < 0) throw new Error(`Selektor fehlt: ${selector}`);
  const open = css.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}") depth--;
    if (depth === 0) return css.slice(open + 1, i);
  }
  throw new Error(`Block nicht geschlossen: ${selector}`);
}

function vars(source: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of source.matchAll(/--(pk-[\w-]+):\s*([^;]+);/g)) out[m[1]!] = m[2]!.trim();
  return out;
}

const light = vars(block(":root {"));
const darkExplicit = vars(block(':root[data-theme="dark"]'));
const darkSystem = vars(block(':root:not([data-theme="light"])'));
const dark = { ...light, ...darkExplicit };

function resolve(map: Record<string, string>, name: string): string {
  let value = map[name];
  for (let i = 0; i < 5 && value?.startsWith("var("); i++) value = map[value.slice(6, -1)];
  if (!value || !/^#[0-9a-f]{6}$/i.test(value)) throw new Error(`Kein Hex-Wert für ${name}: ${value}`);
  return value;
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p) as [number, number];
  return (x + 0.05) / (y + 0.05);
}

const pairs: Array<[fg: string, bg: string, min: number]> = [
  ["pk-text-1", "pk-bg", 4.5],
  ["pk-text-2", "pk-bg", 4.5],
  ["pk-text-3", "pk-bg", 4.5],
  ["pk-text-1", "pk-surface", 4.5],
  ["pk-text-2", "pk-surface", 4.5],
  ["pk-on-primary", "pk-primary", 4.5],
  ["pk-link", "pk-bg", 4.5],
  ["pk-link", "pk-surface-raised", 4.5],
  ["pk-danger-text", "pk-bg", 4.5],
  ["pk-danger-text", "pk-surface-raised", 4.5],
  ["pk-primary", "pk-bg", 3], // Rahmen/Icons: Nicht-Text-Kontrast 3 : 1
];

describe("Design-Tokens", () => {
  it("Systemeinstellung und explizite Wahl definieren denselben Dunkelmodus", () => {
    expect(darkSystem).toEqual(darkExplicit);
  });

  it("Primärfarbe ist Pickeed Pink (ADR-0003)", () => {
    expect(resolve(light, "pk-primary").toLowerCase()).toBe("#e0157a");
  });

  for (const [theme, map] of [
    ["hell", light],
    ["dunkel", dark],
  ] as const) {
    for (const [fg, bg, min] of pairs) {
      it(`${theme}: ${fg} auf ${bg} erreicht mindestens ${min} : 1`, () => {
        expect(contrast(resolve(map, fg), resolve(map, bg))).toBeGreaterThanOrEqual(min);
      });
    }
  }

  it("semantische Farben tragen weissen Text (≥ 4.5 : 1)", () => {
    for (const name of ["pk-success", "pk-warning", "pk-danger", "pk-info"]) {
      expect(contrast(resolve(light, name), "#ffffff")).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe("Token-Konstanten für Manifest und theme-color", () => {
  it("stimmen mit tokens.css überein", async () => {
    const { themeColors } = await import("../src/tokens");
    expect(themeColors.light).toBe(resolve(light, "pk-bg"));
    expect(themeColors.dark).toBe(resolve(dark, "pk-bg"));
  });
});
