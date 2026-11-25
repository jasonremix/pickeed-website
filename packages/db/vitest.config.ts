import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    environment: "node",
    // Integrationstests teilen sich eine Datenbank: nacheinander ausführen.
    fileParallelism: false,
    hookTimeout: 60_000,
  },
});
