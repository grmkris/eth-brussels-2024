import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const collectionPath = "/verify";
const detailPath = collectionPath + "/{id}";

const playerRoutes = new OpenAPIHono();

export const retrievePlayerRoute = createRoute({
  method: "POST",
  path: detailPath,
  operationId: "retrievePlayer",
  summary: "Retrieve player",
  tags: ["Players"],
  description: "Retrieve a player by ID",
  request: {
    params: z.object({
      id: z.string(),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: PlayersResponse,
        },
      },
      description: "Retrieved player successfully.",
    },
  },
});

export const createPlayerRoute = createRoute({
  method: "post",
  path: collectionPath,
  operationId: "createPlayer",
  summary: "Create player",
  tags: ["Players"],
  description: "Create a player",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            address: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: PlayersResponse,
        },
      },
      description: "Created player successfully.",
    },
  },
});

playerRoutes.openapi(retrievePlayerRoute, async c => {
  const { playersService } = extractMiddleware(c);
  const { id } = c.req.valid("param");

  const player = await playersService.retrievePlayer({
    id,
  });

  return c.json(player, 200);
});

playerRoutes.openapi(createPlayerRoute, async c => {
  const { playersService } = extractMiddleware(c);
  const { address } = c.req.valid("json");

  const player = await playersService.createPlayer({
    address,
  });

  return c.json(player, 201);
});

export default playerRoutes;
