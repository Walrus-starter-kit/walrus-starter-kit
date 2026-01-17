# System Architecture

**Walrus Starter Kit** uses a modular, layered architecture to provide a flexible and robust scaffolding experience.

## 1. Monorepo Structure

The project is managed as a pnpm monorepo:

```
walrus-starter-kit/
├── packages/
│   └── cli/                 # Scaffolder Engine (create-walrus-app)
├── templates/               # Modular Template Layers (Excluded from workspace)
│   ├── base/                # Layer 1: Core config & Adapter interface
│   ├── sdk-*/               # Layer 2: SDK-specific implementations
│   ├── framework-*/         # Layer 3: UI Framework (React, Vue, etc.)
│   └── use-case-*/          # Layer 4: Feature-specific code
├── examples/                # Generated test outputs (Excluded from workspace)
└── docs/                    # Technical Documentation
```

## 2. Scaffolding Engine (CLI)

The `packages/cli` engine implements a pipeline architecture:

### 2.1 Pipeline Flow

```
Entry Point (index.ts)
    ↓
Parse Arguments (commander)
    ↓
Run Interactive Prompts (prompts.ts) ←→ Skip if flags provided
    ↓
Build Context (context.ts) — Merge args + prompts
    ↓
Validate Compatibility (validator.ts) — Matrix check
    ↓
Generate Project (generator/index.ts) — Layered composition
    ↓
Post-Install & Verification (Phase 8 - future)
```

### 2.2 Core Responsibilities

- **Interaction:** Using `commander` and `prompts` for hybrid mode (interactive/CI-CD).
- **Validation:** Checking the compatibility matrix (SDK vs Framework vs Use Case).
- **Context Building:** Merging CLI arguments and prompt results with runtime type validation.
- **Package Manager Detection:** Auto-detecting pnpm/yarn/bun/npm from environment.
- **Layered Composition:** Assembling the final project by merging multiple template layers (Base + SDK + Framework + Use Case).
- **Intelligent Merging:** Deep merging of `package.json` dependencies and scripts with automated sorting.
- **Template Transformation:** Variable replacement within template files using mustache-style syntax (`{{projectName}}`).
- **Atomic Operations:** Rollback support for partially generated directories on failure or SIGINT.
- **Path Security:** Path traversal validation to ensure all template layers are within the package root.

### 2.3 Key Components

| Component          | File                     | Purpose                                            |
| ------------------ | ------------------------ | -------------------------------------------------- |
| Entry Point        | `index.ts`               | Commander setup, orchestration, SIGINT handling    |
| Interactive Wizard | `prompts.ts`             | 6-step prompts with dynamic choices                |
| Context Builder    | `context.ts`             | Merge args/prompts, runtime validation             |
| Generator Engine   | `generator/index.ts`     | Orchestrates the layered generation flow           |
| Layer Resolver     | `generator/layers.ts`    | Determines and validates active template layers    |
| JSON Merger        | `generator/merge.ts`     | Merges package.json with dependency reconciliation |
| Transformer        | `generator/transform.ts` | Variable replacement in template files             |
| Validator          | `validator.ts`           | Compatibility checks, project name validation      |
| Matrix             | `matrix.ts`              | SDK/framework/use-case compatibility data          |
| Types              | `types.ts`               | TypeScript interfaces (Context, ValidationResult)  |
| Logger             | `utils/logger.ts`        | Colored console output (kleur)                     |
| PM Detection       | `utils/detect-pm.ts`     | Package manager auto-detection                     |

### 2.4 Context Object

The `Context` interface is the single source of truth for user configuration:

```typescript
interface Context {
  projectName: string;
  projectPath: string; // Auto-resolved absolute path
  sdk: 'mysten' | 'tusky' | 'hibernuts';
  framework: 'react' | 'vue' | 'plain-ts';
  useCase: 'simple-upload' | 'gallery' | 'defi-nft';
  analytics: boolean; // Blockberry analytics integration
  tailwind: boolean; // Tailwind CSS inclusion
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun';
}
```

## 3. Template Layer System

Templates organized into composable layers merged during generation:

### 3.1 Layer Composition Flow

```
User Choices (Context)
    ↓
Layer Resolver (layers.ts)
    ↓
Active Layers Identified:
    ├── Base Layer (always)
    ├── SDK Layer (mysten/tusky/hibernuts)
    ├── Framework Layer (react/vue/plain-ts)
    ├── Use Case Layer (upload/gallery/defi-nft)
    └── Add-ons (tailwind, analytics)
    ↓
Generator Orchestrator (index.ts)
    ↓
For each layer:
    ├── Copy files → Target directory
    ├── Merge package.json → Deep merge dependencies
    ├── Transform variables → {{projectName}} replacement
    └── Validate paths → Security checks
    ↓
Final Project Structure
```

