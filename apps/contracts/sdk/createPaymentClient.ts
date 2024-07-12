import {
  Address,
  Chain,
  createPublicClient,
  erc20Abi,
  http,
  WalletClient,
} from "viem";
import { waitForTransactionReceipt } from "viem/actions";
import { TransferAbi } from "./transfer.abi";
import { TransferIntent } from "./createOperatorClient";

const OPERATOR_APIR_URLS = {
  local: "http://localhost:3000",
  remote: "https://operator.viem.io",
};

export const createPaymentClient = (props: {
  env: "local" | "remote";
  transferContract: Address;
  senderWallet: WalletClient;
}) => {
  return {
    /**
     * Create a payment intent by calling the Operator API to get the next payment id along with the signature by the operator
     * @param params
     */
    getSignedPaymentIntent: async (params: {
      chain: Chain;
      invoiceId: string;
    }) => {
      const response = await fetch(`${OPERATOR_APIR_URLS[props.env]}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chain: params.chain,
          invoiceId: params.invoiceId,
        }),
      });
      const data = await response.json();
      return data;
    },
    transferTokenPreApproved: async (params: {
      chain: Chain;
      intent: TransferIntent;
    }) => {
      if (!props.senderWallet.account?.address)
        throw new Error("Sender account address is required");
      const publicClient = createPublicClient({
        chain: params.chain,
        transport: http(),
      });
      // check allowance
      const allowance = await publicClient.readContract({
        address: params.intent.recipientCurrency,
        abi: erc20Abi,
        functionName: "allowance",
        args: [props.senderWallet.account.address, props.transferContract],
      });

      if (allowance < params.intent.recipientAmount + params.intent.feeAmount) {
        // increase allowance
        const simulate = await publicClient.simulateContract({
          chain: params.chain,
          account: props.senderWallet.account,
          address: params.intent.recipientCurrency,
          abi: erc20Abi,
          functionName: "approve",
          args: [
            props.transferContract,
            params.intent.recipientAmount + params.intent.feeAmount,
          ],
        });

        const tx = await props.senderWallet.writeContract({
          account: props.senderWallet.account,
          chain: params.chain,
          address: params.intent.recipientCurrency,
          abi: erc20Abi,
          functionName: "approve",
          args: [
            props.transferContract,
            params.intent.recipientAmount + params.intent.feeAmount,
          ],
        });
        console.log(
          `Approving transfer contract to spend ${
            params.intent.recipientAmount + params.intent.feeAmount
          } tokens`,
        );
        await waitForTransactionReceipt(publicClient, { hash: tx });
      }

      const simulate = await publicClient.simulateContract({
        chain: params.chain,
        account: props.senderWallet.account,
        address: props.transferContract,
        abi: TransferAbi,
        functionName: "transferTokenPreApproved",
        args: [params.intent],
      });
      const tx = await props.senderWallet.writeContract({
        account: props.senderWallet.account,
        chain: params.chain,
        address: props.transferContract,
        abi: TransferAbi,
        functionName: "transferTokenPreApproved",
        args: [params.intent],
      });
      console.log(
        `Transferring ${params.intent.recipientAmount} tokens to ${params.intent.recipient}`,
      );
      await waitForTransactionReceipt(publicClient, { hash: tx });
      return tx;
    },
  };
};
