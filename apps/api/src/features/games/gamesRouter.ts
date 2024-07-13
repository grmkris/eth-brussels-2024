import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { extractMiddleware } from "../../middlewares/middleware";
import { GameResponse, GamesResponse } from "./gamesSchemas";

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
        })
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: GameResponse,
                },
            },
            description: "Retrieved game successfully.",
        },
    },
});

export const listGamesRoute = createRoute({
    method: "get",
    path: collectionPath,
    operationId: "listGames",
    summary: "List games",
    tags: ["Games"],
    description: "List all games",
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: z.array(GamesResponse),
                },
            },
            description: "Listed games successfully.",
        },
    },
});

export const createGameRoute = createRoute({
    method: "post",
    path: collectionPath,
    operationId: "createGame",
    summary: "Create game",
    tags: ["Games"],
    description: "Create a game",
    responses: {
        201: {
            content: {
                "application/json": {
                    schema: GamesResponse,
                }
            },
            description: "Created game successfully.",
        },
    },
});

gameRoutes.openapi(retrieveGameRoute, async (c) => {
    const { gamesService } = extractMiddleware(c);
    const { id } = c.req.valid("param");

    const game = await gamesService.retrieveGame({id});

    return c.json(game, 200);
});

gameRoutes.openapi(listGamesRoute, async (c) => {
    const { gamesService } = extractMiddleware(c);

    const games = await gamesService.listGames();

    return c.json(games, 200);
});

gameRoutes.openapi(createGameRoute, async (c) => {
    const { gamesService } = extractMiddleware(c);

    const createdGame = await gamesService.createGame();

    return c.json(createdGame, 201);
});

export default gameRoutes;