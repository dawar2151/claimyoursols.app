"use client";

import React, { useContext, useMemo } from "react";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { ClaimYourSolsStateContext } from "@/app/providers";

require("@solana/wallet-adapter-react-ui/styles.css");

import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    AlphaWalletAdapter,
    LedgerWalletAdapter,
    CoinbaseWalletAdapter,
    TorusWalletAdapter,
    CloverWalletAdapter,
    MathWalletAdapter,
    WalletConnectWalletAdapter,
} from "@solana/wallet-adapter-wallets";

export default function AppWalletProvider({ children }: { children: React.ReactNode }) {
    const { claimYourSolsState } = useContext(ClaimYourSolsStateContext);

    const endpoint = useMemo(() => {
        return clusterApiUrl(
            claimYourSolsState.network as unknown as WalletAdapterNetwork
        );
    }, [claimYourSolsState.network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new LedgerWalletAdapter(),
            new CoinbaseWalletAdapter(),
            new AlphaWalletAdapter(),
            new TorusWalletAdapter(),
            new CloverWalletAdapter(),
            new MathWalletAdapter(),
            new WalletConnectWalletAdapter({
                network:
                    claimYourSolsState.network === "devnet"
                        ? WalletAdapterNetwork.Devnet
                        : WalletAdapterNetwork.Mainnet,
                options: {
                    relayUrl: 'wss://relay.walletconnect.com', // WalletConnect v1 relay URL
                    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || ''// WalletConnect v2 project ID (if applicable)
                },
            }),
        ],
        [claimYourSolsState.network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect onError={async (error, adapter) => {
                console.error("Wallet error:", error);

                // Handle specific wallet errors
                if (error.name === "WalletNotReadyError") {
                    console.warn("Wallet not ready. Prompting user to install the wallet.");

                    const userResponse = alert(
                        `This wallet is not installed. Please install it first.`
                    );
                    // Reset the wallet adapter state
                    if (adapter) {
                        try {
                            await adapter.disconnect(); // Disconnect the wallet to reset its state
                            console.log("Wallet state reset successfully.");
                        } catch (disconnectError) {
                            console.error("Failed to reset wallet adapter state:", disconnectError);
                        }
                    }
                }
            }}>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}
