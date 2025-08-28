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
  );
};

export default FAQSection;
