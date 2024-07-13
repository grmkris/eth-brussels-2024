import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/apiClient";
import { gameOutput, gamesOutput } from "@/schemas/gameSchemas";

export const useGetGames = () => {
  return useQuery({
    queryKey: ["useGetGames"],
    queryFn: async () => {
      const games = await apiClient["/games"].get();
      const resultParsed = await games.json();
      const parsedGame = gamesOutput.safeParse(resultParsed);
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
