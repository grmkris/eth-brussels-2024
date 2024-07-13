import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useAccount } from "wagmi";
import { WorldID } from "./worlid";
import { useConnectPlayer } from "@/hooks/player/useConnectPlayer";
import { useGetPlayer } from "@/hooks/player/useGetPlayer";
import { PlayersOutput } from "@/schemas/playerSchemas";

export function ConnectWallet() {
  return <Profile />;
}

const Profile = () => {
  const playerInfo = useGetPlayer();
  return (
    <div className="flex flex-col gap-4">
      <DynamicWidget />
      <SignInWithWallet player={playerInfo.data} />
      <WorldID />
      <PlayerInfo />
    </div>
  );
};

export const SignInWithWallet = (props: { player?: PlayersOutput }) => {
  const connectPlayer = useConnectPlayer();
  const account = useAccount();

  if (!account.address) {
    return <>Wallet not detected</>;
  }

  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={() =>
        connectPlayer.mutate({ address: account.address as string })
      }
    >
      Hello {account.address}, verify
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
