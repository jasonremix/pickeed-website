import postgres from "postgres";
import { expect } from "vitest";
import { runMigrations } from "../src/migrate";

/**
 * Integrationstests laufen gegen ein echtes PostgreSQL 16 (TEST_DATABASE_URL).
 * Lokal: docker compose up -d db. In CI stellt GitHub Actions die Datenbank bereit.
 * Achtung: Die Testdatenbank wird vollständig geleert.
 */
export const testDatabaseUrl = process.env.TEST_DATABASE_URL;

if (!testDatabaseUrl && process.env.CI) {
  throw new Error("TEST_DATABASE_URL muss in CI gesetzt sein.");
}
if (!testDatabaseUrl) {
  console.warn("⚠ TEST_DATABASE_URL nicht gesetzt – Datenbank-Integrationstests werden übersprungen.");
}

export const hasDatabase = Boolean(testDatabaseUrl);

export function connect() {
  return postgres(testDatabaseUrl!, { max: 4, onnotice: () => {} });
}

/** Leert die Datenbank komplett und spielt alle Migrationen neu ein. */
export async function resetDatabase(): Promise<void> {
  const sql = postgres(testDatabaseUrl!, { max: 1, onnotice: () => {} });
  try {
    await sql.unsafe(
      "DROP SCHEMA IF EXISTS drizzle CASCADE; DROP SCHEMA public CASCADE; CREATE SCHEMA public;",
    );
  } finally {
    await sql.end();
  }
  await runMigrations(testDatabaseUrl!);
}

export async function truncateAll(sql: postgres.Sql): Promise<void> {
  await sql.unsafe("TRUNCATE users, pages, auth_codes, audit_log RESTART IDENTITY CASCADE");
}

export async function createUser(sql: postgres.Sql, email: string): Promise<string> {
  const [row] = await sql<{ id: string }[]>`INSERT INTO users (email) VALUES (${email}) RETURNING id`;
  return row!.id;
}

export async function createProfile(sql: postgres.Sql, userId: string, name = "Lea Muster"): Promise<void> {
  await sql`INSERT INTO profiles (user_id, display_name, birthdate) VALUES (${userId}, ${name}, '2000-05-17')`;
}

/** Legt eine Seite mit Inhaber in einer Transaktion an. */
export async function createPage(sql: postgres.Sql, ownerId: string, name = "Bergquell"): Promise<string> {
  return sql.begin(async (tx) => {
    const [page] = await tx<{ id: string }[]>`
      INSERT INTO pages (type, name, created_by) VALUES ('brand', ${name}, ${ownerId}) RETURNING id`;
    await tx`INSERT INTO page_members (page_id, user_id, role) VALUES (${page!.id}, ${ownerId}, 'owner')`;
    return page!.id;
  });
}

/** Erwartet einen PostgreSQL-Fehler mit bestimmtem Code und optional Constraint/Meldung. */
export async function expectPgError(
  action: Promise<unknown>,
  code: string,
  detail?: { constraint?: string; message?: RegExp },
): Promise<void> {
  try {
    await action;
  } catch (error) {
    const e = error as { code?: string; constraint_name?: string; message?: string };
    expect(e.code, e.message).toBe(code);
    if (detail?.constraint) expect(e.constraint_name).toBe(detail.constraint);
    if (detail?.message) expect(e.message).toMatch(detail.message);
    return;
  }
  throw new Error(`Erwarteter Datenbankfehler ${code} ist nicht aufgetreten`);
}

export const PG = {
  uniqueViolation: "23505",
  checkViolation: "23514",
  foreignKeyViolation: "23503",
  notNullViolation: "23502",
  insufficientPrivilege: "42501",
} as const;
