import { sql } from "drizzle-orm";
import { check, index, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { citext, createdAt, id, updatedAt } from "./columns";
import { accountStatus, followStatus, pageRole, pageType } from "./enums";
import { profiles, users } from "./identity";

/** Seiten: Creator, Business, Marke, Verein, Anbieter. Werden von Personen verwaltet. */
export const pages = pgTable(
  "pages",
  {
    id: id(),
    type: pageType("type").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    location: text("location"),
    website: text("website"),
    status: accountStatus("status").notNull().default("active"),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (t) => [
    check("pages_name_length", sql`char_length(btrim(${t.name})) between 1 and 80`),
    check("pages_description_length", sql`${t.description} is null or char_length(${t.description}) <= 1000`),
    check("pages_website_https", sql`${t.website} is null or ${t.website} ~ '^https://'`),
  ],
);

/** Rollen auf Seiten. Genau ein Inhaber pro Seite (Trigger, geprüft beim Commit). */
export const pageMembers = pgTable(
  "page_members",
  {
    pageId: uuid("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: pageRole("role").notNull(),
    invitedBy: uuid("invited_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: createdAt(),
  },
  (t) => [
    primaryKey({ columns: [t.pageId, t.userId] }),
    index("page_members_user_idx").on(t.userId),
    uniqueIndex("page_members_one_owner")
      .on(t.pageId)
      .where(sql`${t.role} = 'owner'`),
  ],
);

/**
 * Gemeinsamer Namensraum für @Benutzernamen von Personen und Seiten.
 * 3–30 Zeichen: a–z, 0–9, Punkt, Unterstrich; nicht mit Punkt/Unterstrich beginnend oder endend.
 */
export const handles = pgTable(
  "handles",
  {
    handle: citext("handle").primaryKey(),
    profileId: uuid("profile_id")
      .unique()
      .references(() => profiles.userId, { onDelete: "cascade" }),
    pageId: uuid("page_id")
      .unique()
      .references(() => pages.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
  },
  (t) => [
    check("handles_exactly_one_owner", sql`num_nonnulls(${t.profileId}, ${t.pageId}) = 1`),
    check("handles_lowercase", sql`${t.handle}::text = lower(${t.handle}::text)`),
    check("handles_format", sql`${t.handle}::text ~ '^[a-z0-9]([a-z0-9._]{1,28})[a-z0-9]$'`),
    check("handles_no_double_dot", sql`position('..' in ${t.handle}::text) = 0`),
  ],
);

/** Folgen von Personen (mit Bestätigung bei privaten Profilen) oder Seiten. */
export const follows = pgTable(
  "follows",
  {
    id: id(),
    followerId: uuid("follower_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    targetUserId: uuid("target_user_id").references(() => users.id, { onDelete: "cascade" }),
    targetPageId: uuid("target_page_id").references(() => pages.id, { onDelete: "cascade" }),
    status: followStatus("status").notNull().default("pending"),
    createdAt: createdAt(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  },
  (t) => [
    check("follows_exactly_one_target", sql`num_nonnulls(${t.targetUserId}, ${t.targetPageId}) = 1`),
    check("follows_not_self", sql`${t.targetUserId} is null or ${t.targetUserId} <> ${t.followerId}`),
    uniqueIndex("follows_user_unique")
      .on(t.followerId, t.targetUserId)
      .where(sql`${t.targetUserId} is not null`),
    uniqueIndex("follows_page_unique")
      .on(t.followerId, t.targetPageId)
      .where(sql`${t.targetPageId} is not null`),
    index("follows_target_user_idx").on(t.targetUserId, t.status),
    index("follows_target_page_idx").on(t.targetPageId, t.status),
    index("follows_follower_idx").on(t.followerId, t.status),
  ],
);

/** Blockieren: entfernt Folgen in beide Richtungen und verhindert neue (Trigger). */
export const blocks = pgTable(
  "blocks",
  {
    blockerId: uuid("blocker_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    blockedId: uuid("blocked_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
  },
  (t) => [
    primaryKey({ columns: [t.blockerId, t.blockedId] }),
    check("blocks_not_self", sql`${t.blockerId} <> ${t.blockedId}`),
    index("blocks_blocked_idx").on(t.blockedId),
  ],
);
