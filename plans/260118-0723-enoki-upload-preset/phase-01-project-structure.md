# Phase 01: Project Structure Setup

## Context Links

- Base preset: `packages/cli/presets/react-mysten-simple-upload/`
- Enoki template: `templates/enoki/`
- Target directory: `packages/cli/presets/react-mysten-simple-upload-enoki/`

## Overview

**Priority:** P1
**Status:** complete ✓
**Completed:** 2026-01-18
**Description:** Setup project structure, copy base files, configure dependencies

## Key Insights

- Preset structure matches simple-upload exactly
- Add Enoki deps: `@mysten/enoki@^0.15.0`, `zod@^3.22.0`
- Keep all existing deps from simple-upload
- Environment vars need VITE_ prefix (not NEXT_PUBLIC_)

## Requirements

### Functional
- Complete preset directory with all source files
- package.json with merged dependencies
- .env.example with Enoki configuration
- Proper TypeScript config files

### Non-Functional
- File naming: kebab-case
- No file over 200 lines
- Compatible with CLI scaffolding system

## Architecture

```
packages/cli/presets/react-mysten-simple-upload-enoki/
├── src/
│   ├── components/
│   │   ├── features/
│   │   │   ├── wallet-connect.tsx       # Copy from simple-upload
│   │   │   ├── upload-form.tsx          # Copy from simple-upload
│   │   │   └── file-preview.tsx         # Copy from simple-upload
│   │   └── layout/
│   │       └── app-layout.tsx           # Copy from simple-upload
│   ├── providers/
│   │   ├── QueryProvider.tsx            # Copy from simple-upload
│   │   ├── WalletProvider.tsx           # Copy from simple-upload
│   │   └── EnokiProvider.tsx            # NEW - from template
│   ├── hooks/
│   │   ├── use-wallet.ts                # Copy from simple-upload
│   │   ├── use-upload.ts                # Copy from simple-upload
│   │   └── use-download.ts              # Copy from simple-upload
│   ├── lib/
│   │   ├── walrus/                      # Copy entire folder
│   │   ├── enoki/                       # NEW
│   │   │   ├── storage-adapter.ts       # From template
│   │   │   ├── constants.ts             # From template
│   │   │   └── index.ts                 # Barrel export
│   │   └── utils/
│   │       ├── env.ts                   # Copy from simple-upload
│   │       └── mime-type.ts             # Copy from simple-upload
│   ├── App.tsx                          # Copy from simple-upload
│   ├── main.tsx                         # Copy from simple-upload
│   └── index.css                        # Copy from simple-upload
├── public/                              # Copy if exists
├── scripts/
│   └── setup-walrus-deploy.sh           # Copy from simple-upload
├── .env.example                         # NEW - Enoki config
├── package.json                         # Merged dependencies
├── tsconfig.json                        # Copy from simple-upload
├── tsconfig.node.json                   # Copy from simple-upload
├── vite.config.ts                       # Copy from simple-upload
└── README.md                            # NEW - Updated docs
```

## Related Code Files

### To Copy
- `packages/cli/presets/react-mysten-simple-upload/**/*` → base structure
- `templates/enoki/lib/storage-adapter.ts` → lib/enoki/
- `templates/enoki/lib/constants.ts` → lib/enoki/

### To Create
- `.env.example` - Enoki environment config
- `lib/enoki/index.ts` - Barrel exports
- `README.md` - Updated documentation

### To Modify (in next phases)
- `package.json` - Add Enoki dependencies
- `src/main.tsx` - Will add EnokiProvider wrapper
- `src/providers/EnokiProvider.tsx` - Implement provider

## Implementation Steps

1. Create preset directory structure
   ```bash
   mkdir -p packages/cli/presets/react-mysten-simple-upload-enoki
   ```

2. Copy entire simple-upload preset as base
   ```bash
   cp -r packages/cli/presets/react-mysten-simple-upload/* \
         packages/cli/presets/react-mysten-simple-upload-enoki/
   ```

3. Create lib/enoki directory
   ```bash
   mkdir -p packages/cli/presets/react-mysten-simple-upload-enoki/src/lib/enoki
   ```

4. Copy Enoki lib files from template
   ```bash
   cp templates/enoki/lib/storage-adapter.ts \
      packages/cli/presets/react-mysten-simple-upload-enoki/src/lib/enoki/
   cp templates/enoki/lib/constants.ts \
      packages/cli/presets/react-mysten-simple-upload-enoki/src/lib/enoki/
   ```

5. Create barrel export for enoki lib
   - File: `src/lib/enoki/index.ts`
   - Export: storage-adapter, constants

6. Update package.json
   - Merge dependencies from templates/enoki/package.json
   - Add: `@mysten/enoki@^0.15.0`, `zod@^3.22.0`
   - Update name to template placeholder: `{{projectName}}`
   - Update description

7. Create .env.example
   ```env
   # Enoki zkLogin Configuration
   VITE_ENOKI_API_KEY=enoki_public_xxx
   VITE_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com

   # Sui Network
   VITE_SUI_NETWORK=testnet
   VITE_SUI_RPC=
   ```

8. Update README.md with Enoki setup instructions

## Todo List

- [ ] Create preset directory
- [ ] Copy simple-upload base files
- [ ] Create lib/enoki directory
- [ ] Copy storage-adapter.ts
- [ ] Copy constants.ts
- [ ] Create enoki/index.ts barrel export
- [ ] Update package.json dependencies
- [ ] Create .env.example
- [ ] Update README.md with Enoki docs
- [ ] Verify file structure matches architecture

## Success Criteria

- All source files copied correctly
- package.json has merged dependencies
- .env.example contains all Enoki vars
- Directory structure matches architecture diagram
- No compilation errors (files may have unimplemented TODOs)
- All paths use .js extensions for ESM

## Risk Assessment

**Low Risk:**
- File copy operations straightforward
- Template files already exist

**Mitigation:**
- Verify all file paths before copy
- Test package.json syntax after merge

## Security Considerations

- .env.example contains only placeholder values
- No actual API keys in codebase
- Storage adapter uses sessionStorage (tab-isolated)

## Next Steps

→ Phase 02: Implement EnokiProvider wrapper
