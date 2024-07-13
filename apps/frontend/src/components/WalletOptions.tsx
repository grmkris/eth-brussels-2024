import * as React from "react";
import { Connector, useConnect } from "wagmi";
import { usePlayPosition } from "../hooks/actions/usePlayPosition";

export function WalletOptions() {
  const { connectors, connect } = useConnect();
  const transfer = usePlayPosition();

  if (!connectors.length) return <div>No connectors available</div>;
  return (
    <>
      {connectors.map((connector) => (
        <WalletOption
          key={connector.uid}
          connector={connector}
          onClick={() => connect({ connector })}
        />
      ))}
      <button
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
