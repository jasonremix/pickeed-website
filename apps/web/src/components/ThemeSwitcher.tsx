"use client";

import { cn } from "@pickeed/ui";
import { useTranslations } from "next-intl";
import { useSyncExternalStore, type ReactNode } from "react";
import { parseThemePreference, THEME_STORAGE_KEY, themePreferences, type ThemePreference } from "@/lib/theme";

const EVENT = "pk-theme-change";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

function readPreference(): ThemePreference {
  try {
    return parseThemePreference(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return "system";
  }
}

function applyPreference(preference: ThemePreference) {
  try {
    if (preference === "system") window.localStorage.removeItem(THEME_STORAGE_KEY);
    else window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Speicher nicht verfügbar (z. B. privater Modus): Wahl gilt nur für diese Seite.
  }
  if (preference === "system") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", preference);
  window.dispatchEvent(new Event(EVENT));
}

const icons: Record<ThemePreference, ReactNode> = {
  system: (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" strokeLinecap="round" />
    </svg>
  ),
  light: (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        strokeLinecap="round"
      />
    </svg>
  ),
  dark: (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" strokeLinejoin="round" />
    </svg>
  ),
};

export function ThemeSwitcher() {
  const t = useTranslations("ThemeSwitcher");
  const preference = useSyncExternalStore(subscribe, readPreference, () => "system" as const);

  return (
    <fieldset className="inline-flex items-center">
      <legend className="sr-only">{t("label")}</legend>
      <div className="inline-flex rounded-full border border-line bg-surface p-0.5">
        {themePreferences.map((option) => (
          <label
            key={option}
            title={t(option)}
            className={cn(
              "relative inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-text-2",
              "transition-colors duration-fast ease-out hover:text-text-1",
              "has-[:focus-visible]:focus-ring",
              preference === option && "bg-surface-raised text-primary shadow-1",
            )}
          >
            <input
              type="radio"
              name="theme"
              value={option}
              checked={preference === option}
              onChange={() => applyPreference(option)}
              className="sr-only"
            />
            {icons[option]}
            <span className="sr-only">{t(option)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
