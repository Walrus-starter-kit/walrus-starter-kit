# Codebase Summary

**Project:** Walrus Starter Kit
**Generated:** 2026-01-18
**Status:** Core MVP Ready + Enoki Scaffolding - Version 0.1.4

## 1. Overview

The Walrus Starter Kit is a monorepo containing a CLI tool (`create-walrus-app`) and modular templates for building Walrus applications on Sui. It uses a layered template system to allow mixing and matching SDKs, frameworks, and use cases. The CLI features a sophisticated generation engine that merges multiple template layers with atomic rollback support and automatic environment configuration. Note: Enoki integration is currently in progress (Phase 01 complete).

## 2. Directory Structure

- `/packages/cli`: The core CLI engine with interactive prompts, validation, and project generation.
  - `src/index.ts`: Entry point with commander setup and interrupt handling.
  - `src/generator/`: Template generation engine core.
    - `index.ts`: Orchestrates the generation process (copying, merging, transforming).
    - `layers.ts`: Resolves and validates template layers based on context.
    - `merge.ts`: Intelligent merging of `package.json` using `sort-package-json`.
    - `transform.ts`: Variable replacement in template files (e.g., `{{projectName}}`).
    - `file-ops.ts`: Low-level file system operations with safety checks.
  - `src/post-install/`: Post-install automation and validation.
    - `index.ts`: Main orchestrator for dependency install and validation.
    - `package-manager.ts`: Package manager detection and execution.
    - `validator.ts`: Project validation (package.json, node_modules, TS compilation).
    - `messages.ts`: Success and error UI displays.
  - `src/matrix.ts`: SDK/framework compatibility matrix.
  - `src/context.ts`: Context builder for user configuration.
- `/templates`: Modular layers for project generation.
  - `base/`: Common configs and interfaces (StorageAdapter).
  - `sdk-mysten/`: @mysten/walrus SDK adapter implementation.
  - `enoki/`: (IN PROGRESS) Enoki SDK layer for zkLogin support.
    - `lib/storage-adapter.ts`: SessionStorage adapter with SSR guards.
    - `providers/`: Enoki provider implementation (placeholder).
  - `react/`: React 18 framework layer with hooks and providers.
  - `simple-upload/`: Single file upload/download use case.
  - `gallery/`: Multi-file gallery with localStorage index.
- `/docs`: Project documentation and design guidelines.
- `/plans`: Implementation phases and research reports.

## 3. Key Components

### CLI Engine (`packages/cli`)

Interactive scaffolder with hybrid mode (interactive/CI-CD):
- **Entry Point**: Commander-based argument parsing.
- **Interactive Wizard**: 6-step prompts for project configuration.
- **Validation**: Compatibility matrix check and project name validation.
- **Generator**: Layered composition (Base + SDK + Framework + Use Case).

### Template Layer System

- **Base Layer**: SDK-agnostic foundation (`StorageAdapter` interface).
- **SDK Layers**: Concrete implementations of `StorageAdapter` (Mysten, Enoki).
- **Framework Layers**: UI environment setup (React/Vite).
- **Use Case Layers**: High-level features (Gallery, Upload).

## 4. Current Progress (v0.1.4)

- ✅ CLI Engine & React MVP Ready.
- ✅ Automated testing for template combinations.
- ✅ Automatic `.env` configuration.
- ✅ Enoki Scaffolding & Documentation (Phase 01 & 05): Folder structure, configuration, and comprehensive setup documentation.
- 🚧 Enoki Implementation (Phase 02-04): Provider and Auth flow implementation.

## 5. Technology Stack

- **CLI**: TypeScript, Node.js, Commander, Prompts, fs-extra, cross-spawn.
- **Templates**: React 18, Vite 5, TanStack Query 5, @mysten/dapp-kit 0.14.
- **SDKs**: @mysten/walrus (Testnet stable), @mysten/enoki (WIP).
