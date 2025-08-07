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

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

// imports here

export default function AppWalletProvider({ children }: { children: React.ReactNode }) {

    const { claimYourSolsState } = useContext(ClaimYourSolsStateContext);
    const endpoint = useMemo(() => {
        // Dynamically change the endpoint based on the selected network
        return clusterApiUrl(claimYourSolsState.network as unknown as WalletAdapterNetwork);
    }, [claimYourSolsState.network]);

    const wallets = useMemo(() => [
        // Add the wallets you want to support
        // Example: new PhantomWalletAdapter(),
    ], [claimYourSolsState.network]);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {/* Pass down the handleNetworkChange function to children if needed */}
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}
