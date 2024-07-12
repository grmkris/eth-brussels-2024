import { Client } from "pg";

import { env } from "../src/env";

const schemas: string[] = ["public", "drizzle", "audit"];

async function dropTables() {
  const client = new Client({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
  });
  try {
    await client.connect();

    for (const schema of schemas) {
      // Get the list of all tables in the current schema
      const res = await client.query(
        `
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = $1
            `,
        [schema],
      );

      for (const row of res.rows) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        const tableName: string = row.table_name;
        // Drop each table
        await client.query(
          `DROP TABLE IF EXISTS "${schema}"."${tableName}" CASCADE;`,
        );
        console.log(`Dropped table: ${schema}.${tableName}`);
      }
    }

    console.log("All specified tables have been dropped.");
  } catch (err) {
    console.error("Error dropping tables:", err);
  } finally {
    await client.end();
  }
}

void dropTables();