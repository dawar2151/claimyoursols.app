import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Providers from "@/app/providers";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Toaster } from "react-hot-toast";
import { XFooter } from "@/app/components/x-components/Xfooter";
import { XHeader } from "@/app/components/x-components/XHeader";
import AppWalletProvider from "./components/x-components/AppWalletProvider";
import { colors } from "./utils/colors";
import ReferralMessage from "./components/claimyoursol/ReferralMessage";
import StatsCards from "./components/claimyoursol/StatsCards";
import ShowIfDisconnected from "./components/claimyoursol/ShowIfDisconnected";
import SolanaTools from "./components/claimyoursol/SolanaTools";
import Referral from "./components/claimyoursol/Referal";
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
                    <div className="text-center mb-6">
                      <h2
                        className="text-3xl font-bold mb-1"
                        style={{ color: colors.text.primary }}
                      >
                        Solana Blockchain holds your SOL
                      </h2>
                      <h3
                        className="text-3xl font-bold mb-3"
                        style={{
                          background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        Claim it Back!
                      </h3>

                      <a
                        href="#faq-section"
                        className="text-sm font-medium inline-block mb-3"
                        style={{ color: colors.primary }}
                      >
                        How it works?
                      </a>

                      <p
                        className="max-w-2xl mx-auto text-base mb-3"
                        style={{ color: colors.text.secondary }}
                      >
                        <span className="block">Close zero-balance accounts — recover ~0.002 SOL per account.</span>
                        <span className="block">Burn unwanted tokens — reclaim ~0.002 SOL per token.</span>
                      </p>
                    </div>

                    {/* Wallet Button */}
                    <WalletSection />
                    <ShowIfDisconnected>
                      <StatsCards />
                    </ShowIfDisconnected>
                    {/* Main page content */}
                    {children}
                    <TransactionHistory />
                    {/* FAQ Section */}
                    <FAQSection />

                    <SolanaTools />

                    {/* Referral Section */}
                    <div className="my-4">
                      <Referral />
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
