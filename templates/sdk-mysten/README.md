# Mysten Walrus SDK Layer

Official [Mysten Labs](https://mystenlabs.com/) SDK implementation for Walrus storage.

## Features

✅ **Relay Upload** - Browser-optimized uploads via relay nodes  
✅ **Direct Download** - Fast blob retrieval  
✅ **Metadata Queries** - Size, type, creation date  
✅ **Network Support** - Testnet, Mainnet, Devnet  
✅ **Type Safety** - Full TypeScript support

## Usage

```typescript
import { storageAdapter } from './sdk-mysten';

// Upload file
const blobId = await storageAdapter.upload(fileData, { epochs: 1 });

// Download file
const data = await storageAdapter.download(blobId);

// Get metadata
const metadata = await storageAdapter.getMetadata(blobId);
console.log(`Blob size: ${metadata.size} bytes`);
```

## Configuration

Set environment variables:

```bash
VITE_WALRUS_NETWORK=testnet
VITE_WALRUS_PUBLISHER=https://publisher.walrus-testnet.walrus.space
VITE_WALRUS_AGGREGATOR=https://aggregator.walrus-testnet.walrus.space
VITE_SUI_RPC=https://fullnode.testnet.sui.io:443
```

## API Reference

### `storageAdapter`

Singleton instance implementing `StorageAdapter` interface.

### `getWalrusClient()`

Get WalrusClient singleton (lazy initialization).

### `getNetworkConfig(network)`

Get network-specific configuration.

## Network Defaults

| Network | Publisher                                       | Aggregator                                       |
| ------- | ----------------------------------------------- | ------------------------------------------------ |
| testnet | `https://publisher.walrus-testnet.walrus.space` | `https://aggregator.walrus-testnet.walrus.space` |
| mainnet | `https://publisher.walrus.space`                | `https://aggregator.walrus.space`                |

## Resources

- [Walrus SDK Docs](https://sdk.mystenlabs.com/walrus)
- [Walrus Documentation](https://docs.walrus.site)
- [npm: @mysten/walrus](https://www.npmjs.com/package/@mysten/walrus)
