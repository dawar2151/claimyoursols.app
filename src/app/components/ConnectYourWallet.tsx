import React from "react";
import { colors } from "../utils/colors";
import { XTypography } from "./x-components/XTypography";

interface ConnectYourWalletProps {
  className?: string;
}

export function ConnectYourWallet({ className = "" }: ConnectYourWalletProps) {
  return (
    <div
      className={`text-center py-12 flex flex-col justify-center items-center ${className}`}
    >
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      </div>
      <XTypography
        variant="h4"
        className="mb-2"
        style={{ color: colors.text.primary }}
      >
        Connect Your Wallet
      </XTypography>
      <XTypography
        variant="body"
        className="text-center max-w-md"
        style={{ color: colors.text.secondary }}
      >
        Please connect your wallet by clicking &quot;Select Wallet&quot; above
        to scan for eligible accounts.
      </XTypography>
    </div>
  );
}
