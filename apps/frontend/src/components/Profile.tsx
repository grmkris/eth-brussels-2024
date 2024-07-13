import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useAccount } from "wagmi";
import WORLD from "./worlid";
import {
  useConnectPlayer,
  useConnectWorldCoinPlayer,
} from "@/hooks/player/useConnectPlayer";

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
