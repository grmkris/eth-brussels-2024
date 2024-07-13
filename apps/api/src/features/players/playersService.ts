import { PlayerRepository } from "../../repositories/playerRepository";
import { HTTPException } from "hono/http-exception";
import {
  Address,
  bytesToHex,
  encodePacked,
  getAddress,
  keccak256,
  parseEther,
  Signature,
  verifyMessage,
} from "viem";
import { sign, verify } from "hono/jwt";
import { operatorClient, publicClient } from "../../helpers/viemConfig";
import { mnemonicToAccount } from "viem/accounts";
import { env } from "../../env";

export type VerifyReply = {
  code: string;
  detail: string;
};

const verifyEndpoint = `${process.env.NEXT_PUBLIC_WLD_API_BASE_URL}/api/v1/verify/${process.env.NEXT_PUBLIC_WLD_APP_ID}`;

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
      console.log("player exists");
      // if signature is verified, create new challenge and update player with new challenge
      if (player.signatureVerified) {
        console.log("player exists with sig verified");
        const updatedPlayer = await deps.playerRepository.update({
          address: props.address,
          challenge: crypto.randomUUID(),
        });
        console.log(updatedPlayer);
        return updatedPlayer;
      }
      console.log("player exists with no sig verified");
      return player;
    }
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
    console.log("decodedPayload", decodedPayload);
    const address = decodedPayload.address;
    const player = await deps.playerRepository.findByAddress({
      address: getAddress(address as string),
    });
    if (!player) throw new Error("Player not found");
    console.log(decodedPayload);

    const reqBody = props.worldcoinSignature;
    console.log("Sending request to World ID /verify endpoint:\n", reqBody);
    const verified = await fetch(verifyEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });
    console.log("World ID response:\n", verified);
    const parsed = (await verified.json()) as VerifyReply;
    console.log("Parsed response:\n", parsed);
    // TODO verify worldcoin and update player by their address TODO @daniel
    await deps.playerRepository.update({
      address: player.address,
      signatureVerified: player.signatureVerified ?? false,
      worldcoinVerified: true,
    });
  };

  const requestPaymentSignature = async (props: {
    senderAddress: string;
    transferContractAddress: string;
  }) => {
    // deadline is 100 blocks from now
    const deadline =
      (await publicClient.getBlock()).timestamp + BigInt(10000000);
    // Generate 16 random bytes
    const randomBytes = crypto.getRandomValues(new Uint8Array(16));

    // Convert to hexadecimal string (optional)
    const randomHexValue = bytesToHex(randomBytes);

    const id = randomHexValue;
    const recipientAmount = parseEther("2");
    const feeAmount = parseEther("0.2");
    const chainId = BigInt(publicClient.chain.id);
    const refundDestination = mnemonicToAccount(
      env.DB_OPERATOR_MNEMONIC,
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
          "bytes16",
          "address",
          "uint256",
          "address",
          "address",
        ],
        [
          recipientAmount,
          deadline,
          mnemonicToAccount(env.DB_OPERATOR_MNEMONIC).address, // Recipient
          "0x193C77Ad6191b935D8AcbB4fE2f7f4345545acd5",
          refundDestination,
          feeAmount,
          id,
          mnemonicToAccount(env.DB_OPERATOR_MNEMONIC).address,
          chainId,
          props.senderAddress as Address,
          props.transferContractAddress as Address,
        ],
      ),
    );

    const signature = await operatorClient.signMessage({
      message: {
        raw: intentHash,
      },
      account: operatorClient.account,
    });

    return { signature, id, deadline: deadline.toString() };
  };

  return {
    retrievePlayer,
    getOrCreatePlayerByAddress,
    verifyAndCreateJWTFromSignature,
    verifyWorldIdPlayer,
    getPlayerByAddress,
    requestPaymentSignature,
  };
};

export type PlayersService = ReturnType<typeof playersService>;
