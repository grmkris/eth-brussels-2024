import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { PlayersResponse } from "./playersSchemas";
import { extractMiddleware } from "../../middlewares/middleware";

const collectionPath = "/players";
const detailPath = collectionPath + "/{id}";

const playerRoutes = new OpenAPIHono();

export const retrievePlayerRoute = createRoute({
  method: "get",
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

export const requestSignature = createRoute({
  method: "post",
  path: collectionPath,
  operationId: "requestSignature",
  summary: "Request signature",
  tags: ["Players"],
  description: "Request a signature for a player",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            senderAddress: z.string(),
            transferContractAddress: z.string(),
            positionString: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        "application/json": {
          schema: z.object({
            signature: z.string(),
          }),
        },
      },
      description: "Created player successfully.",
    },
  },
});

playerRoutes.openapi(retrievePlayerRoute, async (c) => {
  const { playersService } = extractMiddleware(c);
  const { id } = c.req.valid("param");

  const player = await playersService.retrievePlayer({
    id,
  });

  return c.json(player, 200);
});

playerRoutes.openapi(createPlayerRoute, async (c) => {
  const { playersService } = extractMiddleware(c);
  const { address } = c.req.valid("json");

  const player = await playersService.createPlayer({
    address,
  });

  return c.json(player, 201);
});

playerRoutes.openapi(requestSignature, async (c) => {
  const { playersService } = extractMiddleware(c);
  const { senderAddress, transferContractAddress, positionString } =
    c.req.valid("json");

  const signature = await playersService.requestSignature({
    senderAddress,
    transferContractAddress,
    positionString,
  });

  return c.json(signature, 201);
});

export default playerRoutes;
