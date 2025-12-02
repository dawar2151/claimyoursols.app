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
  createHarvestWithheldTokensToMintInstruction,
} from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { calculateCommission, getFeeRecipient } from "@/app/utils/utils";
import {
  checkWithheldAmount,
  isValidTokenAccountForBurnAndClose,
} from "@/app/utils/spl-utils";
import { fetchTokenMetadata, TokenMetadata } from "@/app/utils/MetadataApi";
import { getEllibleAccountsForBurn } from "@/api/moralis";
import { getAccountInfoWithRetry } from "@/app/utils/accountUtils";

export interface AccountData {
  pubkey: PublicKey;
  account: AccountInfo<ParsedAccountData>;
  lamports: number;
  uiAmount: number | null;
  usdValue?: number;
  mint: PublicKey;
  decimals: number;
  amount: string;
  rentExemptReserve: number;
  tokenName?: string;
  tokenSymbol?: string;
  tokenUri?: string;
  metadata?: TokenMetadata;
  withheldAmount?: number;
  hasWithheldTokens?: boolean;
  mintAddress?: PublicKey;
}

const BATCH_SIZE = 10;
const METADATA_BATCH_SIZE = 5; // Smaller batches for metadata fetching
const WSOLMINT = "So11111111111111111111111111111111111111112";

const fetchTokenAccounts = async (
  connection: Connection,
  publicKey: PublicKey,
  programId: PublicKey
) => {
  return connection.getParsedTokenAccountsByOwner(publicKey, {
    programId: programId,
  });
};

