import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/apiClient";
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWalletClient,
  useWriteContract,
} from "wagmi";
import { Erc20Abi, TransferAbi } from "@/abi/transfer.abi";
import { Address, encodePacked, keccak256, parseEther } from "viem";
import { sepolia } from "viem/chains";

const TRANSFER_CONTRACT_ADDRESS = "0xb90d5c07BF97883821767c31aFc9dd4adfc0BF0C"; // sepolia
const OPERATOR_CONTRACT_ADDRESS = "0x29739a454FDe98454690427e960518b15029599C"; // sepolia
const NOUNS_ERC20_TOKEN = "0x34182d56d905a195524a8F1813180C134687ca34";

export const usePlayPosition = (props?: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const queryClient = useQueryClient();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const account = useAccount();
  const allowance = useReadContract({
    account: account.address,
    abi: Erc20Abi,
    functionName: "allowance",
    address: NOUNS_ERC20_TOKEN,
    args: [account.address as Address, TRANSFER_CONTRACT_ADDRESS as Address],
  });

  const increaseAllowance = useWriteContract();

  return useMutation({
    mutationFn: async (variables: { position: string }) => {
      if (!account.address) throw new Error("No account address");
      if (!variables.position) throw new Error("No position description");
      if (!walletClient) throw new Error("No wallet client");
      if (!publicClient) throw new Error("No public client");
      console.log("Allowance", allowance.data);
      console.log({
        msg: "Allowance",
        allowance: allowance.data,
        required: parseEther("3"),
        compared: BigInt(allowance.data) < parseEther("3"),
      });
      if (BigInt(allowance.data) < parseEther("3")) {
        const txHash0 = await increaseAllowance.writeContractAsync({
          account: account.address,
          abi: Erc20Abi,
          functionName: "approve",
          address: NOUNS_ERC20_TOKEN,
          args: [
            TRANSFER_CONTRACT_ADDRESS.toLocaleLowerCase() as Address,
            parseEther("10"),
          ],
        });
        await publicClient.waitForTransactionReceipt({
          hash: txHash0,
          confirmations: 1,
        });
        console.log("Allowance increased", txHash0); // TODO ADD notification here that points to blockexplorer sponsor
      }

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
        account: account.address.toLocaleLowerCase(),
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
            recipientCurrency: NOUNS_ERC20_TOKEN,
            prefix: "0x",
            recipientAmount: parseEther("2"),
            feeAmount: parseEther("0.2"),
            operator: OPERATOR_CONTRACT_ADDRESS.toLocaleLowerCase() as Address,
            recipient: OPERATOR_CONTRACT_ADDRESS.toLocaleLowerCase() as Address,
          },
        ],
      });

      // check allowance for the token

      const res = await publicClient.simulateContract({
        chain: sepolia,
        account: account.address,
        address: TRANSFER_CONTRACT_ADDRESS.toLocaleLowerCase() as Address,
        abi: TransferAbi,
        functionName: "transferTokenPreApproved",
        args: [
          {
            id: id as Address,
            deadline: BigInt(deadline),
            signature: signature as Address,
            refundDestination: account.address.toLocaleLowerCase() as Address,
            recipientCurrency: NOUNS_ERC20_TOKEN,
            prefix: "0x",
            recipientAmount: parseEther("2"),
            feeAmount: parseEther("0.2"),
            operator: OPERATOR_CONTRACT_ADDRESS.toLocaleLowerCase() as Address,
            recipient: "0x4006c2d3123FD2e243742d8aBEE8B7667c5a2C3A",
          },
        ],
      });

      console.log("RESULT: ", res.result);

      const txHash = await walletClient.writeContract({
        // https://1.x.wagmi.sh/react/hooks/useContractWrite
        ...res.request,
        account: walletClient.account,
      });

      await publicClient.waitForTransactionReceipt({ hash: txHash });

      console.log("Transaction completed", txHash);
      await queryClient.invalidateQueries();
      return result;
    },
    onError: (error) => {
      console.error("Error creating player", error, error.message);
      props?.onError?.();
    },
    onSuccess: () => {
      props?.onSuccess?.();
    },
  });
};
