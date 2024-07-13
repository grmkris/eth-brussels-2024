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
  address: z.string(),
  lastMove: z.string().datetime(),
  createdAt: z.string().datetime(),
});

export type GameOutput = z.infer<typeof gameOutput>;
