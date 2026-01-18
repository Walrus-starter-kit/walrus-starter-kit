# Phase 4: Testing & Validation

**Date:** 2026-01-18
**Priority:** High
**Status:** Pending

## Context Links

- [Main Plan](plan.md)
- [Phase 3: Generator](phase-03-generator-updates.md)

## Overview

Update tests to cover zkLogin option, validate CLI flow, ensure backward compatibility.

## Key Insights

- E2E tests in `packages/cli/tests/integration/cli.e2e.test.mjs`
- Unit tests for each module
- Tests use flag-based invocation
- Validation happens before generation

## Requirements

### Functional
- Test zkLogin flag: `--use-zk-login`
- Test prompt flow (simulated)
- Test preset name generation
- Test error when Enoki preset missing
- Backward compatibility: existing tests pass

### Non-Functional
- Fast test execution
- Clear test names
- Isolated test cases

## Related Code Files

**Modify:**
- `packages/cli/src/generator/layers.test.ts` - Unit tests for getPresetName
- `packages/cli/tests/integration/cli.e2e.test.mjs` - E2E test with --use-zk-login

**Add:**
- Test cases for zkLogin scenarios

## Implementation Steps

1. Add unit test for getPresetName with useZkLogin
2. Mock context with useZkLogin=true/false
3. Verify preset names generated correctly
4. Add E2E test with --use-zk-login flag
5. Test error handling when Enoki preset missing
6. Run full test suite
7. Verify all existing tests pass

## Todo List

- [ ] Add unit tests for useZkLogin in layers.test.ts
- [ ] Test preset name: react-mysten-simple-upload-enoki
- [ ] Test combined features: -analytics-enoki
- [ ] Add E2E test with --use-zk-login
- [ ] Test error message when preset missing
- [ ] Run pnpm test:all
- [ ] Verify backward compatibility

## Success Criteria

- All new tests pass
- All existing tests pass
- Preset names correctly generated
- Error messages clear
- Type checking passes

## Test Cases

### Unit Tests (layers.test.ts)
```typescript
describe('getPresetName with zkLogin', () => {
  it('should add -enoki suffix when useZkLogin=true', () => {
    const context = {
      framework: 'react',
      sdk: 'mysten',
      useCase: 'simple-upload',
      useZkLogin: true,
    };
    expect(getPresetName(context)).toBe('react-mysten-simple-upload-enoki');
  });

  it('should sort features alphabetically', () => {
    const context = {
      framework: 'react',
      sdk: 'mysten',
      useCase: 'simple-upload',
      analytics: true,
      useZkLogin: true,
    };
    expect(getPresetName(context)).toBe('react-mysten-simple-upload-analytics-enoki');
  });
});
```

### E2E Test
```javascript
// Test CLI with zkLogin flag
const result = await runCLI([
  'test-zk-login',
  '--sdk', 'mysten',
  '--framework', 'react',
  '--use-case', 'simple-upload',
  '--use-zk-login',
  '--skip-install',
]);

// Should fail if preset doesn't exist (expected for now)
// Should succeed once preset is implemented
```

## Risk Assessment

**Low Risk:**
- Tests additive
- No changes to existing logic (only additions)

## Security Considerations

- N/A (tests only)

## Next Steps

- Code review
- Documentation update
- Implement Enoki preset (separate task)
