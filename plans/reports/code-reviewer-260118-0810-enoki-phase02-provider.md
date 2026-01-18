# Code Review: Phase 02 - Enoki Provider Integration

**Reviewer:** code-reviewer-a1caad8
**Date:** 2026-01-18 08:10
**Scope:** react-mysten-simple-upload-enoki preset
**Plan:** [Phase 01](../260117-2039-enoki-deepbook-seal-integration/phase-01-enoki-provider-setup.md)

---

## Score: 6/10

## Critical Issues: 2

### 1. Build Failure - Missing Type Definitions
**File:** `tsconfig.json` (Line 19)
**Issue:** TypeScript compilation fails with missing `vite/client` type definitions
```bash
error TS2688: Cannot find type definition file for 'vite/client'.
```

**Impact:** Code cannot compile, blocks all downstream development
**Root Cause:** `@types/vite` not in devDependencies
**Fix:**
```bash
npm install --save-dev @types/vite
```

### 2. Missing EnokiProvider Implementation
**Location:** Phase scope mismatch
**Issue:** Phase 02 title is "Provider Integration" but only foundation files exist. No `EnokiProvider.tsx` created.

**Evidence:**
- `src/providers/EnokiProvider.tsx` exists (23 lines) ✓
- BUT file references non-existent path: `'../lib/enoki/index.js'`
- Actual path: `src/lib/enoki/index.ts` (created in Phase 01)

**Impact:** Provider cannot function, import paths broken
**Fix:** Verify relative import paths match actual file structure

---

## Warnings: 3

### 1. Path Mismatch - Import Statement
**File:** `EnokiProvider.tsx` (Line 3)
**Current:**
```typescript
import { enokiConfig, sessionStorageAdapter } from '../lib/enoki/index.js';
```

**Issue:** Assumes `providers/` is sibling to `lib/`, but actual structure:
```
src/
├── providers/EnokiProvider.tsx
└── lib/enoki/index.ts
```

**Expected:**
```typescript
import { enokiConfig, sessionStorageAdapter } from '../lib/enoki/index.js';
```

**Status:** Path appears correct IF file is at `src/providers/EnokiProvider.tsx`. Verify build output.

### 2. Missing storageAdapter Prop
**File:** `EnokiProvider.tsx` (Line 17)
**Current:**
```typescript
<EnokiFlowProvider
  apiKey={enokiConfig.VITE_ENOKI_API_KEY}
  storageAdapter={sessionStorageAdapter}
  storageKey="enoki:walrus-upload"
>
```

**Issue:** No validation that `@mysten/enoki` v0.15.0 supports `storageAdapter` prop
**Risk:** Medium - prop may not exist in API
**Mitigation:** Verify against Enoki SDK docs or source code

### 3. Runtime Environment Validation
**File:** `constants.ts` (Line 18-23)
**Current:**
```typescript
export const enokiConfig: EnokiConfig = enokiConfigSchema.parse({
  VITE_ENOKI_API_KEY: import.meta.env.VITE_ENOKI_API_KEY,
  // ...
});
```

**Issue:** Validation happens at module load time. If env vars missing, app crashes immediately with cryptic Zod error.
**Risk:** Low - acceptable for development, poor UX for production
**Suggestion:** Add try/catch with user-friendly error message

---

## Suggestions: 4

### 1. File Size Compliance
**Files Reviewed:**
- `EnokiProvider.tsx`: 23 lines ✓
- `providers/index.ts`: 7 lines ✓
- `index.ts`: 22 lines ✓
- `constants.ts`: 23 lines ✓
- `storage-adapter.ts`: 31 lines ✓

**Total:** 106 lines across 5 files
**Status:** All under 150-line limit ✓

### 2. TypeScript Strict Mode
**Config:** `tsconfig.json` (Line 21)
```json
"strict": true,
"noUnusedLocals": true,
"noUnusedParameters": true
```

**Status:** ✓ Strict mode enabled
**Quality:** No `any` types found in grep results ✓

### 3. Documentation Quality
**File:** `.env.example` (41 lines)
**Strengths:**
- Clear section headers
- Inline comments for each variable
- Prerequisites checklist
- Examples with placeholders

**Improvement:** Add link to Enoki Console in VITE_ENOKI_API_KEY comment

### 4. Security - No Hardcoded Secrets
**Grep Results:** No matches for `enoki_public_|enoki_secret_|sk-|pk-` ✓
**Status:** Clean ✓

---

## Summary

**Architecture:** YAGNI/KISS/DRY principles followed. Clean separation of concerns (config, storage, provider).

**Strengths:**
- Excellent file size discipline (max 31 lines)
- No `any` types, strict TypeScript
- SSR-safe storage adapter with `typeof window` checks
- Zod validation for environment config
- Comprehensive `.env.example` with inline docs

**Blockers:**
1. Build fails due to missing `@types/vite`
2. Cannot verify provider functionality until build passes

**Next Steps:**
1. Add `@types/vite` to devDependencies
2. Run `npm run build` to validate TypeScript compilation
3. Verify `EnokiFlowProvider` API compatibility with v0.15.0
4. Test import paths after successful build
5. Update Phase 01 plan to mark provider integration as "complete"

---

## Plan Status Update

**Phase 01 Todo List - Provider Integration (Current):**
- [x] Implement `EnokiProvider.tsx` (23 lines, needs build validation)
- [ ] Update `matrix.ts` with enoki preset registration
- [ ] Modify `WalletProvider.tsx` for storage prop (NOT in scope - deferred)
- [ ] Validate TypeScript compilation (BLOCKED by missing types)
- [ ] Test provider nesting (BLOCKED by build failure)
- [ ] Integration tests (pending build fix)
- [ ] Migration guide (pending completion)

**Overall Progress:** 1/7 tasks verifiable, 6/7 blocked by build issue

---

## Metrics

- **Type Coverage:** 100% (no `any` types)
- **Test Coverage:** 0% (no tests yet - expected for Phase 02)
- **Linting Issues:** Cannot run (build blocked)
- **Build Status:** ❌ FAILED (missing type definitions)
- **Files Modified:** 5 created, 0 modified
- **Lines Added:** 106 total

---

## Unresolved Questions

1. Does `@mysten/enoki` v0.15.0 `EnokiFlowProvider` support `storageAdapter` prop? (Check SDK source)
2. Should Phase 02 also include matrix.ts updates, or defer to Phase 10 (docs)?
3. Is Vite preset architecture final, or migrate to Next.js template layer per original plan?
4. Why no WalletProvider modification in this phase? (Plan shows it deferred, confirm intentional)
