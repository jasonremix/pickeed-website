import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { citext, createdAt, id, updatedAt } from "./columns";
import { accountStatus, authCodePurpose, consentType } from "./enums";

/** Konto: nur Anmeldedaten. Öffentliche Angaben liegen in profiles. */
export const users = pgTable(
  "users",
  {
    id: id(),
    email: citext("email").notNull().unique(),
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
    status: accountStatus("status").notNull().default("active"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    check("users_email_format", sql`${t.email}::text ~ '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$'`),
    check("users_email_length", sql`char_length(${t.email}::text) <= 254`),
  ],
);

/** Profil einer Person (1:1 zum Konto). Privat als Standard. */
export const profiles = pgTable(
  "profiles",
  {
    userId: uuid("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    displayName: text("display_name").notNull(),
    bio: text("bio"),
    birthdate: date("birthdate", { mode: "string" }).notNull(),
    locale: text("locale").notNull().default("de-CH"),
    timeZone: text("time_zone").notNull().default("Europe/Zurich"),
    isPrivate: boolean("is_private").notNull().default(true),
    searchable: boolean("searchable").notNull().default(true),
    indexable: boolean("indexable").notNull().default(false),
    ageVerifiedAt: timestamp("age_verified_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    check("profiles_display_name_length", sql`char_length(btrim(${t.displayName})) between 1 and 80`),
    check("profiles_bio_length", sql`${t.bio} is null or char_length(${t.bio}) <= 500`),
    check("profiles_locale", sql`${t.locale} in ('de-CH', 'fr-CH', 'it-CH', 'en-CH', 'es-419', 'pt-BR')`),
  ],
);

/** Einmal-Codes für die Anmeldung. Gespeichert wird nur ein Prüfwert, nie der Code selbst. */
export const authCodes = pgTable(
  "auth_codes",
  {
    id: id(),
    email: citext("email").notNull(),
    codeHash: text("code_hash").notNull(),
    purpose: authCodePurpose("purpose").notNull().default("sign_in"),
    attempts: integer("attempts").notNull().default(0),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [
    index("auth_codes_email_created_idx").on(t.email, t.createdAt.desc()),
    check("auth_codes_attempts_range", sql`${t.attempts} between 0 and 10`),
    check("auth_codes_expiry_after_creation", sql`${t.expiresAt} > ${t.createdAt}`),
  ],
);

/** Sitzungen: Token nur als Prüfwert gespeichert. */
export const sessions = pgTable(
  "sessions",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    userAgent: text("user_agent"),
    ipHash: text("ip_hash"),
    createdAt: createdAt(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

/** Einwilligungen mit Version; pro Typ höchstens eine aktive. */
export const consents = pgTable(
  "consents",
  {
    id: id(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: consentType("type").notNull(),
    version: text("version").notNull(),
    grantedAt: timestamp("granted_at", { withTimezone: true }).notNull().defaultNow(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
  },
  (t) => [
    index("consents_user_idx").on(t.userId),
    uniqueIndex("consents_one_active_per_type")
      .on(t.userId, t.type)
      .where(sql`${t.revokedAt} is null`),
  ],
);
