import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/*.spec.js',
      '**/*.test.js',
      'tests/integration/**',
      'templates/**',
    ],
    testTimeout: 60_000,
    hookTimeout: 30_000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'dist/**',
        '**/*.test.ts',
        '**/*.spec.ts',
        'node_modules/**',
        'vitest.config.ts',
      ],
    },
  },
});
