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
const maxBurnAmount = 1;// 1 USD

export type TokenElligibility = {
  tokenAddress: string;
  isElligible: boolean;
  usdBalance: number;
  name?: string;
  symbol?: string;
};

/**
 * Batch-check a list of token accounts and return the subset that are eligible for burn.
 * For each account that is eligible, we attach `usdValue` and token name/symbol when available.
 */
export async function getEllibleAccountsForBurn<
  T extends Record<string, any> & { mint: string; uiAmount?: number | null; amount?: string; decimals?: number }
>(
  accounts: T[],
  apiKey?: string
): Promise<(T & { usdValue?: number; tokenName?: string; tokenSymbol?: string })[]> {
  const key = apiKey || process.env.NEXT_PUBLIC_MORALIS_API_KEY || "";
  // collect unique mint addresses
  const mintToAccounts: Record<string, T[]> = {};
  const mints: string[] = [];
  for (const acc of accounts) {
    const mint = acc.mint;
    if (!mint) continue;
    if (!mintToAccounts[mint]) {
      mintToAccounts[mint] = [];
      mints.push(mint);
    }
    mintToAccounts[mint].push(acc);
  }

  let prices: Record<string, TokenPriceResponse | null>;
  try {
    prices = await fetchTokenPricesBatched(mints, key);
  } catch (err) {
    // If the price API fails for any chunk, do not return any accounts as eligible.
    console.error("getEllibleAccountsForBurn: price fetch failed:", err);
    return [];
  }

  const eligibleAccounts: (T & { usdValue?: number; tokenName?: string; tokenSymbol?: string })[] = [];

  for (const mint of mints) {
    const price = prices[mint];
    const related = mintToAccounts[mint] || [];

    for (const acc of related) {
      // determine token amount
      const tokenAmount =
        acc.uiAmount !== null && acc.uiAmount !== undefined
          ? acc.uiAmount
          : acc.amount
            ? Number(acc.amount) / Math.pow(10, acc.decimals || 0)
            : 0;

      if (price && typeof price.usdPrice === "number") {
        const usdBalance = price.usdPrice * tokenAmount;
        if (usdBalance <= maxBurnAmount) {
          eligibleAccounts.push({
            ...acc,
            usdValue: usdBalance,
            tokenName: price.name,
            tokenSymbol: price.symbol,
          });
        }
      } else {
        // no price available (or failed) — treat as eligible and keep token amount
        eligibleAccounts.push({
          ...acc,
          usdValue: 0,
        });
      }
    }
  }

  return eligibleAccounts;
}

// Batch prices endpoint: accepts up to ~50 addresses per request.
// This helper splits addresses into chunks of `batchSize` (default 50),
// sends them to Moralis, and returns a map of address -> TokenPriceResponse | null.
export async function fetchTokenPricesBatched(
  addresses: string[],
  apiKey: string,
  batchSize = 50,
  concurrency = 3
): Promise<Record<string, TokenPriceResponse | null>> {
  const url = `https://solana-gateway.moralis.io/token/mainnet/prices`;

  // prepare result map with null defaults
  const result: Record<string, TokenPriceResponse | null> = {};
  addresses.forEach((a) => (result[a] = null));

  // chunking helper
  const chunks: string[][] = [];
  for (let i = 0; i < addresses.length; i += batchSize) {
    chunks.push(addresses.slice(i, i + batchSize));
  }

  // process chunks with limited concurrency
  const chunkQueue = chunks.slice();
  const workers: Promise<void>[] = [];
  let chunkErrors = 0;

  const worker = async () => {
    while (chunkQueue.length > 0) {
      const chunk = chunkQueue.shift();
      if (!chunk) break;
      try {
        const resp = await axios.post(
          url,
          { addresses: chunk },
          {
            headers: {
              accept: "application/json",
              "content-type": "application/json",
              "X-API-Key": apiKey,
            },
          }
        );

        const data = resp.data as Array<TokenPriceResponse>;
        if (Array.isArray(data)) {
          for (const item of data) {
            if (item && item.tokenAddress) {
              result[item.tokenAddress] = item;
            }
          }
        }
      } catch (err) {
        console.error("fetchTokenPricesBatched chunk failed:", err);
        // mark that at least one chunk failed
        chunkErrors++;
        // on error, leave those addresses as null so caller can handle retries
      }
    }
  };

  // start concurrency number of workers
  for (let i = 0; i < Math.max(1, concurrency); i++) {
    workers.push(worker());
  }

  await Promise.all(workers);

  if (chunkErrors > 0) {
    throw new Error(`fetchTokenPricesBatched: ${chunkErrors} chunk(s) failed`);
  }

  return result;
}
