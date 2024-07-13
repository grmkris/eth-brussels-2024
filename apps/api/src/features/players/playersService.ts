import { PlayerRepository } from "../../repositories/playerRepository";
import { HTTPException } from "hono/http-exception";
import { Address, Signature, verifyMessage } from "viem";

export const playersService = (deps: { playerRepository: PlayerRepository }) => {
  const retrievePlayer = async (props: { id: string }) => {
    const player = await deps.playerRepository.findOneById({
      id: props.id,
    });

    if (!player) {
      throw new HTTPException(404, {
        message: "Player not found",
      });
    }

    return player;
  };

  const createPlayer = async (props: { address: string }) => {
    const createdPlayer = await deps.playerRepository.create({
      address: props.address,
      challenge: crypto.randomUUID(),
      signatureVerified: false,
      worldcoinVerified: false,
    });

    return createdPlayer;
  };

  const verifyAndCreateJWTFromSignature = async (props: { signature: Signature; address: Address }) => {
    const player = await deps.playerRepository.findByAddress({ address: props.address });

    if (player) {
      const valid = verifyMessage({
        address: props.address,
        message: player.challenge,
        signature: props.signature,
      });
      //generate JWT
      return valid;
    }
  };

  return {
    retrievePlayer,
    createPlayer,
  };
};

export type PlayersService = ReturnType<typeof playersService>;
