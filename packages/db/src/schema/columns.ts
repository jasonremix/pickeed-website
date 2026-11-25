import { sql } from "drizzle-orm";
import { customType, timestamp, uuid } from "drizzle-orm/pg-core";

/** Gross-/Kleinschreibung-unabhängiger Text (E-Mail, Benutzernamen). Benötigt die Extension citext. */
export const citext = customType<{ data: string }>({
  dataType() {
    return "citext";
  },
});

/** Primärschlüssel: UUID Version 7 (zeitlich sortierbar), erzeugt in der Datenbank. */
export const id = () =>
  uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v7()`);

export const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
export const updatedAt = () => timestamp("updated_at", { withTimezone: true }).notNull().defaultNow();
