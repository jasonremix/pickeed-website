/**
 * Token-Werte für Stellen, an denen CSS-Variablen nicht greifen (Web-Manifest, <meta name="theme-color">).
 * Muss mit src/styles/tokens.css übereinstimmen – geprüft durch test/tokens.test.ts.
 */
export const themeColors = {
  light: "#ffffff",
  dark: "#0f0f12",
} as const;
