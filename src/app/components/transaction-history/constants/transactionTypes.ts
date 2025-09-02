// Transaction type configurations
export const TRANSACTION_TYPES = {
  BURN_CLOSE: {
    type: "burn-close",
    color: "bg-orange-500",
    getCount: (burnCount: number, closeCount: number) =>
      `${burnCount} Burns, ${closeCount} Closes`,
  },
  BURN: {
    type: "burn",
    color: "bg-red-500",
    getCount: (count: number) => `${count} Burns`,
  },
  CLOSE: {
    type: "close",
    color: "bg-blue-500",
    getCount: (count: number) => `${count} Closes`,
  },
  TRANSFER: {
    type: "transfer",
    color: "bg-green-500",
    getCount: (count: number) => `${count} Transfers`,
  },
  OTHER: {
    type: "other",
    color: "bg-gray-500",
    getCount: (count: number) => `${count} Instructions`,
  },
} as const;
