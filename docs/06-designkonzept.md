# 06 – Designkonzept und Designsystem

> **Phase 4 – Branding und Designsystem (Konzept)** · Stand: 24.11.2026 · Status: Entwurf zur Freigabe
>
> **Wichtig:** Der Master-Prompt verlangt **Pink als Primärfarbe**. Die Live-Plattform nutzt **Violett
> `#7C3AED`** als Akzent und Pink nur als Nebenfarbe (siehe [01](01-ist-analyse.md), Abschnitt 8).
> Dieses Konzept setzt den Master-Prompt um (Pink primär). Ein Wechsel auf der Live-Plattform wäre ein
> Rebranding mit Auswirkungen auf App-Icons, Store-Einträge und Social-Media-Auftritt → Entscheidung C1.
>
> Logo, Wortmarke und App-Icon der Live-Plattform sind urheberrechtlich geschützt und werden erst nach
> deiner Bestätigung der Nutzungsrechte verwendet. Bis dahin arbeite ich mit einer neutralen Textmarke.

---

## 1. Designprinzipien

1. **Ruhig und hochwertig.** Viel Weissraum, wenige Farben, klare Hierarchie. Pink ist Signal, nicht Fläche.
2. **Menschen und Momente zuerst.** Fotos, Gesichter und Pläne tragen die Oberfläche – nicht Dekoration.
3. **Ein Tipp genügt.** Primäre Aktionen sind gross, eindeutig und mit dem Daumen erreichbar.
4. **Konsistenz vor Kreativität.** Jede Seite nutzt dieselben Tokens und Komponenten. Keine Einzellösungen.
5. **Zugänglich für alle.** WCAG 2.2 AA als Mindeststandard, in Hell- und Dunkelmodus.
6. **Bewegung mit Bedeutung.** Animationen erklären Zustandswechsel; sie verzögern nie.

---

## 2. Farben

### Markenfarbe «Pickeed Pink»
| Token | Hex | Verwendung | Kontrast auf Weiss |
|---|---|---|---|
| `pink-50` | `#FFF0F6` | Hintergrund-Tönung, Hover von Flächen | – |
| `pink-100` | `#FCE4EF` | Ausgewählte Chips, Hinweisflächen | – |
| `pink-200` | `#F9C6DD` | Rahmen aktiver Elemente, Illustrationen | – |
| `pink-400` | `#FF4F9A` | Verlaufsstart, Dekor, Akzent im Dunkelmodus | 3.07 : 1 (nur Dekor/grosse Schrift) |
| **`pink-500`** | **`#E0157A`** | **Primärfarbe**: Buttons, aktive Navigation, Links | **4.61 : 1** ✅ AA |
| `pink-600` | `#C2185B` | Hover/Pressed, Textlinks auf Weiss | 5.87 : 1 ✅ |
| `pink-700` | `#9D174D` | Starker Text auf Pink-Flächen | 7.88 : 1 ✅ AAA |

Weisser Text auf `pink-500` erreicht 4.61 : 1 und erfüllt damit AA für normalen Text.

### Neutrale Farben
| Token | Hell | Dunkel | Verwendung |
|---|---|---|---|
| `bg` | `#FFFFFF` | `#0F0F12` | Seitenhintergrund |
| `surface` | `#F7F7F8` | `#1A1A1F` | Karten, Eingabefelder |
| `surface-raised` | `#FFFFFF` | `#232329` | Modals, Sheets |
| `line` | `#E4E4E7` | `#2E2E35` | Trennlinien, Rahmen |
| `text-1` | `#111114` | `#F4F4F5` | Haupttext (18.85 : 1) |
| `text-2` | `#52525B` | `#A1A1AA` | Sekundärtext (7.73 : 1) |
| `text-3` | `#71717A` | `#8B8B94` | Metadaten (4.83 : 1) |
| `primary` | `#E0157A` | `#FF4F9A` | Aktionen (Dunkel: 6.23 : 1 auf `#0F0F12`) |

### Semantische Farben
| Token | Hex | Kontrast auf Weiss |
|---|---|---|
| `success` | `#15803D` | 5.02 : 1 |
| `warning` | `#B45309` | 5.02 : 1 |
| `danger` | `#B91C1C` | 6.47 : 1 |
| `info` | `#1D4ED8` | 6.70 : 1 |

*(Alle Kontrastwerte nach WCAG-Formel berechnet. Dunkelmodus: `text-2` 7.47 : 1, `text-3` 5.67 : 1
auf `#0F0F12`.)*

**Dunkelmodus-Regel:** Primäre Buttons verwenden dort `#FF4F9A` mit **dunklem** Text `#0F0F12`
(6.23 : 1). Weisser Text auf `#FF4F9A` wäre mit 3.07 : 1 zu schwach.

