# 01 – Ist-Analyse: Was Pickeed heute schon ist

> **Phase 1 – Produktanalyse** · Stand: 24.11.2026 · Status: Entwurf zur Freigabe
>
> **Quelle:** Öffentlich sichtbare Inhalte von https://pickeed.com (Startseite, Preise, Für Creator,
> Für Businesses, Für Vereine, Entdecken, App, Hilfecenter, Kontakt, Impressum, Datenschutz, AGB),
> das Web-App-Manifest sowie öffentlich ausgelieferte CSS-/JS-Dateien, abgerufen am 24.11.2026.
>
> **Grenzen:** Der Quellcode der Live-Plattform lag nicht vor. Funktionen sind «laut Website» erfasst –
> ob sie technisch vollständig funktionieren, ist **nicht geprüft**. Technische Angaben, die aus
> ausgelieferten Dateien abgeleitet sind, sind als *abgeleitet* markiert.

---

## 1. Kernbefund

**Pickeed ist kein neues Produkt, sondern eine bereits live betriebene Plattform** – mit Web-App,
iOS-App, Android-App, sechs Sprachen, Bezahlfunktionen und Bereichen für Creator, Businesses,
Vereine und Anbieter. Das Repository `pickeed-website` enthält dagegen nur eine `README.md`.

Daraus folgt die wichtigste offene Entscheidung dieses Projekts (siehe [09 – Offene Entscheidungen](09-offene-entscheidungen.md)):

| Pfad | Beschreibung | Einschätzung |
|---|---|---|
| **A – Weiterentwickeln** | Bestehende Codebasis der Live-Plattform in diese Session einbinden und gezielt ausbauen. | **Empfohlen**, sofern der Code verfügbar ist. Kein Risiko für bestehende Nutzer, Apps und Zahlungen. |
| **B – Neuaufbau** | Pickeed in diesem Repository von Grund auf neu bauen. | Nur sinnvoll mit klarem Grund (z. B. kein Zugriff auf den Code, technische Altlasten, neue Ausrichtung). Aufwand 2–3× MVP, um den heutigen Funktionsumfang zu erreichen. |
| **C – Nur Website** | Dieses Repository wird die öffentliche Marketing-Website; die App bleibt, wo sie ist. | Passt zum Repo-Namen. Deutlich kleinerer Umfang. |

Die Konzeptdokumente 02–08 sind so geschrieben, dass sie für A und B gelten. Wo sich die Pfade
unterscheiden, ist das ausgewiesen.

---

## 2. Positionierung laut Website

- **Claim:** «Sieh, was läuft, und geh mit Freunden hin.»
- **Beschreibung:** «Folge Freunden, Creatorn und Orten in deiner Stadt. Und wenn dich etwas packt,
  wird mit einem Tipp ein Plan daraus.»
- **Versprechen («Darauf kannst du dich verlassen»):** Kostenlos für dich · Keine Werbebanner,
  kein Tracking · Wir verkaufen keine Daten · Chats nur für eure Gruppe · Server und Daten in der Schweiz.
- **Kategorie (Schema.org):** `SocialNetworkingApplication`, Preis CHF 0, iOS und Android.
- **Tonalität:** Du-Form, kurz, warm, Schweizer Rechtschreibung («ss» statt «ß»).

**Einordnung:** Pickeed ist heute ein *planungsorientiertes* soziales Netzwerk («vom Sehen zum
Hingehen»), kein reiner Content-Feed wie Instagram oder TikTok. Der Master-Prompt beschreibt eine
breitere Social-Media- und Creator-Plattform. Diese Spannung wird in [02](02-produktvision-und-zielgruppen.md) aufgelöst.

---

## 3. Seitenstruktur der Live-Website

