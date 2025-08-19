import { useCallback, useState, useEffect } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  createCloseAccountInstruction,
  createBurnInstruction,
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  getMint,
} from "@solana/spl-token";
import { sendTransactionHelper } from "../useSenTransactionHelper";

// Types
interface ParsedTokenAccountData {
  mint: string;
  owner: string;
  tokenAmount: {
    amount: string;
    decimals: number;
    uiAmount: number;
  };
  closeAuthority?: string;
}

interface MintAccountData {
  pubkey: PublicKey;
  mintAuthority: string | null;
  freezeAuthority: string | null;
  supply: string;
  decimals: number;
  isInitialized: boolean;
  lamports: number;
  rentExemptReserve: number;
  isToken2022: boolean;
  hasAssociatedTokenAccount: boolean;
  associatedTokenAccountAddress: PublicKey;
  ataBalance: string;
  ataCloseAuthority: string | null;
}

interface TokenAccountInfo {
  address: PublicKey;
  balance: string;
  closeAuthority: string | null;
}

// Constants
const FEE_PERCENTAGE = parseFloat(
  process.env.NEXT_PUBLIC_FEE_PERCENTAGE || "0.1"
);
const DEFAULT_FEE_RECIPIENT = "6tdnTdEBPow4FcZW2WEXm6R9CHAwsxci6QdCa3NX9zDp";

// Helper functions
const getFeeRecipient = (): PublicKey => {
  const recipient =
    process.env.NEXT_PUBLIC_FEE_RECIPIENT || DEFAULT_FEE_RECIPIENT;
  return new PublicKey(recipient);
};

const isValidParsedData = (data: any): data is ParsedTokenAccountData => {
  return (
    data &&
    typeof data.mint === "string" &&
    typeof data.owner === "string" &&
    data.tokenAmount &&
    typeof data.tokenAmount.amount === "string"
  );
};

const canCloseMintAccount = (
  mint: MintAccountData,
  publicKey: PublicKey
): boolean => {
  const userAddress = publicKey.toString();
  const canCloseAta =
    !mint.hasAssociatedTokenAccount || mint.ataCloseAuthority === userAddress;

  return canCloseAta;
};

