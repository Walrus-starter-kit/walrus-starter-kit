# Phase 05 — Migration Plan

## Goal

Outline the step-by-step process to move assets from current presets/layers into the new catalog structure.

## Steps

1. **Prepare Catalog Package**: Initialize `packages/templates/catalog` with the layout defined in Phase 02.
2. **Migrate Base**: Extract base monorepo config from `templates/base` and `packages/templates/react-mysten-simple-upload` (package.json, tsconfig, linting).
3. **Extract Frameworks**:
   - Create `framework/react` from `templates/react`.
   - Ensure clean separation from SDK logic.
4. **Decompose Presets into Capabilities**:
   - Extract `walrus-mysten` storage adapter from `react-mysten-simple-upload`.
   - Extract `enoki-zklogin` from `react-mysten-simple-upload-enoki`.
5. **Extract Features**:
   - Move `simple-upload` UI/logic to `feature/simple-upload`.
   - Move `gallery` UI/logic to `feature/gallery`.
6. **Update CLI Generator**:
   - Point CLI to the new catalog structure.
   - Replace preset copying logic with the composable composer from Phase 04.
7. **Cleanup**:
   - Remove legacy `templates/` folder (or move to `archive/`).
   - Remove monolithic presets from `packages/templates/`.
   - Fix broken symlinks.

## Exit Criteria

- CLI generates identical functional output as current presets but using the catalog.
- `packages/templates` contains only the `catalog/` and shared assets.
- All integration tests pass.
