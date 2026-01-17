import { useMutation, useQuery } from '@tanstack/react-query';
import { storageAdapter } from '../index.js';
import type { UploadOptions } from '../adapters/storage.js';

export function useUpload() {
  return useMutation({
    mutationFn: async ({
      file,
      options,
    }: {
      file: File;
      options?: UploadOptions;
    }) => {
      const blobId = await storageAdapter.upload(file, options);
      return { blobId, file };
    },
  });
}

export function useDownload(blobId: string | null) {
  return useQuery({
    queryKey: ['blob', blobId],
    queryFn: async () => {
      if (!blobId) throw new Error('No blob ID provided');
      return await storageAdapter.download(blobId);
    },
    enabled: !!blobId,
  });
}

export function useMetadata(blobId: string | null) {
  return useQuery({
    queryKey: ['metadata', blobId],
    queryFn: async () => {
      if (!blobId) throw new Error('No blob ID provided');
      return await storageAdapter.getMetadata(blobId);
    },
    enabled: !!blobId,
  });
}
