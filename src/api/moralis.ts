import axios from "axios";

interface TokenMetadata {
  mint: string;
  standard: string;
  name: string;
  symbol: string;
}
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
export async function fetchSolanaTokenPrice(
  tokenAddress: string,
  apiKey: string
): Promise<boolean> {
  const url = `https://solana-gateway.moralis.io/token/mainnet/${tokenAddress}/price`;
  try {
    const response = await axios.get(url, {
      headers: {
        accept: "application/json",
        "X-API-Key": apiKey,
      },
    });
    console.log("Token price response:", response.data);
    return false;
  } catch (error) {
    console.error("Failed to fetch token metadata:", error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return true;
    }
    return false;
  }
}
