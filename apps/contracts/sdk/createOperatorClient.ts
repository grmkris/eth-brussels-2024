import {
  Address,
  Chain,
  createPublicClient,
  encodePacked,
  http,
  keccak256,
  PublicClient,
  WalletClient,
} from "viem";
import { TransferAbi } from "./transfer.abi";
import { AbiParametersToPrimitiveTypes, ExtractAbiFunction } from "abitype";

type PaymentIntentFn = ExtractAbiFunction<typeof TransferAbi, "transferToken">;
type AbiParameters = PaymentIntentFn["inputs"];
export type TransferIntent = AbiParametersToPrimitiveTypes<
  AbiParameters,
  "inputs"
>[0];

const getNextPaymentId = (props: {
  transferContract: Address;
  publicClient: PublicClient;
  operatorAccount: Address;
  senderAccount: Address;
  recipient: Address;
  nonce: bigint;
}) => {
  return props.publicClient.readContract({
    address: props.transferContract,
    abi: TransferAbi,
    functionName: "generateIntentId",
    args: [
      props.operatorAccount,
      props.senderAccount,
      props.recipient,
      props.nonce,
    ],
  });
};

export const createOperatorClient = (props: {
  transferContract: Address;
  operatorWallet: WalletClient;
  feeAmount: bigint;
}) => {
  return {
    getNextPaymentSignature: async (params: {
      recipientAmount: bigint;
      chain: Chain;
      refundDestination: Address;
      token: Address;
      recipient: Address;
      sender: Address;
      deadline: bigint;
    }) => {
      if (!props.operatorWallet.account?.address)
        throw new Error("Operator account address is required");
      const publicClient = createPublicClient({
        chain: params.chain,
        transport: http(),
      });
      const paymentId = await getNextPaymentId({
        transferContract: props.transferContract,
        publicClient: publicClient,
        operatorAccount: props.operatorWallet.account.address,
        senderAccount: params.sender,
        recipient: params.recipient,
        nonce: BigInt(0),
      });
      const intentHash = keccak256(
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
            params.recipientAmount,
            params.deadline,
            params.recipient,
            params.token,
            params.refundDestination,
            props.feeAmount,
            paymentId,
            props.operatorWallet.account.address,
            BigInt(params.chain.id),
            params.sender,
            props.transferContract,
          ],
        ),
      );
      // sign the intent hash as the operator
      const signature = await props.operatorWallet.signMessage({
        // backend
        message: {
          raw: intentHash,
        },
        account: props.operatorWallet.account,
      });

      return {
        id: paymentId,
        signature: signature,
      };
    },
    registerOperator: async (params: {
      chain: Chain;
      operator: Address;
    }) => {
      if (!props.operatorWallet.account?.address)
        throw new Error("Operator account address is required");
      const publicClient = createPublicClient({
        chain: params.chain,
        transport: http(),
      });
      const simulate = await publicClient.simulateContract({
        chain: params.chain,
        account: props.operatorWallet.account,
        address: props.transferContract,
        abi: TransferAbi,
        functionName: "registerOperator",
        args: [],
      });
      return await props.operatorWallet.writeContract({
        account: props.operatorWallet.account,
        chain: params.chain,
        address: props.transferContract,
        abi: TransferAbi,
        functionName: "registerOperator",
        args: [],
      });
    },
  };
};
