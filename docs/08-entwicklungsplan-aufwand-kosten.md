# 08 – Entwicklungsplan, Aufwand und Kosten

> **Phase 2/3 – Planung** · Stand: 24.11.2026 · Status: Entwurf zur Freigabe
>
> Alle Aufwände und Kosten sind **Schätzungen mit Bandbreite**. Preise externer Dienste stammen
> aus meinem Wissensstand und müssen vor jeder Buchung beim Anbieter verifiziert werden.
> Kostenpflichtige Dienste werden nur nach deiner ausdrücklichen Freigabe gebucht.

---

## 1. Entwicklungsplan (Pfad B – Neuaufbau)

Jede Phase endet mit einem **Review**: Ergebnis dokumentiert in `docs/`, Tests grün, Abnahme durch dich.

| Phase | Ergebnis | Abnahmekriterium |
|---|---|---|
| **1 – Produktanalyse** | Ist-Analyse, Anforderungen (dieses Paket) | Freigabe der Dokumente 01–09 |
| **2 – Produktstrategie, MVP** | MVP-Umfang, Prioritäten, Erfolgskriterien | Beantwortete Rückfragen, fixierter MVP-Umfang |
| **3 – Architektur** | ADRs, Repo-Struktur, CI-Grundgerüst, lokale Entwicklungsumgebung | `pnpm dev` startet Web + Admin + DB lokal; CI läuft |
| **4 – Branding, Designsystem** | Tokens, Komponentenbibliothek, Storybook, klickbarer Prototyp | Prototyp der Kernflüsse abgenommen; axe ohne Fehler |
| **5 – Datenbank, Backend** | Schema + Migrationen, RLS-Policies, Storage, Worker, API-Grundlagen | pgTAP-Tests für alle Policies grün |
| **6 – Auth, Benutzerverwaltung** | Registrierung, Login (Code, Apple, Google), Alterskontrolle, Profil, Privatsphäre, Löschen, Export | E2E-Tests der Kontoflüsse in 4 Sprachen grün |
| **7 – Frontend, Navigation, Website** | App-Shell, Navigation, öffentliche Seiten, SEO, PWA | Lighthouse ≥ 90 (Performance, A11y, SEO) mobil |
| **8 – Social-Funktionen** | Feed, Beiträge, Medien, Herzen, Kommentare, Speichern, Status, Benachrichtigungen, Suche, Folgen, Blockieren/Melden, Chat, Pläne, Events | Kernkreislauf E2E getestet |
| **9 – Creator, Business** | Seiten, Rollen, Verifizierung, Statistiken | Statistiken stimmen mit Rohdaten überein (Tests) |
| **10 – Admin-Dashboard** | Module + KPIs, Audit-Log, 2FA | Jede Admin-Aktion protokolliert; KPIs aus echten Daten |
| **11 – Mehrsprachigkeit** | Vollständige Kataloge de-CH, fr-CH, it-CH, en; Prüfung durch Muttersprachler | 0 fehlende Schlüssel; Formattests |
| **12 – Monetarisierung** | Nach Freigabe: Stripe Billing/Connect, Tickets, Abos | Testmodus-Zahlungen inkl. Rückerstattung E2E |
| **13 – Sicherheit, Datenschutz** | Härtung, CSP, Rate Limits, DSFA, Verzeichnis, Rechtstexte zur Prüfung, Pentest | Pentest ohne kritische/hohe Befunde offen |
| **14 – Testing, Fehlerbehebung** | Lasttests, Bug-Bash, Beta mit echten Nutzern | Erfolgskriterien Beta, 0 kritische Fehler |
| **15 – Deployment** | Produktion, Monitoring, Backups, Rollback, Runbooks | Wiederherstellungstest bestanden; Go-live-Freigabe |

Phasen 13 und 14 laufen **kontinuierlich** ab Phase 5 mit; am Ende steht nur die Abschlussprüfung.

