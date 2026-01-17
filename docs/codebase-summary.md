# Codebase Summary

**Project:** Walrus Starter Kit
**Generated:** 2026-01-17
**Status:** Phase 7 (Template Generation Engine) Complete

## 1. Overview

The Walrus Starter Kit is a monorepo containing a CLI tool (`create-walrus-app`) and modular templates for building Walrus applications on Sui. It uses a layered template system to allow mixing and matching SDKs, frameworks, and use cases. The CLI features a sophisticated generation engine that merges multiple template layers with atomic rollback support.

## 2. Directory Structure

- `/packages/cli`: The core CLI engine with interactive prompts, validation, and project generation.
  - `src/index.ts`: Entry point with commander setup and interrupt handling.
  - `src/generator/`: Template generation engine core.
    - `index.ts`: Orchestrates the generation process (copying, merging, transforming).
    - `layers.ts`: Resolves and validates template layers based on context.
    - `merge.ts`: Intelligent merging of `package.json` using `sort-package-json`.
    - `transform.ts`: Variable replacement in template files (e.g., `{{projectName}}`).
    - `file-ops.ts`: Low-level file system operations with safety checks.
    - `types.ts`: Generator-specific type definitions.
  - `src/prompts.ts`: Interactive 6-step wizard.
  - `src/validator.ts`: Compatibility validation logic.
  - `src/context.ts`: Context builder for user configuration.
  - `src/matrix.ts`: SDK/framework compatibility matrix.
  - `src/types.ts`: TypeScript interfaces and type definitions.
  - `src/utils/detect-pm.ts`: Package manager auto-detection.
  - `src/utils/logger.ts`: Colored console logging utilities.
  - `tsconfig.json`: CLI-specific TypeScript config.
- `/templates`: (In Progress) Modular layers for project generation.
  - `base/`: Common configs and interfaces.
  - `sdk-mysten/`: @mysten/walrus SDK adapter implementation.
- `/docs`: Project documentation and design guidelines.
- `/plans`: Implementation phases and research reports.
- `/examples`: (Future) Target for generated test outputs.

## 3. Key Components

### CLI Engine (`packages/cli`)

Interactive scaffolder with hybrid mode (interactive/CI-CD):

- **Entry Point (`index.ts`)**: Commander-based argument parsing, orchestrates prompt flow and validation.
- **Interactive Wizard (`prompts.ts`)**: 6-step prompts for project configuration with dynamic choices based on SDK selection.
- **Validation (`validator.ts`)**: Checks SDK/framework/use-case compatibility via matrix, validates project names against npm rules.
- **Context Builder (`context.ts`)**: Merges CLI args and prompt results into typed context object with runtime validation.
- **Compatibility Matrix (`matrix.ts`)**: Defines supported combinations for SDKs, frameworks, and use cases with metadata.
- **Utilities**: Package manager detection (pnpm/yarn/bun/npm), colored logger with kleur.

### Root Configuration

- `pnpm-workspace.yaml`: Defines the workspace members.
- `package.json`: Contains workspace-wide scripts for building, linting, and formatting.
- `tsconfig.json`: Base TypeScript configuration.
- `.eslintrc.json` & `.prettierrc.json`: Linting and formatting standards.

## 4. Template Base Layer

SDK-agnostic foundation providing common config and adapter interfaces:

**Structure:**

- `src/adapters/storage.ts` - StorageAdapter interface (upload/download/delete/getInfo)
- `src/types/walrus.ts` - Walrus type definitions (BlobId, WalrusConfig, etc.)
- `src/types/index.ts` - Type exports
- `src/utils/env.ts` - Environment validation with Zod schemas
- `src/utils/format.ts` - Formatting utilities (file size, truncate)
- `.env.example` - Environment variable template
- `.gitignore` - Git exclusions
- `tsconfig.json` - Strict TypeScript config (ES2022, ESM)
- `package.json` - Base dependencies (zod)
- `README.md` - Layer documentation

**Adapter Pattern:**
Storage operations abstracted via interface, SDK layers implement concrete adapters.

**Design Principles:**

- Zero SDK dependencies at base layer
- Single source of truth for types/config
- SDK layers merge and extend base

