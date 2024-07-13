import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-ignition-viem";
import "@nomicfoundation/hardhat-viem";
import { formatEther } from "viem";
import { ENV } from "./env";
import { mnemonicToAccount } from "viem/accounts";
import { Erc20Abi } from "./sdk/transfer.abi";

const NOUNS_ERC20_TOKEN = "0x34182d56d905a195524a8F1813180C134687ca34"

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
  ignition: {
    requiredConfirmations: 6,
  },
  networks: {
    hardhat: {
      forking: {
        url: ENV.SEPOLIA_URL,
        blockNumber: 6302184,
      },
    },
    sepolia: {
      url: ENV.SEPOLIA_URL,
      accounts: {
        mnemonic: ENV.DEPLOYER_MNEMONIC,
      },
    },
  },
  mocha: {
    timeout: 1000000,
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
      const balanceof = await deployerClient.readContract({
        address: NOUNS_ERC20_TOKEN,
        abi: Erc20Abi,
        functionName: "balanceOf",
        args: [account.account.address],
      })

      console.log(`${account.account.address}: ${formatEther(balance)} ETH, ${formatEther(balanceof)} NOUNS`);
    }

    const operator = mnemonicToAccount(ENV.OPERATOR_MNEMONIC);

    const feeRecipient = mnemonicToAccount(ENV.FEE_MNEMONIC);

    const senderRecipient = mnemonicToAccount(ENV.SENDER_MNEMONIC);

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

    const senderRecipientBalance = await deployerClient.getBalance({
      address: senderRecipient.address,
    });

    console.log(
      `Sender recipient ${senderRecipient.address}: ${formatEther(
        senderRecipientBalance,
      )} ETH`,
    );
  },
);
