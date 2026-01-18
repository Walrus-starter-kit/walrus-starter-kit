# CI/CD Publish Failure: semantic-release GitHub Packages

**Date:** 2026-01-18 07:01:35
**Agent:** debugger (a862ba1)
**Workflow:** Release to NPM
**Run ID:** 21102871371
**Status:** ❌ Failed

---

## Executive Summary

semantic-release publish step failed when attempting dual-publish to npm registry and GitHub Packages. First publish to npmjs.org succeeded, but second publish to GitHub Packages failed with 403 Forbidden error.

**Impact:** Package v2.0.0 published to npm but not GitHub Packages. Workflow fails, blocks automation.

**Root Cause:** GitHub token permissions insufficient for GitHub Packages publish operation.

---

## Technical Analysis

### Timeline of Events

1. **00:00:32** - semantic-release determines new version: 2.0.0 (major)
2. **00:00:36** - First publish attempt to npmjs.org initiated
3. **00:00:37** - ✅ SUCCESS: `+ @blu1606/create-walrus-app@2.0.0` published to npm
4. **00:00:38** - prepublishOnly hook runs (tsc rebuild)
5. **00:00:40** - Second publish attempt to GitHub Packages initiated
6. **00:00:40** - ❌ FAILURE: 403 Forbidden error
   ```
   npm error 403 403 Forbidden - PUT https://npm.pkg.github.com/@blu1606%2fcreate-walrus-app
   npm error Permission permission_denied: The requested installation does not exist.
   ```

### Failure Point Analysis

**Command executed:**
```bash
echo '//registry.npmjs.org/:_authToken='$NPM_TOKEN > .npmrc && \
pnpm publish --access public --no-git-checks && \
echo '@blu1606:registry=https://npm.pkg.github.com' > .npmrc && \
echo '//npm.pkg.github.com/:_authToken='$NODE_AUTH_TOKEN >> .npmrc && \
pnpm publish --registry=https://npm.pkg.github.com --no-git-checks
```

**Execution breakdown:**
- ✅ Step 1: npm publish succeeded
- ❌ Step 2: GitHub Packages publish failed with exit code 1

### Root Cause

GitHub Packages publish failed due to **permissions/scope mismatch**:

**Error message analysis:**
```
Permission permission_denied: The requested installation does not exist.
```

This indicates one of:
1. **GITHUB_TOKEN** lacks `packages: write` permission
2. Package scope `@blu1606` doesn't match repository owner `Walrus-starter-kit`
3. GitHub Packages not initialized for this scope/repo

**Current workflow permissions:**
```yaml
permissions:
  contents: write
  id-token: write
  # Missing: packages: write
```

**Environment variables:**
- `NPM_TOKEN`: ${{ secrets.NPM_TOKEN }} - works for npmjs.org
- `NODE_AUTH_TOKEN`: ${{ secrets.GITHUB_TOKEN }} - insufficient for GitHub Packages
- `GITHUB_TOKEN`: ${{ secrets.GITHUB_TOKEN }} - same token as NODE_AUTH_TOKEN

### Configuration Issues

**1. Workflow permissions insufficient**
- File: `.github/workflows/release.yml`
- Missing: `packages: write` permission

**2. Package scope mismatch**
- Package name: `@blu1606/create-walrus-app`
- Repository owner: `Walrus-starter-kit`
- GitHub Packages expects: `@walrus-starter-kit/create-walrus-app` OR personal token for `@blu1606`

**3. Dual-publish strategy flaws**
- Single .npmrc file overwritten between publishes
- No validation before second publish
- No rollback mechanism if GitHub publish fails

---

## Recommended Solutions

### Priority 1: Fix GitHub Token Permissions ⚡

**Update `.github/workflows/release.yml`:**
```yaml
permissions:
  contents: write
  id-token: write
  packages: write  # ADD THIS
```

**Impact:** Allows GITHUB_TOKEN to publish to GitHub Packages
**Risk:** Low
**Effort:** 1 minute

---

### Priority 2: Align Package Scope with Repository 🎯

**Option A: Use repository owner scope (recommended)**

Update `packages/cli/package.json`:
```json
{
  "name": "@walrus-starter-kit/create-walrus-app",
  // ...
}
```

Update `packages/cli/.releaserc.json`:
```json
{
  "tagFormat": "@walrus-starter-kit/create-walrus-app-v${version}",
  // ...
  "publishCmd": "... echo '@walrus-starter-kit:registry=https://npm.pkg.github.com' > .npmrc ..."
}
```

**Pros:** Aligns with GitHub org, no personal token needed
**Cons:** Changes package name (breaking for users if already published)

**Option B: Use personal access token for @blu1606 scope**

