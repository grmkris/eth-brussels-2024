import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useSignMessage } from "wagmi";

export function ConnectWallet() {
  return <Profile />;
}

const Profile = () => {
  const signMessage = useSignMessage();

  return (
    <>
      <button
        onClick={() => signMessage.signMessage({ message: "Hello, world!" })}
      >
        Sign message
      </button>
      <DynamicWidget />;
    </>
  );
};
