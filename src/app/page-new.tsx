import React, { Suspense } from "react";
import { AccountsManager } from "./components/close-accounts/CloseAccount";
import TabNavigation from "./components/navigation/TabNavigation";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TabNavigation />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <AccountsManager />
      </motion.div>
    </Suspense>
  );
}
