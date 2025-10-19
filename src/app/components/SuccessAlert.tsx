import { motion, AnimatePresence } from "framer-motion";
import { colors } from "../utils/colors";
import { getSolscanURL } from "../utils";
import { useContext } from "react";
import { ClaimYourSolsStateContext } from "../providers";
import { useWallet } from "@solana/wallet-adapter-react";

export const SuccessAlert = ({
  isVisible,
  onClose,
  recoveredAmount,
  accountCount,
  transactionHashes = [],
}: {
  isVisible: boolean;
  onClose: () => void;
  recoveredAmount: number;
  accountCount: number;
  transactionHashes?: string[];
}) => {
  const { claimYourSolsState } = useContext(ClaimYourSolsStateContext);
  const { publicKey } = useWallet();

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Alert Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={onClose} // Click outside to close
          >
            <div
              className="p-8 rounded-2xl shadow-2xl border max-w-lg w-full relative max-h-[90vh] overflow-y-auto"
              style={{
                backgroundColor: colors.background.white,
                borderColor: `${colors.success || colors.primary}40`,
              }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
              <div className="text-center">
                {/* Success Icon */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    backgroundColor: `${colors.success || colors.primary}20`,
                  }}
                >
                  <svg
                    className="w-8 h-8"
                    style={{ color: colors.success || colors.primary }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                {/* Title */}
                <h3
                  className="text-2xl font-bold mb-3"
                  style={{ color: colors.text.primary }}
                >
                  🎉 Success!
                </h3>

                {/* Message */}
                <p
                  className="text-base mb-4 leading-relaxed"
                  style={{ color: colors.text.secondary }}
                >
                  Successfully closed{" "}
                  <span
                    className="font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    {accountCount} account{accountCount !== 1 ? "s" : ""}
                  </span>{" "}
                  and recovered
                </p>

                {/* Amount */}
                <div
                  className="text-3xl font-bold mb-4"
                  style={{ color: colors.success || colors.primary }}
                >
                  {(recoveredAmount / 1e9).toFixed(6)} SOL
                </div>

                {/* Subtitle */}
                <p
                  className="text-sm mb-6"
                  style={{ color: colors.text.secondary }}
                >
                  The SOL has been transferred back to your wallet. Please allow
                  a few moments for the transaction to reflect in your wallet
                  (about 1 min), and refresh account.
                </p>

                {/* Transaction Hashes */}
                {transactionHashes.length > 0 && (
                  <div
                    className="mt-4 mb-6 p-4 border rounded-lg text-left"
                    style={{
                      backgroundColor: `${colors.background.light || colors.border
                        }/10`,
                      borderColor: `${colors.border}/30`,
                    }}
                  >
                    <div className="mb-3">
                      <h4
                        className="text-sm font-semibold"
                        style={{ color: colors.text.primary }}
                      >
                        Transaction Proofs ({transactionHashes.length})
                      </h4>
                    </div>
                    <div className="max-h-32 overflow-y-auto">
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
                              className="font-mono text-xs break-all transition-colors hover:underline"
                              style={{ color: colors.secondary }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = colors.primary;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = colors.secondary;
                              }}
                            >
                              {hash.slice(0, 8)}...{hash.slice(-8)}
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
                  </div>
                )}

                {/* Close Button */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const message = `I just claimed ${(recoveredAmount / 1e9).toFixed(6)} SOL from @claimyoursolsx, claim yours via claimyoursols.app?ref=${publicKey}`;
                      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
                      window.open(twitterUrl, '_blank');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Share to X & Earn 50% Referral Bonus
                  </button>

                  <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.background.white,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.secondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.primary;
                    }}
                  >
                    Close
                  </button>
                </div>

              </div>

              {/* X Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full transition-colors"
                style={{ color: colors.text.secondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${colors.border || colors.text.secondary
                    }30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
