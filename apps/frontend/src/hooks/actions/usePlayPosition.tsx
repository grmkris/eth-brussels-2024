import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/apiClient";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import { TransferAbi } from "../../abi/transfer.abi";
import {
  Address,
  encodePacked,
  keccak256,
  parseEther,
  zeroAddress,
} from "viem";

const TRANSFER_CONTRACT_ADDRESS = "0xb0CAC7DAF0D76569913e670D942dB4359E6E4E61"; // sepolia
const OPERATOR_CONTRACT_ADDRESS = "0x29739a454FDe98454690427e960518b15029599C"; // sepolia

export const usePlayPosition = (props?: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const queryClient = useQueryClient();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const account = useAccount();
  const chain = useChainId();

  return useMutation({
    mutationFn: async (variables: { position: string }) => {
      if (!account.address) throw new Error("No account address");
      if (!variables.position) throw new Error("No position description");
      if (!walletClient) throw new Error("No wallet client");

      const result = await apiClient["/players/payment-signature"].post({
        json: {
          senderAddress: account.address.toLocaleLowerCase(),
          transferContractAddress:
            TRANSFER_CONTRACT_ADDRESS.toLocaleLowerCase(),
        },
      });

      console.log("Result", result);
      const { id, signature, deadline } = await result.json();

      console.log("Variables", variables, {
        id,
        signature,
        deadline,
      });
      const prefix = keccak256(encodePacked(["string"], [variables.position]));

      console.log("Partameters", {
        id,
        signature,
        deadline,
        prefix,
      });
      const { request } = await publicClient.simulateContract({
        account: account.address,
        address: TRANSFER_CONTRACT_ADDRESS.toLocaleLowerCase() as Address,
        abi: TransferAbi,
        functionName: "transferTokenPreApproved",
        args: [
          {
            id: id as Address,
            deadline: BigInt(deadline),
            signature: signature as Address,
            refundDestination:
              OPERATOR_CONTRACT_ADDRESS.toLocaleLowerCase() as Address,
            recipientCurrency: zeroAddress,
            prefix,
            recipientAmount: parseEther("0.001"),
            feeAmount: parseEther("0.0001"),
            operator: OPERATOR_CONTRACT_ADDRESS.toLocaleLowerCase() as Address,
            recipient: OPERATOR_CONTRACT_ADDRESS.toLocaleLowerCase() as Address,
          },
        ],
      });

      const txHash = await walletClient.writeContract({
        // https://1.x.wagmi.sh/react/hooks/useContractWrite
        ...request,
        account: walletClient.account,
      });

      await publicClient.waitForTransactionReceipt({ hash: txHash });

      console.log("Transaction completed", txHash);
      await queryClient.invalidateQueries();
      return result;
    },
    onError: (error) => {
      console.error("Error creating player", error);
      props?.onError?.();
    },
    onSuccess: () => {
      props?.onSuccess?.();
    },
  });
};
