export const THEME_STORAGE_KEY = "pk-theme";

export const themePreferences = ["system", "light", "dark"] as const;
export type ThemePreference = (typeof themePreferences)[number];

export function parseThemePreference(value: unknown): ThemePreference {
  return value === "light" || value === "dark" ? value : "system";
}

/** Effektives Theme aus Wahl und Systemeinstellung. */
export function resolveTheme(preference: ThemePreference, systemPrefersDark: boolean): "light" | "dark" {
  if (preference === "system") return systemPrefersDark ? "dark" : "light";
  return preference;
}

/**
 * Läuft vor dem ersten Zeichnen, damit beim Laden nichts aufblitzt.
 * «system» setzt kein Attribut – dann greift prefers-color-scheme in tokens.css.
 */
export const themeInitScript = `(function(){var d=document.documentElement;d.classList.add("js");try{var p=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(p==="light"||p==="dark"){d.setAttribute("data-theme",p)}}catch(e){}})();`;
