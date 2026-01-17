import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Context } from '../types.js';
import type { Layer } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Templates are in packages/cli/templates (published with package)
const TEMPLATE_ROOT = path.join(__dirname, '../../templates');

/**
 * Validate that a layer path is within the template root (prevent path traversal)
 */
function validateLayerPath(layerPath: string): void {
  const normalized = path.resolve(layerPath);
  const root = path.resolve(TEMPLATE_ROOT);

  if (!normalized.startsWith(root)) {
    throw new Error(
      `Invalid layer path: ${layerPath} is outside template root`
    );
  }
}

export function resolveLayers(context: Context): Layer[] {
  const layers: Layer[] = [
    {
      name: 'base',
      path: path.join(TEMPLATE_ROOT, 'base'),
      priority: 1,
    },
    {
      name: `sdk-${context.sdk}`,
      path: path.join(TEMPLATE_ROOT, `sdk-${context.sdk}`),
      priority: 2,
    },
    {
      name: context.framework,
      path: path.join(TEMPLATE_ROOT, context.framework),
      priority: 3,
    },
    {
      name: context.useCase,
      path: path.join(TEMPLATE_ROOT, context.useCase),
      priority: 4,
    },
  ];

  // Optional: Tailwind layer
  if (context.tailwind) {
    layers.push({
      name: 'tailwind',
      path: path.join(TEMPLATE_ROOT, 'tailwind'),
      priority: 5,
    });
  }

  // Optional: Analytics layer
  if (context.analytics) {
    layers.push({
      name: 'analytics',
      path: path.join(TEMPLATE_ROOT, 'analytics'),
      priority: 6,
    });
  }

  // Validate all layer paths before returning
  layers.forEach((layer) => validateLayerPath(layer.path));

  return layers;
}
