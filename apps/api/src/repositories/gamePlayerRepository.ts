import { db } from "../db/db"
import { CreateGamePlayer, GamePlayers, SelectGamePlayer } from "../db/gamePlayersStorage.db";


export const gamePlayerRepository = (config: {
    db: db;
}) => {
    const { db } = config;

    const create = async (props:
        CreateGamePlayer
    ): Promise<SelectGamePlayer> => {
        const createdGamePlayer = await db
            .insert(GamePlayers)
            .values(props)
            .returning()
            .execute();

        if (createdGamePlayer.length < 1) {
            throw new Error("Failed to create game player");
        }

        return createdGamePlayer[0];
    };

    return {
        create,
    }
};

export type GamePlayerRepository = ReturnType<typeof gamePlayerRepository>;