const fetchMetadataForAccounts = async (
  accounts: AccountData[],
  connection: Connection,
  onProgress?: (_current: number, _total: number) => void
): Promise<AccountData[]> => {
  const accountsWithMetadata: AccountData[] = [];
  let processedCount = 0;

  console.log(`📋 Starting metadata fetch for ${accounts.length} accounts...`);

  // Process in batches like transactions
  for (let i = 0; i < accounts.length; i += METADATA_BATCH_SIZE) {
    const batch = accounts.slice(i, i + METADATA_BATCH_SIZE);
    const batchNumber = Math.floor(i / METADATA_BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(accounts.length / METADATA_BATCH_SIZE);

    console.log(
      `🔄 Processing metadata batch ${batchNumber}/${totalBatches}...`
    );
    try {
      // Process batch concurrently for better performance
      const batchPromises = batch.map(async (account) => {
        if (account?.tokenName) {
          return account;
        }

        try {
          const metadata = await fetchTokenMetadata(
            connection,
            account.account.data.parsed.info.mint
          );

          return {
            ...account,
            metadata,
            tokenName: metadata.name,
            tokenSymbol: metadata.symbol,
            tokenUri: metadata.uri,
          };
        } catch (metadataError) {
          console.error(
            `❌ Error fetching metadata for ${account.mint}:`,
            metadataError
          );
          // Still add the account even if metadata fetch fails
          return account;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      //const filteredBatchResults = batchResults.filter(a => a.tokenName != Unknown);
      accountsWithMetadata.push(...batchResults);
      processedCount += batch.length;

      console.log(
        `✅ Completed metadata batch ${batchNumber}: ${batch.length} accounts`
      );

      if (onProgress) {
        onProgress(processedCount, accounts.length);
      }

      if (i + METADATA_BATCH_SIZE < accounts.length) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (batchError) {
      console.error(
        `❌ Error processing metadata batch ${batchNumber}:`,
        batchError
      );
      continue;
    }
  }

  console.log(
    `📋 Metadata fetch completed. Processed: ${processedCount}/${accounts.length} accounts`
  );

  return accountsWithMetadata;
};

const createFeeInstructions = async (
  publicKey: PublicKey,
  totalFee: number,
  referralAccount: string | undefined,
  connection: Connection
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
      const accountInfo = await getAccountInfoWithRetry(connection, referralPubkey);

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

const ITEMS_PER_PAGE = 10;
export function useBurnAndCloseAccountsManager(connection: Connection) {
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [allAccounts, setAllAccounts] = useState<AccountData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [hasMoreAccounts, setHasMoreAccounts] = useState(true);
  const [referralAccount, setReferralAccount] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [metadataProgress, setMetadataProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const [currentTotalRent, setCurrentTotalRent] = useState<number>(0);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [transactionHashes, setTransactionHashes] = useState<string[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(
    new Set()
  );
  const wallet = useWallet();
  const publicKey = wallet.publicKey;

  const cleanClosedAccounts = useCallback(() => {
    const updatedAllAccounts = allAccounts.filter(
      (account) => !selectedAccounts.has(account.pubkey.toString())
    );
    setAllAccounts(updatedAllAccounts);

    const currentDisplayedCount = accounts.length;
    const endIndex = Math.min(currentDisplayedCount, updatedAllAccounts.length);
    setAccounts(updatedAllAccounts.slice(0, endIndex));

    setSelectedAccounts(new Set());
    setIsSuccess(false);
    setHasMoreAccounts(updatedAllAccounts.length > endIndex);
  }, [allAccounts, selectedAccounts, accounts.length]);

  const fetchAccounts = useCallback(
    async (reset: boolean = true) => {
      if (reset) {
        setIsLoading(true);
        setCurrentPage(0);
      } else {
        setIsLoadingMore(true);
      }
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

        let closeableAccounts = [
          ...splTokenAccounts.value,
          ...token2022Accounts.value,
        ]
          .filter((account) =>
            isValidTokenAccountForBurnAndClose(account, rentExemptReserve)
          )
          .filter(
            (account) => account.account.data.parsed?.info?.state !== "frozen" && account.account.data.parsed?.info?.mint != WSOLMINT && account.account.data.parsed.info.tokenAmount.amount !== "0"
          )
          .map((account) => {
            const { withheldAmount, hasWithheldTokens, mintAddress } =
              checkWithheldAmount(account.account);

            return {
              pubkey: account.pubkey,
              account: account.account,
              uiAmount: account.account.data.parsed.info.tokenAmount.uiAmount,
              decimals: account.account.data.parsed.info.tokenAmount.decimals,
              mint: account.account.data.parsed.info.mint,
              amount: account.account.data.parsed.info.tokenAmount.amount,
              lamports: account.account.lamports,
              rentExemptReserve,
              withheldAmount,
              hasWithheldTokens,
              mintAddress,
            };
          })
          .filter((account) => !account.hasWithheldTokens);
        closeableAccounts = await getEllibleAccountsForBurn(closeableAccounts);
        if (reset) {
          // Store all accounts without metadata first
          setAllAccounts(closeableAccounts);
          setHasMoreAccounts(closeableAccounts.length > ITEMS_PER_PAGE);

          // Fetch metadata only for the first page
          const firstPageAccounts = closeableAccounts.slice(0, ITEMS_PER_PAGE);
          setMetadataProgress({ current: 0, total: firstPageAccounts.length });

          const accountsWithMetadata = await fetchMetadataForAccounts(
            firstPageAccounts,
            connection,
            (current, total) => {
              setMetadataProgress({ current, total });
            }
          );

          setAccounts(accountsWithMetadata);
          setMetadataProgress(null); // Clear progress when done
        }
      } catch (err) {
        console.error("Error fetching accounts:", err);
      } finally {
        if (reset) {
          setIsLoading(false);
        } else {
          setIsLoadingMore(false);
        }
      }
    },
    [connection, publicKey]
  );

  const loadMoreAccounts = useCallback(async () => {
    const nextPage = currentPage + 1;
    const endIndex = (nextPage + 1) * ITEMS_PER_PAGE;
    const currentDisplayedCount = (currentPage + 1) * ITEMS_PER_PAGE;

    if (currentDisplayedCount < allAccounts.length) {
      setIsLoadingMore(true);

      try {
        const newAccountsToShow = allAccounts.slice(
          currentDisplayedCount,
          Math.min(endIndex, allAccounts.length)
        );

        const accountsNeedingMetadata = newAccountsToShow.filter(
          (account) => !account.metadata
        );

        if (accountsNeedingMetadata.length > 0) {
          setMetadataProgress({
            current: 0,
            total: accountsNeedingMetadata.length,
          });

          const newAccountsWithMetadata = await fetchMetadataForAccounts(
            accountsNeedingMetadata,
            connection,
            (current, total) => {
              setMetadataProgress({ current, total });
            }
          );

          const updatedAllAccounts = [...allAccounts];
          newAccountsWithMetadata.forEach((accountWithMetadata) => {
            const index = updatedAllAccounts.findIndex(
              (acc) =>
                acc.pubkey.toString() === accountWithMetadata.pubkey.toString()
            );
            if (index !== -1) {
              updatedAllAccounts[index] = {
                ...updatedAllAccounts[index],
                ...accountWithMetadata,
              };
            }
          });
          setAllAccounts(updatedAllAccounts);

          const finalEndIndex = Math.min(endIndex, updatedAllAccounts.length);
          setAccounts(updatedAllAccounts.slice(0, finalEndIndex));
          setMetadataProgress(null);
        } else {
          const finalEndIndex = Math.min(endIndex, allAccounts.length);
          setAccounts(allAccounts.slice(0, finalEndIndex));
        }

        setCurrentPage(nextPage);
        const finalDisplayedCount = Math.min(endIndex, allAccounts.length);
        setHasMoreAccounts(finalDisplayedCount < allAccounts.length);
      } catch (error) {
        console.error("Error loading more accounts:", error);
        // Fallback to showing accounts without metadata
        setCurrentPage(nextPage);
        const finalEndIndex = Math.min(endIndex, allAccounts.length);
        setAccounts(allAccounts.slice(0, finalEndIndex));
        setHasMoreAccounts(finalEndIndex < allAccounts.length);
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [currentPage, allAccounts, connection]);

  const goToPage = useCallback(
    async (page: number) => {
      const endIndex = (page + 1) * ITEMS_PER_PAGE;

      if (page >= 0 && page * ITEMS_PER_PAGE < allAccounts.length) {
        setIsLoadingMore(true);

        try {
          // Check if we need to fetch metadata for any accounts up to this page
          const accountsToShow = allAccounts.slice(
            0,
            Math.min(endIndex, allAccounts.length)
          );
          const accountsNeedingMetadata = accountsToShow.filter(
            (account) => !account.metadata
          );

          if (accountsNeedingMetadata.length > 0) {
            // Set progress for metadata loading
            setMetadataProgress({
              current: 0,
              total: accountsNeedingMetadata.length,
            });

            // Fetch metadata for accounts that need it
            const accountsWithMetadata = await fetchMetadataForAccounts(
              accountsNeedingMetadata,
              connection,
              (current, total) => {
                setMetadataProgress({ current, total });
              }
            );

            // Update allAccounts with the new metadata
            const updatedAllAccounts = [...allAccounts];
            accountsWithMetadata.forEach((accountWithMetadata) => {
              const index = updatedAllAccounts.findIndex(
                (acc) =>
                  acc.pubkey.toString() ===
                  accountWithMetadata.pubkey.toString()
              );
              if (index !== -1) {
                updatedAllAccounts[index] = {
                  ...updatedAllAccounts[index],
                  ...accountWithMetadata,
                };
              }
            });
            setAllAccounts(updatedAllAccounts);
            const finalEndIndex = Math.min(endIndex, updatedAllAccounts.length);
            setAccounts(updatedAllAccounts.slice(0, finalEndIndex));
            setMetadataProgress(null); // Clear progress when done
          } else {
            const finalEndIndex = Math.min(endIndex, allAccounts.length);
            setAccounts(allAccounts.slice(0, finalEndIndex));
          }

          setCurrentPage(page);
          setHasMoreAccounts(allAccounts.length > endIndex);
        } catch (error) {
          console.error("Error going to page:", error);
          // Fallback to showing accounts without metadata
          setCurrentPage(page);
          const finalEndIndex = Math.min(endIndex, allAccounts.length);
          setAccounts(allAccounts.slice(0, finalEndIndex));
          setHasMoreAccounts(allAccounts.length > endIndex);
        } finally {
          setIsLoadingMore(false);
        }
      }
    },
    [allAccounts, connection]
  );

  const closeAllAccounts = useCallback(async () => {
    setIsClosing(true);
    setError(null);
    setTransactionHashes([]);

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
      const accountsToBurnAndClose = accounts.filter((account) => {
        const isSelected = selectedAccounts.has(account.pubkey.toString());
        const isNotFrozen =
          account.account.data.parsed?.info?.state !== "frozen";
        return isSelected && isNotFrozen;
      });
      let currentRent = 0;

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

          const rawAmount =
            account.account.data.parsed?.info?.tokenAmount?.amount;
          if (rawAmount === undefined) {
            console.error(
              `Token amount not found for account: ${account.pubkey.toString()}`
            );
            continue;
          }

          // Log withheld amount info for each account being processed
          if (account.hasWithheldTokens) {
            console.log(
              `Processing account ${account.pubkey.toString()} with withheld amount: ${account.withheldAmount
              }`
            );
          }

          const burnAmount = rawAmount ? BigInt(rawAmount) : BigInt(0);

          console.log(`Burn Amount: ${burnAmount.toString()} lamports`);
          if (isNaN(rawAmount) || rawAmount <= 0) {
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
          const mintPubkey = new PublicKey(mint);
          transaction.add(
            createBurnInstruction(
              pubkey,
              mintPubkey,
              publicKey,
              burnAmount,
              [],
              programId
            )
          );
          if (account.hasWithheldTokens) {
            console.log(
              `Closing account ${account.pubkey.toString()} with withheld amount: ${account.withheldAmount
              }`
            );
            if (account.mintAddress) {
              transaction.add(
                createHarvestWithheldTokensToMintInstruction(
                  new PublicKey(account.mintAddress),
                  [account.pubkey],
                  programId
                )
              );
            }
          }

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
          currentRent += account.lamports;
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

          if (errorMessage.includes("rejected")) {
            // Show popup alert instead of setting error state
            alert("Transaction was rejected by user. Process stopped.");
            break;
          } else {
            // Only set error for non-rejection errors
            setError(
              `Failed to close batch ${Math.floor(i / BATCH_SIZE) + 1
              }: ${errorMessage}`
            );
          }
        }

        if (i + BATCH_SIZE < accountsToBurnAndClose.length) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
      setCurrentTotalRent(currentRent);
      setTransactionHashes(newTransactionHashes);
      console.log(
        `All accounts closed successfully. Total: ${totalClosed}/${accountsToBurnAndClose.length}`
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
  }, [
    publicKey,
    allAccounts,
    selectedAccounts,
    referralAccount,
    connection,
    wallet,
  ]);

  const refreshAccounts = useCallback(async () => {
    const currentPageToMaintain = currentPage;

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

      let closeableAccounts = [
        ...splTokenAccounts.value,
        ...token2022Accounts.value,
      ]
        .filter((account) =>
          isValidTokenAccountForBurnAndClose(account, rentExemptReserve)
        )
        .filter(
          (account) => account.account.data.parsed?.info?.state !== "frozen" && account.account.data.parsed?.info?.mint != WSOLMINT
        )
        .map((account) => {
          // Check for withheld amount in Token 2022 accounts
          const { withheldAmount, hasWithheldTokens, mintAddress } =
            checkWithheldAmount(account.account);

          return {
            pubkey: account.pubkey,
            account: account.account,
            uiAmount: account.account.data.parsed.info.tokenAmount.uiAmount,
            decimals: account.account.data.parsed.info.tokenAmount.decimals,
            mint: account.account.data.parsed.info.mint,
            amount: account.account.data.parsed.info.tokenAmount.amount,
            lamports: account.account.lamports,
            rentExemptReserve,
            withheldAmount,
            hasWithheldTokens,
            mintAddress,
          };
        })
        .filter((account) => !account.hasWithheldTokens);

      closeableAccounts = await getEllibleAccountsForBurn(closeableAccounts, process.env.NEXT_PUBLIC_MORALIS_API_KEY || "");

      setAllAccounts(closeableAccounts);

      const accountsToShow = Math.min(
        (currentPageToMaintain + 1) * ITEMS_PER_PAGE,
        closeableAccounts.length
      );

      const accountsToFetch = closeableAccounts.slice(0, accountsToShow);

      if (accountsToFetch.length > 0) {
        setMetadataProgress({ current: 0, total: accountsToFetch.length });

        const accountsWithMetadata = await fetchMetadataForAccounts(
          accountsToFetch,
          connection,
          (current, total) => {
            setMetadataProgress({ current, total });
          }
        );

        // Update allAccounts with metadata
        const updatedAllAccounts = [...closeableAccounts];
        accountsWithMetadata.forEach((accountWithMetadata) => {
          const index = updatedAllAccounts.findIndex(
            (acc) =>
              acc.pubkey.toString() === accountWithMetadata.pubkey.toString()
          );
          if (index !== -1) {
            updatedAllAccounts[index] = {
              ...updatedAllAccounts[index],
              ...accountWithMetadata,
            };
          }
        });

        setAllAccounts(updatedAllAccounts);
        setAccounts(accountsWithMetadata);
        setMetadataProgress(null);
      } else {
        setAccounts([]);
      }

      // Maintain the current page if it's valid
      if (
        currentPageToMaintain >= 0 &&
        accountsToShow <= closeableAccounts.length
      ) {
        setCurrentPage(currentPageToMaintain);
      } else {
        setCurrentPage(0);
      }

      setHasMoreAccounts(closeableAccounts.length > accountsToShow);
    } catch (err) {
      console.error("Error refreshing accounts:", err);
      setError(
        err instanceof Error ? err.message : "Failed to refresh accounts"
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, publicKey, connection]);

  useEffect(() => {
    if (acceptedTerms && publicKey) {
      fetchAccounts(true);
    } else {
      setAccounts([]);
      setAllAccounts([]);
      setCurrentPage(0);
      setHasMoreAccounts(false);
      setIsSuccess(false);
      setSelectedAccounts(new Set());
    }
  }, [fetchAccounts, publicKey, acceptedTerms]);

  return {
    selectedAccounts,
    setSelectedAccounts,
    setReferralAccount,
    cleanClosedAccounts,
    setAcceptedTerms,
    acceptedTerms,
    currentTotalRent,
    accounts,
    allAccounts,
    currentPage,
    hasMoreAccounts,
    isLoadingMore,
    metadataProgress,
    totalPages: Math.ceil(allAccounts.length / ITEMS_PER_PAGE),
    itemsPerPage: ITEMS_PER_PAGE,
    totalAccounts: allAccounts.length,
    isSuccess,
    isLoading,
    isClosing,
    error,
    transactionHashes,
    closeAllAccounts,
    clearTransactionHashes: setTransactionHashes,
    refreshAccounts,
    loadMoreAccounts,
    goToPage,
  };
}
