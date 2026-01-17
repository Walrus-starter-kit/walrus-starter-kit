// Re-export storage adapter from SDK layer for use case templates
export { storageAdapter } from '../../sdk-mysten/src/index.js';

// Re-export base adapter types
export type {
  StorageAdapter,
  BlobMetadata,
  UploadOptions,
  DownloadOptions,
} from '../../base/src/adapters/storage.js';
