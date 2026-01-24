# Phase 02 — Target Catalog Layout

## Goal

Establish the physical structure and metadata schema for the composable template catalog at `packages/templates/catalog`.

## Finalized Taxonomy

- **Root**: `packages/templates/catalog/`
- **Categories**:
  - `base/`: Core foundation (scripts, tsconfig, eslint).
  - `framework/`: UI frameworks (`react`, `vue`, `plain-ts`).
  - `capability/`: Walrus SDKs (`mysten`, `tusky`, `hibernuts`).
  - `providers/`: Integration layers (`enoki`, `seal`).
  - `feature/`: Use cases (`simple-upload`, `gallery`).
  - `addons/`: Optional tools (`tailwind`, `analytics`).
  - `deploy/`: Deployment configs (`walrus-sites`, `vercel`).

## Slice Structure

Each slice directory MUST contain:

- `manifest.json`: Metadata and compatibility rules (see schema below).
- `README.md`: Documentation for the slice.
- `files/`: Directory containing the actual template files.
- `env.hbs` (Optional): Handlebars template for environment variables.
- `package.hbs` (Optional): Handlebars snippet for `package.json` dependencies/scripts.

## Metadata Schema (`manifest.json`)

```json
{
  "id": "string",
  "name": "string",
  "version": "string",
  "type": "base|framework|capability|provider|feature|addon|deploy",
  "description": "string",
  "status": "stable|beta|experimental",
  "compatibility": {
    "requires": ["slice-id"],
    "excludes": ["slice-id"],
    "frameworks": ["framework-id"],
    "capabilities": ["capability-id"]
  },
  "priority": "number (default: 100, lower = applied first)",
  "transforms": {
    "variables": ["string"]
  }
}
```

## Composition Logic

1. **VFS Initialization**: Create in-memory tree.
2. **Layer Ordering**: Apply base → framework → capability → provider → feature → addon → deploy.
3. **Merging**:
   - `package.json`: Deep merge objects, replace primitives, replace arrays.
   - `.env.example`: Snippet-based append with category headers.
   - `tsconfig.json`: Deep merge with framework/capability overrides.
4. **Templating**: Run Handlebars replacement on all files using unified context.

## Exit Criteria

- [x] Defined taxonomy and naming conventions.
- [x] Agreed upon `packages/templates/catalog` root.
- [x] Standardized slice internal structure.
- [x] Formalized `manifest.json` schema.
- [x] Defined merge strategies for conflicting files.

## Status

**Status**: COMPLETED
**Date**: 2026-01-24
