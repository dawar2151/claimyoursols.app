import axios from "axios";

interface TokenMetadata {
  mint: string;
  standard: string;
  name: string;
  symbol: string;
}

export async function fetchSolanaTokenMetadata(
  network: string,
  tokenAddress: string,
  apiKey: string
): Promise<TokenMetadata> {
  network == "mainnet-beta" ? (network = "mainnet") : (network = "devnet");
  const url = `https://solana-gateway.moralis.io/token/${network}/${tokenAddress}/metadata`;

  try {
    const response = await axios.get<TokenMetadata>(url, {
      headers: {
        accept: "application/json",
        "X-API-Key": apiKey,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch token metadata:", error);
    throw error;
  }
}
