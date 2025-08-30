"use client";

import { XTypography } from "@/app/components/x-components/XTypography";
import { colors } from "@/app/utils/colors";
import { getAmountString } from "@/app/utils/spl-utils";

export type AccountDetails = {
  pubkey: { toString: () => string };
  mint: { toString: () => string };
  tokenName?: string;
  tokenSymbol?: string;
  uiAmount?: number;
  rentExemptReserve: number;
};
interface TokenAccountCardProps {
  account: AccountDetails;
  isSelected: boolean;
  onSelect: (account: AccountDetails) => void;
}

export const TokenAccountCard = ({
  account,
  isSelected,
  onSelect,
}: TokenAccountCardProps) => {
  const getTokenColor = (mintAddress: string) => {
    const tokenColors = [
      colors.primary,
      colors.secondary,
      colors.accent,
      colors.success,
      colors.warning,
      colors.info,
      colors.commission,
      colors.danger,
    ];
    const hash = mintAddress.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return tokenColors[Math.abs(hash) % tokenColors.length];
  };

  const tokenColor = getTokenColor(account.mint.toString());

  return (
    <div
      className={`flex items-center p-3 border-2 rounded-xl transition-all duration-200 cursor-pointer ${isSelected
        ? "shadow-lg scale-[1.02]"
        : "shadow-sm hover:shadow-md hover:scale-[1.01]"
        }`}
      style={{
        backgroundColor: isSelected
          ? colors.background.light
          : colors.background.white,
        borderColor: isSelected ? colors.primary : colors.border,
        boxShadow: isSelected
          ? `0 8px 25px -5px ${colors.primary}30`
          : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      }}
      onClick={() => onSelect(account)}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        readOnly
        className="w-4 h-4 rounded-md mr-3 pointer-events-none"
        style={{
          backgroundColor: isSelected
            ? colors.primary
            : colors.background.white,
          borderColor: colors.primary,
          accentColor: colors.primary,
        }}
      />

      {/* Token Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm mr-3 flex-shrink-0 shadow-md"
        style={{
          background: `linear-gradient(135deg, ${tokenColor}, ${tokenColor}dd)`,
        }}
      >
        {account.tokenSymbol
          ? account.tokenSymbol.slice(0, 2).toUpperCase()
          : account.mint.toString().slice(0, 2).toUpperCase()}
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Token Name: Symbol */}
        <div className="flex items-center gap-2 mb-1">
          <XTypography
            variant="body"
            className="font-semibold text-base truncate"
            style={{
              color: isSelected ? colors.dark : colors.text.primary,
            }}
          >
            {account.tokenName ||
              `Token ${account.mint.toString().slice(0, 6)}...${account.mint
                .toString()
                .slice(-4)}`}
            {account.tokenSymbol && (
              <span
                className="font-normal"
                style={{ color: colors.text.secondary }}
              >
                : {account.tokenSymbol}
              </span>
            )}
          </XTypography>

        </div>

        {/* Mint Address - Only show this */}
        <XTypography
          variant="body"
          className="font-mono text-xs truncate"
          style={{ color: colors.text.secondary }}
        >
          {account.mint.toString()}
        </XTypography>
      </div>

      {/* Compact Stats */}
      <div className="flex items-center gap-4 ml-3">
        {/* Token Balance */}
        <div className="text-center">
          <XTypography
            variant="body"
            className="text-xs font-medium"
            style={{ color: colors.text.secondary }}
          >
            {isSelected ? (
              <span
                className="px-2 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: `${colors.primary}20`,
                  color: colors.primary,
                }}
              >
                Selected
              </span>
            ) : "Balance"}
          </XTypography>
          <XTypography
            variant="body"
            className="text-sm font-bold"
            style={{
              color: isSelected ? colors.primary : tokenColor,
            }}
          >
            {getAmountString(account?.uiAmount)}
          </XTypography>
        </div>

        {/* SOL Recovery */}
        <div className="text-center">
          <XTypography
            variant="body"
            className="text-xs font-medium"
            style={{ color: colors.text.secondary }}
          >
            Recovery
          </XTypography>
          <XTypography
            variant="body"
            className="text-sm font-bold"
            style={{ color: colors.success }}
          >
            {(account.rentExemptReserve / 1e9).toFixed(3)} SOL
          </XTypography>
        </div>

        {/* Selection Indicator */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            backgroundColor: isSelected
              ? `${colors.primary}20`
              : colors.neutral,
          }}
        >
          {isSelected ? (
            <svg
              className="w-5 h-5"
              style={{ color: colors.primary }}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              style={{ color: colors.text.secondary }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};
