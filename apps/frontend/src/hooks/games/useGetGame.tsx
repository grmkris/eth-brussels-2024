import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/apiClient";
import { gameOutput, gamesOutput } from "@/schemas/gameSchemas";

export const useGetGame = (props: { id: string }) => {
  return useQuery({
    enabled: !!props.id,
    queryKey: ["useGetGame"],
    queryFn: async () => {
      if (!props.id) throw new Error("No game id");
      const game = await apiClient["/games/{id}"].get({
        params: { id: props.id },
      });
      const parsed = await game.json();
      const parsedGame = gameOutput.safeParse(parsed);
      if (!parsedGame.success) {
        console.error("Failed to parse useGetGame", {
          data: parsedGame,
          error: parsedGame.error,
        });
        throw new Error("Failed to parse useGetGame", parsedGame.error);
      }
      return parsedGame.data;
    },
  });
};
