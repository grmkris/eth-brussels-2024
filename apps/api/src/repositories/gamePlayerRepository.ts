import { db } from "../db/db"
import { CreateGamePlayer, GamePlayers, SelectGamePlayer } from "../db/gamePlayersStorage.db";


export const gamePlayerRepository = (config: {
    db: db;
}) => {
    const { db } = config;

    const tryCreate = async (props:
        CreateGamePlayer
    ): Promise<SelectGamePlayer> => {
        const createdGamePlayer = await db
            .insert(GamePlayers)
            .values(props)
            .onConflictDoNothing()
            .returning()
            .execute();

        return createdGamePlayer[0];
    };

    return {
        tryCreate,
    }
};

export type GamePlayerRepository = ReturnType<typeof gamePlayerRepository>;