import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { AccountInfo, ParsedAccountData } from "@solana/web3.js";

export const isValidTokenAccountForBurnAndClose = (
    account: { account: AccountInfo<ParsedAccountData> },
    rentExemptReserve: number
) => {
    const { account: info } = account;
    const owner = info.owner.toString();
    const isValidProgram =
        owner === TOKEN_PROGRAM_ID.toString() || owner === TOKEN_2022_PROGRAM_ID.toString();
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
        owner === TOKEN_PROGRAM_ID.toString() || owner === TOKEN_2022_PROGRAM_ID.toString();
    const hasRent = info.lamports >= rentExemptReserve;
    const tokenAmount = info.data?.parsed?.info?.tokenAmount?.uiAmount ?? null;
    const isEmpty = tokenAmount === 0;

    console.log(
        `Account ${account.account.owner.toString()} => balance: ${tokenAmount}, rent: ${info.lamports
        }, closeable: ${isValidProgram && hasRent && isEmpty}`
    );

    return isValidProgram && hasRent && isEmpty;
};