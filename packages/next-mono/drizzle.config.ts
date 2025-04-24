import { cst } from "@/constants";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/schema",
  dialect: "sqlite",
  dbCredentials: {
    url: cst.DATABASE_URL,
  },
});
