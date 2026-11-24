# 09 – Offene Entscheidungen und Rückfragen

> Stand: 24.11.2026 · Diese Punkte brauche ich von dir, bevor die Entwicklung beginnt.
> Meine Empfehlung steht jeweils dabei. Gruppe A blockiert alles Weitere.

---

## A. Strategie und Ausgangslage (blockierend)

| # | Frage | Empfehlung |
|---|---|---|
| **A1** | pickeed.com ist eine laufende Plattform mit Web-App, iOS-/Android-Apps und 6 Sprachen; dieses Repository ist leer. **Welcher Pfad gilt?** A = bestehenden Code weiterentwickeln · B = Neuaufbau in diesem Repo · C = dieses Repo wird nur die öffentliche Website | **A**, falls der Code verfügbar ist. Dann bitte das Repository dieser Session hinzufügen. B nur mit klarem Grund (welcher?). |
| **A2** | Das Impressum nennt «Svizzipet by Thamilchelvan» (Einzelunternehmen, Einsiedeln) als Betreiberin; Name, Logo, Texte und Gestaltung sind als urheberrechtlich geschützt ausgewiesen. **Was ist deine Rolle, und darf ich Marke, Logo, Texte und Designelemente verwenden?** | Kurze Bestätigung genügt; ohne sie arbeite ich mit neutralen Platzhaltern für Logo und Texte. |
| A3 | Falls Pfad B: Soll der Neuaufbau die Live-Plattform später **ersetzen** (inkl. Datenmigration bestehender Nutzer) oder als separates Produkt laufen? | Ersetzen nur mit Migrationsplan; separates Produkt unter gleicher Marke vermeiden. |

## B. Produkt und Positionierung

| # | Frage | Empfehlung |
|---|---|---|
| B1 | Kernfokus: **«Planen mit Freunden + Entdecken»** (wie live) oder **breite Content-Plattform** (Instagram-artig, wie im Master-Prompt angelegt)? | Planen als Kern, Social-Feed als Zubringer ([02](02-produktvision-und-zielgruppen.md)). |
| B2 | Öffentliche **Follower-Zahlen**: nur für Creator/Business-Seiten (wie live) oder auch für Privatpersonen? | Nur Seiten; Personen privat. |
| B3 | **Videos** im MVP oder V2? (Kostentreiber Transcoding/Speicher) | V2. |
| B4 | **Mindestalter** 16 (wie live) bestätigen? | Ja, 16 mit Schutz bis 18. |
| B5 | **Zielmärkte** nach der Schweiz: DACH zuerst? Ist `es-419`/`pt-BR` (Lateinamerika/Brasilien) eine bewusste Marktentscheidung? | CH → DACH; ES/PT in V2 ohne Marktfokus. |
| B6 | **Communities/Interessengruppen** (neu, live nur Vereine) im Umfang V2 gewünscht? | Ja, V2. |
| B7 | **KI-Funktionen** («Plan in einem Satz»): gewünscht? Welche Anforderungen an Anbieter/Datenstandort? | V2, mit Anbieter mit EU/CH-Datenverarbeitung und ohne Training auf Nutzerdaten. |

## C. Marke und Design

| # | Frage | Empfehlung |
|---|---|---|
| **C1** | **Primärfarbe Pink** (Master-Prompt) statt **Violett** (live)? Bei Pfad A wäre das ein Rebranding inkl. App-Icons und Store-Einträgen. | Pink gemäss [06](06-designkonzept.md), falls bewusst gewollt; sonst Violett beibehalten und Pink als Verlaufsakzent. |
| C2 | Gibt es **Logo-Dateien, Brand-Guidelines, Fotos** in Originalqualität? | Bitte bereitstellen (SVG). |
| C3 | Hell- **und** Dunkelmodus ab MVP? | Ja (live vorhanden, Tokens sind vorbereitet). |
| C4 | Inhalte für **«Über uns»**: Gründungsgeschichte, Team, Fotos – wer liefert sie? | Du lieferst Fakten, ich formuliere Entwürfe zur Freigabe. Keine erfundenen Personen oder Zahlen. |

## D. Technik und Betrieb