| Bereich | Pfad | Inhalt |
|---|---|---|
| Startseite | `/` | Hero, 3-Schritte-Erklärung, Plan in einem Satz, Zusagen, Top 10 der Stadt, Circle-Status, Events, Memories, Profil-Personalisierung, «So funktioniert's», Gäste per Link, Anwendungsfälle, Vertrauensversprechen, Creator/Business-Teaser, App-Links |
| Entdecken | `/entdecken` | Öffentliche Events und «Picks» (Angebote von Anbietern) |
| App | `/warteliste` | Links zu App Store und Google Play, Hinweis auf Browser-Nutzung |
| Anmelden | `/anmelden` | Login (E-Mail-Code, Apple, Google) |
| Preise | `/preise` | Privat, Businesses & Marken, Öffentliche Events, Anbieter Basis/Abo, FAQ |
| Für Creator | `/fuer-creator` | @name-Seite, Vorschläge bei Planung, Gesuche, Fan-Events, Markenkooperationen, Teilen-Kit |
| Für Businesses | `/fuer-firmen` | Business-Bereich, 23 Vorlagen, Anmeldung bis Check-in, Budget, Teams/Rollen, Markenseite |
| Für Vereine | `/fuer-vereine` | Trainings, Mitglieder per Link, Mannschaften, Check-in, Turniere, verifizierter Verein |
| Events planen | `/anlaesse-planen` + 7 SEO-Landingpages | Geburtstag, Polterabend, Termin ohne Doodle, Firmenevent, Hochzeit, Apéro, Vereinsanlass |
| Travel Guide | `/travel-guide` | Reiseinhalte mit Karten |
| Hilfecenter | `/hilfe` | FAQ in 5 Kategorien |
| Kontakt | `/kontakt` | Formular für alle Anliegen |
| Rechtliches | `/impressum`, `/datenschutz`, `/agb` | Vollständige Rechtstexte; Melden ohne Konto über `/melden` |
| Sprachen | `/en`, `/fr`, `/it`, `/es`, `/pt` | Alle Seiten in 6 Sprachen (hreflang: de, en, fr, it, es-419, pt-BR) |

**Nicht vorhanden** (vom Master-Prompt gefordert): eigenständige Seiten «Über uns», «Kooperationen»
und «Community-Richtlinien» (Regeln stehen in AGB Abschnitt 4a).

---

## 4. Funktionsumfang laut Website

Legende: ✅ als vorhanden beschrieben · 🟡 angekündigt («bald») · ⬜ nicht gefunden

### Social Media
| Funktion | Status | Bemerkung |
|---|---|---|
| Profile mit @Benutzername, Profilbild, Bio | ✅ | `pickeed.com/@name` ab 18 und mit «In der Suche auffindbar» |
| Profilfarbe, Lieblingssong (30 s Vorschau), Song zum Beitrag, «Meine Leute», Gästebuch | ✅ | |
| Folgen mit Bestätigung | ✅ | Folgen von Personen nur nach Bestätigung; Listen privat, keine öffentlichen Zahlen für Personen |
| Feed «Für dich» mit Begründung (ⓘ) | ✅ | Pläne von Freunden vor Inhalten von Businesses/Creatorn |
| Status (24 h) und Highlights, Enge Freunde, Sammlungen, Notes | ✅ | entspricht Stories |
| Herzen, Kommentare, «Gesehen von» | ✅ | |
| Fotos in Plänen (Memories) | ✅ | |
| Videos in Memories | 🟡 | «Bald auch Videos» |
| Hashtags | ⬜ | nicht erwähnt |
| Suche nach Personen/@Benutzernamen | ✅ | kein Opt-out aus der Suche |

### Kommunikation
| Funktion | Status | Bemerkung |
|---|---|---|
| Gruppenchat im Plan | ✅ | nur für Mitglieder; Team hat keinen Zugriff |
| Chat zu zweit, Nachrichtenanfragen | ✅ | Schutz bis 18: Erwachsene nur eine Anfrage |
| Sprachnachrichten, GIFs (GIPHY), Videos im Chat | ✅ | |
| Push-/In-App-Mitteilungen | ✅ | freiwillig |
| Melden und Blockieren | ✅ | Meldungen ohne Konto über `/melden`; 24-h-Bearbeitung bei rechtswidrigen Inhalten |

### Planen und Events (Kern des heutigen Produkts)
| Funktion | Status |
|---|---|
| Plan erstellen, Einladung per Link/QR, Gäste ohne Konto | ✅ |
| Time Pick (Termin finden, «Passt/Vielleicht/Geht nicht», automatische Festlegung bei Mehrheit) | ✅ |
| Idea Pick (Vorschläge abstimmen) | ✅ |
| Plan in einem Satz (Text → Plan mit Zeit, Ort, Kosten) | ✅ |
| Zusagen (Bin dabei / Vielleicht / Nicht), Mitbringlisten, Wunschlisten, Umfragen, Aufgaben | ✅ |
| Kosten teilen, Budget | ✅ |
| Circle: «Heute frei?» | ✅ |
| Öffentliche Events, Gratis-Tickets mit QR, bezahlte Tickets (Stripe, Karte/TWINT; CHF/EUR/USD/GBP) | ✅ |
| Check-in per QR, Warteliste | ✅ |
| Top 10 der Stadt (Top Picks, von Gästen bewertet, wöchentlich) | ✅ |
| Kalender-Anbindung, Wetter, fairer Treffpunkt, Fussweg-Route | ✅ |
| Travel Guide, Reise-Bausteine (Fristen, Notfallinfos, Vertrauenspersonen) | ✅ |

