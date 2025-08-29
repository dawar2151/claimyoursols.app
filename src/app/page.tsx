import React from "react";
import type { Metadata } from "next";
import HomeContent from "./components/pages/HomeContent";

export const metadata: Metadata = {
  title: "Close Empty Token Accounts - Claim Your SOLs",
  description:
    "Close unused SPL token accounts with zero balance and recover rent deposits (0.00204 SOL per account). Safe and simple - only affects empty accounts.",
  keywords:
    "close token accounts, recover SOL rent, empty SPL tokens, Solana account cleaner, token account management, SOL recovery, blockchain cleanup",
  openGraph: {
    title: "Close Empty Token Accounts - Claim Your SOLs",
    description:
      "Close unused SPL token accounts with zero balance and recover rent deposits. Safe and simple - only affects empty accounts.",
    url: "https://claimyoursols.app/",
  },
  twitter: {
    title: "Close Empty Token Accounts - Claim Your SOLs",
    description:
      "Close unused SPL token accounts with zero balance and recover rent deposits. Safe and simple - only affects empty accounts.",
  },
  alternates: {
    canonical: "https://claimyoursols.app/",
  },
};

export default function Home() {
  return <HomeContent />;
}
