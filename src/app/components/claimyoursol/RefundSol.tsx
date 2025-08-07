'use client';
import React, { useState } from "react";
import { AccountsManager } from "../close-accounts/CloseAccount";
import { BurnAndCloseAccountsManager } from "../burn-and-close-accounts/BurnAndCloseAccountsManager";
import { colors } from "@/app/utils/colors";

const FAQItem = ({ question, children }: { question: string; children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="border-b py-4"
            style={{ borderColor: `${colors.border}/50` }}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full text-left text-xl font-semibold"
                style={{ color: colors.text.primary }}
            >
                <span>{question}</span>
                <span style={{ color: colors.primary }}>{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
                <div
                    className="mt-2"
                    style={{ color: colors.text.secondary }}
                >
                    {children}
                </div>
            )}
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

    return (
        <div
            className="w-full max-w-6xl mx-auto p-6 rounded-lg shadow-lg"
            style={{ backgroundColor: colors.background.white }}
        >
            {/* Centered "How does it work?" Button */}
            <div className="flex justify-center items-center my-8">
                <button
                    onClick={() => handleScroll()}
                    className="font-bold text-center text-lg"
                    style={{
                        background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}
                >
                    How does it work?
                </button>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-6 border-b" style={{ borderColor: '#E5E7EB' }}>
                <button
                    onClick={() => setActiveTab("close")}
                    className={`px-6 py-2 text-sm font-semibold transition-colors duration-300 ${activeTab === "close" ? "border-b-2" : ""
                        }`}
                    style={{
                        color: activeTab === "close" ? colors.secondary : colors.text.secondary,
                        borderColor: activeTab === "close" ? colors.secondary : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                        if (activeTab !== "close") {
                            e.currentTarget.style.color = colors.secondary;
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (activeTab !== "close") {
                            e.currentTarget.style.color = colors.text.secondary;
                        }
                    }}
                >
                    Close Accounts
                </button>
                <button
                    onClick={() => setActiveTab("burn")}
                    className={`px-6 py-2 text-sm font-semibold transition-colors duration-300 ${activeTab === "burn" ? "border-b-2" : ""
                        }`}
                    style={{
                        color: activeTab === "burn" ? colors.secondary : colors.text.secondary,
                        borderColor: activeTab === "burn" ? colors.secondary : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                        if (activeTab !== "burn") {
                            e.currentTarget.style.color = colors.secondary;
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (activeTab !== "burn") {
                            e.currentTarget.style.color = colors.text.secondary;
                        }
                    }}
                >
                    Burn and Close Accounts
                </button>
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === "close" && <AccountsManager />}
                {activeTab === "burn" && <BurnAndCloseAccountsManager />}
            </div>

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
                    className="mb-8 text-center"
                    style={{ color: colors.text.secondary }}
                >
                    To ensure our tool stays active, a small donation is included for the expenses of servers, RPC & development.
                </p>

                <div className="space-y-6">
                    <FAQItem question="How does this work?">
                        <p className="mb-4">
                            Every time you buy a token on Solana, a token account is created to store your tokens.
                            To keep this account active, 0.00204 SOL is required as a rent fee, charged by the Solana blockchain.
                        </p>
                        <p>
                            Here is the catch: Even after you sell all your tokens, the account remains open, holding that rent fee.
                            Our service identifies and closes these empty token accounts, refunding the SOL back to your wallet!
                            We take a small 10% donation from the recovered amount to keep our servers running.
                        </p>
                    </FAQItem>

                    <FAQItem question="Is it safe to close token accounts?">
                        <p>
                            Yes! We only close accounts that are completely empty and unused.
                            You wont lose any tokens, and your wallet remains fully secure.
                        </p>
                    </FAQItem>

                    <FAQItem question="What is Account Rent?">
                        <p>
                            When an account is created on Solana, a rent fee is required to store its data and process transactions for 2 years.
                            This rent is refundable only when the account is closed.{" "}
                            <a
                                href="https://docs.solana.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors"
                                style={{ color: colors.secondary }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = colors.primary;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = colors.secondary;
                                }}
                            >
                                Learn more in the official Solana Rent Documentation.
                            </a>
                        </p>
                    </FAQItem>
                </div>
            </div>
        </div>
    );
};

export default RefundSol;