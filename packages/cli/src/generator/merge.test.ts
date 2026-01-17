import { describe, it, expect } from 'vitest';
import { deepMerge } from './merge.js';

describe('deepMerge', () => {
  it('should merge objects recursively', () => {
    const target = { a: 1, b: { c: 2 } };
    const source = { b: { d: 3 }, e: 4 };
    const result = deepMerge(target, source);

    expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
  });

  it('should replace arrays entirely', () => {
    const target = { arr: [1, 2, 3] };
    const source = { arr: [4, 5] };
    const result = deepMerge(target, source);

    expect(result).toEqual({ arr: [4, 5] });
  });

  it('should replace primitives', () => {
    const target = { a: 1, b: 'old' };
    const source = { a: 2, b: 'new' };
    const result = deepMerge(target, source);

    expect(result).toEqual({ a: 2, b: 'new' });
  });

  it('should handle null and undefined', () => {
    // undefined: skip (return target)
    const target1 = { a: 1 };
    const source1 = undefined;
    const result1 = deepMerge(target1, source1);
    expect(result1).toEqual({ a: 1 });

    // null: override (later layers win)
    const target2 = { a: 1 };
    const source2 = null;
    const result2 = deepMerge(target2, source2);
    expect(result2).toBeNull();
  });

  it('should merge nested objects deeply', () => {
    const target = {
      dependencies: { react: '^18.0.0' },
      scripts: { build: 'tsc' },
    };
    const source = {
      dependencies: { 'react-dom': '^18.0.0' },
      scripts: { dev: 'vite' },
    };
    const result = deepMerge(target, source);

    expect(result).toEqual({
      dependencies: { react: '^18.0.0', 'react-dom': '^18.0.0' },
      scripts: { build: 'tsc', dev: 'vite' },
    });
  });

  it('should handle package.json-like merge', () => {
    const base = {
      name: 'base',
      version: '1.0.0',
      dependencies: {
        commander: '^11.0.0',
      },
    };
    const overlay = {
      name: 'overlay',
      dependencies: {
        react: '^18.0.0',
      },
      devDependencies: {
        typescript: '^5.0.0',
      },
    };
    const result = deepMerge(base, overlay);

    expect(result).toEqual({
      name: 'overlay',
      version: '1.0.0',
      dependencies: {
        commander: '^11.0.0',
        react: '^18.0.0',
      },
      devDependencies: {
        typescript: '^5.0.0',
      },
    });
  });
});
