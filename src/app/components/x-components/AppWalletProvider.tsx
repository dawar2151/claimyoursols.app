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
    SolongWalletAdapter,
    CoinbaseWalletAdapter,
    TorusWalletAdapter,
    CloverWalletAdapter,
    MathWalletAdapter,
    TokenPocketWalletAdapter,
    WalletConnectWalletAdapter,
    BitgetWalletAdapter,
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
            new SolongWalletAdapter({ network: claimYourSolsState.network }),
            new CoinbaseWalletAdapter(),
            new AlphaWalletAdapter(),
            new TorusWalletAdapter(),
            new BitgetWalletAdapter(),
            new CloverWalletAdapter(),
            new MathWalletAdapter(),
            new TokenPocketWalletAdapter(),
            new WalletConnectWalletAdapter({
                network:
                    claimYourSolsState.network === "devnet"
                        ? WalletAdapterNetwork.Devnet
                        : WalletAdapterNetwork.Mainnet,
                options: {
                    relayUrl: 'wss://relay.walletconnect.com', // WalletConnect v1 relay URL
                    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || 'ccfd553984d17c8eb13ac9d69badf968'// WalletConnect v2 project ID (if applicable)
                },
            }),
        ],
        [claimYourSolsState.network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}
