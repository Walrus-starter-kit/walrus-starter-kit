# Phase 2: Prompts Integration

**Date:** 2026-01-18
**Priority:** High
**Status:** Pending

## Context Links

- [Main Plan](plan.md)
- [Phase 1: Types](phase-01-types-and-context.md)
- [Enoki Research](d:\Sui\walrus-starter-kit\plans\reports\researcher-260118-0728-enoki-zk-login.md)

## Overview

Add interactive prompt asking "Use zkLogin (Enoki) authentication?" after user selects use-case. Only show for mysten SDK with simple-upload or gallery.

## Key Insights

- Prompts in `packages/cli/src/prompts.ts`
- Uses `prompts` library with type: 'confirm'
- Conditional prompts use `type: condition ? 'confirm' : null`
- Results merged into context

## Requirements

### Functional
- Prompt appears AFTER use-case selection
- Only show if SDK is 'mysten'
- Only show if use-case is 'simple-upload' or 'gallery'
- Question: "Use zkLogin (Enoki) authentication?"
- Default: false
- Skip if --use-zk-login flag provided

### Non-Functional
- User-friendly messaging
- Help text explaining Enoki
- Consistent with existing prompts

## Related Code Files

**Modify:**
- `packages/cli/src/prompts.ts` - Add zkLogin prompt

## Implementation Steps

1. Add new prompt after use-case selection
2. Condition: only if SDK='mysten' AND useCase in ['simple-upload', 'gallery']
3. Set type: 'confirm'
4. Message: "Use zkLogin (Enoki) authentication?"
5. Add help hint about what Enoki provides
6. Skip if initial.useZkLogin already set
7. Default to false

## Todo List

- [ ] Add zkLogin prompt to prompts array
- [ ] Add conditional logic based on SDK/use-case
- [ ] Test interactive flow
- [ ] Test non-interactive mode
- [ ] Verify skip logic works

## Success Criteria

- Prompt appears for mysten + simple-upload
- Prompt appears for mysten + gallery
- Prompt skipped for other combinations
- Prompt skipped if --use-zk-login flag present
- Response captured in context

## Code Example

```typescript
{
  type: (prev, answers) => {
    const sdk = initial.sdk || answers.sdk;
    const useCase = answers.useCase;

    // Only show for mysten SDK with simple-upload or gallery
    if (sdk !== 'mysten') return null;
    if (!['simple-upload', 'gallery'].includes(useCase)) return null;
    if (initial.useZkLogin !== undefined) return null;

    return 'confirm';
  },
  name: 'useZkLogin',
  message: 'Use zkLogin (Enoki) authentication? (Web2 login with Google/Apple)',
  initial: false,
}
```

## Risk Assessment

**Low Risk:**
- Non-breaking addition
- Conditional prompt
- Defaults to false (existing behavior)

## Security Considerations

- N/A (prompt only)

## Next Steps

- Phase 3: Update generator to handle Enoki presets
