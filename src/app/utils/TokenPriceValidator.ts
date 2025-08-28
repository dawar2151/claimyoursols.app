import { fetchSingleTokenPrice } from "@/app/utils/PriceApi";

interface TokenAccount {
  mint: { toString: () => string };
  uiAmount?: number | null;
}

interface PriceValidationResult {
  isValid: boolean;
  totalValue?: number;
  pricePerToken?: number;
  errorMessage?: string;
}

type ConfirmFunction = (_options: {
  title: string;
  message: string;
  severity?: "warning" | "error" | "info";
}) => Promise<boolean>;

/**
 * Validates if a token's total value is under $10 USD
 * @param account - The token account to validate
 * @param maxValue - Maximum allowed USD value (default: 10)
 * @param confirmFn - Function to show confirmation dialog (defaults to browser confirm)
 * @returns Promise<PriceValidationResult>
 */
export async function validateTokenPrice(
  account: TokenAccount,
  maxValue: number = 10,
  confirmFn?: ConfirmFunction
): Promise<PriceValidationResult> {
  try {
    const mintAddress = account.mint.toString();
    const prices = await fetchSingleTokenPrice(mintAddress);

    // Handle the case when we can't find price data
    if (!prices[mintAddress]) {
      console.log(`No price data found for token: ${mintAddress}`);

      // If we can't determine the price, ask the user if they want to continue
      const shouldContinue = confirmFn
        ? await confirmFn({
            title: "Unknown Token Price",
            message: `We couldn't determine the price for this token. Please confirm your token balance value is lower than $${maxValue}.`,
            severity: "warning",
          })
        : confirm(
            `Please confirm your token balance value is lower than $${maxValue}?`
          );

      if (!shouldContinue) {
        return {
          isValid: false,
          errorMessage: "User cancelled due to unknown token price",
        };
      }

      // User confirmed it's safe to proceed
      return {
        isValid: true,
        totalValue: 0, // Unknown value, but user confirmed
        pricePerToken: 0,
      };
    }

    // Calculate actual price based on token amount and decimals
    const tokenAmount = account.uiAmount || 0;
    const pricePerToken = prices[mintAddress];
    const totalValue = tokenAmount * pricePerToken;

    // Log for debugging
    console.log(
      `Token: ${mintAddress}, Amount: ${tokenAmount}, Price: $${pricePerToken}, Total: $${totalValue.toFixed(
        2
      )}`
    );

    // Check if total value exceeds the maximum allowed
    if (totalValue > maxValue) {
      return {
        isValid: false,
        totalValue,
        pricePerToken,
        errorMessage: `Cannot burn token with value over $${maxValue} USD. Current value: $${totalValue.toFixed(
          2
        )}`,
      };
    }

    // Token is safe to burn
    return {
      isValid: true,
      totalValue,
      pricePerToken,
    };
  } catch (error) {
    console.error("Error validating token price:", error);

    // On API error, ask user to confirm
    const shouldContinue = confirmFn
      ? await confirmFn({
          title: "Price Check Error",
          message: `There was an error checking the token price. Please confirm your token balance value is lower than $${maxValue}.`,
          severity: "error",
        })
      : confirm(
          `Error checking token price. Please confirm your token balance value is lower than $${maxValue}?`
        );

    return {
      isValid: shouldContinue,
      errorMessage: shouldContinue
        ? undefined
        : "User cancelled due to price check error",
    };
  }
}

/**
 * Validates multiple tokens at once
 * @param accounts - Array of token accounts to validate
 * @param maxValue - Maximum allowed USD value per token (default: 10)
 * @param confirmFn - Function to show confirmation dialog (defaults to browser confirm)
 * @returns Promise<{ validAccounts: TokenAccount[], invalidAccounts: Array<{ account: TokenAccount, reason: string }> }>
 */
export async function validateMultipleTokenPrices(
  accounts: TokenAccount[],
  maxValue: number = 10,
  confirmFn?: ConfirmFunction
): Promise<{
  validAccounts: TokenAccount[];
  invalidAccounts: Array<{ account: TokenAccount; reason: string }>;
}> {
  const validAccounts: TokenAccount[] = [];
  const invalidAccounts: Array<{ account: TokenAccount; reason: string }> = [];

  for (const account of accounts) {
    const validation = await validateTokenPrice(account, maxValue, confirmFn);

    if (validation.isValid) {
      validAccounts.push(account);
    } else {
      invalidAccounts.push({
        account,
        reason: validation.errorMessage || "Unknown validation error",
      });
    }
  }

  return { validAccounts, invalidAccounts };
}
