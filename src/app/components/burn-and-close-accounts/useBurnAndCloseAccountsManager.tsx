import { useState, useEffect, useCallback } from "react";
import {
  Connection,
  PublicKey,
  AccountInfo,
  Transaction,
  ParsedAccountData,
  SystemProgram,
} from "@solana/web3.js";
import { sendTransactionHelper } from "../useSenTransactionHelper";
import {
  createCloseAccountInstruction,
  TOKEN_PROGRAM_ID,
  ACCOUNT_SIZE,
  createBurnInstruction,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { calculateCommission, getFeeRecipient } from "@/app/utils/utils";
import { isValidTokenAccount } from "@/app/utils/spl-utils";

interface AccountData {
  pubkey: PublicKey;
  account: AccountInfo<ParsedAccountData>;
  lamports: number;
  uiAmount: number | null;
  decimals: number;
  amount: string;
  rentExemptReserve: number;
}


const BATCH_SIZE = 10;

const fetchTokenAccounts = async (
  connection: Connection,
  publicKey: PublicKey,
  programId: PublicKey
) => {
  return connection.getParsedTokenAccountsByOwner(publicKey, {
    programId: programId,
  });
};



const createFeeInstructions = async (
  publicKey: PublicKey,
  totalFee: number,
  referralAccount: string | undefined,
  connection: Connection // Add connection parameter
): Promise<Transaction> => {
  const transaction = new Transaction();
  const feeRecipient = getFeeRecipient();
  if (totalFee > 0 && feeRecipient != null) {
    if (
      referralAccount &&
      referralAccount !== publicKey.toString() &&
      PublicKey.isOnCurve(new PublicKey(referralAccount))
    ) {
      // Check if referralAccount exists on-chain
      const referralPubkey = new PublicKey(referralAccount);
      const accountInfo = await connection.getAccountInfo(referralPubkey);

      if (accountInfo === null) {
        console.warn(
          `Referral account ${referralAccount} does not exist. Sending full fee to feeRecipient.`
        );
        // Fallback to sending full fee to feeRecipient
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(feeRecipient),
            lamports: totalFee,
          })
        );
      } else {
        // Referral account exists, proceed with split fee
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: referralPubkey,
            lamports: totalFee / 2,
          }),
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: new PublicKey(feeRecipient),
            lamports: totalFee / 2,
          })
        );
      }
    } else {
      // No valid referralAccount, send full fee to feeRecipient
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(feeRecipient),
          lamports: totalFee,
        })
      );
    }
  }

  return transaction;
};

