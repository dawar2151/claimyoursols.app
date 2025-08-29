import React from "react";
import type { Metadata } from "next";
import BurnAndCloseContent from "../components/pages/BurnAndCloseContent";

export const metadata: Metadata = {
  title: "Burn Tokens & Close Accounts | Claim Your SOLs",
  description:
    "Safely burn unwanted tokens and close their accounts in one step. Perfect for removing dust tokens, scam tokens, or tokens you no longer want on Solana.",
  keywords:
    "burn tokens, close token accounts, remove scam tokens, dust tokens, unwanted tokens, Solana token burner, token account cleanup",
  openGraph: {
    title: "Burn Tokens & Close Accounts | Claim Your SOLs",
    description:
      "Safely burn unwanted tokens and close their accounts in one step. Perfect for removing dust tokens, scam tokens, or tokens you no longer want on Solana.",
    url: "https://www.claimyoursols.app/burn-and-close-accounts",
    images: [
      {
        url: "https://www.claimyoursols.app/images/burn-and-close-accounts.png",
        width: 1200,
        height: 630,
        alt: "Burn Tokens & Close Accounts",
      },
    ],
  },
  twitter: {
    title: "Burn Tokens & Close Accounts | Claim Your SOLs",
    description:
      "Safely burn unwanted tokens and close their accounts in one step. Perfect for removing dust tokens, scam tokens, or tokens you no longer want on Solana.",
    card: "summary_large_image",
    images: ["https://www.claimyoursols.app/images/burn-and-close-accounts.png"],
  },
  alternates: {
    canonical: "https://www.claimyoursols.app/burn-and-close-accounts",
  },
};

export default function BurnAndCloseAccountsPage() {
  return (
    <>
      {/* Hidden H1 for SEO */}
      <h1 className="sr-only">Burn Tokens & Close Accounts</h1>

      {/* Main Content */}
      <BurnAndCloseContent />
    </>
  );
}