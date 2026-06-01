import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Tells prisma where your schema is located
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // If env("DATABASE_URL") is empty, it falls back to standard process.env
    url: env("DATABASE_URL") || process.env.DATABASE_URL || "",
  },
});
