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

## 4. Current Progress
- ✅ Monorepo structure established.
- ✅ Root dependencies and scripts configured.
- ✅ CLI package initialized with core dependencies.
- ✅ Design system and guidelines documented.
- ✅ CLI interactive prompts and validation implemented (Phase 2).
- ✅ Compatibility matrix for SDK/framework/use-case combinations.
- ✅ Context building with argument merging and package manager detection.
- ✅ Template Generation Engine core implemented (Phase 7).
- ✅ Atomic generation with rollback on failure or interrupt.
- 🏗️ Template base layer (Phase 3) and specific layers (Phase 4-6) are next.

## 5. Technology Stack
- **Language:** TypeScript (strict mode, ESM)
- **Package Manager:** pnpm
- **CLI Libraries:** commander (^11.1.0), prompts (^2.4.2), kleur (^4.1.5), fs-extra (^11.2.0)
- **Tooling:** sort-package-json (^2.10.0)
- **Testing:** vitest (91/91 tests, 97.5% coverage)
- **Frameworks (Target):** React, Vue, Plain TypeScript
- **SDKs (Supported):** mysten (@mysten/walrus), tusky (@tusky-io/ts-sdk), hibernuts (@hibernuts/walrus-sdk)
```
