import type { OpenAPIHono } from "@hono/zod-openapi";
import { afterAll, beforeEach, describe, expect, it } from "bun:test";

import application from "../src/index";
import { GameResponse, GamesResponse } from "../src/features/games/gamesSchemas";
import { createPath } from "./helpers";
import { retrieveGameRoute } from "../src/features/games/gamesRouter";
import { connectPlayerRoute } from "../src/features/players/playersRouter";
import { createMoveRoute } from "../src/features/moves/movesRouter";

describe("listGamesRoute", () => {
  let app: OpenAPIHono;

  beforeEach(() => {
    app = application.app;
  });

  it("should create a player", async () => {
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

  it.only("should create a move", async () => {
    const path = createPath(createMoveRoute.path, {
        gameId: "b23c2b7f-73a3-41d6-824d-f6e5a917990d",
        playerId: "8c7fe8ee-1e03-4614-98e3-c4f6c7ee7efd",
    });

    const res = await app.request(path, {
        method: "POST",
        body: JSON.stringify({
            xCoordinate: 1,
            yCoordinate: 1,
        }),
        headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    console.log(res.body);
    expect(res.status).toBe(201);
  });

  it("should retrieve a game", async () => {
    const path = createPath(retrieveGameRoute.path, {
        id: "ec9b4731-47a5-4dbf-9a44-5ed45a43063a",
    }) + "?xCoordinate=0&yCoordinate=0&size=100";

    const res = await app.request(path, {
        method: "GET",
    });    

    console.log(res);

    expect(res.status).toBe(200);
    const responseBody = (await res.json()) as GameResponse;

    console.log(responseBody);
  });

  it("should return a list of games", async () => {
    const res = await app.request("/games", {
        method: "GET",
    })

    expect(res.status).toBe(200);
    const responseBody = (await res.json()) as GamesResponse[];

    console.log(responseBody);
  });

  it("should create a game", async () => {
    const res = await app.request("/games", {
        method: "POST",
    })

    expect(res.status).toBe(201);
    const responseBody = (await res.json()) as GamesResponse;

    console.log(responseBody);
  })
});