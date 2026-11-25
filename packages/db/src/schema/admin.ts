import { sql } from "drizzle-orm";
import { boolean, check, index, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createdAt, id } from "./columns";
import { adminRole } from "./enums";
import { users } from "./identity";

/** Mitarbeitende von Pickeed mit Admin-Rolle. Zwei-Faktor-Anmeldung ist Pflicht (Phase 10). */
export const adminUsers = pgTable("admin_users", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  role: adminRole("role").notNull(),
  mfaEnrolledAt: timestamp("mfa_enrolled_at", { withTimezone: true }),
  active: boolean("active").notNull().default(true),
  createdAt: createdAt(),
});

/**
 * Protokoll aller Admin- und Sicherheitsaktionen. Nur anhängen: UPDATE und DELETE sind per Trigger gesperrt.
 * Bewusst ohne Fremdschlüssel, damit Einträge das Löschen eines Kontos überdauern.
 */
export const auditLog = pgTable(
  "audit_log",
  {
    id: id(),
    actorUserId: uuid("actor_user_id"),
    action: text("action").notNull(),
    targetType: text("target_type"),
    targetId: uuid("target_id"),
    reason: text("reason"),
    metadata: jsonb("metadata")
      .notNull()
      .default(sql`'{}'::jsonb`),
    ipHash: text("ip_hash"),
    createdAt: createdAt(),
  },
  (t) => [
    index("audit_log_created_idx").on(t.createdAt.desc()),
    index("audit_log_target_idx").on(t.targetType, t.targetId),
    check("audit_log_action_format", sql`${t.action} ~ '^[a-z][a-z0-9_.]*$'`),
  ],
);
