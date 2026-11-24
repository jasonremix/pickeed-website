import { fileURLToPath } from "node:url";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

export const migrationsFolder = fileURLToPath(new URL("../migrations", import.meta.url));

/** Führt alle ausstehenden Migrationen aus (idempotent). */
export async function runMigrations(url: string): Promise<void> {
  const client = postgres(url, { max: 1, onnotice: () => {} });
  try {
    await migrate(drizzle(client), { migrationsFolder });
  } finally {
    await client.end();
  }
}

// Direkter Aufruf: pnpm db:migrate
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL fehlt (siehe .env.example).");
    process.exit(1);
  }
  runMigrations(url)
    .then(() => console.warn("Migrationen ausgeführt."))
    .catch((error: unknown) => {
      console.error(error);
      process.exit(1);
    });
}
