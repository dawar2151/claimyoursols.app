// This is an Edge API route implemented using the Web Fetch API.
// Use the standard Request/Response objects instead of NextApiResponse.

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
export const runtime = 'edge';

export default async function handler(req: Request) {
    try {
        if (req.method !== "POST") {
            return new Response(JSON.stringify({ error: "Method not allowed" }), {
                status: 405,
                headers: { Allow: "POST", "Content-Type": "application/json" },
            });
        }

        const apiKey = process.env.MORALIS_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: "Moralis API key is not configured on the server." }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        const body = await req.json().catch(() => ({}));
        const addresses: string[] = Array.isArray(body?.addresses) ? body.addresses : [];
        if (!addresses || addresses.length === 0) {
            return new Response(JSON.stringify({ error: "No addresses provided" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const result: Record<string, TokenPriceResponse | null> = {};
        addresses.forEach((a) => (result[a] = null));

        // chunk and call Moralis using fetch (edge friendly)
        const chunks: string[][] = [];
        for (let i = 0; i < addresses.length; i += BATCH_SIZE) {
            chunks.push(addresses.slice(i, i + BATCH_SIZE));
        }

        for (const chunk of chunks) {
            const resp = await fetch(MORALIS_URL, {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                    "X-API-Key": apiKey,
                },
                body: JSON.stringify({ addresses: chunk }),
            });

            if (!resp.ok) {
                const txt = await resp.text().catch(() => "");
                console.error("/api/moralis/prices chunk fetch failed:", resp.status, txt.substring(0, 200));
                throw new Error("Moralis fetch failed");
            }

            const data = (await resp.json()) as TokenPriceResponse[];
            if (Array.isArray(data)) {
                for (const item of data) {
                    if (item && item.tokenAddress) {
                        result[item.tokenAddress] = item;
                    }
                }
            }
        }

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err: any) {
        console.error("/api/moralis/prices error:", err?.message || err);
        return new Response(JSON.stringify({ error: "Failed to fetch prices from Moralis" }), {
            status: 502,
            headers: { "Content-Type": "application/json" },
        });
    }
}
