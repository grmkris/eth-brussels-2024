import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { Games } from "./gamesStorage.db";
import { Players } from "./playersStorage.db";


export const Moves = pgTable("moves", {
    id: uuid("id").primaryKey().defaultRandom(),
    playerId: uuid("player_id").notNull().references(() => Players.id),
    xCoordinate: integer("x_coordinate").notNull(),
    yCoordinate: integer("y_coordinate").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const SelectMove = createSelectSchema(Moves);

export const CreateMove = createInsertSchema(Moves).omit({id: true, createdAt: true});

export type SelectMove = Zod.infer<typeof SelectMove>;
export type CreateMove = Zod.infer<typeof CreateMove>;