import { GamePlayerRepository } from "../../repositories/gamePlayerRepository";
import { MoveRepository } from "../../repositories/moveRepository";
import { checkWin } from "../../helpers/checkWinHelper";
import { GameRepository } from "../../repositories/gameRepository";
import { PlayerRepository } from "../../repositories/playerRepository";
import { SelectGame } from "../../db/gamesStorage.db";


export const movesService = (deps: {
    gameRepository: GameRepository;
    playerRepository: PlayerRepository;
    moveRepository: MoveRepository;
    gamePlayerRepository: GamePlayerRepository;
}) => {
    const createMove = async (props: {
        gameId: string;
        playerId: string;
        xCoordinate: number;
        yCoordinate: number;
    }) => {
        // Try to join player to game
        await deps.gamePlayerRepository.tryCreate({
            gameId: props.gameId,
            playerId: props.playerId,
        });

        // Create the move
        const createdMove = await deps.moveRepository.create({
            playerId: props.playerId,
            xCoordinate: props.xCoordinate,
            yCoordinate: props.yCoordinate,
        });

        // Update player's last move
        await deps.playerRepository.updateLastMove({
            id: props.playerId,
        });

        // Get all the player moves from the game
        const playerMoves = await deps.moveRepository.findManyByGameIdAndPlayerId({
            gameId: props.gameId,
            playerId: props.playerId,
        });

        let gameData: SelectGame;

        // Check for three in a row
        const playerHasWon = checkWin(playerMoves);
        if(playerHasWon) {
            gameData = await deps.gameRepository.update({
                id: props.gameId,
                updateData: {
                    winnerId: props.playerId,
                    status: "finished",
                },
            });
        } else {
            gameData = {
                id: props.gameId,
                status: "ongoing",
                winnerId: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        }

        return {
            ...createdMove,
            winnerId: gameData.winnerId,
            status: gameData.status,
        };
    };

    return {
        createMove,
    };
};

export type MovesService = ReturnType<typeof movesService>;