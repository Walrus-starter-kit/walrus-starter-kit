import fs from 'fs-extra';
import path from 'node:path';

/**
 * Recursively copy directory, excluding certain files
 */
export async function copyDirectory(
  src: string,
  dest: string,
  exclude: string[] = ['node_modules', '.git', 'dist']
): Promise<number> {
  let filesCreated = 0;

  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    if (exclude.includes(entry.name)) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await fs.ensureDir(destPath);
      filesCreated += await copyDirectory(srcPath, destPath, exclude);
    } else {
      await fs.copy(srcPath, destPath, { overwrite: true });
      filesCreated++;
    }
  }

  return filesCreated;
}

/**
 * Check if directory is empty
 */
export async function isDirectoryEmpty(dir: string): Promise<boolean> {
  const exists = await fs.pathExists(dir);
  if (!exists) return true;

  const entries = await fs.readdir(dir);
  return entries.length === 0;
}

/**
 * Create directory if it doesn't exist
 */
export async function ensureDirectory(dir: string): Promise<void> {
  await fs.ensureDir(dir);
}
