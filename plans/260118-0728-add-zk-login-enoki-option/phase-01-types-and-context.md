# Phase 1: Types & Context

**Date:** 2026-01-18
**Priority:** High
**Status:** Pending

## Context Links

- [Main Plan](plan.md)
- [Enoki Research](d:\Sui\walrus-starter-kit\plans\reports\researcher-260118-0728-enoki-zk-login.md)
- [Scout: CLI Core](d:\Sui\walrus-starter-kit\plans\reports\scout-260118-0728-cli-core-flow.md)

## Overview

Add `useZkLogin` boolean flag to CLI types and context to track whether user wants Enoki zkLogin integration.

## Key Insights

- Context is single source of truth for project config
- Types defined in `packages/cli/src/types.ts`
- Context built in `packages/cli/src/context.ts`
- Optional features should default to `false`

## Requirements

### Functional
- Add `useZkLogin?: boolean` to Context interface
- Handle flag in `buildContext` function
- Support both CLI flag and prompt input

### Non-Functional
- Maintain type safety
- Follow existing patterns (analytics, tailwind)
- Backward compatible

## Related Code Files

**Modify:**
- `packages/cli/src/types.ts` - Add type definition
- `packages/cli/src/context.ts` - Handle in buildContext
- `packages/cli/src/index.ts` - Add CLI option flag

## Implementation Steps

1. Add `useZkLogin?: boolean` to Context interface in types.ts
2. Add optional CLI flag `--use-zk-login` in index.ts
3. Update buildContext to handle useZkLogin from options/prompts
4. Set default value to false
5. Compile and verify types

## Todo List

- [ ] Update Context interface in types.ts
- [ ] Add CLI option in index.ts
- [ ] Update buildContext in context.ts
- [ ] Verify type checking passes

## Success Criteria

- TypeScript compiles without errors
- Context includes useZkLogin field
- CLI accepts --use-zk-login flag
- Default value is false

## Risk Assessment

**Low Risk:**
- Simple type addition
- Non-breaking change
- Follows existing patterns

## Security Considerations

- N/A (type-level only)

## Next Steps

- Phase 2: Add interactive prompt for zkLogin
