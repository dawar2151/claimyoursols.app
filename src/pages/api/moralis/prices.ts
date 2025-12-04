import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

interface TokenPriceResponse {
    tokenAddress: string;
    pairAddress: string;
    exchangeName: string;
    exchangeAddress: string;
    nativePrice: {
        value: string;
        symbol: string;
        name: string;
        decimals: number;
    };
    usdPrice: number;
    usdPrice24h: number;
    usdPrice24hrUsdChange: number;
    usdPrice24hrPercentChange: number;
    logo: string;
    name: string;
    symbol: string;
    isVerifiedContract: boolean;
}

const MORALIS_URL = `https://solana-gateway.moralis.io/token/mainnet/prices`;
const BATCH_SIZE = 50;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Record<string, TokenPriceResponse | null> | { error: string }>
) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Method not allowed" });
    }

    const apiKey = process.env.MORALIS_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "Moralis API key is not configured on the server." });
    }

    const addresses: string[] = Array.isArray(req.body?.addresses) ? req.body.addresses : [];
    if (!addresses || addresses.length === 0) {
        return res.status(400).json({ error: "No addresses provided" });
    }

    const result: Record<string, TokenPriceResponse | null> = {};
    addresses.forEach((a) => (result[a] = null));

    // chunk and call Moralis
    const chunks: string[][] = [];
    for (let i = 0; i < addresses.length; i += BATCH_SIZE) {
        chunks.push(addresses.slice(i, i + BATCH_SIZE));
    }

    try {
        for (const chunk of chunks) {
            const resp = await axios.post(MORALIS_URL, { addresses: chunk }, {
                headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                    "X-API-Key": apiKey,
                },
            });

            const data = resp.data as TokenPriceResponse[];
            if (Array.isArray(data)) {
                for (const item of data) {
                    if (item && item.tokenAddress) {
                        result[item.tokenAddress] = item;
                    }
                }
            }
        }

        return res.status(200).json(result);
    } catch (err: any) {
        console.error("/api/moralis/prices error:", err?.response?.data || err?.message || err);
        return res.status(502).json({ error: "Failed to fetch prices from Moralis" });
    }
}
