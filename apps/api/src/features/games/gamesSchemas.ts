import { z } from "@hono/zod-openapi";
import { SelectGame } from "../../db/gamesStorage.db";

const playerAddressSchema = z.array(z.array(z.object({
    playerAddress: z.string().nullable()
  })));

export const GameResponse = SelectGame.extend({
    map: playerAddressSchema,
});

export const GamesResponse = SelectGame;