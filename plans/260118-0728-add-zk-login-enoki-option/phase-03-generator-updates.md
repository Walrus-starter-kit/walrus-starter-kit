# Phase 3: Generator Updates

**Date:** 2026-01-18
**Priority:** High
**Status:** Pending

## Context Links

- [Main Plan](plan.md)
- [Phase 2: Prompts](phase-02-prompts-integration.md)
- [Scout: Generator](d:\Sui\walrus-starter-kit\plans\reports\scout-260118-0728-cli-generator.md)

## Overview

Update preset name resolution to include `-enoki` suffix when `useZkLogin` is true. Route to `react-mysten-{use-case}-enoki` presets.

## Key Insights

- Preset names resolved in `packages/cli/src/generator/layers.ts`
- Pattern: `{framework}-{sdk}-{useCase}[-features]`
- Optional features sorted alphabetically
- Generator throws error if preset path doesn't exist

## Requirements

### Functional
- Append `-enoki` to preset name if useZkLogin=true
- Example: `react-mysten-simple-upload-enoki`
- Maintain existing preset resolution for useZkLogin=false
- Provide helpful error if Enoki preset missing

### Non-Functional
- Follow existing pattern (analytics/tailwind)
- Alphabetical feature sorting
- Clear error messages

## Related Code Files

**Modify:**
- `packages/cli/src/generator/layers.ts` - Update getPresetName()
- `packages/cli/src/generator/index.ts` - Error messaging

## Implementation Steps

1. Read current implementation of getPresetName()
2. Add useZkLogin to optional features array
3. Sort features alphabetically (analytics, enoki, tailwind)
4. Update feature name mapping
5. Test preset name generation
6. Update error message if preset not found

## Todo List

- [ ] Update getPresetName to include zkLogin
- [ ] Add to optional features list
- [ ] Ensure alphabetical sorting
- [ ] Update error messaging
- [ ] Test with mock contexts

## Success Criteria

- `useZkLogin=true` → preset name includes `-enoki`
- `useZkLogin=false` → original preset name
- Features sorted alphabetically
- Helpful error if Enoki preset missing
- Backward compatible

## Code Example

```typescript
// In getPresetName()
const optionalFeatures: string[] = [];

if (context.analytics) {
  optionalFeatures.push('analytics');
}

if (context.useZkLogin) {
  optionalFeatures.push('enoki');
}

if (context.tailwind) {
  optionalFeatures.push('tailwind');
}

// Sort alphabetically
optionalFeatures.sort();

const featureSuffix = optionalFeatures.length > 0
  ? `-${optionalFeatures.join('-')}`
  : '';

return `${framework}-${sdk}-${useCase}${featureSuffix}`;
```

## Expected Preset Names

| useZkLogin | Analytics | Preset Name |
|------------|-----------|-------------|
| false | false | `react-mysten-simple-upload` |
| true | false | `react-mysten-simple-upload-enoki` |
| false | true | `react-mysten-simple-upload-analytics` |
| true | true | `react-mysten-simple-upload-analytics-enoki` |

## Risk Assessment

**Medium Risk:**
- Breaking if preset doesn't exist
- **Mitigation:** Clear error message, document preset requirement

## Security Considerations

- Path validation already exists in validatePresetPath()

## Next Steps

- Phase 4: Update tests and validation
- Implement Enoki preset (separate task)
