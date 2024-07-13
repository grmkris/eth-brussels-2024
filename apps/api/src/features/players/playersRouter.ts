import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { PlayersResponse } from "./playersSchemas";
import { extractMiddleware } from "../../middlewares/middleware";
import { Address, Signature } from "viem";

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

export const verifyPlayerSignatureRoute = createRoute({
  method: "post",
  path: collectionPath,
  operationId: "verifyPlayerSignature",
  summary: "Verify player",
  tags: ["Players"],
  description: "Verify player signature",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            address: z.string(),
            signature: z.string(),
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
            token: z.string(),
            player: PlayersResponse,
          }),
        },
      },
      description: "Verified player successfully.",
    },
  },
});

export const verifyWorldIdPlayerRoute = createRoute({
  method: "post",
  path: collectionPath,
  operationId: "verifyWorldIdPlayer",
  summary: "Verify WORLDID player",
  tags: ["Players"],
  description: "Verify worldID player signature",
  request: {
    headers: z.object({
      // Header keys must be in lowercase, `Authorization` is not allowed.
      authorization: z.string().openapi({
        example: "Bearer SECRET",
      }),
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            worldCoinSignature: z.any(), // TODO @daniel
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
            ok: z.boolean(),
          }),
        },
      },
      description: "Verified player successfully.",
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

playerRoutes.openapi(verifyPlayerSignatureRoute, async (c) => {
  const { playersService } = extractMiddleware(c);
  const { address, signature } = c.req.valid("json");

  const data = await playersService.verifyAndCreateJWTFromSignature({
    address: address as Address,
    signature: signature as unknown as Signature,
  });

  return c.json(data, 201);
});

playerRoutes.openapi(verifyWorldIdPlayerRoute, async (c) => {
  const { playersService } = extractMiddleware(c);
  const { worldCoinSignature } = c.req.valid("json");
  const { authorization } = c.req.valid("header");

  const data = await playersService.verifyWorldIdPlayer({
    jwt: authorization,
    worldcoinSignature: worldCoinSignature,
  });

  return c.json(
    {
      ok: true,
    },
    201,
  );
});

export default playerRoutes;
