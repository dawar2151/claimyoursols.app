export const getSolscanURL = (network: string, txHash: string, type: "account" | "tx" = "tx"): string => {
    switch (network) {
        case 'mainnet-beta':
            return `https://solscan.io/${type}/${txHash}`;
        case 'testnet':
            return `https://solscan.io/${type}/${txHash}?cluster=${network}`;
        case 'devnet':
            return `https://solscan.io/${type}/${txHash}?cluster=${network}`;
        default:
            return `https://solscan.io/${type}/${txHash}?cluster=${network}`;
    }
};


export async function retry<T>(fn: () => Promise<T>, retries: number = 3, delay: number = 1000): Promise<T> {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === retries - 1) throw error; // Rethrow error if it's the last attempt
            console.warn(`Attempt ${i + 1} failed, retrying...`, error);
            await new Promise(resolve => setTimeout(resolve, delay)); // Wait for the specified delay before retrying
        }
    }
    throw new Error('All retry attempts failed');
}