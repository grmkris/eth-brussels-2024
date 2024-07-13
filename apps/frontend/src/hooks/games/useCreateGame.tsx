import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/apiClient";

export const useCreateGame = (props?: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const result = await apiClient["/games"].post();
      await queryClient.invalidateQueries();
      const resultParsed = await result.json();
      return resultParsed;
    },
    onError: (error) => {
      console.error("Error creating game", error);
      props?.onError?.();
    },
    onSuccess: () => {
      props?.onSuccess?.();
    },
  });
};
