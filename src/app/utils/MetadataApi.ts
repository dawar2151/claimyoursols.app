import { getMint, getTokenMetadata } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";

// Define the return type interface
export interface TokenMetadata {
  symbol: string;
  name: string;
  decimals: number;
  uri: string;
}
var Unknown = "Unknown";

// Define Jupiter token interface for type safety
interface JupiterToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

export const fetchTokenMetadata = async (
  connection: Connection,
  mintAddress: string
): Promise<TokenMetadata> => {
  try {
    console.log(`Fetching metadata for mint: ${mintAddress}`);

    // Validate mint address
    let mintPubkey: PublicKey;
    try {
      mintPubkey = new PublicKey(mintAddress);
    } catch (invalidKeyError) {
      console.error(`Invalid mint address: ${mintAddress}`, invalidKeyError);
      return {
        symbol: Unknown,
        name: Unknown,
        decimals: 0,
        uri: "",
      };
    }

    // Fetch mint account data with error handling
    let mint;
    let decimals = 0;
    try {
      mint = await getMint(connection, mintPubkey);
      decimals = mint.decimals;
      console.log("Fetched mint data:", mint);
    } catch (mintError) {
      console.warn(
        `Failed to fetch mint account for ${mintAddress}:`,
        mintError
      );
      // If we can't get mint data, we'll try other approaches without it
    }

    // Try multiple approaches for fetching metadata
    let metadata = null;

    // Approach 1: Try with standard Metaplex Token Metadata Program
    try {
      const METADATA_PROGRAM_ID = new PublicKey(
        "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
      );
      metadata = await getTokenMetadata(
        connection,
        mintPubkey,
        "processed",
        METADATA_PROGRAM_ID
      );
      if (metadata) {
        console.log("Found metadata with Metaplex program:", metadata);
      }
    } catch (metaplexError) {
      console.warn(
        `Metaplex metadata fetch failed for ${mintAddress}:`,
        metaplexError
      );
    }

    // Approach 2: Try with Token Extensions (Token-2022) metadata
    if (!metadata) {
      try {
        metadata = await getTokenMetadata(connection, mintPubkey);
        if (metadata) {
          console.log("Found metadata with Token Extensions:", metadata);
        }
      } catch (token2022Error) {
        console.warn(
          `Token-2022 metadata fetch failed for ${mintAddress}:`,
          token2022Error
        );
      }
    }

    // Approach 3: Try Jupiter token list as fallback
    if (!metadata) {
      try {
        const jupiterResponse = await fetch(`https://token.jup.ag/strict`);
        const jupiterTokens: JupiterToken[] = await jupiterResponse.json();
        const jupiterToken = jupiterTokens.find(
          (token: JupiterToken) => token.address === mintAddress
        );

        if (jupiterToken) {
          console.log(
            `Found Jupiter metadata for ${mintAddress}:`,
            jupiterToken
          );
          return {
            symbol: jupiterToken.symbol || Unknown,
            name: jupiterToken.name || Unknown,
            decimals: jupiterToken.decimals || decimals || 0,
            uri: jupiterToken.logoURI || "",
          };
        }
      } catch (jupiterError) {
        console.warn(`Jupiter fetch failed for ${mintAddress}:`, jupiterError);
      }
    }

    if (metadata) {
      return {
        symbol: metadata.symbol || Unknown,
        name: metadata.name || Unknown,
        decimals: decimals,
        uri: metadata.uri || "",
      };
    }

    return {
      symbol: Unknown,
      name: Unknown,
      decimals: decimals,
      uri: "",
    };
  } catch (error) {
    console.error(`Failed to fetch any data for ${mintAddress}:`, error);
    return {
      symbol: Unknown,
      name: Unknown,
      decimals: 0,
      uri: "",
    };
  }
};

// Batch metadata fetching function
export const fetchTokenMetadataBatch = async (
  connection: Connection,
  mintAddresses: string[]
): Promise<Record<string, TokenMetadata>> => {
  const results: Record<string, TokenMetadata> = {};

  // Process tokens sequentially to avoid overwhelming the RPC
  for (const mintAddress of mintAddresses) {
    try {
      const metadata = await fetchTokenMetadata(connection, mintAddress);
      results[mintAddress] = metadata;

      // Add small delay between requests
      if (mintAddresses.indexOf(mintAddress) < mintAddresses.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(`Failed to fetch metadata for ${mintAddress}:`, error);
      const shortAddress = `${mintAddress.slice(0, 4)}...${mintAddress.slice(
        -4
      )}`;
      results[mintAddress] = {
        symbol: shortAddress,
        name: `Error: ${shortAddress}`,
        decimals: 0,
        uri: "",
      };
    }
  }

  return results;
};
