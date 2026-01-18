# Phase 06: Testing & Validation

## Context Links

- Entire preset: `packages/cli/presets/react-mysten-simple-upload-enoki/`
- Test examples: `examples/` (after scaffolding)

## Overview

**Priority:** P1
**Status:** pending
**Description:** Manual testing of all auth flows, upload/download, environment config, error scenarios

## Key Insights

- No automated tests for presets (scaffolded code)
- Manual testing covers user journey
- Test both happy paths and error cases
- Validate environment config validation works
- Test on fresh scaffold (not dev environment)

## Requirements

### Functional
- Google OAuth login succeeds
- Standard wallet connect succeeds
- File upload with both auth methods
- File download by Blob ID
- Logout clears session correctly
- Error handling works as expected

### Non-Functional
- Tests completed in under 2 hours
- All scenarios documented
- Issues logged with reproduction steps
- Performance acceptable (upload < 30s)

## Architecture

```
Test Scenarios:
1. Environment Setup
   ├─ Missing env vars
   ├─ Invalid env vars
   └─ Valid env vars

2. Authentication
   ├─ Google OAuth login
   ├─ Standard wallet connect
   ├─ Session persistence
   └─ Logout flows

3. Upload/Download
   ├─ Upload with zkLogin
   ├─ Upload with wallet
   ├─ Download by Blob ID
   └─ Error scenarios

4. Integration
   ├─ Preset scaffolding
   ├─ Dev server start
   ├─ Production build
   └─ Walrus Sites deploy
```

## Related Code Files

### To Test
- All files in `packages/cli/presets/react-mysten-simple-upload-enoki/`

### To Create
- Test report in `plans/reports/tester-*.md`

## Implementation Steps

### 1. Environment Configuration Tests

**Test 1.1: Missing env vars**
1. Scaffold preset: `pnpm --filter @mysten/create-walrus-app dev`
2. Select `react-mysten-simple-upload-enoki`
3. Don't create .env file
4. Run `pnpm dev`
5. **Expected:** Clear error message about missing VITE_ENOKI_API_KEY

**Test 1.2: Invalid env vars**
1. Create .env with invalid values (e.g., empty strings)
2. Run `pnpm dev`
3. **Expected:** Zod validation error with field name

**Test 1.3: Valid env vars**
1. Create .env with real Enoki + Google credentials
2. Run `pnpm dev`
3. **Expected:** Dev server starts successfully

### 2. Authentication Tests

**Test 2.1: Google OAuth login**
1. Start dev server with valid env
2. Click "Login with Google" button
3. Complete OAuth flow in browser
4. **Expected:**
   - Redirects to Google login
   - Returns to app at /auth
   - Shows zkLogin address in UI
   - Session persists on page refresh

**Test 2.2: Standard wallet connect**
1. Start dev server
2. Click "Connect Wallet" button (not Google login)
3. Connect Sui wallet (e.g., Sui Wallet extension)
4. **Expected:**
   - Wallet modal appears
   - Connection succeeds
   - Wallet address shown in UI

**Test 2.3: Session persistence**
1. Login with Google
2. Refresh page
3. **Expected:** Still logged in (session restored)

**Test 2.4: Logout**
1. Login with Google
2. Click logout button
3. **Expected:**
   - Address removed from UI
   - sessionStorage cleared
   - Shows login button again

### 3. Upload/Download Tests

**Test 3.1: Upload with zkLogin**
1. Login with Google
2. Select test file (< 10MB)
3. Click "Upload to Walrus"
4. **Expected:**
   - Upload completes without wallet popup
   - Blob ID displayed
   - Success message shown

**Test 3.2: Upload with standard wallet**
1. Connect standard wallet (not Google)
2. Select test file
3. Click upload
4. **Expected:**
   - Wallet approval prompt appears
   - Upload succeeds after approval
   - Blob ID returned

