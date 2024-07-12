import { relations } from "drizzle-orm";

import { Players } from "./playersStorage.db";
import { Games } from "./gamesStorage.db";
import { Moves } from "./movesStorage.db";
import { GamePlayers } from "./gamePlayersStorage.db";

export const PlayerRelations = relations(Players, ({ many }) => ({
    games: many(Games),
    moves: many(Moves),
    gamePlayers: many(GamePlayers),
}));

export const GameRelations = relations(Games, ({ one, many}) => ({
    players: many(Players),
    gamePlayers: many(GamePlayers),
}));

export const MoveRelations = relations(Moves, ({ one }) => ({
    players: one(Players, {
        fields: [Moves.playerId],
        references: [Players.id],
    })
}));

export const GamePlayerRelations = relations(GamePlayers, ({ one }) => ({
    games: one(Games, {
        fields: [GamePlayers.gameId],
        references: [Games.id],
    }),
    players: one(Players, {
        fields: [GamePlayers.playerId],
        references: [Players.id],
    })
}));