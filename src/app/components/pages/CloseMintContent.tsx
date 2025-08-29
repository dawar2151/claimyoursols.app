"use client";
import React, { Suspense } from "react";
import { CloseMintAccountsManager } from "../close-mint-account/CloseMintAccountsManager";
import TabNavigation from "../navigation/TabNavigation";
import { motion } from "framer-motion";

export default function CloseMintContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <h1 className="sr-only">Close Mint Accounts (Token2022) - Claim Your SOLs</h1>
      <TabNavigation />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <CloseMintAccountsManager />
      </motion.div>
    </Suspense>
  );
}
