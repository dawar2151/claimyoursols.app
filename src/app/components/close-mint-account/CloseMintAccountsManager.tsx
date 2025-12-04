"use client";

import { useContext, useState, useEffect } from "react";
import { ClaimYourSolsStateContext } from "@/app/providers";
import { useCloseMintAccountsManager } from "./useCloseMintAccountsManager";
import XButton from "@/app/components/x-components/XButton";
import { XTypography } from "@/app/components/x-components/XTypography";
import { useSearchParams } from "next/navigation";
import { getSolscanURL } from "@/app/utils";
import { colors } from "@/app/utils/colors";
import { SuccessAlert } from "../SuccessAlert";
import {
  AccountDetails,
  TokenAccountCard,
} from "../x-components/TokenAccountCard";
import { useWallet } from "@solana/wallet-adapter-react";
import { ConnectYourWallet } from "../ConnectYourWallet";

export const CloseMintAccountsManager = () => {
  const { claimYourSolsState } = useContext(ClaimYourSolsStateContext);
  const wallet = useWallet();
  // Add state for success alert
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [lastSuccessData, setLastSuccessData] = useState<{
    recoveredAmount: number;
    accountCount: number;
  } | null>(null);

  const {
    mintAccounts,
    isLoading,
    error,
    isSuccess,
    isClosing,
    transactionHashes,
    refreshAccounts,
    closeAllAccounts,
    selectedMintAccounts,
    setSelectedMintAccounts,
    cleanClosedAccounts,
    clearTransactionHashes,
  } = useCloseMintAccountsManager(claimYourSolsState.connection);

  const [selectAll, setSelectAll] = useState(true);

  const totalRent = Array.from(selectedMintAccounts).reduce(
    (sum, accountKey) => {
      const account = mintAccounts.find(
        (acc) => acc.pubkey.toString() === accountKey
      );
      return sum + (account?.lamports || 0);
    },
    0
  );

  const feePercentage = parseFloat(
    process.env.NEXT_PUBLIC_CLOSE_ACCOUNT_FEE || "0.1"
  );
  const commission = Math.floor(totalRent * feePercentage);
  const userReceives = totalRent - commission;

  // Add useEffect to show success alert
  useEffect(() => {
    if (isSuccess && !showSuccessAlert) {
      const recoveredAmount = userReceives;
      const accountCount = selectedMintAccounts.size;

      setLastSuccessData({ recoveredAmount, accountCount });
      setShowSuccessAlert(true);

      // Auto-hide after 8 seconds
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
        cleanClosedAccounts();
      }, 16000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  // Handle closing the alert
  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false);
    cleanClosedAccounts();
  };

  useEffect(() => {
    if (mintAccounts.length > 0) {
      const allAccountKeys = new Set(
        mintAccounts.map((account) => account.pubkey.toString())
      );
      setSelectedMintAccounts(allAccountKeys);
    }
  }, [mintAccounts, setSelectedMintAccounts]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMintAccounts(new Set());
      setSelectAll(false);
    } else {
      const allAccountKeys = new Set(
        mintAccounts.map((account) => account.pubkey.toString())
      );
      setSelectedMintAccounts(allAccountKeys);
      setSelectAll(true);
    }
  };

  const handleAccountSelection = (account: AccountDetails) => {
    const newSelected = new Set(selectedMintAccounts);
    if (newSelected.has(account.pubkey.toString())) {
      newSelected.delete(account.pubkey.toString());
    } else {
      newSelected.add(account.pubkey.toString());
    }
    setSelectedMintAccounts(newSelected);
    setSelectAll(newSelected.size === mintAccounts.length);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center space-y-4 bg-white min-h-screen">
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: colors.primary }}
        ></div>
        <XTypography variant="body" style={{ color: colors.text.secondary }}>
          Loading your mint accounts...
        </XTypography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center space-y-4 bg-white min-h-screen p-6">
        <XTypography
          variant="h4"
          className="mb-2"
          style={{ color: colors.error }}
        >
          Error Loading Accounts
        </XTypography>
        <XTypography
          variant="body"
          className="text-center max-w-md"
          style={{ color: colors.text.secondary }}
        >
          {error}
        </XTypography>
        <XButton
          onClick={refreshAccounts}
          style={{
            background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
            color: colors.background.white,
          }}
        >
          Try Again
        </XButton>
      </div>
    );
  }

  return (
    <>
      {/* Success Alert */}
      {showSuccessAlert && lastSuccessData && (
        <SuccessAlert
          isVisible={showSuccessAlert}
          onClose={handleCloseSuccessAlert}
          recoveredAmount={lastSuccessData.recoveredAmount}
          accountCount={lastSuccessData.accountCount}
          transactionHashes={transactionHashes}
        />
      )}

      <div
        className="w-full max-w-4xl mx-auto p-6"
        style={{ backgroundColor: colors.background.white }}
      >
        <label
          className="ml-2 text-sm font-medium mb-4 block"
          style={{
            color: colors.text.primary,
          }}
        >
          Only Mints where you are the close authority will be listed to close.
        </label>
        <div
          className="border rounded-lg shadow-lg p-6"
          style={{
            backgroundColor: colors.background.white,
            borderColor: `${colors.border}/50`,
          }}
        >
          <div
            className="flex items-center justify-between mb-4 p-4 border rounded-lg"
            style={{
              backgroundColor: `${colors.background.light}/20`,
              borderColor: `${colors.border}/50`,
            }}
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4 bg-white rounded"
                style={{
                  color: colors.secondary,
                  borderColor: colors.primary,
                }}
              />
              <label
                className="ml-2 text-sm font-medium"
                style={{
                  color: selectAll ? colors.primary : colors.text.primary,
                }}
              >
                Select All Accounts ({selectedMintAccounts.size} selected)
              </label>
            </div>
            <button
              onClick={refreshAccounts}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all border"
              style={{
                borderColor: colors.primary,
                color: colors.primary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
                e.currentTarget.style.color = colors.background.white;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = colors.primary;
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v6h6M20 20v-6h-6M4 14a8 8 0 0113.66-5.66M20 10a8 8 0 01-13.66 5.66"
                />
              </svg>
              Refresh
            </button>
          </div>
          {!wallet.publicKey ? (
            <ConnectYourWallet className="my-20" />
          ) : mintAccounts.length === 0 ? (
            <div className="text-center py-12 flex flex-col justify-center items-center">
              <div className="text-6xl mb-4">🎉</div>
              <XTypography
                variant="h4"
                className="mb-2"
                style={{ color: colors.text.primary }}
              >
                All Clean!
              </XTypography>
              <XTypography
                variant="body"
                className="text-center max-w-md"
                style={{ color: colors.text.secondary }}
              >
                No mint accounts found. All your mint accounts are already
                closed or you dont have any mint accounts to close.
              </XTypography>
            </div>
          ) : (
            <div className="space-y-4">
              {mintAccounts.map((account) => (
                <TokenAccountCard
                  key={account.pubkey.toString()}
                  account={{
                    pubkey: account.pubkey,
                    mint: account.pubkey, // Use pubkey as mint for mint accounts
                    tokenName: `Mint Account`,
                    tokenSymbol: "MINT",
                    uiAmount: account.ataBalance
                      ? parseFloat(account.ataBalance)
                      : 0, // Total supply as "token" amount
                    rentExemptReserve: account.rentExemptReserve,
                  }}
                  isSelected={selectedMintAccounts.has(
                    account.pubkey.toString()
                  )}
                  onSelect={handleAccountSelection}
                />
              ))}
            </div>
          )}

          {/* Total Calculation */}
          {mintAccounts.length > 0 && (
            <div
              className="mt-6 p-4 border rounded-lg"
              style={{
                backgroundColor: `${colors.background.light}/20`,
                borderColor: `${colors.border}/50`,
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <XTypography
                    variant="body"
                    className="text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    Total SOL to Claim
                  </XTypography>
                  <XTypography
                    variant="h4"
                    className="font-bold"
                    style={{ color: colors.secondary }}
                  >
                    {(totalRent / 1e9).toFixed(4) === "0.0000"
                      ? "0"
                      : (totalRent / 1e9).toFixed(4)}{" "}
                    SOL
                  </XTypography>
                </div>
                <div>
                  <XTypography
                    variant="body"
                    className="text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    Selected Accounts
                  </XTypography>
                  <XTypography
                    variant="h4"
                    className="font-bold"
                    style={{ color: colors.primary }}
                  >
                    {selectedMintAccounts.size}
                  </XTypography>
                </div>
                <div>
                  <XTypography
                    variant="body"
                    className="text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    Total Accounts
                  </XTypography>
                  <XTypography
                    variant="h4"
                    className="font-bold"
                    style={{ color: colors.text.primary }}
                  >
                    {mintAccounts.length}
                  </XTypography>
                </div>
              </div>

              {selectedMintAccounts.size === 0 && (
                <div className="text-center mt-4">
                  <XTypography
                    variant="body"
                    className="text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    Select accounts to see calculation
                  </XTypography>
                </div>
              )}
            </div>
          )}

          <div
            className="mt-8 pt-6 border-t"
            style={{ borderColor: `${colors.border}/50` }}
          >
            <XButton
              onClick={closeAllAccounts}
              disabled={isClosing || selectedMintAccounts.size === 0}
              isLoading={isClosing}
              className="w-full disabled:opacity-50"
              style={{
                background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
                color: colors.background.white,
              }}
              onMouseEnter={(e) => {
                if (!isClosing && selectedMintAccounts.size > 0) {
                  e.currentTarget.style.background = `linear-gradient(to right, ${colors.secondary}, ${colors.secondary})`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isClosing && selectedMintAccounts.size > 0) {
                  e.currentTarget.style.background = `linear-gradient(to right, ${colors.primary}, ${colors.accent})`;
                }
              }}
            >
              {isClosing
                ? "Closing Mint Accounts..."
                : `Close Mint Accounts & Get SOL Back (${selectedMintAccounts.size})`}
            </XButton>
            <XTypography
              variant="body"
              className="text-xs mt-3 text-center"
              style={{ color: colors.text.secondary }}
            >
              This will close selected mint accounts and refund your locked SOL
              back to your wallet. Large batches may require multiple
              transactions.
            </XTypography>

            {transactionHashes.length > 0 && (
              <div
                className="mt-4 p-4 border rounded-lg"
                style={{
                  backgroundColor: `${colors.background.light}/20`,
                  borderColor: `${colors.border}/50`,
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <XTypography
                    variant="body"
                    className="text-sm font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    Transaction Details
                  </XTypography>
                  <button
                    onClick={() => clearTransactionHashes()}
                    className="text-sm transition-colors"
                    style={{ color: colors.primary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = colors.secondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = colors.primary;
                    }}
                  >
                    Hide
                  </button>
                </div>
                <ul className="space-y-2">
                  {transactionHashes.map((hash, index) => (
                    <li key={index}>
                      <a
                        href={getSolscanURL(
                          claimYourSolsState.network,
                          hash,
                          "tx"
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm break-all transition-colors"
                        style={{ color: colors.secondary }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = colors.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = colors.secondary;
                        }}
                      >
                        {hash.slice(0, 6)}...{hash.slice(-4)}
                        <span
                          className="ml-2 text-xs"
                          style={{ color: colors.text.secondary }}
                        >
                          [View on Solscan]
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
