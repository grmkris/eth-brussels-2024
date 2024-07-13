import { db } from "../db/db";
import { eq } from "drizzle-orm";
import { CreateGame, Games, SelectGame, UpdateGame } from "../db/gamesStorage.db";

export const gameRepository = (config: {
    db: db;
}) => {
    const { db } = config;

    const findOneById = async (props: {
        id: string;
    }): Promise<SelectGame | undefined> => {
        const game = await db.query.Games.findFirst({
            where: eq(Games.id, props.id),
        });

        return game;
    };

    const findMany = async (): Promise<SelectGame[]> => {
        const games = await db.query.Games.findMany();

        return games;
    }

    const create = async (props: 
        CreateGame
    ): Promise<SelectGame> => {
        const createdGame = await db
            .insert(Games)
            .values(props)
            .returning()
            .execute();

        if (createdGame.length < 1) {
            throw new Error("Failed to create game");   
        }

        return createdGame[0];
    };

    const update = async (props: {
        id: string;
        updateData: UpdateGame
    }): Promise<SelectGame> => {
        const updatedGame = await db
            .update(Games)
            .set({...props.updateData, updatedAt: new Date()})
            .where(eq(Games.id, props.id))
            .returning()
            .execute();

        if (updatedGame.length < 1) {
            throw new Error("Failed to update game");
        }

        return updatedGame[0];
    };

    return {
        findOneById,
        findMany,
        create,
        update,
    }
};

export type GameRepository = ReturnType<typeof gameRepository>;