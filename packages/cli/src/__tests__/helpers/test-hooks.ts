import { afterEach, beforeEach } from 'vitest';
import { createTempDir, cleanupTempDir } from './fs-helpers.js';

export function useTempDirectory() {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
  });

  afterEach(async () => {
    if (tempDir) {
      await cleanupTempDir(tempDir);
    }
  });

  return {
    get dir() {
      return tempDir;
    },
  };
}
