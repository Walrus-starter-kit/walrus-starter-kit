import fs from 'fs-extra';
import path from 'node:path';
import sortPackageJson from 'sort-package-json';

type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

/**
 * Deep merge two objects
 * Arrays and primitives are replaced, objects are merged recursively
 * Note: null values override (later layers win)
 */
export function deepMerge(target: JSONValue, source: JSONValue): JSONValue {
  // Handle undefined (skip)
  if (source === undefined) {
    return target;
  }

  // Handle null explicitly - null overrides
  if (source === null) {
    return null;
  }

  // Arrays: Replace entirely (don't merge)
  if (Array.isArray(source)) {
    return source;
  }

  // Objects: Merge recursively
  if (typeof source === 'object' && typeof target === 'object') {
    const result = { ...target } as Record<string, JSONValue>;

    for (const key in source) {
      const sourceValue = (source as Record<string, JSONValue>)[key];
      const targetValue = result[key];

      if (
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue) &&
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue)
      ) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else {
        result[key] = sourceValue;
      }
    }

    return result;
  }

  // Primitives: Replace
  return source;
}

/**
 * Merge multiple package.json files from layers
 */
export async function mergePackageJsonFiles(
  layers: string[],
  outputPath: string
): Promise<void> {
  let merged: Record<string, JSONValue> = {};

  for (const layerPath of layers) {
    const pkgPath = path.join(layerPath, 'package.json');

    if (await fs.pathExists(pkgPath)) {
      const pkgJson = await fs.readJson(pkgPath);
      const result = deepMerge(merged, pkgJson);
      // Ensure result is an object (package.json should always be an object)
      merged = (result && typeof result === 'object' && !Array.isArray(result)) ? result : merged;
    }
  }

  // Sort keys for consistency
  const sorted = sortPackageJson(merged);

  await fs.writeJson(outputPath, sorted, { spaces: 2 });
}
