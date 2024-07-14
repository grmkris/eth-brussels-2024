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
  id: z.string().uuid().nullish(),
  status: z.string(),
  winnerId: z.string().uuid().nullish(),
  createdAt: z.string().datetime().nullish(),
  updatedAt: z.string().datetime().nullish(),
  map: z
    .array(
      z
        .array(
          z.object({
            playerAddress: z.string().nullable(),
          }),
        )
        .nullish(),
    )
    .nullish(),
});

export const gamesOutput = z.array(gameOutput);

export type GameOutput = z.infer<typeof gameOutput>;