**Test 3.3: Download by Blob ID**
1. Copy Blob ID from upload test
2. Paste in download field
3. Click "Download File"
4. **Expected:**
   - File downloads correctly
   - File content matches original
   - MIME type preserved

**Test 3.4: Upload without auth**
1. Don't login or connect wallet
2. Try to upload file
3. **Expected:** Error "No wallet connected. Please login with Google or connect a wallet."

### 4. Integration Tests

**Test 4.1: Preset scaffolding**
1. Run CLI: `pnpm --filter @mysten/create-walrus-app dev`
2. Select preset
3. Enter project name
4. **Expected:**
   - All files copied correctly
   - package.json has correct name
   - .env.example exists

**Test 4.2: TypeScript compilation**
1. In scaffolded project: `pnpm type-check`
2. **Expected:** No TypeScript errors

**Test 4.3: Production build**
1. Run `pnpm build`
2. **Expected:**
   - Build succeeds
   - dist/ folder created
   - No console errors

**Test 4.4: Walrus Sites deployment** (optional)
1. Run `pnpm setup-walrus-deploy`
2. Configure SUI private key
3. Run `pnpm build && pnpm deploy:walrus`
4. **Expected:** Site deploys successfully

### 5. Error Scenarios

**Test 5.1: Invalid OAuth redirect**
1. Change Google Client ID to invalid value
2. Try Google login
3. **Expected:** Clear error message

**Test 5.2: Network mismatch**
1. Set Enoki project to mainnet
2. Set .env to testnet
3. Try upload
4. **Expected:** Upload fails with network error

**Test 5.3: Large file upload**
1. Select file > 100MB
2. Try upload
3. **Expected:** Error or progress indicator (depending on implementation)

## Todo List

### Environment Tests
- [ ] Test missing VITE_ENOKI_API_KEY
- [ ] Test missing VITE_GOOGLE_CLIENT_ID
- [ ] Test invalid env values
- [ ] Test valid env configuration

### Authentication Tests
- [ ] Test Google OAuth complete flow
- [ ] Test OAuth redirect callback
- [ ] Test session persistence on refresh
- [ ] Test logout clears session
- [ ] Test standard wallet connect
- [ ] Test wallet disconnect

### Upload/Download Tests
- [ ] Upload with zkLogin (small file)
- [ ] Upload with standard wallet
- [ ] Upload without any auth (error case)
- [ ] Download by Blob ID
- [ ] Verify file integrity after download

### Integration Tests
- [ ] Scaffold preset via CLI
- [ ] Verify all files copied
- [ ] Run type-check (no errors)
- [ ] Run dev server
- [ ] Build production bundle
- [ ] (Optional) Deploy to Walrus Sites

### Error Scenarios
- [ ] Invalid Google Client ID
- [ ] Network mismatch error
- [ ] Missing Enoki sponsorship balance
- [ ] Large file handling

### Documentation
- [ ] Create test report
- [ ] Log all issues found
- [ ] Document reproduction steps
- [ ] Verify README accuracy

## Success Criteria

- All authentication flows work correctly
- Upload succeeds with both auth methods
- Download retrieves correct file
- Environment validation catches errors
- Session persistence works as expected
- TypeScript compilation succeeds
- Production build completes
- No console errors in happy path
- Error messages clear and helpful
- Test report documents all findings

## Risk Assessment

**Medium Risk:**
- Enoki/Google OAuth config might fail
- Network issues during upload tests
- Missing test credentials

**Mitigation:**
- Document all credentials needed beforehand
- Test with multiple file sizes/types
- Keep test files small for faster iteration
- Use testnet to avoid real costs

## Security Considerations

- Use test API keys (not production)
- Don't commit test credentials
- Verify sessionStorage isolation
- Test logout completely clears auth

## Next Steps

After testing complete:
- Fix any issues found
- Update documentation based on findings
- Create test report in plans/reports/
- Mark plan as complete

## Unresolved Questions

- Should we test Enoki sponsorship depletion scenario?
- Need to test on multiple browsers?
- Performance benchmarks required?
