# Phase 02: Enoki Provider Integration

## Context Links

- WalletProvider: `src/providers/WalletProvider.tsx`
- Template structure: `templates/enoki/providers/`
- Constants template: `src/lib/enoki/constants.ts`
- Storage adapter: `src/lib/enoki/storage-adapter.ts`

## Overview

**Priority:** P1
**Status:** pending
**Description:** Implement EnokiProvider to wrap WalletProvider, add session persistence, configure Enoki client

## Key Insights

- EnokiFlowProvider wraps WalletProvider (not replaces)
- Dual wallet support: zkLogin + standard wallets
- SessionStorage for tab-isolated sessions
- Zod validation for env vars prevents runtime errors
- EnokiProvider must provide Enoki client to children

## Requirements

### Functional
- EnokiFlowProvider configuration with Google OAuth
- Storage adapter using sessionStorage
- Environment validation with Zod
- Enoki client accessible via context/hooks
- Backward compatible with WalletProvider

### Non-Functional
- Provider under 150 lines
- Type-safe environment access
- SSR-safe storage operations
- Clear error messages for missing config

## Architecture

```
Provider Hierarchy:
React.StrictMode
  └─ QueryProvider (react-query)
      └─ EnokiProvider (NEW)
          └─ WalletProvider (existing)
              └─ App
```

**Data Flow:**
1. User clicks Google login → EnokiProvider handles OAuth
2. zkLogin keypair stored in sessionStorage
3. WalletProvider receives zkLogin wallet + standard wallets
4. App components use unified wallet interface

## Related Code Files

### To Implement
- `src/providers/EnokiProvider.tsx` - Main provider component
- `src/lib/enoki/constants.ts` - Env validation with Zod
- `src/lib/enoki/index.ts` - Update barrel exports

### To Reference
- `templates/enoki/providers/EnokiProvider.tsx` - Template structure
- `src/providers/WalletProvider.tsx` - Existing wallet setup
- `src/lib/enoki/storage-adapter.ts` - Already copied

### To Modify
- `src/utils/env.ts` - Add Enoki env vars

## Implementation Steps

1. Implement `src/lib/enoki/constants.ts`
   ```ts
   import { z } from 'zod';

   const enokiEnvSchema = z.object({
     enokiApiKey: z.string().min(1, 'VITE_ENOKI_API_KEY required'),
     googleClientId: z.string().min(1, 'VITE_GOOGLE_CLIENT_ID required'),
     suiNetwork: z.enum(['testnet', 'mainnet']).default('testnet'),
   });

   export function loadEnokiEnv() {
     return enokiEnvSchema.parse({
       enokiApiKey: import.meta.env.VITE_ENOKI_API_KEY,
       googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
       suiNetwork: import.meta.env.VITE_SUI_NETWORK,
     });
   }

   export type EnokiEnv = z.infer<typeof enokiEnvSchema>;
   ```

2. Update `src/lib/enoki/index.ts` barrel export
   ```ts
   export { sessionStorageAdapter } from './storage-adapter.js';
   export { loadEnokiEnv } from './constants.js';
   export type { StorageAdapter, EnokiEnv } from './constants.js';
   ```

3. Implement `src/providers/EnokiProvider.tsx`
   - Import EnokiFlowProvider from '@mysten/enoki/react'
   - Import loadEnokiEnv, sessionStorageAdapter
   - Configure EnokiFlowProvider with:
     * apiKey from env
     * storageAdapter: sessionStorageAdapter
     * storageKey: 'enoki:walrus-upload'
   - Wrap children with EnokiFlowProvider
   - Export EnokiProvider component

4. Create EnokiProvider structure:
   ```tsx
   import { EnokiFlowProvider } from '@mysten/enoki/react';
   import { ReactNode } from 'react';
   import { loadEnokiEnv, sessionStorageAdapter } from '../lib/enoki/index.js';

   const enokiEnv = loadEnokiEnv();

   export function EnokiProvider({ children }: { children: ReactNode }) {
     return (
       <EnokiFlowProvider
         apiKey={enokiEnv.enokiApiKey}
         storageAdapter={sessionStorageAdapter}
         storageKey="enoki:walrus-upload"
       >
         {children}
       </EnokiFlowProvider>
     );
   }
   ```

5. Update `src/utils/env.ts` to include Enoki vars
   - Add VITE_ENOKI_API_KEY validation
   - Add VITE_GOOGLE_CLIENT_ID validation
   - Keep existing Sui network validation

6. Verify TypeScript imports use .js extensions

## Todo List

- [ ] Implement constants.ts with Zod schema
- [ ] Add loadEnokiEnv() function
- [ ] Export EnokiEnv type
- [ ] Update enoki/index.ts barrel exports
- [ ] Implement EnokiProvider.tsx component
- [ ] Configure EnokiFlowProvider with sessionStorage
- [ ] Update env.ts with Enoki vars
- [ ] Verify all imports have .js extensions
- [ ] Test env validation throws on missing vars
- [ ] Verify provider hierarchy matches architecture

## Success Criteria

- loadEnokiEnv() validates required env vars
- Zod throws clear errors for missing config
- EnokiProvider wraps children correctly
- sessionStorageAdapter used for persistence
- TypeScript compilation succeeds
- No runtime errors with valid .env config
- Provider file under 150 lines

## Risk Assessment

**Medium Risk:**
- Enoki API changes could affect provider setup
- Environment validation might block dev mode

**Mitigation:**
- Pin @mysten/enoki version
- Provide clear error messages
- Document required env vars in README

## Security Considerations

- sessionStorage (not localStorage) for auto-cleanup on tab close
- Environment vars validated at build time
- No sensitive keys in client-side code
- Storage key namespaced: 'enoki:walrus-upload'

## Next Steps

→ Phase 03: Implement Google login UI and auth state hooks
