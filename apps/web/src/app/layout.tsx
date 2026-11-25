import type { ReactNode } from "react";

/** Die eigentliche Struktur (html, body) liefert app/[locale]/layout.tsx. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
