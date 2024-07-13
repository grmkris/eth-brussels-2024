import { PlayerRepository } from "../../repositories/playerRepository";
import { HTTPException } from "hono/http-exception";
import { Address, Signature, verifyMessage } from "viem";
import { decode, sign, verify } from "hono/jwt";

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
      const payload = {
        address: props.address,
        message: player.challenge,
        signature: props.signature,
      };
      const valid = await verifyMessage(payload);
      //generate JWT
      const secret = "mySecretKey";
      const token = await sign(payload, secret);

      deps.playerRepository.update({
        address: props.address,
        signatureVerified: valid,
        worldcoinVerified: player.worldcoinVerified ?? false,
      });
      return token;
    }
  };

  return {
    retrievePlayer,
    createPlayer,
    verifyAndCreateJWTFromSignature,
  };
};

export type PlayersService = ReturnType<typeof playersService>;
