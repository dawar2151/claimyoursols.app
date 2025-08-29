"use client";
import React, { Suspense } from "react";
import { BurnAndCloseAccountsManager } from "../burn-and-close-accounts/BurnAndCloseAccountsManager";
import TabNavigation from "../navigation/TabNavigation";
import { motion } from "framer-motion";

export default function BurnAndCloseContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <h1 className="sr-only">Burn Tokens & Close Accounts - Claim Your SOLs</h1>
      <TabNavigation />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <BurnAndCloseAccountsManager />
      </motion.div>
    </Suspense>
  );
}
