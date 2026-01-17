import { describe, it, expect } from 'vitest';
import type { StorageAdapter } from '../../../../base/src/adapters/storage.js';

export function testStorageAdapterCompliance(
  adapterName: string,
  adapter: StorageAdapter
) {
  describe(`${adapterName} StorageAdapter Compliance`, () => {
    describe('Interface Implementation', () => {
      it('should implement upload method', () => {
        expect(adapter.upload).toBeDefined();
        expect(typeof adapter.upload).toBe('function');
      });

      it('should implement download method', () => {
        expect(adapter.download).toBeDefined();
        expect(typeof adapter.download).toBe('function');
      });

      it('should implement getMetadata method', () => {
        expect(adapter.getMetadata).toBeDefined();
        expect(typeof adapter.getMetadata).toBe('function');
      });

      it('should implement delete method', () => {
        expect(adapter.delete).toBeDefined();
        expect(typeof adapter.delete).toBe('function');
      });
    });

    describe('Type Signatures', () => {
      it('upload should accept File and UploadOptions', async () => {
        const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
        const mockOptions = { epochs: 1 };

        await expect(async () => {
          await adapter.upload(mockFile, mockOptions);
        }).rejects.toThrow();
      });

      it('download should accept string blobId', async () => {
        await expect(async () => {
          await adapter.download('test-blob-id');
        }).rejects.toThrow();
      });

      it('getMetadata should accept string blobId', async () => {
        await expect(async () => {
          await adapter.getMetadata('test-blob-id');
        }).rejects.toThrow();
      });

      it('delete should accept string blobId', async () => {
        await expect(async () => {
          await adapter.delete('test-blob-id');
        }).rejects.toThrow();
      });
    });
  });
}
