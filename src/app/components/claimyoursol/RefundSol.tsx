'use client';
import React, { useState } from "react";
import { AccountsManager } from "../close-accounts/CloseAccount";
import { BurnAndCloseAccountsManager } from "../burn-and-close-accounts/BurnAndCloseAccountsManager";
import { colors } from "@/app/utils/colors";
import { motion, AnimatePresence } from "framer-motion";

const FAQItem = ({ question, children }: { question: string; children: React.ReactNode }) => {
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
    const [activeTab, setActiveTab] = useState<"close" | "burn">("close");

    const handleScroll = () => {
        const faqSection = document.getElementById("faq-section");
        if (faqSection) {
            faqSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    const TabButton = ({ label, value }: { label: string; value: "close" | "burn" }) => (
        <button
            onClick={() => setActiveTab(value)}
            className={`relative px-6 py-3 text-sm font-semibold transition-all duration-300 ${activeTab === value ? "text-[var(--tab-active)]" : "text-[var(--tab-inactive)]"
                }`}
            style={{
                //@ts-ignore
                "--tab-active": colors.secondary,
                "--tab-inactive": colors.text.secondary,
            }}
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
            className="w-full max-w-6xl mx-auto p-6 rounded-2xl shadow-lg"
            style={{ backgroundColor: colors.background.white }}
        >
            {/* How does it work? */}
            <div className="flex justify-center items-center my-8">
                <button
                    onClick={handleScroll}
                    className="px-6 py-3 font-bold text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                    style={{
                        background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
                        color: "#fff"
                    }}
                >
                    How does it work?
                </button>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-6 border-b" style={{ borderColor: "#E5E7EB" }}>
                <TabButton label="Close Accounts" value="close" />
                <TabButton label="Burn & Close Accounts" value="burn" />
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
                    {activeTab === "close" && <AccountsManager />}
                    {activeTab === "burn" && <BurnAndCloseAccountsManager />}
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
                    To keep this tool running, a small donation is included to cover server, RPC, and development costs.
                </p>

                <div className="space-y-4">
                    <FAQItem question="How does this work?">
                        <p className="mb-4">
                            Every time you buy a token on Solana, a token account is created to store it.
                            To keep this account alive, the blockchain requires a rent fee of 0.00204 SOL.
                        </p>
                        <p>
                            Even after selling all your tokens, that account stays open and holds your rent.
                            We detect and close these empty accounts, refunding your SOL back to your wallet.
                            A small 10% donation from the recovered SOL supports our operations.
                        </p>
                    </FAQItem>

                    <FAQItem question="Is it safe to close token accounts?">
                        <p>
                            Yes! We only close accounts that are empty and unused.
                            You’ll never lose any tokens, and your wallet stays fully secure.
                        </p>
                    </FAQItem>

                    <FAQItem question="What is Account Rent?">
                        <p>
                            On Solana, every account requires a rent deposit to store its data for 2 years.
                            You get this rent back only by closing the account.{" "}
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
