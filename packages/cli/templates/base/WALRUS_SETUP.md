# Walrus Client Setup Guide

## Prerequisites

- Walrus CLI installed
- Sui wallet with testnet SUI tokens

## Initialize Walrus Client

### Option 1: Automatic Setup (Recommended)

```bash
walrus init --network testnet
```

This creates `~/.config/walrus/client_config.yaml` with default settings.

### Option 2: Manual Configuration

Create `~/.config/walrus/client_config.yaml`:

```yaml
# Walrus Client Configuration
network: testnet
wallet_config:
  type: sui_keystore
  path: ~/.sui/sui_config/sui.keystore

api_base_url: https://publisher.walrus-testnet.walrus.space
aggregator_url: https://aggregator.walrus-testnet.walrus.space
```

## Verify Setup

```bash
walrus info
# Should show network info without errors
```

## Troubleshooting

**Error: "Missing Walrus Client config"**
- Run `walrus init --network testnet`
- Verify file exists: `cat ~/.config/walrus/client_config.yaml`

**Error: "Permission denied"**
- Check directory permissions: `ls -la ~/.config/walrus/`
- Create directory if missing: `mkdir -p ~/.config/walrus`

## Next Steps

- Copy `.env.example` to `.env`
- Configure environment variables
- Run `npm run dev` to start development server
