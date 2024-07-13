import { and, eq } from "drizzle-orm";
import { db } from "../db/db";
import { CreateMove, Moves, SelectMove, SelectMovesWithAddress } from "../db/movesStorage.db";
import { Players } from "../db/playersStorage.db";

export const moveRepository = (config: {
    db: db;
}) => {
    const { db } = config;

    const findManyByGameIdAndPlayerId = async (props: {
        gameId: string;
        playerId: string;
    }): Promise<SelectMove[]> => {
        const moves = await db
            .select({
                id: Moves.id,
                gameId: Moves.gameId,
                playerId: Moves.playerId,
                xCoordinate: Moves.xCoordinate,
                yCoordinate: Moves.yCoordinate,
                createdAt: Moves.createdAt,
            })
            .from(Moves)
            .where(and(
                eq(Moves.playerId, props.playerId),
                eq(Moves.gameId, props.gameId),
            ))
            .execute();

        return moves;
    };

    const findManyByGameId = async (props: {
        gameId: string;
    }): Promise<SelectMovesWithAddress[]> => {
        const moves = await db
            .select({
                id: Moves.id,
                gameId: Moves.gameId,
                playerId: Moves.playerId,
                xCoordinate: Moves.xCoordinate,
                yCoordinate: Moves.yCoordinate,
                createdAt: Moves.createdAt,
                playerAddress: Players.address,
            })
            .from(Moves)
            .innerJoin(
                Players,
                eq(Moves.playerId, Players.id),
            )
            .where(eq(Moves.gameId, props.gameId))
            .execute();

        return moves;
    };

    const create = async (props:
        CreateMove
    ): Promise<SelectMove> => {
        const createdMove = await db
            .insert(Moves)
            .values(props)
            .returning()
            .execute();

        if (createdMove.length < 1) {
            throw new Error("Failed to create move");
        }

        return createdMove[0];
    };

    return {
        findManyByGameIdAndPlayerId,
        findManyByGameId,
        create,
    }
}

export type MoveRepository = ReturnType<typeof moveRepository>;