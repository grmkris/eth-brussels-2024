import { env } from "../env";
import {
  createWalletClient,
  createPublicClient,
  http,
} from "viem";
import { mnemonicToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

export const operatorClient = createWalletClient({
  account: mnemonicToAccount(env.DB_OPERATOR_MNEMONIC),
  chain: sepolia,
  transport: http(),
});

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});
