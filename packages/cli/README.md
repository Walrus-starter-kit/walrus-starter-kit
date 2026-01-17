# create-walrus-app

Interactive CLI for scaffolding Walrus applications on the Sui blockchain.

## Quick Start

```bash
# Using npm
npx @blu1606/create-walrus-app

# Using pnpm
pnpm create @blu1606/walrus-app

# Using yarn
yarn create @blu1606/walrus-app
```

## What is Walrus?

Walrus is a decentralized storage network built on the Sui blockchain, designed for storing and retrieving large files efficiently and securely.

## Features

- 🚀 **Interactive CLI** - Easy-to-use prompts guide you through project setup
- 📦 **Multiple Templates** - Choose from various pre-built templates
- ⚡ **Modern Stack** - Built with TypeScript, React, and Vite
- 🎨 **Ready to Use** - Includes all necessary dependencies and configurations
- 🔧 **Customizable** - Easy to extend and modify for your needs

## Available Templates

### 1. Simple Upload
Basic file upload and download functionality.
- Upload any file to Walrus
- Get Blob ID after upload
- Download file by Blob ID
- File size display

### 2. Gallery
Manage multiple files with a persistent index.
- Upload multiple files
- Grid view of all files
- Local index (localStorage)
- Delete files from gallery
- File metadata display

### 3. React Template
Full React application template with TypeScript.
- Component-based architecture
- TypeScript support
- Modern React patterns
- Vite for fast development

### 4. SDK Mysten
Integration with Mysten Labs SDK.
- Wallet integration
- Transaction handling
- Sui blockchain interactions

### 5. Base Template
Minimal starting point for custom implementations.
- Clean slate
- Essential Walrus utilities
- No UI framework dependencies

## Usage

### Create a New Project

```bash
npx @blu1606/create-walrus-app my-walrus-app
```

Follow the interactive prompts:
1. Enter your project name
2. Select a template
3. Choose package manager (npm/pnpm/yarn)
4. Wait for dependencies installation

### Start Development

```bash
cd my-walrus-app
npm run dev
```

Your app will be running at `http://localhost:5173`

## Project Structure

```
my-walrus-app/
├── src/
│   ├── components/     # React components
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── public/             # Static assets
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## Requirements

- Node.js >= 20.0.0
- npm >= 9.0.0 or pnpm >= 9.0.0

## Common Scripts

All templates include these scripts:

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Configuration

### Walrus Configuration

Each template comes with Walrus utilities pre-configured. You can customize:

- **Aggregator URL**: Set in your Walrus client configuration
- **Publisher URL**: Configure for file uploads
- **Storage settings**: Adjust based on your needs

### Environment Variables

Create a `.env` file in your project root:

```env
VITE_WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space
VITE_WALRUS_PUBLISHER_URL=https://publisher.walrus-testnet.walrus.space
```

## API Reference

### Upload File

```typescript
import { uploadToWalrus } from './utils/walrus';

const blob = await uploadToWalrus(file);
console.log('Blob ID:', blob.blobId);
```

### Download File

```typescript
import { downloadFromWalrus } from './utils/walrus';

const blob = await downloadFromWalrus(blobId);
// Use the blob data
```

## Troubleshooting

### Installation Issues

If you encounter installation errors:

```bash
# Clear npm cache
npm cache clean --force

# Try with different package manager
pnpm create @blu1606/walrus-app
```

### Build Errors

Ensure you're using the correct Node.js version:

```bash
node --version  # Should be >= 20.0.0
```

## Examples

Check out the [examples directory](https://github.com/blu1606/walrus-starter-kit/tree/main/examples) for complete working applications.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](https://github.com/blu1606/walrus-starter-kit/blob/main/CONTRIBUTING.md) for details.

## Resources

- [Walrus Documentation](https://docs.walrus.site/)
- [Sui Documentation](https://docs.sui.io/)
- [GitHub Repository](https://github.com/blu1606/walrus-starter-kit)
- [Issue Tracker](https://github.com/blu1606/walrus-starter-kit/issues)

## License

MIT © [blu1606](https://github.com/blu1606)

## Support

- 📧 Email: dongthanhquandtq@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/blu1606/walrus-starter-kit/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/blu1606/walrus-starter-kit/discussions)

---

Made with ❤️ for the Walrus and Sui community
