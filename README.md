# Pickeed

Schweizer Social-Media- und Planungsplattform. Produkt- und Technikdokumentation: [`docs/`](docs/README.md).

> **Stand:** Website mit allen Inhalten von pickeed.com in 6 Sprachen (1'661 Seiten), Pink-Designsystem,
> Datenbank-Grundlage. Anmeldung und Social-Funktionen folgen ab Phase 6; bis dahin führen Aufrufe zur
> bestehenden App (`NEXT_PUBLIC_APP_URL`).

## Voraussetzungen

- Node.js 22 (`.nvmrc`), pnpm 10 (`corepack enable`)
- Docker (für die lokale PostgreSQL-Datenbank)

## Lokal starten

```bash
corepack enable
pnpm install
cp .env.example .env
docker compose up -d db          # PostgreSQL 16 inkl. Testdatenbank
pnpm db:migrate                  # Schema einspielen (liest DATABASE_URL)
pnpm dev                         # http://localhost:3000
```

Interne Designsystem-Übersicht: http://localhost:3000/design (in Produktion nur mit `ENABLE_DESIGN_PREVIEW=true`).

## Befehle

| Befehl                         | Zweck                                                               |
| ------------------------------ | ------------------------------------------------------------------- |
| `pnpm dev`                     | Web-App im Entwicklungsmodus                                        |
| `pnpm build`                   | Produktions-Build aller Pakete                                      |
| `pnpm lint` / `pnpm typecheck` | ESLint / TypeScript                                                 |
| `pnpm test`                    | Unit- und Integrationstests (DB-Tests brauchen `TEST_DATABASE_URL`) |
| `pnpm test:e2e`                | Playwright-Tests (Desktop + Mobil, axe-Barrierefreiheit)            |
| `pnpm db:generate`             | Migration aus Schemaänderung erzeugen                               |
| `pnpm db:migrate`              | Ausstehende Migrationen ausführen                                   |
| `pnpm format`                  | Code formatieren (Prettier)                                         |

## Struktur

```
apps/web          Next.js 16: Website (6 Sprachen); Inhalte in apps/web/content, Bilder in public/images
packages/ui       Designsystem: Pink-Tokens (Hell/Dunkel), Komponenten
packages/i18n     Übersetzungskataloge, Sprach- und Formatierungs-Konfiguration
packages/db       PostgreSQL-Schema (Drizzle), Migrationen, Integrationstests
tools/            Inhalts-Import von pickeed.com
docs/             Konzept, Architekturentscheidungen (adr/), Phasenberichte
```
