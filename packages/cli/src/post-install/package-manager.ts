import spawn from 'cross-spawn';
import { logger } from '../utils/logger.js';
import type { PackageManager } from '../types.js';

export interface InstallResult {
  success: boolean;
  duration: number;
  error?: Error;
}

/**
 * Get install command for package manager
 */
function getInstallCommand(pm: PackageManager): string {
  const commands: Record<PackageManager, string> = {
    npm: 'npm install',
    pnpm: 'pnpm install',
    yarn: 'yarn',
    bun: 'bun install',
  };
  return commands[pm];
}

/**
 * Install dependencies using detected package manager
 */
export async function installDependencies(
  projectPath: string,
  packageManager: PackageManager
): Promise<InstallResult> {
  const startTime = Date.now();

  logger.info(`📦 Installing dependencies with ${packageManager}...`);

  return new Promise((resolve) => {
    const [cmd, ...args] = getInstallCommand(packageManager).split(' ');

    const child = spawn(cmd, args, {
      cwd: projectPath,
      stdio: 'inherit', // Stream output to user
    });

    child.on('close', (code: number | null) => {
      const duration = Date.now() - startTime;

      if (code === 0) {
        logger.success(
          `✓ Dependencies installed (${(duration / 1000).toFixed(1)}s)`
        );
        resolve({ success: true, duration });
      } else {
        const error = new Error(`Install failed with exit code ${code}`);
        logger.error(`❌ Dependency installation failed`);
        resolve({ success: false, duration, error });
      }
    });

    child.on('error', (error: Error) => {
      const duration = Date.now() - startTime;
      logger.error(`❌ Failed to run ${packageManager}: ${error.message}`);
      resolve({ success: false, duration, error });
    });
  });
}

/**
 * Get run command for package manager
 */
export function getRunCommand(pm: PackageManager, script: string): string {
  const runCommands: Record<PackageManager, string> = {
    npm: `npm run ${script}`,
    pnpm: `pnpm ${script}`,
    yarn: `yarn ${script}`,
    bun: `bun run ${script}`,
  };
  return runCommands[pm];
}
