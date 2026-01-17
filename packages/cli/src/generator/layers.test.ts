import { describe, it, expect } from 'vitest';
import { resolveLayers } from './layers.js';
import type { Context } from '../types.js';
import path from 'node:path';

describe('resolveLayers', () => {
  it('should resolve base layers in correct priority order', () => {
    const context: Context = {
      projectName: 'test-app',
      projectPath: '/path/to/test-app',
      sdk: 'mysten',
      framework: 'react',
      useCase: 'simple-upload',
      analytics: false,
      tailwind: false,
      packageManager: 'pnpm',
    };

    const layers = resolveLayers(context);

    expect(layers.length).toBe(4);
    expect(layers[0].name).toBe('base');
    expect(layers[0].priority).toBe(1);
    expect(layers[1].name).toBe('sdk-mysten');
    expect(layers[1].priority).toBe(2);
    expect(layers[2].name).toBe('react');
    expect(layers[2].priority).toBe(3);
    expect(layers[3].name).toBe('simple-upload');
    expect(layers[3].priority).toBe(4);
  });

  it('should include tailwind layer when enabled', () => {
    const context: Context = {
      projectName: 'test-app',
      projectPath: '/path/to/test-app',
      sdk: 'mysten',
      framework: 'react',
      useCase: 'gallery',
      analytics: false,
      tailwind: true,
      packageManager: 'pnpm',
    };

    const layers = resolveLayers(context);

    expect(layers.length).toBe(5);
    expect(layers[4].name).toBe('tailwind');
    expect(layers[4].priority).toBe(5);
  });

  it('should include analytics layer when enabled', () => {
    const context: Context = {
      projectName: 'test-app',
      projectPath: '/path/to/test-app',
      sdk: 'mysten',
      framework: 'vue',
      useCase: 'defi-nft',
      analytics: true,
      tailwind: false,
      packageManager: 'npm',
    };

    const layers = resolveLayers(context);

    expect(layers.length).toBe(5);
    expect(layers[4].name).toBe('analytics');
    expect(layers[4].priority).toBe(6);
  });

  it('should include both optional layers when enabled', () => {
    const context: Context = {
      projectName: 'test-app',
      projectPath: '/path/to/test-app',
      sdk: 'mysten',
      framework: 'plain-ts',
      useCase: 'simple-upload',
      analytics: true,
      tailwind: true,
      packageManager: 'yarn',
    };

    const layers = resolveLayers(context);

    expect(layers.length).toBe(6);
    expect(layers[4].name).toBe('tailwind');
    expect(layers[5].name).toBe('analytics');
  });

  it('should use correct template paths', () => {
    const context: Context = {
      projectName: 'test-app',
      projectPath: '/path/to/test-app',
      sdk: 'mysten',
      framework: 'react',
      useCase: 'simple-upload',
      analytics: false,
      tailwind: false,
      packageManager: 'pnpm',
    };

    const layers = resolveLayers(context);

    layers.forEach((layer) => {
      expect(layer.path).toContain('templates');
      expect(path.isAbsolute(layer.path)).toBe(true);
    });
  });
});
