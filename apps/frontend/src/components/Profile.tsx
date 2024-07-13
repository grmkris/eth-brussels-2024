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
      <WorldID player={playerInfo.data} />
    </div>
  );
};

export const SignInWithWallet = (props: { player?: PlayersOutput }) => {
  const connectPlayer = useConnectPlayer();
  const account = useAccount();
  if (!account.address) {
    return <div className="text-red-400 text-center">Wallet not detected</div>;
  }

  return (
    <>
      {!props.player?.signatureVerified && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md h-10"
          onClick={() =>
            connectPlayer.mutate({ address: account.address as string })
          }
        >
          Verify: {account.address}
        </button>
      )}
    </>
  );
};
