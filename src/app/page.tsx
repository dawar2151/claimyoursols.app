import React from "react";
import type { Metadata } from "next";
import HomeContent from "./components/pages/HomeContent";

export const metadata: Metadata = {
  title: "Close Empty Token Accounts",
  description:
    "Close unused SPL token accounts with zero balance and recover rent deposits (0.00204 SOL per account). Safe and simple - only affects empty accounts.",
  keywords:
    "close token accounts, recover SOL rent, empty SPL tokens, Solana account cleaner, token account management, SOL recovery, blockchain cleanup",
  openGraph: {
    title: "Close Empty Token Accounts - Claim Your SOLs",
    description:
      "Close unused SPL token accounts with zero balance and recover rent deposits. Safe and simple - only affects empty accounts.",
    url: "https://www.claimyoursols.app/",
    images: [
      {
        url: "https://www.claimyoursols.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Close Empty Token Accounts - Claim Your SOLs",
      },
    ],
  },
  twitter: {
    title: "Close Empty Token Accounts - Claim Your SOLs",
    description:
      "Close unused SPL token accounts with zero balance and recover rent deposits. Safe and simple - only affects empty accounts.",
    card: "summary_large_image", // Ensures the large image card format is used
    images: ["https://www.claimyoursols.app/og-image.png"], // Use the same image as Open Graph
  },
  alternates: {
    canonical: "https://www.claimyoursols.app/",
  },
};

export default function Home() {
  return (
    <>
      {/* Hidden H1 for SEO */}
      <h1 className="sr-only">Close Empty Token Accounts - Claim Your SOLs</h1>

      {/* Hidden Meta Description for SEO */}
      <p className="sr-only">
        Close unused SPL token accounts with zero balance and recover rent
        deposits (0.00204 SOL per account). Safe and simple - only affects empty
        accounts.
      </p>

      {/* Main Content */}
      <HomeContent />
    </>
  );
}