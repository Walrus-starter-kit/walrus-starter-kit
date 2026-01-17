import { useMutation } from '@tanstack/react-query';
import { storageAdapter } from '../lib/walrus/index.js';
import type { UploadOptions } from '../lib/walrus/types.js';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';

export function useUpload() {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();

  return useMutation({
    mutationFn: async ({
      file,
      options,
    }: {
      file: File;
      options?: UploadOptions;
    }) => {
      if (!currentAccount) {
        throw new Error('Wallet not connected. Please connect your wallet to upload files.');
      }

      // Wrap signAndExecute to return Promise
      const signTransaction = (args: { transaction: any }) => {
        return new Promise<{ digest: string }>((resolve, reject) => {
          signAndExecute(
            {
              transaction: args.transaction,
            },
            {
              onSuccess: (result) => resolve({ digest: result.digest }),
              onError: (error) => reject(error),
            }
          );
        });
      };

      const blobId = await storageAdapter.upload(file, {
        ...options,
        client: suiClient,
        signer: {
          address: currentAccount.address,
          signAndExecuteTransaction: signTransaction,
        },
      });
      return { blobId, file };
    },
  });
}
