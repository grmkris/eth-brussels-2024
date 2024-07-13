import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/apiClient";
import { gameOutput } from "@/schemas/gameSchemas";

export const useGetGames = (props: { id: string }) => {
  return useQuery({
    enabled: !!props.id,
    queryKey: ["useGetGames"],
    queryFn: async () => {
      if (!props.id) throw new Error("No player id");
      const player = await apiClient["/games"].get();
      const parsedGame = gameOutput.safeParse(player);
      if (!parsedGame.success) {
        console.error("Failed to parse useGetGames", {
          data: parsedGame,
          error: parsedGame.error,
        });
        throw new Error("Failed to parse useGetGames", parsedGame.error);
      }
      return parsedGame.data;
    },
  });
};
