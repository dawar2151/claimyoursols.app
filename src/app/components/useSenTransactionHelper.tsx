import { Connection, Transaction } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";

export async function sendTransactionHelper(
  transaction: Transaction,
  connection: Connection,
  wallet: WalletContextState,
): Promise<string> {

  if (!wallet || !wallet.publicKey) {
    throw new Error("No wallet connected. Please connect your wallet.");
  }

  // 1. Fetch latest blockhash for transaction validity
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey;

  const signature = await wallet.sendTransaction(transaction, connection);

  let status = null;

  while (true) {
    const { value } = await connection.getSignatureStatuses([signature]);
    status = value[0];

    if (status?.confirmationStatus === "confirmed" || status?.confirmationStatus === "finalized") {
      break;
    }



    if (status?.err) {
      throw new Error("Transaction failed: " + JSON.stringify(status.err));
    }
    const stillValid = await connection.isBlockhashValid(blockhash);
    if (!stillValid) {
      throw new Error("Transaction expired before confirmation");
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return signature;
}
