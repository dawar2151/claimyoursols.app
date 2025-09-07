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
  TOKEN_2022_PROGRAM_ID,
  createHarvestWithheldTokensToMintInstruction,
} from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { calculateCommission, getFeeRecipient } from "@/app/utils/utils";
import {
  checkWithheldAmount,
  isValidTokenAccountForClose,
} from "@/app/utils/spl-utils";

interface AccountData {
  pubkey: PublicKey;
  account: AccountInfo<ParsedAccountData>;
  lamports: number;
  rentExemptReserve: number;
  withheldAmount?: number;
  hasWithheldTokens?: boolean;
  mintAddress?: PublicKey;
}

const BATCH_SIZE = 20;

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
  var recicipient = getFeeRecipient();

  if (totalFee > 0 && recicipient != null) {
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
            toPubkey: recicipient,
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
            toPubkey: new PublicKey(recicipient),
            lamports: totalFee / 2,
          })
        );
      }
    } else {
      // No valid referralAccount, send full fee to feeRecipient
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(recicipient),
          lamports: totalFee,
        })
      );
    }
  }

  return transaction;
};

export function useAccountsHelper(connection: Connection) {
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [referralAccount, setReferralAccount] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(
    new Set()
  );
  const [transactionHashes, setTransactionHashes] = useState<string[]>([]); // New state for transaction hashes
  const publicKey = useWallet().publicKey;
  const wallet = useWallet();

  const cleanClosedAccounts = useCallback(() => {
    setAccounts(
      accounts.filter(
        (account) => !selectedAccounts.has(account.pubkey.toString())
      )
    );
    setSelectedAccounts(new Set());
    setIsSuccess(false);
  }, [selectedAccounts]);

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!publicKey) {
        throw new Error("Wallet not connected");
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
          isValidTokenAccountForClose(account, rentExemptReserve)
        )
        .map((account) => {
          const { withheldAmount, hasWithheldTokens, mintAddress } =
            checkWithheldAmount(account.account);

          return {
            pubkey: account.pubkey,
            account: account.account,
            lamports: account.account.lamports,
            rentExemptReserve,
            withheldAmount,
            hasWithheldTokens,
            mintAddress,
          };
        })
       // .filter((account) => !account.hasWithheldTokens); // Filter out accounts with withheld tokens

      setAccounts(closeableAccounts);

      const totalAccountsBeforeFilter = [
        ...splTokenAccounts.value,
        ...token2022Accounts.value,
      ].filter((account) =>
        isValidTokenAccountForClose(account, rentExemptReserve)
      ).length;

      const filteredOutCount =
        totalAccountsBeforeFilter - closeableAccounts.length;
      if (filteredOutCount > 0) {
        console.log(
          `Filtered out ${filteredOutCount} accounts with withheld tokens`
        );
      }
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

    try {
      if (!publicKey) {
        throw new Error("Wallet not connected");
      }
      let totalClosed = 0;
      const newTransactionHashes: string[] = []; // Temporary array to collect hashes
      const accountsToClose = accounts.filter((account) =>
        selectedAccounts.has(account.pubkey.toString())
      );
      for (let i = 0; i < accountsToClose.length; i += BATCH_SIZE) {
        const batch = accountsToClose.slice(i, i + BATCH_SIZE);
        const transaction = new Transaction();
        let totalFee = 0;

        for (const account of batch) {
          const accountOwner = account.account.owner.toString();
          const isSPLToken = accountOwner === TOKEN_PROGRAM_ID.toString();
          const isToken2022 = accountOwner === TOKEN_2022_PROGRAM_ID.toString();

          if (!isSPLToken && !isToken2022) continue;

          const programId = isToken2022
            ? TOKEN_2022_PROGRAM_ID
            : TOKEN_PROGRAM_ID;
            if (account.hasWithheldTokens) {
              console.log(
                `Closing account ${account.pubkey.toString()} with withheld amount: ${
                  account.withheldAmount
                }`
              );
              if (account.mintAddress) {
                transaction.add(
                  createHarvestWithheldTokensToMintInstruction(
                    new PublicKey(account.mintAddress), // destination mint
                    [account.pubkey], // accounts to harvest from
  
                    programId
                  )
                );
              }
            }
          transaction.add(
            createCloseAccountInstruction(
              account.pubkey,
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
            connection,
            wallet
          );
          console.log(
            `✅ Closed batch ${Math.floor(i / BATCH_SIZE) + 1}:`,
            signature
          );
          newTransactionHashes.push(signature); // Collect the transaction hash
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
            `Failed to close batch ${
              Math.floor(i / BATCH_SIZE) + 1
            }: ${errorMessage}`
          );
          if (errorMessage.includes("rejected")) {
            setError("Transaction was rejected by user. Stopping process.");
            break;
          }
        }

        if (i + BATCH_SIZE < accountsToClose.length) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      setTransactionHashes(newTransactionHashes); // Update state with collected hashes
      console.log(
        `All accounts closed successfully. Total: ${totalClosed}/${accountsToClose.length}`
      );
      if (totalClosed > 0) {
        setIsSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to close accounts");
      console.error("Error closing accounts:", err);
    } finally {
      setIsClosing(false);
    }
  }, [accounts, connection, referralAccount, publicKey, selectedAccounts]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    setSelectedAccounts,
    selectedAccounts,
    setReferralAccount,
    cleanClosedAccounts,
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
