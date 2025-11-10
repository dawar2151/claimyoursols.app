"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors } from "../../utils/colors";

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

const FAQSection = () => {
  return (
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
      {/* Use Cases Cards */}
      <section className="py-8">
        <div className="grid md:grid-cols-3 gap-6 p-6">
          {/* Close Accounts Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Close Zero-Balance Accounts
            </h3>
            <p className="text-sm text-gray-600">
              Close empty token accounts and reclaim the rent
              deposit (0.00204 SOL per account). Safe, simple, and
              only targets accounts with zero balance.
            </p>
          </div>

          {/* Burn & Close Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-current"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2s2-.9 2-2v-4c0-1.1-.9-2-2-2zm0-6C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900  mb-3">
              Burn Tokens & Close Accounts
            </h3>
            <p className="text-sm text-gray-600 ">
              Burn unwanted tokens and close their accounts in one
              step. Perfect for removing dust tokens, scam tokens,
              or tokens you no longer want (0.00204 SOL per
              account)
            </p>
          </div>

          {/* Close Mint Accounts Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
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
            <h3 className="text-lg font-semibold text-gray-900  mb-3">
              Close Mint Accounts (Token2022)
            </h3>
            <p className="text-sm text-gray-600">
              Close Token2022 mint accounts you created and
              recover their rent deposits (0.0048 SOL per
              account). Automatically burns remaining tokens if
              only from the close authority account.
            </p>
          </div>
        </div>
      </section>
      <p
        className="mb-8 text-center text-base"
        style={{ color: colors.text.secondary }}
      >
        To keep this tool running, a small donation is included to cover server,
        RPC, and development costs.
      </p>

      <div className="space-y-4">
        <FAQItem question="What is ClaimYourSOLs?">
          <p className="mb-4">
            ClaimYourSOLs is a tool that helps you recover SOL locked as rent
            fees on unused token accounts. Whenever you buy a token on Solana, a
            token account is created to store it. Keeping this account active
            costs a rent fee of 0.00204 SOL.
          </p>
          <p className="mb-4">With ClaimYourSOLs, you can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Claim SOL from unused or empty token accounts</li>
            <li>Burn worthless tokens or spam coins</li>
            <li>Keep your wallet safe, clean, and efficient!</li>
          </ul>
        </FAQItem>
        <FAQItem question="How does this work?">
          <p className="mb-4">
            Every time you buy a token on Solana, a token account is created to
            store it. To keep this account alive, the blockchain requires a rent
            fee of 0.00204 SOL.
          </p>
          <p>
            Even after selling all your tokens, that account stays open and
            holds your rent. We detect and close these empty accounts, refunding
            your SOL back to your wallet. A small {parseFloat(process.env.NEXT_PUBLIC_CLOSE_ACCOUNT_FEE ?? "0") * 100}% donation from the
            recovered SOL supports our operations.
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
  );
};

export default FAQSection;
