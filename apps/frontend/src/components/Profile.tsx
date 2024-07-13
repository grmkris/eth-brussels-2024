import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useSignMessage } from "wagmi";

export function ConnectWallet() {
  return <Profile />;
}

const Profile = () => {
  const signMessage = useSignMessage();

  return (
    <div className="fixed z-10 rounded-xlpt-4 p-4 w-fit">
      <button
        onClick={() => signMessage.signMessage({ message: "Hello, world!" })}
      >
        Sign message
      </button>
      <DynamicWidget />
    </div>
  );
};