### Creator
| Funktion | Status |
|---|---|
| Creator-Seite `@name` mit Rollen, Formaten, Social Links, Events | ✅ |
| Vorgeschlagen werden, wenn jemand plant | ✅ |
| Gesuche (Anfragen in der Region) – ohne Provision | ✅ |
| Fan-Events mit Tickets | ✅ |
| Kooperationen mit verifizierten Marken / Kampagnen | ✅ |
| Teilen-Kit (Story-Bild, Banner, QR), Creator-Einladungen, Gründungs-Creator | ✅ |
| Statistik («ehrliche Statistik») | ✅ (Umfang unklar) |
| Bezahlte Creator-Buchungen, «Triff mich», «Erlebnisse» | ✅ (laut AGB/Datenschutz, ab 18) |

### Businesses, Marken, Vereine, Anbieter
| Funktion | Status |
|---|---|
| Business-Bereich getrennt vom Privaten, Teams/Abteilungen/Rollen | ✅ |
| 23 Vorlagen (Teamevent, Schulung, Konferenz, Firmenreise …) | ✅ |
| Agenda, Transport, Zimmer, Check-in, anonymes Feedback | ✅ |
| Budget-Freigabe (Vier-Augen-Prinzip), Projekte, Meilensteine, Jahresplanung | ✅ |
| «Verifizierte Marke» nach Prüfung, Kampagnen mit Creatorn | ✅ |
| Vereinsbereich mit Mannschaften, Mitglieder per Link, verifizierter Verein | ✅ |
| Anbieter-Profile mit Angeboten («Picks»), Statistiken, gesponserte Empfehlungen | ✅ |
| Mehrere Konten pro Gerät, «als Business/Creator handeln» | ✅ |

### Konto, Sicherheit, Datenschutz
| Funktion | Status |
|---|---|
| Login per 6-stelligem E-Mail-Code, Apple, Google; Passwort freiwillig | ✅ |
| Mindestalter 16, Geburtsdatum Pflicht, Schutz bis 18 | ✅ |
| Datenexport, Konto löschen, Konto pausieren (Moderation) | ✅ |
| Verwaltungsbereich mit Zwei-Faktor-Anmeldung und Protokoll | ✅ |
| Weiterempfehlen (Referral), Partnerlinks (Awin) | ✅ |
| Dunkelmodus | ✅ |

---

## 5. Geschäftsmodell laut Website

- **Privat:** kostenlos, «für immer».
- **Businesses, Marken, Vereine:** kostenlos – ohne Abo, nicht pro Person.
- **Anbieter-Abo:** CHF 9.90 / Monat pro Geschäftsprofil (EUR 9.90, USD 9.90) – bis 20 Angebote,
  gesponserte Empfehlungen, Hervorhebung. **Bis 31.05.2027 gratis**, Karte wird vorab hinterlegt.
- **Ticket-Servicegebühr:** 2.5 % + CHF 0.99 pro Ticket – bis 31.05.2027 gratis.
- **Zahlung:** Stripe (Billing, Connect, Identity), TWINT bei CHF. **Keine Käufe in den Apps.**
- **Partnerlinks:** Awin.
- Pickeed ist laut Preisseite nicht mehrwertsteuerpflichtig.

---

## 6. Rechtliche und organisatorische Angaben

| Angabe | Wert laut Impressum |
|---|---|
| Betreiber | Svizzipet by Thamilchelvan, Zürichstrasse 32, 8840 Einsiedeln |
| Rechtsform | Einzelunternehmen, vertreten durch den Inhaber |
| UID | CHE-461.464.916 |
| Kontakt | info@pickeed.com |
| Social | instagram.com/getpickeed, tiktok.com/@getpickeed |
| Urheberrecht | «Name, Logo, Texte und Gestaltung von Pickeed sind urheberrechtlich geschützt.» |

> **Hinweis:** Weil Name, Logo, Texte und Gestaltung urheberrechtlich geschützt sind, verwende ich
> davon nichts ungeprüft. Bitte bestätige vor der Umsetzung deine Rolle bzw. Berechtigung
> gegenüber dem Betreiber (siehe [09](09-offene-entscheidungen.md), Frage A2).

---

## 7. Technik der Live-Plattform

