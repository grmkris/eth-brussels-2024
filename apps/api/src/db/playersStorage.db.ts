import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";


export const Players = pgTable("players", {
    id: uuid("id").primaryKey().defaultRandom(),
    address: text("address").notNull(),
    lastMove: timestamp("last_move").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const SelectPlayer = createSelectSchema(Players);

export const CreatePlayer = createInsertSchema(Players).omit({id: true, createdAt: true});

export type SelectPlayer = Zod.infer<typeof SelectPlayer>;
export type CreatePlayer = Zod.infer<typeof CreatePlayer>;