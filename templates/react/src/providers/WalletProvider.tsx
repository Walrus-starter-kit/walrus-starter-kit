import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider as SuiWalletProvider,
} from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { loadEnv } from '../utils/env.js';

const env = loadEnv();

const validatedNetwork =
  env.suiNetwork === 'mainnet' || env.suiNetwork === 'testnet'
    ? env.suiNetwork
    : 'testnet';

const { networkConfig } = createNetworkConfig({
  [validatedNetwork]: {
    url: env.suiRpc || getFullnodeUrl(validatedNetwork),
  },
});

const walletQueryClient = new QueryClient();

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={walletQueryClient}>
      <SuiClientProvider
        networks={networkConfig}
        defaultNetwork={validatedNetwork}
      >
        <SuiWalletProvider>{children}</SuiWalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
