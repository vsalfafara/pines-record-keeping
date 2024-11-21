import { defineConfig } from "drizzle-kit";
import "dotenv/config";

const dbUrl = process.env.DATABASE_URL || "";

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./supabase/migrations",
  dbCredentials: {
    url: dbUrl,
  },
});
