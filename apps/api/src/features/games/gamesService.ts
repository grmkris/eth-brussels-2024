import { GameRepository } from "../../repositories/gameRepository"
import { MoveRepository } from "../../repositories/moveRepository";
import { applyMoves, create2DArray } from "../../helpers/mappingHelper";
import { HTTPException } from "hono/http-exception";


export const gamesService = (deps: {
    gameRepository: GameRepository;
    moveRepository: MoveRepository;
}) => {
    const retrieveGame = async (props: {
        id: string;
        xCoordinate: number;
        yCoordinate: number;
        size: number;
    }) => {
        // Get the game
        const game = await deps.gameRepository.findOneById({
            id: props.id,
        });

        if (!game) {
            throw new HTTPException(404, {
                message: 'Game not found',
            });
        }

        // Get all moves that belong to the game
        const moves = await deps.moveRepository.findManyByGameId({
            gameId: props.id,
        });

        // Create a 2D array
        let board = create2DArray(props.size, props.size);

        // Apply moves to the board
        applyMoves(board, moves);

        return {
            ...game,
            map: board,
        }
    };

    const listGames = async () => {
        const games = await deps.gameRepository.findMany();

        return games;
    };

    const createGame = async () => {
        const createdGame = await deps.gameRepository.create({
            status: "ongoing",
            winnerId: null,
        });

        return createdGame;
    };

    return {
        retrieveGame,
        listGames,
        createGame,
    };
};

export type GamesService = ReturnType<typeof gamesService>;