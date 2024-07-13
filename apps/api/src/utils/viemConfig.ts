import { env } from "../env";
import {
  createWalletClient,
  createPublicClient,
  http,
} from "viem";
import { mnemonicToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

const WRAPPED_NATIVE_CURRENCY_ADDRESS =
  "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889";

export const operatorClient = createWalletClient({
  account: mnemonicToAccount(env.DB_OPERATOR_MNEMONIC),
  chain: sepolia,
  transport: http(),
});

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});
