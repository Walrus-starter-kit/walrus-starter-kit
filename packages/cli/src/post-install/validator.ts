import fs from 'fs-extra';
import path from 'node:path';
import spawn from 'cross-spawn';
import { logger } from '../utils/logger.js';

export interface ValidationResult {
  valid: boolean;
  checks: {
    packageJson: boolean;
    nodeModules: boolean;
    dependencies: boolean;
    typescript: boolean;
  };
  errors: string[];
}

/**
 * Validate generated project
 */
export async function validateProject(
  projectPath: string
): Promise<ValidationResult> {
  logger.info('🔍 Validating project...');

  const result: ValidationResult = {
    valid: true,
    checks: {
      packageJson: false,
      nodeModules: false,
      dependencies: false,
      typescript: false,
    },
    errors: [],
  };

  // Check 1: package.json exists and is valid
  try {
    const pkgPath = path.join(projectPath, 'package.json');
    const pkg = await fs.readJson(pkgPath);

    if (!pkg.name || !pkg.version) {
      result.errors.push('package.json missing required fields');
    } else {
      result.checks.packageJson = true;
    }
  } catch (error) {
    result.errors.push('Invalid or missing package.json');
  }

  // Check 2: node_modules exists
  const nodeModulesPath = path.join(projectPath, 'node_modules');
  if (await fs.pathExists(nodeModulesPath)) {
    result.checks.nodeModules = true;
  } else {
    result.errors.push('node_modules not found');
  }

  // Check 3: Dependencies installed
  try {
    const pkgPath = path.join(projectPath, 'package.json');
    const pkg = await fs.readJson(pkgPath);
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    let allInstalled = true;
    for (const dep in deps) {
      const depPath = path.join(nodeModulesPath, dep);
      if (!(await fs.pathExists(depPath))) {
        allInstalled = false;
        result.errors.push(`Dependency not installed: ${dep}`);
        break;
      }
    }

    result.checks.dependencies = allInstalled;
  } catch (error) {
    result.errors.push('Failed to verify dependencies');
  }

  // Check 4: TypeScript compilation (if tsconfig exists)
  const tsconfigPath = path.join(projectPath, 'tsconfig.json');
  if (await fs.pathExists(tsconfigPath)) {
    const tscResult = await checkTypeScript(projectPath);
    result.checks.typescript = tscResult.success;

    if (!tscResult.success) {
      result.errors.push(`TypeScript errors: ${tscResult.error}`);
    }
  } else {
    result.checks.typescript = true; // Not applicable
  }

  result.valid = Object.values(result.checks).every(Boolean);

  if (result.valid) {
    logger.success('✓ Project validation passed');
  } else {
    logger.warn('⚠️  Project validation failed:');
    result.errors.forEach((err) => logger.warn(`  - ${err}`));
  }

  return result;
}

/**
 * Check TypeScript compilation with timeout
 */
async function checkTypeScript(
  projectPath: string
): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    const child = spawn('npx', ['tsc', '--noEmit'], {
      cwd: projectPath,
      stdio: 'pipe',
    });

    const timeout = setTimeout(() => {
      child.kill();
      resolve({ success: false, error: 'TypeScript check timed out (60s)' });
    }, 60000); // 60s timeout

    let stderr = '';
    child.stderr?.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    child.on('close', (code: number | null) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve({ success: true });
      } else {
        resolve({ success: false, error: stderr.split('\n')[0] });
      }
    });

    child.on('error', (error: Error) => {
      clearTimeout(timeout);
      resolve({ success: false, error: error.message });
    });
  });
}
