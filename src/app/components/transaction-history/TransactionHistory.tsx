"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  useTransactionHistory,
  TransactionInfo,
} from "./useTransactionHistory";
import { getSolscanURL } from "@/app/utils";
import { colors } from "@/app/utils/colors";
import {
  CONFIG,
  METHOD_PATTERNS,
  TRANSACTION_TYPES,
  TEXT_CONTENT,
} from "./constants";

interface TransactionHistoryProps {
  accountAddress?: string;
  rpcUrl?: string;
  limit?: number;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const limit = useMemo(() => {
    return isMobile ? CONFIG.MOBILE_LIMIT : CONFIG.DEFAULT_LIMIT;
  }, [isMobile]);
  const { history, loading, error, hasMore, loadMore, accountAddress } =
    useTransactionHistory(limit);

  const formatTime = (blockTime: number | null) => {
    if (!blockTime) return CONFIG.UNKNOWN_TIME_LABEL;
    return new Date(blockTime * 1000).toLocaleString();
  };

  const truncateHash = (hash: string, length: number) => {
    return `${hash.slice(0, length)}...${hash.slice(-length)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getClaimedSolAmount = (transaction: TransactionInfo): string => {
    // Calculate SOL balance change from preBalances and postBalances
    if (!transaction.meta?.preBalances || !transaction.meta?.postBalances) {
      return "0.00";
    }

    const preBalance = transaction.meta.preBalances[0] || 0;
    const postBalance = transaction.meta.postBalances[0] || 0;
    const balanceChange = (postBalance - preBalance) / 1e9; // Convert lamports to SOL

    // Only show positive balance changes (SOL claimed/received)
    if (balanceChange > 0) {
      return balanceChange.toFixed(4);
    }

    return "0.00";
  };
  const getTransactionSummary = (methodNames: string[]) => {
    const burnCount = methodNames.filter((m) =>
      m.toLowerCase().includes(METHOD_PATTERNS.BURN)
    ).length;
    const closeCount = methodNames.filter((m) =>
      m.toLowerCase().includes(METHOD_PATTERNS.CLOSE)
    ).length;
    const transferCount = methodNames.filter((m) =>
      m.toLowerCase().includes(METHOD_PATTERNS.TRANSFER)
    ).length;

    if (burnCount > 0 && closeCount > 0) {
      return {
        type: TRANSACTION_TYPES.BURN_CLOSE.type,
        count: TRANSACTION_TYPES.BURN_CLOSE.getCount(burnCount, closeCount),
        color: TRANSACTION_TYPES.BURN_CLOSE.color,
      };
    } else if (burnCount > 0) {
      return {
        type: TRANSACTION_TYPES.BURN.type,
        count: TRANSACTION_TYPES.BURN.getCount(burnCount),
        color: TRANSACTION_TYPES.BURN.color,
      };
    } else if (closeCount > 0) {
      return {
        type: TRANSACTION_TYPES.CLOSE.type,
        count: TRANSACTION_TYPES.CLOSE.getCount(closeCount),
        color: TRANSACTION_TYPES.CLOSE.color,
      };
    } else if (transferCount > 0) {
      return {
        type: TRANSACTION_TYPES.TRANSFER.type,
        count: TRANSACTION_TYPES.TRANSFER.getCount(transferCount),
        color: TRANSACTION_TYPES.TRANSFER.color,
      };
    } else {
      return {
        type: TRANSACTION_TYPES.OTHER.type,
        count: TRANSACTION_TYPES.OTHER.getCount(methodNames.length),
        color: TRANSACTION_TYPES.OTHER.color,
      };
    }
  };

  return (
    <div className="mt-16 p-6">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2
            className="text-4xl font-bold"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent}, ${colors.success})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {TEXT_CONTENT.HEADER}
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-purple-700">
              Live Data
            </span>
          </div>
        </div>
        <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
      </div>

      {/* Error Display message*/}
      {error && (
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-xl shadow-lg backdrop-blur-sm">
          <div className="flex items-center mb-4">
            <svg
              className="w-6 h-6 text-blue-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-blue-800 font-semibold text-lg">
              Transaction History
            </p>
          </div>

          {/* Unable to load history from node */}
          <div className="mt-4 p-4 bg-white/50 rounded-lg border border-blue-200">
            <p className="text-blue-700 text-sm mb-3">
              Unable to load recent transactions from our cache. You can still
              view the complete transaction history on Solscan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`https://solscan.io/account/${accountAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Check on Solscan
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Loading State - Only for initial load */}
      {loading && history.length === 0 && (
        <div className="flex flex-col justify-center items-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent absolute top-0 left-0"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium text-lg">
            Loading transactions...
          </p>
        </div>
      )}

