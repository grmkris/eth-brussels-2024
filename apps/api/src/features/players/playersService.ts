import { PlayerRepository } from "../../repositories/playerRepository";
import { HTTPException } from "hono/http-exception";
import { operatorClient, publicClient } from "../../utils/viemConfig";
import {
  Address,
  encodePacked,
  keccak256,
  parseEther,
  zeroAddress,
} from "viem";
import { env } from "../../env";
import { mnemonicToAccount } from "viem/accounts";

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
    });

    return createdPlayer;
  };

  const requestSignature = async (props: {
    senderAddress: string;
    transferContractAddress: string;
  }) => {
    // deadline is 100 blocks from now
    const deadline =
      (await publicClient.getBlock()).timestamp + BigInt(10000000);
    const id = keccak256(encodePacked(["string"], [crypto.randomUUID()]) );
    const recipientAmount = parseEther("0.001");
    const feeAmount = parseEther("0.0001");
    const chainId = BigInt(publicClient.chain.id);
    const refundDestination = mnemonicToAccount(
      env.DB_OPERATOR_MNEMONIC
    ).address;

    const intentHash = keccak256(
      // backend
      encodePacked(
        [
          "uint256",
          "uint256",
          "address",
          "address",
          "address",
          "uint256",
          "address",
          "address",
          "uint256",
          "address",
          "address",
        ],
        [
          recipientAmount,
          deadline,
          mnemonicToAccount(env.DB_OPERATOR_MNEMONIC).address, // Recipient
          zeroAddress,
          refundDestination,
          feeAmount,
          id,
          mnemonicToAccount(env.DB_OPERATOR_MNEMONIC).address,
          chainId,
          props.senderAddress as Address,
          props.transferContractAddress as Address,
        ]
      )
    );

    const signature = await operatorClient.signMessage({
      message: {
        raw: intentHash,
      },
      account: operatorClient.account,
    });

    return { signature, id, deadline };
  };

  return {
    retrievePlayer,
    createPlayer,
    requestSignature,
  };
};

export type PlayersService = ReturnType<typeof playersService>;
