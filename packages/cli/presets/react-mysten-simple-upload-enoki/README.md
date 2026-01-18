# {{projectName}}

This is a Walrus application with Enoki zkLogin authentication.

## Features

- **Google OAuth Login** - Sign in with your Google account using zkLogin
- **Standard Wallet Support** - Fallback to traditional Sui wallets
- Upload any file to Walrus
- Get Blob ID after upload
- Download file by Blob ID
- File size display

## Prerequisites

1. **Enoki Account** - Sign up at [portal.enoki.mystenlabs.com](https://portal.enoki.mystenlabs.com/)
2. **Google OAuth Setup** - Create OAuth credentials at [console.cloud.google.com](https://console.cloud.google.com/)
3. **Environment Configuration** - Copy `.env.example` to `.env` and fill in your keys

## Quick Start

### 1. Setup Environment

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
VITE_ENOKI_API_KEY=enoki_public_your_key_here
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Development Server

```bash
pnpm dev
```

## Authentication

This app supports two authentication methods:

1. **Google zkLogin (Recommended)** - Click "Login with Google" to authenticate using Enoki's zkLogin. Your ephemeral wallet keys are stored in sessionStorage (tab-isolated, auto-cleanup on close).

2. **Standard Sui Wallet** - Connect with any Mysten-compatible wallet extension as a fallback.

## Usage

1. Click "Choose File" and select a file
2. Click "Upload to Walrus"
3. Copy the Blob ID from the success message
4. Paste Blob ID in the download section
5. Click "Download File"

## Code Structure

- `UploadForm.tsx` - File upload UI
- `FilePreview.tsx` - Download UI
- `App.tsx` - Main app layout

## Deploy to Walrus Sites

### First-time Setup

```bash
pnpm setup-walrus-deploy
```

This will automatically:
- Install Bun (if not already installed)
- Download site-builder binary for your OS
- Clone Walrus Sites portal to `~/.walrus/portal`
- Add deployment scripts to package.json

### Configure SUI Private Key

Edit the portal configuration:

**Linux/macOS:**
```bash
nano ~/.walrus/portal/.env
```

**Windows:**
```bash
notepad %USERPROFILE%\.walrus\portal\.env
```

Add your private key:
```env
SUI_PRIVATE_KEY=0x...
WALRUS_NETWORK=testnet
```

### Build & Deploy

```bash
# Build production bundle
pnpm build

# Deploy to Walrus Sites (testnet, 10 epochs)
pnpm deploy:walrus
```

### Preview Locally

```bash
pnpm walrus:portal
```

This starts the local portal server to preview your deployed site.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm setup-walrus-deploy` - One-time deployment setup
- `pnpm deploy:walrus` - Deploy to Walrus Sites
- `pnpm walrus:portal` - Start local portal preview
