import { pgTable, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { Players } from "./playersStorage.db";
import { z } from "@hono/zod-openapi";
import { Games } from "./gamesStorage.db";

export const Moves = pgTable("moves", {
    id: uuid("id").primaryKey().defaultRandom(),
    gameId: uuid("game_id").notNull().references(() => Games.id),
    playerId: uuid("player_id").notNull().references(() => Players.id),
    xCoordinate: integer("x_coordinate").notNull(),
    yCoordinate: integer("y_coordinate").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const SelectMove = createSelectSchema(Moves, {});

export const SelectMovesWithAddress = createSelectSchema(Moves, {})
.extend({playerAddress: z.string()});

export const CreateMove = createInsertSchema(Moves, {}).omit({id: true, createdAt: true});

export type SelectMove = z.infer<typeof SelectMove>;
export type SelectMovesWithAddress = z.infer<typeof SelectMovesWithAddress>;
export type CreateMove = z.infer<typeof CreateMove>;