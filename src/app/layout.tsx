import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Providers from "@/app/providers";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Toaster } from "react-hot-toast";
import { XFooter } from "@/app/components/x-components/Xfooter";
import { XHeader } from "@/app/components/x-components/XHeader";
import AppWalletProvider from "./components/x-components/AppWalletProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ClaimYourSols - Token Bulk Sender for Solana",
    template: "%s | ClaimYourSols"
  },
  description: "Token Bulk Sender for Solana. Send SOL, SPL tokens, and NFTs to multiple addresses instantly.",
  keywords: [
    "Claim Your Sols",
    "solana token sender",
    "spl token sender",
    "crypto airdrop tool",
    "token distribution",
    "blockchain token sender",
    "defi tools",
    "cryptocurrency bulk sender",
    "token transfer tool",
    "smart contract token sender",
    "web3 token sender",
    "spl token sender",
    "solana bulk sender",
    "solana airdrop",
    "spl token distribution"
  ].join(", "),
  authors: [{ name: "ClaimYourSols Team" }],
  creator: "ClaimYourSols",
  publisher: "ClaimYourSols",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ClaimYourSols.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ClaimYourSols.app",
    siteName: "ClaimYourSols",
    title: "ClaimYourSols - Token Bulk Sender for Solana",
    description: "Token Bulk Sender for Solana. Send SOL, SPL tokens, and NFTs to multiple addresses instantly.",
    images: [
      {
        url: "https://ClaimYourSols.app/bulk-sender-high-resolution-logo-black-transparent.png",
        width: 1200,
        height: 630,
        alt: "ClaimYourSols - Claim Your Sols",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ClaimYourSols",
    creator: "@ClaimYourSols",
    title: "ClaimYourSols - Token Bulk Sender for Solana",
    description: "Token Bulk Sender for Solana. Send SOL, SPL tokens, and NFTs to multiple addresses instantly.",
    images: [
      {
        url: "https://ClaimYourSols.app/bulk-sender-high-resolution-logo-black-transparent.png",
        alt: "ClaimYourSols - Claim Your Sols for Solana",
        width: 1200,
        height: 630,
      }
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "11d1ca91bd30cbbd",
    yahoo: "your-yahoo-verification-code",
  },
  category: "technology",
  classification: "Web3 Tools",
  other: {
    "theme-color": "#8B5CF6",
    "color-scheme": "light dark",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "ClaimYourSols",
    "application-name": "ClaimYourSols",
    "msapplication-TileColor": "#8B5CF6",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
          integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`bg-white text-gray-900 ${inter.className} flex flex-col min-h-screen`}>
        <Toaster position="bottom-center" />
        <Providers>
          <AppWalletProvider>
            <XHeader />
            <main className="flex-1">
              {children}</main>
            <XFooter />
          </AppWalletProvider>
        </Providers>
      </body>
      <GoogleAnalytics gaId="G-61PRS7GVGN" />
    </html>
  );
}
