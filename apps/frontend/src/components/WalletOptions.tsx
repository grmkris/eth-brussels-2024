import * as React from "react";
import { Connector, useConnect } from "wagmi";
import { usePlayPosition } from "../hooks/actions/usePlayPosition";

export function WalletOptions() {
  const transfer = usePlayPosition();
  return (
    <>
      <button
        className={
          "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        }
        onClick={() => {
          transfer.mutate({ position: "test" });
        }}
      >
        GET SIGNATURE AND TRANSFER NATIVE
      </button>
    </>
  );
}

function WalletOption({
  connector,
  onClick,
}: {
  connector: Connector;
  onClick: () => void;
}) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector]);

  return (
    <>
      <button disabled={!ready} onClick={onClick}>
        {connector.name}
      </button>
    </>
  );
}
