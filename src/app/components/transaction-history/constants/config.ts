// Core configuration settings
export const CONFIG = {
  DEFAULT_LIMIT: 4,
  HASH_TRUNCATE_LENGTH: {
    DESKTOP: 6,
    MOBILE: 8,
  },
  UNKNOWN_TIME_LABEL: "Unknown",
  GRID_COLUMNS: {
    TRANSACTION: 3,
    TYPE: 2,
    OPERATIONS: 2,
    CLAIMED_SOL: 2,
    TIME: 2,
  },
} as const;

export const METHOD_PATTERNS = {
  BURN: "burn",
  CLOSE: "close",
  TRANSFER: "transfer",
} as const;
