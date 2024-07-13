import { PlayerRepository } from "../../repositories/playerRepository";
import { HTTPException } from "hono/http-exception";
import { Address, Signature, verifyMessage } from "viem";
import { sign, verify } from "hono/jwt";

export const playersService = (deps: {
  playerRepository: PlayerRepository;
}) => {
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

  const verifyAndCreateJWTFromSignature = async (props: {
    signature: Signature;
    address: Address;
  }) => {
    const player = await deps.playerRepository.findByAddress({
      address: props.address,
    });

    if (!player) throw new Error("Player not found");

    const payload = {
      address: props.address,
      message: player.challenge,
      signature: props.signature,
    };
    const valid = await verifyMessage(payload);
    //generate JWT
    const secret = "mySecretKey";
    const token = await sign(payload, secret);

    const updatedPlayer = await deps.playerRepository.update({
      address: props.address,
      signatureVerified: valid,
      worldcoinVerified: player.worldcoinVerified ?? false,
    });
    return {
      player: updatedPlayer,
      token: token,
    };
  };

  const verifyWorldIdPlayer = async (props: {
    jwt: string;
    worldcoinSignature: any; // TODO @dani
  }) => {
    const decodedPayload = await verify(props.jwt, "mySecret");
    const address = decodedPayload.address;
    console.log(decodedPayload);
    // TODO verify worldcoin and update player by their address
  };

  return {
    retrievePlayer,
    createPlayer,
    verifyAndCreateJWTFromSignature,
    verifyWorldIdPlayer,
  };
};

export type PlayersService = ReturnType<typeof playersService>;
