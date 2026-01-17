# React + Vite Framework Layer

Modern React 18 application with Vite build system.

## Features

✅ **React 18** - Hooks, Suspense, Concurrent features  
✅ **Vite 5** - Lightning-fast HMR and builds  
✅ **TanStack Query** - Async state management  
✅ **@mysten/dapp-kit** - Sui wallet integration  
✅ **TypeScript** - Full type safety

## Project Structure

```
src/
├── components/     # Reusable UI components
├── providers/      # Context providers
├── hooks/          # Custom React hooks
├── App.tsx         # Root component
└── main.tsx        # Entry point
```

## Custom Hooks

### `useUpload()`

Upload files to Walrus:

```typescript
const upload = useUpload();

upload.mutate({ file: myFile, options: { epochs: 1 } });
```

### `useDownload(blobId)`

Download blob data:

```typescript
const { data, isLoading } = useDownload(blobId);
```

### `useMetadata(blobId)`

Fetch blob metadata:

```typescript
const { data: metadata } = useMetadata(blobId);
console.log(`Size: ${metadata.size} bytes`);
```

### `useWallet()`

Access wallet state:

```typescript
const { isConnected, address } = useWallet();
```

## Development

```bash
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Build for production
npm run preview    # Preview production build
```

## Wallet Setup

1. Install Sui Wallet browser extension
2. Get testnet SUI from faucet
3. Connect wallet in the app

## Resources

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [TanStack Query](https://tanstack.com/query)
- [@mysten/dapp-kit](https://sdk.mystenlabs.com/dapp-kit)
