import { z } from "zod";

export const playersOutput = z.object({
  id: z.string().uuid(),
  address: z.string(),
  challenge: z.string(),
  lastMove: z.string().datetime(),
  createdAt: z.string().datetime(),
  signatureVerified: z.boolean().nullable(),
  worldcoinVerified: z.boolean().nullable(),
});

export type PlayersOutput = z.infer<typeof playersOutput>;
