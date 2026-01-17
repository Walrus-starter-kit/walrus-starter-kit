# NPM Token Setup Guide

This document explains how to configure the NPM_TOKEN for publishing `@blu1606/create-walrus-app` to npm registry.

## Required Token Type

The package uses **npm provenance** (supply chain security feature), which requires one of:

1. **npm Automation Token** (RECOMMENDED) ✅
2. Classic Token with 2FA bypass enabled

> ⚠️ Regular classic tokens will NOT work due to provenance requirement.

## Step-by-Step Setup

### Option A: npm Automation Token (Recommended)

1. **Go to npm token settings:**
   - Visit: https://www.npmjs.com/settings/blu1606/tokens
   - Click "Generate New Token"

2. **Select token type:**
   - Choose **"Automation"** (not "Classic")
   - Token type: Automation (automatically bypasses 2FA)

3. **Configure permissions:**
   - Permissions: **Read and write**
   - Expiration: No expiration (automation tokens don't expire)

4. **Copy the token** (you won't see it again!)

5. **Update GitHub secret:**
   ```bash
   # Using GitHub CLI
   gh secret set NPM_TOKEN
   # Paste the token when prompted
   ```

   Or via GitHub web UI:
   - Go to: https://github.com/blu1606/walrus-starter-kit/settings/secrets/actions
   - Update NPM_TOKEN with the new token

### Option B: Classic Token with 2FA Bypass

1. Generate Classic token at: https://www.npmjs.com/settings/blu1606/tokens
2. Enable "Automation" or "Bypass 2FA" option
3. Ensure permissions include publish access
4. Update GitHub secret (same as Option A)

## Verification

After updating the token, verify it works:

### 1. Test Token Locally

```bash
cd packages/cli

# Temporarily set token (don't commit this!)
echo "//registry.npmjs.org/:_authToken=YOUR_TOKEN" > .npmrc

# Check authentication
npm whoami
# Should output: blu1606

# Clean up
git checkout .npmrc
```

### 2. Check Token Permissions

```bash
npm token list
```

Look for:
- Token type: "automation" or "publish" with 2FA bypass
- Permissions: "read" and "write"

### 3. Test Publish (Dry Run)

```bash
cd packages/cli
npm publish --dry-run
```

Should succeed without authentication errors.

### 4. Trigger GitHub Actions Workflow

```bash
gh workflow run release.yml
```

Monitor the workflow at: https://github.com/blu1606/walrus-starter-kit/actions

## How It Works

### Workflow Configuration

The `.github/workflows/release.yml` sets:

```yaml
env:
  NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

This environment variable is used by npm to authenticate during publishing.

### Provenance Configuration

The `.releaserc.json` enables provenance:

```json
{
  "plugins": [
    ["@semantic-release/npm", {
      "provenance": true  // Requires automation token
    }]
  ]
}
```

### Why Provenance?

npm provenance provides:
- Supply chain security
- Build transparency
- Package attestation
- Cryptographic signatures

More info: https://docs.npmjs.com/generating-provenance-statements

## Troubleshooting

### Error: "Access token expired or revoked"

**Solution:** Generate a new automation token and update GitHub secret.

### Error: "403 Forbidden - Two-factor authentication required"

**Solution:** You're using a classic token without 2FA bypass. Switch to automation token.

### Error: "Cannot read properties of null (reading 'edgesOut')"

**Solution:** This is a secondary error caused by authentication failure. Fix the token first.

### Error: "npm warn config ignoring workspace config"

**Solution:** Already fixed - token is now set via NODE_AUTH_TOKEN in workflow, not in `.npmrc` file.

## Important Notes

✅ **Do:**
- Use automation tokens for CI/CD
- Store tokens as GitHub secrets
- Rotate tokens periodically
- Keep this documentation updated

❌ **Don't:**
- Commit tokens to git
- Use regular classic tokens with provenance
- Add tokens to `.npmrc` in workspace monorepos
- Share tokens between projects

## Token Security

- Tokens are stored securely in GitHub Secrets
- Tokens are never logged in workflow output
- Tokens are scoped to specific npm registry
- Automation tokens don't expire (but can be revoked)

## Alternative: Disable Provenance (Not Recommended)

If you cannot use automation tokens, you can disable provenance:

1. Edit `packages/cli/.releaserc.json`:
   ```json
   ["@semantic-release/npm", {
     "provenance": false  // Changed from true
   }]
   ```

2. Can now use regular classic token

⚠️ **Warning:** This removes supply chain security benefits.

## References

- [npm Automation Tokens](https://docs.npmjs.com/creating-and-viewing-access-tokens#creating-granular-access-tokens-on-the-website)
- [npm Provenance](https://docs.npmjs.com/generating-provenance-statements)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/using-secrets-in-github-actions)
- [Semantic-release npm plugin](https://github.com/semantic-release/npm#options)

## Support

If issues persist after following this guide:

1. Check workflow logs: `gh run list --workflow=release.yml`
2. Verify npm account status at: https://www.npmjs.com/settings/blu1606
3. Check package settings at: https://www.npmjs.com/package/@blu1606/create-walrus-app
4. Review GitHub Actions permissions at: https://github.com/blu1606/walrus-starter-kit/settings/actions
