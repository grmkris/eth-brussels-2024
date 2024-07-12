import hre from "hardhat";

import { expect } from "chai";
import TransfersModule from "../ignition/modules/TransfersModule";
import { mnemonicToAccount } from "viem/accounts";
import { ENV } from "../env";

const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3";
const UNISWAP_ROUTER_ADDRESS = "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD";
const WRAPPED_NATIVE_CURRENCY_ADDRESS =
  "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889";

const FEE_DESTINATION = mnemonicToAccount(ENV.FEE_MNEMONIC).address;
const OPERATOR = mnemonicToAccount(ENV.OPERATOR_MNEMONIC).address;

describe("Transfers", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployTransfersFixture() {
    const [owner, otherAccount] = await hre.viem.getWalletClients();
    console.log("Deploying TransfersModule");
    const { transfers } = await hre.ignition.deploy(TransfersModule, {
      parameters: {
        TransfersModule: {
          uniswapUniversalRouter: UNISWAP_ROUTER_ADDRESS,
          permit2Address: PERMIT2_ADDRESS,
          initialOperator: OPERATOR,
          initialFeeDestination: FEE_DESTINATION,
          wrappedNativeCurrency: WRAPPED_NATIVE_CURRENCY_ADDRESS,
        },
      },
    });

    console.log("Deployed TransfersModule at", transfers.address);

    return { owner, otherAccount, transfers };
  }

  describe("Deployment", function () {
    it("Correctly deploy", async function () {
      const { transfers, owner, otherAccount } = await deployTransfersFixture();

      expect((await transfers.read.owner()).toLowerCase()).to.equal(
        owner.account.address.toLowerCase(),
      );

      console.log("owner", owner.account.address);
      console.log("transfers", transfers.address);

      const a = await hre.viem.getPublicClient();

      await transferTokenPreApproved({
        chain: a.chain,
        token: WRAPPED_NATIVE_CURRENCY_ADDRESS, // TODO deploy test token
        transferContract: transfers.address,
      });
    });

    it.skip("Should register operator", async function () {
      const { transfers, owner, otherAccount } = await deployTransfersFixture();

      const tx = await transfers.write.registerOperatorWithFeeDestination([
        owner.account.address,
      ]);

      console.log("registerOperatorWithFeeDestination tx", tx);
      expect(tx).to.exist;
    });
  });
});

import {
  Address,
  Chain,
  createPublicClient,
  createWalletClient,
  encodePacked,
  http,
  keccak256,
} from "viem";
import { Erc20Abi, TransferAbi } from "../sdk/transfer.abi";

export const transferTokenPreApproved = async (props: {
  chain: Chain;
  token: Address;
  transferContract: Address;
}) => {
  const publicClient = createPublicClient({
    chain: props.chain,
    transport: http(),
  });
  const operatorWallet = createWalletClient({
    account: mnemonicToAccount(ENV.OPERATOR_MNEMONIC),
    chain: props.chain,
    transport: http(),
  });
  const senderWallet = createWalletClient({
    account: mnemonicToAccount(ENV.SENDER_MNEMONIC),
    chain: props.chain,
    transport: http(),
  });

  // USDC -> USDC
  // mumbai testnet
  // deadline is 100 blocks from now
  const deadline = (await publicClient.getBlock()).timestamp + BigInt(10000000); // backend
  const id = "0x20010db8000000000000000000000012"; // backend
  const recipientAmount = BigInt(100000); // backend
  const feeAmount = BigInt(20); // backend
  const chainId = BigInt(props.chain.id); // take this from user's connected wallet
  const refundDestination = mnemonicToAccount(ENV.SENDER_MNEMONIC).address; // backend
  const prefix = "0x";
  const totalAmount = recipientAmount + feeAmount;
  // check allowance and approve if necessary
  const allowance = await publicClient.readContract({
    // useContractRead
    account: mnemonicToAccount(ENV.SENDER_MNEMONIC),
    address: props.token,
    abi: Erc20Abi,
    functionName: "allowance",
    args: [
      mnemonicToAccount(ENV.SENDER_MNEMONIC).address,
      props.transferContract,
    ],
  });
  if (allowance < totalAmount) {
    console.log(
      `Approving transfer contract to spend ${totalAmount} USDC tokens`,
    );
    // sender approve the transfer contract to spend their USDC tokens
    const { request: approveRequest } = await publicClient.simulateContract({
      // useContractWrite
      chain: props.chain,
      account: mnemonicToAccount(ENV.SENDER_MNEMONIC),
      address: props.token,
      abi: Erc20Abi,
      functionName: "approve",
      args: [props.transferContract, recipientAmount + feeAmount],
    });
    const approveResult = await senderWallet.writeContract({
      ...approveRequest,
      account: senderWallet.account,
      chain: props.chain,
    });

    await publicClient.waitForTransactionReceipt({ hash: approveResult });
    console.log(`approve result, ${approveResult}`);
  }

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
        mnemonicToAccount(ENV.SENDER_MNEMONIC).address, // TODO maybe this is wrong it should be "RECIPIENT"
        props.token,
        refundDestination,
        feeAmount,
        id,
        mnemonicToAccount(ENV.OPERATOR_MNEMONIC).address,
        chainId,
        mnemonicToAccount(ENV.SENDER_MNEMONIC).address,
        props.transferContract,
      ],
    ),
  );

  console.log(`intentHash, ${intentHash}`);
  console.log(`operator: ${mnemonicToAccount(ENV.OPERATOR_MNEMONIC).address}`);
  console.log(`sender: ${mnemonicToAccount(ENV.SENDER_MNEMONIC).address}`);
  // sign the intent hash as the operator
  const signature = await operatorWallet.signMessage({
    // backend
    message: {
      raw: intentHash,
    },
    account: operatorWallet.account,
  });

  console.log(`signature, ${signature}`);

  const { request } = await publicClient.simulateContract({
    chain: props.chain,
    account: mnemonicToAccount(ENV.SENDER_MNEMONIC),
    address: props.transferContract,
    abi: TransferAbi,
    functionName: "transferTokenPreApproved",
    args: [
      {
        id: id,
        deadline: deadline,
        signature: signature,
        refundDestination: refundDestination,
        recipientCurrency: props.token,
        prefix: prefix,
        recipientAmount: recipientAmount,
        feeAmount: feeAmount,
        operator: mnemonicToAccount(ENV.OPERATOR_MNEMONIC).address,
        recipient: mnemonicToAccount(ENV.SENDER_MNEMONIC).address, // TODO maybe this is wrong it should be "RECIPIENT"
      },
    ],
  });

  const result = await senderWallet.writeContract({
    // https://1.x.wagmi.sh/react/hooks/useContractWrite
    ...request,
    account: senderWallet.account,
  });

  // const result = await senderWallet.writeContract({
  //   ...request,
  //   account: sender_account,
  // });

  console.log(`transferTokenPreApproved result, ${result}`);
  return result;
};
