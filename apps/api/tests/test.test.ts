import type { OpenAPIHono } from "@hono/zod-openapi";
import { beforeEach, describe, expect, it } from "bun:test";

import application from "../src/index";
import { GameResponse, GamesResponse } from "../src/features/games/gamesSchemas";
import { createPath } from "./helpers";
import { retrieveGameRoute } from "../src/features/games/gamesRouter";
import { connectPlayerRoute } from "../src/features/players/playersRouter";
import { createMoveRoute } from "../src/features/moves/movesRouter";
import { retrievePlayerByAddress } from "../src/features/players/playersRouter";
import { PlayersResponse } from "../src/features/players/playersSchemas";

describe("listGamesRoute", () => {
  let app: OpenAPIHono;

  beforeEach(() => {
    app = application.app;
  });

  it.skip("should create a player", async () => {
    const path = createPath(connectPlayerRoute.path, {})

    const res = await app.request(path, {
        method: "POST",
        body: JSON.stringify({
            address: "0x1234567890123456789012345678901234567890",
        }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    console.log(res.body);

    expect(res.status).toBe(201);
  });

  it.skip("should retrieve a player", async () => {
    const path = createPath(retrievePlayerByAddress.path, {
        address: "0x1234567890123456789012345678901234567890",
    });

    const res = await app.request(path, {
        method: "GET",
        headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    console.log(res.body);

    expect(res.status).toBe(200);
    
    const responseBody = (await res.json()) as PlayersResponse;

    console.log(responseBody);
  });

  it.only("should create a move", async () => {
    const path = createPath(createMoveRoute.path, {
        gameId: "ac16c992-e5ff-4472-98d4-77bfc5b8a42d",
        playerId: "cdb2c9ab-7bbe-478c-9575-92d55f2ee604",
    });

    const res = await app.request(path, {
        method: "POST",
        body: JSON.stringify({
            xCoordinate: 1,
            yCoordinate: 3,
        }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    console.log(res.body);
    expect(res.status).toBe(201);
  });

  it.skip("should retrieve a game", async () => {
    const path = createPath(retrieveGameRoute.path, {
        id: "da06b8e4-fe96-47b4-b6ba-89b8dcb0f85d",
    });

    const res = await app.request(path, {
        method: "GET",
    });    

    console.log(res);

    expect(res.status).toBe(200);
    const responseBody = (await res.json()) as GameResponse;

    console.log(responseBody.map[5][4]);
  });

  it.skip("should return a list of games", async () => {
    const res = await app.request("/games", {
        method: "GET",
    })

    expect(res.status).toBe(200);
    const responseBody = (await res.json()) as GamesResponse[];

    console.log(responseBody);
  });

  it.skip("should create a game", async () => {
    const res = await app.request("/games", {
        method: "POST",
    })

    expect(res.status).toBe(201);
    const responseBody = (await res.json()) as GamesResponse;

    console.log(responseBody);
  })
});