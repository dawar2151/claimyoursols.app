"use client";
import React, { useState } from "react";
import { AccountsManager } from "../close-accounts/CloseAccount";
import { BurnAndCloseAccountsManager } from "../burn-and-close-accounts/BurnAndCloseAccountsManager";
import { colors } from "@/app/utils/colors";
import { motion, AnimatePresence } from "framer-motion";
import { CloseMintAccountsManager } from "../close-mint-account/CloseMintAccountsManager";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

enum TabType {
  CLOSE = "close",
  BURN = "burn",
  CLOSE_MINT = "close-mint",
}

const FAQItem = ({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="border-b py-4"
      style={{ borderColor: `${colors.border}/50` }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left text-lg font-semibold transition-colors hover:opacity-80"
        style={{ color: colors.text.primary }}
      >
        <span>{question}</span>
        <motion.span
          initial={{ rotate: 0 }}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ color: colors.primary, fontSize: "1.2rem" }}
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 text-base leading-relaxed"
            style={{ color: colors.text.secondary }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RefundSol: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.CLOSE);

  const handleScroll = () => {
    const faqSection = document.getElementById("faq-section");
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const TabButton = ({ label, value }: { label: string; value: TabType }) => (
    <button
      onClick={() => setActiveTab(value)}
      className={`relative px-6 py-3 text-sm font-semibold transition-all duration-300 ${
        activeTab === value
          ? "text-[var(--tab-active)]"
          : "text-[var(--tab-inactive)]"
      }`}
      style={
        {
          "--tab-active": colors.secondary,
          "--tab-inactive": colors.text.secondary,
        } as React.CSSProperties
      }
    >
      {label}
      {activeTab === value && (
        <motion.div
          layoutId="tab-underline"
          className="absolute left-0 bottom-0 w-full h-[2px]"
          style={{ backgroundColor: colors.secondary }}
        />
      )}
    </button>
  );

  return (
    <div
      className="w-full max-w-6xl mx-auto rounded-2xl shadow-lg"
      style={{ backgroundColor: colors.background.white }}
    >
      {/* How does it work? */}
      <div className="flex justify-center items-center my-8">
        <WalletMultiButton style={{ justifyContent: "center" }} />
      </div>
      {/* Use Cases Cards */}
      <section className="py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Close Accounts Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Close Empty Token Accounts
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Close token accounts with zero balance and recover the rent
              deposit (0.00204 SOL per account). Safe and simple - only affects
              empty accounts.
            </p>
          </div>

          {/* Burn & Close Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Burn Tokens & Close Accounts
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Burn unwanted tokens and close their accounts in one step. Perfect
              for removing dust tokens, scam tokens, or tokens you no longer
              want.
            </p>
          </div>

          {/* Close Mint Accounts Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Close Mint Accounts (Token2022)
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Close Token2022 mint accounts you created and recover their rent
              deposits. Automatically burns remaining tokens if only from close
              authority account.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div
        className="flex justify-center mb-6 border-b"
        style={{ borderColor: "#E5E7EB" }}
      >
        <TabButton label="Close Accounts" value={TabType.CLOSE} />
        <TabButton label="Burn & Close Accounts" value={TabType.BURN} />
        <TabButton label="Close Mint Accounts" value={TabType.CLOSE_MINT} />
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === TabType.CLOSE && <AccountsManager />}
          {activeTab === TabType.BURN && <BurnAndCloseAccountsManager />}
          {activeTab === TabType.CLOSE_MINT && <CloseMintAccountsManager />}
        </motion.div>
      </AnimatePresence>

      {/* FAQ Section */}

      <div
        id="faq-section"
        className="mt-16 p-6 rounded-lg shadow"
        style={{ backgroundColor: colors.background.white }}
      >
        <h2
          className="text-3xl font-bold mb-6 text-center"
          style={{ color: colors.text.primary }}
        >
          Frequently Asked Questions
        </h2>

        <p
          className="mb-8 text-center text-base"
          style={{ color: colors.text.secondary }}
        >
          To keep this tool running, a small donation is included to cover
          server, RPC, and development costs.
        </p>

        <div className="space-y-4">
          <FAQItem question="How does this work?">
            <p className="mb-4">
              Every time you buy a token on Solana, a token account is created
              to store it. To keep this account alive, the blockchain requires a
              rent fee of 0.00204 SOL.
            </p>
            <p>
              Even after selling all your tokens, that account stays open and
              holds your rent. We detect and close these empty accounts,
              refunding your SOL back to your wallet. A small 10% donation from
              the recovered SOL supports our operations.
            </p>
          </FAQItem>

          <FAQItem question="Is it safe to close token accounts?">
            <p>
              Yes! We only close accounts that are empty and unused. You will
              never lose any tokens, and your wallet stays fully secure.
            </p>
          </FAQItem>

          <FAQItem question="What is Account Rent?">
            <p>
              On Solana, every account requires a rent deposit to store its data
              for 2 years. You get this rent back only by closing the account.{" "}
              <a
                href="https://docs.solana.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium hover:opacity-80"
                style={{ color: colors.secondary }}
              >
                Learn more here.
              </a>
            </p>
          </FAQItem>
        </div>
      </div>
    </div>
  );
};

export default RefundSol;
