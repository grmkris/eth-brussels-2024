import "dotenv/config";
import { z } from "zod";
import { parseEnv } from "znv";

export const env = parseEnv(process.env, {
    APP_PORT: z.string().optional(),
    DB_LOGGING_ENABLED: z.boolean().optional(),
    DB_HOST: z.string(),
    DB_PORT: z.number(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_DATABASE: z.string(),
    DB_MIGRATION_DIR: z.string().min(1).default("./drizzle"),
  });