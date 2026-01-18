# Add zkLogin (Enoki) Option to CLI

**Status:** In Progress
**Priority:** High
**Created:** 2026-01-18

## Overview

Add zkLogin authentication option using Enoki SDK to `create-walrus-app` CLI. When users select Simple Upload or Gallery, they'll be prompted to add Enoki zkLogin integration.

## Objectives

1. Add zkLogin prompt after use-case selection
2. Update types to support `useZkLogin` flag
3. Support preset routing to `react-mysten-{use-case}-enoki`
4. Prepare CLI for future Enoki preset implementation
5. Maintain backward compatibility with existing presets

## Phases

### Phase 1: Types & Context
**File:** [phase-01-types-and-context.md](phase-01-types-and-context.md)
**Status:** Pending
Add `useZkLogin` to Context interface and types

### Phase 2: Prompts Integration
**File:** [phase-02-prompts-integration.md](phase-02-prompts-integration.md)
**Status:** Pending
Add zkLogin confirmation prompt after use-case selection

### Phase 3: Generator Updates
**File:** [phase-03-generator-updates.md](phase-03-generator-updates.md)
**Status:** Pending
Update preset name resolution to support `-enoki` suffix

### Phase 4: Testing & Validation
**File:** [phase-04-testing-validation.md](phase-04-testing-validation.md)
**Status:** Pending
Update tests and validate integration

## Dependencies

- Enoki preset implementation (separate task)
- CLI build system

## Success Criteria

- [ ] zkLogin prompt appears after use-case selection
- [ ] Context includes `useZkLogin` boolean
- [ ] Generator routes to correct preset name
- [ ] Existing presets still work
- [ ] Tests pass

## Related Reports

- [Research: Enoki zkLogin](d:\Sui\walrus-starter-kit\plans\reports\researcher-260118-0728-enoki-zk-login.md)
- [Scout: CLI Core Flow](d:\Sui\walrus-starter-kit\plans\reports\scout-260118-0728-cli-core-flow.md)
- [Scout: Generator](d:\Sui\walrus-starter-kit\plans\reports\scout-260118-0728-cli-generator.md)
- [Scout: Matrix](d:\Sui\walrus-starter-kit\plans\reports\scout-260118-0728-cli-matrix.md)
