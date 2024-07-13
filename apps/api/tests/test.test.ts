import type { OpenAPIHono } from "@hono/zod-openapi";
import { afterAll, beforeEach, describe, expect, it } from "bun:test";

import application from "../src/index";
import { GameResponse, GamesResponse } from "../src/features/games/gamesSchemas";
import { createPath } from "./helpers";
import { retrieveGameRoute } from "../src/features/games/gamesRouter";

describe("listGamesRoute", () => {
  let app: OpenAPIHono;

  beforeEach(() => {
    app = application.app;
  });

  it.only("should retrieve a game", async () => {
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