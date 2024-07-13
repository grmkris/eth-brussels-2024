import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { createConfig, http, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { sepolia } from "wagmi/chains";
import { ZeroDevSmartWalletConnectors } from "@dynamic-labs/ethereum-aa";

const wagmiConfig = createConfig({
  chains: [sepolia],
  multiInjectedProviderDiscovery: false,
  transports: {
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function Dynamic(props: { children: React.ReactNode }) {
  return (
    <DynamicContextProvider
      settings={{
        // Find your environment id at https://app.dynamic.xyz/dashboard/developer
        environmentId: "dc1513f0-e447-4240-b99b-683a1bf86f62",
        walletConnectors: [
          ZeroDevSmartWalletConnectors,
          EthereumWalletConnectors,
        ],
      }}
    >
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>{props.children}</DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}
