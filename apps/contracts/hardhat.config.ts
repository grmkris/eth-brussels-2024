import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-ignition-viem";
import "@nomicfoundation/hardhat-viem";
import { createWalletClient, formatEther, http } from "viem";
import { ENV } from "./env";
import { deriveKeyFromMnemonicAndPath } from "hardhat/internal/util/keys-derivation";
import { mnemonicToAccount } from "viem/accounts";
import env from "hardhat";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        details: {
          yulDetails: {
            optimizerSteps: "u",
          },
        },
      },
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: ENV.SEPOLIA_URL,
        blockNumber: 6297895,
      },
    },
    sepolia: {
      url: ENV.SEPOLIA_URL,
      accounts: {
        mnemonic: ENV.DEPLOYER_MNEMONIC,
      },
    },
    sepolia: {
      url: ENV.SEPOLIA_URL,
      accounts: {
        mnemonic: ENV.DEPLOYER_MNEMONIC,
      },
    },
  },
};

export default config;

task(
  "accounts",
  "Prints the list of accounts and their balances",
  async (_, hre) => {
    const accounts = await hre.viem.getWalletClients();
    const deployerClient = await hre.viem.getPublicClient();

    for (const account of accounts) {
      const balance = await deployerClient.getBalance({
        address: account.account.address,
      });
      console.log(`${account.account.address}: ${formatEther(balance)} ETH`);
    }

    const operator = mnemonicToAccount(ENV.OPERATOR_MNEMONIC);

    const operatorClient = createWalletClient({
      account: operator,
      transport: http(
        deployerClient.chain.rpcUrls.default.http as unknown as string,
      ),
    });

    const feeRecipient = mnemonicToAccount(ENV.FEE_MNEMONIC);
    const feeOperator = createWalletClient({
      account: feeRecipient,
      transport: http(
        deployerClient.chain.rpcUrls.default.http as unknown as string,
      ),
    });

    const operatorBalance = await deployerClient.getBalance({
      address: operator.address,
    });

    console.log(
      `Operator ${operator.address}: ${formatEther(operatorBalance)} ETH`,
    );
    const feeRecipientBalance = await deployerClient.getBalance({
      address: feeRecipient.address,
    });

    console.log(
      `Fee recipient ${feeRecipient.address}: ${formatEther(
        feeRecipientBalance,
      )} ETH`,
    );
  },
);
