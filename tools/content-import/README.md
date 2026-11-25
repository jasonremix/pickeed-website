# Inhalts-Import von pickeed.com

Übernimmt die öffentlichen Inhalte der bisherigen Website **pickeed.com** in die neue Website
(Entscheid A2 vom 25.11.2026, siehe `docs/09-offene-entscheidungen.md`).

## Was übernommen wird

| Quelle                                                                                                              | Ergebnis                                                                                 |
| ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Vorgerenderte Seiten (`<main class="seo-main">`) aller 275 öffentlichen Seiten in 6 Sprachen                        | `apps/web/content/<locale>.json` (bereinigter Baum, nur erlaubte Tags und sichere Links) |
| hreflang-Alternativen jeder Seite (übersetzte Adressen, z. B. `/en/plan-a-birthday-party`)                          | `apps/web/content/routes.json`                                                           |
| Textkataloge der Startseite (JS-Module `brandText`, `landingText`, `StoreBadges`) – **nur geparst, nie ausgeführt** | Namespaces `Meta`, `Nav`, `Footer`, `Stores`, `Home` in `packages/i18n/messages/*.json`  |
| Fotos, App-Screenshots (6 Sprachen), Logo, App-Icons, Store-Badges                                                  | `apps/web/public/images/`                                                                |

## Ablauf (erneut ausführen)

```bash
cd tools/content-import
npm install acorn@8.15.0 acorn-walk@8.3.4          # nur für extract.mjs
python3 -I crawl.py out/index.json                    # alle deutschen Seiten finden
WORKERS=10 python3 -I fetch_content.py out/index.json out/content
WORKERS=10 python3 -I fix_alternates.py out/index.json out/content
cp out/content/*.json ../../apps/web/content/
node extract.mjs <brandText.js> > out/json/brandText.json   # ebenso landingText, StoreBadges
python3 -I chrome_labels.py out/json/chrome.json
node build-messages.mjs out/json
```

## Sicherheit

- Fremdes JavaScript wird nie ausgeführt: `extract.mjs` parst die Module mit acorn und wertet nur Literale aus.
- HTML wird mit einer Positivliste bereinigt (keine Attribute ausser `href`; nur `/…`, `https:`, `mailto:`, `tel:`).
- Die Website rendert Inhalte über React-Komponenten (kein `dangerouslySetInnerHTML`).

## Stand

Import vom 25.11.2026: 275 Seiten × 6 Sprachen = 1'650 Seiten, 0 Fehler; 28'236 Links geprüft.
