import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/apiClient";
import { gameOutput, gamesOutput } from "@/schemas/gameSchemas";

export const useGetGames = () => {
  return useQuery({
    // enabled: !!props.id,
    queryKey: ["useGetGames"],
    queryFn: async () => {
      // if (!props.id) throw new Error("No player id");
      const games = await apiClient["/games"].get();
      // console.log("_______", games);
      const parsedGame = gamesOutput.safeParse(games);
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
