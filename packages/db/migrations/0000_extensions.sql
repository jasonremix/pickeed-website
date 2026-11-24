-- Grundlagen: Extensions und Hilfsfunktionen, die das Schema voraussetzt.

CREATE EXTENSION IF NOT EXISTS citext;
--> statement-breakpoint

-- UUID Version 7 (RFC 9562): 48 Bit Millisekunden-Zeitstempel + Zufall.
-- Ersetzbar durch das eingebaute uuidv7() ab PostgreSQL 18.
CREATE OR REPLACE FUNCTION uuid_generate_v7() RETURNS uuid
LANGUAGE sql VOLATILE PARALLEL SAFE AS $$
  SELECT encode(
    set_bit(
      set_bit(
        overlay(uuid_send(gen_random_uuid())
                placing substring(int8send(floor(extract(epoch FROM clock_timestamp()) * 1000)::bigint) FROM 3)
                FROM 1 FOR 6),
        52, 1),
      53, 1),
    'hex')::uuid;
$$;
--> statement-breakpoint

-- Setzt updated_at bei jeder Änderung.
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;