export const useCloseMintAccountsManager = (connection: Connection) => {
  // State
  const { publicKey, sendTransaction } = useWallet();
  const [mintAccounts, setMintAccounts] = useState<MintAccountData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMintAccounts, setSelectedMintAccounts] = useState<Set<string>>(
    new Set()
  );
  const [isClosing, setIsClosing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionHashes, setTransactionHashes] = useState<string[]>([]);

  // Fetch token accounts and extract mint addresses
  const fetchTokenAccounts = useCallback(async (): Promise<
    Map<string, TokenAccountInfo>
  > => {
    if (!publicKey) throw new Error("Wallet not connected");

    const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, {
      programId: TOKEN_2022_PROGRAM_ID,
    });

    const tokenAccountMap = new Map<string, TokenAccountInfo>();

    for (const tokenAccount of tokenAccounts.value) {
      try {
        const accountData = await connection.getParsedAccountInfo(
          tokenAccount.pubkey
        );
        const parsedData = (accountData.value?.data as any)?.parsed?.info;

        if (isValidParsedData(parsedData)) {
          tokenAccountMap.set(parsedData.mint, {
            address: new PublicKey(tokenAccount.pubkey),
            balance: parsedData.tokenAmount.amount,
            closeAuthority: parsedData.closeAuthority || parsedData.owner,
          });
        }
      } catch (error) {
        console.warn(
          `Failed to parse token account ${tokenAccount.pubkey.toString()}:`,
          error
        );
      }
    }

    return tokenAccountMap;
  }, [connection, publicKey]);

  // Fetch mint account details
  const fetchMintAccountData = useCallback(
    async (
      mintAddress: string,
      tokenAccountInfo?: TokenAccountInfo
    ): Promise<MintAccountData | null> => {
      try {
        const mintPubkey = new PublicKey(mintAddress);

        // Get mint info using Token2022 program
        const mintInfo = await getMint(
          connection,
          mintPubkey,
          "confirmed",
          TOKEN_2022_PROGRAM_ID
        );
        const accountInfo = await connection.getAccountInfo(mintPubkey);

        if (!accountInfo) {
          throw new Error("Mint account not found");
        }

        // Check if user has authority
        const mintAuthority = mintInfo.mintAuthority?.toBase58() || null;
        const freezeAuthority = mintInfo.freezeAuthority?.toBase58() || null;

        // Calculate rent exempt reserve
        const rentExemptReserve =
          await connection.getMinimumBalanceForRentExemption(
            accountInfo.data.length
          );

        // Get ATA info
        const associatedTokenAccountAddress = getAssociatedTokenAddressSync(
          mintPubkey,
          publicKey!,
          false,
          TOKEN_2022_PROGRAM_ID
        );

        const ataInfo = tokenAccountInfo || {
          address: associatedTokenAccountAddress,
          balance: "0",
          closeAuthority: null,
        };

        return {
          pubkey: mintPubkey,
          mintAuthority,
          freezeAuthority,
          supply: mintInfo.supply.toString(),
          decimals: mintInfo.decimals,
          isInitialized: mintInfo.isInitialized,
          lamports: accountInfo.lamports,
          rentExemptReserve,
          isToken2022: true,
          hasAssociatedTokenAccount: Boolean(tokenAccountInfo),
          associatedTokenAccountAddress: ataInfo.address,
          ataBalance: ataInfo.balance,
          ataCloseAuthority: ataInfo.closeAuthority,
        };
      } catch (error) {
        console.warn(`Failed to fetch mint ${mintAddress}:`, error);
        return null;
      }
    },
    [connection, publicKey]
  );

  // Main fetch function
  const fetchOwnedMintAccounts = useCallback(async () => {
    if (!publicKey) {
      setError("Wallet not connected");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get token accounts
      const tokenAccountMap = await fetchTokenAccounts();
      const mintAddresses = Array.from(tokenAccountMap.keys());

      if (mintAddresses.length === 0) {
        setMintAccounts([]);
        return;
      }

      // Fetch mint data for each address
      const mintPromises = mintAddresses.map((mintAddress) =>
        fetchMintAccountData(mintAddress, tokenAccountMap.get(mintAddress))
      );

      const mintResults = await Promise.all(mintPromises);
      const validMints = mintResults.filter(
        (mint): mint is MintAccountData => mint !== null
      );

      // Filter for closeable mints
      const closeableMints = validMints.filter((mint) =>
        canCloseMintAccount(mint, publicKey)
      );

      console.log(
        `Found ${closeableMints.length} closeable mint accounts out of ${validMints.length} total`
      );
      setMintAccounts(closeableMints);
    } catch (err) {
      console.error("Error fetching mint accounts:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch mint accounts";
      setError(`Failed to fetch mint accounts: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, fetchTokenAccounts, fetchMintAccountData]);

  // Create transaction instructions for closing a mint account
  const createCloseInstructions = useCallback(
    (account: MintAccountData): Transaction => {
      const transaction = new Transaction();

      // Step 1: Burn tokens if they exist in ATA
      if (account.hasAssociatedTokenAccount && BigInt(account.ataBalance) > 0) {
        if (account.mintAuthority === publicKey!.toString()) {
          const burnInstruction = createBurnInstruction(
            account.associatedTokenAccountAddress,
            account.pubkey,
            publicKey!,
            BigInt(account.ataBalance),
            [],
            TOKEN_2022_PROGRAM_ID
          );
          transaction.add(burnInstruction);
        }
      }

      // Step 2: Close ATA if it exists
      if (account.hasAssociatedTokenAccount) {
        const closeAtaInstruction = createCloseAccountInstruction(
          account.associatedTokenAccountAddress,
          publicKey!,
          publicKey!,
          [],
          TOKEN_2022_PROGRAM_ID
        );
        transaction.add(closeAtaInstruction);
      }

      // Step 4: Close the mint account
      const closeInstruction = createCloseAccountInstruction(
        account.pubkey,
        publicKey!,
        publicKey!,
        [],
        TOKEN_2022_PROGRAM_ID
      );
      transaction.add(closeInstruction);

      // Step 5: Add commission transfer
      const commission = Math.floor(account.lamports * FEE_PERCENTAGE);
      if (commission > 0) {
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey!,
            toPubkey: getFeeRecipient(),
            lamports: commission,
          })
        );
      }

      return transaction;
    },
    [publicKey]
  );

  // Process a single mint account closure
  const processMintAccount = useCallback(
    async (account: MintAccountData): Promise<string> => {
      if (!sendTransaction) {
        throw new Error("Wallet does not support transaction sending");
      }

      console.log(`Processing mint account: ${account.pubkey.toString()}`);

      const transaction = createCloseInstructions(account);

      // Set transaction properties
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey!;

      console.log(
        `Sending transaction with ${transaction.instructions.length} instructions`
      );

      // Send and confirm transaction
      const signature = await sendTransactionHelper(transaction, connection);

      console.log(
        `Successfully processed mint account: ${account.pubkey.toString()}`
      );
      return signature;
    },
    [connection, publicKey, sendTransaction, createCloseInstructions]
  );

  // Close all selected accounts
  const closeAllAccounts = useCallback(async () => {
    if (!publicKey || selectedMintAccounts.size === 0) {
      setError("No accounts selected or wallet not connected");
      return;
    }

    if (!sendTransaction) {
      setError("Wallet does not support transaction sending");
      return;
    }

    const selectedAccounts = mintAccounts.filter((account) =>
      selectedMintAccounts.has(account.pubkey.toString())
    );

    if (selectedAccounts.length === 0) {
      setError("No valid mint accounts selected");
      return;
    }

    setIsClosing(true);
    setError(null);
    setIsSuccess(false);
    setTransactionHashes([]);

    try {
      const hashes: string[] = [];

      // Process accounts sequentially to avoid issues
      for (const account of selectedAccounts) {
        try {
          const signature = await processMintAccount(account);
          hashes.push(signature);
        } catch (accountError) {
          console.error(
            `Failed to process account ${account.pubkey.toString()}:`,
            accountError
          );
          const errorMessage =
            accountError instanceof Error
              ? accountError.message
              : "Unknown error";
          setError(
            `Failed to process account ${account.pubkey.toString()}: ${errorMessage}`
          );
          // Continue with other accounts
        }
      }

      if (hashes.length > 0) {
        setTransactionHashes(hashes);
        setIsSuccess(true);
        await fetchOwnedMintAccounts(); // Refresh
        setSelectedMintAccounts(new Set()); // Clear selection
      }
    } catch (err) {
      console.error("Error closing mint accounts:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to close mint accounts";
      setError(errorMessage);
    } finally {
      setIsClosing(false);
    }
  }, [
    connection,
    publicKey,
    sendTransaction,
    selectedMintAccounts,
    mintAccounts,
    fetchOwnedMintAccounts,
    processMintAccount,
  ]);

  // Utility functions
  const clearTransactionHashes = useCallback(() => {
    setTransactionHashes([]);
    setIsSuccess(false);
  }, []);

  // Effects
  useEffect(() => {
    if (publicKey) {
      fetchOwnedMintAccounts();
    } else {
      setMintAccounts([]);
      setError(null);
      setSelectedMintAccounts(new Set());
    }
  }, [publicKey, fetchOwnedMintAccounts]);

  // Return hook interface
  return {
    mintAccounts,
    isLoading,
    error,
    isSuccess,
    isClosing,
    transactionHashes,
    refreshAccounts: fetchOwnedMintAccounts,
    closeAllAccounts,
    selectedMintAccounts,
    setSelectedMintAccounts,
    clearTransactionHashes,
  };
};
