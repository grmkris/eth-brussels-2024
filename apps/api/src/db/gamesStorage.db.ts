import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "@hono/zod-openapi";
import { Players } from "./playersStorage.db";

export const GameStatuses = [
    "ongoing",
    "finished",
  ] as const;
  export const GameStatus = z.enum(GameStatuses);
  export type GameStatus = z.infer<typeof GameStatus>;

export const Games = pgTable("games", {
    id: uuid("id").primaryKey().defaultRandom(),
    status: text("status", { enum: GameStatuses }).notNull(),
    winnerId: uuid("winner_id").references(() => Players.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const SelectGame = createSelectSchema(Games, {});

export const CreateGame = createInsertSchema(Games, {}).omit({id: true, createdAt: true, updatedAt: true});

export const UpdateGame = createSelectSchema(Games, {
  status: GameStatus.optional(),
  winnerId: z.string().optional(),
}).omit({id: true, createdAt: true, updatedAt: true});

export type SelectGame = z.infer<typeof SelectGame>;
export type CreateGame = z.infer<typeof CreateGame>;
export type UpdateGame = z.infer<typeof UpdateGame>;