### Verläufe
| Token | Definition | Verwendung |
|---|---|---|
| `gradient-bloom` | `linear-gradient(135deg, #FF4F9A 0%, #E0157A 55%, #C2185B 100%)` | Hero-Flächen, Story-Ring, App-Icon-Hintergrund, grosse Überschriften-Akzente |
| `gradient-action` | `linear-gradient(135deg, #E0157A 0%, #C2185B 100%)` | Primäre Buttons (weisser Text ≥ 4.6 : 1 an jeder Stelle) |
| `gradient-blush` | `linear-gradient(180deg, #FFF0F6 0%, #FFFFFF 100%)` | Abschnittshintergründe der Website |
| `gradient-glow` | `radial-gradient(60% 60% at 50% 0%, rgba(255,79,154,.18), transparent)` | Dezenter Lichtschein hinter Hero-Inhalten |

Regel: Weisser Text nie auf `pink-400` oder dem hellen Ende von `gradient-bloom` in normaler Grösse.

---

## 3. Typografie

**Schrift:** Inter (Open Font License, variabel), System-Fallback `-apple-system, "Segoe UI", Roboto, sans-serif`.
Selbst gehostet (keine Google-Fonts-Anfrage zur Laufzeit → keine Datenübermittlung an Dritte).

| Token | Grösse / Zeilenhöhe | Gewicht | Verwendung |
|---|---|---|---|
| `display` | 56 / 60 (mobil 40 / 44) | 800, Laufweite −2 % | Website-Hero |
| `h1` | 34 / 40 | 700 | Seitentitel |
| `h2` | 28 / 34 | 700 | Abschnitte |
| `h3` | 21 / 28 | 650 | Karten-Titel |
| `body-lg` | 18 / 28 | 400 | Einleitungen |
| `body` | 16 / 24 | 400 | Standardtext (mobil nie kleiner – verhindert Zoom bei iOS-Eingaben) |
| `body-sm` | 14 / 20 | 400 | Sekundärtext |
| `caption` | 12 / 16 | 500 | Metadaten, Labels |

Zahlen in Statistiken mit `font-variant-numeric: tabular-nums`.

---

## 4. Abstände, Raster, Radien, Schatten

| Kategorie | Tokens |
|---|---|
| Abstände (4-px-Raster) | `1`=4 · `2`=8 · `3`=12 · `4`=16 · `5`=24 · `6`=32 · `7`=48 · `8`=64 · `9`=96 |
| Layout | Mobil: 16 px Rand, 1 Spalte · Tablet: 24 px, 8 Spalten · Desktop: max. 1200 px, 12 Spalten; App-Inhalt max. 640 px zentriert |
| Radien | `sm`=8 (Eingaben, Tags) · `md`=12 (Buttons) · `lg`=16 (Karten) · `xl`=24 (Sheets, Modals) · `full` (Avatare, Pills) |
| Schatten | `shadow-1`: `0 1px 2px rgba(17,17,20,.06)` · `shadow-2`: `0 4px 16px rgba(17,17,20,.08)` · `shadow-pop`: `0 12px 32px rgba(224,21,122,.16)` (pinkgetönt, nur für schwebende Primärelemente) |
| Touch-Ziele | mindestens 44 × 44 px |

---

## 5. Bewegung

| Token | Dauer | Kurve | Beispiel |
|---|---|---|---|
| `motion-fast` | 120 ms | `cubic-bezier(.2,.8,.2,1)` | Hover, Toggle, Herz |
| `motion-base` | 200 ms | `cubic-bezier(.2,.8,.2,1)` | Dropdown, Tabs, Toast |
| `motion-slow` | 320 ms | `cubic-bezier(.32,.72,0,1)` | Sheets, Seitenübergänge |
| `motion-spring` | – | Feder (Steifheit 400, Dämpfung 30) | «Bin dabei»-Bestätigung, Herz-Pop |

`prefers-reduced-motion` reduziert alle Animationen auf Überblendungen ≤ 120 ms.

**Signatur-Mikroanimationen:** Herz-Pop mit kurzem Pink-Puls · «Bin dabei» füllt den Button mit
`gradient-action` · Story-Ring dreht beim Laden · Termin «steht» mit kurzem Konfetti in Pink-Tönen (abschaltbar).

---

## 6. Komponenten (Bibliothek `packages/ui`)

Alle Komponenten mit Zuständen: Standard, Hover, Fokus (sichtbarer 2-px-Ring `pink-500`, 2 px Abstand),
Aktiv, Deaktiviert, Laden, Fehler.

