import type { Context } from '../types.js';

/**
 * @deprecated Layer-based architecture replaced with presets
 * This interface is kept for backward compatibility but no longer used
 */
export interface Layer {
  name: string;
  path: string;
  priority: number;
}

export interface GeneratorOptions {
  context: Context;
  /**
   * @deprecated templateDir no longer used (presets are resolved automatically)
   * Kept for backward compatibility
   */
  templateDir?: string;
  targetDir: string;
  dryRun?: boolean;
}

export interface GeneratorResult {
  success: boolean;
  projectPath: string;
  filesCreated: number;
  error?: Error;
}
