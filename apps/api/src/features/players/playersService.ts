import { PlayerRepository } from "../../repositories/playerRepository";
import { HTTPException } from "hono/http-exception";
import { Address, getAddress, Signature, verifyMessage } from "viem";
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

  const getPlayerByAddress = async (props: { address: string }) => {
    const player = await deps.playerRepository.findByAddress({
      address: getAddress(props.address),
    });

    if (!player) {
      throw new HTTPException(404, {
        message: "Player not found",
      });
    }

    return player;
  };

  const getOrCreatePlayerByAddress = async (props: { address: string }) => {
    const player = await deps.playerRepository.findByAddress({
      address: getAddress(props.address),
    });
    if (player) {
      // if signature is verified, create new challenge and update player with new challenge
      if (player.signatureVerified) {
        return await deps.playerRepository.update({
          address: props.address,
          challenge: crypto.randomUUID(),
        });
      }
    }
    return await deps.playerRepository.create({
      address: props.address,
      challenge: crypto.randomUUID(),
      signatureVerified: false,
      worldcoinVerified: false,
    });
  };

  const verifyAndCreateJWTFromSignature = async (props: {
    signature: Signature;
    address: Address;
  }) => {
    const player = await deps.playerRepository.findByAddress({
      address: getAddress(props.address),
    });

    if (!player) throw new Error("Player not found");

    const payload = {
      address: getAddress(props.address),
      message: player.challenge,
      signature: props.signature,
    };
    const valid = await verifyMessage(payload);
    console.log("valid", valid);
    if (!valid) throw new Error("Invalid signature");
    //generate JWT
    const secret = "mySecretKey";
    const token = await sign(payload, secret);

    const updatedPlayer = await deps.playerRepository.update({
      address: getAddress(props.address),
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
    worldcoinSignature: any; // TODO @daniel
  }) => {
    const decodedPayload = await verify(props.jwt, "mySecretKey");
    const address = decodedPayload.address;
    console.log(decodedPayload);
    // TODO verify worldcoin and update player by their address TODO @daniel
  };

  return {
    retrievePlayer,
    getOrCreatePlayerByAddress,
    verifyAndCreateJWTFromSignature,
    verifyWorldIdPlayer,
    getPlayerByAddress,
  };
};

export type PlayersService = ReturnType<typeof playersService>;
