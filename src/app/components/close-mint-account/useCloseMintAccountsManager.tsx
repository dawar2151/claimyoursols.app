import { useCallback, useState, useEffect } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

export const useCloseMintAccountsManager = (connection: Connection) => {
    const { publicKey } = useWallet();
    const [mintAccounts, setMintAccounts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedMintAccounts, setSelectedMintAccounts] = useState<Set<string>>(new Set());

    const fetchOwnedMintAccounts = useCallback(async () => {
        if (!publicKey) {
            setError("Wallet not connected");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Get all mint accounts where you are the mint authority
            const mintAccounts = await connection.getParsedProgramAccounts(
                new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), // SPL Token Program
                {
                    filters: [
                        {
                            dataSize: 82, // Mint account data size
                        },
                        {
                            memcmp: {
                                offset: 4, // Mint authority offset
                                bytes: publicKey.toBase58(),
                            },
                        },
                    ],
                }
            );

            // Also check SPL Token 2022 program
            const token2022MintAccounts = await connection.getParsedProgramAccounts(
                new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'), // SPL Token 2022 Program
                {
                    filters: [
                        {
                            dataSize: 82, // Mint account data size
                        },
                        {
                            memcmp: {
                                offset: 4, // Mint authority offset
                                bytes: publicKey.toBase58(),
                            },
                        },
                    ],
                }
            );

            const allMintAccounts = [...mintAccounts, ...token2022MintAccounts];

            const ownedMints = allMintAccounts
                .filter((account) => {
                    // Check if data is properly parsed
                    if (
                        !('parsed' in account.account?.data) ||
                        !account.account.data.parsed?.info
                    ) {
                        console.warn('Account data not properly parsed:', account.pubkey.toString());
                        return false;
                    }

                    const mintData =
                        'parsed' in account.account.data ? account.account.data.parsed.info : null;

                    // Ensure mintData exists and has the required fields
                    if (!mintData) {
                        return false;
                    }

                    return (
                        mintData.mintAuthority === publicKey.toString() ||
                        mintData.freezeAuthority === publicKey.toString()
                    );
                })
                .map((account) => {
                    const mintData =
                        'parsed' in account.account.data ? account.account.data.parsed.info : null;

                    return {
                        pubkey: account.pubkey,
                        mintAuthority: mintData.mintAuthority,
                        freezeAuthority: mintData.freezeAuthority,
                        supply: mintData.supply || '0',
                        decimals: mintData.decimals || 0,
                        isInitialized: mintData.isInitialized || false,
                        rentExemptReserve: account.account.lamports,
                        // Additional useful fields
                        programId: account.account.owner.toString(),
                        isToken2022: account.account.owner.toString() === 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
                    };
                });

            console.log(`Found ${ownedMints.length} owned mint accounts`);
            setMintAccounts(ownedMints);

        } catch (err) {
            console.error('Error fetching owned mint accounts:', err);
            setError('Failed to fetch mint accounts. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [connection, publicKey]);

    // Filter for closeable mint accounts (supply = 0, you are authority)
    const closeableMintAccounts = mintAccounts.filter((mint) => {
        return (
            mint.supply === '0' && // No tokens in circulation
            (mint.mintAuthority === publicKey?.toString() ||
                mint.freezeAuthority === publicKey?.toString()) // You have authority
        );
    });

    useEffect(() => {
        if (publicKey) {
            fetchOwnedMintAccounts();
        } else {
            setMintAccounts([]);
            setError(null);
        }
    }, [publicKey, fetchOwnedMintAccounts]);

    return {
        mintAccounts: closeableMintAccounts,
        isLoading,
        error,
        refreshAccounts: fetchOwnedMintAccounts,
        totalMints: mintAccounts.length,
        closeableMints: closeableMintAccounts.length,
        selectedMintAccounts,
        setSelectedMintAccounts,
    };
};