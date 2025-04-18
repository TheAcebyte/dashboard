import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/index.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: "file:data/sqlite.db",
  },
});
