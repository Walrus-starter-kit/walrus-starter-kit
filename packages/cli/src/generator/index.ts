import path from 'node:path';
import fs from 'fs-extra';
import { logger } from '../utils/logger.js';
import { resolvePresetPath, getPresetName } from './layers.js';
import {
  copyDirectory,
  ensureDirectory,
  isDirectoryEmpty,
  copyEnvFile,
} from './file-ops.js';
import { buildVariables, transformDirectory } from './transform.js';
import type { GeneratorOptions, GeneratorResult } from './types.js';

export async function generateProject(
  options: GeneratorOptions
): Promise<GeneratorResult> {
  const { context, targetDir, dryRun = false } = options;

  try {
    logger.info(`🏗️  Generating project: ${context.projectName}`);

    // Pre-flight checks
    if (!dryRun) {
      const isEmpty = await isDirectoryEmpty(targetDir);
      if (!isEmpty) {
        throw new Error(
          `Directory ${targetDir} is not empty. Please use an empty directory.`
        );
      }
      await ensureDirectory(targetDir);
    }

    // Resolve preset path
    const presetName = getPresetName(context);
    const presetPath = resolvePresetPath(context);

    logger.info(`📦 Using preset: ${presetName}`);

    // Validate preset exists
    if (!(await fs.pathExists(presetPath))) {
      throw new Error(
        `Preset not found: ${presetName}\n` +
          `Expected at: ${presetPath}\n` +
          `Available presets: Check packages/cli/presets/`
      );
    }

    let filesCreated = 0;

    // Copy preset directory to target
    logger.info(`📁 Copying preset files...`);
    if (!dryRun) {
      filesCreated = await copyDirectory(presetPath, targetDir);
    }

    // Transform template variables
    logger.info('✏️  Transforming template variables');
    if (!dryRun) {
      const vars = buildVariables(context);
      await transformDirectory(targetDir, vars);
    }

    // Copy .env.example to .env
    logger.info('🔐 Setting up environment file');
    if (!dryRun) {
      try {
        const envResult = await copyEnvFile(targetDir);
        if (envResult.created) {
          logger.success('✓ Created .env from .env.example');
        } else if (envResult.reason === 'already-exists') {
          logger.info('ℹ️  .env already exists, skipped');
        }
        // Silent if no-source (not all presets have .env.example)
      } catch (envError) {
        // Non-critical: continue generation even if env copy fails
        logger.warn(`⚠️  Could not copy .env file: ${envError}`);
      }
    } else {
      logger.info('(dry-run) Would copy .env.example to .env');
    }

    logger.success(`✓ Project generated successfully!`);
    logger.info(`📂 Files created: ${filesCreated}`);
    logger.info(`📦 Preset used: ${presetName}`);

    return {
      success: true,
      projectPath: targetDir,
      filesCreated,
    };
  } catch (error) {
    logger.error(`Failed to generate project: ${error}`);

    // Rollback: Remove partially created directory
    if (!dryRun && (await fs.pathExists(targetDir))) {
      logger.warn('🧹 Rolling back partial changes...');
      try {
        await fs.remove(targetDir);
      } catch (rollbackError) {
        logger.error(`Failed to rollback: ${rollbackError}`);
        logger.warn(
          `⚠️  Please manually delete the directory: ${targetDir}`
        );
      }
    }

    return {
      success: false,
      projectPath: targetDir,
      filesCreated: 0,
      error: error as Error,
    };
  }
}
