import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/apiClient";
import { useSignMessage } from "wagmi";

export const useConnectPlayer = (props?: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const queryClient = useQueryClient();
  const signMessage = useSignMessage();
  return useMutation({
    mutationFn: async (variables: { address: string }) => {
      if (!variables.address) throw new Error("No player address");
      const result = await apiClient["/players/connect"].post({
        json: { address: variables.address.toLowerCase() },
      });

      const parsed = await result.json();

      const challenge = await signMessage.signMessageAsync({
        message: parsed.challenge,
      });

      const response = await apiClient["/players/verify-signature"].post({
        json: {
          address: variables.address.toLowerCase(),
          signature: challenge,
        },
      });

      const parsedResponse = await response.json();
      console.log("parsed response from verify-signature", parsedResponse);

      // store token in local-stroage
      localStorage.setItem("token", parsedResponse.token);
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

export const useConnectWorldCoinPlayer = (props?: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: { worldCoinSignature: unknown }) => {
      const result = await apiClient["/players/verify-worldcoin"].post({
        // @ts-ignore
        json: { worldCoinSignature: variables.worldCoinSignature },
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const response = await result.json();
      console.log("response from connect", response);
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
