"use client";

import { useContext, useState, useEffect } from "react";
import { ClaimYourSolsStateContext } from "@/app/providers";
import { useBurnAndCloseAccountsManager } from "./useBurnAndCloseAccountsManager";
import XButton from "@/app/components/x-components/XButton";
import { XTypography } from "@/app/components/x-components/XTypography";
import { useSearchParams } from "next/navigation";
import { getSolscanURL } from "@/app/utils";
import { colors } from "@/app/utils/colors";
import { SuccessAlert } from "../SuccessAlert";
import { calculateCommission } from "@/app/utils/utils";
import {
  AccountDetails,
  TokenAccountCard,
} from "../x-components/TokenAccountCard";
import { validateTokenPrice } from "@/app/utils/TokenPriceValidator";
import ConfirmDialog from "../x-components/ConfirmDialog";
import { useConfirmDialog } from "@/app/hooks/useConfirmDialog";
import { useWallet } from "@solana/wallet-adapter-react";
import { ConnectYourWallet } from "../ConnectYourWallet";

export const BurnAndCloseAccountsManager = () => {
  const { claimYourSolsState } = useContext(ClaimYourSolsStateContext);
  var wallet = useWallet();

  // Add state for success alert
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [lastSuccessData, setLastSuccessData] = useState<{
    recoveredAmount: number;
    accountCount: number;
  } | null>(null);

  // Confirmation dialog hook
  const { showConfirmation, confirmationProps } = useConfirmDialog();

  const {
    selectedAccounts,
    setSelectedAccounts,
    setReferralAccount,
    cleanClosedAccounts,
    currentTotalRent,
    accounts,
    currentPage,
    hasMoreAccounts,
    isLoadingMore,
    metadataProgress,
    itemsPerPage,
    totalAccounts,
    error,
    isSuccess,
    isLoading,
    isClosing,
    transactionHashes,
    clearTransactionHashes,
    closeAllAccounts,
    refreshAccounts,
    loadMoreAccounts,
  } = useBurnAndCloseAccountsManager(claimYourSolsState.connection);

  const searchParams = useSearchParams();
  const refAccount = searchParams.get("ref");

  // Move calculations outside of useEffect to avoid stale closures
  const totalRent = Array.from(selectedAccounts).reduce((sum, accountKey) => {
    const account = accounts.find(
      (acc) => acc.pubkey.toString() === accountKey
    );
    return sum + (account?.lamports || 0);
  }, 0);

  useEffect(() => {
    if (refAccount) {
      setReferralAccount(refAccount);
    }
  }, [refAccount, setReferralAccount]);

  // Fixed useEffect with proper dependency management
  useEffect(() => {
    if (isSuccess && !showSuccessAlert) {
      const currentCommission = calculateCommission(currentTotalRent) ?? 0;
      const recoveredAmount = currentTotalRent - currentCommission;
      const accountCount = selectedAccounts.size;

      setLastSuccessData({ recoveredAmount, accountCount });
      setShowSuccessAlert(true);

      // Auto-hide after 8 seconds
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
        cleanClosedAccounts();
      }, 16000);

      return () => clearTimeout(timer);
    }
  }, [
    isSuccess,
    showSuccessAlert,
    currentTotalRent,
    selectedAccounts.size,
    cleanClosedAccounts,
  ]);

  // Handle closing the alert
  const handleCloseSuccessAlert = () => {
    cleanClosedAccounts();
    setShowSuccessAlert(false);
  };

  const handleAccountSelection = async (account: AccountDetails) => {
    const newSelected = new Set(selectedAccounts);
    if (newSelected.has(account.pubkey.toString())) {
      newSelected.delete(account.pubkey.toString());
    } else {
      const validation = await validateTokenPrice(
        account,
        10,
        showConfirmation
      );
      if (!validation.isValid) {
        // Error is already handled by the confirmation dialog
        return;
      }
      newSelected.add(account.pubkey.toString());
    }
    setSelectedAccounts(newSelected);
  };

  if(disabled ) {
   return (<div className="flex flex-col items-center justify-center space-y-3 py-12">
      
        <XTypography
          variant="body"
          className="text-sm"
          style={{ color: colors.text.secondary }}
        >
          Nothing to burn
        </XTypography>
      </div>)
  }
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 py-12">
        <div
          className="animate-spin rounded-full h-6 w-6 border-b-2"
          style={{ borderColor: colors.primary }}
        ></div>
        <XTypography
          variant="body"
          className="text-sm"
          style={{ color: colors.text.secondary }}
        >
          Loading your accounts...
        </XTypography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center space-y-4 py-8 px-6">
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
      {showSuccessAlert && lastSuccessData && (
        <SuccessAlert
          isVisible={showSuccessAlert}
          onClose={handleCloseSuccessAlert}
          recoveredAmount={lastSuccessData.recoveredAmount}
          accountCount={lastSuccessData.accountCount}
          transactionHashes={transactionHashes}
        />
      )}

      <div className="w-full max-w-4xl mx-auto p-6 flex flex-col items-center justify-center" style={{ backgroundColor: colors.background.white }}>
      <div className="text-center py-4">
      <XTypography
        variant="body"
        className="text-center max-w-lg mb-4"
        style={{ color: "red" }} // Set the warning text color to red

      >
          {
            "⚠️ Warning: Burning tokens is an irreversible action. By proceeding, you acknowledge and accept this."
          }
        </XTypography>
      </div>
        <div
          className="border rounded-lg shadow-lg p-6"
          style={{
            backgroundColor: colors.background.white,
            borderColor: `${colors.border}/50`,
          }}
        >
          {!wallet.publicKey ? (
            <ConnectYourWallet className="my-20" />
          ) : accounts.length === 0 ? (
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
                {
                  "No token accounts found to burn and close. All your accounts are already clean or you don't have any accounts with tokens to burn."
                }
              </XTypography>
            </div>
          ) : (
            <>
              {/* Account Selection Info */}
              <div
                className="flex items-center justify-between mb-4 p-4 border rounded-lg"
                style={{
                  backgroundColor: `${colors.background.light}/20`,
                  borderColor: `${colors.border}/50`,
                }}
              >
                <div className="flex items-center gap-4">
                  <XTypography
                    variant="body"
                    className="text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    Select accounts to burn tokens and recover locked SOL
                  </XTypography>
                </div>
                <button
                  onClick={refreshAccounts}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border"
                  style={{
                    borderColor: colors.primary,
                    color: colors.primary,
                    backgroundColor: colors.background.white,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.primary;
                    e.currentTarget.style.color = colors.background.white;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.background.white;
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

              {/* Account Cards */}
              <div className="space-y-4">
                {accounts.map((account) => (
                  <TokenAccountCard
                    key={account.pubkey.toString()}
                    account={{
                      ...account,
                      uiAmount:
                        account.uiAmount === null
                          ? undefined
                          : account.uiAmount,
                    }}
                    isSelected={selectedAccounts.has(account.pubkey.toString())}
                    onSelect={handleAccountSelection}
                  />
                ))}
              </div>

              {/* Metadata Loading Progress */}
              {metadataProgress && (
                <div
                  className="mt-4 p-3 border rounded-lg"
                  style={{
                    backgroundColor: `${colors.background.light}/10`,
                    borderColor: `${colors.border}/30`,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <XTypography
                      variant="body"
                      className="text-sm font-medium"
                      style={{ color: colors.text.primary }}
                    >
                      Loading Token Metadata...
                    </XTypography>
                    <XTypography
                      variant="body"
                      className="text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      {metadataProgress.current}/{metadataProgress.total}
                    </XTypography>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          (metadataProgress.current / metadataProgress.total) *
                          100
                        }%`,
                        backgroundColor: colors.primary,
                      }}
                    />
                  </div>
                  <XTypography
                    variant="body"
                    className="text-xs mt-1"
                    style={{ color: colors.text.secondary }}
                  >
                    Fetching token information in batches to ensure optimal
                    performance...
                  </XTypography>
                </div>
              )}

              {/* Pagination Controls */}
              {totalAccounts > itemsPerPage && (
                <div className="mt-6 flex flex-col items-center gap-4">
                  {/* Pagination Info */}
                  <div
                    className="text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    Showing{" "}
                    {Math.min((currentPage + 1) * itemsPerPage, totalAccounts)}{" "}
                    of {totalAccounts} accounts
                  </div>

                  {/* Load More Button for easier UX */}
                  {hasMoreAccounts && (
                    <button
                      onClick={loadMoreAccounts}
                      disabled={isLoadingMore}
                      className="w-full sm:w-auto px-4 py-2 text-sm border rounded-md transition-colors flex items-center justify-center gap-2"
                      style={{
                        borderColor: colors.primary,
                        color: colors.primary,
                        backgroundColor: "transparent",
                      }}
                    >
                      {isLoadingMore ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                              strokeDasharray="32"
                              strokeDashoffset="32"
                            />
                          </svg>
                          <span>
                            {metadataProgress
                              ? `Loading metadata (${metadataProgress.current}/${metadataProgress.total})...`
                              : "Processing accounts..."}
                          </span>
                        </>
                      ) : (
                        `Load More (${
                          totalAccounts - (currentPage + 1) * itemsPerPage
                        } remaining)`
                      )}
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {/* Enhanced Total Calculation */}
          {accounts.length > 0 && (
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
                    {selectedAccounts.size}
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
                    {totalAccounts}
                  </XTypography>
                </div>
              </div>

              {selectedAccounts.size === 0 && (
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
              disabled={isClosing || selectedAccounts.size === 0}
              isLoading={isClosing}
              className="w-full disabled:opacity-50"
              style={{
                background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
                color: colors.background.white,
              }}
              onMouseEnter={(e) => {
                if (!isClosing && selectedAccounts.size > 0) {
                  e.currentTarget.style.background = `linear-gradient(to right, ${colors.secondary}, ${colors.secondary})`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isClosing && selectedAccounts.size > 0) {
                  e.currentTarget.style.background = `linear-gradient(to right, ${colors.primary}, ${colors.accent})`;
                }
              }}
            >
              {isClosing
                ? "Burning & Closing Accounts..."
                : `Burn & Close Accounts & Get SOL Back (${selectedAccounts.size})`}
            </XButton>
            <XTypography
              variant="body"
              className="text-xs mt-3 text-center"
              style={{ color: colors.text.secondary }}
            >
              This will burn all tokens in selected accounts and close them,
              refunding your locked SOL back to your wallet. Large batches may
              require multiple transactions.
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
                    onClick={() => clearTransactionHashes([])}
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

      {/* Confirmation Dialog */}
      <ConfirmDialog {...confirmationProps} />
    </>
  );
};
