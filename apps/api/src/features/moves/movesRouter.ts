import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { extractMiddleware } from "../../middlewares/middleware";
import { MovesResponse } from "./movesSchemas";

const collectionPath = "/games/{gameId}/players/{playerId}/moves";

const moveRoutes = new OpenAPIHono();

export const createMoveRoute = createRoute({
    method: "post",
    path: collectionPath,
    operationId: "createMove",
    summary: "Create move",
    tags: ["Moves"],
    description: "Create a move",
    request: {
        params: z.object({
            gameId: z.string(),
            playerId: z.string(),
        }),
        body: {
            content: {
                "application/json": {
                    schema: z.object({
                        xCoordinate: z.number(),
                        yCoordinate: z.number(),
                    }),
                },
            },
        },
    },
    responses: {
        201: {
            content: {
                "application/json": {
                    schema: MovesResponse,
                },
            },
            description: "Created move successfully.",
        },
    },
});

moveRoutes.openapi(createMoveRoute, async (c) => {
    const { movesService } = extractMiddleware(c);
    const { gameId, playerId } = c.req.valid("param");
    const { xCoordinate, yCoordinate } = c.req.valid("json");

    const move = await movesService.createMove({
        gameId,
        playerId,
        xCoordinate,
        yCoordinate,
    });

    return c.json(move, 201);
});

export default moveRoutes;
