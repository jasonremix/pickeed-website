# 03 – MVP-Konzept und priorisierte Feature-Liste

> **Phase 2 – Produktstrategie und MVP-Konzept** · Stand: 24.11.2026 · Status: Entwurf zur Freigabe

---

## 1. Was «MVP» hier bedeutet

| Pfad | Bedeutung des MVP |
|---|---|
| **A – Weiterentwickeln** | Die Live-Plattform übertrifft das MVP bereits. «MVP» wird zur Checkliste: Was fehlt, was muss gehärtet werden (Tests, Admin-KPIs, Hashtags, «Über uns», «Kooperationen», Pink-Branding)? |
| **B – Neuaufbau** | Das MVP ist die kleinste Version, die den Kernkreislauf (Folgen → Sehen → Planen → Treffen → Teilen) vollständig und **echt funktionsfähig** abbildet – für Privatpersonen, mit einer Basis für Creator und Businesses. |

Die Prioritäten unten sind für **Pfad B** gesetzt. Die Spalte «Live» zeigt, was pickeed.com laut
Website bereits anbietet (✅ vorhanden · 🟡 angekündigt · ⬜ nicht gefunden).
Spalte «Neu» markiert Vorschläge, die weder live noch angekündigt sind (🆕).

**Prioritätsstufen**
- **MVP** – Pflicht für den Start; ohne diese Funktion funktioniert der Kernkreislauf nicht.
- **V2** – 3–6 Monate nach Start; stärkt Wachstum, Creator, Businesses, Einnahmen.
- **Vision** – langfristig; abhängig von Traktion und Finanzierung.

---

## 2. MVP-Definition (Pfad B)

### Ziel
Eine Organisiererin legt in unter 2 Minuten einen Plan an, Freunde machen per Link (auch ohne Konto)
mit, der Termin wird gemeinsam gefunden, die Gruppe chattet im Plan, trifft sich und teilt danach Fotos.
Dazu ein persönlicher Feed mit Beiträgen von Freunden, Creatorn und Businesses sowie ein Admin-Bereich,
der die Plattform sicher betreibbar macht.

### Im MVP enthalten
1. **Konto:** Registrierung/Login per E-Mail-Code, Apple, Google; Geburtsdatum (16+); Profil; Privatsphäre; Löschen; Datenexport.
2. **Soziales Grundgerüst:** Folgen (mit Anfragen bei privaten Profilen), Feed, Foto-Beiträge, Herzen, Kommentare, Speichern, Teilen per Link, Status (24 h), Benachrichtigungen, Suche.
3. **Pläne:** Plan erstellen, Einladung per Link/QR, Gäste ohne Konto, Time Pick, Idea Pick, Zusagen, Mitbringliste, Kosten teilen (einfach), Plan-Chat, Fotos nach dem Treffen.
4. **Kommunikation:** Chat zu zweit und in Gruppen (Text, Bilder), Lesestatus, Nachrichtenanfragen, Blockieren, Melden.
5. **Creator & Business (Basis):** Öffentliche Seite `@name`, Kontotyp-Wechsel, Verifizierungsantrag, Basis-Statistiken aus echten Daten.
6. **Öffentliche Events (Basis):** Event veröffentlichen, entdecken, «Bin dabei», Gratis-Tickets mit QR und Check-in.
7. **Admin:** Benutzer, Inhalte, Meldungen, Verifizierungen, KPIs, Rollen, Audit-Log, 2FA-Pflicht.
8. **Website:** Startseite, Die App, Über uns, Kooperationen, Für Creator, Für Businesses, FAQ/Hilfe, Kontakt, Impressum, Datenschutz, AGB, Community-Richtlinien.
9. **Mehrsprachigkeit:** de-CH, fr-CH, it-CH, en – vollständig, inkl. Formate.
10. **Plattform:** Responsive Web-App + installierbare PWA; Web-Push.

### Bewusst nicht im MVP
Videos, bezahlte Tickets, Abos/Zahlungen, Kampagnen-Marktplatz, Communities/Interessengruppen,
Business-Teambereich mit Budgetfreigabe, Vereinsbereich, Kalender-Synchronisation, Sprachnachrichten,
KI-Planung («Plan in einem Satz»), native Apps in den Stores, Spanisch/Portugiesisch.

