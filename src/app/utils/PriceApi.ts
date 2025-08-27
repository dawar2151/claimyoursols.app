interface TokenPrice {
  usd: number;
}

interface CoinGeckoResponse {
  [mintAddress: string]: TokenPrice;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Helper function to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetch price for a single token with retry logic
export const fetchSingleTokenPrice = async (
  mintAddress: string,
  retryCount = 0
): Promise<Record<string, number>> => {
  try {
    console.log(`Fetching price for token: ${mintAddress}`);

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/solana?contract_addresses=${mintAddress}&vs_currencies=usd`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `CoinGecko API error: ${response.status} - ${response.statusText}`
      );
    }

    const data: CoinGeckoResponse = await response.json();

    // Convert to our format
    const prices: Record<string, number> = {};
    Object.entries(data).forEach(([mint, priceData]) => {
      if (priceData && typeof priceData.usd === "number") {
        prices[mint] = priceData.usd;
      }
    });

    console.log(
      `Successfully fetched price for ${mintAddress}: ${
        prices[mintAddress] || "not found"
      }`
    );
    return prices;
  } catch (error) {
    console.error(
      `Error fetching price for ${mintAddress} (attempt ${retryCount + 1}):`,
      error
    );

    if (retryCount < MAX_RETRIES) {
      console.log(
        `Retrying in ${RETRY_DELAY}ms... (${retryCount + 1}/${MAX_RETRIES})`
      );
      await delay(RETRY_DELAY * (retryCount + 1)); // Exponential backoff
      return fetchSingleTokenPrice(mintAddress, retryCount + 1);
    }

    console.error(
      `Failed to fetch price for ${mintAddress} after ${MAX_RETRIES} retries`
    );
    return {};
  }
};

export const fetchTokenPrices = async (
  mintAddresses: string[]
): Promise<Record<string, number>> => {
  if (mintAddresses.length === 0) return {};

  try {
    console.log(
      `Starting to fetch prices for ${mintAddresses.length} tokens one by one`
    );

    const allPrices: Record<string, number> = {};

    // Process tokens one by one to avoid rate limiting
    for (let i = 0; i < mintAddresses.length; i++) {
      const mintAddress = mintAddresses[i];
      console.log(
        `Processing token ${i + 1}/${mintAddresses.length}: ${mintAddress}`
      );

      try {
        const tokenPrice = await fetchSingleTokenPrice(mintAddress);

        // Merge result into final result
        Object.assign(allPrices, tokenPrice);

        // Add delay between requests to respect rate limits (except for last token)
        if (i < mintAddresses.length - 1) {
          console.log(`Waiting before next request...`);
          await delay(500); // 500ms between requests
        }
      } catch (tokenError) {
        console.error(`Failed to process token ${mintAddress}:`, tokenError);
        // Continue with next token even if this one fails
      }
    }

    console.log(
      `Completed fetching prices. Got ${Object.keys(allPrices).length} out of ${
        mintAddresses.length
      } tokens`
    );
    return allPrices;
  } catch (error) {
    console.error("Error in fetchTokenPrices:", error);
    return {};
  }
};
