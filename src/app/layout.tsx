import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Providers from "@/app/providers";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Toaster } from "react-hot-toast";
import { XFooter } from "@/app/components/x-components/Xfooter";
import { XHeader } from "@/app/components/x-components/XHeader";
import AppWalletProvider from "./components/x-components/AppWalletProvider";
import Image from "next/image";
import { colors } from "./utils/colors";
import ReferralMessage from "./components/claimyoursol/ReferralMessage";
import SolanaTools from "./components/claimyoursol/SolanaTools";
import Referral from "./components/claimyoursol/Referal";
import GitHubButton from "./components/claimyoursol/GithubButton";
import AnimatedPage from "./utils/AnimatedPage";
import WalletSection from "./components/wallet/WalletSection";
import FAQSection from "./components/claimyoursol/FAQSection";
import TransactionHistory from "./components/transaction-history/TransactionHistory";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Claim Your SOLs - Recover SOL from Token Accounts",
    template: "%s | SOL Recovery",
  },
  description:
    "Close unused SPL token accounts and reclaim your SOL rent fees safely and securely. Recover locked SOL from inactive token accounts on Solana blockchain.",
  keywords:
    "Solana, SOL, token accounts, rent recovery, blockchain, cryptocurrency, SPL tokens, account cleaner, récupération SOL, comptes jetons, blockchain Solana, cryptomonnaie, nettoyeur comptes, fermer comptes SPL, récupérer SOL, frais location, portefeuille Solana, DeFi, Web3",
  authors: [{ name: "Claim Your SOLs" }],
  creator: "Claim Your SOLs",
  publisher: "Claim Your SOLs",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://claimyoursols.app",
    title: "Claim Your SOLs | Récupérer vos SOL",
    description:
      "Close unused SPL token accounts and reclaim your SOL rent fees safely and securely on Solana blockchain. Fermez les comptes de jetons SPL inutilisés et récupérez vos frais de location SOL.",
    siteName: "Claim Your SOLs",
    images: [
      {
        url: "https://claimyoursols.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Claim Your SOLs - Reclaim Your SOL | Récupérer vos SOL",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claim Your SOLs | Récupérer vos SOL",
    description:
      "Close unused SPL token accounts and reclaim your SOL rent fees safely and securely. Fermez les comptes de jetons SPL inutilisés.",
    images: ["https://claimyoursols.app/og-image.png"],
    creator: "@claimsols",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        url: "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#9945FF" },
    { media: "(prefers-color-scheme: dark)", color: "#9945FF" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://claimyoursols.app/",
    languages: {
      "en-US": "https://claimyoursols.app/",
      en: "https://claimyoursols.app/",
      "fr-FR": "https://claimyoursols.app/",
      fr: "https://claimyoursols.app/",
    },
  },
  metadataBase: new URL("https://claimyoursols.app"),
  category: "technology",
  classification: "Finance Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Claim Your SOLs",
    alternateName: "Nettoyeur de Comptes Solana",
    description:
      "Close unused SPL token accounts and reclaim your SOL rent fees safely and securely on Solana blockchain.",
    url: "https://claimyoursols.app",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web Browser",
    inLanguage: ["en", "fr"],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: "Claim Your SOLs",
    },
    keywords: [
      "Solana",
      "SOL",
      "Token Accounts",
      "Rent Recovery",
      "Blockchain",
      "Cryptocurrency",
      "récupération SOL",
      "comptes jetons",
      "blockchain Solana",
      "cryptomonnaie",
      "nettoyeur comptes",
      "fermer comptes SPL",
      "DeFi",
      "Web3",
      "SPL tokens",
    ],
    screenshot: "https://claimyoursols.app/og-image.png",
  };

  return (
    <html lang="en">
      <head>
        <meta name="yandex-verification" content="84076f13b59011db" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
          integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />

        {/* Structured Data JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="/Dc1fonqZVBe9hCEuAiUfg"
          async
        ></script>
      </head>
      <body
        className={`bg-white text-gray-900 ${inter.className} flex flex-col min-h-screen`}
      >
        <Toaster position="bottom-center" />
        <Providers>
          <AppWalletProvider>
            <XHeader />
            <main className="flex-1">
              <AnimatedPage>
                <div className="w-full max-w-4xl mx-auto">
                  <ReferralMessage />

                  <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="text-center mb-8">
                      {/* Logo */}
                      <div className="flex justify-center mb-6">
                        <div className="relative w-20 h-20 animate-pulse">
                          <Image
                            src="/logo.png"
                            alt="Claim Your SOLs Logo"
                            width={80}
                            height={80}
                            className="w-full h-full object-contain rounded-full shadow-lg"
                            priority
                          />
                        </div>
                      </div>

                      <h2
                        className="text-4xl font-bold mb-2"
                        style={{ color: colors.text.primary }}
                      >
                        Solana Blockchain holds your SOL
                      </h2>
                      <h3
                        className="text-5xl font-bold mb-4"
                        style={{
                          background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        Claim it Back!
                      </h3>

                      <p
                        className="max-w-2xl mx-auto text-lg mb-4"
                        style={{ color: colors.text.secondary }}
                      >
                        The Solana Blockchain charges rent for unused SPL token
                        accounts, even after you&apos;ve sold your tokens. Close
                        those unused token accounts and Claim your sol rent fees
                        safely and securely.
                      </p>
                    </div>

                    {/* Wallet Button */}
                    <WalletSection />
                    {/* Main page content */}
                    {children}
                    <TransactionHistory />
                    {/* Use Cases Cards */}
                    <section className="py-8">
                      <div className="grid md:grid-cols-3 gap-6 p-6">
                        {/* Close Accounts Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center hover:shadow-md transition-shadow">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Close Zero-Balance Accounts
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Close empty token accounts and reclaim the rent
                            deposit (0.00204 SOL per account). Safe, simple, and
                            only targets accounts with zero balance.
                          </p>
                        </div>

                        {/* Burn & Close Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center hover:shadow-md transition-shadow">
                          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-current"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 8c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2s2-.9 2-2v-4c0-1.1-.9-2-2-2zm0-6C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Burn Tokens & Close Accounts
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Burn unwanted tokens and close their accounts in one
                            step. Perfect for removing dust tokens, scam tokens,
                            or tokens you no longer want (0.00204 SOL per
                            account)
                          </p>
                        </div>

                        {/* Close Mint Accounts Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center hover:shadow-md transition-shadow">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Close Mint Accounts (Token2022)
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Close Token2022 mint accounts you created and
                            recover their rent deposits (0.0048 SOL per
                            account). Automatically burns remaining tokens if
                            only from the close authority account.
                          </p>
                        </div>
                      </div>
                    </section>
                    {/* FAQ Section */}
                    <FAQSection />

                    <SolanaTools />

                    {/* Referral Section */}
                    <div>
                      <Referral />
                    </div>

                    <div
                      className="w-full mx-auto p-4 rounded-lg border mb-8 text-center"
                      style={{
                        backgroundColor: `${colors.background.light}/10`,
                        borderColor: `${colors.border}/50`,
                      }}
                    >
                      <div className="flex items-center justify-center gap-3 mb-2">
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          style={{ color: colors.primary }}
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        <h3
                          className="text-lg font-semibold"
                          style={{ color: colors.text.primary }}
                        >
                          Open Source & Transparent
                        </h3>
                      </div>
                      <p
                        className="text-sm mb-3"
                        style={{ color: colors.text.secondary }}
                      >
                        This tool is completely open source. You can review the
                        code, contribute, or run it yourself.
                      </p>
                      <div className="flex justify-center">
                        <GitHubButton />
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedPage>
            </main>
            <XFooter />
          </AppWalletProvider>
        </Providers>
        <GoogleAnalytics gaId="G-61PRS7GVGN" />
      </body>
    </html>
  );
}