### Erfolgskriterien für den MVP-Start (Beta)
| Kennzahl | Zielwert nach 8 Wochen Beta (Vorschlag) |
|---|---|
| Pläne mit festgelegtem Termin | ≥ 60 % aller erstellten Pläne |
| Gäste, die innerhalb 30 Tagen ein Konto anlegen | ≥ 15 % |
| Retention Woche 4 (aktive Konten) | ≥ 25 % |
| Stattgefundene Pläne pro Woche | wachsend, Basiswert aus Woche 1–2 |
| Kritische Fehler (Datenverlust, Rechteverletzung) | 0 |

Die Zielwerte sind Arbeitshypothesen, keine Prognose, und werden nach der Beta überprüft.

---

## 3. Priorisierte Feature-Liste

### A. Social Media
| Funktion | Priorität | Live | Neu | Notiz |
|---|---|---|---|---|
| Benutzerprofile (Name, @Benutzername, Bild, Bio) | MVP | ✅ | | |
| Folgen / Following mit Anfragen (privat) | MVP | ✅ | | Personen: keine öffentlichen Zahlen |
| Persönlicher Feed (Freunde vor Seiten, chronologisch + einfache Gewichtung) | MVP | ✅ | | Begründung «Warum sehe ich das?» = V2 |
| Beiträge mit Fotos (bis 10 Bilder) | MVP | ✅ | | |
| Herzen (Likes) | MVP | ✅ | | |
| Kommentare (1 Ebene Antworten) | MVP | ✅ | | |
| Teilen (Link, Teilen-Sheet des Geräts) | MVP | ✅ | | |
| Speichern / Sammlungen | MVP / V2 | ✅ | | Speichern MVP, Sammlungen V2 |
| Status / Stories (24 h) | MVP | ✅ | | Highlights V2 |
| Benachrichtigungen (In-App, Push, E-Mail-Zusammenfassung) | MVP | ✅ | | |
| Suche (Personen, Seiten, Events) | MVP | ✅ | | |
| Hashtags und Hashtag-Seiten | V2 | ⬜ | 🆕 | Moderationsaufwand beachten |
| Entdecken-Seite mit Themen und Orten | V2 | ✅ | | |
| Videos hochladen (bis 60 s) | V2 | 🟡 | | Kostentreiber Transcoding/CDN |
| Erwähnungen (@) und Markierungen | V2 | ✅ | | |
| Profil-Personalisierung (Farbe, Song, «Meine Leute») | V2 | ✅ | | Musikrechte prüfen |

### B. Kommunikation
| Funktion | Priorität | Live | Neu | Notiz |
|---|---|---|---|---|
| Private Nachrichten (1:1) | MVP | ✅ | | |
| Gruppenchat (inkl. Plan-Chat) | MVP | ✅ | | |
| Medienversand (Bilder) | MVP | ✅ | | Videos/Sprachnachrichten V2 |
| Nachrichtenstatus (gesendet, gelesen) | MVP | ✅ | | abschaltbar |
| Nachrichtenanfragen (Fremde, Schutz bis 18) | MVP | ✅ | | |
| Push-Benachrichtigungen (Web-Push) | MVP | ✅ | | Native Push mit Apps V2 |
| Blockieren und Melden | MVP | ✅ | | |
| Sprachnachrichten, GIFs | V2 | ✅ | | |
| Ende-zu-Ende-Verschlüsselung für Chats | Vision | ⬜ | 🆕 | Konflikt mit Meldefunktion lösen |