| Gruppe | Komponenten |
|---|---|
| Buttons | Primär (Verlauf), Sekundär (Umriss), Tertiär (Text), Icon-Button, Destruktiv; Grössen S/M/L; Lade-Zustand mit Spinner, Breite bleibt stabil |
| Formulare | Textfeld, Textbereich, Auswahl, Checkbox, Radio, Switch, Datum/Zeit, Code-Eingabe (6 Felder), Datei-Upload mit Vorschau; Label immer sichtbar, Fehlertext unter dem Feld, `aria-describedby` |
| Karten | Beitragskarte, Plan-Karte, Event-Karte, Profil-Karte, Angebots-Karte, Statistik-Kachel |
| Navigation | Bottom-Tab-Bar (mobil), Seitenleiste (Desktop), Top-Bar mit Zurück, Tabs, Segment-Control, Breadcrumb (Admin) |
| Overlays | Modal, Bottom Sheet (mobil), Popover, Tooltip, Kontextmenü, Bestätigungsdialog |
| Rückmeldung | Toast, Inline-Hinweis, Banner, Leerer Zustand (Illustration + Aktion), Fehlerseite (404/500) |
| Laden | Skeletons in Form des Inhalts, Spinner nur für Aktionen, Fortschrittsbalken für Uploads |
| Sozial | Avatar (+ Story-Ring, Verifiziert-Häkchen), Avatar-Stapel («4 Freunde gehen hin»), Reaktionsleiste, Kommentarfeld, Chat-Blase, Zusage-Buttons (Bin dabei / Vielleicht / Nicht) |
| Planen | Time-Pick-Raster, Idea-Pick-Liste mit Balken, Mitbringliste, Kosten-Saldo |
| Admin | Datentabelle (Sortieren, Filtern, Paginierung), KPI-Kachel, Diagramm, Status-Badge, Audit-Zeile |

---

## 7. Navigation

### App (mobil)
Bottom-Tab-Bar mit fünf Zielen, Glas-Effekt (`backdrop-filter: blur`):

| Tab | Inhalt |
|---|---|
| **Feed** | Beiträge und Status von Freunden und Seiten |
| **Entdecken** | Events, Creator, Orte, Suche |
| **＋ Erstellen** | Zentraler Button: Plan · Beitrag · Status · Event |
| **Pläne** | Meine Pläne, Einladungen, Chats der Pläne |
| **Profil** | Profil, Seiten, Einstellungen |

Nachrichten und Benachrichtigungen über Symbole in der Top-Bar (mit Zähler).

### App (Desktop)
Linke Seitenleiste mit denselben Zielen, Inhalt mittig (max. 640 px), rechte Spalte für Vorschläge und anstehende Pläne.

### Website
Schlanke Kopfzeile: Logo · Die App · Für Creator · Für Businesses · Über uns · Sprache · **Anmelden** (Sekundär) · **Kostenlos starten** (Primär).
Mobil: Menü als Vollbild-Sheet. Fusszeile mit allen Rechts- und Infoseiten.

---

## 8. Barrierefreiheit

- WCAG 2.2 AA: Kontraste (oben belegt), Fokus sichtbar, Tastaturbedienung vollständig, Skip-Link.
- Semantisches HTML, ARIA nur wo nötig; Formulare mit Labels und Fehlermeldungen, die Screenreader vorlesen.
- Alt-Texte für Bilder (Eingabefeld beim Hochladen), Untertitel für Videos (V2).
- Dynamische Schriftgrössen bis 200 % ohne Layoutbruch.
- Keine Information nur über Farbe (z. B. Zusagen mit Symbol + Text).
- Automatische Prüfung mit axe in jedem Playwright-Lauf.

---

## 9. Bildsprache und Tonalität

- **Fotos:** echte Momente in Schweizer Städten und Landschaften, natürliches Licht, diverse Menschen. Keine Stock-Klischees. Eigene Fotos oder lizenzierte Bilder mit dokumentierter Lizenz.
- **Illustrationen:** reduzierte Linien mit Pink-Akzenten für leere Zustände.
- **Icons:** einheitliches Linien-Set (z. B. Lucide, ISC-Lizenz), 1.75 px Strichstärke, 24 px Raster.
- **Sprache:** Du-Form, kurz, warm, konkret. Schweizer Rechtschreibung. Keine Superlative ohne Beleg.

---

## 10. Umsetzung

- Tokens als **CSS Custom Properties** (`packages/ui/tokens.css`) + Tailwind-Preset, generiert aus einer Quelle (`tokens.json`).
- Hell/Dunkel über `data-theme` und `prefers-color-scheme`, ohne Aufblitzen beim Laden.
- Komponenten-Dokumentation mit Storybook (inkl. Barrierefreiheits-Addon), visuelle Regressionstests der Kernkomponenten.
- Vor der Entwicklung: klickbarer Prototyp der Kernflüsse (Onboarding, Plan erstellen, Feed, Chat) zur Abnahme.
