import { EnokiFlowProvider } from '@mysten/enoki/react';
import { ReactNode } from 'react';
import { enokiConfig, sessionStorageAdapter } from '../lib/enoki/index.js';

/**
 * EnokiProvider wraps the app with zkLogin authentication support
 *
 * Features:
 * - Google OAuth via Enoki zkLogin
 * - Tab-isolated sessions (sessionStorage)
 * - Environment validation with Zod
 */
export function EnokiProvider({ children }: { children: ReactNode }) {
  return (
    <EnokiFlowProvider
      apiKey={enokiConfig.VITE_ENOKI_API_KEY}
      storageAdapter={sessionStorageAdapter}
      storageKey="enoki:walrus-upload"
    >
      {children}
    </EnokiFlowProvider>
  );
}
