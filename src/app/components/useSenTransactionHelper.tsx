import { Connection, Transaction } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";

export async function sendTransactionHelper(
  transaction: Transaction,
  connection: Connection,
  wallet: WalletContextState // Pass the wallet object as an argument
): Promise<string> {
  if (!wallet || !wallet.publicKey) {
    throw new Error("No wallet connected. Please connect your wallet.");
  }

  const { sendTransaction } = wallet;
  const signature = await sendTransaction(transaction, connection);

  // Confirm the transaction
  const confirmation = await connection.confirmTransaction(signature, 'confirmed');

  if (confirmation.value.err) {
    throw new Error("Transaction failed: " + JSON.stringify(confirmation.value.err));
  }

  return signature;
}