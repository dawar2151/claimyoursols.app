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
}
export async function isElligibleForBurn(
  tokenAddress: string,
  apiKey: string,
  balance: number
): Promise<TokenElligibility> {
  const url = `https://solana-gateway.moralis.io/token/mainnet/${tokenAddress}/price`;
  try {
    const response = await axios.get(url, {
      headers: {
        accept: "application/json",
        "X-API-Key": apiKey,
      },
    });
    const data = response.data as TokenPriceResponse;
    var usdBalance = data.usdPrice * balance;

    if (usdBalance <= maxBurnAmount) {
      return {
        tokenAddress,
        isElligible: true,
        usdBalance: usdBalance,
        name: data.name,
        symbol: data.symbol,
      }
    }
    return {
      tokenAddress,
      isElligible: false,
      usdBalance: 0,
      name: data.name,
      symbol: data.symbol,
    };
  } catch (error) {
    console.error("Failed to fetch token metadata:", error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        tokenAddress,
        isElligible: true,
        usdBalance: 0,
      };
    }
    return {
      tokenAddress,
      isElligible: false,
      usdBalance: 0,
    };
  }
}
