import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import type postgres from "postgres";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { runMigrations } from "../src/migrate";
import * as schema from "../src/schema";
import {
  connect,
  createPage,
  createProfile,
  createUser,
  expectPgError,
  hasDatabase,
  PG,
  resetDatabase,
  testDatabaseUrl,
  truncateAll,
} from "./helpers";

describe.skipIf(!hasDatabase)("Datenbankschema (PostgreSQL)", () => {
  let sql: postgres.Sql;

  beforeAll(async () => {
    await resetDatabase();
    sql = connect();
  });

  afterAll(async () => {
    await sql?.end();
  });

  beforeEach(async () => {
    await truncateAll(sql);
  });

  describe("Migrationen", () => {
    it("lassen sich erneut ausführen, ohne etwas zu ändern", async () => {
      await expect(runMigrations(testDatabaseUrl!)).resolves.toBeUndefined();
      const [{ count } = { count: -1 }] = await sql<{ count: number }[]>`
        SELECT count(*)::int AS count FROM drizzle.__drizzle_migrations`;
      expect(count).toBe(4);
    });

    it("erzeugen UUIDs der Version 7 in zeitlicher Reihenfolge", async () => {
      const rows = await sql<
        { id: string }[]
      >`SELECT uuid_generate_v7()::text AS id FROM generate_series(1, 5)`;
      for (const { id } of rows)
        expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
      const a = await sql<{ id: string }[]>`SELECT uuid_generate_v7()::text AS id`;
      await new Promise((r) => setTimeout(r, 5));
      const b = await sql<{ id: string }[]>`SELECT uuid_generate_v7()::text AS id`;
      expect(a[0]!.id < b[0]!.id).toBe(true);
    });
  });

  describe("Konten und Profile", () => {
    it("E-Mail-Adressen sind unabhängig von Gross-/Kleinschreibung eindeutig", async () => {
      await createUser(sql, "Lea@Example.ch");
      await expectPgError(createUser(sql, "lea@example.ch"), PG.uniqueViolation);
    });

    it("lehnt ungültige E-Mail-Adressen ab", async () => {
      await expectPgError(createUser(sql, "keine-adresse"), PG.checkViolation, {
        constraint: "users_email_format",
      });
      await expectPgError(createUser(sql, "a b@example.ch"), PG.checkViolation, {
        constraint: "users_email_format",
      });
    });

    it("Profile sind standardmässig privat und nicht in Suchmaschinen", async () => {
      const id = await createUser(sql, "noah@example.ch");
      await createProfile(sql, id, "Noah Keller");
      const [p] =
        await sql`SELECT is_private, indexable, locale, time_zone FROM profiles WHERE user_id = ${id}`;
      expect(p).toEqual({ is_private: true, indexable: false, locale: "de-CH", time_zone: "Europe/Zurich" });
    });

    it("prüft Namen, Bio-Länge und Sprache", async () => {
      const id = await createUser(sql, "x@example.ch");
      await expectPgError(
        sql`INSERT INTO profiles (user_id, display_name, birthdate) VALUES (${id}, '   ', '2000-01-01')`,
        PG.checkViolation,
        { constraint: "profiles_display_name_length" },
      );
      await expectPgError(
        sql`INSERT INTO profiles (user_id, display_name, birthdate, bio) VALUES (${id}, 'X', '2000-01-01', ${"a".repeat(501)})`,
        PG.checkViolation,
        { constraint: "profiles_bio_length" },
      );
      await expectPgError(
        sql`INSERT INTO profiles (user_id, display_name, birthdate, locale) VALUES (${id}, 'X', '2000-01-01', 'de-DE')`,
        PG.checkViolation,
        { constraint: "profiles_locale" },
      );
    });

    it("setzt updated_at bei Änderungen", async () => {
      const id = await createUser(sql, "t@example.ch");
      const [before] = await sql<{ updated_at: Date }[]>`SELECT updated_at FROM users WHERE id = ${id}`;
      await new Promise((r) => setTimeout(r, 10));
      await sql`UPDATE users SET email_verified_at = now() WHERE id = ${id}`;
      const [after] = await sql<{ updated_at: Date }[]>`SELECT updated_at FROM users WHERE id = ${id}`;
      expect(after!.updated_at.getTime()).toBeGreaterThan(before!.updated_at.getTime());
    });

    it("Löschen eines Kontos entfernt Profil, Sitzungen, Einwilligungen und Folgen", async () => {
      const a = await createUser(sql, "a@example.ch");
      const b = await createUser(sql, "b@example.ch");
      await createProfile(sql, a);
      await sql`INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (${a}, 'h1', now() + interval '30 days')`;
      await sql`INSERT INTO consents (user_id, type, version) VALUES (${a}, 'terms', '2026-11')`;
      await sql`INSERT INTO follows (follower_id, target_user_id) VALUES (${a}, ${b}), (${b}, ${a})`;
      await sql`DELETE FROM users WHERE id = ${a}`;
      const [counts] = await sql`
        SELECT (SELECT count(*)::int FROM profiles) AS profiles,
               (SELECT count(*)::int FROM sessions) AS sessions,
               (SELECT count(*)::int FROM consents) AS consents,
               (SELECT count(*)::int FROM follows) AS follows`;
      expect(counts).toEqual({ profiles: 0, sessions: 0, consents: 0, follows: 0 });
    });

    it("Sitzungs-Prüfwerte sind eindeutig", async () => {
      const a = await createUser(sql, "s@example.ch");
      await sql`INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (${a}, 'gleich', now() + interval '1 day')`;
      await expectPgError(
        sql`INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (${a}, 'gleich', now() + interval '1 day')`,
        PG.uniqueViolation,
      );
    });

    it("Anmeldecodes: höchstens 10 Versuche, Ablauf nach Erstellung", async () => {
      await expectPgError(
        sql`INSERT INTO auth_codes (email, code_hash, attempts, expires_at) VALUES ('c@example.ch', 'h', 11, now() + interval '30 minutes')`,
        PG.checkViolation,
        { constraint: "auth_codes_attempts_range" },
      );
      await expectPgError(
        sql`INSERT INTO auth_codes (email, code_hash, expires_at) VALUES ('c@example.ch', 'h', now() - interval '1 minute')`,
        PG.checkViolation,
        { constraint: "auth_codes_expiry_after_creation" },
      );
    });

    it("pro Typ ist höchstens eine Einwilligung aktiv; nach Widerruf ist eine neue möglich", async () => {
      const a = await createUser(sql, "k@example.ch");
      await sql`INSERT INTO consents (user_id, type, version) VALUES (${a}, 'push', '1')`;
      await expectPgError(
        sql`INSERT INTO consents (user_id, type, version) VALUES (${a}, 'push', '2')`,
        PG.uniqueViolation,
      );
      await sql`UPDATE consents SET revoked_at = now() WHERE user_id = ${a} AND type = 'push'`;
      await expect(
        sql`INSERT INTO consents (user_id, type, version) VALUES (${a}, 'push', '2')`,
      ).resolves.toBeDefined();
    });
  });

  describe("@Benutzernamen (gemeinsamer Namensraum)", () => {
    it("ein Name gehört entweder einer Person oder einer Seite", async () => {
      const a = await createUser(sql, "h@example.ch");
      await createProfile(sql, a);
      const page = await createPage(sql, a);
      await sql`INSERT INTO handles (handle, profile_id) VALUES ('lea.muster', ${a})`;
      await expectPgError(
        sql`INSERT INTO handles (handle, page_id) VALUES ('lea.muster', ${page})`,
        PG.uniqueViolation,
      );
      await expectPgError(
        sql`INSERT INTO handles (handle, profile_id, page_id) VALUES ('beide', ${a}, ${page})`,
        PG.checkViolation,
        { constraint: "handles_exactly_one_owner" },
      );
    });

    it("prüft das Format", async () => {
      const a = await createUser(sql, "f@example.ch");
      await createProfile(sql, a);
      for (const bad of [
        "ab",
        "Lea",
        "_lea",
        "lea_",
        ".lea",
        "lea..muster",
        "lea muster",
        "a".repeat(31),
        "léa",
      ]) {
        await expectPgError(
          sql`INSERT INTO handles (handle, profile_id) VALUES (${bad}, ${a})`,
          PG.checkViolation,
        );
      }
      await expect(
        sql`INSERT INTO handles (handle, profile_id) VALUES ('lea_2026', ${a})`,
      ).resolves.toBeDefined();
    });
  });

  describe("Folgen und Blockieren", () => {
    it("verhindert Selbst-Folgen, doppelte Einträge und fehlende Ziele", async () => {
      const a = await createUser(sql, "a@example.ch");
      const b = await createUser(sql, "b@example.ch");
      await expectPgError(
        sql`INSERT INTO follows (follower_id, target_user_id) VALUES (${a}, ${a})`,
        PG.checkViolation,
        { constraint: "follows_not_self" },
      );
      await expectPgError(sql`INSERT INTO follows (follower_id) VALUES (${a})`, PG.checkViolation, {
        constraint: "follows_exactly_one_target",
      });
      await sql`INSERT INTO follows (follower_id, target_user_id) VALUES (${a}, ${b})`;
      await expectPgError(
        sql`INSERT INTO follows (follower_id, target_user_id) VALUES (${a}, ${b})`,
        PG.uniqueViolation,
      );
    });

    it("Folgen ist standardmässig eine Anfrage", async () => {
      const a = await createUser(sql, "a@example.ch");
      const b = await createUser(sql, "b@example.ch");
      const [f] =
        await sql`INSERT INTO follows (follower_id, target_user_id) VALUES (${a}, ${b}) RETURNING status`;
      expect(f!.status).toBe("pending");
    });

    it("Blockieren entfernt Folgen in beide Richtungen und verhindert neue", async () => {
      const a = await createUser(sql, "a@example.ch");
      const b = await createUser(sql, "b@example.ch");
      await sql`INSERT INTO follows (follower_id, target_user_id, status) VALUES (${a}, ${b}, 'accepted'), (${b}, ${a}, 'accepted')`;
      await sql`INSERT INTO blocks (blocker_id, blocked_id) VALUES (${a}, ${b})`;
      const [{ count } = { count: -1 }] = await sql<
        { count: number }[]
      >`SELECT count(*)::int AS count FROM follows`;
      expect(count).toBe(0);
      await expectPgError(
        sql`INSERT INTO follows (follower_id, target_user_id) VALUES (${b}, ${a})`,
        PG.checkViolation,
        {
          message: /blocked/,
        },
      );
      await expectPgError(
        sql`INSERT INTO follows (follower_id, target_user_id) VALUES (${a}, ${b})`,
        PG.checkViolation,
        {
          message: /blocked/,
        },
      );
    });

    it("Seiten können gefolgt werden, unabhängig von Personen", async () => {
      const a = await createUser(sql, "a@example.ch");
      const b = await createUser(sql, "b@example.ch");
      const page = await createPage(sql, b);
      await sql`INSERT INTO follows (follower_id, target_page_id, status) VALUES (${a}, ${page}, 'accepted')`;
      await expectPgError(
        sql`INSERT INTO follows (follower_id, target_page_id) VALUES (${a}, ${page})`,
        PG.uniqueViolation,
      );
    });
  });

  describe("Seiten und Rollen", () => {
    it("eine Seite ohne Inhaber wird beim Commit abgelehnt", async () => {
      const a = await createUser(sql, "a@example.ch");
      await expectPgError(
        sql.begin((tx) => tx`INSERT INTO pages (type, name, created_by) VALUES ('creator', 'Giulia', ${a})`),
        PG.checkViolation,
        { message: /exactly one owner/ },
      );
      const [{ count } = { count: -1 }] = await sql<
        { count: number }[]
      >`SELECT count(*)::int AS count FROM pages`;
      expect(count).toBe(0);
    });

    it("höchstens ein Inhaber pro Seite", async () => {
      const a = await createUser(sql, "a@example.ch");
      const b = await createUser(sql, "b@example.ch");
      const page = await createPage(sql, a);
      await expectPgError(
        sql`INSERT INTO page_members (page_id, user_id, role) VALUES (${page}, ${b}, 'owner')`,
        PG.uniqueViolation,
      );
    });

    it("der letzte Inhaber kann nicht entfernt werden – eine Übertragung in einer Transaktion schon", async () => {
      const a = await createUser(sql, "a@example.ch");
      const b = await createUser(sql, "b@example.ch");
      const page = await createPage(sql, a);
      await sql`INSERT INTO page_members (page_id, user_id, role) VALUES (${page}, ${b}, 'admin')`;
      await expectPgError(
        sql.begin((tx) => tx`DELETE FROM page_members WHERE page_id = ${page} AND user_id = ${a}`),
        PG.checkViolation,
        { message: /exactly one owner/ },
      );
      await sql.begin(async (tx) => {
        await tx`UPDATE page_members SET role = 'admin' WHERE page_id = ${page} AND user_id = ${a}`;
        await tx`UPDATE page_members SET role = 'owner' WHERE page_id = ${page} AND user_id = ${b}`;
      });
      const owners = await sql`SELECT user_id FROM page_members WHERE page_id = ${page} AND role = 'owner'`;
      expect(owners.map((o) => o.user_id)).toEqual([b]);
    });

    it("Löschen einer Seite entfernt Mitglieder, Folgen und @Namen", async () => {
      const a = await createUser(sql, "a@example.ch");
      const b = await createUser(sql, "b@example.ch");
      const page = await createPage(sql, a);
      await sql`INSERT INTO handles (handle, page_id) VALUES ('bergquell', ${page})`;
      await sql`INSERT INTO follows (follower_id, target_page_id) VALUES (${b}, ${page})`;
      await sql`DELETE FROM pages WHERE id = ${page}`;
      const [counts] = await sql`
        SELECT (SELECT count(*)::int FROM page_members) AS members,
               (SELECT count(*)::int FROM follows) AS follows,
               (SELECT count(*)::int FROM handles) AS handles`;
      expect(counts).toEqual({ members: 0, follows: 0, handles: 0 });
    });

    it("Websites müssen https verwenden", async () => {
      const a = await createUser(sql, "a@example.ch");
      await expectPgError(
        sql.begin(async (tx) => {
          const [p] =
            await tx`INSERT INTO pages (type, name, website) VALUES ('business', 'X', 'http://x.ch') RETURNING id`;
          await tx`INSERT INTO page_members (page_id, user_id, role) VALUES (${p!.id}, ${a}, 'owner')`;
        }),
        PG.checkViolation,
        { constraint: "pages_website_https" },
      );
    });
  });

  describe("Audit-Log", () => {
    it("ist nur anhängbar", async () => {
      const [row] = await sql`
        INSERT INTO audit_log (actor_user_id, action, target_type, reason)
        VALUES (uuid_generate_v7(), 'user.suspend', 'user', 'Spam') RETURNING id`;
      await expectPgError(
        sql`UPDATE audit_log SET reason = 'geändert' WHERE id = ${row!.id}`,
        PG.insufficientPrivilege,
      );
      await expectPgError(sql`DELETE FROM audit_log WHERE id = ${row!.id}`, PG.insufficientPrivilege);
    });

    it("Aktionsnamen folgen dem Format bereich.aktion", async () => {
      await expectPgError(sql`INSERT INTO audit_log (action) VALUES ('User Suspend')`, PG.checkViolation, {
        constraint: "audit_log_action_format",
      });
    });
  });

  describe("Drizzle-Schema", () => {
    it("passt zur Datenbank (Schreiben und Lesen über das ORM)", async () => {
      const db = drizzle(sql, { schema });
      const [user] = await db.insert(schema.users).values({ email: "orm@example.ch" }).returning();
      await db
        .insert(schema.profiles)
        .values({ userId: user!.id, displayName: "Orm Test", birthdate: "1999-12-31" });
      const profile = await db.query.profiles.findFirst({ where: eq(schema.profiles.userId, user!.id) });
      expect(profile).toMatchObject({
        displayName: "Orm Test",
        birthdate: "1999-12-31",
        isPrivate: true,
        locale: "de-CH",
      });
      expect(user!.status).toBe("active");
    });
  });
});
