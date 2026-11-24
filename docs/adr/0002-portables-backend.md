# ADR-0002: Portables Backend auf Standardschnittstellen

- **Status:** angenommen (vorläufig, bis Entscheidung D2)
- **Datum:** 24.11.2026
- **Ersetzt teilweise:** Empfehlung «Supabase Auth, Storage, Realtime» in [04](../04-technische-architektur.md)

## Kontext

Offen ist, ob die Daten bei Supabase (US-Unternehmen, Rechenzentrum Zürich) oder bei einem rein
Schweizer Anbieter liegen sollen (Frage D2). Würde der Code Supabase-spezifische Dienste
(Supabase Auth, Supabase Realtime, Supabase-Client im Browser) nutzen, wäre ein späterer Wechsel
aufwendig. Die Live-Plattform nutzt Supabase ebenfalls nur als PostgreSQL-Betreiber mit eigener
Anmeldung.

## Entscheidung

Die Anwendung verwendet ausschliesslich **Standardschnittstellen**:

| Bedarf | Schnittstelle | Lokal (Docker) | Produktion (beide Varianten möglich) |
|---|---|---|---|
| Datenbank | PostgreSQL 16 (`DATABASE_URL`) | `postgres:16` | Supabase Zürich **oder** Schweizer Managed Postgres |
| Anmeldung | Eigene Implementierung: E-Mail-Code, Sitzungen in PostgreSQL, Apple/Google über OpenID Connect | – | – |
| Dateien | S3-API | MinIO | Supabase Storage (S3) **oder** Infomaniak/Exoscale Object Storage |
| E-Mail | SMTP bzw. HTTP-API hinter einer Schnittstelle | Mailpit | Brevo |
| Echtzeit | Server-Sent Events + PostgreSQL `LISTEN/NOTIFY` | – | – (ab Skalierung eigener Dienst) |
| Jobs | Queue in PostgreSQL | – | – |

**Berechtigungen** werden in der Anwendungsschicht (`@pickeed/core`, serverseitig) bei jeder Anfrage
geprüft und durch Datenbank-Constraints und Trigger abgesichert. Row Level Security wird als
zusätzliche Verteidigungslinie ergänzt, sobald die Zugriffsmuster stabil sind.

## Konsequenzen

- **Vorteil:** D2 wird zur reinen Betriebsentscheidung; kein Vendor-Lock-in; identisches Verhalten
  lokal, in CI und in Produktion.
- **Nachteil:** Anmeldung und Echtzeit werden selbst gebaut (geschätzt 3–5 Personenwochen
  Mehraufwand gegenüber Supabase Auth/Realtime). Dafür volle Kontrolle über Datenschutz-Details
  (z. B. Codes nur als Prüfwerte, Alterskontrolle, Schutz bis 18).
- Sicherheitskritischer Code (Anmeldung, Sitzungen) wird besonders gründlich getestet und vor dem
  öffentlichen Start im Pentest geprüft.
