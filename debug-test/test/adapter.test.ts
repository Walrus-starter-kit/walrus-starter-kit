import { describe, it, expect } from 'vitest';
import { MystenStorageAdapter } from '../src/adapter.js';

describe('MystenStorageAdapter', () => {
  it('should implement StorageAdapter interface', () => {
    const adapter = new MystenStorageAdapter();

    expect(adapter).toHaveProperty('upload');
    expect(adapter).toHaveProperty('download');
    expect(adapter).toHaveProperty('getMetadata');
    expect(adapter).toHaveProperty('exists');
  });

  it('should handle upload errors gracefully', async () => {
    const adapter = new MystenStorageAdapter();
    const invalidData = new Uint8Array(0);

    await expect(adapter.upload(invalidData)).rejects.toThrow('Upload failed');
  });
});
