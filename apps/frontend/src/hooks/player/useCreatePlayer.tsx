import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/apiClient";

export const useCreatePlayer = (props?: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: { address: string }) => {
      if (!variables.address) throw new Error("No player address");
      const result = await apiClient["/players"].post({
        json: { address: variables.address.toLowerCase() },
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
