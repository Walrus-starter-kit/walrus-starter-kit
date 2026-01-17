/**
 * Mysten-specific type extensions
 */

export interface MystenUploadResult {
  newlyCreated: {
    blobObject: {
      blobId: string;
      size: number;
    };
  };
}

export interface MystenBlobMetadata {
  size: number;
  encodingType: string;
  contentType?: string;
  createdAt?: number;
}