## 5. SDK Layer (@mysten/walrus)

**Structure:**

- `src/config.ts` - Network configs (testnet/devnet), singleton WalrusClient instance
- `src/types.ts` - SDK-specific type extensions
- `src/client.ts` - Singleton client with network switching
- `src/adapter.ts` - WalrusStorageAdapter implementing StorageAdapter interface
- `src/index.ts` - Public exports
- `test/adapter.test.ts` - Adapter validation tests

**Key Features:**

- Singleton client pattern prevents multiple SDK instances
- Network configuration with testnet/devnet presets
- Implements base StorageAdapter (upload/download/delete/getInfo)
- Extends base types with SDK-specific metadata

## 6. React Framework Layer

**Location:** `templates/react/`

**Purpose:** Modern React 18 application with Vite build system and Sui wallet integration.

**Key Files:**

| File                               | Purpose                                             |
| ---------------------------------- | --------------------------------------------------- |
| `src/main.tsx`                     | Entry point with provider composition               |
| `src/App.tsx`                      | Root component                                      |
| `src/providers/QueryProvider.tsx`  | TanStack Query setup (5min staleTime, retry=1)      |
| `src/providers/WalletProvider.tsx` | Sui wallet + network config (@mysten/dapp-kit)      |
| `src/hooks/useStorage.ts`          | Storage hooks (useUpload, useDownload, useMetadata) |
| `src/hooks/useWallet.ts`           | Wallet state access wrapper                         |
| `src/components/Layout.tsx`        | App layout structure                                |
| `src/components/WalletConnect.tsx` | Wallet connection UI                                |
| `vite.config.ts`                   | Vite config (port 3000, @ alias, esnext)            |
| `tsconfig.json`                    | Strict TS config (ES2022, JSX preserve)             |

**Provider Pattern:**

```tsx
<QueryProvider>
  <WalletProvider>
    <App />
  </WalletProvider>
</QueryProvider>
```

**Custom Hooks:**

- `useUpload()` - Mutation hook for file uploads using storageAdapter
- `useDownload(blobId)` - Query hook for blob downloads
- `useMetadata(blobId)` - Query hook for blob metadata
- `useWallet()` - Access account, isConnected, address, signAndExecute

**Tech Stack:**

- React 18.2.0 (Hooks, Suspense)
- Vite 5.0.11 (HMR, fast builds)
- TanStack Query 5.17.0 (async state)
- @mysten/dapp-kit 0.14.0 (Sui wallet)
- TypeScript 5.3.3 (strict mode)
- ESLint + React plugins

## 7. Current Progress

- ✅ Monorepo structure established.
- ✅ Root dependencies and scripts configured.
- ✅ CLI package initialized with core dependencies.
- ✅ Design system and guidelines documented.
- ✅ CLI interactive prompts and validation implemented (Phase 2).
- ✅ Compatibility matrix for SDK/framework/use-case combinations.
- ✅ Context building with argument merging and package manager detection.
- ✅ Template Generation Engine core implemented (Phase 7).
- ✅ Atomic generation with rollback on failure or interrupt.
- ✅ Template base layer with adapter pattern (Phase 3).
- ✅ SDK layer (@mysten/walrus) with singleton client and StorageAdapter (Phase 4).
- ✅ React framework layer with provider pattern and custom hooks (Phase 5).
- 🏗️ Use-case layers (Phase 6) are next.

## 8. Technology Stack

**CLI:**

- TypeScript (strict mode, ESM)
- pnpm (workspace manager)
- commander (^11.1.0), prompts (^2.4.2), kleur (^4.1.5), fs-extra (^11.2.0)
- sort-package-json (^2.10.0)
- vitest (91/91 tests, 97.5% coverage)

**Templates:**

- **React:** React 18.2, Vite 5.0, TanStack Query 5.17, @mysten/dapp-kit 0.14
- **Vue:** (Planned)
- **Plain TS:** (Planned)

**SDKs Supported:**

- mysten (@mysten/walrus) - Testnet stable
- tusky (@tusky-io/ts-sdk) - Community
- hibernuts (@hibernuts/walrus-sdk) - Alternative

```

```
