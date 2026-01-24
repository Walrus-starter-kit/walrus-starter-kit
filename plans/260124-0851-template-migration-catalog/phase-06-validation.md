# Phase 06 — Validation & Acceptance

## Goal

Verify the migration with specific questions and acceptance criteria.

## Validation Questions (Selection)

1. Does the generated project compile with `tsc --noEmit` for all allowed combinations?
2. Are all selected capabilities (e.g., Enoki zkLogin) correctly wired into the `providers/` composition?
3. Does the `.env` file contain all required variables for the selected slices?
4. Is there any "ghost code" (unused imports/files) from slices that were NOT selected?
5. Do the deployment scripts (e.g., `setup-walrus-deploy.sh`) correctly reflect the project configuration?
6. Is the `package.json` clean of redundant dependencies from unselected capabilities?

## Acceptance Criteria

- [ ] Catalog layout matches the approved Phase 02 spec.
- [ ] Gating rules correctly prevent invalid combinations (e.g., Enoki without Mysten).
- [ ] Generator uses an in-memory Virtual FS for composition.
- [ ] All 3 current use cases (simple-upload, gallery, enoki-upload) can be generated via the catalog.
- [ ] Documentation (READMEs) is correctly composed from slice-specific docs.
- [ ] CI/CD pipeline is updated to test catalog-based generation.
