# Planner Report: Enoki Upload Preset Implementation Plan

**Agent:** planner-260118-0723
**Task:** Create implementation plan for `react-mysten-simple-upload-enoki` preset
**Status:** Complete
**Date:** 2026-01-18

## Summary

Created comprehensive 6-phase implementation plan for new preset combining Walrus upload functionality with Enoki zkLogin authentication.

## Plan Structure

**Location:** `d:/Sui/walrus-starter-kit/plans/260118-0723-enoki-upload-preset/`

**Files Created:**
- `plan.md` - Overview with phase links, 73 lines
- `phase-01-project-structure.md` - Setup base files, copy operations
- `phase-02-enoki-provider.md` - Provider integration, env validation
- `phase-03-auth-ui.md` - Google login UI, dual auth support
- `phase-04-upload-integration.md` - zkLogin signer adaptation
- `phase-05-documentation.md` - README, setup guides, troubleshooting
- `phase-06-testing.md` - Manual test scenarios, validation

## Key Decisions

### Architecture
- **Provider Hierarchy:** EnokiProvider wraps WalletProvider (not replaces)
- **Storage:** sessionStorage for tab-isolated sessions
- **Signer Priority:** zkLogin preferred over standard wallet
- **Validation:** Zod schema for env vars at runtime

### File Organization
```
react-mysten-simple-upload-enoki/
├── src/
│   ├── lib/enoki/          # NEW - Enoki config, storage adapter
│   ├── lib/walrus/         # COPY - Upload/download logic
│   ├── providers/          # ENHANCE - Add EnokiProvider
│   ├── hooks/              # MODIFY - Add zkLogin signer support
│   └── components/         # ENHANCE - Dual auth UI
```

### Dependencies Added
- `@mysten/enoki@^0.15.0` - zkLogin SDK
- `zod@^3.22.0` - Environment validation

### Environment Variables
```env
VITE_ENOKI_API_KEY=enoki_public_xxx
VITE_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
VITE_SUI_NETWORK=testnet
```

## Implementation Approach

### Phase Breakdown (6h total)

1. **Phase 01 (1h):** Copy simple-upload base, add Enoki lib files
2. **Phase 02 (1h):** Implement EnokiProvider with Zod validation
3. **Phase 03 (1.5h):** Google login button, auth state hooks
4. **Phase 04 (1h):** Adapt upload hook for dual signer support
5. **Phase 05 (0.5h):** Write documentation, setup guides
6. **Phase 06 (1h):** Manual testing all flows

### Critical Path
Phase 01 → Phase 02 → Phase 03 → Phase 04 → Phase 06
(Phase 05 can run parallel to Phase 04)

## Technical Highlights

### Unified Signer Interface
```ts
interface UnifiedSigner {
  address: string;
  signAndExecuteTransaction: (args) => Promise<{ digest: string }>;
}
```
Compatible with both zkLogin and standard wallet.

### Auth Flow Decision
```
Check zkLogin session → Use zkLogin signer
   ↓ (if no zkLogin)
Check wallet connected → Use wallet signer
   ↓ (if neither)
Throw error
```

### OAuth Integration
- Redirect URI: `${protocol}//${host}/auth`
- Callback handled in main.tsx on mount
- Session stored in sessionStorage (auto-cleanup)

## Constraints Respected

- **YAGNI:** Only zkLogin auth, no DeepBook integration
- **KISS:** Reuse simple-upload structure entirely
- **DRY:** Share Walrus lib, extend providers
- **File Size:** All components under 200 lines
- **Naming:** kebab-case throughout

## Success Criteria Defined

- [ ] Preset scaffolds via CLI correctly
- [ ] Google OAuth login functional
- [ ] File upload with zkLogin succeeds
- [ ] File download by Blob ID works
- [ ] Standard wallet auth preserved
- [ ] Environment setup documented
- [ ] No mocks or TODOs in final code
- [ ] TypeScript compiles cleanly

## Risk Mitigation

**Identified Risks:**
- OAuth redirect URI mismatch (Medium)
- Enoki API changes (Low)
- Environment config errors (Medium)

**Mitigations:**
- Clear documentation for OAuth setup
- Pin @mysten/enoki version
- Zod validation with helpful error messages
- Comprehensive troubleshooting section

## Next Actions

1. Review plan with stakeholders
2. Begin Phase 01 implementation
3. Setup test Enoki project + Google OAuth
4. Execute phases sequentially
5. Create test report after Phase 06

## Files References

**Scout Reports:** Not found in reports directory (worked from live codebase)
**Base Preset:** `packages/cli/presets/react-mysten-simple-upload/`
**Enoki Template:** `templates/enoki/`

## Unresolved Questions

None. Plan ready for implementation.
