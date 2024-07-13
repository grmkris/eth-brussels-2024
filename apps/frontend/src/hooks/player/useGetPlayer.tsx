import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/apiClient";
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
      return await player.json();
    },
  });
};
