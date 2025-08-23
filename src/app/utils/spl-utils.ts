import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { AccountInfo, ParsedAccountData } from "@solana/web3.js";

export const isValidTokenAccount = (
    account: { account: AccountInfo<ParsedAccountData> },
    rentExemptReserve: number
) => {
    const { account: info } = account;
    const owner = info.owner.toString();
    const isValidProgram =
        owner === TOKEN_PROGRAM_ID.toString() || owner === TOKEN_PROGRAM_ID.toString();
    const hasRent = info.lamports >= rentExemptReserve;

    return isValidProgram && hasRent;
};