export function useBurnAndCloseAccountsManager(connection: Connection) {
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [referralAccount, setReferralAccount] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [transactionHashes, setTransactionHashes] = useState<string[]>([]); // New state for transaction hashes
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(
    new Set()
  );
  const wallet = useWallet();
  const publicKey = wallet.publicKey;
  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!publicKey) {
        throw new Error(
          "Wallet not connected. Please connect your wallet to fetch accounts."
        );
      }
      const rentExemptReserve =
        await connection.getMinimumBalanceForRentExemption(ACCOUNT_SIZE);

      const [splTokenAccounts, token2022Accounts] = await Promise.all([
        fetchTokenAccounts(connection, publicKey, TOKEN_PROGRAM_ID),
        fetchTokenAccounts(connection, publicKey, TOKEN_2022_PROGRAM_ID),
      ]);

      const closeableAccounts = [
        ...splTokenAccounts.value,
        ...token2022Accounts.value,
      ]
        .filter((account) =>
          isValidTokenAccount(account, rentExemptReserve)
        )
        .map((account) => ({
          pubkey: account.pubkey,
          account: account.account,
          uiAmount: account.account.data.parsed.info.tokenAmount.uiAmount,
          decimals: account.account.data.parsed.info.tokenAmount.decimals,
          amount: account.account.data.parsed.info.tokenAmount.amount,
          lamports: account.account.lamports,
          rentExemptReserve,
        }));

      setAccounts(closeableAccounts);
    } catch (err) {
      console.error("Error fetching accounts:", err);
    } finally {
      setIsLoading(false);
    }
  }, [connection, publicKey]);

  const closeAllAccounts = useCallback(async () => {
    setIsClosing(true);
    setError(null);
    setTransactionHashes([]); // Reset transaction hashes at the start

    const ensurePublicKey = (key: PublicKey | string): PublicKey =>
      typeof key === "string" ? new PublicKey(key) : key;

    try {
      if (!publicKey) {
        throw new Error(
          "Wallet not connected. Please connect your wallet to close accounts."
        );
      }
      let totalClosed = 0;
      const newTransactionHashes: string[] = [];
      const accountsToBurnAndClose = accounts.filter((account) =>
        selectedAccounts.has(account.pubkey.toString())
      );

      for (let i = 0; i < accountsToBurnAndClose.length; i += BATCH_SIZE) {
        const batch = accountsToBurnAndClose.slice(i, i + BATCH_SIZE);
        const transaction = new Transaction();
        let totalFee = 0;

        for (const account of batch) {
          const accountOwner = account.account.owner.toString();
          const isSPLToken = accountOwner === TOKEN_PROGRAM_ID.toString();
          const isToken2022 = accountOwner === TOKEN_2022_PROGRAM_ID.toString();

          const mint = account.account.data.parsed?.info?.mint;
          if (!mint) {
            console.error(
              `Mint address not found for account: ${account.pubkey.toString()}`
            );
            continue;
          }

          const amount = Number(
            account.account.data.parsed?.info?.tokenAmount?.amount
          );
          if (isNaN(amount) || amount <= 0) {
            console.error(
              `Invalid or zero token amount for account: ${account.pubkey.toString()}`
            );
            continue;
          }

          if (!isSPLToken && !isToken2022) continue;

          const programId = isToken2022
            ? TOKEN_2022_PROGRAM_ID
            : TOKEN_PROGRAM_ID;

          const pubkey = ensurePublicKey(account.pubkey);
          const mintPubkey = new PublicKey(mint); // Convert mint to PublicKey
          transaction.add(
            createBurnInstruction(
              pubkey,
              mintPubkey,
              publicKey,
              amount,
              [],
              programId
            )
          );

          transaction.add(
            createCloseAccountInstruction(
              pubkey,
              publicKey,
              publicKey,
              [],
              programId
            )
          );

          totalFee += calculateCommission(account.lamports) || 0;
        }

        if (transaction.instructions.length === 0) continue;

        const feeInstructions = await createFeeInstructions(
          publicKey,
          totalFee,
          referralAccount,
          connection
        );

        transaction.add(...feeInstructions.instructions);

        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = publicKey;

        try {
          const signature = await sendTransactionHelper(
            transaction,
            connection
          );
          console.log(
            `✅ Closed batch ${Math.floor(i / BATCH_SIZE) + 1}:`,
            signature
          );
          newTransactionHashes.push(signature);
          totalClosed += batch.length;
        } catch (batchError) {
          const errorMessage =
            batchError instanceof Error
              ? batchError.message
              : "An unknown error occurred while closing accounts";
          console.error(
            `❌ Error closing batch ${Math.floor(i / BATCH_SIZE) + 1}:`,
            batchError
          );
          setError(
            `Failed to close batch ${Math.floor(i / BATCH_SIZE) + 1
            }: ${errorMessage}`
          );
          if (errorMessage.includes("rejected")) {
            setError("Transaction was rejected by user. Stopping process.");
            break;
          }
        }

        if (i + BATCH_SIZE < accountsToBurnAndClose.length) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      setTransactionHashes(newTransactionHashes);
      console.log(
        `All accounts closed successfully. Total: ${totalClosed}/${accountsToBurnAndClose.length}`
      );
      setIsSuccess(true);
      await fetchAccounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to close accounts");
      console.error("Error closing accounts:", err);
    } finally {
      setIsClosing(false);
    }
  }, [accounts, connection, referralAccount, fetchAccounts, selectedAccounts]);
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts, publicKey]);

  return {
    selectedAccounts,
    setSelectedAccounts,
    setReferralAccount,
    accounts,
    isSuccess,
    isLoading,
    isClosing,
    error,
    transactionHashes, // Expose transactionHashes in the hook's return value
    closeAllAccounts,
    clearTransactionHashes: setTransactionHashes,
    refreshAccounts: fetchAccounts,
  };
}
