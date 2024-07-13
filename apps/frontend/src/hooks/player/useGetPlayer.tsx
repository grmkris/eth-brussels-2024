import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/apiClient";
import { playersOutput } from "@/schemas/playerSchemas";
import { useAccount } from "wagmi";

export const useGetPlayer = () => {
  const account = useAccount();
  return useQuery({
    enabled: !!account.address,
    queryKey: ["useGetPlayer"],
    queryFn: async () => {
      if (!account.address) throw new Error("No player id");
      const player = await apiClient["/players/{address}"].get({
        params: { address: account.address },
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
