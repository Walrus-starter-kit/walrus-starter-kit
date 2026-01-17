import { describe, it, expect, vi, beforeEach } from 'vitest';
import { installDependencies, getRunCommand } from './package-manager.js';
import { initializeGit, createInitialCommit } from './git.js';
import { validateProject } from './validator.js';
import { runPostInstall } from './index.js';
import spawn from 'cross-spawn';
import fs from 'fs-extra';
import type { ChildProcess } from 'node:child_process';

vi.mock('cross-spawn');
vi.mock('fs-extra');

type MockSpawnReturn = Partial<ChildProcess> & {
  on: ReturnType<typeof vi.fn>;
};

describe('Post-Install & Validation', () => {
  const projectPath = '/mock/project';
  const context = {
    projectName: 'test-app',
    projectPath,
    sdk: 'mysten' as const,
    framework: 'react' as const,
    useCase: 'simple-upload' as const,
    analytics: false,
    tailwind: true,
    packageManager: 'pnpm' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Package Manager Logic', () => {
    it('should call pnpm install for pnpm', async () => {
      const mockSpawn = vi.mocked(spawn).mockReturnValue({
        on: vi.fn().mockImplementation((event, cb) => {
          if (event === 'close') cb(0);
          return { on: vi.fn() };
        }),
      } as MockSpawnReturn);

      await installDependencies(projectPath, 'pnpm');
      expect(mockSpawn).toHaveBeenCalledWith(
        'pnpm',
        ['install'],
        expect.any(Object)
      );
    });

    it('should call yarn for yarn', async () => {
      const mockSpawn = vi.mocked(spawn).mockReturnValue({
        on: vi.fn().mockImplementation((event, cb) => {
          if (event === 'close') cb(0);
          return { on: vi.fn() };
        }),
      } as MockSpawnReturn);

      await installDependencies(projectPath, 'yarn');
      expect(mockSpawn).toHaveBeenCalledWith('yarn', [], expect.any(Object));
    });

    it('should return correct run commands', () => {
      expect(getRunCommand('npm', 'dev')).toBe('npm run dev');
      expect(getRunCommand('pnpm', 'dev')).toBe('pnpm dev');
      expect(getRunCommand('yarn', 'dev')).toBe('yarn dev');
      expect(getRunCommand('bun', 'dev')).toBe('bun run dev');
    });
  });

  describe('Git Logic', () => {
    it('should initialize git if not already present', async () => {
      vi.mocked(fs.pathExists).mockImplementation(async () => false);
      const mockSpawn = vi.mocked(spawn).mockReturnValue({
        on: vi.fn().mockImplementation((event, cb) => {
          if (event === 'close') cb(0);
          return { on: vi.fn() };
        }),
      } as MockSpawnReturn);

      const result = await initializeGit(projectPath);
      expect(result.success).toBe(true);
      expect(mockSpawn).toHaveBeenCalledWith(
        'git',
        ['init'],
        expect.any(Object)
      );
    });

    it('should create initial commit', async () => {
      vi.mocked(fs.pathExists).mockImplementation(async () => true);
      const mockSpawn = vi.mocked(spawn).mockReturnValue({
        on: vi.fn().mockImplementation((event, cb) => {
          if (event === 'close') cb(0);
          return { on: vi.fn() };
        }),
      } as MockSpawnReturn);

      const result = await createInitialCommit(projectPath);
      expect(result.success).toBe(true);
      expect(mockSpawn).toHaveBeenCalledWith(
        'git',
        ['add', '.'],
        expect.any(Object)
      );
      expect(mockSpawn).toHaveBeenCalledWith(
        'git',
        ['commit', '-m', expect.any(String)],
        expect.any(Object)
      );
    });
  });

  describe('Project Validator', () => {
    it('should validate valid project', async () => {
      vi.mocked(fs.readJson).mockResolvedValue({
        name: 'test',
        version: '1.0.0',
      });
      vi.mocked(fs.pathExists).mockImplementation(async (p: string) => {
        if (p.includes('node_modules')) return true;
        if (p.includes('package.json')) return true;
        return false;
      });

      const result = await validateProject(projectPath);
      expect(result.valid).toBe(true);
      expect(result.checks.packageJson).toBe(true);
      expect(result.checks.nodeModules).toBe(true);
    });

    it('should fail if node_modules missing', async () => {
      vi.mocked(fs.readJson).mockResolvedValue({
        name: 'test',
        version: '1.0.0',
      });
      vi.mocked(fs.pathExists).mockImplementation(async (p: string) => {
        if (p.includes('node_modules')) return false;
        if (p.includes('package.json')) return true;
        return false;
      });

      const result = await validateProject(projectPath);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('node_modules not found');
    });
  });

  describe('runPostInstall Orchestration', () => {
    it('should run all steps by default', async () => {
      vi.mocked(spawn).mockReturnValue({
        on: vi.fn().mockImplementation((event, cb) => {
          if (event === 'close') cb(0);
          return { on: vi.fn() };
        }),
      } as MockSpawnReturn);

      vi.mocked(fs.pathExists).mockImplementation(async () => true);
      vi.mocked(fs.readJson).mockResolvedValue({
        name: 'test',
        version: '1.0.0',
      });

      const result = await runPostInstall({ context, projectPath });

      expect(result.success).toBe(true);
      expect(result.installed).toBe(true);
      expect(result.gitInitialized).toBe(true);
      expect(result.validated).toBe(true);
    });

    it('should skip install when skipInstall is true', async () => {
      const result = await runPostInstall({
        context,
        projectPath,
        skipInstall: true,
      });
      expect(result.installed).toBe(false);
      expect(result.validated).toBe(false);
    });

    it('should skip git when skipGit is true', async () => {
      const result = await runPostInstall({
        context,
        projectPath,
        skipGit: true,
      });
      expect(result.gitInitialized).toBe(false);
    });

    it('should skip validation when skipValidation is true', async () => {
      vi.mocked(spawn).mockReturnValue({
        on: vi.fn().mockImplementation((event, cb) => {
          if (event === 'close') cb(0);
          return { on: vi.fn() };
        }),
      } as MockSpawnReturn);

      const result = await runPostInstall({
        context,
        projectPath,
        skipValidation: true,
      });
      expect(result.validated).toBe(false);
    });
  });
});
