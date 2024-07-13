import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { PlayersResponse } from "./playersSchemas";
import { extractMiddleware } from "../../middlewares/middleware";
import { Address, Signature } from "viem";

const collectionPath = "/players";

const playerRoutes = new OpenAPIHono();

export const retrievePlayerByAddress = createRoute({
  method: "get",
  path: collectionPath + "/{address}",
  operationId: "retrievePlayerByAddress",
  summary: "Retrieve player",
  tags: ["Players"],
  description: "Retrieve a player by address",
  request: {
    params: z.object({
      address: z.string(),
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

export const connectPlayerRoute = createRoute({
  method: "post",
  path: collectionPath + "/connect",
  operationId: "connectPlayer",
  summary: "Connect player",
  tags: ["Players"],
  description: "Connect player",
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
  path: collectionPath + "/verify-signature",
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

export const requestPaymentSignature = createRoute({
  method: "post",
  path: `${collectionPath}/payment-signature`,
  operationId: "requestPaymentSignature",
  summary: "Request payment signature",
  tags: ["Players"],
  description: "Request a signature for a player playing",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            senderAddress: z.string(),
            transferContractAddress: z.string(),
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
            id: z.string(),
            signature: z.string(),
            deadline: z.string(),
          }),
        },
      },
      description: "Requested payment signature successfully.",
    },
  },
});
            
export const verifyWorldIdPlayerRoute = createRoute({
  method: "post",
  path: collectionPath + "/verify-worldcoin",
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
            worldCoinSignature: z.unknown(), // TODO @daniel
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

playerRoutes.openapi(retrievePlayerByAddress, async (c) => {
  const { playersService } = extractMiddleware(c);
  const { address } = c.req.valid("param");

  const player = await playersService.getPlayerByAddress({
    address,
  });

  return c.json(player, 200);
});

playerRoutes.openapi(connectPlayerRoute, async (c) => {
  const { playersService } = extractMiddleware(c);
  const { address } = c.req.valid("json");

  const player = await playersService.getOrCreatePlayerByAddress({
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
    jwt: authorization.split(" ")[1],
    worldcoinSignature: worldCoinSignature,
  });

  return c.json(
    {
      ok: true,
    },
    201,
  );
});

playerRoutes.openapi(requestPaymentSignature, async (c) => {
  const { playersService } = extractMiddleware(c);
  const { senderAddress, transferContractAddress } = c.req.valid("json");

  const data = await playersService.requestPaymentSignature({
    senderAddress,
    transferContractAddress,
  });

  return c.json(data, 201);
});

export default playerRoutes;
