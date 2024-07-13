import { pgTable, timestamp, uuid, unique } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { Games } from "./gamesStorage.db";
import { Players } from "./playersStorage.db";
import { z } from "@hono/zod-openapi";


export const GamePlayers = pgTable("game_players", {
    id: uuid("id").primaryKey().defaultRandom(),
    gameId: uuid("game_id").notNull().references(() => Games.id),
    playerId: uuid("player_id").notNull().references(() => Players.id),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
},
    (table) => ({
        unq: unique().on(table.gameId, table.playerId),	
    }),
);

export const SelectGamePlayer = createSelectSchema(GamePlayers, {});

export const CreateGamePlayer = createInsertSchema(GamePlayers, {}).omit({id: true, joinedAt: true});

export type SelectGamePlayer = z.infer<typeof SelectGamePlayer>;
export type CreateGamePlayer = z.infer<typeof CreateGamePlayer>;