# ADR-0001: Monorepo mit Next.js und TypeScript

- **Status:** angenommen
- **Datum:** 24.11.2026
- **Kontext:** Pfad B (Neuaufbau) ist entschieden. Website, Web-App und später Admin-Panel und
  Mobile-Hülle teilen Designsystem, Übersetzungen, Datenmodell und Domänenlogik.

## Entscheidung

- **pnpm-Workspace + Turborepo** als Monorepo.
- **Next.js 16 (App Router) mit React 19** für Website und Web-App (`apps/web`).
- **TypeScript 5.9** durchgehend, `strict` aktiviert.
- Interne Pakete werden als TypeScript-Quellen eingebunden (keine eigenen Build-Schritte):
  `@pickeed/ui` (Designsystem), `@pickeed/i18n` (Sprachen), `@pickeed/db` (Datenbank).
- **Tailwind CSS 4** für Layout und Utility-Klassen; alle Farben, Abstände, Radien und Schatten
  kommen ausschliesslich aus den Design-Tokens in `@pickeed/ui`.
- Paketversionen sind **exakt gepinnt** und bei der Auswahl mindestens zwei Wochen alt.

## Begründung

Siehe [04 – Technische Architektur](../04-technische-architektur.md), Abschnitt 3. Next.js liefert
serverseitiges Rendern für öffentliche, mehrsprachige Seiten und ist ohne Anbieterbindung als
Container selbst hostbar.

## Konsequenzen

- Ein `pnpm install` und ein `pnpm dev` genügen für die lokale Entwicklung.
- Turborepo cached Lint, Typprüfung, Tests und Builds pro Paket.
- Wechsel einzelner Werkzeuge bleibt lokal begrenzt (z. B. Tailwind nur in Apps und `@pickeed/ui`).
