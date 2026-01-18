# Phase 05: Documentation & Setup Guide

## Context Links

- Simple-upload README: `packages/cli/presets/react-mysten-simple-upload/README.md`
- Enoki template README: `templates/enoki/README.md`
- .env.example: Created in Phase 01

## Overview

**Priority:** P2
**Status:** pending
**Description:** Write comprehensive documentation covering Enoki setup, OAuth configuration, troubleshooting

## Key Insights

- Users need Enoki Console account for API key
- Google Cloud Console setup required for OAuth
- Redirect URI must match exactly
- Common errors: missing env vars, OAuth mismatch
- Both auth methods documented

## Requirements

### Functional
- Step-by-step Enoki Console setup
- Google OAuth configuration guide
- Environment variable reference
- Troubleshooting common issues
- Deployment instructions for Walrus Sites

### Non-Functional
- Clear, concise language
- Code examples for all configs
- Screenshots optional but helpful
- Searchable error messages

## Architecture

```
README.md Structure:
1. Quick Start
   ├─ Installation
   ├─ Environment Setup
   └─ Run Dev Server

2. Features
   ├─ Google zkLogin Auth
   ├─ File Upload/Download
   └─ Dual Wallet Support

3. Setup Guides
   ├─ Enoki Console Configuration
   ├─ Google OAuth Setup
   └─ Environment Variables

4. Usage
   ├─ Google Login Flow
   ├─ Standard Wallet Flow
   └─ Upload/Download Files

5. Deployment
   ├─ Walrus Sites Setup
   ├─ Build & Deploy
   └─ OAuth Redirect Config

6. Troubleshooting
   ├─ Auth Errors
   ├─ Upload Failures
   └─ Environment Issues

7. Code Structure
8. Available Scripts
```

## Related Code Files

### To Create
- `README.md` - Main documentation
- `SETUP_GUIDE.md` - Optional detailed setup

### To Reference
- `packages/cli/presets/react-mysten-simple-upload/README.md` - Base structure
- `.env.example` - Environment reference

## Implementation Steps

1. Create README.md header section
   ```md
   # {{projectName}}

   Simple Upload Walrus application with Enoki zkLogin authentication.

   ## Features

   - 🔐 Google OAuth zkLogin authentication
   - 📤 Upload files to Walrus
   - 📥 Download files by Blob ID
   - 💰 Gasless transactions via Enoki sponsorship
   - 🔄 Dual wallet support (zkLogin + standard wallets)
   ```

2. Write Enoki Console setup section
   - Create account at enoki.mystenlabs.com
   - Create new project
   - Copy API key
   - Enable Google OAuth provider
   - Set redirect URIs

3. Write Google OAuth setup section
   - Create project in Google Cloud Console
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs
   - Copy Client ID

4. Document environment variables
   ```md
   ## Environment Setup

   Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

   Required variables:

   | Variable | Description | Example |
   |----------|-------------|---------|
   | VITE_ENOKI_API_KEY | Public API key from Enoki Console | enoki_public_xxx |
   | VITE_GOOGLE_CLIENT_ID | OAuth Client ID from Google | xxx.apps.googleusercontent.com |
   | VITE_SUI_NETWORK | Sui network (testnet/mainnet) | testnet |
   ```

5. Write usage guide
   - How to login with Google
   - How to connect standard wallet
   - Upload file flow
   - Download file flow
   - Logout process

6. Add troubleshooting section
   ```md
   ## Troubleshooting

   ### "VITE_ENOKI_API_KEY required" error
   - Ensure `.env` file exists with all required variables
   - Restart dev server after changing `.env`

   ### "Redirect URI mismatch" error
   - Verify redirect URI in Google Console matches exactly
   - For dev: http://localhost:5173/auth
   - For production: https://yourdomain.com/auth

   ### Upload fails with zkLogin
   - Check Enoki sponsorship balance in console
   - Verify Sui network matches in .env and Enoki project
   ```

7. Document deployment to Walrus Sites
   - Copy deployment section from simple-upload README
   - Add note about OAuth redirect URI for production
   - Update with Enoki-specific considerations

8. Add code structure section
   ```md
   ## Code Structure

   - `src/components/features/` - Upload, download, auth UI
   - `src/hooks/` - Upload, wallet, Enoki auth hooks
   - `src/providers/` - Enoki, Wallet, Query providers
   - `src/lib/enoki/` - Enoki configuration and storage
   - `src/lib/walrus/` - Walrus upload/download logic
   ```

9. List available scripts
   - Copy from simple-upload README
   - Keep Walrus Sites deployment scripts

10. Add links to external docs
    - Enoki documentation
    - Walrus documentation
    - Google OAuth docs

## Todo List

- [ ] Create README.md file
- [ ] Write features section
- [ ] Document Enoki Console setup
- [ ] Document Google OAuth setup
- [ ] Create environment variables reference table
- [ ] Write usage guide for Google login
- [ ] Write usage guide for wallet connect
- [ ] Add troubleshooting section
- [ ] Document deployment to Walrus Sites
- [ ] Add code structure overview
- [ ] List available scripts
- [ ] Add links to external documentation
- [ ] Proofread for clarity and accuracy

## Success Criteria

- All setup steps documented clearly
- Environment variables explained
- Common errors covered in troubleshooting
- External documentation linked
- Code examples syntax-highlighted
- Deployment instructions complete
- Under 200 lines total

## Risk Assessment

**Low Risk:**
- Documentation doesn't affect code

**Mitigation:**
- Review against actual implementation
- Test setup steps on fresh install

## Security Considerations

- Document security best practices
- Warn against committing .env files
- Explain sessionStorage vs localStorage choice
- Note HTTPS requirement for production OAuth

## Next Steps

→ Phase 06: Manual testing and validation
