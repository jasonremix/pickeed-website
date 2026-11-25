import { clsx, type ClassValue } from "clsx";

/** Fügt CSS-Klassen bedingt zusammen. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
