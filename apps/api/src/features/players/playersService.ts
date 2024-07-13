import { PlayerRepository } from "../../repositories/playerRepository";
import { HTTPException } from "hono/http-exception";
import { Address, Signature, verifyMessage } from "viem";
import { decode, sign, verify } from "hono/jwt";
import { handler } from "./verify";
import { AnyColumn } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";

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

  const verifyWorldProofFromSignature = async (props: { signature: Signature; address: Address; req: any }) => {
    const player = await deps.playerRepository.findByAddress({ address: props.address });

    if (player) {
      const res: Partial<NextApiResponse> = {
        status: (code: number) => {
          res.statusCode = code;
          return res;
        },
        json: (data: any) => {
          res.data = data;
          return res;
        },
        statusCode: 200,
        data: null,
      };

      await new Promise<void>((resolve, reject) => {
        handler(props.req, res as NextApiResponse)
          .then(resolve)
          .catch(reject);
      });

      if (res.statusCode == 200) {
        deps.playerRepository.update({
          address: props.address,
          signatureVerified: player.signatureVerified ?? false,
          worldcoinVerified: true,
        });
      }
      return res;
    }
  };

  return {
    retrievePlayer,
    createPlayer,
    verifyAndCreateJWTFromSignature,
    verifyWorldProofFromSignature,
  };
};

export type PlayersService = ReturnType<typeof playersService>;
