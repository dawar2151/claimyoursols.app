// Text content and labels
export const TEXT_CONTENT = {
  HEADER: "Global Transaction History",
  ERROR_PREFIX: "Error: ",
  FOUND_TRANSACTIONS: (count: number, hasMore: boolean) =>
    `Found ${count} transactions ${hasMore ? "(more available)" : ""}`,
  CLICK_HINT: "Click transaction hash to view on Solscan",
  LOAD_MORE_BUTTON: "More",
  LOADING_MORE: "Loading more transactions...",
  NO_TRANSACTIONS_TITLE: "No Transactions Found",
  NO_TRANSACTIONS_MESSAGE: "No transaction history found for this account.",
  TOTAL_INSTRUCTIONS: "total",
  TRANSACTION_NUMBER: (index: number) => `#${index + 1}`,
} as const;
