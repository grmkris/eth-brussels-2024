import type { Config } from "drizzle-kit";

import { env } from "./src/env";

export default {
  schema: "./src/db/schema.db.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: env.DB_HOST ?? "localhost",
    port: env.DB_PORT ?? 5432,
    user: env.DB_USER ?? "drizzle",
    password: env.DB_PASSWORD ?? "",
    database: env.DB_DATABASE ?? "drizzle",
    ssl: false,
  },
} satisfies Config;