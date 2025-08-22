import { motion, AnimatePresence } from "framer-motion";
import { colors } from "../utils/colors";

export const SuccessAlert = ({
  isVisible,
  onClose,
  recoveredAmount,
  accountCount,
}: {
  isVisible: boolean;
  onClose: () => void;
  recoveredAmount: number;
  accountCount: number;
}) => {
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
              className="p-8 rounded-2xl shadow-2xl border max-w-md w-full relative"
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
                  The SOL has been transferred back to your wallet, check below
                  the proofs. Please allow a few moments for the transaction to
                  reflect in your wallet (about 1 min), and refresh account.
                </p>

                {/* Close Button */}
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
                  Continue
                </button>
              </div>

              {/* X Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full transition-colors"
                style={{ color: colors.text.secondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${colors.border}30`;
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
