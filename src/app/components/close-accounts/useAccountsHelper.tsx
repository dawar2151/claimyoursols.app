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
import { createCloseAccountInstruction, TOKEN_PROGRAM_ID, ACCOUNT_SIZE } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";

interface AccountData {
    pubkey: PublicKey;
    account: AccountInfo<ParsedAccountData>;
    lamports: number;
    rentExemptReserve: number;
}

interface ProgramIds {
    splToken: string;
    splToken2022: string;
    feeRecipient: string;
}

const PROGRAM_IDS: ProgramIds = {
    splToken: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    splToken2022: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
    feeRecipient: process.env.NEXT_PUBLIC_FEE_RECIPIENT || "9Mh1cX7Ghh3b5FDJgQRowjCwJBnYn5AJeQZzvDcraHLD",
};

const BATCH_SIZE = 20;
const FEE_PERCENTAGE = parseFloat(process.env.NEXT_PUBLIC_CLOSE_ACCOUNT_FEE || '0.1');


const fetchTokenAccounts = async (
    connection: Connection,
    publicKey: PublicKey,
    programId: string
) => {
    return connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey(programId),
    });
};

const isValidTokenAccount = (
    account: { account: AccountInfo<ParsedAccountData> },
    programIds: ProgramIds,
    rentExemptReserve: number
) => {
    const { account: info } = account;
    const owner = info.owner.toString();
    const isValidProgram =
        owner === programIds.splToken || owner === programIds.splToken2022;
    const hasRent = info.lamports >= rentExemptReserve;
    const tokenAmount = info.data?.parsed?.info?.tokenAmount?.uiAmount ?? null;
    const isEmpty = tokenAmount === 0;

    console.log(
        `Account ${account.account.owner.toString()} => balance: ${tokenAmount}, rent: ${info.lamports}, closeable: ${isValidProgram && hasRent && isEmpty}`
    );

    return isValidProgram && hasRent && isEmpty;
};

const createFeeInstructions = async (
    publicKey: PublicKey,
    totalFee: number,
    referralAccount: string | undefined,
    programIds: ProgramIds,
    connection: Connection // Add connection parameter
): Promise<Transaction> => {
    const transaction = new Transaction();

    if (totalFee > 0) {
        if (
            referralAccount &&
            referralAccount !== publicKey.toString() &&
            PublicKey.isOnCurve(new PublicKey(referralAccount))
        ) {
            // Check if referralAccount exists on-chain
            const referralPubkey = new PublicKey(referralAccount);
            const accountInfo = await connection.getAccountInfo(referralPubkey);

            if (accountInfo === null) {
                console.warn(`Referral account ${referralAccount} does not exist. Sending full fee to feeRecipient.`);
                // Fallback to sending full fee to feeRecipient
                transaction.add(
                    SystemProgram.transfer({
                        fromPubkey: publicKey,
                        toPubkey: new PublicKey(programIds.feeRecipient),
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
                        toPubkey: new PublicKey(programIds.feeRecipient),
                        lamports: totalFee / 2,
                    })
                );
            }
        } else {
            // No valid referralAccount, send full fee to feeRecipient
            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: new PublicKey(programIds.feeRecipient),
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
    const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());
    const [transactionHashes, setTransactionHashes] = useState<string[]>([]); // New state for transaction hashes
    const publicKey = useWallet().publicKey;
    const fetchAccounts = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            if (!publicKey) {
                throw new Error("Wallet not connected");
            }
            const rentExemptReserve = await connection.getMinimumBalanceForRentExemption(ACCOUNT_SIZE);

            const [splTokenAccounts, token2022Accounts] = await Promise.all([
                fetchTokenAccounts(connection, publicKey, PROGRAM_IDS.splToken),
                fetchTokenAccounts(connection, publicKey, PROGRAM_IDS.splToken2022),
            ]);

            const closeableAccounts = [...splTokenAccounts.value, ...token2022Accounts.value]
                .filter((account) => isValidTokenAccount(account, PROGRAM_IDS, rentExemptReserve))
                .map((account) => ({
                    pubkey: account.pubkey,
                    account: account.account,
                    lamports: account.account.lamports,
                    rentExemptReserve,
                }));

            setAccounts(closeableAccounts);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch accounts");
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
                    const isSPLToken = accountOwner === PROGRAM_IDS.splToken;
                    const isToken2022 = accountOwner === PROGRAM_IDS.splToken2022;

                    if (!isSPLToken && !isToken2022) continue;

                    const programId = isToken2022
                        ? new PublicKey(PROGRAM_IDS.splToken2022)
                        : TOKEN_PROGRAM_ID;

                    transaction.add(
                        createCloseAccountInstruction(
                            account.pubkey,
                            publicKey,
                            publicKey,
                            [],
                            programId
                        )
                    );

                    totalFee += Math.floor(account.lamports * FEE_PERCENTAGE);
                }

                if (transaction.instructions.length === 0) continue;

                const feeInstructions = await createFeeInstructions(
                    publicKey,
                    totalFee,
                    referralAccount,
                    PROGRAM_IDS,
                    connection
                );
                transaction.add(...feeInstructions.instructions);

                const { blockhash } = await connection.getLatestBlockhash();
                transaction.recentBlockhash = blockhash;
                transaction.feePayer = publicKey;

                try {
                    const signature = await sendTransactionHelper(transaction, connection);
                    console.log(`✅ Closed batch ${Math.floor(i / BATCH_SIZE) + 1}:`, signature);
                    newTransactionHashes.push(signature); // Collect the transaction hash
                    totalClosed += batch.length;
                } catch (batchError) {
                    const errorMessage = batchError instanceof Error
                        ? batchError.message
                        : "An unknown error occurred while closing accounts";
                    console.error(`❌ Error closing batch ${Math.floor(i / BATCH_SIZE) + 1}:`, batchError);
                    setError(`Failed to close batch ${Math.floor(i / BATCH_SIZE) + 1}: ${errorMessage}`);
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
            console.log(`All accounts closed successfully. Total: ${totalClosed}/${accountsToClose.length}`);
            setIsSuccess(true);
            await fetchAccounts();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to close accounts");
            console.error("Error closing accounts:", err);
        } finally {
            setIsClosing(false);
        }
    }, [accounts, connection, referralAccount, fetchAccounts, publicKey, selectedAccounts]);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    return {
        setSelectedAccounts,
        selectedAccounts,
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