| # | Frage | Empfehlung |
|---|---|---|
| D1 | Architektur gemäss [04](04-technische-architektur.md) (Next.js, PostgreSQL, Monorepo) freigeben? | Ja (für Pfad B). |
| **D2** | **Datenresidenz:** Supabase (US-Firma, Rechenzentrum Zürich) akzeptabel, oder **nur Schweizer Anbieter**? | Supabase Zürich für Tempo, mit Exit-Pfad; Schweizer Anbieter, falls «100 % Schweiz» Markenversprechen wird (+3–5 PW). |
| D3 | **Hosting-Anbieter:** Infomaniak (live im Einsatz) oder Exoscale? Gibt es bestehende Konten? | Infomaniak, falls Konto besteht. |
| D4 | **Mobile:** PWA zum Start, Capacitor-Apps in V2 – einverstanden? Wem gehören die Apple-/Google-Entwicklerkonten? | Ja; Konten auf die Firma laufen lassen. |
| D5 | Wer übernimmt **Moderation** und **Support** (Personen, Zeiten, Sprachen)? Live wird eine 24-h-Bearbeitung zugesagt. | Vor Beta festlegen; Admin-Tools sind im MVP. |
| D6 | Zugänge, die ich später brauche (erst nach Freigabe): Domain/DNS, Hosting, Datenbank, E-Mail-Versand, Sentry. | Separate Staging-/Produktionszugänge, Secrets nie im Chat. |

## E. Geschäftsmodell und Recht

| # | Frage | Empfehlung |
|---|---|---|
| E1 | Monetarisierungskonzept ([07](07-monetarisierung.md)) freigeben: kostenlos für Menschen, Einnahmen über Anbieter, Tickets, Creator Pro, Business Pro? | Ja. |
| E2 | Werbeversprechen «keine Werbebanner, kein Tracking, kein Datenverkauf» **beibehalten**? | Ja – es ist ein zentrales Unterscheidungsmerkmal. |
| E3 | Provision bei Kooperationen/Kampagnen: ja oder «ohne Provision» (wie live bei Gesuchen)? | Gesuche provisionsfrei; nur Kampagnen mit Pickeed-Checkout mit Gebühr. |
| E4 | Zahlungsanbieter Stripe bestätigen? | Ja (TWINT, Connect). |
| E5 | Wer prüft **Rechtstexte** (Anwalt/Kanzlei)? Gibt es Budget dafür? | Vor öffentlichem Start zwingend. |
| E6 | Ist die **Marke «Pickeed»** eingetragen (IGE/EUIPO)? | Prüfen, bevor in Marketing investiert wird. |

## F. Budget, Team, Zeitplan

| # | Frage | Empfehlung |
|---|---|---|
| F1 | **Budgetrahmen** für Entwicklung und einmalige Kosten (Recht, Übersetzung, Pentest)? | Rahmen nennen, damit ich Umfang und Reihenfolge darauf abstimme. |
| F2 | **Zieltermin** für Beta / öffentlichen Start? | Realistisch erst nach M1 festlegen. |
| F3 | Wer **reviewt und nimmt ab** (Produkt, Design, Technik)? Wie viel Zeit pro Woche? | Feste Review-Termine, z. B. 2× pro Woche. |
| F4 | Gibt es weitere Entwickler oder Agenturen, mit denen ich mich abstimmen muss? | – |
| F5 | **Finanzierung**: eigenfinanziert oder Investoren geplant (beeinflusst Tempo und Umfang)? | – |

---

## Was nach deiner Freigabe passiert

1. Ich setze deine Antworten in den Dokumenten 02–08 um (Version 1.0).
2. **Pfad A:** Code-Audit des bestehenden Repositories → Lückenanalyse → priorisierter Backlog.
   **Pfad B:** Phase 3 starten – Monorepo, CI, lokale Entwicklungsumgebung, erste Migrationen, Designsystem.
   **Pfad C:** Website-Struktur und Designsystem, danach Seiten in Reihenfolge der Priorität.
3. Arbeit in kleinen, überprüfbaren Schritten, jeweils mit Tests und Dokumentation.
