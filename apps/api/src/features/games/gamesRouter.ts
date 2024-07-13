import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { extractMiddleware } from "../../middlewares/middleware";

const collectionPath = "/games";
const detailPath = collectionPath + "/{id}";

const gameRoutes = new OpenAPIHono();

export const retrieveGameRoute = createRoute({
    method: "get",
    path: detailPath,
    operationId: "retrieveGame",
    summary: "Retrieve game",
    tags: ["Games"],
    description: "Retrieve a game by ID",
    request: {
        params: z.object({
            id: z.string(),
        }),
    },
})