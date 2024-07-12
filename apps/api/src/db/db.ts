import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";

import { env } from "../env";
import * as schema from "./schema.db";

export const createDB = (pool: Pool) => {
    return drizzle(pool, {
      logger: env.DB_LOGGING_ENABLED,
      schema: schema,
    });
  };

export type db = ReturnType<typeof createDB>;

export const schemasConfigRelations = schema;

export type Transaction = db["transaction"];
export type tx = PgTransaction<
  NodePgQueryResultHKT,
  typeof schemasConfigRelations,
  ExtractTablesWithRelations<typeof schemasConfigRelations>
>;

export const db = createDB(
    new Pool({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
    }),
  );

// this will automatically run needed migrations on the database
export const migrateDB = async () => {
    await migrate(db, { migrationsFolder: env.DB_MIGRATION_DIR });
  };