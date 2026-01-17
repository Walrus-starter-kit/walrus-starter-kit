# Code Standards & Structure

This document outlines the coding standards and structural conventions for the Walrus Starter Kit.

## 1. General Principles

- **TypeScript First:** All code must be written in TypeScript with strict type checking.
- **ES Modules (ESM):** The project uses ESM (`"type": "module"`) throughout.
- **KISS/DRY:** Keep it simple, but avoid unnecessary repetition in template layers.
- **Functional Patterns:** Prefer functional components and hooks in React templates.

## 2. Directory Conventions

- `src/`: Source code.
- `dist/`: Compiled output (git ignored).
- `tests/`: Unit and integration tests.
- `templates/`: Static assets and code fragments for the generator.

## 3. CLI Standards (packages/cli)

- **Command Handling:** Use `commander.js` for argument parsing.
- **User Input:** Use `prompts` for interactive sessions.
- **Styling:** Use `kleur` for terminal coloring. No heavy dependencies like `chalk` or `picocolors`.
- **File Ops:** Use `fs-extra` for robust filesystem operations.
- **Error Handling:** Always wrap async operations in try-catch and provide actionable error messages with emojis (❌, ⚠️).

## 4. Template Standards (templates/)

- **Modular package.json:** Template layers should only contain the dependencies specific to that layer.
- **Adapter Pattern:** SDK layers must implement the storage adapter interface (e.g., `StorageAdapter`) defined in the base layer.
- **Environment Variables:** Use `VITE_` prefix (e.g., `VITE_WALRUS_NETWORK`) for variables intended for the frontend.
- **Consistency:** Use camelCase for file names in templates unless framework conventions dictate otherwise (e.g., PascalCase for React components).

## 5. Formatting & Linting

- **Prettier:** Standard configuration enforced via `.prettierrc.json`.
- **ESLint:** Strict rules for TypeScript, enforced via `.eslintrc.json`.
- **Scripts:**
    - `pnpm lint`: Run ESLint across the workspace.
    - `pnpm format`: Run Prettier to fix formatting.

## 6. Versioning

- Follow [Semantic Versioning (SemVer)](https://semver.org/).
- Pin critical dependencies in templates to ensure stability (e.g., `"@mysten/walrus": "1.0.0"`).
```
