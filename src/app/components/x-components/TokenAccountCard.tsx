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
      className={`flex flex-col sm:flex-row items-start sm:items-center p-3 sm:p-4 border-2 rounded-xl transition-all duration-200 cursor-pointer ${isSelected
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
      {/* Top row for mobile: Checkbox + Token Icon + Basic Info */}
      <div className="flex items-start w-full sm:flex-1 sm:items-center">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          readOnly
          className="w-4 h-4 sm:w-5 sm:h-5 rounded-md mr-3 pointer-events-none flex-shrink-0 mt-1 sm:mt-0"
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
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-white font-bold text-xs mr-3 sm:mr-4 flex-shrink-0 shadow-lg border-2 border-white/20"
          style={{
            background: `linear-gradient(135deg, ${tokenColor}, ${tokenColor}dd)`,
            backdropFilter: "blur(10px)",
          }}
        >
          {account.tokenName?.slice(0, 3) || "TOK"}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Token Name: Symbol - Fully Visible */}
          <div className="flex items-start gap-2 mb-1">
            <XTypography
              variant="body"
              className="font-semibold text-sm sm:text-base break-words leading-tight"
              style={{
                color: isSelected ? colors.dark : colors.text.primary,
                wordBreak: "break-word",
                overflowWrap: "break-word",
                hyphens: "auto",
                whiteSpace: "normal",
              }}
            >
              {account.tokenName}
              {account.tokenSymbol && (
                <span
                  className="font-normal text-xs sm:text-sm ml-1"
                  style={{ color: colors.text.secondary }}
                >
                  : {account.tokenSymbol}
                </span>
              )}
            </XTypography>
          </div>

          {/* Mint Address */}
          <XTypography
            variant="body"
            className="font-mono text-xs truncate block sm:hidden"
            style={{ color: colors.text.secondary }}
          >
            {account.mint.toString().slice(0, 20)}...
          </XTypography>
          <XTypography
            variant="body"
            className="font-mono text-xs truncate hidden sm:block"
            style={{ color: colors.text.secondary }}
          >
            {account.mint.toString()}
          </XTypography>
        </div>
      </div>

      {/* Stats row - properly aligned for balance and recovery */}
      <div className="flex items-center justify-between w-full mt-3 sm:mt-0 sm:w-auto sm:gap-6 sm:ml-3">
        {/* Token Balance */}
        <div className="text-center min-w-0 flex-1 sm:flex-none sm:min-w-[80px]">
          <XTypography
            variant="body"
            className="text-xs font-medium mb-1"
            style={{ color: colors.text.secondary }}
          >
            {isSelected ? (
              <span
                className="px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                style={{
                  backgroundColor: `${colors.primary}20`,
                  color: colors.primary,
                }}
              >
                Selected
              </span>
            ) : (
              "Balance"
            )}
          </XTypography>
          {!isSelected && (
            <XTypography
              variant="body"
              className="text-sm font-bold"
              style={{
                color: tokenColor,
              }}
            >
              {getAmountString(account?.uiAmount)}
            </XTypography>
          )}
        </div>

        {/* SOL Recovery */}
        <div className="text-center min-w-0 flex-1 sm:flex-none sm:min-w-[80px]">
          <XTypography
            variant="body"
            className="text-xs font-medium mb-1"
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
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0"
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