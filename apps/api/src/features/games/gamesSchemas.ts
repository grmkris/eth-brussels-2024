import { z } from "@hono/zod-openapi";
import { GameStatus, SelectGame } from "../../db/gamesStorage.db";

const playerAddressSchema = z.array(z.array(z.object({
    playerAddress: z.string().nullable()
  })));

export const GameResponse = SelectGame.extend({
    map: playerAddressSchema,
});

export type GameResponse = z.infer<typeof GameResponse>;

export const GamesResponse = z.object({
  id: z.string(),
  status: GameStatus,
  winnerId: z.string().nullable(),
  createdAt: z.string().date(),
  updatedAt: z.string().date(),
});

export type GamesResponse = z.infer<typeof GamesResponse>;