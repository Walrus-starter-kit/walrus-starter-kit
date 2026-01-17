import fs from 'fs-extra';
import path from 'node:path';
import type { Context } from '../types.js';

interface TransformVariables {
  projectName: string;
  sdkName: string;
  framework: string;
  useCase: string;
}

/**
 * Build transformation variables from context
 */
export function buildVariables(context: Context): TransformVariables {
  return {
    projectName: context.projectName,
    sdkName: context.sdk,
    framework: context.framework,
    useCase: context.useCase,
  };
}

/**
 * Transform string with variable substitution
 */
export function transformString(
  content: string,
  vars: TransformVariables
): string {
  return content
    .replace(/\{\{projectName\}\}/g, vars.projectName)
    .replace(/\{\{sdkName\}\}/g, vars.sdkName)
    .replace(/\{\{framework\}\}/g, vars.framework)
    .replace(/\{\{useCase\}\}/g, vars.useCase);
}

/**
 * Transform all text files in directory
 * Includes code files (.ts, .tsx, .js, .jsx) and config files (.md, .json, .html)
 */
export async function transformDirectory(
  dir: string,
  vars: TransformVariables,
  extensions: string[] = [
    '.md',
    '.json',
    '.html',
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.css',
    '.scss',
    '.vue',
  ]
): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await transformDirectory(fullPath, vars, extensions);
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      const content = await fs.readFile(fullPath, 'utf-8');
      const transformed = transformString(content, vars);
      await fs.writeFile(fullPath, transformed, 'utf-8');
    }
  }
}
