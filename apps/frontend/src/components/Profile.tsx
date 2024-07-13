import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useAccount } from "wagmi";
import WORLD from "./worlid";
import {
  useConnectPlayer,
  useConnectWorldCoinPlayer,
} from "@/hooks/player/useConnectPlayer";
import { useGetPlayer } from "@/hooks/player/useGetPlayer";

export function ConnectWallet() {
  return <Profile />;
}

const Profile = () => {
  return (
    <div>
      <SignInWithWallet />
      <TestWorldCoin />
      <WORLD />
      <DynamicWidget />
      <PlayerInfo />
    </div>
  );
};

export const SignInWithWallet = () => {
  const connectPlayer = useConnectPlayer();
  const account = useAccount();

  if (!account) {
    return <>Wallet not detected</>;
  }

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={() =>
        connectPlayer.mutate({ address: account.address as string })
      }
    >
      Connect Wallet
    </button>
  );
};

export const TestWorldCoin = () => {
  const connectWorldCoin = useConnectWorldCoinPlayer();
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={() => connectWorldCoin.mutate()}
    >
      TEST Connect World Coin
    </button>
  );
};

export const PlayerInfo = () => {
  const playerInfo = useGetPlayer();
  if (playerInfo.isLoading) {
    return <div>Loading...</div>;
  }
  if (playerInfo.isError) {
    return <div>Error</div>;
  }
  return (
    <div className="p-4 rounded-xl w-40">
      PlayerInfo:<pre>{JSON.stringify(playerInfo.data)}</pre>
    </div>
  );
};
