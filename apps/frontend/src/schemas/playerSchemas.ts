import { z } from "zod";

export const playersOutput = z.object({
  id: z.string().uuid(),
  address: z.string(),
  lastMove: z.string().datetime(),
  createdAt: z.string().datetime(),
});

export type PlayersOutput = z.infer<typeof playersOutput>;