| Baustein | Angabe | Quelle |
|---|---|---|
| Frontend | React mit React Router, als Single-Page-App gebaut (Vite-typische Asset-Struktur), vorgerendertes HTML für Suchmaschinen, Service Worker für Offline | *abgeleitet* aus ausgelieferten Dateien |
| Mobile Apps | iOS (App Store ID 6805627477) und Android (`com.pickeed.app`); im JS-Bundle Hinweise auf **Capacitor** (Web-App in nativer Hülle) | Website / *abgeleitet* |
| API | Eigene REST-API unter `/api/*` (z. B. `/api/feed`, `/api/plans`, `/api/me/export`, `/api/health`) | *abgeleitet* |
| Anmeldung | Eigene Sitzungen per Cookie, E-Mail-Code, Apple/Google | Datenschutzerklärung |
| Server | Infomaniak Network SA, Genf | Datenschutzerklärung |
| Datenbank | Betrieben von Supabase Inc. (USA), Rechenzentrum Zürich | Datenschutzerklärung |
| E-Mail | Brevo (Paris) für Codes und Hinweise; Microsoft 365 für das Postfach | Datenschutzerklärung |
| Zahlungen | Stripe Billing, Stripe Connect, Stripe Identity | Datenschutzerklärung |
| Weitere Dienste | Open-Meteo, OpenStreetMap, komoot Photon, openrouteservice, GIPHY, DeepL, Google Safe Browsing, Let's Encrypt, Awin | Datenschutzerklärung |
| Analytics | Keine Werbe- oder Tracking-Cookies; kein Drittanbieter-Analytics im Bundle gefunden | Datenschutzerklärung / *abgeleitet* |

---

## 8. Visuelles Design der Live-Plattform (*abgeleitet* aus CSS)

| Token | Wert |
|---|---|
| Basis | Weiss `#FFFFFF`, Text/Ink `#111111`, Fläche `#F4F4F5`, Linien `#E5E5E5` |
| **Akzentfarbe** | **Violett `#7C3AED`** (Hover `#6D28D9`, Tönungen `#F3E8FF`, `#C4B5FD`) |
| Pink | `#DB2777` und Rosé-Tönungen `#FBCFE8`, `#FCE7F3` als **Nebenfarben** |
| Weitere | Gelb `#FACC15` (Sticker/Markierung), Orange `#EA580C`, Grün `#15803D` |
| Verläufe | Status-Hintergründe, z. B. «Sonne» `#F97316 → #DB2777`, «Lila» `#7C3AED → #111111` |
| Schrift | Inter (variable) |
| Abstände | 4 / 8 / 12 / 16 / 24 / 32 px |
| Navigation | Glas-Effekt (Blur), Hell- und Dunkelmodus (`#0E0E10`) |

> **Abweichung zum Master-Prompt:** Der Master-Prompt verlangt **Pink als Primärfarbe**. Die Live-Plattform
> nutzt **Violett** als Akzent und Pink nur als Nebenfarbe. Entscheidung nötig (siehe [06](06-designkonzept.md) und [09](09-offene-entscheidungen.md), Frage C1).

---

## 9. Abgleich Master-Prompt ↔ Live-Plattform

| Thema | Master-Prompt | Live-Plattform | Konsequenz |
|---|---|---|---|
| Produktfokus | Breite Social-Media- und Creator-Plattform | Soziales Planen («geh mit Freunden hin») + Entdecken | Vision verbindet beides, Planen bleibt Differenzierung |
| Follower-Zahlen | Reichweiten- und Follower-Analysen | Für Personen keine öffentlichen Zahlen; für Seiten ausblendbar | Analysen nur für Creator/Business, privat für Personen |
| Farben | Pink primär | Violett primär | Entscheidung C1 |
| Sprachen | DE, EN, FR, IT (+ ES, PT optional) | Alle 6 bereits live | Ziel erfüllt (bei Pfad A) |
| Zahlungen | Stripe oder Schweizer Anbieter | Stripe inkl. TWINT | Ziel erfüllt (bei Pfad A) |
| Monetarisierung | Premium, Creator-/Business-Abos, Promotions | Kostenlos für Menschen; Anbieter-Abo + Ticketgebühr | Werbeversprechen beachten, siehe [07](07-monetarisierung.md) |
| Kontotypen | Privat, Creator, Business, Admin | Privat, Creator, Business/Marke, Verein, Anbieter, Gast, Admin | Rollenmodell übernimmt die feinere Struktur |
| Website-Seiten | Start, Über uns, Kooperationen, Datenschutz, Die App | Start, Preise, Creator, Business, Vereine, Hilfe, Kontakt, Recht, App | «Über uns», «Kooperationen», «Community-Richtlinien» fehlen |
| Hashtags | gefordert | nicht erwähnt | V2-Kandidat |
| Admin | eigenständiges Panel mit KPIs | Verwaltungsbereich mit 2FA und Protokoll vorhanden | Umfang der KPIs unbekannt |
