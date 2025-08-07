import { Connection, Transaction } from "@solana/web3.js";

export async function sendTransactionHelper(transaction: Transaction, connection: Connection): Promise<string> {
  const provider = window.solana;
  if (!provider || !provider.signAndSendTransaction) {
    throw new Error("No provider found. Please connect your wallet.");
  }
  const { signature } = await provider.signAndSendTransaction(transaction);
  await connection.getSignatureStatus(signature);
  return signature;
}