### Meilensteine
| Meilenstein | Inhalt | Phasen |
|---|---|---|
| **M0 – Freigabe** | Konzept freigegeben, offene Entscheidungen beantwortet | 1–2 |
| **M1 – Fundament** | Repo, CI, Designsystem, DB, Auth | 3–6 |
| **M2 – Planen** | Pläne mit Gästen, Time/Idea Pick, Plan-Chat, öffentliche Website | 7 + Teile von 8 |
| **M3 – Sozial** | Feed, Beiträge, Status, Folgen, DMs, Benachrichtigungen, Suche | 8 |
| **M4 – Seiten & Admin** | Creator/Business-Seiten, Admin mit KPIs, Moderation | 9–10 |
| **M5 – Private Beta** | 4 Sprachen, Härtung, Pentest, Beta mit 100–300 Personen | 11, 13, 14 |
| **M6 – Öffentlicher Start** | Produktion, Monitoring, ggf. Store-Apps | 15 |
| **V2** | Monetarisierung, Videos, Communities, Kampagnen, native Apps, ES/PT | 12 + Ausbau |

---

## 2. Aufwand

### Pfad B – MVP (Neuaufbau)
Schätzung in Personenwochen (PW) für ein erfahrenes Team:

| Phase | PW (Bandbreite) |
|---|---|
| 3 Architektur, Setup, CI | 2–3 |
| 4 Designsystem, Prototyp | 4–6 |
| 5 Datenbank, Backend-Grundlagen | 4–6 |
| 6 Auth, Konto, Alterskontrolle, Export/Löschung | 3–5 |
| 7 App-Shell, Website (12 Seiten × 4 Sprachen), SEO, PWA | 4–6 |
| 8 Social + Chat + Pläne + Events (Gratis-Tickets) | 14–20 |
| 9 Creator-/Business-Seiten, Statistik | 4–6 |
| 10 Admin + KPIs + Moderation | 4–6 |
| 11 i18n-Abschluss, Übersetzungsprüfung | 2–3 |
| 13 Sicherheit, Datenschutz-Dokumentation | 3–4 |
| 14 Tests, Beta, Fehlerbehebung | 4–6 |
| 15 Deployment, Monitoring, Runbooks | 2–4 |
| Produktmanagement/Koordination (~15 %) | 8–11 |
| **Total** | **≈ 58–86 PW ≈ 14–20 Personenmonate** |

**Kalenderzeit:** mit 4–5 Personen ca. **4–6 Monate** bis zur privaten Beta.
**Funktionsgleichheit mit der heutigen Live-Plattform** (Tickets mit Zahlung, Business-Teambereich,
Vereine, Travel Guide, Kalender, Sprachnachrichten, native Apps, 6 Sprachen): zusätzlich etwa **das
1.5- bis 2-Fache** des MVP-Aufwands.

### Pfad A – Weiterentwickeln
| Schritt | Aufwand |
|---|---|
| Code-Audit (Architektur, Tests, Sicherheit, Datenmodell) und Lückenanalyse gegen dieses Konzept | 1–2 PW |
| Fehlende Website-Seiten (Über uns, Kooperationen, Community-Richtlinien) in 6 Sprachen | 1–2 PW |
| Admin-KPI-Dashboard (falls nicht vorhanden) | 2–4 PW |
| Hashtags, Content-Performance, Follower-Analysen | 3–6 PW |
| Rebranding auf Pink (falls entschieden): Tokens, Assets, Store-Einträge | 2–4 PW |
| Testabdeckung der Kernflüsse aufbauen (falls lückenhaft) | 3–6 PW |

### Pfad C – Nur Website
Öffentliche Website mit 12–15 Seiten in 4–6 Sprachen, Designsystem, CMS-freie Inhalte aus
i18n-Katalogen, Kontaktformular, SEO: **4–7 PW**.

### Zur Rolle von KI-gestützter Entwicklung
Ich (Claude Code) kann Code, Tests und Dokumentation in hohem Tempo schreiben. Das verkürzt die reine
Implementierungszeit erheblich. **Nicht** verkürzen lassen sich: deine Entscheidungen und Abnahmen,
Tests auf echten Geräten, juristische Prüfung, Übersetzungsprüfung durch Muttersprachler, App-Store-
Prüfungen, Pentest und der Aufbau der Moderation. Realistisch bleibt der Engpass die Review-Kapazität
auf deiner Seite. Eine verbindliche Zeitzusage kann ich deshalb nicht machen; nach M1 lässt sich das
Tempo anhand echter Fortschritte belastbar schätzen.

---

## 3. Kosten

