---
title: Phase 01 — Inventory & Mapping
description: Catalog current presets and legacy layers, then map them into the future slice taxonomy.
status: completed
priority: high
effort: low
created: 2026-01-24
---

# Phase 01 — Inventory & Mapping

## Goal

Catalog current presets and legacy layers, then map them into the future slice taxonomy for the composable catalog.

## Inputs

- packages/templates/: react-mysten-simple-upload, react-mysten-gallery-new, react-mysten-simple-upload-enoki (react-mysten-gallery is a broken symlink)
- templates/: base, sdk-mysten, enoki, react, simple-upload, gallery (with READMEs)

## Tasks

- [x] List assets in each preset (providers, hooks, lib, utils, scripts, env files, configs).
- [x] Extract shared pieces across presets to candidate slices (base/framework/providers/capabilities/features/scripts/docs).
- [x] Note Enoki-specific bits (auth) vs Mysten-only (storage) vs feature-specific (gallery/indexing).
- [x] Identify duplicates and divergence (e.g., README content, scripts, env variables).

## Inventory Summary

### Asset Mapping Table

| Existing Asset Path                                                   | Proposed Slice Category/Name | Notes                              |
| :-------------------------------------------------------------------- | :--------------------------- | :--------------------------------- |
| `templates/base/package.json`                                         | `base`                       | Root configuration and scripts     |
| `templates/base/tsconfig.json`                                        | `base`                       | Shared TypeScript settings         |
| `templates/base/src/utils/env.ts`                                     | `base`                       | Environment validation logic       |
| `templates/react/src/providers/QueryProvider.tsx`                     | `framework/react`            | TanStack Query setup               |
| `templates/react/src/components/layout/app-layout.tsx`                | `framework/react`            | Shared layout shell                |
| `packages/templates/react-mysten-simple-upload/src/lib/walrus/*`      | `capability/storage/mysten`  | Updated Walrus SDK adapter (V2)    |
| `packages/templates/react-mysten-simple-upload-enoki/src/lib/enoki/*` | `capability/auth/enoki`      | Enoki zkLogin adapter/constants    |
| `templates/simple-upload/src/components/features/*`                   | `feature/simple-upload`      | UploadForm, FilePreview components |
| `templates/gallery/src/components/features/*`                         | `feature/gallery`            | GalleryGrid, FileCard components   |
| `templates/gallery/src/utils/index-manager.ts`                        | `feature/gallery`            | LocalStorage indexing logic        |
| `packages/templates/*/scripts/setup-walrus-deploy.sh`                 | `addon/deploy-walrus`        | Reusable deployment automation     |

### Key Findings

- **Script Unification**: Deployment and maintenance scripts are 100% identical. They will be moved to `addons/scripts` or `base`.
- **Modern Gallery**: `react-mysten-gallery-new` successfully uses modern dapp-kit patterns and will be the basis for the gallery feature slice.
- **Broken Symlink**: `packages/templates/react-mysten-gallery` confirmed as broken; marked for removal.
- **Base/React Unification**: All React-based presets share identical Vite/TS/ESLint configurations, confirming `base` and `framework/react` can be fully unified.

## Exit Criteria

- [x] Table mapping: {existing asset} → {proposed slice name/path}.
- [x] Notes on broken/duplicate assets (e.g., gallery symlink) and cleanup needs.
