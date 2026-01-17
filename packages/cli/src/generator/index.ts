import path from 'node:path';
import fs from 'fs-extra';
import { logger } from '../utils/logger.js';
import { resolveLayers } from './layers.js';
import {
  copyDirectory,
  ensureDirectory,
  isDirectoryEmpty,
} from './file-ops.js';
import { mergePackageJsonFiles } from './merge.js';
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

    // Resolve layers
    const layers = resolveLayers(context);
    logger.info(`📦 Layers: ${layers.map((l) => l.name).join(' + ')}`);

    let filesCreated = 0;

    // Copy layers sequentially (later layers override)
    for (const layer of layers) {
      if (!(await fs.pathExists(layer.path))) {
        logger.warn(`⚠️  Layer not found: ${layer.path} (skipping)`);
        continue;
      }

      logger.info(`📁 Copying layer: ${layer.name}`);

      if (!dryRun) {
        const count = await copyDirectory(layer.path, targetDir);
        filesCreated += count;
      }
    }

    // Merge package.json from all layers
    logger.info('🔗 Merging package.json files');
    if (!dryRun) {
      await mergePackageJsonFiles(
        layers.map((l) => l.path),
        path.join(targetDir, 'package.json')
      );
    }

    // Transform template variables
    logger.info('✏️  Transforming template variables');
    if (!dryRun) {
      const vars = buildVariables(context);
      await transformDirectory(targetDir, vars);
    }

    logger.success(`✓ Project generated successfully!`);
    logger.info(`📂 Files created: ${filesCreated}`);

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
