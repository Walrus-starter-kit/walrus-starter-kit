import type { Context } from '../types.js';

export interface Layer {
  name: string;
  path: string;
  priority: number; // Higher priority overwrites
}

export interface GeneratorOptions {
  context: Context;
  templateDir: string;
  targetDir: string;
  dryRun?: boolean;
}

export interface GeneratorResult {
  success: boolean;
  projectPath: string;
  filesCreated: number;
  error?: Error;
}