      {/* Transaction List */}
      {history.length > 0 && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xl">
            {/* Desktop Header */}
            <div className="hidden md:block bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-6 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                <div className="col-span-3">
                  <span>Transaction</span>
                </div>
                <div className="col-span-2">
                  <span>Type</span>
                </div>
                <div className="col-span-2">
                  <span>Operations</span>
                </div>
                <div className="col-span-2">
                  <span>Claimed SOL</span>
                </div>
                <div className="col-span-3">
                  <span>Time</span>
                </div>
              </div>
            </div>

            {history.map((tx, index) => {
              const summary = getTransactionSummary(tx.methodNames);
              return (
                <div
                  key={tx.signature}
                  className="group border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-all duration-300"
                >
                  {/* Desktop Layout */}
                  <div className="hidden md:grid md:grid-cols-12 gap-6 items-center p-4">
                    {/* Transaction Hash */}
                    <div className="col-span-3">
                      <button
                        onClick={() => {
                          copyToClipboard(tx.signature);
                          window.open(
                            getSolscanURL("tx", tx.signature),
                            "_blank"
                          );
                        }}
                        className="group flex items-center gap-2 w-full text-left p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-purple-300 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span
                            className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white"
                            style={{ backgroundColor: colors.primary }}
                          >
                            {TEXT_CONTENT.TRANSACTION_NUMBER(index)}
                          </span>
                          <code
                            className="font-mono text-sm font-medium truncate max-w-32 group-hover:text-purple-700 transition-colors"
                            style={{ color: colors.accent }}
                          >
                            {truncateHash(
                              tx.signature,
                              CONFIG.HASH_TRUNCATE_LENGTH.DESKTOP
                            )}
                          </code>
                        </div>
                      </button>
                    </div>

                    <div className="col-span-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${summary.color}`}
                      >
                        {summary.type.replace("-", " & ").toUpperCase()}
                      </span>
                    </div>

                    <div className="col-span-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {summary.count}
                      </span>
                    </div>

                    {/* Claimed SOL */}
                    <div className="col-span-2">
                      <div className="flex items-center space-x-1">
                        <span
                          className="text-sm font-semibold"
                          style={{ color: colors.success }}
                        >
                          {getClaimedSolAmount(tx)}
                        </span>
                        <span className="text-xs text-gray-500">SOL</span>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="col-span-3">
                      <span className="text-sm text-gray-600">
                        {formatTime(tx.blockTime)}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: colors.primary }}
                        >
                          {TEXT_CONTENT.TRANSACTION_NUMBER(index)}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${summary.color}`}
                        >
                          {summary.type.replace("-", " & ").toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {summary.count}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <button
                        onClick={() => {
                          copyToClipboard(tx.signature);
                          window.open(
                            getSolscanURL("tx", tx.signature),
                            "_blank"
                          );
                        }}
                        className="text-left group w-full"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <code
                            className="font-mono text-sm font-medium truncate group-hover:text-purple-700 transition-colors"
                            style={{ color: colors.accent }}
                          >
                            {truncateHash(
                              tx.signature,
                              CONFIG.HASH_TRUNCATE_LENGTH.MOBILE
                            )}
                          </code>
                        </div>
                      </button>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {formatTime(tx.blockTime)}
                        </span>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-gray-500">
                              Claimed:
                            </span>
                            <span
                              className="text-xs font-bold"
                              style={{ color: colors.success }}
                            >
                              {getClaimedSolAmount(tx)} SOL
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-gray-500">
                              Instructions:
                            </span>
                            <span
                              className="text-xs font-bold px-2 py-1 rounded text-white"
                              style={{ backgroundColor: colors.info }}
                            >
                              {tx.instructionCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show More Button */}
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="group relative flex items-center px-8 py-4 rounded-2xl font-bold text-white shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:animate-pulse"></div>
                <svg
                  className="w-5 h-5 mr-3 group-hover:animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                <span className="relative z-10">
                  {TEXT_CONTENT.LOAD_MORE_BUTTON}
                </span>
              </button>
            </div>
          )}

          {/* Loading More Transactions */}
          {loading && history.length > 0 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-4 px-6 py-4 bg-gray-50 rounded-2xl border border-gray-200 shadow-lg">
                <div className="relative">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-200"></div>
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-t-transparent absolute top-0 left-0"></div>
                </div>
                <span className="font-bold" style={{ color: colors.primary }}>
                  {TEXT_CONTENT.LOADING_MORE}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {!loading && history.length === 0 && !error && (
        <div className="text-center py-20">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl"
                style={{ backgroundColor: `${colors.neutral}` }}
              >
                <svg
                  className="w-10 h-10"
                  style={{ color: colors.text.secondary }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: colors.warning }}
              >
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
          </div>
          <h3
            className="text-2xl font-bold mb-3"
            style={{ color: colors.text.primary }}
          >
            {TEXT_CONTENT.NO_TRANSACTIONS_TITLE}
          </h3>
          <p
            className="text-lg max-w-md mx-auto leading-relaxed"
            style={{ color: colors.text.secondary }}
          >
            {TEXT_CONTENT.NO_TRANSACTIONS_MESSAGE}
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
