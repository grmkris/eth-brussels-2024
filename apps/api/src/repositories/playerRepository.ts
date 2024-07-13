import { db } from "../db/db";
import { GamePlayers } from "../db/gamePlayersStorage.db";
import { CreatePlayer, Players, SelectPlayer } from "../db/playersStorage.db";
import { eq } from "drizzle-orm";

export const playerRepository = (config: { db: db }) => {
  const { db } = config;

  const findOneById = async (props: { id: string }): Promise<SelectPlayer | undefined> => {
    const player = await db.query.Players.findFirst({
      where: eq(Players.id, props.id),
    });

    return player;
  };

  const findManyByGameId = async (props: { gameId: string }): Promise<SelectPlayer[]> => {
    const players = await db
      .select({
        id: Players.id,
        address: Players.address,
        lastMove: Players.lastMove,
        createdAt: Players.createdAt,
      })
      .from(Players)
      .innerJoin(GamePlayers, eq(GamePlayers.playerId, Players.id))
      .where(eq(GamePlayers.gameId, props.gameId))
      .execute();

    return players;
  };

  const create = async (props: CreatePlayer): Promise<SelectPlayer> => {
    const createdPlayer = await db.insert(Players).values(props).returning().execute();

    if (createdPlayer.length < 1) {
      throw new Error("Failed to create player");
    }

    return createdPlayer[0];
  };

  const findByAddress = async (props: { address: string }): Promise<SelectPlayer | undefined> => {
    const player = await db.query.Players.findFirst({
      where: eq(Players.address, props.address),
    });

    return player;
  };
  return {
    findOneById,
    findManyByGameId,
    create,
    findByAddress,
  };
};

export type PlayerRepository = ReturnType<typeof playerRepository>;
