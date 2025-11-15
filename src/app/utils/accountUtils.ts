import { AccountInfo, Connection, PublicKey } from "@solana/web3.js";

export const getAccountInfoWithRetry = async (
    connection: Connection,
    pubkey: PublicKey,
    maxRetries = 4,
    baseDelayMs = 300
): Promise<AccountInfo<any> | null> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const info = await connection.getAccountInfo(pubkey);
            return info;
        } catch (err) {
            if (attempt === maxRetries) {
                console.error(`getAccountInfo failed for ${pubkey.toBase58()} after ${attempt} attempts`, err);
                return null;
            }
            const delay = baseDelayMs * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 100);
            await new Promise((res) => setTimeout(res, delay));
        }
    }
    return null;
};