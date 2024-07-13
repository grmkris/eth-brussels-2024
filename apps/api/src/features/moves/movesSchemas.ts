import { GameStatus } from "../../db/gamesStorage.db";
import { SelectMove } from "../../db/movesStorage.db";
import { z } from "@hono/zod-openapi";

export const MovesResponse = SelectMove.extend({
    winnerId: z.string().nullable(),
    status: GameStatus,
});