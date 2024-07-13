import { GamePlayerRepository } from "../../repositories/gamePlayerRepository";
import { MoveRepository } from "../../repositories/moveRepository";


export const movesService = (deps: {
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

        const createdMove = await deps.moveRepository.create({
            playerId: props.playerId,
            xCoordinate: props.xCoordinate,
            yCoordinate: props.yCoordinate,
        })

        // Over here you will need to check if move is the winning one

        return createdMove;
    };

    return {
        createMove,
    };
};

export type MovesService = ReturnType<typeof movesService>;