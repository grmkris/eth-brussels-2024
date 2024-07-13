import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/apiClient";

export const useCreateMove = (props?: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: {
      gameId: string;
      playerId: string;
      xCoordinate: number;
      yCoordinate: number;
    }) => {
      const result = await apiClient[
        "/games/{gameId}/players/{playerId}/moves"
      ].post({
        params: { gameId: variables.gameId, playerId: variables.playerId },
        json: {
          xCoordinate: variables.xCoordinate,
          yCoordinate: variables.yCoordinate,
        },
      });
      await queryClient.invalidateQueries();
      const resultParsed = await result.json();
      return resultParsed;
    },
    onError: (error) => {
      console.error("Error creating move", error);
      props?.onError?.();
    },
    onSuccess: () => {
      props?.onSuccess?.();
    },
  });
};
