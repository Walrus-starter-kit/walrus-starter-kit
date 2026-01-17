import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';

export function useWallet() {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  return {
    account: currentAccount,
    isConnected: !!currentAccount,
    address: currentAccount?.address,
    signAndExecute,
  };
}
