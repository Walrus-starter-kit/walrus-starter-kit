export const MOCK_PACKAGE_JSON = {
  name: 'test-app',
  version: '0.1.0',
  type: 'module',
  scripts: {
    dev: 'vite',
    build: 'tsc && vite build',
  },
  dependencies: {
    react: '^18.2.0',
  },
};

export const MOCK_TSCONFIG = {
  compilerOptions: {
    target: 'ES2020',
    module: 'ESNext',
    strict: true,
  },
};

export const MOCK_VITE_CONFIG = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`;

export const MOCK_README = `# Test Project

This is a test project.
`;
