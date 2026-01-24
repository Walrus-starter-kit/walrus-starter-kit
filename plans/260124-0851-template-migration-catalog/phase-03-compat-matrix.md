# Phase 03 — Compatibility Matrix & Gating

## Goal

Define and implement explicit compatibility rules and stability gating for the Template Catalog.

## Finalized Compatibility Matrix (Stable Only)

| SDK          | Framework | Auth (zkLogin) | Feature         | Status            |
| ------------ | --------- | -------------- | --------------- | ----------------- |
| `sdk-mysten` | `react`   | No             | `simple-upload` | ✅ Valid (Stable) |
| `sdk-mysten` | `react`   | No             | `gallery`       | ✅ Valid (Stable) |
| `sdk-mysten` | `react`   | Yes            | `simple-upload` | ✅ Valid (Beta)   |
| `sdk-mysten` | `react`   | Yes            | `gallery`       | ✅ Valid (Beta)   |

## Gating Logic Implementation

The gating logic is centralized in `packages/cli/src/compatibility-rules.ts`.

### Implementation Details:

- **Centralized Rules**: Created `compatibility-rules.ts` for stability and compatibility gating.
- **CLI Integration**: Integrated gating into `prompts.ts` (filters out "Planned" options using `isStable`).
- **Validation**: Updated `validator.ts` to use centralized rules for final consistency checks.
- **Testing**: 100% test coverage for new rules; all tests passing.

### Key Functions:

- `isStable(type, value)`: Returns `true` if the option is ready for production. Used in `prompts.ts` to filter available choices.
- `isCompatible(selection)`: Validates a complete set of user choices. Used in `validator.ts` as a final gate.

### Decisions:

1. **Hide Completely**: All "Planned" options (`tusky`, `hibernuts`, `vue`, `plain-ts`, `defi-nft`) are hidden from CLI prompts using `isStable`.
2. **Explicit Errors**: If an incompatible or planned option is selected via CLI flags, `isCompatible` returns a detailed error message with suggestions.
3. **zkLogin Restriction**: `zkLogin (Enoki)` is strictly gated to `sdk-mysten` and `framework-react`.

## Exit Criteria

- [x] Detailed table of allowed combinations.
- [x] Implemented `compatibility-rules.ts` engine.
- [x] Filtered CLI options based on stability.
- [x] Integrated gating into `prompts.ts` and `validator.ts`.
- [x] 100% test coverage for validation rules.
- [x] Unified validation at prompt-time and pre-generation.

## Status

**Status**: COMPLETED
**Date**: 2026-01-24
