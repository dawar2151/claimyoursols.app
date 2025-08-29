import React from "react";
import type { Metadata } from "next";
import BurnAndCloseContent from "../components/pages/BurnAndCloseContent";

export const metadata: Metadata = {
  title: "Burn Tokens & Close Accounts - Claim Your SOLs",
  description:
    "Burn unwanted tokens and close their accounts in one step. Perfect for removing dust tokens, scam tokens, or tokens you no longer want on Solana.",
  keywords:
    "burn tokens, close token accounts, remove scam tokens, dust tokens, unwanted tokens, Solana token burner, token account cleanup",
  openGraph: {
    title: "Burn Tokens & Close Accounts - Claim Your SOLs",
    description:
      "Burn unwanted tokens and close their accounts in one step. Perfect for removing dust tokens, scam tokens, or tokens you no longer want.",
    url: "https://www.claimyoursols.app/burn-and-close-accounts/",
  },
  twitter: {
    title: "Burn Tokens & Close Accounts - Claim Your SOLs",
    description:
      "Burn unwanted tokens and close their accounts in one step. Perfect for removing dust tokens, scam tokens, or tokens you no longer want.",
  },
  alternates: {
    canonical: "https://www.claimyoursols.app/burn-and-close-accounts/",
  },
};

export default function BurnAndCloseAccountsPage() {
  return <BurnAndCloseContent />;
}