### C. Creator
| Funktion | Priorität | Live | Neu | Notiz |
|---|---|---|---|---|
| Creator-Profil `@name` mit Kategorien und Social Links | MVP | ✅ | | |
| Basis-Statistik (Aufrufe, Follower-Entwicklung, Interaktionen) | MVP | ✅ | | nur echte, aggregierte Daten |
| Creator-Dashboard | V2 | ✅ | | |
| Content-Performance pro Beitrag | V2 | ⬜ | 🆕 | |
| Follower-Analysen (Region, Sprache, Altersgruppen aggregiert) | V2 | ⬜ | 🆕 | nur ab Mindestgrösse anonymisiert |
| Vorgeschlagen werden bei passenden Plänen | V2 | ✅ | | |
| Gesuche (Aufträge in der Region) | V2 | ✅ | | |
| Fan-Events mit Tickets | V2 | ✅ | | benötigt Zahlungen |
| Kooperationen / Kampagnen mit Marken | V2 | ✅ | | |
| Teilen-Kit (Story-Bild, QR) | V2 | ✅ | | |
| Bezahlte Buchungen, «Triff mich» | Vision | ✅ | | ab 18, Stripe Connect |
| Creator-Abos / Fan-Mitgliedschaften | Vision | ⬜ | 🆕 | siehe [07](07-monetarisierung.md) |

### D. Businesses
| Funktion | Priorität | Live | Neu | Notiz |
|---|---|---|---|---|
| Unternehmensprofil (öffentliche Seite) | MVP | ✅ | | |
| Verifizierung (Antrag + Prüfung im Admin) | MVP | ✅ | | Häkchen nur nach Prüfung |
| Mehrere Personen verwalten eine Seite (Rollen) | MVP | ✅ | | Inhaber, Admin, Redaktion |
| Produkt- und Dienstleistungspräsentation (Angebote/«Picks») | V2 | ✅ | | |
| Business-Dashboard mit Statistiken | V2 | ✅ | | |
| Kooperationen mit Creatorn, Kampagnenverwaltung | V2 | ✅ | | |
| Business-Teambereich (Teamevents, Vorlagen, Budget) | V2 | ✅ | | |
| Community-Aufbau (Follower-Kommunikation, Events) | V2 | ✅ | | |

### E. Events und Pickeed-Pläne
| Funktion | Priorität | Live | Neu | Notiz |
|---|---|---|---|---|
| Eigene Pläne erstellen | MVP | ✅ | | |
| Freunde einladen (Link, QR, aus Followern) | MVP | ✅ | | |
| Gäste ohne Konto | MVP | ✅ | | Wachstumsmotor |
| Termine abstimmen (Time Pick) | MVP | ✅ | | |
| Orte/Ideen abstimmen (Idea Pick) | MVP | ✅ | | |
| Teilnahme bestätigen (Bin dabei / Vielleicht / Nicht) | MVP | ✅ | | |
| Gruppenplanung: Mitbringliste, Aufgaben | MVP | ✅ | | |
| Gemeinsame Kostenplanung (einfach: Ausgaben, Saldo) | MVP | ✅ | | |
| Events entdecken (öffentlich) | MVP | ✅ | | |
| QR-Tickets (gratis) und Check-in | MVP | ✅ | | |
| Bezahlte Tickets (Stripe, TWINT) | V2 | ✅ | | nach Freigabe Monetarisierung |
| Kalender-Synchronisation (ICS, Google, Apple) | V2 | ✅ | | |
| Circle «Heute frei?» | V2 | ✅ | | |
| Plan in einem Satz (KI) | V2 | ✅ | | KI-Anbieter/Datenschutz klären |
| Top 10 der Stadt, Bewertungen | V2 | ✅ | | |
| Wetter, fairer Treffpunkt, Route | Vision | ✅ | | |
| Travel Guide, Reise-Bausteine | Vision | ✅ | | |

### F. Community
| Funktion | Priorität | Live | Neu | Notiz |
|---|---|---|---|---|
| Interessengruppen (offen / auf Anfrage / privat) | V2 | ⬜ | 🆕 | live nur Vereine |
| Community-Profile und -Beiträge | V2 | ⬜ | 🆕 | |
| Diskussionen (Threads) | V2 | ⬜ | 🆕 | |
| Mitgliederverwaltung, Moderationsrollen | V2 | ✅ | | Vereine live |
| Vereinsbereich (Mannschaften, Trainings) | V2 | ✅ | | |