### Entwicklung (bei externer Vergabe, Pfad B MVP)
| Modell | Annahme | Kosten |
|---|---|---|
| Schweizer Agentur / Freelancer | CHF 120–170 / h, 14–20 PM à 160 h | **CHF 270'000 – 545'000** |
| Eigenes Team Schweiz | CHF 11'000–15'000 / Monat Vollkosten pro Person | **CHF 155'000 – 300'000** |
| KI-gestützt mit kleinem Kernteam | 1 Product Owner + punktuell externe Prüfung; Claude-Code-Nutzung | deutlich tiefer; abhängig vom Umfang der menschlichen Prüfung – nach M1 belastbar schätzbar |

### Einmalige Kosten (unabhängig vom Pfad)
| Posten | Richtwert |
|---|---|
| Juristische Prüfung Datenschutzerklärung, AGB, Richtlinien (DSG/DSGVO) | CHF 3'000 – 10'000 |
| Professionelle Übersetzung/Prüfung FR, IT, EN (~15'000 Wörter je Sprache) | CHF 7'000 – 12'000 |
| Externer Penetrationstest vor Start | CHF 8'000 – 25'000 |
| Apple Developer Program | USD 99 / Jahr |
| Google Play Developer | USD 25 einmalig |
| Markenrecherche/-eintragung (falls noch nicht erfolgt) | ab ca. CHF 550 (IGE, bis 3 Klassen) zzgl. Beratung |
| Fotografie / Bildmaterial | CHF 0 – 5'000 |

### Laufende Betriebskosten (Richtwerte, vor Buchung verifizieren)
| Posten | MVP / Beta (< 5'000 MAU) | Wachstum (~50'000 MAU) |
|---|---|---|
| Anwendungsserver Schweiz (Container/VMs) | CHF 30 – 150 | CHF 300 – 1'000 |
| Datenbank (Supabase Pro Zürich inkl. Compute **oder** Schweizer Managed Postgres) | CHF 30 – 150 | CHF 300 – 1'200 |
| Object Storage + CDN | CHF 5 – 30 | CHF 150 – 800 (Videos treiben Kosten) |
| E-Mail (Brevo) | CHF 0 – 25 | CHF 50 – 150 |
| Monitoring (Sentry EU, Uptime) | CHF 0 – 30 | CHF 80 – 200 |
| Domain, TLS (Let's Encrypt) | ≈ CHF 2 | ≈ CHF 2 |
| Backups (externe Kopie) | CHF 5 – 20 | CHF 50 – 150 |
| **Total pro Monat** | **≈ CHF 70 – 400** | **≈ CHF 950 – 3'500** |

Nicht enthalten: Personal, Moderation (bei Wachstum der grösste laufende Posten), Support, Marketing,
Zahlungsgebühren (variabel, je Transaktion), KI-Dienste für «Plan in einem Satz».

---

## 4. Risiken

| Risiko | Wahrscheinlichkeit | Auswirkung | Gegenmassnahme |
|---|---|---|---|
| Neuaufbau einer bereits laufenden Plattform | hoch, falls Pfad B ohne Grund | sehr hoch (doppelte Kosten, Migration von Nutzern) | Pfad A prüfen, Entscheidung A1 |
| Rechte an Marke/Code unklar | unbekannt | sehr hoch | Bestätigung A2 vor Umsetzung |
| Zu breiter Umfang | hoch | hoch | Strikter MVP, Kernkreislauf zuerst |
| Leerer Feed (Netzwerkeffekt) | mittel | hoch | Gäste per Link, Pläne als Einstieg, Seed-Communities pro Stadt |
| Moderation unterschätzt | mittel | hoch | Prozesse + Tools ab MVP, klare Zuständigkeit |
| Jugendschutz-Vorfälle | niedrig–mittel | sehr hoch | 16+, Schutz bis 18, Meldewege, DSFA |
| Abhängigkeit von US-Anbietern | mittel | mittel | Exit-Pfade (Open-Source-Komponenten), Entscheidung D2 |
| App-Store-Ablehnung | mittel | mittel | PWA als Fallback, Richtlinien früh prüfen |
| Monetarisierung trägt nicht | mittel | hoch | Frühe Validierung mit Anbietern/Veranstaltern |