Add `GITHUB_PACKAGES_TOKEN` secret with PAT from blu1606 account:
- Token needs: `write:packages` scope
- Update workflow env: `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_PACKAGES_TOKEN }}`

**Pros:** Keeps current package name
**Cons:** Requires personal token management

---

### Priority 3: Improve Publish Strategy 🔧

**Update `.releaserc.json` publishCmd to handle errors:**

```json
{
  "publishCmd": "set -e && echo '//registry.npmjs.org/:_authToken='$NPM_TOKEN > .npmrc && pnpm publish --access public --no-git-checks && echo '@blu1606:registry=https://npm.pkg.github.com' > .npmrc && echo '//npm.pkg.github.com/:_authToken='$NODE_AUTH_TOKEN >> .npmrc && pnpm publish --registry=https://npm.pkg.github.com --no-git-checks || (echo 'GitHub Packages publish failed but npm succeeded' && exit 0)"
}
```

**Alternative: Use @semantic-release/npm plugin instead of exec**

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["@semantic-release/npm", {
      "npmPublish": true,
      "pkgRoot": "."
    }],
    ["@semantic-release/github", {
      "assets": [],
      "successComment": false,
      "failComment": false,
      "releasedLabels": false
    }]
  ]
}
```

Then handle GitHub Packages separately or remove dual-publish requirement.

---

### Priority 4: Consider Removing GitHub Packages Publish 💭

**Questions to ask:**
- Is GitHub Packages actually needed?
- Are users consuming package from GitHub Packages?
- Is dual-publish worth the complexity?

**If not needed:**
```json
{
  "publishCmd": "echo '//registry.npmjs.org/:_authToken='$NPM_TOKEN > .npmrc && pnpm publish --access public --no-git-checks"
}
```

**Impact:** Simplifies pipeline, reduces failure points
**Risk:** Low if GitHub Packages not in use

---

## Implementation Plan

**Immediate fix (choose one):**

**Path A: Keep dual-publish**
1. Add `packages: write` to workflow permissions
2. Choose scope alignment strategy (Option A or B)
3. Update package name or add PAT secret
4. Test workflow with dry-run

**Path B: Remove GitHub Packages**
1. Update `.releaserc.json` to only publish to npm
2. Remove GitHub Packages publish command
3. Test workflow

**Recommended:** Path A + Option A (align scope with repo owner)

---

## Verification Steps

After implementing fix:

1. **Trigger workflow manually**
   ```bash
   gh workflow run release.yml
   ```

2. **Monitor logs**
   ```bash
   gh run watch
   ```

3. **Verify both publishes succeed**
   - npmjs.org: https://www.npmjs.com/package/@walrus-starter-kit/create-walrus-app
   - GitHub: https://github.com/Walrus-starter-kit/walrus-starter-kit/packages

4. **Test installation**
   ```bash
   npm install @walrus-starter-kit/create-walrus-app@2.0.0
   ```

---

## Supporting Evidence

**Log excerpts:**

```
[Success] npm publish to registry.npmjs.org
+ @blu1606/create-walrus-app@2.0.0

[Failure] GitHub Packages publish
npm error code E403
npm error 403 403 Forbidden - PUT https://npm.pkg.github.com/@blu1606%2fcreate-walrus-app
npm error Permission permission_denied: The requested installation does not exist.
```

**Current configuration:**
- Workflow: `.github/workflows/release.yml`
- Release config: `packages/cli/.releaserc.json`
- Package: `packages/cli/package.json`
- Permissions: `contents: write`, `id-token: write` (missing `packages: write`)

---

## Risk Assessment

**If not fixed:**
- Package only available on npm, not GitHub Packages
- Workflow continues to fail on every release
- Developers receive confusing error messages
- Automation broken for GitHub Packages consumers

**Mitigation:**
- First publish to npm succeeded, so users can still install
- No code functionality affected
- Only distribution channel impacted

---

## Security Considerations

**Token exposure:**
- NPM_TOKEN: Properly stored in secrets ✅
- GITHUB_TOKEN: Auto-generated, scoped ✅
- No credentials leaked in logs ✅

**Recommendations:**
- If using PAT, rotate regularly
- Limit PAT scope to `write:packages` only
- Consider using fine-grained PAT with repo-specific access

---

## Next Steps

1. **Decide:** Keep dual-publish or remove GitHub Packages?
2. **If keeping:** Choose scope alignment strategy
3. **Implement:** Update workflow permissions + package name/token
4. **Test:** Trigger release workflow manually
5. **Monitor:** Verify both publishes succeed
6. **Document:** Update README with install instructions for both registries

---

## Unresolved Questions

- Is GitHub Packages actively used by consumers?
- Should package name change from `@blu1606` to `@walrus-starter-kit`?
- Is there a business requirement for dual-publish?
- Should we use @semantic-release/npm plugin instead of exec?
