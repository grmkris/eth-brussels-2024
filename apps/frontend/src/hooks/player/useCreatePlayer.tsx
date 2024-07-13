import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/apiClient";
import { useSignMessage } from "wagmi";

export const useCreatePlayer = (props?: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const queryClient = useQueryClient();
  const signMessage = useSignMessage();
  return useMutation({
    mutationFn: async (variables: { address: string }) => {
      if (!variables.address) throw new Error("No player address");
      const result = await apiClient["/players"].post({
        json: { address: variables.address.toLowerCase() },
      });

      const parsed = await result.json();

      const challenge = await signMessage.signMessageAsync({
        message: parsed.challenge,
      });

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
