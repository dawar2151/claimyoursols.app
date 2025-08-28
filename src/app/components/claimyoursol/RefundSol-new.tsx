"use client";
import React, { useState } from "react";
import { AccountsManager } from "../close-accounts/CloseAccount";
import { BurnAndCloseAccountsManager } from "../burn-and-close-accounts/BurnAndCloseAccountsManager";
import { colors } from "@/app/utils/colors";
import { motion, AnimatePresence } from "framer-motion";
import { CloseMintAccountsManager } from "../close-mint-account/CloseMintAccountsManager";

enum TabType {
  CLOSE = "close",
  BURN = "burn",
  CLOSE_MINT = "close-mint",
}

const RefundSol: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.CLOSE);

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
    <div className="w-full max-w-6xl mx-auto">
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
    </div>
  );
};

export default RefundSol;
