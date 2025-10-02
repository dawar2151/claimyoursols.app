import React from "react";
import type { Metadata } from "next";
import CloseMintContent from "../components/pages/CloseMintContent";

export const metadata: Metadata = {
  title: "Claim SOL from Useless Tokens",
  description:
    "Safely close Token2022 mint accounts you created and recover rent deposits (0.0048 SOL per account). Automatically burns remaining tokens if only from the close authority account.",
  keywords:
    "Token2022, close mint accounts, mint authority, SPL Token 2022, rent recovery, token mint cleanup, Solana mint accounts",
  openGraph: {
    title: "Close Mint Accounts (Token2022) | Claim Your SOLs",
    description:
      "Safely close Token2022 mint accounts you created and recover rent deposits (0.0048 SOL per account). Automatically burns remaining tokens if only from the close authority account.",
    url: "https://claimyoursols.app/close-mint-accounts",
    images: [
      {
        url: "https://claimyoursols.app/close-mint-account.png",
        width: 1200,
        height: 630,
        alt: "Close Mint Accounts (Token2022)",
      },
    ],
  },
  twitter: {
    title: "Close Mint Accounts (Token2022) | Claim Your SOLs",
    description:
      "Safely close Token2022 mint accounts you created and recover rent deposits (0.0048 SOL per account). Automatically burns remaining tokens if only from the close authority account.",
    card: "summary_large_image",
    images: ["https://claimyoursols.app/close-mint-account.png"],
  },
  alternates: {
    canonical: "https://claimyoursols.app/close-mint-accounts",
  },
};

export default function CloseMintAccountsPage() {
  return (
    <>
      {/* Hidden H1 for SEO */}
      <h1 className="sr-only">Close Mint Accounts (Token2022)</h1>
      <CloseMintContent />
      {/* Hidden Meta Description for SEO */}
      <p className="sr-only">
        Close Token2022 mint accounts you created and recover their rent
        deposits. Automatically burns remaining tokens if only from close
        authority account.
      </p>
    </>
  );
}
