import React from "react";
import type { Metadata } from "next";
import CloseMintContent from "../components/pages/CloseMintContent";

export const metadata: Metadata = {
  title: "Close Mint Accounts (Token2022) - Claim Your SOLs",
  description:
    "Close Token2022 mint accounts you created and recover their rent deposits. Automatically burns remaining tokens if only from close authority account.",
  keywords:
    "Token2022, close mint accounts, mint authority, SPL Token 2022, rent recovery, token mint cleanup, Solana mint accounts",
  openGraph: {
    title: "Close Mint Accounts (Token2022) - Claim Your SOLs",
    description:
      "Close Token2022 mint accounts you created and recover their rent deposits. Automatically burns remaining tokens if only from close authority account.",
    url: "https://claimyoursols.app/close-mint-accounts/",
  },
  twitter: {
    title: "Close Mint Accounts (Token2022) - Claim Your SOLs",
    description:
      "Close Token2022 mint accounts you created and recover their rent deposits. Automatically burns remaining tokens if only from close authority account.",
  },
  alternates: {
    canonical: "https://claimyoursols.app/close-mint-accounts/",
  },
};

export default function CloseMintAccountsPage() {
  return <CloseMintContent />;
}