### 3.2 Base Layer Architecture

**Location:** `templates/base/`

**Purpose:** SDK-agnostic foundation with adapter pattern.

**Key Files:**

| File                      | Purpose                                       |
| ------------------------- | --------------------------------------------- |
| `src/adapters/storage.ts` | StorageAdapter interface (4 methods)          |
| `src/types/walrus.ts`     | Type definitions (BlobId, WalrusConfig, etc.) |
| `src/types/index.ts`      | Type barrel exports                           |
| `src/utils/env.ts`        | Zod schemas for env validation                |
| `src/utils/format.ts`     | Formatting utils (file size, truncate)        |
| `.env.example`            | Required env vars template                    |
| `tsconfig.json`           | Strict TS config (ES2022, ESM)                |
| `package.json`            | Base deps (zod)                               |

**StorageAdapter Interface:**

```typescript
export interface StorageAdapter {
  upload(file: File, options?: UploadOptions): Promise<UploadResult>;
  download(blobId: BlobId): Promise<Blob>;
  delete(blobId: BlobId): Promise<void>;
  getInfo(blobId: BlobId): Promise<BlobInfo>;
}
```

**Design Invariants:**

- Zero SDK dependencies at base
- Single source of truth for types
- SDK layers extend via concrete adapters
- Use cases consume via interface only

### 3.3 Layer Merging Strategy

**File Conflicts:**

- Later layers override earlier layers (Use Case > Framework > SDK > Base)
- Exception: `package.json` uses deep merge (dependencies combined)

**package.json Merge Rules:**

1. Dependencies: Combine all, later versions win
2. Scripts: Later layers override
3. Metadata (name, version): Use Case layer wins
4. Auto-sorted via `sort-package-json`

**Variable Transformation:**

- Mustache-style syntax: `{{variableName}}`
- Context variables: `projectName`, `sdk`, `framework`, etc.
- Applied to: `.ts`, `.tsx`, `.json`, `.md`, `.html`, `.env.example`

## 4. Template Layering Pattern (Legacy Overview)

We use a **Base + Layer + Adapter Pattern** (detailed in Section 3):

1.  **Base Layer:** Contains common files (`.gitignore`, `.env.example`, `tsconfig.json`) and the **Storage Adapter Interface**.
2.  **SDK Layer:** Implements the Storage Adapter using the Mysten Labs TypeScript SDK (`@mysten/walrus`).
3.  **Framework Layer:** Sets up the UI environment (Vite, React, Tailwind).
4.  **Use Case Layer:** High-level features (Gallery, Upload UI) that consume the Storage Adapter.

## 5. Multi-SDK Integration

The project supports multiple Walrus SDKs with compatibility validation:

### 4.1 Supported SDKs

| SDK       | Package                 | Frameworks           | Use Cases       | Status         |
| --------- | ----------------------- | -------------------- | --------------- | -------------- |
| Mysten    | `@mysten/walrus`        | React, Vue, Plain TS | All             | Testnet stable |
| Tusky     | `@tusky-io/ts-sdk`      | React, Vue, Plain TS | Upload, Gallery | Community      |
| Hibernuts | `@hibernuts/walrus-sdk` | React, Plain TS      | Upload only     | Alternative    |

### 4.2 Compatibility Matrix

The CLI enforces compatibility via `matrix.ts`:

```typescript
const COMPATIBILITY_MATRIX = {
  mysten: {
    frameworks: ['react', 'vue', 'plain-ts'],
    useCases: ['simple-upload', 'gallery', 'defi-nft'],
  },
  tusky: {
    frameworks: ['react', 'vue', 'plain-ts'],
    useCases: ['simple-upload', 'gallery'],
  },
  hibernuts: {
    frameworks: ['react', 'plain-ts'],
    useCases: ['simple-upload'],
  },
};
```

### 5.3 Storage Adapter

Defined in Section 3.2 (Base Layer Architecture). SDK layers implement concrete adapters:

```typescript
// Base Layer Interface (templates/base/src/adapters/storage.ts)
export interface StorageAdapter {
  upload(file: File, options?: UploadOptions): Promise<UploadResult>;
  download(blobId: BlobId): Promise<Blob>;
  delete(blobId: BlobId): Promise<void>;
  getInfo(blobId: BlobId): Promise<BlobInfo>;
}
```

SDK layers (e.g., `sdk-mysten`) provide concrete implementations.

## 6. Technology Stack

- **Runtime:** Node.js (ESM)
- **Tooling:** pnpm, TypeScript (strict mode), ESLint, Prettier
- **CLI Libs:** `commander` (^11.1.0), `prompts` (^2.4.2), `kleur` (^4.1.5)
- **Testing:** `vitest` (91/91 tests, 97.5% coverage)
- **Build:** `tsc` (TypeScript Compiler)

```

```
