import { walrus, WalrusClient } from '@mysten/walrus';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { loadEnv } from '../../utils/env.js';

// Types
export type WalrusNetwork = 'testnet' | 'mainnet';

export interface MystenWalrusConfig {
  network: WalrusNetwork;
  publisherUrl?: string;
  aggregatorUrl?: string;
  suiRpcUrl?: string;
}

type WalrusExtendedClient = SuiClient & { walrus: WalrusClient };

// Network Configurations
const NETWORK_CONFIGS: Record<WalrusNetwork, MystenWalrusConfig> = {
  testnet: {
    network: 'testnet',
    publisherUrl: 'https://publisher.walrus-testnet.walrus.space',
    aggregatorUrl: 'https://aggregator.walrus-testnet.walrus.space',
    suiRpcUrl: 'https://fullnode.testnet.sui.io:443',
  },
  mainnet: {
    network: 'mainnet',
    publisherUrl: 'https://publisher.walrus.space',
    aggregatorUrl: 'https://aggregator.walrus.space',
    suiRpcUrl: 'https://fullnode.mainnet.sui.io:443',
  },
};

function getNetworkConfig(network: WalrusNetwork): MystenWalrusConfig {
  return NETWORK_CONFIGS[network];
}

// Client Management
let walrusClient: WalrusExtendedClient | null = null;

export function getWalrusClient(): WalrusExtendedClient {
  if (walrusClient) {
    return walrusClient;
  }

  const env = loadEnv();

  // Validate network value before casting
  const allowedNetworks: WalrusNetwork[] = ['testnet', 'mainnet'];
  if (!allowedNetworks.includes(env.walrusNetwork as WalrusNetwork)) {
    throw new Error(
      `Invalid WALRUS_NETWORK: ${env.walrusNetwork}. Must be one of: ${allowedNetworks.join(', ')}`
    );
  }
  const network = env.walrusNetwork as WalrusNetwork;
  const config = getNetworkConfig(network);

  // Use SuiClient (required for Walrus SDK and CoinWithBalance intent)
  const suiClient = new SuiClient({
    url:
      env.suiRpc ||
      config.suiRpcUrl ||
      getFullnodeUrl(network === 'testnet' ? 'testnet' : 'mainnet'),
  });

  // Extend the client with Walrus capabilities and upload relay
  walrusClient = suiClient.$extend(
    walrus({
      network: network, // REQUIRED: Walrus SDK needs to know which network
      // Use CDN for WASM - more reliable than bundler resolution
      wasmUrl: 'https://unpkg.com/@mysten/walrus-wasm@latest/web/walrus_wasm_bg.wasm',
      uploadRelay: {
        host:
          env.walrusPublisher ||
          config.publisherUrl ||
          `https://upload-relay.${network}.walrus.space`,
        sendTip: null, // Skip tip config fetch to avoid CORS issues in development
      },
      ...(env.walrusAggregator && { aggregatorUrl: env.walrusAggregator }),
    })
  );

  return walrusClient;
}

export function resetWalrusClient(): void {
  walrusClient = null;
}
