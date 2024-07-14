import { env } from "../env";
import { createWalletClient, createPublicClient, http } from "viem";
import { mnemonicToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

export const operatorClient = createWalletClient({
  account: mnemonicToAccount(env.DB_OPERATOR_MNEMONIC),
  chain: sepolia,
  transport: http(
    "https://sepolia.infura.io/v3/3917ee57f64c45c4b36c95501fdc552a",
  ),
});

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(
    "https://sepolia.infura.io/v3/3917ee57f64c45c4b36c95501fdc552a",
  ),
});
