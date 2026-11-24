# Testprotokoll

## Lauf vom 24.11.2026 (Phasen 3–5)

Umgebung: Linux-Container, Node.js 22.23, PostgreSQL 16.15, Chromium (Playwright 1.63).

| Bereich | Werkzeug | Ergebnis |
|---|---|---|
| Formatierung | Prettier | ✅ alle Dateien |
| Lint | ESLint 10 + typescript-eslint, Next.js-, React-Hooks-Regeln, Verbot von Hex-Farben | ✅ 0 Fehler, 0 Warnungen |
| Typen | TypeScript 5.9 strict | ✅ alle 4 Pakete |
| Designsystem | Vitest + Testing Library | ✅ 39/39 (Komponenten, Token-Kontraste hell/dunkel) |
| Mehrsprachigkeit | Vitest | ✅ 18/18 (gleiche Schlüssel und Platzhalter in 4 Sprachen, keine leeren Texte, kein «ß» in de-CH, Formate) |
| Web-Logik | Vitest | ✅ 4/4 (Theme, hreflang) |
| Datenbank | Vitest gegen echtes PostgreSQL 16 | ✅ 25/25 (Migrationen, UUID v7, Constraints, Trigger, Kaskaden, ORM-Abgleich) |
| Schema-Drift | drizzle-kit check / generate | ✅ Schema und Migrationen synchron |
| Build | Next.js 16 Produktions-Build | ✅ |
| End-to-End | Playwright: Desktop, Pixel 7, 375 px | ✅ 40 bestanden, 2 übersprungen |
| Barrierefreiheit | axe-core (WCAG 2.0/2.1/2.2 A+AA), hell und dunkel | ✅ 0 Verstösse (nach Korrektur zweier Kontrastfehler im Dunkelmodus) |

**GitHub Actions (CI-Lauf #2, Commit `2ae0da9`):** ✅ beide Jobs grün – «Lint, Typen, Tests, Build»
(inkl. Datenbanktests gegen PostgreSQL 16.16 als Service) und «End-to-End (Playwright)».
Lauf #1 war wegen einer nicht formatierten `README.md` rot und wurde behoben.

**E2E-Abdeckung:** Startseite in 4 Sprachen (lang, Inhalt, hreflang, kein horizontales Scrollen),
Spracherkennung über den Browser, Sprachwechsel, Dunkelmodus inkl. Speicherung, lokalisierte 404,
Skip-Link, Sicherheitsheader, robots.txt.

## Nicht abgeschlossen / nicht getestet

| Test | Grund | Wann |
|---|---|---|
| Skip-Link per Tastatur auf Mobil-Profilen | Bewusst übersprungen (keine Hardware-Tastatur) | – |
| Safari/WebKit und Firefox | In dieser Umgebung nur Chromium installiert | CI-Erweiterung vor Beta |
| Echte Geräte (iPhone, Android) | Nicht verfügbar in der Cloud-Umgebung | Vor Beta, manuell |
| `docker compose up` | Konfiguration validiert; Datenbank-Tests liefen gegen natives PostgreSQL 16 | Beim ersten lokalen Start |
| Lighthouse (Performance/SEO) | Noch nicht eingerichtet | Phase 7 |
| Übersetzungsqualität | Nur automatische Prüfungen; Muttersprachler-Review offen | Vor Beta |
