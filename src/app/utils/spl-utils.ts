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
