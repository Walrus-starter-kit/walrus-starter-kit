import { describe, it, expect } from 'vitest';
import { transformString, buildVariables } from './transform.js';
import type { Context } from '../types.js';

describe('transformString', () => {
  const vars = {
    projectName: 'my-walrus-app',
    sdkName: 'mysten',
    framework: 'react',
    useCase: 'simple-upload',
  };

  it('should replace projectName placeholder', () => {
    const input = '# {{projectName}}';
    const result = transformString(input, vars);
    expect(result).toBe('# my-walrus-app');
  });

  it('should replace multiple placeholders', () => {
    const input =
      'Project: {{projectName}}, SDK: {{sdkName}}, Framework: {{framework}}';
    const result = transformString(input, vars);
    expect(result).toBe('Project: my-walrus-app, SDK: mysten, Framework: react');
  });

  it('should handle multiple occurrences of same placeholder', () => {
    const input = '{{projectName}} is a {{projectName}} project';
    const result = transformString(input, vars);
    expect(result).toBe('my-walrus-app is a my-walrus-app project');
  });

  it('should not modify text without placeholders', () => {
    const input = 'This is plain text';
    const result = transformString(input, vars);
    expect(result).toBe('This is plain text');
  });
});

describe('buildVariables', () => {
  it('should extract variables from context', () => {
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

    const vars = buildVariables(context);

    expect(vars).toEqual({
      projectName: 'test-app',
      sdkName: 'mysten',
      framework: 'react',
      useCase: 'gallery',
    });
  });
});
