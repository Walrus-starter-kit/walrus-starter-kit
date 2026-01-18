# CI Path Filters Analysis Report

**Date:** 2026-01-18 07:11
**Agent:** debugger (a191541)
**Context:** d:\Sui\walrus-starter-kit

## Executive Summary

Analyzed GitHub Actions CI configuration to determine optimal path filters. Current workflows run on ALL changes regardless of which folders are modified, causing unnecessary CI runs and resource waste.

**Key Finding:** Both CI and Release workflows trigger for any file change, including documentation, examples, templates, and plans - even when only CLI code needs testing/publishing.

## Current CI Configuration

### CI Workflow (.github/workflows/ci.yml)

**Triggers:**
- Push to: main, develop (ALL files)
- PR to: main, develop (ALL files)

**Jobs:**
1. `lint` - ESLint on all .ts,.tsx files
2. `unit-tests` - Vitest unit tests
3. `integration-tests` - Integration + validation tests
4. `e2e-tests` - End-to-end CLI tests
5. `build` - Build all packages
6. `type-check` - TypeScript type checking
7. `validate-release-config` - Semantic-release config validation

### Release Workflow (.github/workflows/release.yml)

**Triggers:**
- Manual only (workflow_dispatch)

**Jobs:**
1. `release` - Semantic-release to NPM

## Project Structure Analysis

```
walrus-starter-kit/
├── packages/
│   └── cli/                    # CORE: Actual publishable package
│       ├── src/                # TypeScript source code
│       ├── dist/               # Build output
│       ├── presets/            # CLI embedded presets
│       ├── tests/              # Unit + integration tests
│       └── package.json        # @blu1606/create-walrus-app
│
├── templates/                  # Reference templates (copied to CLI presets)
│   ├── base/
│   ├── enoki/
│   ├── gallery/
│   ├── react/
│   ├── sdk-mysten/
│   └── simple-upload/
│
├── examples/                   # Generated test outputs
│   ├── phase-validation/
│   └── validation-tests/
│
├── docs/                       # Documentation files
│   ├── codebase-summary.md
│   ├── code-standards.md
│   ├── design-guidelines.md
│   └── ...
│
├── plans/                      # Planning and reports
│   └── reports/
│
├── .github/workflows/          # CI/CD configurations
└── [root config files]         # eslint, prettier, tsconfig, etc.
```

### Package Locations

**Publishable Package:**
- `packages/cli/` - `@blu1606/create-walrus-app` (v0.1.5)

**Embedded in CLI at publish time:**
- `packages/cli/presets/` - Templates bundled with NPM package

**Not published:**
- `templates/` - Reference only, copied to CLI presets during development
- `examples/` - Test artifacts
- `docs/`, `plans/` - Documentation

## Recent Workflow Runs Analysis

### Failed/Cancelled Runs

1. **Release workflow (21102988326)** - Cancelled by user
2. **Release workflow (21102871371)** - Failed at semantic-release step
3. **CI workflow (21102654207)** - Failed (gallery feature commit)
4. **CI workflow (21101497763)** - Failed (auto-env-copy feature)

### Issues Identified

**From Release workflow logs:**
- Trying to publish version 2.0.0 when package.json has 0.1.5
- Version mismatch suggests semantic-release config issue
- `.releaserc.json` uses custom exec commands for version management

**From CI workflow patterns:**
- CI runs even for documentation-only changes
- Template changes trigger full test suite
- No path filtering means wasted CI minutes

## Recommended Path Filters

### CI Workflow

```yaml
on:
  push:
    branches: [main, develop]
    paths:
      - 'packages/cli/**'
      - '.github/workflows/ci.yml'
      - 'package.json'
      - 'pnpm-lock.yaml'
      - 'pnpm-workspace.yaml'
      - 'tsconfig.json'
      - '.eslintrc.json'
      - '.prettierrc.json'
  pull_request:
    branches: [main, develop]
    paths:
      - 'packages/cli/**'
      - '.github/workflows/ci.yml'
      - 'package.json'
      - 'pnpm-lock.yaml'
      - 'pnpm-workspace.yaml'
      - 'tsconfig.json'
      - '.eslintrc.json'
      - '.prettierrc.json'
```

**Rationale:**
- Only run CI when CLI package changes
- Include workflow file (to test workflow changes)
- Include root config files (affect build/lint/test)
- Include dependency files (affect package resolution)

**Exclude:**
- `docs/**` - Documentation only
- `plans/**` - Planning documents
- `examples/**` - Test outputs
- `templates/**` - Reference only (CLI has own presets/)
- `*.md` files at root (except if in packages/cli/)

### Release Workflow

```yaml
# No path filter needed - manual trigger only (workflow_dispatch)
on:
  workflow_dispatch:
```

**Rationale:**
- Already manual trigger
- User controls when to release
- Path filtering not applicable

## Impact Analysis

### Before Path Filters

- CI runs on: docs changes, plan updates, template modifications, example outputs
- Average CI runs per day: ~15-20 (estimated from logs)
- Unnecessary runs: ~60-70%

### After Path Filters

- CI runs only on: actual code changes, config changes, dependency updates
- Estimated reduction: 60-70% fewer CI runs
- Faster feedback: Developers see relevant CI results only

### Edge Cases

**Templates folder changes:**
- Templates are reference copies
- Actual presets are in `packages/cli/presets/`
- If templates change, developer must manually sync to CLI presets
- CI will catch issues when presets in packages/cli/ change

**Documentation updates:**
- No CI needed for docs-only PRs
- Can add separate docs CI job with different path filter if needed

## Additional Observations

### Semantic Release Configuration Issues

**File:** `packages/cli/.releaserc.json`

```json
{
  "branches": ["main"],
  "tagFormat": "@blu1606/create-walrus-app-v${version}",
  "plugins": [
    ["@semantic-release/exec", {
      "prepareCmd": "node -e \"const fs=require('fs');...\"",
      "publishCmd": "echo '//registry.npmjs.org/:_authToken='$NPM_TOKEN > .npmrc && pnpm publish --access public --no-git-checks"
    }]
  ]
}
```

**Issues:**
- Uses shell command in `prepareCmd` for version update (fragile)
- Version jumping from 0.1.5 → 2.0.0 suggests commit message triggered major bump
- No `@semantic-release/changelog` or `@semantic-release/git` plugins
- Package.json version not committed back to repo

**Recommendation:** Separate issue - needs semantic-release config fix (covered in other reports)

### Coverage Upload Path

**File:** `.github/workflows/ci.yml` line 59

```yaml
- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./packages/cli/coverage/coverage-final.json
```

**Issue:** Hardcoded path assumes coverage file location
**Impact:** If coverage output path changes, upload fails silently
**Recommendation:** Use glob pattern: `./packages/*/coverage/*.json`

## Implementation Priority

1. **High:** Add path filters to CI workflow (immediate cost savings)
2. **Medium:** Fix semantic-release version management (separate task)
3. **Low:** Update coverage upload path (nice-to-have improvement)

## Unresolved Questions

1. Should template changes trigger any validation?
2. Do we need separate CI job for docs linting (markdown, links)?
3. Should examples/ be gitignored completely?
4. What's the sync process from templates/ to packages/cli/presets/?

---

**Next Steps:**
1. Implement path filters in CI workflow
2. Test with documentation-only PR (verify CI skips)
3. Test with CLI code PR (verify CI runs)
4. Monitor CI minutes savings over 1 week
