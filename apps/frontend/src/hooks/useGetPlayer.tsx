import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/apiClient";
import { playersOutput } from "@/schemas/playerSchemas";

export const useGetPlayer = (props: { id: string }) => {
  return useQuery({
    enabled: !!props.id,
    queryKey: ["useGetPlayer"],
    queryFn: async () => {
      if (!props.id) throw new Error("No player id");
      const player = await apiClient["/players/{id}"].get({
        params: { id: props.id },
      });
      const parsedPlayer = playersOutput.safeParse(player);
      if (!parsedPlayer.success) {
        console.error("Failed to parse useGetPlayer", {
          data: parsedPlayer,
          error: parsedPlayer.error,
        });
        throw new Error("Failed to parse useGetPlayer", parsedPlayer.error);
      }
      return parsedPlayer.data;
    },
  });
};