### G. Konto und Sicherheit
| Funktion | Priorität | Live | Notiz |
|---|---|---|---|
| Registrierung, Login, Logout | MVP | ✅ | E-Mail-Code (passwortlos), Apple, Google |
| E-Mail-Verifizierung | MVP | ✅ | implizit durch Code |
| Passwort (optional) + Zurücksetzen | MVP | ✅ | |
| Profil erstellen/bearbeiten, Profilbild, Benutzername, Bio | MVP | ✅ | |
| Privatsphäre-Einstellungen | MVP | ✅ | privat als Standard |
| Account deaktivieren / löschen | MVP | ✅ | Löschfristen in [04](04-technische-architektur.md) |
| Datenexport | MVP | ✅ | DSG/DSGVO |
| Benutzer blockieren / melden | MVP | ✅ | |
| Zwei-Faktor-Anmeldung für Nutzer | V2 | ⬜ | Pflicht für Admins ab MVP |
| Passkeys | V2 | ⬜ | 🆕 |
| Mehrere Konten pro Gerät | V2 | ✅ | |

---

## 4. Kontotypen, Rollen und Berechtigungen

### Kontotypen
| Typ | Beschreibung | Öffentlich sichtbar |
|---|---|---|
| **Gast** | Ohne Konto, nur über Einladungslink in einem Plan; Vorname + Sitzung | nein |
| **Privat** | Standardkonto (16+) | Profil privat als Standard |
| **Creator** | Privatkonto + öffentliche Creator-Seite | Seite öffentlich, Privatprofil bleibt privat |
| **Business / Marke** | Organisation mit Mitgliedern und Rollen | Seite öffentlich |
| **Verein / Community** (V2) | Organisation mit Mannschaften/Gruppen | Seite öffentlich oder privat |
| **Administrator** | Mitarbeitende von Pickeed; separate Anmeldung mit 2FA | nein |

Technisch sind Creator-, Business- und Vereinsseiten **Organisationen/Seiten**, die von einer oder
mehreren Personen verwaltet werden. Die Person bleibt immer die haftende, altersgeprüfte Identität.

### Rollen auf Seiten (Business/Creator/Verein)
| Recht | Inhaber | Admin | Redaktion | Analyst |
|---|---|---|---|---|
| Seite löschen, Inhaber übertragen | ✅ | | | |
| Mitglieder und Rollen verwalten | ✅ | ✅ | | |
| Abo und Zahlungen verwalten (V2) | ✅ | ✅ | | |
| Beiträge, Events, Angebote veröffentlichen | ✅ | ✅ | ✅ | |
| Als Seite chatten und kommentieren | ✅ | ✅ | ✅ | |
| Statistiken ansehen | ✅ | ✅ | ✅ | ✅ |

### Admin-Rollen (Pickeed-intern)
| Recht | Super-Admin | Moderation | Support | Analyse |
|---|---|---|---|---|
| Systemkonfiguration, Feature-Flags | ✅ | | | |
| Admin-Rollen vergeben | ✅ | | | |
| Konten sperren, löschen | ✅ | ✅ | | |
| Inhalte entfernen, Meldungen bearbeiten | ✅ | ✅ | | |
| Verifizierungen entscheiden | ✅ | ✅ | | |
| Kontodaten einsehen (ohne Chats/Fotos) | ✅ | ✅ | ✅ | |
| KPIs und Statistiken | ✅ | ✅ | ✅ | ✅ |

**Grundsätze:** Alle Rechte werden **serverseitig** bei jeder Anfrage geprüft (API-Schicht **und**
Row Level Security in der Datenbank). Jede Admin-Aktion wird mit Begründung im Audit-Log
protokolliert. Admins haben keinen Zugriff auf Chats und private Fotos – nur auf konkret gemeldete Inhalte.

---

## 5. Website-Struktur (öffentlich)

