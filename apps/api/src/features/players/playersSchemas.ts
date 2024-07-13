import { z } from "@hono/zod-openapi";

export const PlayersResponse = z.object({
    id: z.string(),
    address: z.string(),
    challenge: z.string(),
    signatureVerified: z.boolean().nullable(),
    worldcoinVerified: z.boolean().nullable(),
    lastMove: z.string().date(),
    createdAt: z.string().date(),
});

export type PlayersResponse = z.infer<typeof PlayersResponse>;