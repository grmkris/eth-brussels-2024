import { createMiddleware } from "hono/factory";
import { gameRepository } from "../repositories/gameRepository";
import { db } from "../db/db";
import { playerRepository } from "../repositories/playerRepository";
import { moveRepository } from "../repositories/moveRepository";
import { gamePlayerRepository } from "../repositories/gamePlayerRepository";
import { PlayersService, playersService } from "../features/players/playersService";
import { GamesService, gamesService } from "../features/games/gamesService";
import { MovesService, movesService } from "../features/moves/movesService";
import { Context } from "hono";

export const requestMiddleware = createMiddleware(async (c, next) => {
    const playerRepositoryInstance = playerRepository({
        db: db,
    });
    const gameRepositoryInstance = gameRepository({
        db: db,
    });
    const moveRepositoryInstance = moveRepository({
        db: db,
    });
    const gamePlayerRepositoryInstance = gamePlayerRepository({
        db: db,
    });

    c.set(
        "playersService",
        playersService({
            playerRepository: playerRepositoryInstance,
        }),
    );
    c.set(
        "gamesService",
        gamesService({
            gameRepository: gameRepositoryInstance,
            moveRepository: moveRepositoryInstance,
        }),
    );
    c.set(
        "movesService",
        movesService({
            gamePlayerRepository: gamePlayerRepositoryInstance,
            moveRepository: moveRepositoryInstance,
            gameRepository: gameRepositoryInstance,
            playerRepository: playerRepositoryInstance,
        })
    );

    await next();
});

export const extractMiddleware = (c: Context) => {
    const playersService = c.get("playersService") as PlayersService;
    const gamesService = c.get("gamesService") as GamesService;
    const movesService = c.get("movesService") as MovesService;

    return {
        playersService,
        gamesService,
        movesService,
    };
};