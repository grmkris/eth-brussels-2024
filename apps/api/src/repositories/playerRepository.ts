import { db } from "../db/db";
import { GamePlayers } from "../db/gamePlayersStorage.db";
import { CreatePlayer, Players, SelectPlayer } from "../db/playersStorage.db";
import { eq } from "drizzle-orm";
import { getAddress } from "viem";

export const playerRepository = (config: { db: db }) => {
  const { db } = config;

  const findOneById = async (props: {
    id: string;
  }): Promise<SelectPlayer | undefined> => {
    const player = await db.query.Players.findFirst({
      where: eq(Players.id, props.id),
    });

    return player;
  };

  const findManyByGameId = async (props: {
    gameId: string;
  }): Promise<SelectPlayer[]> => {
    return await db
      .select({
        id: Players.id,
        address: Players.address,
        challenge: Players.challenge,
        signatureVerified: Players.signatureVerified,
        worldcoinVerified: Players.worldcoinVerified,
        lastMove: Players.lastMove,
        createdAt: Players.createdAt,
      })
      .from(Players)
      .innerJoin(GamePlayers, eq(GamePlayers.playerId, Players.id))
      .where(eq(GamePlayers.gameId, props.gameId))
      .execute();
  };

  const create = async (props: CreatePlayer): Promise<SelectPlayer> => {
    const createdPlayer = await db
      .insert(Players)
      .values({ ...props, address: getAddress(props.address) })
      .returning()
      .execute();

    if (createdPlayer.length < 1) {
      throw new Error("Failed to create player");
    }

    return createdPlayer[0];
  };

  const findByAddress = async (props: {
    address: string;
  }): Promise<SelectPlayer | undefined> => {
    return await db.query.Players.findFirst({
      where: eq(Players.address, getAddress(props.address)),
    });
  };

  const update = async (props: {
    address: string;
    signatureVerified?: boolean;
    worldcoinVerified?: boolean;
    challenge?: string;
  }) => {
    const updatedPlayer = await db
      .update(Players)
      .set({ ...props, address: getAddress(props.address) })
      .where(eq(Players.address, getAddress(props.address)))
      .returning()
      .execute();

    if (!updatedPlayer) {
      throw new Error("Failed to update player");
    }
    return updatedPlayer[0];
  };

  const updateLastMove = async (props: {
    id: string;
  }): Promise<SelectPlayer> => {
    const updatedPlayer = await db
      .update(Players)
      .set({ lastMove: new Date() })
      .where(eq(Players.id, props.id))
      .returning()
      .execute();

    if (!updatedPlayer) {
      throw new Error("Failed to update player last move");
    }
    return updatedPlayer[0];
  };

  return {
    findOneById,
    findManyByGameId,
    create,
    findByAddress,
    update,
    updateLastMove,
  };
};

export type PlayerRepository = ReturnType<typeof playerRepository>;
