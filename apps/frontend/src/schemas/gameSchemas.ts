import { z } from "zod";

export const GameStatuses = ["ongoing", "finished"] as const;
export const GameStatus = z.enum(GameStatuses);
export type GameStatus = z.infer<typeof GameStatus>;
export const Games = z.object({
  id: z.string().uuid(),
  status: GameStatus,
  winnerId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export const gameOutput = z.object({
  id: z.string().uuid(),
  status: z.string(),
  winnerId: z.string().uuid().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const gamesOutput = z.array(gameOutput);

export type GameOutput = z.infer<typeof gameOutput>;
