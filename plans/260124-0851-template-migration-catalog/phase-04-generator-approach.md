# Phase 04 — Generator Approach & Composition

## Goal

Define the mechanics for composing the project from catalog slices using a virtual filesystem approach.

## Proposed Pipeline (Composition)

1. **Initialize Virtual FS**: Create an in-memory file tree.
2. **Process Base**: Apply base template files.
3. **Process Framework**: Apply selected framework files (react/vue/etc).
4. **Process Capabilities**:
   - Merge `capability/storage/*` (adapter logic).
   - Merge `capability/auth/*` (auth providers/hooks).
   - Merge `capability/liquidity/*` (DeFi integration).
5. **Process Providers**: Apply framework-specific composition of providers (e.g., `src/providers/index.tsx`).
6. **Process Feature**: Apply selected use-case (simple-upload/gallery).
7. **Process Addons**: Apply examples and deployment scripts.
8. **Templating**: Run Handlebars (`.hbs`) or mustache replacement across the whole Virtual FS.
9. **Materialize**: Write the Virtual FS tree to the target project path.

## Key Integration Points

- `src/generator/virtual-fs.ts`: Implementation of the in-memory tree.
- `src/generator/composer.ts`: Orchestration of slice merging.
- `src/generator/transformer.ts`: Handlebars/Mustache processing logic.

## Exit Criteria

- Decisions on templating engine (Handlebars preferred for flexibility).
- Interface definitions for `VirtualFS` and `SliceProcessor`.
- Strategy for merging `package.json` dependencies and `scripts`.
