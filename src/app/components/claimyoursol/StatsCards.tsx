"use client";

import React, { useContext, useEffect, useState } from "react";
import { PublicKey, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { ClaimYourSolsStateContext } from "@/app/providers";
import { colors } from "@/app/utils/colors";
import { getAccountInfoWithRetry } from "@/app/utils/accountUtils";

const FEE_PER_CLOSE_SOL = 0.00204;
const STAKED_SOL = 23;
async function fetchAccountData(
    conn: Connection,
    pubkey: PublicKey,
    maxRetries = 3
): Promise<number> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const accountInfo = await getAccountInfoWithRetry(conn, pubkey);

            if (!accountInfo) {
                console.warn(`Account not found for ${pubkey.toBase58()} (attempt ${attempt})`);
                if (attempt === maxRetries) return 0;
                continue;
            }

            // Return raw lamports for this account. Staking logic removed per request.
            return accountInfo.lamports;
        } catch (err) {
            console.error(`Fetch error for ${pubkey.toBase58()} (attempt ${attempt}):`, err);
            if (attempt === maxRetries) return 0;
            // Wait 500ms before retry
            await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
        }
    }
    return 0;
}

export default function StatsCards({
    pubkeys = [
        "GzZ5vVT2awie1LkgFXiMFGqfA7YtzKUFAvK14v8cazGk",
        "CWjpSUDa7VD3GagQgzgZESXDnsu2Q5Fb8ezUipSC2gfn",
    ],
}: {
    pubkeys?: string[];
}) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lamports, setLamports] = useState<number[]>([]);
    const { claimYourSolsState } = useContext(ClaimYourSolsStateContext);
    const conn = claimYourSolsState?.connection;

    useEffect(() => {
        if (!conn) {
            setError("No connection available");
            setLoading(false);
            return;
        }

        let mounted = true;
        setLoading(true);
        setError(null);

        Promise.all(
            pubkeys.map(async (pk) => {
                const pubkey = new PublicKey(pk);
                return fetchAccountData(conn, pubkey);
            })
        )
            .then((results) => {
                if (mounted) {
                    setLamports(results.map((r) => r));
                }
            })
            .catch((err) => {
                console.error("Failed to fetch account data:", err);
                if (mounted) setError("Failed to fetch balances");
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [conn, pubkeys.join(",")]);

    const totalNetSol = lamports.reduce((sum, val) => sum + val, 0) / LAMPORTS_PER_SOL;

    const total = totalNetSol + STAKED_SOL;
    const totalSolClaimed = total / 0.15;


    const accountsClosedEstimated = Math.floor(totalSolClaimed / FEE_PER_CLOSE_SOL);




    const fmt = (n: number) => {
        if (n >= 1) return n.toFixed(6);
        return n.toPrecision(2);
    };

    return (
        <div className="max-w-4xl mx-auto my-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Total Accounts Closed (Estimated) */}
            <div
                className="p-4 rounded-lg shadow-md"
                style={{ backgroundColor: colors.background.white, border: `1px solid ${colors.border}` }}
            >
                <div className="text-sm text-gray-500">Total Accounts Closed</div>
                <div className="text-2xl font-bold mt-2" style={{ color: colors.text.primary }}>
                    {loading ? "—" : accountsClosedEstimated.toLocaleString()}
                </div>
            </div>

            {/* Total Value Closed + Reward + Staked */}
            <div
                className="p-4 rounded-lg shadow-md"
                style={{ backgroundColor: colors.background.white, border: `1px solid ${colors.border}` }}
            >
                <div className="text-sm text-gray-500">Total SOL Claimed</div>
                <div className="text-2xl font-bold mt-2" style={{ color: colors.success }}>
                    {loading ? "—" : `${fmt(totalSolClaimed)} SOL`}
                </div>
            </div>
        </div>
    );
}