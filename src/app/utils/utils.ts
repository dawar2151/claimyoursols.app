import { PublicKey } from "@solana/web3.js";

export const getFeePercentage = (): number | null => {
    try {
        const feeEnv = process.env.NEXT_PUBLIC_CLOSE_ACCOUNT_FEE;

        // Return null if environment variable is not set
        if (!feeEnv) {
            return null;
        }

        const fee = parseFloat(feeEnv);

        // Return null if parsing fails or results in invalid number
        if (isNaN(fee) || fee < 0 || fee > 1) {
            console.warn(`Invalid fee percentage: ${feeEnv}. Must be between 0 and 1.`);
            return null;
        }

        return fee;
    } catch (error) {
        console.error('Error parsing fee percentage:', error);
        return null;
    }
};

export const getFeeRecipient = (): PublicKey | null => {
    try {
        const recipientEnv = process.env.NEXT_PUBLIC_FEE_RECIPIENT;

        // Return null if environment variable is not set
        if (!recipientEnv) {
            console.warn('Fee recipient not configured in environment variables');
            return null;
        }

        // Validate the public key format
        const recipientKey = new PublicKey(recipientEnv);

        // Additional validation - check if it's a valid base58 string
        if (recipientKey.toString() !== recipientEnv) {
            console.warn(`Invalid fee recipient format: ${recipientEnv}`);
            return null;
        }

        return recipientKey;
    } catch (error) {
        console.error('Error parsing fee recipient:', error);
        return null;
    }
};

// Check if fee recipient is configured
export const isFeeRecipientConfigured = (): boolean => {
    return getFeeRecipient() !== null;
};

// Get fee recipient as string or return null
export const getFeeRecipientString = (): string | null => {
    const recipient = getFeeRecipient();
    return recipient ? recipient.toString() : null;
};

// Validate both fee percentage and recipient are configured
export const isFeeConfigurationValid = (): boolean => {
    return getFeePercentage() !== null && getFeeRecipient() !== null;
};

// Get complete fee configuration
export const getFeeConfiguration = (): {
    percentage: number | null;
    recipient: PublicKey | null;
    isValid: boolean;
} => {
    const percentage = getFeePercentage();
    const recipient = getFeeRecipient();

    return {
        percentage,
        recipient,
        isValid: percentage !== null && recipient !== null,
    };
};

export const getFeePercentageWithDefault = (defaultFee: number = 0.1): number => {
    const fee = getFeePercentage();
    return fee !== null ? fee : defaultFee;
};

export const getFeePercentageString = (): string | null => {
    const fee = getFeePercentage();
    return fee !== null ? `${(fee * 100).toFixed(1)}%` : null;
};

export const calculateCommission = (amount: number): number | null => {
    const feePercentage = getFeePercentage();

    if (feePercentage === null) {
        return null;
    }

    return Math.floor(amount * feePercentage);
};

export const getSolscanURL = (
    network: string,
    signature: string,
    type: 'tx' | 'address' = 'tx'
): string => {
    const baseUrl = network === 'mainnet-beta'
        ? 'https://solscan.io'
        : `https://solscan.io?cluster=${network}`;

    return `${baseUrl}/${type}/${signature}`;
};