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
    default: "ClaimYourSols - Reclaim Your SOL from Empty Token Accounts",
    template: "%s | ClaimYourSols",
  },
  description:
    "Reclaim locked SOL from empty token accounts on Solana. Burn worthless tokens, close empty accounts, and recover your rent deposits instantly.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
      { url: "/apple-touch-icon-152x152.png", sizes: "152x152" },
      { url: "/apple-touch-icon-144x144.png", sizes: "144x144" },
    ],
  },
  keywords: [
    "Claim Your Sols",
    "solana account cleaner",
    "recover SOL rent",
    "close token accounts",
    "burn tokens",
    "solana rent recovery",
    "empty account cleanup",
    "solana defi tools",
    "token account manager",
    "SOL recovery tool",
    "phantom dapp",
    "solana web3",
    "blockchain cleanup",
    "crypto account management",
    "solana utility tool",
  ].join(", "),
  authors: [{ name: "ClaimYourSols Team" }],
  creator: "ClaimYourSols",
  publisher: "ClaimYourSols",
  applicationName: "ClaimYourSols",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://claimyoursols.app"),
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "ClaimYourSols",
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://claimyoursols.app",
    siteName: "ClaimYourSols",
    title: "ClaimYourSols - Reclaim Your SOL from Empty Token Accounts",
    description:
      "Reclaim locked SOL from empty token accounts on Solana. Burn worthless tokens, close empty accounts, and recover your rent deposits instantly.",
    images: [
      {
        url: "https://claimyoursols.app/bulk-sender-high-resolution-logo-black-transparent.png",
        width: 1200,
        height: 630,
        alt: "ClaimYourSols - Reclaim Your SOL",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ClaimSols",
    creator: "@TheBlockExperts",
    title: "ClaimYourSols - Reclaim Your SOL from Empty Token Accounts",
    description:
      "Reclaim locked SOL from empty token accounts on Solana. Burn worthless tokens, close empty accounts, and recover your rent deposits instantly.",
    images: [
      {
        url: "https://claimyoursols.app/bulk-sender-high-resolution-logo-black-transparent.png",
        alt: "ClaimYourSols - Reclaim Your SOL from Solana Accounts",
        width: 1200,
        height: 630,
      },
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
  classification: "DeFi Tools",
  other: {
    "theme-color": "#9945FF",
    "color-scheme": "light",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "ClaimYourSols",
    "application-name": "ClaimYourSols",
    "msapplication-TileColor": "#9945FF",
    "msapplication-config": "/browserconfig.xml",
    "mobile-web-app-capable": "yes",
    // Phantom-specific metadata
    "dapp-name": "ClaimYourSols",
    "dapp-description": "Reclaim locked SOL from empty token accounts",
    "dapp-category": "DeFi",
    blockchain: "solana",
    "solana-dapp": "true",
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
        {/* Phantom-specific meta tags */}
        <meta name="dapp-name" content="ClaimYourSols" />
        <meta
          name="dapp-description"
          content="Reclaim locked SOL from empty token accounts on Solana"
        />
        <meta name="dapp-url" content="https://claimyoursols.app" />
        <meta name="dapp-category" content="DeFi" />
        <meta name="blockchain" content="solana" />
        <meta name="solana-dapp" content="true" />

        {/* Additional SEO and discoverability */}
        <meta
          name="keywords"
          content="solana, defi, phantom, dapp, SOL recovery, token cleanup, blockchain tools"
        />
        <meta name="rating" content="general" />
        <meta name="referrer" content="origin-when-cross-origin" />

        {/* Structured data for search engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "ClaimYourSols",
              description:
                "Reclaim locked SOL from empty token accounts on Solana",
              url: "https://claimyoursols.app",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Organization",
                name: "ClaimYourSols Team",
              },
            }),
          }}
        />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
          integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body
        className={`bg-white text-gray-900 ${inter.className} flex flex-col min-h-screen`}
      >
        <Toaster position="bottom-center" />
        <Providers>
          <AppWalletProvider>
            <XHeader />
            <main className="flex-1">{children}</main>
            <XFooter />
          </AppWalletProvider>
        </Providers>
        <GoogleAnalytics gaId="G-61PRS7GVGN" />
      </body>
    </html>
  );
}