| Seite | Pfad (de) | Zweck | Priorität |
|---|---|---|---|
| Startseite | `/` | Nutzen erklären, Vertrauen aufbauen, zum Start motivieren (CTA «Kostenlos einen Plan erstellen») | MVP |
| Die App | `/app` | Funktionen erklären, Zugang (Web-App, PWA, Store-Links sobald verfügbar) | MVP |
| Über uns | `/ueber-uns` | Mission, Team, Werte, Schweiz | MVP |
| Kooperationen | `/kooperationen` | Für Marken, Creator, Anbieter, Veranstalter: Formen der Zusammenarbeit, Kontakt | MVP |
| Für Creator | `/creator` | Creator-Nutzen, Seite erstellen | MVP |
| Für Businesses | `/business` | Business-Nutzen, Seite/Bereich anlegen | MVP |
| FAQ / Hilfe | `/hilfe` | Häufige Fragen | MVP |
| Kontakt | `/kontakt` | Formular mit Spam-Schutz, Weiterleitung an Support | MVP |
| Impressum | `/impressum` | Pflichtangaben | MVP |
| Datenschutzerklärung | `/datenschutz` | DSG/DSGVO | MVP |
| Nutzungsbedingungen | `/agb` | Vertrag | MVP |
| Community-Richtlinien | `/richtlinien` | Verhaltensregeln, Melden | MVP |
| Preise | `/preise` | sobald Monetarisierung freigegeben | V2 |
| Für Vereine | `/vereine` | | V2 |
| Öffentliche Profile/Events | `/@name`, `/e/{slug}` | Serverseitig gerendert, teilbar, für Suchmaschinen indexierbar (nur bei Einwilligung) | MVP |

Alle Seiten in de, fr, it, en mit eigenem Pfadpräfix (`/fr/…`), `hreflang` und lokalisierten Metadaten.
Rechtstexte werden vor Veröffentlichung juristisch geprüft – Vorlagen von mir sind **keine Rechtsberatung**.

---

## 6. Admin-Dashboard

Eigenständige Anwendung unter `admin.pickeed.com`, getrennte Anmeldung mit verpflichtender 2FA.

### Module
| Modul | Funktionen | Priorität |
|---|---|---|
| Übersicht (KPIs) | siehe unten | MVP |
| Benutzer | Suchen, Profil ansehen, sperren/entsperren, löschen, Altersprüfung, Sitzungen beenden | MVP |
| Creator / Businesses | Seiten, Mitglieder, Verifizierungsanträge entscheiden | MVP |
| Beiträge und Kommentare | Suchen, ausblenden, entfernen (mit Begründung) | MVP |
| Meldungen | Warteschlange nach Dringlichkeit, Fristen (24 h für rechtswidrige Inhalte), Entscheid + Benachrichtigung | MVP |
| Events und Pläne | Öffentliche Events prüfen/entfernen (keine Einsicht in private Pläne) | MVP |
| Rollen und Berechtigungen | Admin-Rollen vergeben, 2FA-Status | MVP |
| Audit-Log | Wer hat wann was warum getan; nicht löschbar | MVP |
| Systemkonfiguration | Feature-Flags, Wartungshinweis, Sperrlisten (Wörter, Domains) | MVP |
| Kooperationen / Kampagnen | Kampagnen prüfen, Streitfälle | V2 |
| Communities | Gruppen, Moderatoren | V2 |
| Zahlungen | Abos, Tickets, Auszahlungen (Lesesicht aus Stripe) | V2 |

### KPIs (ausschliesslich aus echten Daten)
| Kennzahl | Definition |
|---|---|
| Registrierte Benutzer | Konten mit bestätigter E-Mail, ohne gelöschte |
| Aktive Benutzer | DAU / WAU / MAU: Konten mit mindestens einer authentifizierten Aktion im Zeitraum |
| Neue Registrierungen | pro Tag/Woche, nach Quelle (Einladung, direkt, Referral) |
| Veröffentlichte Beiträge | pro Zeitraum, nach Typ |
| Creator-Anzahl / Business-Anzahl | aktive Seiten, davon verifiziert |
| Interaktionen | Herzen, Kommentare, Nachrichten, Zusagen pro Zeitraum |
| Pläne | erstellt, mit Termin, stattgefunden (Nordstern) |
| Wachstum | Veränderung gegenüber Vorperiode, Kohorten-Retention |
| Moderation | offene Meldungen, mittlere Bearbeitungszeit |

Berechnung über tägliche Aggregationstabellen in der Datenbank – keine Drittanbieter-Analytics,
kein personenbezogenes Tracking. Leere Zustände zeigen «Noch keine Daten» statt Platzhalterzahlen.
