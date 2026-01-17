import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createTempDir(prefix = 'test-'): Promise<string> {
  const tempDir = path.join(
    __dirname,
    '../../../.tmp',
    `${prefix}${Date.now()}`
  );
  await fs.ensureDir(tempDir);
  return tempDir;
}

export async function cleanupTempDir(dir: string): Promise<void> {
  if (await fs.pathExists(dir)) {
    await fs.remove(dir);
  }
}

export async function createTestFile(
  dir: string,
  filename: string,
  content: string
): Promise<string> {
  const filePath = path.join(dir, filename);
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, 'utf-8');
  return filePath;
}

export async function readTestFile(filePath: string): Promise<string> {
  return await fs.readFile(filePath, 'utf-8');
}

export function createMockContext(overrides = {}) {
  return {
    projectName: 'test-project',
    sdk: 'mysten',
    framework: 'react',
    useCase: 'simple-upload',
    tailwind: false,
    analytics: false,
    ...overrides,
  };
}
