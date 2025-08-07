/* eslint-disable no-unused-vars */

import { Connection } from "@solana/web3.js";

export type ClaimYourSolsState = {
    network: string;
    connection: Connection;
}

const getRpcEndpoint = () => {
    const customRpc = process.env.NEXT_PUBLIC_RPC_ENDPOINT;
    const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

    if (!alchemyApiKey && !customRpc) {
        throw new Error("Alchemy API key is not set in environment variables.");
    }

    if (customRpc) {
        return customRpc;
    }

    return `https://solana-mainnet.g.alchemy.com/v2/${alchemyApiKey}`;
};

export const initialClaimYourSolsState: ClaimYourSolsState = {
    network: process.env.NEXT_PUBLIC_NETWORK || "mainnet-beta",
    connection: new Connection(getRpcEndpoint()),
}

/* eslint-enable no-unused-vars */