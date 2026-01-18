# Phase 03: Authentication UI Components

## Context Links

- Existing wallet-connect: `src/components/features/wallet-connect.tsx`
- App layout: `src/components/layout/app-layout.tsx`
- Enoki hooks: `@mysten/enoki/react`

## Overview

**Priority:** P1
**Status:** complete ✓
**Completed:** 2026-01-18
**Description:** Create Google login button, enhance wallet-connect for dual auth, add Enoki auth hooks

## Key Insights

- Enoki provides `useEnokiFlow()` hook for auth state
- Google login via `enokiFlow.createAuthorizationURL()`
- Support both zkLogin and standard wallet auth
- UI should clearly show which auth method is active
- ConnectButton still works for standard wallets

## Requirements

### Functional
- Google OAuth login button
- Auth state display (zkLogin vs wallet)
- Logout functionality for zkLogin
- Fallback to standard wallet auth
- Clear visual distinction between auth types

### Non-Functional
- Component under 150 lines
- Accessible button design
- Loading states during OAuth flow
- Error handling for failed auth

## Architecture

```
Auth Flow:
1. User arrives → Check zkLogin session in sessionStorage
2. If session exists → Auto-login with zkLogin
3. If no session:
   a. Show Google login button
   b. Show standard wallet ConnectButton
4. User clicks Google → OAuth redirect → Callback → Store session
5. User can logout → Clear sessionStorage
```

**Component Structure:**
```
wallet-connect.tsx
├─ EnokiAuthButton (Google login/logout)
├─ StandardWalletButton (existing ConnectButton)
└─ AuthStatus (display current auth)
```

## Related Code Files

### To Create
- `src/hooks/use-enoki-auth.ts` - Enoki auth state hook
- `src/components/features/enoki-auth-button.tsx` - Google login button

### To Modify
- `src/components/features/wallet-connect.tsx` - Add Enoki auth UI
- `src/components/layout/app-layout.tsx` - Update layout for dual auth

### To Reference
- `@mysten/enoki/react` - useEnokiFlow, useZkLogin hooks
- `src/hooks/use-wallet.ts` - Existing wallet hook

## Implementation Steps

1. Create `src/hooks/use-enoki-auth.ts`
   ```ts
   import { useEnokiFlow, useZkLogin } from '@mysten/enoki/react';

   export function useEnokiAuth() {
     const enokiFlow = useEnokiFlow();
     const { address } = useZkLogin();

     const login = async () => {
       const protocol = window.location.protocol;
       const host = window.location.host;
       const redirectUrl = `${protocol}//${host}/auth`;

       const authUrl = await enokiFlow.createAuthorizationURL({
         provider: 'google',
         clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
         redirectUrl,
       });

       window.location.href = authUrl;
     };

     const logout = () => {
       enokiFlow.logout();
     };

     return {
       isEnokiConnected: !!address,
       enokiAddress: address,
       login,
       logout,
     };
   }
   ```

2. Create `src/components/features/enoki-auth-button.tsx`
   ```tsx
   import { useEnokiAuth } from '../../hooks/use-enoki-auth.js';

   export function EnokiAuthButton() {
     const { isEnokiConnected, enokiAddress, login, logout } = useEnokiAuth();

     if (isEnokiConnected) {
       return (
         <div className="enoki-auth">
           <span>zkLogin: {enokiAddress?.slice(0, 6)}...{enokiAddress?.slice(-4)}</span>
           <button onClick={logout}>Logout</button>
         </div>
       );
     }

     return (
       <button onClick={login} className="google-login-btn">
         Login with Google
       </button>
     );
   }
   ```

3. Update `src/components/features/wallet-connect.tsx`
   - Import EnokiAuthButton
   - Add conditional rendering:
     * If zkLogin active → Show EnokiAuthButton
     * If standard wallet → Show ConnectButton
     * Show both options when disconnected
   - Add visual separator between auth methods

4. Enhanced wallet-connect structure:
   ```tsx
   import { ConnectButton } from '@mysten/dapp-kit';
   import { useWallet } from '../../hooks/use-wallet.js';
   import { useEnokiAuth } from '../../hooks/use-enoki-auth.js';
   import { EnokiAuthButton } from './enoki-auth-button.js';

   export function WalletConnect() {
     const { isConnected, address } = useWallet();
     const { isEnokiConnected } = useEnokiAuth();

     return (
       <div className="wallet-connect">
         <EnokiAuthButton />

         {!isEnokiConnected && (
           <>
             <div className="auth-divider">OR</div>
             {isConnected ? (
               <div className="wallet-info">
                 Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
               </div>
             ) : (
               <p>Connect standard wallet</p>
             )}
             <ConnectButton />
           </>
         )}
       </div>
     );
   }
   ```

5. Update app layout if needed
   - Ensure auth UI has proper spacing
   - Add styles for auth-divider
   - Update CSS for google-login-btn

6. Add OAuth callback handler in `src/main.tsx`
   - Check for /auth route on app load
   - Complete Enoki flow if callback detected
   - Redirect to home after auth

7. Verify all imports use .js extensions

## Todo List

- [ ] Create use-enoki-auth.ts hook
- [ ] Implement login() function with OAuth URL
- [ ] Implement logout() function
- [ ] Export isEnokiConnected state
- [ ] Create enoki-auth-button.tsx component
- [ ] Add Google login button UI
- [ ] Add logout button for zkLogin
- [ ] Update wallet-connect.tsx for dual auth
- [ ] Add auth-divider between options
- [ ] Add OAuth callback handler in main.tsx
- [ ] Update CSS for new auth UI
- [ ] Verify TypeScript compilation
- [ ] Test Google login flow manually

## Success Criteria

- Google login button appears when disconnected
- Click login → OAuth redirect to Google
- Callback returns → zkLogin session created
- zkLogin address displays in UI
- Logout clears session correctly
- Standard wallet auth still functional
- UI clearly shows active auth method
- No TypeScript errors
- Components under 150 lines each

## Risk Assessment

**Medium Risk:**
- OAuth callback routing might conflict with Vite
- Google OAuth config errors

**Mitigation:**
- Document OAuth redirect URI setup
- Add error boundaries around auth flow
- Provide troubleshooting in README

## Security Considerations

- OAuth redirect URI must match Google Console config
- sessionStorage auto-clears on tab close
- No sensitive data in client state
- HTTPS required for production OAuth

## Next Steps

→ Phase 04: Adapt upload hooks to support zkLogin signer
