"use client";

import { useContext, useState, useEffect } from "react";
import { ClaimYourSolsStateContext } from "@/app/providers";
import { useAccountsHelper } from "./useAccountsHelper";
import XButton from "@/app/components/x-components/XButton";
import { XTypography } from "@/app/components/x-components/XTypography";
import { useSearchParams } from "next/navigation";
import { getSolscanURL } from "@/app/utils";
import { colors } from "@/app/utils/colors";
import { SuccessAlert } from "../SuccessAlert";

export const AccountsManager = () => {
  const { claimYourSolsState } = useContext(ClaimYourSolsStateContext);
  // Add state for success alert
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [lastSuccessData, setLastSuccessData] = useState<{
    recoveredAmount: number;
    accountCount: number;
  } | null>(null);
  const {
    selectedAccounts,
    setSelectedAccounts,
    cleanClosedAccounts,
    setReferralAccount,
    accounts,
    error,
    isSuccess,
    isLoading,
    isClosing,
    transactionHashes,
    clearTransactionHashes,
    closeAllAccounts,
    refreshAccounts,
  } = useAccountsHelper(claimYourSolsState.connection);

  const searchParams = useSearchParams();
  const refAccount = searchParams.get("ref");
  const totalRent = Array.from(selectedAccounts).reduce((sum, accountKey) => {
    const account = accounts.find(
      (acc) => acc.pubkey.toString() === accountKey
    );
    return sum + (account?.lamports || 0);
  }, 0);

  const feePercentage = parseFloat(
    process.env.NEXT_PUBLIC_FEE_PERCENTAGE || "0.1"
  );
  const commission = Math.floor(totalRent * feePercentage); // Use Math.floor for lamports precision
  const userReceives = totalRent - commission;
  useEffect(() => {
    if (refAccount) {
      setReferralAccount(refAccount);
    }
  }, [refAccount, setReferralAccount]);

  useEffect(() => {
    if (isSuccess && !showSuccessAlert) {
      const recoveredAmount = userReceives; // This is now defined
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
  }, [isSuccess]); // Add userReceives to dependencies

  const [selectAll, setSelectAll] = useState(true);

  // Initialize all accounts as selected by default
  useEffect(() => {
    if (accounts.length > 0) {
      const allAccountKeys = new Set(
        accounts.map((account) => account.pubkey.toString())
      );
      setSelectedAccounts(allAccountKeys);
    }
  }, [accounts]);

  // Handle select all toggle
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedAccounts(new Set());
      setSelectAll(false);
    } else {
      const allAccountKeys = new Set(
        accounts.map((account) => account.pubkey.toString())
      );
      setSelectedAccounts(allAccountKeys);
      setSelectAll(true);
    }
  };
  const handleCloseSuccessAlert = () => {
    cleanClosedAccounts();
    setShowSuccessAlert(false);
  };

  // Handle individual account selection
  const handleAccountSelection = (accountKey: string) => {
    const newSelected = new Set(selectedAccounts);
    if (newSelected.has(accountKey)) {
      newSelected.delete(accountKey);
    } else {
      newSelected.add(accountKey);
    }
    setSelectedAccounts(newSelected);
    setSelectAll(newSelected.size === accounts.length);
  };

  if (isLoading) {
    return (
      <div
        className="flex flex-col items-center space-y-4 min-h-screen"
        style={{ backgroundColor: colors.background.white }}
      >
        <div
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: colors.primary }}
        ></div>
        <XTypography variant="body" style={{ color: colors.text.secondary }}>
          Loading your accounts...
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
      {showSuccessAlert && lastSuccessData && (
        <SuccessAlert
          isVisible={showSuccessAlert}
          onClose={() => handleCloseSuccessAlert()}
          recoveredAmount={lastSuccessData.recoveredAmount}
          accountCount={lastSuccessData.accountCount}
        />
      )}
      <div
        className="w-full max-w-4xl mx-auto p-6"
        style={{ backgroundColor: colors.background.white }}
      >
        {/* Your Accounts Section */}
        <div
          className="border rounded-lg shadow-lg p-6"
          style={{
            backgroundColor: colors.background.white,
            borderColor: `${colors.border}/50`,
          }}
        >
          {/* Select All Checkbox */}
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
                style={{ color: colors.text.primary }}
              >
                Select All Accounts ({selectedAccounts.size} selected)
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

          {accounts.length === 0 ? (
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
                  "No open accounts found. All your accounts are already closed or you don't have any accounts to close."
                }
              </XTypography>
            </div>
          ) : (
            <div className="space-y-4">
              {accounts.map((account, _) => (
                <div
                  key={account.pubkey.toString()}
                  className="flex items-center p-4 border rounded-lg transition-colors"
                  style={{
                    backgroundColor: `${colors.background.light}/10`,
                    borderColor: `${colors.border}/50`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${colors.background.hover}/10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${colors.background.light}/10`;
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedAccounts.has(account.pubkey.toString())}
                    onChange={() =>
                      handleAccountSelection(account.pubkey.toString())
                    }
                    className="w-4 h-4 bg-white rounded mr-4"
                    style={{
                      color: colors.secondary,
                      borderColor: colors.primary,
                    }}
                  />
                  <div className="flex-1">
                    <XTypography
                      variant="body"
                      className="font-mono text-sm"
                      style={{ color: colors.text.primary }}
                    >
                      {account.pubkey.toString()}
                    </XTypography>
                    <XTypography
                      variant="body"
                      className="text-xs"
                      style={{ color: colors.text.secondary }}
                    >
                      Balance: {account.lamports / 1e9} SOL
                    </XTypography>
                  </div>
                  <div className="text-right">
                    <XTypography
                      variant="body"
                      className="text-xs"
                      style={{ color: colors.text.secondary }}
                    >
                      Rent: {account.rentExemptReserve / 1e9} SOL
                    </XTypography>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Total Calculation */}
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
                    {(totalRent / 1e9).toFixed(4)} SOL
                  </XTypography>
                </div>
              </div>
            </div>
          )}

          {/* Fee Recipient Info */}

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
                ? "Closing Accounts..."
                : `Clean Accounts & Get SOL Back (${selectedAccounts.size})`}
            </XButton>
            <XTypography
              variant="body"
              className="text-xs mt-3 text-center"
              style={{ color: colors.text.secondary }}
            >
              This will close selected accounts and refund your locked SOL back
              to your wallet
            </XTypography>
            {isSuccess && transactionHashes.length > 0 && (
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
                    Transaction Hashes
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
                          [Solscan]
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
