import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  AccountInfo,
  Connection,
  ParsedAccountData,
  PublicKey,
} from "@solana/web3.js";

export const isValidTokenAccountForBurnAndClose = (
  account: { account: AccountInfo<ParsedAccountData> },
  rentExemptReserve: number
) => {
  const { account: info } = account;
  const owner = info.owner.toString();
  const isValidProgram =
    owner === TOKEN_PROGRAM_ID.toString() ||
    owner === TOKEN_2022_PROGRAM_ID.toString();
  const hasRent = info.lamports >= rentExemptReserve;

  return isValidProgram && hasRent;
};
export const isValidTokenAccountForClose = (
  account: { account: AccountInfo<ParsedAccountData> },
  rentExemptReserve: number
) => {
  const { account: info } = account;
  const owner = info.owner.toString();
  const isValidProgram =
    owner === TOKEN_PROGRAM_ID.toString() ||
    owner === TOKEN_2022_PROGRAM_ID.toString();
  const hasRent = info.lamports >= rentExemptReserve;
  const tokenAmount = info.data?.parsed?.info?.tokenAmount?.uiAmount ?? null;
  const isEmpty = tokenAmount === 0;

  console.log(
    `Account ${account.account.owner.toString()} => balance: ${tokenAmount}, rent: ${
      info.lamports
    }, closeable: ${isValidProgram && hasRent && isEmpty}`
  );

  return isValidProgram && hasRent && isEmpty;
};

export const fetchTokenAccounts = async (
  connection: Connection,
  publicKey: PublicKey,
  programId: PublicKey
) => {
  return connection.getParsedTokenAccountsByOwner(publicKey, {
    programId: programId,
  });
};

// Calculate USD value for a token amount
export const calculateUSDValue = (
  uiAmount: number | null,
  decimals: number,
  amount: string,
  price: number | null
): number | null => {
  if (!price || (!uiAmount && uiAmount !== 0)) return null;
  // Use uiAmount if available, otherwise calculate from raw amount and decimals
  const tokenAmount =
    uiAmount !== null ? uiAmount : Number(amount) / Math.pow(10, decimals);
  return tokenAmount * price;
};
export const getAmountString = (amount: number | undefined): string => {
  if (!amount || amount === 0) return "0";

  const formatNumber = (num: number): string => {
    const formatted = num.toFixed(2); // Format to 2 decimal places
    return formatted.endsWith(".00") ? num.toFixed(0) : formatted; // Remove ".00" if unnecessary
  };

  if (amount >= 1e9) {
    return `${formatNumber(amount / 1e9)}B`; // Format billions
  } else if (amount >= 1e6) {
    return `${formatNumber(amount / 1e6)}M`; // Format millions
  } else if (amount >= 1e3) {
    return `${formatNumber(amount / 1e3)}K`; // Format thousands
  } else {
    return amount.toLocaleString(); // Display smaller numbers normally
  }
};
export const checkWithheldAmount = (
  accountInfo: AccountInfo<ParsedAccountData>
) => {
  try {
    // Check if this is a Token 2022 account with parsed data
    if (
      accountInfo.owner.toString() === TOKEN_2022_PROGRAM_ID.toString() &&
      "parsed" in accountInfo.data
    ) {
      const parsedData = accountInfo.data.parsed;

      // Get mint address
      const mintAddress = parsedData?.info?.mint
        ? new PublicKey(parsedData.info.mint)
        : undefined;

      // Check for withheld amount in extensions or account data
      if (parsedData?.info?.extensions) {
        const transferFeeExtension = parsedData.info.extensions.find(
          (ext: any) => ext.extension === "transferFeeAmount"
        );

        if (transferFeeExtension?.state?.withheldAmount) {
          const withheldAmount = parseInt(
            transferFeeExtension.state.withheldAmount
          );
          console.log(
            "Withheld amount in this account:",
            withheldAmount.toString()
          );

          if (withheldAmount > 0) {
            console.log(
              "You need to harvest withheld tokens before closing the account."
            );
            return { withheldAmount, hasWithheldTokens: true, mintAddress };
          } else {
            console.log(
              "No withheld tokens. You can safely close the account."
            );
            return { withheldAmount: 0, hasWithheldTokens: false, mintAddress };
          }
        }
      }

      return { withheldAmount: 0, hasWithheldTokens: false, mintAddress };
    }

    return {
      withheldAmount: 0,
      hasWithheldTokens: false,
      mintAddress: undefined,
    };
  } catch (error) {
    console.warn("Error checking withheld amount:", error);
    return {
      withheldAmount: 0,
      hasWithheldTokens: false,
      mintAddress: undefined,
    };
  }
};
