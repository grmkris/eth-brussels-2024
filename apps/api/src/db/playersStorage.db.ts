import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "@hono/zod-openapi";

export const Players = pgTable("players", {
  id: uuid("id").primaryKey().defaultRandom(),
  address: text("address").notNull(),
  challenge: text("challenge").notNull(),
  signatureVerified: boolean("signature_verified"),
  worldcoinVerified: boolean("worldcoin_verified"),
  lastMove: timestamp("last_move").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const SelectPlayer = createSelectSchema(Players, {});

export const CreatePlayer = createInsertSchema(Players, {}).omit({ id: true, createdAt: true, lastMove: true });

export type SelectPlayer = z.infer<typeof SelectPlayer>;
export type CreatePlayer = z.infer<typeof CreatePlayer>;
