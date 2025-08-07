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
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/bulk-sender-high-resolution-logo-black-transparent.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/bulk-sender-high-resolution-logo-black-transparent.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="msapplication-TileColor" content="#8B5CF6" />
        <meta name="application-name" content="ClaimYourSols" />
        <meta name="apple-mobile-web-app-title" content="ClaimYourSols" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@ClaimYourSols" />
        <meta name="twitter:creator" content="@ClaimYourSols" />
        <meta name="twitter:title" content="ClaimYourSols - Token Bulk Sender for Solana" />
        <meta name="twitter:description" content="Token Bulk Sender for Solana. Send SOL, SPL tokens, and NFTs to multiple addresses instantly." />
        <meta name="twitter:image" content="https://ClaimYourSols.app/bulk-sender-high-resolution-logo-black-transparent.png" />
        <meta name="twitter:image:alt" content="ClaimYourSols - Claim Your Sols for Solana" />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ClaimYourSols.app" />
        <meta property="og:title" content="ClaimYourSols - Token Bulk Sender for Solana" />
        <meta property="og:description" content="Token Bulk Sender for Solana. Send SOL, SPL tokens, and NFTs to multiple addresses instantly." />
        <meta property="og:image" content="https://ClaimYourSols.app/bulk-sender-high-resolution-logo-black-transparent.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="ClaimYourSols - Claim Your Sols for Solana" />
        <meta property="og:site_name" content="ClaimYourSols" />
        <meta property="og:locale" content="en_US" />
        <style>
          {`
          @keyframes zoomInOut {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
          }

          .zoom-animation {
            animation: zoomInOut 2s infinite;
          }
          `}
        </style>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "ClaimYourSols",
              "description": "Token Bulk Sender for Solana. Send SOL, SPL tokens, and NFTs to multiple addresses instantly.",
              "url": "https://ClaimYourSols.app",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "ClaimYourSols",
                "url": "https://ClaimYourSols.app"
              },
              "provider": {
                "@type": "Organization",
                "name": "ClaimYourSols",
                "url": "https://ClaimYourSols.app"
              }
            })
          }}
        />
      </head>
      <body className={`bg-white text-gray-900 ${inter.className}`}>
        <Toaster position="bottom-center" />
        <Providers>
          <AppWalletProvider>
            <XHeader />
            <main className="max-w-7xl mx-auto">{children}</main>
            <XFooter />
          </AppWalletProvider>
        </Providers>
      </body>
      <GoogleAnalytics gaId="G-61PRS7GVGN" />
    </html>
  );
}
